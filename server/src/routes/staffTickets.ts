import { Router, Response } from "express";
import { getPrisma } from "../prisma.js";
import {
  authenticateToken,
  requireRoles,
  enforcePasswordChange,
  AuthenticatedRequest,
} from "../middleware/authMiddleware.js";

export const staffTicketsRouter = Router();

// ---------------------------------------------------------------------------
// Permitted Ticket Status Transitions Matrix (BR-06, FR-07, AC-06)
// ---------------------------------------------------------------------------
export const PERMITTED_STATUS_TRANSITIONS: Record<string, string[]> = {
  NEW: ["OPEN", "IN_PROGRESS", "CANCELLED"],
  OPEN: ["IN_PROGRESS", "WAITING_FOR_REQUESTER", "CANCELLED"],
  IN_PROGRESS: ["WAITING_FOR_REQUESTER", "RESOLVED", "CANCELLED"],
  WAITING_FOR_REQUESTER: ["IN_PROGRESS", "RESOLVED", "CANCELLED"],
  RESOLVED: ["CLOSED", "REOPENED"],
  REOPENED: ["IN_PROGRESS", "WAITING_FOR_REQUESTER", "RESOLVED", "CANCELLED"],
  CLOSED: ["REOPENED"],
  CANCELLED: [],
};

const VALID_IT_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const VALID_STATUSES = Object.keys(PERMITTED_STATUS_TRANSITIONS);

