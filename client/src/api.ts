import {
  RequesterUser,
  Category,
  RelatedSystem,
  Ticket,
  Attachment,
  ActionTaken,
  TicketListResponse,
  User,
  AuthResponse,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Re-export Category interface for backwards compatibility with Lab 1
export type { Category };

export interface SystemStatus {
  online: boolean;
  categories: Category[];
}

export async function checkSystem(): Promise<SystemStatus> {
  const healthRes = await fetch(`${API_URL}/api/health`).catch(() => {
    throw new Error("Unable to connect to TokTickIT API");
  });

  if (!healthRes.ok) {
    throw new Error("Unable to connect to TokTickIT API");
  }

  const catRes = await fetch(`${API_URL}/api/categories`).catch(() => {
    throw new Error("Unable to connect to TokTickIT API");
  });

  if (!catRes.ok) {
    throw new Error("Unable to connect to TokTickIT API");
  }

  const rawData = await catRes.json();
  const categories: Category[] = Array.isArray(rawData) ? rawData : rawData.data;
  return { online: true, categories };
}

// ---------------------------------------------------------------------------
// Auth API Client Functions
// ---------------------------------------------------------------------------

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || "Invalid credentials or deactivated account");
  }
  return json;
}

export async function changePasswordApi(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_URL}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || "Failed to change password");
  }
  return json;
}

export async function getMeApi(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error?.message || "Failed to fetch user session");
  }
  return json.user;
}

export async function logoutApi(token: string): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => {});
}

// ---------------------------------------------------------------------------
// Lab 2 API Client Functions
// ---------------------------------------------------------------------------

export async function fetchRequesters(): Promise<RequesterUser[]> {
  const res = await fetch(`${API_URL}/api/requesters`);
  if (!res.ok) throw new Error("Failed to load Development Requesters");
  const json = await res.json();
  return json.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories`);
  if (!res.ok) throw new Error("Failed to load Ticket Categories");
  const json = await res.json();
  return Array.isArray(json) ? json : json.data;
}

export async function fetchRelatedSystems(): Promise<RelatedSystem[]> {
  const res = await fetch(`${API_URL}/api/related-systems`);
  if (!res.ok) throw new Error("Failed to load Related Systems");
  const json = await res.json();
  return json.data;
}

export async function createTicket(
  requesterId: number,
  formData: FormData
): Promise<Ticket> {
  const res = await fetch(`${API_URL}/api/tickets`, {
    method: "POST",
    headers: {
      "x-requester-id": requesterId.toString(),
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    const errorMsg = json.error?.message || "Failed to create ticket";
    const details = json.error?.details;
    const error = new Error(errorMsg) as Error & { details?: Record<string, string[]> };
    error.details = details;
    throw error;
  }
  return json.data;
}

export async function fetchTickets(
  requesterId: number,
  params: {
    search?: string;
    category?: string;
    priority?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<TicketListResponse> {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.category && params.category !== "ALL") query.append("category", params.category);
  if (params.priority && params.priority !== "ALL") query.append("priority", params.priority);
  if (params.status && params.status !== "ALL") query.append("status", params.status);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.sortOrder) query.append("sortOrder", params.sortOrder);

  const res = await fetch(`${API_URL}/api/tickets?${query.toString()}`, {
    headers: {
      "x-requester-id": requesterId.toString(),
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "Failed to fetch tickets");
  return json;
}

export async function fetchTicketDetail(
  requesterId: number,
  ticketId: number
): Promise<Ticket> {
  const res = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
    headers: {
      "x-requester-id": requesterId.toString(),
    },
  });

  const json = await res.json();
  if (!res.ok) {
    const error = new Error(json.error?.message || "Failed to fetch ticket detail");
    (error as any).status = res.status;
    (error as any).code = json.error?.code;
    throw error;
  }
  return json.data;
}

export async function uploadAttachment(
  requesterId: number,
  ticketId: number,
  file: File
): Promise<Attachment> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/tickets/${ticketId}/attachments`, {
    method: "POST",
    headers: {
      "x-requester-id": requesterId.toString(),
    },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "Failed to upload attachment");
  return json.data;
}

