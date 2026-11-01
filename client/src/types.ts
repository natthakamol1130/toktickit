export type Role = "REQUESTER" | "IT_STAFF" | "ADMINISTRATOR";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
  isActive?: boolean;
  department?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

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
export type Status =
  | "NEW"
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_REQUESTER"
  | "WAITING_REQUESTER"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED"
  | "CANCELLED";

export const PERMITTED_STATUS_TRANSITIONS: Record<string, string[]> = {
  NEW: ["OPEN", "IN_PROGRESS"],
  OPEN: ["IN_PROGRESS", "WAITING_FOR_REQUESTER"],
  IN_PROGRESS: ["WAITING_FOR_REQUESTER", "RESOLVED"],
  WAITING_FOR_REQUESTER: ["IN_PROGRESS", "RESOLVED"],
  WAITING_REQUESTER: ["IN_PROGRESS", "RESOLVED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS", "REOPENED"],
  REOPENED: ["IN_PROGRESS", "WAITING_FOR_REQUESTER", "RESOLVED"],
  CLOSED: [],
  CANCELLED: [],
};

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

export interface ActionTaken {
  id: number;
  ticketId: number;
  performerId?: number;
  actionDateTime: string;
  description: string;
  result: string;
  followUpRequired: boolean;
  followUpNote?: string | null;
  attachmentNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  performer?: {
    id: number;
    name: string;
    email?: string;
    role?: Role;
  };
  performedBy?: {
    id: number;
    name: string;
    email?: string;
    role?: Role;
  };
}

export interface Ticket {
  id: number;
  ticketNo?: string;
  ticketNumber?: string;
  requesterId: number;
  ownerId?: number | null;
  categoryId: number;
  relatedSystemId?: number;
  requestedPriority: Priority;
  itPriority?: Priority | null;
  status: Status;
  summary: string;
  description: string;
  requesterResolvedInd?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  relatedSystem?: RelatedSystem;
  requester?: RequesterUser;
  owner?: { id: number; name: string; email?: string } | null;
  attachments?: Attachment[];
  attachmentCount?: number;
  actionsTaken?: ActionTaken[];
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


export interface RequesterDashboardMetrics {
  totalOpen: number;
  openCount?: number;
  newCount?: number;
  inProgress: number;
  inProgressCount?: number;
  waitingForRequester?: number;
  waitingOnMeCount?: number;
  resolved: number;
  resolvedCount?: number;
  closed: number;
  closedCount?: number;
}

export interface RequesterDashboardData {
  metrics: RequesterDashboardMetrics;
  recentTickets: Ticket[];
  quickActions?: { label: string; path: string }[];
}

export interface StaffDashboardMetrics {
  newTickets: number;
  newCount?: number;
  openTickets: number;
  openCount?: number;
  inProgress: number;
  inProgressCount?: number;
  waitingForRequester: number;
  waitingRequesterCount?: number;
  resolved?: number;
  resolvedCount?: number;
  closed?: number;
  closedCount?: number;
  myAssigned: number;
  myAssignedCount?: number;
  unassigned: number;
  unassignedCount?: number;
}

export interface StaffDashboardUserSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  activeRequesters: number;
  requesters?: number;
  activeStaff: number;
  staff?: number;
  activeAdmins: number;
  admins?: number;
}

export interface StaffDashboardData {
  metrics: StaffDashboardMetrics;
  byPriority?: {
    URGENT: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  priorityBreakdown?: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  recentTickets: Ticket[];
  userSummary?: StaffDashboardUserSummary;
}
