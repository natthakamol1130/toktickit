import { Router, Response } from "express";
import { getPrisma } from "../prisma.js";
import {
  authenticateToken,
  requireRoles,
  enforcePasswordChange,
  AuthenticatedRequest,
} from "../middleware/authMiddleware.js";

export const actionsTakenRouter = Router();

// ---------------------------------------------------------------------------
// 1. GET /api/tickets/:ticketId/actions-taken (List Actions Taken)
// ---------------------------------------------------------------------------
actionsTakenRouter.get(
  "/tickets/:ticketId/actions-taken",
  authenticateToken,
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.ticketId, 10);
      if (isNaN(ticketId)) {
        res.status(400).json({ success: false, error: "Invalid ticket ID" });
        return;
      }

      const prisma = getPrisma();
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        select: { id: true, requesterId: true },
      });

      if (!ticket) {
        res.status(404).json({ success: false, error: "Ticket not found" });
        return;
      }

      // Authorization: Requesters can only view their owned tickets
      if (req.user!.role === "REQUESTER" && ticket.requesterId !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You do not have permission to view Actions Taken for this ticket",
        });
        return;
      }

      const actions = await prisma.actionTaken.findMany({
        where: { ticketId },
        include: {
          performer: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        orderBy: { actionDateTime: "desc" },
      });

      res.status(200).json({
        success: true,
        data: actions,
      });
    } catch (error) {
      console.error("Error listing actions taken:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ---------------------------------------------------------------------------
// 2. POST /api/tickets/:ticketId/actions-taken (Create Action Taken)
// ---------------------------------------------------------------------------
actionsTakenRouter.post(
  "/tickets/:ticketId/actions-taken",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.ticketId, 10);
      if (isNaN(ticketId)) {
        res.status(400).json({ success: false, error: "Invalid ticket ID" });
        return;
      }

      // Check inactive performer safety
      if (!req.user!.isActive) {
        res.status(400).json({
          success: false,
          error: "Inactive account cannot record Actions Taken",
        });
        return;
      }

      const prisma = getPrisma();
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        select: { id: true },
      });

      if (!ticket) {
        res.status(404).json({ success: false, error: "Ticket not found" });
        return;
      }

      const {
        description,
        result,
        actionDateTime,
        followUpRequired,
        followUpNote,
        attachmentNotes,
      } = req.body;

      // Validation
      if (!description || typeof description !== "string" || description.trim().length < 5) {
        res.status(400).json({
          success: false,
          error: "Description is required and must be at least 5 characters long",
        });
        return;
      }

      if (!result || typeof result !== "string" || result.trim().length < 2) {
        res.status(400).json({
          success: false,
          error: "Result is required and must be at least 2 characters long",
        });
        return;
      }

      const isFollowUpRequired = Boolean(followUpRequired);
      if (isFollowUpRequired && (!followUpNote || typeof followUpNote !== "string" || followUpNote.trim().length === 0)) {
        res.status(400).json({
          success: false,
          error: "Follow-up note is strictly required when follow-up is needed",
        });
        return;
      }

      let parsedDateTime = new Date();
      if (actionDateTime) {
        const d = new Date(actionDateTime);
        if (isNaN(d.getTime())) {
          res.status(400).json({ success: false, error: "Invalid actionDateTime format" });
          return;
        }
        parsedDateTime = d;
      }

      // Auto-assign performerId from authenticated user session (spoofing prevented)
      const action = await prisma.actionTaken.create({
        data: {
          ticketId,
          performerId: req.user!.id,
          actionDateTime: parsedDateTime,
          description: description.trim(),
          result: result.trim(),
          followUpRequired: isFollowUpRequired,
          followUpNote: isFollowUpRequired ? followUpNote.trim() : null,
          attachmentNotes: attachmentNotes?.trim() || null,
        },
        include: {
          performer: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: "Action Taken recorded successfully",
        data: action,
      });
    } catch (error) {
      console.error("Error creating action taken:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ---------------------------------------------------------------------------
// 3. GET /api/tickets/:ticketId/actions-taken/:actionId (Get Single Action)
// ---------------------------------------------------------------------------
actionsTakenRouter.get(
  "/tickets/:ticketId/actions-taken/:actionId",
  authenticateToken,
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.ticketId, 10);
      const actionId = parseInt(req.params.actionId, 10);
      if (isNaN(ticketId) || isNaN(actionId)) {
        res.status(400).json({ success: false, error: "Invalid ticket or action ID" });
        return;
      }

      const prisma = getPrisma();
      const action = await prisma.actionTaken.findFirst({
        where: { id: actionId, ticketId },
        include: {
          performer: {
            select: { id: true, name: true, email: true, role: true },
          },
          ticket: {
            select: { requesterId: true },
          },
        },
      });

      if (!action) {
        res.status(404).json({
          success: false,
          error: "Action Taken record not found under this ticket",
        });
        return;
      }

      // Authorization for Requester
      if (req.user!.role === "REQUESTER" && action.ticket.requesterId !== req.user!.id) {
        res.status(403).json({
          success: false,
          error: "Forbidden: You do not have permission to view this Action Taken",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: action,
      });
    } catch (error) {
      console.error("Error getting single action taken:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ---------------------------------------------------------------------------
// 4. PATCH /api/tickets/:ticketId/actions-taken/:actionId (Update Action)
// ---------------------------------------------------------------------------
actionsTakenRouter.patch(
  "/tickets/:ticketId/actions-taken/:actionId",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.ticketId, 10);
      const actionId = parseInt(req.params.actionId, 10);
      if (isNaN(ticketId) || isNaN(actionId)) {
        res.status(400).json({ success: false, error: "Invalid ticket or action ID" });
        return;
      }

      if (!req.user!.isActive) {
        res.status(400).json({
          success: false,
          error: "Inactive account cannot update Actions Taken",
        });
        return;
      }

      const prisma = getPrisma();
      const existingAction = await prisma.actionTaken.findFirst({
        where: { id: actionId, ticketId },
      });

      if (!existingAction) {
        res.status(404).json({
          success: false,
          error: "Action Taken record not found under this ticket",
        });
        return;
      }

      // Concurrency conflict check via expectedUpdatedAt
      const { expectedUpdatedAt, description, result, followUpRequired, followUpNote, attachmentNotes } = req.body;
      if (expectedUpdatedAt) {
        const clientDate = new Date(expectedUpdatedAt).getTime();
        const serverDate = existingAction.updatedAt.getTime();
        // Allow up to 1 second variance for serialization or check mismatch
        if (Math.abs(clientDate - serverDate) > 1000) {
          res.status(409).json({
            success: false,
            error: "Conflict",
            message: "This Action Taken was updated by another user. Please refresh and review before saving.",
          });
          return;
        }
      }

      // Validate description if provided
      if (description !== undefined && (typeof description !== "string" || description.trim().length < 5)) {
        res.status(400).json({
          success: false,
          error: "Description must be at least 5 characters long",
        });
        return;
      }

      // Validate result if provided
      if (result !== undefined && (typeof result !== "string" || result.trim().length < 2)) {
        res.status(400).json({
          success: false,
          error: "Result must be at least 2 characters long",
        });
        return;
      }

      const finalFollowUpRequired = followUpRequired !== undefined ? Boolean(followUpRequired) : existingAction.followUpRequired;
      let finalFollowUpNote = followUpNote !== undefined ? followUpNote?.trim() : existingAction.followUpNote;

      if (finalFollowUpRequired && (!finalFollowUpNote || finalFollowUpNote.length === 0)) {
        res.status(400).json({
          success: false,
          error: "Follow-up note is strictly required when follow-up is needed",
        });
        return;
      }

      if (!finalFollowUpRequired) {
        finalFollowUpNote = null;
      }

      const updated = await prisma.actionTaken.update({
        where: { id: actionId },
        data: {
          description: description !== undefined ? description.trim() : undefined,
          result: result !== undefined ? result.trim() : undefined,
          followUpRequired: finalFollowUpRequired,
          followUpNote: finalFollowUpNote,
          attachmentNotes: attachmentNotes !== undefined ? attachmentNotes?.trim() : undefined,
        },
        include: {
          performer: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Action Taken updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating action taken:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
);

// ---------------------------------------------------------------------------
// 5. Explicit Rejection of DELETE (Audit Trail Immutability - BR-13)
// ---------------------------------------------------------------------------
actionsTakenRouter.delete(
  "/tickets/:ticketId/actions-taken/:actionId?",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response): void => {
    res.status(405).json({
      success: false,
      error: "Method Not Allowed",
      message: "Action Taken records are immutable audit logs and cannot be deleted (BR-13)",
    });
  }
);
