import React, { useState } from "react";
import { ActionTaken, Role } from "../types";

export interface ActionsTakenSectionProps {
  ticketId: number;
  actions: ActionTaken[];
  userRole: Role;
  currentUserName?: string;
  onCreateAction?: (payload: {
    actionDateTime: string;
    description: string;
    result: string;
    followUpRequired: boolean;
    followUpNote?: string | null;
    attachmentNotes?: string | null;
  }) => Promise<void>;
  onUpdateAction?: (
    actionId: number,
    payload: {
      description: string;
      result: string;
      followUpRequired: boolean;
      followUpNote?: string | null;
      attachmentNotes?: string | null;
      expectedUpdatedAt?: string;
    }
  ) => Promise<void>;
}

export const ActionsTakenSection: React.FC<ActionsTakenSectionProps> = ({
  actions,
  userRole,
  currentUserName = "Authenticated IT Staff",
  onCreateAction,
  onUpdateAction,
}) => {
  const isStaffOrAdmin = userRole === "IT_STAFF" || userRole === "ADMINISTRATOR";

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingAction, setEditingAction] = useState<ActionTaken | null>(null);
  const [actionDateTime, setActionDateTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [description, setDescription] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [followUpRequired, setFollowUpRequired] = useState<boolean>(false);
  const [followUpNote, setFollowUpNote] = useState<string>("");
  const [attachmentNotes, setAttachmentNotes] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const openAddModal = () => {
    setEditingAction(null);
    setActionDateTime(new Date().toISOString().slice(0, 16));
    setDescription("");
    setResult("");
    setFollowUpRequired(false);
    setFollowUpNote("");
    setAttachmentNotes("");
    setValidationError(null);
    setShowModal(true);
  };

  const openEditModal = (action: ActionTaken) => {
    setEditingAction(action);
    setActionDateTime(
      action.actionDateTime
        ? new Date(action.actionDateTime).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16)
    );
    setDescription(action.description);
    setResult(action.result);
    setFollowUpRequired(Boolean(action.followUpRequired));
    setFollowUpNote(action.followUpNote || "");
    setAttachmentNotes(action.attachmentNotes || "");
    setValidationError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!description.trim() || description.trim().length < 3) {
      setValidationError("Action description is required (minimum 3 characters).");
      return;
    }

    if (!result.trim() || result.trim().length < 3) {
      setValidationError("Action result is required (minimum 3 characters).");
      return;
    }

    if (followUpRequired && !followUpNote.trim()) {
      setValidationError(
        "Follow-up Note is required when Follow-up Required is checked."
      );
      return;
    }

    setSubmitting(true);
    try {
      if (editingAction && onUpdateAction) {
        await onUpdateAction(editingAction.id, {
          description: description.trim(),
          result: result.trim(),
          followUpRequired,
          followUpNote: followUpRequired ? followUpNote.trim() : null,
          attachmentNotes: attachmentNotes.trim() || null,
          expectedUpdatedAt: editingAction.updatedAt,
        });
      } else if (onCreateAction) {
        await onCreateAction({
          actionDateTime: new Date(actionDateTime).toISOString(),
          description: description.trim(),
          result: result.trim(),
          followUpRequired,
          followUpNote: followUpRequired ? followUpNote.trim() : null,
          attachmentNotes: attachmentNotes.trim() || null,
        });
      }
      setShowModal(false);
    } catch (err: any) {
      setValidationError(err.message || "Failed to save Action Taken.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="zg-card p-4 shadow-sm mb-4"
      aria-labelledby="actionsTakenSectionHeading"
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom pb-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <h5 id="actionsTakenSectionHeading" className="fw-bold m-0">
            Actions Taken Work Log
          </h5>
          <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success">
            {actions.length} {actions.length === 1 ? "Action" : "Actions"}
          </span>
        </div>

        {isStaffOrAdmin && (
          <button
            type="button"
            className="btn btn-sm btn-zg-primary fw-semibold"
            onClick={openAddModal}
          >
            + Add Action Taken
          </button>
        )}
      </div>

      {actions.length === 0 ? (
        <div className="p-4 text-center bg-light rounded-3 border">
          <p className="text-muted mb-0">
            No actions taken have been recorded for this ticket yet.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {actions.map((action) => {
            const performerName =
              action.performer?.name ||
              action.performedBy?.name ||
              "IT Staff Member";

            return (
              <div
                key={action.id}
                className="p-3 rounded-3 bg-white border shadow-sm"
                data-testid={`action-taken-item-${action.id}`}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className="badge bg-success bg-opacity-10 text-success border">
                      Performed by: {performerName}
                    </span>
                    <span className="text-muted small">
                      {new Date(action.actionDateTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {action.followUpRequired ? (
                      <span className="badge bg-warning text-dark">
                        Follow-up Required
                      </span>
                    ) : (
                      <span className="badge bg-light text-secondary border">
                        No Follow-up
                      </span>
                    )}

                    {isStaffOrAdmin && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openEditModal(action)}
                      >
                        Edit Action
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="small fw-semibold text-muted">
                    Action Description
                  </div>
                  <div className="text-dark">{action.description}</div>
                </div>

                <div className="mb-2">
                  <div className="small fw-semibold text-muted">Result</div>
                  <div className="text-dark">{action.result}</div>
                </div>

                {action.followUpRequired && action.followUpNote && (
                  <div className="p-2 rounded bg-warning bg-opacity-10 border border-warning mt-2">
                    <div className="small fw-bold text-dark">Follow-up Note:</div>
                    <div className="small text-dark">{action.followUpNote}</div>
                  </div>
                )}

                {action.attachmentNotes && (
                  <div className="small text-muted mt-2">
                    <strong>Attachment Reference:</strong> {action.attachmentNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && isStaffOrAdmin && (
        <div
          className="modal show d-block bg-dark bg-opacity-50"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="actionTakenModalTitle"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content zg-card">
              <form onSubmit={handleSubmit} noValidate>
                <div className="modal-header border-bottom">
                  <h5 id="actionTakenModalTitle" className="modal-title fw-bold">
                    {editingAction ? "Edit Action Taken" : "Add Action Taken"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  {validationError && (
                    <div className="alert alert-danger py-2 small mb-3" role="alert">
                      {validationError}
                    </div>
                  )}

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="actionDateTimeInput"
                        className="form-label fw-semibold"
                      >
                        Action Date & Time
                      </label>
                      <input
                        id="actionDateTimeInput"
                        type="datetime-local"
                        className="form-control"
                        value={actionDateTime}
                        onChange={(e) => setActionDateTime(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Performed By (Auto-Assigned)
                      </label>
                      <div className="form-control bg-light text-muted">
                        {editingAction
                          ? editingAction.performer?.name ||
                            editingAction.performedBy?.name ||
                            currentUserName
                          : currentUserName}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="actionDescriptionInput"
                      className="form-label fw-semibold"
                    >
                      Action Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="actionDescriptionInput"
                      className="form-control"
                      rows={3}
                      placeholder="Describe the technical diagnosis or remediation performed..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="actionResultInput"
                      className="form-label fw-semibold"
                    >
                      Result / Outcome <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="actionResultInput"
                      className="form-control"
                      rows={2}
                      placeholder="Describe the outcome of the action..."
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      id="followUpRequiredCheckbox"
                      type="checkbox"
                      className="form-check-input"
                      checked={followUpRequired}
                      onChange={(e) => setFollowUpRequired(e.target.checked)}
                    />
                    <label
                      htmlFor="followUpRequiredCheckbox"
                      className="form-check-label fw-semibold"
                    >
                      Follow-Up Required
                    </label>
                  </div>

                  {followUpRequired && (
                    <div className="mb-3">
                      <label
                        htmlFor="followUpNoteInput"
                        className="form-label fw-semibold"
                      >
                        Follow-Up Note <span className="text-danger">*</span>
                      </label>
                      <textarea
                        id="followUpNoteInput"
                        className="form-control"
                        rows={2}
                        placeholder="Specify required follow-up steps or schedule..."
                        value={followUpNote}
                        onChange={(e) => setFollowUpNote(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="mb-2">
                    <label
                      htmlFor="attachmentNotesInput"
                      className="form-label fw-semibold"
                    >
                      Attachment Notes (Optional)
                    </label>
                    <input
                      id="attachmentNotesInput"
                      type="text"
                      className="form-control"
                      placeholder="Reference diagnostic logs or screenshots..."
                      value={attachmentNotes}
                      onChange={(e) => setAttachmentNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-zg-primary fw-semibold"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Saving..."
                      : editingAction
                      ? "Update Action"
                      : "Save Action"}
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

