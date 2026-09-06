const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
export async function checkSystem() {
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
    const categories = Array.isArray(rawData) ? rawData : rawData.data;
    return { online: true, categories };
}
// ---------------------------------------------------------------------------
// Lab 2 API Client Functions
// ---------------------------------------------------------------------------
export async function fetchRequesters() {
    const res = await fetch(`${API_URL}/api/requesters`);
    if (!res.ok)
        throw new Error("Failed to load Development Requesters");
    const json = await res.json();
    return json.data;
}
export async function fetchCategories() {
    const res = await fetch(`${API_URL}/api/categories`);
    if (!res.ok)
        throw new Error("Failed to load Ticket Categories");
    const json = await res.json();
    return Array.isArray(json) ? json : json.data;
}
export async function fetchRelatedSystems() {
    const res = await fetch(`${API_URL}/api/related-systems`);
    if (!res.ok)
        throw new Error("Failed to load Related Systems");
    const json = await res.json();
    return json.data;
}
export async function createTicket(requesterId, formData) {
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
        const error = new Error(errorMsg);
        error.details = details;
        throw error;
    }
    return json.data;
}
export async function fetchTickets(requesterId, params = {}) {
    const query = new URLSearchParams();
    if (params.search)
        query.append("search", params.search);
    if (params.category && params.category !== "ALL")
        query.append("category", params.category);
    if (params.priority && params.priority !== "ALL")
        query.append("priority", params.priority);
    if (params.status && params.status !== "ALL")
        query.append("status", params.status);
    if (params.page)
        query.append("page", params.page.toString());
    if (params.limit)
        query.append("limit", params.limit.toString());
    if (params.sortBy)
        query.append("sortBy", params.sortBy);
    if (params.sortOrder)
        query.append("sortOrder", params.sortOrder);
    const res = await fetch(`${API_URL}/api/tickets?${query.toString()}`, {
        headers: {
            "x-requester-id": requesterId.toString(),
        },
    });
    const json = await res.json();
    if (!res.ok)
        throw new Error(json.error?.message || "Failed to fetch tickets");
    return json;
}
export async function fetchTicketDetail(requesterId, ticketId) {
    const res = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
        headers: {
            "x-requester-id": requesterId.toString(),
        },
    });
    const json = await res.json();
    if (!res.ok) {
        const error = new Error(json.error?.message || "Failed to fetch ticket detail");
        error.status = res.status;
        error.code = json.error?.code;
        throw error;
    }
    return json.data;
}
export async function uploadAttachment(requesterId, ticketId, file) {
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
    if (!res.ok)
        throw new Error(json.error?.message || "Failed to upload attachment");
    return json.data;
}
export async function softRemoveAttachment(requesterId, attachmentId, reason) {
    const res = await fetch(`${API_URL}/api/attachments/${attachmentId}`, {
        method: "DELETE",
        headers: {
            "x-requester-id": requesterId.toString(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok)
        throw new Error(json.error?.message || "Failed to remove attachment");
    return json.data;
}
export function getAttachmentDownloadUrl(attachmentId) {
    return `${API_URL}/api/attachments/${attachmentId}/download`;
}
