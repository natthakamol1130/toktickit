import { Router, Response } from "express";
import { getPrisma } from "../prisma.js";
import {
  authenticateToken,
  requireRoles,
  enforcePasswordChange,
  AuthenticatedRequest,
} from "../middleware/authMiddleware.js";

export const dashboardsRouter = Router();

// ---------------------------------------------------------------------------
// 1. Requester Dashboard API (AC-09, FR-10, BR-09, BR-11)
//    Routes: GET /api/requesters/dashboard & GET /api/dashboards/requester
// ---------------------------------------------------------------------------
async function handleRequesterDashboard(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const prisma = getPrisma();
    const requesterId = req.user!.id;

    const [
      newCount,
      openStatusCount,
      inProgressCount,
      reopenedCount,
      waitingForRequesterCount,
      resolvedCount,
      closedCount,
      recentTicketsRaw,
    ] = await Promise.all([
      prisma.ticket.count({ where: { requesterId, status: "NEW" } }),
      prisma.ticket.count({ where: { requesterId, status: "OPEN" } }),
      prisma.ticket.count({ where: { requesterId, status: "IN_PROGRESS" } }),
      prisma.ticket.count({ where: { requesterId, status: "REOPENED" } }),
      prisma.ticket.count({
        where: { requesterId, status: "WAITING_FOR_REQUESTER" },
      }),
      prisma.ticket.count({ where: { requesterId, status: "RESOLVED" } }),
      prisma.ticket.count({ where: { requesterId, status: "CLOSED" } }),
      prisma.ticket.findMany({
        where: { requesterId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          category: { select: { id: true, name: true } },
          relatedSystem: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    const activeInProgress = inProgressCount + reopenedCount;
    const totalOpen =
      newCount +
      openStatusCount +
      activeInProgress +
      waitingForRequesterCount;

    const recentTickets = recentTicketsRaw.map((t) => ({
      ...t,
      ticketNumber: t.ticketNo,
    }));

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalOpen: totalOpen || 0,
          openCount: totalOpen || 0,
          newCount: newCount || 0,
          inProgress: activeInProgress || 0,
          inProgressCount: activeInProgress || 0,
          waitingForRequester: waitingForRequesterCount || 0,
          waitingOnMeCount: waitingForRequesterCount || 0,
          resolved: resolvedCount || 0,
          resolvedCount: resolvedCount || 0,
          closed: closedCount || 0,
          closedCount: closedCount || 0,
        },
        recentTickets,
        quickActions: [
          { label: "Create Ticket", path: "/create-ticket" },
          { label: "View My Tickets", path: "/my-tickets" },
        ],
      },
    });
  } catch (error) {
    console.error("Get requester dashboard error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to load requester dashboard metrics",
      },
    });
  }
}

dashboardsRouter.get(
  "/requesters/dashboard",
  authenticateToken,
  requireRoles("REQUESTER"),
  enforcePasswordChange,
  handleRequesterDashboard
);

dashboardsRouter.get(
  "/dashboards/requester",
  authenticateToken,
  requireRoles("REQUESTER"),
  enforcePasswordChange,
  handleRequesterDashboard
);

