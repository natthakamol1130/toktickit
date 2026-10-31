import React, { useEffect, useState, useCallback } from "react";
import { RequesterDashboardData } from "../types";
import { fetchRequesterDashboard } from "../api";

export interface RequesterDashboardProps {
  token?: string | null;
  userName?: string;
  initialData?: RequesterDashboardData | null;
  onDrillDownStatus?: (statusFilter: string) => void;
  onSelectTicket?: (ticketId: number) => void;
  onCreateTicketClick?: () => void;
}

function safeMetric(val: unknown): number {
  const num = Number(val);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

export const RequesterDashboard: React.FC<RequesterDashboardProps> = ({
  token = null,
  userName = "Requester",
  initialData = null,
  onDrillDownStatus,
  onSelectTicket,
  onCreateTicketClick,
}) => {
  const [data, setData] = useState<RequesterDashboardData | null>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData && Boolean(token));
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!token) {
      if (!initialData) {
        setData({
          metrics: {
            totalOpen: 0,
            inProgress: 0,
            waitingForRequester: 0,
            resolved: 0,
            closed: 0,
          },
          recentTickets: [],
          quickActions: [
            { label: "Create Ticket", path: "/create-ticket" },
            { label: "View My Tickets", path: "/my-tickets" },
          ],
        });
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchRequesterDashboard(token);
      setData(res);
    } catch (err: any) {
      setError(
        err.message ||
          "Unable to load Requester Dashboard metrics. Please try again."
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
          <span className="visually-hidden">Loading requester dashboard...</span>
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
          data-testid="requester-dashboard-error"
        >
          <div>
            <strong>Dashboard Error:</strong> {error}
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
    totalOpen: 0,
    inProgress: 0,
    waitingForRequester: 0,
    resolved: 0,
    closed: 0,
  };
  const recentTickets = data?.recentTickets || [];

  const cards = [
    {
      key: "totalOpen",
      label: "My Open Tickets",
      value: safeMetric(metrics.totalOpen ?? metrics.openCount),
      statusFilter: "OPEN",
      accent: "#006B3C",
    },
    {
      key: "inProgress",
      label: "In Progress",
      value: safeMetric(metrics.inProgress ?? metrics.inProgressCount),
      statusFilter: "IN_PROGRESS",
      accent: "#FD7E14",
    },
    {
      key: "waitingForRequester",
      label: "Waiting on Me",
      value: safeMetric(
        metrics.waitingForRequester ?? metrics.waitingOnMeCount
      ),
      statusFilter: "WAITING_FOR_REQUESTER",
      accent: "#D97706",
    },
    {
      key: "resolved",
      label: "Resolved",
      value: safeMetric(metrics.resolved ?? metrics.resolvedCount),
      statusFilter: "RESOLVED",
      accent: "#0B7A46",
    },
    {
      key: "closed",
      label: "Closed",
      value: safeMetric(metrics.closed ?? metrics.closedCount),
      statusFilter: "CLOSED",
      accent: "#6C757D",
    },
  ];

  return (
    <div className="container py-4" style={{ maxWidth: 1140 }}>
      {/* Welcome Banner */}
      <div
        className="zg-card p-4 mb-4 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3"
        style={{ backgroundColor: "#EAF6EF", borderColor: "#006B3C" }}
      >
        <div>
          <h2 className="h4 fw-bold mb-1" style={{ color: "#1A3326" }}>
            Welcome, {userName}!
          </h2>
          <p className="text-muted mb-0 small">
            Here is the real-time summary of your submitted service-desk
            requests.
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

      {/* Metric Cards Row */}
      <div className="row g-3 mb-4" role="region" aria-label="Requester Metrics">
        {cards.map((card) => (
          <div key={card.key} className="col-6 col-md-4 col-lg">
            <button
              type="button"
              className="zg-card p-3 w-100 text-start border shadow-sm h-100 bg-white"
              style={{ borderTop: `4px solid ${card.accent}` }}
              data-testid={`requester-metric-card-${card.key}`}
              onClick={() => onDrillDownStatus?.(card.statusFilter)}
            >
              <div className="text-muted small fw-semibold mb-1">
                {card.label}
              </div>
              <div
                className="fs-2 fw-bold"
                style={{ color: card.accent }}
                data-testid={`requester-metric-value-${card.key}`}
              >
                {card.value}
              </div>
              <div className="small text-success fw-semibold mt-1">
                View filtered list →
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Main Content Area: Recent Tickets + Quick Actions */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="zg-card p-4 shadow-sm h-100">
            <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <h5 className="fw-bold m-0">My Recent Tickets</h5>
              <button
                type="button"
                className="btn btn-sm btn-link text-success fw-semibold text-decoration-none"
                onClick={() => onDrillDownStatus?.("ALL")}
              >
                View All My Tickets →
              </button>
            </div>

            {recentTickets.length === 0 ? (
              <div className="p-4 text-center bg-light rounded-3 border">
                <p className="text-muted mb-0">
                  You have no recent tickets yet.
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
                        Category: {ticket.category?.name || "General"}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-success bg-opacity-10 text-success border border-success mb-1">
                        {ticket.status.replace(/_/g, " ")}
                      </span>
                      <div className="text-muted small">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="zg-card p-4 shadow-sm h-100">
            <h5 className="fw-bold border-bottom pb-3 mb-3">Quick Actions</h5>
            <div className="d-flex flex-column gap-3">
              <button
                type="button"
                className="btn btn-zg-primary py-2 fw-semibold text-start px-3"
                onClick={() => onCreateTicketClick?.()}
              >
                ➕ Create New Ticket
              </button>
              <button
                type="button"
                className="btn btn-outline-success py-2 fw-semibold text-start px-3"
                onClick={() => onDrillDownStatus?.("ALL")}
              >
                📋 View My Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
