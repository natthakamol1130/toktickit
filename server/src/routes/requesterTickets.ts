import { Router, Response } from "express";
import { getPrisma } from "../prisma.js";
import {
  authenticateToken,
  requireRoles,
  enforcePasswordChange,
  AuthenticatedRequest,
} from "../middleware/authMiddleware.js";
import { PERMITTED_STATUS_TRANSITIONS } from "./staffTickets.js";

export const requesterTicketsRouter = Router();

// Sequence generator helper for Ticket Numbers: TKT-2026-XXXXXX
async function generateTicketNumber(): Promise<string> {
  const prisma = getPrisma();
  const year = new Date().getFullYear();
  const lastTicket = await prisma.ticket.findFirst({
    orderBy: { id: "desc" },
    select: { id: true },
  });
  const randomOffset = Math.floor(Math.random() * 1000);
  const nextId = ((lastTicket?.id || 0) * 10 + randomOffset + 1) % 900000 + 100000;
  return `TKT-${year}-${nextId}`;
}

// ---------------------------------------------------------------------------
// 1. GET /api/requesters/tickets
// ---------------------------------------------------------------------------
requesterTicketsRouter.get(
  "/requesters/tickets",
  authenticateToken,
  requireRoles("REQUESTER"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const requesterId = req.user!.id;

      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const search = (req.query.search as string) || "";
      const category = (req.query.category as string) || "";
      const priority = (req.query.priority as string) || "";
      const status = (req.query.status as string) || "";
      const sortBy = (req.query.sortBy as string) || "createdAt";
      const sortOrder = (req.query.sortOrder as string)?.toLowerCase() === "asc" ? "asc" : "desc";

      const whereClause: any = {
        requesterId,
      };

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
        whereClause.requestedPriority = priority;
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
      console.error("Fetch Requester Tickets Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to fetch tickets" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 1b. GET /api/requesters/tickets/:id (Single Ticket Detail with Read-Only Actions Taken)
// ---------------------------------------------------------------------------
requesterTicketsRouter.get(
  "/requesters/tickets/:id",
  authenticateToken,
  requireRoles("REQUESTER"),
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

      if (ticket.requesterId !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: { message: "Forbidden: You can only view your own tickets" },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      console.error("Fetch Requester Ticket Detail Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to fetch ticket detail" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 2. POST /api/requesters/tickets
// ---------------------------------------------------------------------------
requesterTicketsRouter.post(
  "/requesters/tickets",
  authenticateToken,
  requireRoles("REQUESTER"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const requesterId = req.user!.id;
      const { categoryId, relatedSystemId, requestedPriority, summary, description } = req.body;

      if (!summary || typeof summary !== "string" || summary.trim().length < 5) {
        res.status(400).json({
          success: false,
          error: { message: "Summary must be at least 5 characters long" },
        });
        return;
      }

      if (!description || typeof description !== "string" || description.trim().length < 10) {
        res.status(400).json({
          success: false,
          error: { message: "Description must be at least 10 characters long" },
        });
        return;
      }

      const catId = parseInt(categoryId, 10);
      const sysId = parseInt(relatedSystemId, 10);

      if (isNaN(catId) || isNaN(sysId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid Category or Related System ID" },
        });
        return;
      }

      const ticketNo = await generateTicketNumber();
      const newTicket = await prisma.ticket.create({
        data: {
          ticketNo,
          requesterId,
          categoryId: catId,
          relatedSystemId: sysId,
          requestedPriority: requestedPriority || "MEDIUM",
          summary: summary.trim(),
          description: description.trim(),
          status: "NEW",
        },
        include: {
          category: true,
          relatedSystem: true,
          attachments: true,
        },
      });

      res.status(201).json({
        success: true,
        data: newTicket,
      });
    } catch (error) {
      console.error("Create Ticket Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to create ticket" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 3. GET /api/tickets/:id/comments (Public Comments)
// ---------------------------------------------------------------------------
requesterTicketsRouter.get(
  "/tickets/:id/comments",
  authenticateToken,
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

      // Authorization check for Requesters
      if (req.user!.role === "REQUESTER" && ticket.requesterId !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: { message: "Forbidden: You can only view comments on your own tickets" },
        });
        return;
      }

      const comments = await prisma.publicComment.findMany({
        where: { ticketId },
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });

      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      console.error("Fetch Public Comments Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to fetch public comments" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 4. POST /api/tickets/:id/comments (Add Public Comment)
// ---------------------------------------------------------------------------
requesterTicketsRouter.post(
  "/tickets/:id/comments",
  authenticateToken,
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
          error: { message: "Comment content cannot be empty" },
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

      // Authorization check for Requesters
      if (req.user!.role === "REQUESTER" && ticket.requesterId !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: { message: "Forbidden: You can only comment on your own tickets" },
        });
        return;
      }

      const newComment = await prisma.publicComment.create({
        data: {
          ticketId,
          authorId: req.user!.id,
          content: content.trim(),
        },
        include: {
          author: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: newComment,
      });
    } catch (error) {
      console.error("Create Public Comment Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to create public comment" },
      });
    }
  }
);

// ---------------------------------------------------------------------------
// 5. PATCH /api/tickets/:id/indicate-resolved (and /tickets/:id/resolve)
//    Requester Advisory Resolution Indication (FR-08, BR-07, AC-07)
//    Sets requesterResolvedInd = true & appends Public Comment WITHOUT
//    transitioning ticket status to RESOLVED.
// ---------------------------------------------------------------------------
const handleIndicateResolved = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    // Only the ticket's Requester owner may trigger advisory resolution indication
    if (req.user!.role !== "REQUESTER" || ticket.requesterId !== req.user!.id) {
      res.status(403).json({
        success: false,
        error: {
          message: "Forbidden: Only the ticket requester owner can indicate that the problem appears resolved",
        },
      });
      return;
    }

    const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";
    const commentContent = note
      ? `Requester indicated that the problem appears resolved. Note: ${note}`
      : "Requester indicated that the problem appears resolved.";

    const [updatedTicket] = await prisma.$transaction([
      prisma.ticket.update({
        where: { id: ticketId },
        data: {
          requesterResolvedInd: true,
        },
        include: {
          category: true,
          relatedSystem: true,
          owner: { select: { id: true, name: true, email: true, role: true } },
          publicComments: {
            include: { author: { select: { id: true, name: true, email: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
      }),
      prisma.publicComment.create({
        data: {
          ticketId,
          authorId: req.user!.id,
          content: commentContent,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Advisory resolution indication recorded. Ticket status remains unchanged pending IT Staff review.",
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Indicate Resolved Error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to record resolution indication" },
    });
  }
};

requesterTicketsRouter.patch(
  "/tickets/:id/indicate-resolved",
  authenticateToken,
  enforcePasswordChange,
  handleIndicateResolved
);

requesterTicketsRouter.patch(
  "/tickets/:id/resolve",
  authenticateToken,
  enforcePasswordChange,
  handleIndicateResolved
);

requesterTicketsRouter.patch(
  "/requesters/tickets/:id/resolve",
  authenticateToken,
  enforcePasswordChange,
  handleIndicateResolved
);

// ---------------------------------------------------------------------------
// 6. PATCH /api/tickets/:id/status
//    Enforces Formal Resolution Gate (BR-07): Requesters cannot set status to
//    RESOLVED or CLOSED (403 Forbidden). IT Staff/Admin follow transition matrix.
// ---------------------------------------------------------------------------
requesterTicketsRouter.patch(
  "/tickets/:id/status",
  authenticateToken,
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const prisma = getPrisma();
      const ticketId = parseInt(req.params.id, 10);
      const { status, expectedUpdatedAt, lastUpdatedAt } = req.body;

      if (isNaN(ticketId)) {
        res.status(400).json({
          success: false,
          error: { message: "Invalid ticket ID" },
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

      // Formal Resolution Gate (BR-07, AC-07): Requesters are strictly forbidden from
      // setting RESOLVED, CLOSED, or staff workflow statuses (may only cancel own NEW ticket)
      if (req.user!.role === "REQUESTER") {
        if (existingTicket.requesterId !== req.user!.id) {
          res.status(403).json({
            success: false,
            error: { message: "Forbidden: You do not own this ticket" },
          });
          return;
        }
        if (status !== "CANCELLED" || existingTicket.status !== "NEW") {
          res.status(403).json({
            success: false,
            error: {
              message:
                "Forbidden: Formal resolution and lifecycle status transitions require IT Staff or Administrator authorization",
            },
          });
          return;
        }
      }

      // Optimistic Concurrency Check (BR-08, AC-08)
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

      if (!status || !Object.keys(PERMITTED_STATUS_TRANSITIONS).includes(status)) {
        res.status(400).json({
          success: false,
          error: { message: `Invalid ticket status: ${status}` },
        });
        return;
      }

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

      const updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: { status },
        include: {
          category: true,
          relatedSystem: true,
          owner: { select: { id: true, name: true, email: true, role: true } },
        },
      });

      res.status(200).json({
        success: true,
        data: updatedTicket,
      });
    } catch (error) {
      console.error("Update Ticket Status Error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Failed to update ticket status" },
      });
    }
  }
);