// ---------------------------------------------------------------------------
// 1. GET /api/staff/tickets (IT Staff Ticket Queue)
// ---------------------------------------------------------------------------
staffTicketsRouter.get(
  "/staff/tickets",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const search = (req.query.search as string) || "";
      const category = (req.query.category as string) || "";
      const priority = (req.query.priority as string) || "";
      const status = (req.query.status as string) || "";
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as string)?.toLowerCase() === "asc" ? "asc" : "desc";
      const myQueue = req.query.myQueue === "true";

      const whereClause: any = {};

      if (myQueue) {
        whereClause.ownerId = req.user!.id;
      }

      if (search.trim()) {
        whereClause.OR = [
          { ticketNo: { contains: search.trim(), mode: "insensitive" } },
          { summary: { contains: search.trim(), mode: "insensitive" } },
          { description: { contains: search.trim(), mode: "insensitive" } },
        ];
      }

      if (category && category !== "ALL") {
        const catId = parseInt(category, 10);
        if (!isNaN(catId)) {
          whereClause.categoryId = catId;
        } else {
          whereClause.category = { name: { equals: category, mode: "insensitive" } };
        }
      }

      if (priority && priority !== "ALL") {
        whereClause.OR = [
          { requestedPriority: priority },
          { itPriority: priority },
        ];
      }

      if (status && status !== "ALL") {
        whereClause.status = status;
      }

      const totalItems = await prisma.ticket.count({ where: whereClause });
      const tickets = await prisma.ticket.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          requester: { select: { id: true, name: true, email: true, department: true } },
          owner: { select: { id: true, name: true, email: true, role: true } },
          category: true,
          relatedSystem: true,
          attachments: true,
        },
      });

      res.status(200).json({
        success: true,
        data: tickets,
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit) || 1,
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      console.error("Fetch Staff Tickets Queue Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to fetch IT staff ticket queue" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 2. GET /api/staff/tickets/:id (Single Ticket Detail for IT Staff)
// ---------------------------------------------------------------------------
staffTicketsRouter.get(
  "/staff/tickets/:id",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const ticketId = parseInt(req.params.id, 10);

      if (isNaN(ticketId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid ticket ID" },
        });
        return;
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
          requester: { select: { id: true, name: true, email: true, department: true } },
          owner: { select: { id: true, name: true, email: true, role: true } },
          category: true,
          relatedSystem: true,
          attachments: true,
          publicComments: {
            include: { author: { select: { id: true, name: true, email: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
          internalNotes: {
            include: { author: { select: { id: true, name: true, email: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
          actionsTaken: {
            include: { performer: { select: { id: true, name: true, email: true, role: true } } },
            orderBy: { actionDateTime: "desc" },
          },
        },
      });

      if (!ticket) {
        res.status(404).json({
          success: false,
          error: { message: "Ticket not found" },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      console.error("Fetch Staff Ticket Detail Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to fetch ticket detail" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 3. PATCH /api/staff/tickets/:id/assign (Claim or Reassign Ticket Owner)
// ---------------------------------------------------------------------------
staffTicketsRouter.patch(
  "/staff/tickets/:id/assign",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const ticketId = parseInt(req.params.id, 10);

      if (isNaN(ticketId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid ticket ID" },
        });
        return;
      }

      const targetOwnerId = req.body.ownerId !== undefined ? req.body.ownerId : req.user!.id;

      if (targetOwnerId !== null) {
        const ownerUser = await prisma.user.findUnique({
          where: { id: targetOwnerId },
        });

        if (!ownerUser || !ownerUser.isActive || ownerUser.role === "REQUESTER") {
          res.status(400).json({
            success: false,
            error: { message: "Owner ID must belong to an active IT Staff or Administrator account" },
          });
          return;
        }
      }

      const updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          ownerId: targetOwnerId,
          status: "IN_PROGRESS",
        },
        include: {
          owner: { select: { id: true, name: true, email: true, role: true } },
        },
      });

      res.status(200).json({
        success: true,
        data: updatedTicket,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: { message: "Ticket not found" },
        });
        return;
      }
      console.error("Assign Ticket Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to assign ticket" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 4. PATCH /api/staff/tickets/:id/workflow (Update IT Priority & Ticket Status)
//    Enforces Transition Matrix (BR-06), Resolution Gate (BR-07), and
//    Optimistic Concurrency Control (BR-08, 409 Conflict)
// ---------------------------------------------------------------------------
staffTicketsRouter.patch(
  "/staff/tickets/:id/workflow",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const ticketId = parseInt(req.params.id, 10);
      const { itPriority, status, expectedUpdatedAt, lastUpdatedAt } = req.body;

      if (isNaN(ticketId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid ticket ID" },
        });
        return;
      }

      if (!req.user!.isActive) {
        res.status(400).json({
          success: false,
          error: { message: "Inactive user account cannot update ticket workflow" },
        });
        return;
      }

      const existingTicket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!existingTicket) {
        res.status(404).json({
          success: false,
          error: { message: "Ticket not found" },
        });
        return;
      }

      // Optimistic Concurrency Check (BR-08, FR-09, AC-08)
      const clientTimestamp = expectedUpdatedAt || lastUpdatedAt;
      if (clientTimestamp !== undefined && clientTimestamp !== null) {
        const clientTime = new Date(clientTimestamp).getTime();
        const serverTime = existingTicket.updatedAt.getTime();
        if (isNaN(clientTime) || Math.abs(clientTime - serverTime) > 1000) {
          res.status(409).json({
            success: false,
            error: "Conflict",
            message:
              "The ticket was modified by another user since you loaded it. Please refresh and try again.",
            currentTicket: {
              id: existingTicket.id,
              ticketNo: existingTicket.ticketNo,
              status: existingTicket.status,
              itPriority: existingTicket.itPriority,
              updatedAt: existingTicket.updatedAt,
            },
          });
          return;
        }
      }

      const updateData: any = {};

      if (itPriority !== undefined) {
        if (!VALID_IT_PRIORITIES.includes(itPriority)) {
          res.status(400).json({
            success: false,
            error: { message: `Invalid IT Priority: ${itPriority}` },
          });
          return;
        }
        updateData.itPriority = itPriority;
      }

      if (status !== undefined) {
        if (!VALID_STATUSES.includes(status)) {
          res.status(400).json({
            success: false,
            error: { message: `Invalid ticket status: ${status}` },
          });
          return;
        }

        // State Transition Matrix Enforcement (BR-06, FR-07, AC-06)
        if (status !== existingTicket.status) {
          const allowedTargets = PERMITTED_STATUS_TRANSITIONS[existingTicket.status] || [];
          if (!allowedTargets.includes(status)) {
            res.status(400).json({
              success: false,
              error: {
                message: `Disallowed status transition from ${existingTicket.status} to ${status}`,
              },
            });
            return;
          }
        }

        updateData.status = status;
      }

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          error: { message: "At least one field (itPriority or status) must be provided" },
        });
        return;
      }

      const updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: updateData,
        include: {
          category: true,
          relatedSystem: true,
          owner: { select: { id: true, name: true, email: true, role: true } },
          actionsTaken: {
            include: { performer: { select: { id: true, name: true, email: true, role: true } } },
            orderBy: { actionDateTime: "desc" },
          },
        },
      });

      res.status(200).json({
        success: true,
        data: updatedTicket,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        res.status(404).json({
          success: false,
          error: { message: "Ticket not found" },
        });
        return;
      }
      console.error("Update Ticket Workflow Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to update ticket workflow" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 5. GET /api/tickets/:id/notes (List Internal Notes - IT Staff/Admin ONLY)
// ---------------------------------------------------------------------------
staffTicketsRouter.get(
  "/tickets/:id/notes",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const ticketId = parseInt(req.params.id, 10);

      if (isNaN(ticketId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid ticket ID" },
        });
        return;
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        res.status(404).json({
          success: false,
          error: { message: "Ticket not found" },
        });
        return;
      }

      const notes = await prisma.internalNote.findMany({
        where: { ticketId },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, email: true, role: true } },
        },
      });

      res.status(200).json({
        success: true,
        data: notes,
      });
    } catch (error) {
      console.error("Fetch Internal Notes Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to fetch internal notes" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 6. POST /api/tickets/:id/notes (Create Internal Note - IT Staff/Admin ONLY)
// ---------------------------------------------------------------------------
staffTicketsRouter.post(
  "/tickets/:id/notes",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const ticketId = parseInt(req.params.id, 10);
      const { content } = req.body;

      if (isNaN(ticketId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid ticket ID" },
        });
        return;
      }

      if (!content || typeof content !== "string" || content.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: { message: "Internal note content cannot be empty" },
        });
        return;
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        res.status(404).json({
          success: false,
          error: { message: "Ticket not found" },
        });
        return;
      }

      const newNote = await prisma.internalNote.create({
        data: {
          ticketId,
          authorId: req.user!.id,
          content: content.trim(),
        },
        include: {
          author: { select: { id: true, name: true, email: true, role: true } },
        },
      });

      res.status(201).json({
        success: true,
        data: newNote,
      });
    } catch (error) {
      console.error("Create Internal Note Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to create internal note" },
      });
    }
  }
);
