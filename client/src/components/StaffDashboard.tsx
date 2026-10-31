import React, { useEffect, useState, useCallback } from "react";
import { StaffDashboardData, Role } from "../types";
import { fetchStaffDashboard } from "../api";

export interface StaffDashboardDrillDownFilter {
  status?: string;
  assignment?: "ME" | "UNASSIGNED" | "ALL";
}

export interface StaffDashboardProps {
  token?: string | null;
  userName?: string;
  userRole?: Role;
  initialData?: StaffDashboardData | null;
  onDrillDownQueue?: (filter: StaffDashboardDrillDownFilter) => void;
  onSelectTicket?: (ticketId: number) => void;
}

function safeCount(val: unknown): number {
  const num = Number(val);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  token = null,
  userName = "IT Staff",
  userRole = "IT_STAFF",
  initialData = null,
  onDrillDownQueue,
  onSelectTicket,
}) => {
  const [data, setData] = useState<StaffDashboardData | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData && Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!token) {
      if (!initialData) {
        setData({
          metrics: {
            newTickets: 0,
            openTickets: 0,
            inProgress: 0,
            waitingForRequester: 0,
            myAssigned: 0,
            unassigned: 0,
          },
          byPriority: { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
          recentTickets: [],
        });
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchStaffDashboard(token);
      setData(res);
    } catch (err: any) {
      setError(
        err.message ||
          "Unable to load IT Staff Dashboard metrics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [token, initialData]);

  useEffect(() => {
    if (!initialData) {
      loadDashboard();
    }
  }, [initialData, loadDashboard]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading staff dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4" style={{ maxWidth: 1140 }}>
        <div
          className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3"
          role="alert"
          data-testid="staff-dashboard-error"
        >
          <div>
            <strong>Operational Dashboard Error:</strong> {error}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger fw-semibold"
            onClick={loadDashboard}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    newTickets: 0,
    openTickets: 0,
    inProgress: 0,
    waitingForRequester: 0,
    myAssigned: 0,
    unassigned: 0,
  };

  const byPriority = data?.byPriority || {
    URGENT: safeCount(data?.priorityBreakdown?.urgent),
    HIGH: safeCount(data?.priorityBreakdown?.high),
    MEDIUM: safeCount(data?.priorityBreakdown?.medium),
    LOW: safeCount(data?.priorityBreakdown?.low),
  };

  const recentTickets = data?.recentTickets || [];
  const userSummary = data?.userSummary;

  const metricCards = [
    {
      key: "newTickets",
      label: "New Tickets",
      value: safeCount(metrics.newTickets ?? metrics.newCount),
      filter: { status: "NEW" } as StaffDashboardDrillDownFilter,
      accent: "#0D6EFD",
    },
    {
      key: "openTickets",
      label: "Open",
      value: safeCount(metrics.openTickets ?? metrics.openCount),
      filter: { status: "OPEN" } as StaffDashboardDrillDownFilter,
      accent: "#6F42C1",
    },
    {
      key: "inProgress",
      label: "In Progress",
      value: safeCount(metrics.inProgress ?? metrics.inProgressCount),
      filter: { status: "IN_PROGRESS" } as StaffDashboardDrillDownFilter,
      accent: "#FD7E14",
    },
    {
      key: "waitingForRequester",
      label: "Waiting for Requester",
      value: safeCount(
        metrics.waitingForRequester ?? metrics.waitingRequesterCount
      ),
      filter: { status: "WAITING_FOR_REQUESTER" } as StaffDashboardDrillDownFilter,
      accent: "#D97706",
    },
    {
      key: "myAssigned",
      label: "Assigned to Me",
      value: safeCount(metrics.myAssigned ?? metrics.myAssignedCount),
      filter: { assignment: "ME" } as StaffDashboardDrillDownFilter,
      accent: "#006B3C",
    },
    {
      key: "unassigned",
      label: "Unassigned",
      value: safeCount(metrics.unassigned ?? metrics.unassignedCount),
      filter: { assignment: "UNASSIGNED" } as StaffDashboardDrillDownFilter,
      accent: "#DC3545",
    },
  ];

  return (
    <div className="container py-4" style={{ maxWidth: 1140 }}>
      {/* Operational Header Banner */}
      <div
        className="zg-card p-4 mb-4 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3"
        style={{ backgroundColor: "#EAF6EF", borderColor: "#006B3C" }}
      >
        <div>
          <h2 className="h4 fw-bold mb-1" style={{ color: "#1A3326" }}>
            Welcome back, {userName}!
          </h2>
          <p className="text-muted mb-0 small">
            IT Service-Desk Operational Cockpit • Click any metric card to
            drill down into the filtered Ticket Queue.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-success fw-semibold"
          onClick={loadDashboard}
        >
          Refresh Dashboard
        </button>
      </div>

      {/* Operational Queue Metric Cards */}
      <div
        className="row g-3 mb-4"
        role="region"
        aria-label="IT Staff Queue Metrics"
      >
        {metricCards.map((card) => (
          <div key={card.key} className="col-6 col-md-4 col-lg-2">
            <button
              type="button"
              className="zg-card p-3 w-100 text-start border shadow-sm h-100 bg-white"
              style={{ borderTop: `4px solid ${card.accent}` }}
              data-testid={`staff-metric-card-${card.key}`}
              onClick={() => onDrillDownQueue?.(card.filter)}
            >
              <div className="text-muted small fw-semibold mb-1">
                {card.label}
              </div>
              <div
                className="fs-2 fw-bold"
                style={{ color: card.accent }}
                data-testid={`staff-metric-value-${card.key}`}
              >
                {card.value}
              </div>
              <div className="small text-success fw-semibold mt-1">
                Drill down →
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Administrator User Summary Panel (FR-11) */}
      {(userRole === "ADMINISTRATOR" || userSummary) && userSummary && (
        <div
          className="zg-card p-4 shadow-sm mb-4"
          data-testid="admin-user-summary-section"
        >
          <h5 className="fw-bold border-bottom pb-2 mb-3">
            Administrator User Account Summary
          </h5>
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="p-2 rounded bg-light border">
                <div className="small text-muted">Total Users</div>
                <div className="fs-4 fw-bold text-dark">
                  {safeCount(userSummary.totalUsers)}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 rounded bg-light border">
                <div className="small text-muted">Active Requesters</div>
                <div className="fs-4 fw-bold text-success">
                  {safeCount(
                    userSummary.activeRequesters ?? userSummary.requesters
                  )}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 rounded bg-light border">
                <div className="small text-muted">Active IT Staff</div>
                <div className="fs-4 fw-bold text-primary">
                  {safeCount(userSummary.activeStaff ?? userSummary.staff)}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-2 rounded bg-light border">
                <div className="small text-muted">Active Admins</div>
                <div className="fs-4 fw-bold text-dark">
                  {safeCount(userSummary.activeAdmins ?? userSummary.admins)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: Recent Tickets + Priority Breakdown */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="zg-card p-4 shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <h5 className="fw-bold m-0">Recent Queue Activity</h5>
              <button
                type="button"
                className="btn btn-sm btn-link text-success fw-semibold text-decoration-none"
                onClick={() => onDrillDownQueue?.({ assignment: "ALL" })}
              >
                Open Full Ticket Queue →
              </button>
            </div>

            {recentTickets.length === 0 ? (
              <div className="p-4 text-center bg-light rounded-3 border">
                <p className="text-muted mb-0">
                  No tickets found in the service-desk queue.
                </p>
              </div>
            ) : (
              <div className="list-group">
                {recentTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    className="list-group-item list-group-item-action d-flex flex-wrap align-items-center justify-content-between gap-2 py-3"
                    onClick={() => onSelectTicket?.(ticket.id)}
                  >
                    <div>
                      <div className="fw-bold" style={{ color: "#006B3C" }}>
                        {ticket.ticketNumber || ticket.ticketNo}
                      </div>
                      <div className="text-dark fw-semibold">
                        {ticket.summary}
                      </div>
                      <div className="text-muted small">
                        Requester: {ticket.requester?.name || "Requester"} •
                        Owner: {ticket.owner?.name || "Unassigned"}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-success bg-opacity-10 text-success border border-success me-1">
                        {ticket.status.replace(/_/g, " ")}
                      </span>
                      <span className="badge bg-secondary">
                        {ticket.itPriority || ticket.requestedPriority}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="zg-card p-4 shadow-sm h-100">
            <h5 className="fw-bold border-bottom pb-3 mb-3">
              Queue by IT Priority
            </h5>
            <div className="d-flex flex-column gap-2">
              {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((prio) => (
                <div
                  key={prio}
                  className="d-flex align-items-center justify-content-between p-2 rounded bg-light border"
                >
                  <span className="fw-semibold">{prio}</span>
                  <span
                    className="badge bg-dark rounded-pill"
                    data-testid={`priority-count-${prio}`}
                  >
                    {safeCount(byPriority[prio])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
