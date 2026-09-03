import React, { useEffect, useState, useCallback } from "react";
import { RequesterUser, Ticket, Attachment } from "../types.js";
import {
  fetchTicketDetail,
  uploadAttachment,
  softRemoveAttachment,
  getAttachmentDownloadUrl,
} from "../api.js";

interface TicketDetailViewProps {
  currentRequester: RequesterUser;
  ticketId: number;
  onBack: () => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  currentRequester,
  ticketId,
  onBack,
}) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{ message: string; status?: number; code?: string } | null>(null);

  // Modals & Actions State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [selectedRemoveAttachment, setSelectedRemoveAttachment] = useState<Attachment | null>(null);
  const [removalReason, setRemovalReason] = useState<string>("");
  const [removing, setRemoving] = useState<boolean>(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTicketDetail(currentRequester.id, ticketId);
      setTicket(data);
    } catch (err: any) {
      setError({
        message: err.message || "Failed to load ticket details",
        status: err.status,
        code: err.code,
      });
    } finally {
      setLoading(false);
    }
  }, [currentRequester.id, ticketId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadError(null);
    try {
      await uploadAttachment(currentRequester.id, ticketId, uploadFile);
      setShowUploadModal(false);
      setUploadFile(null);
      await loadDetail();
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSoftRemoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRemoveAttachment || !removalReason.trim()) {
      setRemoveError("Removal reason is required");
      return;
    }

    setRemoving(true);
    setRemoveError(null);
    try {
      await softRemoveAttachment(currentRequester.id, selectedRemoveAttachment.id, removalReason);
      setSelectedRemoveAttachment(null);
      setRemovalReason("");
      await loadDetail();
    } catch (err: any) {
      setRemoveError(err.message || "Failed to remove attachment");
    } finally {
      setRemoving(false);
    }
  };

  const renderPriorityBadge = (priority: string) => {
    const p = priority.toUpperCase();
    const cls =
      p === "URGENT"
        ? "badge-priority-urgent"
        : p === "HIGH"
        ? "badge-priority-high"
        : p === "MEDIUM"
        ? "badge-priority-medium"
        : "badge-priority-low";
    return <span className={`badge ${cls} px-2 py-1`}>{priority}</span>;
  };

  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    const cls =
      s === "NEW"
        ? "badge-status-new"
        : s === "IN_PROGRESS"
        ? "badge-status-in_progress"
        : s === "RESOLVED"
        ? "badge-status-resolved"
        : "badge-status-closed";
    return <span className={`badge ${cls} px-2 py-1`}>{status.replace("_", " ")}</span>;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading ticket details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <button className="btn btn-outline-secondary btn-sm mb-4" onClick={onBack}>
          ← Back to My Tickets
        </button>
        <div className="zg-card p-4 border-danger shadow-sm">
          <div className="d-flex align-items-center gap-3 text-danger mb-3">
            <span className="fs-1">🚫</span>
            <div>
              <h2 className="h4 fw-bold mb-1">
                {error.status === 403 ? "403 Forbidden - Access Denied" : "Error Loading Ticket"}
              </h2>
              <p className="mb-0 text-muted">{error.message}</p>
            </div>
          </div>
          {error.status === 403 && (
            <div className="alert alert-warning py-2 small mb-0">
              <strong>Ownership Security Check:</strong> Lab 2 enforces strict ticket ownership isolation. You cannot view or modify tickets belonging to another Requester.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const activeAttachments = (ticket.attachments || []).filter((a) => !a.isRemoved);
  const removedAttachments = (ticket.attachments || []).filter((a) => a.isRemoved);

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      {/* Top Action Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={onBack}>
          ← Back to My Tickets
        </button>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">Status:</span>
          {renderStatusBadge(ticket.status)}
        </div>
      </div>

      {/* Main Ticket Container */}
      <div className="zg-card p-4 shadow-sm mb-4">
        {/* Ticket Header & Number */}
        <div className="border-bottom pb-3 mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
            <h2 className="h3 fw-bold text-success m-0">{ticket.ticketNo}</h2>
            <div>{renderPriorityBadge(ticket.requestedPriority)}</div>
          </div>
          <h1 className="h5 fw-semibold text-dark m-0">{ticket.summary}</h1>
        </div>

        {/* Read-Only Information Grid */}
        <div className="row g-3 mb-4 p-3 rounded-3 bg-light">
          <div className="col-md-3 col-6">
            <label className="form-label text-muted small fw-semibold">Requester</label>
            <div className="fw-semibold text-dark">{ticket.requester?.name || currentRequester.name}</div>
          </div>
          <div className="col-md-3 col-6">
            <label className="form-label text-muted small fw-semibold">Category</label>
            <div><span className="badge bg-white text-dark border">{ticket.category?.name}</span></div>
          </div>
          <div className="col-md-3 col-6">
            <label className="form-label text-muted small fw-semibold">Related System</label>
            <div><span className="badge bg-white text-dark border">{ticket.relatedSystem?.name}</span></div>
          </div>
          <div className="col-md-3 col-6">
            <label className="form-label text-muted small fw-semibold">Submitted On</label>
            <div className="text-muted small">
              {new Date(ticket.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          </div>
        </div>

        {/* Description Body */}
        <div className="mb-4">
          <h5 className="fw-bold mb-2">Description</h5>
          <div
            className="p-3 rounded-3 bg-white border"
            style={{ whiteSpace: "pre-wrap", minHeight: 100, color: "#1F2925" }}
          >
            {ticket.description}
          </div>
        </div>

        {/* Attachments Section */}
        <div className="border-top pt-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold m-0">
              Supporting Attachments ({activeAttachments.length} / 5 Active)
            </h5>
            <button
              className="btn btn-sm btn-zg-primary"
              onClick={() => setShowUploadModal(true)}
              disabled={activeAttachments.length >= 5}
            >
              ➕ Add Attachment
            </button>
          </div>

          {/* Active Attachments List */}
          {activeAttachments.length > 0 && (
            <div className="list-group mb-3">
              {activeAttachments.map((att) => (
                <div
                  key={att.id}
                  className="list-group-item d-flex align-items-center justify-content-between py-2 px-3"
                >
                  <div className="d-flex align-items-center gap-3 overflow-hidden me-2">
                    <span className="fs-5">{att.mimeType.includes("pdf") ? "📄" : "🖼️"}</span>
                    <div>
                      <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: 320 }}>
                        {att.fileName}
                      </div>
                      <div className="text-muted small">
                        {(att.fileSize / 1024).toFixed(1)} KB • Attached {new Date(att.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <a
                      href={getAttachmentDownloadUrl(att.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                      title="Download file"
                    >
                      ↓ Download
                    </a>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setSelectedRemoveAttachment(att)}
                      title="Soft-remove attachment"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Soft-Removed Attachments List */}
          {removedAttachments.length > 0 && (
            <div className="mt-3">
              <p className="fw-semibold text-muted small mb-2">Soft-Removed Attachments ({removedAttachments.length}):</p>
              <div className="list-group">
                {removedAttachments.map((att) => (
                  <div
                    key={att.id}
                    className="list-group-item bg-light d-flex align-items-center justify-content-between py-2 px-3 text-muted"
                  >
                    <div className="d-flex align-items-center gap-3 overflow-hidden me-2">
                      <span className="fs-5">🚫</span>
                      <div>
                        <div className="text-decoration-line-through fw-semibold text-truncate" style={{ maxWidth: 300 }}>
                          {att.fileName}
                        </div>
                        <div className="small text-danger">
                          Reason: "{att.removalReason || "No reason specified"}"
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-secondary">Removed</span>
                      <button className="btn btn-sm btn-outline-secondary disabled" disabled>
                        Blocked
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAttachments.length === 0 && removedAttachments.length === 0 && (
            <p className="text-muted small m-0 italic">No attachments added to this ticket.</p>
          )}
        </div>
      </div>

      {/* Upload Attachment Modal */}
      {showUploadModal && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content zg-card">
              <form onSubmit={handleUploadSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold">Add Permitted Attachment</h5>
                  <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)} />
                </div>
                <div className="modal-body">
                  <p className="text-muted small mb-3">
                    Select a file to attach to ticket <strong>{ticket.ticketNo}</strong>. Allowed: JPG, PNG, WEBP, PDF (Max 5MB).
                  </p>
                  {uploadError && <div className="alert alert-danger py-2 small mb-3">{uploadError}</div>}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-zg-primary" disabled={!uploadFile || uploading}>
                    {uploading ? "Uploading..." : "Upload File"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Soft Removal Confirmation Modal */}
      {selectedRemoveAttachment && (
        <div className="modal show d-block bg-dark bg-opacity-50" tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content zg-card">
              <form onSubmit={handleSoftRemoveSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title text-danger fw-bold">Confirm Attachment Soft-Removal</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedRemoveAttachment(null)}
                  />
                </div>
                <div className="modal-body">
                  <p className="mb-2">
                    Are you sure you want to soft-remove attachment <strong>{selectedRemoveAttachment.fileName}</strong>?
                  </p>
                  <p className="text-muted small mb-3">
                    Soft-removal will permanently block downloading and previewing for all users while preserving metadata for compliance.
                  </p>

                  {removeError && <div className="alert alert-danger py-2 small mb-3">{removeError}</div>}

                  <label className="form-label fw-semibold">
                    Mandatory Removal Reason <span className="zg-required-asterisk">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter reason for removal (e.g. Uploaded wrong file, contains sensitive data)..."
                    value={removalReason}
                    onChange={(e) => setRemovalReason(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedRemoveAttachment(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger fw-bold" disabled={!removalReason.trim() || removing}>
                    {removing ? "Removing..." : "Soft-Remove Attachment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
