import {
  RequesterUser,
  Category,
  RelatedSystem,
  Ticket,
  Attachment,
  TicketListResponse,
} from "./types.js";

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


