export interface RequesterUser {
  id: number;
  name: string;
  email: string;
  department: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface RelatedSystem {
  id: number;
  name: string;
}

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Attachment {
  id: number;
  ticketId: number;
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  isRemoved: boolean;
  removalReason?: string | null;
  removedAt?: string | null;
  createdAt: string;
}

export interface Ticket {
  id: number;
  ticketNo: string;
  requesterId: number;
  categoryId: number;
  relatedSystemId: number;
  requestedPriority: Priority;
  status: Status;
  summary: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  relatedSystem: RelatedSystem;
  requester?: RequesterUser;
  attachments?: Attachment[];
  attachmentCount?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface TicketListResponse {
  success: boolean;
  data: Ticket[];
  meta: PaginationMeta;
}