export async function softRemoveAttachment(
  requesterId: number,
  attachmentId: number,
  reason: string
): Promise<Attachment> {
  const res = await fetch(`${API_URL}/api/attachments/${attachmentId}`, {
    method: "DELETE",
    headers: {
      "x-requester-id": requesterId.toString(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "Failed to remove attachment");
  return json.data;
}

export function getAttachmentDownloadUrl(attachmentId: number): string {
  return `${API_URL}/api/attachments/${attachmentId}/download`;
}

// ---------------------------------------------------------------------------
// Lab 4: Actions Taken & Ticket Workflow API Client Functions
// ---------------------------------------------------------------------------

export async function fetchActionsTaken(
  token: string,
  ticketId: number
): Promise<ActionTaken[]> {
  const res = await fetch(`${API_URL}/api/tickets/${ticketId}/actions-taken`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || "Failed to load actions taken");
    (err as any).status = res.status;
    throw err;
  }
  return json.data || [];
}

export async function createActionTaken(
  token: string,
  ticketId: number,
  payload: {
    actionDateTime?: string;
    description: string;
    result: string;
    followUpRequired: boolean;
    followUpNote?: string | null;
    attachmentNotes?: string | null;
  }
): Promise<ActionTaken> {
  const res = await fetch(`${API_URL}/api/tickets/${ticketId}/actions-taken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || json.message || "Failed to record action taken");
    (err as any).status = res.status;
    throw err;
  }
  return json.data;
}

export async function updateActionTaken(
  token: string,
  ticketId: number,
  actionId: number,
  payload: {
    actionDateTime?: string;
    description?: string;
    result?: string;
    followUpRequired?: boolean;
    followUpNote?: string | null;
    attachmentNotes?: string | null;
    expectedUpdatedAt?: string;
  }
): Promise<ActionTaken> {
  const res = await fetch(`${API_URL}/api/tickets/${ticketId}/actions-taken/${actionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || json.message || "Failed to update action taken");
    (err as any).status = res.status;
    throw err;
  }
  return json.data;
}

export async function updateTicketWorkflow(
  token: string,
  ticketId: number,
  payload: {
    status?: string;
    itPriority?: string;
    ownerId?: number | null;
    expectedUpdatedAt?: string;
  }
): Promise<Ticket> {
  const res = await fetch(`${API_URL}/api/staff/tickets/${ticketId}/workflow`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(
      json.error?.message ||
        json.message ||
        "Failed to update ticket workflow"
    );
    (err as any).status = res.status;
    (err as any).currentTicket = json.currentTicket;
    throw err;
  }
  return json.data;
}

export async function indicateTicketResolved(
  token: string,
  ticketId: number,
  note?: string
): Promise<Ticket> {
  const res = await fetch(`${API_URL}/api/tickets/${ticketId}/indicate-resolved`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ note }),
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.error?.message || "Failed to indicate resolution");
    (err as any).status = res.status;
    throw err;
  }
  return json.data;
}


// ---------------------------------------------------------------------------
// Lab 4: Role Dashboards API Client Functions
// ---------------------------------------------------------------------------

export async function fetchRequesterDashboard(
  token: string
): Promise<import("./types").RequesterDashboardData> {
  const res = await fetch(`${API_URL}/api/requesters/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(
      json.error?.message || "Failed to load requester dashboard"
    );
    (err as any).status = res.status;
    throw err;
  }
  return json.data;
}

export async function fetchStaffDashboard(
  token: string
): Promise<import("./types").StaffDashboardData> {
  const res = await fetch(`${API_URL}/api/staff/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(
      json.error?.message || "Failed to load staff dashboard"
    );
    (err as any).status = res.status;
    throw err;
  }
  return json.data;
}
