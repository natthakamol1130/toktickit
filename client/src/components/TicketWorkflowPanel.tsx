import React, { useState, useEffect } from "react";
import {
  Ticket,
  Role,
  PERMITTED_STATUS_TRANSITIONS,
} from "../types";

export interface TicketWorkflowPanelProps {
  ticket: Ticket;
  userRole: Role;
  onUpdateWorkflow?: (payload: {
    status?: string;
    itPriority?: string;
    expectedUpdatedAt?: string;
  }) => Promise<void>;
  onIndicateResolved?: (note?: string) => Promise<void>;
  onRefreshTicket?: () => Promise<void> | void;
  initialConflictError?: string | null;
}

export const TicketWorkflowPanel: React.FC<TicketWorkflowPanelProps> = ({
  ticket,
  userRole,
  onUpdateWorkflow,
  onIndicateResolved,
  onRefreshTicket,
  initialConflictError = null,
}) => {
  const isStaffOrAdmin = userRole === "IT_STAFF" || userRole === "ADMINISTRATOR";
  const permittedNextStatuses = PERMITTED_STATUS_TRANSITIONS[ticket.status] || [];
  const selectableStatuses = [
    ticket.status,
    ...permittedNextStatuses.filter((s) => s !== ticket.status),
  ];

  const [selectedStatus, setSelectedStatus] = useState<string>(ticket.status);
  const [resolutionNote, setResolutionNote] = useState<string>("");
  const [showIndicateModal, setShowIndicateModal] = useState<boolean>(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(
    initialConflictError
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    setSelectedStatus(ticket.status);
  }, [ticket.status]);

  const handleStatusUpdate = async (targetStatus?: string) => {
    if (!onUpdateWorkflow) return;
    const nextStatus = targetStatus || selectedStatus;
    setErrorMessage(null);
    setConflictMessage(null);
    setSaving(true);
    try {
      await onUpdateWorkflow({
        status: nextStatus,
        expectedUpdatedAt: ticket.updatedAt,
      });
    } catch (err: any) {
      if (err?.status === 409) {
        setConflictMessage(
          err.message ||
            "Concurrency Conflict (409): This ticket was modified by another user. Please refresh details before saving."
        );
      } else {
        setErrorMessage(err.message || "Failed to update ticket status.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRequesterIndicateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onIndicateResolved) return;
    setErrorMessage(null);
    setSaving(true);
    try {
      await onIndicateResolved(resolutionNote.trim() || undefined);
      setShowIndicateModal(false);
      setResolutionNote("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit resolution indication.");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setConflictMessage(null);
    setErrorMessage(null);
    if (onRefreshTicket) {
      await onRefreshTicket();
    }
  };

  const isTerminal = ticket.status === "CLOSED" || ticket.status === "CANCELLED";
  const isAlreadyResolved =
    ticket.status === "RESOLVED" || ticket.status === "CLOSED";

  return (
    <section
      className="zg-card p-4 shadow-sm mb-4"
      aria-labelledby="ticketWorkflowHeading"
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom pb-3 mb-3">
        <h5 id="ticketWorkflowHeading" className="fw-bold m-0">
          Ticket Workflow & Resolution Controls
        </h5>
        <span
          className="badge px-3 py-2"
          style={
            ticket.status === "REOPENED"
              ? { backgroundColor: "#E6FAF4", color: "#20C997", border: "1px solid #20C997" }
              : { backgroundColor: "#EAF6EF", color: "#006B3C", border: "1px solid #006B3C" }
          }
        >
          Current Status: {ticket.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* HTTP 409 Concurrency Conflict Alert & Recovery Modal/Banner (UI-05, AC-08) */}
      {conflictMessage && (
        <div
          className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3"
          role="alert"
          data-testid="concurrency-conflict-banner"
        >
          <div>
            <div className="fw-bold">409 Concurrency Conflict Detected</div>
            <div className="small">{conflictMessage}</div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-danger fw-semibold"
            onClick={handleRefresh}
          >
            Refresh Details
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-warning py-2 small mb-3" role="alert">
          {errorMessage}
        </div>
      )}

      {/* IT Staff Advisory Resolution Notice Banner (UI-04, AC-07) */}
      {isStaffOrAdmin && ticket.requesterResolvedInd && !isAlreadyResolved && (
        <div
          className="alert alert-success d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3"
          role="status"
          data-testid="staff-advisory-resolution-banner"
        >
          <div>
            <strong>Requester Advisory Indication:</strong> The requester has
            indicated that the problem appears resolved. Please verify the work
            and formally transition the ticket status to{" "}
            <strong>RESOLVED</strong>.
          </div>
          {permittedNextStatuses.includes("RESOLVED") && (
            <button
              type="button"
              className="btn btn-sm btn-success fw-semibold"
              onClick={() => handleStatusUpdate("RESOLVED")}
              disabled={saving}
            >
              Formally Resolve Ticket
            </button>
          )}
        </div>
      )}

      {/* Staff / Admin Status Transition Selector (UI-04, AC-06) */}
      {isStaffOrAdmin ? (
        <div className="row g-3 align-items-end">
          <div className="col-md-7">
            <label
              htmlFor="statusTransitionSelect"
              className="form-label fw-semibold"
            >
              Permitted Status Transitions
            </label>
            <select
              id="statusTransitionSelect"
              aria-label="Permitted Status Transitions"
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isTerminal || saving}
            >
              {selectableStatuses.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-5">
            <button
              type="button"
              className="btn btn-zg-primary w-100 fw-semibold"
              onClick={() => handleStatusUpdate()}
              disabled={
                isTerminal || selectedStatus === ticket.status || saving
              }
            >
              {saving ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      ) : (
        /* Requester Advisory Resolution Control (UI-04, AC-07, BR-07) */
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="fw-semibold text-dark">
              Resolution Feedback (Requester Advisory)
            </div>
            <div className="text-muted small">
              Requesters cannot directly set status to Resolved or Closed. You
              may notify IT Staff if your issue appears resolved.
            </div>
          </div>

          {ticket.requesterResolvedInd ? (
            <span
              className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2"
              data-testid="requester-resolved-indicated-badge"
            >
              ✓ Problem Appears Resolved Indicated
            </span>
          ) : (
            !isAlreadyResolved && (
              <button
                type="button"
                className="btn btn-outline-success fw-semibold"
                onClick={() => setShowIndicateModal(true)}
              >
                Problem Appears Resolved
              </button>
            )
          )}
        </div>
      )}

      {showIndicateModal && !isStaffOrAdmin && (
        <div
          className="modal show d-block bg-dark bg-opacity-50"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="indicateResolvedModalTitle"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content zg-card">
              <form onSubmit={handleRequesterIndicateSubmit}>
                <div className="modal-header border-bottom">
                  <h5
                    id="indicateResolvedModalTitle"
                    className="modal-title fw-bold"
                  >
                    Indicate Problem Appears Resolved
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowIndicateModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <p className="text-muted small mb-3">
                    This will set an advisory flag and post a public comment for
                    IT Staff to review and formally resolve your ticket.
                  </p>
                  <label
                    htmlFor="requesterResolutionNoteInput"
                    className="form-label fw-semibold"
                  >
                    Optional Confirmation Note
                  </label>
                  <textarea
                    id="requesterResolutionNoteInput"
                    className="form-control"
                    rows={3}
                    placeholder="e.g., Everything is working properly now, thank you!"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                  />
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowIndicateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-zg-primary fw-semibold"
                    disabled={saving}
                  >
                    {saving ? "Submitting..." : "Confirm Advisory Resolution"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