// ---------------------------------------------------------------------------
// 2. IT Staff & Administrator Dashboard API (AC-10, FR-11, BR-10, BR-11)
//    Routes: GET /api/staff/dashboard & GET /api/dashboards/staff
// ---------------------------------------------------------------------------
async function handleStaffDashboard(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const prisma = getPrisma();
    const staffUserId = req.user!.id;

    const [
      newTickets,
      openTickets,
      inProgressTickets,
      reopenedTickets,
      waitingForRequester,
      resolvedTickets,
      closedTickets,
      myAssigned,
      unassigned,
      urgentPriority,
      highPriority,
      mediumPriority,
      lowPriority,
      recentTicketsRaw,
      totalUsers,
      activeUsers,
      inactiveUsers,
      activeRequesters,
      activeStaff,
      activeAdmins,
    ] = await Promise.all([
      prisma.ticket.count({ where: { status: "NEW" } }),
      prisma.ticket.count({ where: { status: "OPEN" } }),
      prisma.ticket.count({ where: { status: "IN_PROGRESS" } }),
      prisma.ticket.count({ where: { status: "REOPENED" } }),
      prisma.ticket.count({ where: { status: "WAITING_FOR_REQUESTER" } }),
      prisma.ticket.count({ where: { status: "RESOLVED" } }),
      prisma.ticket.count({ where: { status: "CLOSED" } }),
      prisma.ticket.count({ where: { ownerId: staffUserId } }),
      prisma.ticket.count({ where: { ownerId: null } }),
      prisma.ticket.count({
        where: {
          OR: [
            { itPriority: "URGENT" },
            { itPriority: null, requestedPriority: "URGENT" },
          ],
        },
      }),
      prisma.ticket.count({
        where: {
          OR: [
            { itPriority: "HIGH" },
            { itPriority: null, requestedPriority: "HIGH" },
          ],
        },
      }),
      prisma.ticket.count({
        where: {
          OR: [
            { itPriority: "MEDIUM" },
            { itPriority: null, requestedPriority: "MEDIUM" },
          ],
        },
      }),
      prisma.ticket.count({
        where: {
          OR: [
            { itPriority: "LOW" },
            { itPriority: null, requestedPriority: "LOW" },
          ],
        },
      }),
      prisma.ticket.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          requester: {
            select: { id: true, name: true, email: true, department: true },
          },
          owner: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true } },
          relatedSystem: { select: { id: true, name: true } },
        },
      }),
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: "REQUESTER", isActive: true } }),
      prisma.user.count({ where: { role: "IT_STAFF", isActive: true } }),
      prisma.user.count({ where: { role: "ADMINISTRATOR", isActive: true } }),
    ]);

    const activeInProgress = inProgressTickets + reopenedTickets;

    const recentTickets = recentTicketsRaw.map((t) => ({
      ...t,
      ticketNumber: t.ticketNo,
    }));

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          newTickets: newTickets || 0,
          newCount: newTickets || 0,
          openTickets: openTickets || 0,
          openCount: openTickets || 0,
          inProgress: activeInProgress || 0,
          inProgressCount: activeInProgress || 0,
          waitingForRequester: waitingForRequester || 0,
          waitingRequesterCount: waitingForRequester || 0,
          resolved: resolvedTickets || 0,
          resolvedCount: resolvedTickets || 0,
          closed: closedTickets || 0,
          closedCount: closedTickets || 0,
          myAssigned: myAssigned || 0,
          myAssignedCount: myAssigned || 0,
          unassigned: unassigned || 0,
          unassignedCount: unassigned || 0,
        },
        byPriority: {
          URGENT: urgentPriority || 0,
          HIGH: highPriority || 0,
          MEDIUM: mediumPriority || 0,
          LOW: lowPriority || 0,
        },
        priorityBreakdown: {
          urgent: urgentPriority || 0,
          high: highPriority || 0,
          medium: mediumPriority || 0,
          low: lowPriority || 0,
        },
        recentTickets,
        userSummary: {
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          inactiveUsers: inactiveUsers || 0,
          activeRequesters: activeRequesters || 0,
          requesters: activeRequesters || 0,
          activeStaff: activeStaff || 0,
          staff: activeStaff || 0,
          activeAdmins: activeAdmins || 0,
          admins: activeAdmins || 0,
        },
      },
    });
  } catch (error) {
    console.error("Get staff dashboard error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to load staff dashboard metrics",
      },
    });
  }
}

dashboardsRouter.get(
  "/staff/dashboard",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  handleStaffDashboard
);

dashboardsRouter.get(
  "/dashboards/staff",
  authenticateToken,
  requireRoles("IT_STAFF", "ADMINISTRATOR"),
  enforcePasswordChange,
  handleStaffDashboard
);
