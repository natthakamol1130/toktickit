import React, { useState, useEffect } from "react";
import { RequesterUser, Category, RelatedSystem, Priority, Ticket } from "../types.js";
import { fetchCategories, fetchRelatedSystems, createTicket } from "../api.js";

interface CreateTicketViewProps {
  currentRequester: RequesterUser;
  onTicketCreated: (ticket: Ticket) => void;
  onCancel: () => void;
}

export const CreateTicketView: React.FC<CreateTicketViewProps> = ({
  currentRequester,
  onTicketCreated,
  onCancel,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [systems, setSystems] = useState<RelatedSystem[]>([]);
  const [loadingRefData, setLoadingRefData] = useState<boolean>(true);

  // Form State
  const [categoryId, setCategoryId] = useState<string>("");
  const [relatedSystemId, setRelatedSystemId] = useState<string>("");
  const [requestedPriority, setRequestedPriority] = useState<Priority>("MEDIUM");
  const [summary, setSummary] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // UI & Validation State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchRelatedSystems()])
      .then(([cats, sys]) => {
        setCategories(cats);
        setSystems(sys);
        if (cats.length > 0) setCategoryId(cats[0].id.toString());
        if (sys.length > 0) setRelatedSystemId(sys[0].id.toString());
      })
      .catch((err) => setGlobalError(err.message))
      .finally(() => setLoadingRefData(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    const allowedMime = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    let err: string | null = null;

    if (selectedFiles.length + newFiles.length > 5) {
      err = "Maximum limit of 5 attachments per ticket reached";
    }

    const validFiles: File[] = [];
    for (const f of newFiles) {
      if (!allowedMime.includes(f.type)) {
        err = `Invalid file type for '${f.name}'. Allowed: JPG, PNG, WEBP, PDF`;
        break;
      }
      if (f.size > 5 * 1024 * 1024) {
        err = `File '${f.name}' exceeds maximum size of 5MB`;
        break;
      }
      validFiles.push(f);
    }

    if (err) {
      setFileError(err);
    } else {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!categoryId) errors.categoryId = "Category is required";
    if (!relatedSystemId) errors.relatedSystemId = "Related system is required";
    if (!summary || summary.trim().length < 5 || summary.trim().length > 150) {
      errors.summary = "Summary must be between 5 and 150 characters";
    }
    if (!description || description.trim().length < 10 || description.trim().length > 2000) {
      errors.description = "Description must be between 10 and 2000 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("categoryId", categoryId);
      formData.append("relatedSystemId", relatedSystemId);
      formData.append("requestedPriority", requestedPriority);
      formData.append("summary", summary);
      formData.append("description", description);
      selectedFiles.forEach((file) => formData.append("files", file));

      const ticket = await createTicket(currentRequester.id, formData);
      setCreatedTicket(ticket);
    } catch (err: any) {
      if (err.details) {
        const mapped: Record<string, string> = {};
        Object.keys(err.details).forEach((key) => {
          mapped[key] = Array.isArray(err.details[key]) ? err.details[key][0] : err.details[key];
        });
        setFieldErrors(mapped);
      }
      setGlobalError(err.message || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  if (createdTicket) {
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="zg-card p-4 text-center shadow-sm" style={{ maxWidth: 600, width: "100%" }}>
          <div className="text-success display-1 mb-3">✅</div>
          <h2 className="h3 fw-bold text-success mb-2">Ticket Created Successfully!</h2>
          <p className="text-muted mb-4">Your IT support request has been recorded.</p>

          <div className="bg-light p-3 rounded-3 mb-4 text-start">
            <div className="row mb-2">
              <div className="col-4 fw-semibold text-muted">Ticket Number:</div>
              <div className="col-8 fw-bold fs-5 text-primary">{createdTicket.ticketNo}</div>
            </div>
            <div className="row mb-2">
              <div className="col-4 fw-semibold text-muted">Status:</div>
              <div className="col-8"><span className="badge badge-status-new">NEW</span></div>
            </div>
            <div className="row mb-2">
              <div className="col-4 fw-semibold text-muted">Summary:</div>
              <div className="col-8 text-dark">{createdTicket.summary}</div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setCreatedTicket(null);
                setSummary("");
                setDescription("");
                setSelectedFiles([]);
              }}
            >
              ➕ Create Another Ticket
            </button>
            <button
              className="btn btn-zg-primary"
              onClick={() => onTicketCreated(createdTicket)}
            >
              📋 View My Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 fw-bold m-0" style={{ color: "#D81B60" }}>Create IT Support Ticket</h1>
        <button className="btn btn-outline-secondary btn-sm" onClick={onCancel}>
          ← Back to My Tickets
        </button>
      </div>

      {globalError && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <span>⚠️</span>
          <div>{globalError}</div>
        </div>
      )}

      {loadingRefData ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading reference data...</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="zg-card p-4 mb-4">
            {/* System Generated Fields */}
            <h5 className="fw-bold mb-3 border-bottom pb-2">1. Ticket Metadata (Read-Only)</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label text-muted small fw-semibold">Ticket No.</label>
                <input
                  type="text"
                  className="form-control zg-read-only-field"
                  value="Auto-generated after submission"
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small fw-semibold">Requester</label>
                <input
                  type="text"
                  className="form-control zg-read-only-field"
                  value={`${currentRequester.name} (${currentRequester.department})`}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted small fw-semibold">Initial Status</label>
                <input
                  type="text"
                  className="form-control zg-read-only-field"
                  value="New"
                  disabled
                />
              </div>
            </div>

            {/* Classification */}
            <h5 className="fw-bold mb-3 border-bottom pb-2">2. Problem Classification</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Category <span className="zg-required-asterisk">*</span>
                </label>
                <select
                  className={`form-select ${fieldErrors.categoryId ? "is-invalid" : ""}`}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.categoryId && (
                  <div className="invalid-feedback">{fieldErrors.categoryId}</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Related System <span className="zg-required-asterisk">*</span>
                </label>
                <select
                  className={`form-select ${fieldErrors.relatedSystemId ? "is-invalid" : ""}`}
                  value={relatedSystemId}
                  onChange={(e) => setRelatedSystemId(e.target.value)}
                >
                  {systems.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {fieldErrors.relatedSystemId && (
                  <div className="invalid-feedback">{fieldErrors.relatedSystemId}</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Requested Priority</label>
                <select
                  className="form-select"
                  value={requestedPriority}
                  onChange={(e) => setRequestedPriority(e.target.value as Priority)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            {/* Problem Details */}
            <h5 className="fw-bold mb-3 border-bottom pb-2">3. Problem Details</h5>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label fw-semibold">
                  Ticket Summary <span className="zg-required-asterisk">*</span>
                </label>
                <span className="text-muted small">{summary.length} / 150</span>
              </div>
              <input
                type="text"
                className={`form-control ${fieldErrors.summary ? "is-invalid" : ""}`}
                placeholder="Briefly describe the issue (e.g. Laptop battery drains quickly)"
                value={summary}
                maxLength={150}
                onChange={(e) => setSummary(e.target.value)}
              />
              {fieldErrors.summary && (
                <div className="invalid-feedback">{fieldErrors.summary}</div>
              )}
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between">
                <label className="form-label fw-semibold">
                  Description <span className="zg-required-asterisk">*</span>
                </label>
                <span className="text-muted small">{description.length} / 2000</span>
              </div>
              <textarea
                className={`form-control ${fieldErrors.description ? "is-invalid" : ""}`}
                rows={5}
                placeholder="Provide details about what happened, steps to reproduce, or error messages..."
                value={description}
                maxLength={2000}
                onChange={(e) => setDescription(e.target.value)}
              />
              {fieldErrors.description && (
                <div className="invalid-feedback">{fieldErrors.description}</div>
              )}
            </div>

            {/* Attachments */}
            <h5 className="fw-bold mb-3 border-bottom pb-2">4. Supporting Evidence Attachments</h5>
            <div className="mb-3">
              <div className="zg-dropzone" onClick={() => document.getElementById("fileInput")?.click()}>
                <span className="fs-3">📁</span>
                <p className="mb-1 fw-semibold">Click to select supporting files</p>
                <p className="text-muted small mb-0">
                  Permitted: JPG, PNG, WEBP, PDF (Max 5MB per file, Max 5 active attachments)
                </p>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="d-none"
                  onChange={handleFileChange}
                />
              </div>

              {fileError && (
                <div className="alert alert-danger py-2 mt-2 small" role="alert">
                  {fileError}
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="mt-3">
                  <p className="fw-semibold small mb-2">Selected Attachments ({selectedFiles.length} / 5):</p>
                  <ul className="list-group">
                    {selectedFiles.map((file, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between align-items-center py-2 px-3"
                      >
                        <div className="d-flex align-items-center gap-2 overflow-hidden me-2">
                          <span>{file.type.includes("pdf") ? "📄" : "🖼️"}</span>
                          <span className="text-truncate">{file.name}</span>
                          <span className="badge bg-light text-dark border">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFile(idx)}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Submission Actions */}
          <div className="d-flex justify-content-end gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-zg-primary px-5 fw-bold"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Submitting Ticket...
                </>
              ) : (
                "Submit Ticket"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
