import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { fetchTicketDetail, uploadAttachment, softRemoveAttachment, getAttachmentDownloadUrl, } from "../api.js";
export const TicketDetailView = ({ currentRequester, ticketId, onBack, }) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Modals & Actions State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [selectedRemoveAttachment, setSelectedRemoveAttachment] = useState(null);
    const [removalReason, setRemovalReason] = useState("");
    const [removing, setRemoving] = useState(false);
    const [removeError, setRemoveError] = useState(null);
    const loadDetail = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTicketDetail(currentRequester.id, ticketId);
            setTicket(data);
        }
        catch (err) {
            setError({
                message: err.message || "Failed to load ticket details",
                status: err.status,
                code: err.code,
            });
        }
        finally {
            setLoading(false);
        }
    }, [currentRequester.id, ticketId]);
    useEffect(() => {
        loadDetail();
    }, [loadDetail]);
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!uploadFile)
            return;
        setUploading(true);
        setUploadError(null);
        try {
            await uploadAttachment(currentRequester.id, ticketId, uploadFile);
            setShowUploadModal(false);
            setUploadFile(null);
            await loadDetail();
        }
        catch (err) {
            setUploadError(err.message || "Failed to upload file");
        }
        finally {
            setUploading(false);
        }
    };
    const handleSoftRemoveSubmit = async (e) => {
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
        }
        catch (err) {
            setRemoveError(err.message || "Failed to remove attachment");
        }
        finally {
            setRemoving(false);
        }
    };
    const renderPriorityBadge = (priority) => {
        const p = priority.toUpperCase();
        const cls = p === "URGENT"
            ? "badge-priority-urgent"
            : p === "HIGH"
                ? "badge-priority-high"
                : p === "MEDIUM"
                    ? "badge-priority-medium"
                    : "badge-priority-low";
        return _jsx("span", { className: `badge ${cls} px-2 py-1`, children: priority });
    };
    const renderStatusBadge = (status) => {
        const s = status.toUpperCase();
        const cls = s === "NEW"
            ? "badge-status-new"
            : s === "IN_PROGRESS"
                ? "badge-status-in_progress"
                : s === "RESOLVED"
                    ? "badge-status-resolved"
                    : "badge-status-closed";
        return _jsx("span", { className: `badge ${cls} px-2 py-1`, children: status.replace("_", " ") });
    };
    if (loading) {
        return (_jsx("div", { className: "container py-5 text-center", children: _jsx("div", { className: "spinner-border text-success", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading ticket details..." }) }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "container py-5", children: [_jsx("button", { className: "btn btn-outline-secondary btn-sm mb-4", onClick: onBack, children: "\u2190 Back to My Tickets" }), _jsxs("div", { className: "zg-card p-4 border-danger shadow-sm", children: [_jsxs("div", { className: "d-flex align-items-center gap-3 text-danger mb-3", children: [_jsx("span", { className: "fs-1", children: "\uD83D\uDEAB" }), _jsxs("div", { children: [_jsx("h2", { className: "h4 fw-bold mb-1", children: error.status === 403 ? "403 Forbidden - Access Denied" : "Error Loading Ticket" }), _jsx("p", { className: "mb-0 text-muted", children: error.message })] })] }), error.status === 403 && (_jsxs("div", { className: "alert alert-warning py-2 small mb-0", children: [_jsx("strong", { children: "Ownership Security Check:" }), " Lab 2 enforces strict ticket ownership isolation. You cannot view or modify tickets belonging to another Requester."] }))] })] }));
    }
    if (!ticket)
        return null;
    const activeAttachments = (ticket.attachments || []).filter((a) => !a.isRemoved);
    const removedAttachments = (ticket.attachments || []).filter((a) => a.isRemoved);
    return (_jsxs("div", { className: "container py-4", style: { maxWidth: 960 }, children: [_jsxs("div", { className: "d-flex align-items-center justify-content-between mb-4", children: [_jsx("button", { className: "btn btn-outline-secondary btn-sm", onClick: onBack, children: "\u2190 Back to My Tickets" }), _jsxs("div", { className: "d-flex align-items-center gap-2", children: [_jsx("span", { className: "text-muted small", children: "Status:" }), renderStatusBadge(ticket.status)] })] }), _jsxs("div", { className: "zg-card p-4 shadow-sm mb-4", children: [_jsxs("div", { className: "border-bottom pb-3 mb-4", children: [_jsxs("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2", children: [_jsx("h2", { className: "h3 fw-bold m-0", style: { color: "#D81B60" }, children: ticket.ticketNo }), _jsx("div", { children: renderPriorityBadge(ticket.requestedPriority) })] }), _jsx("h1", { className: "h5 fw-semibold text-dark m-0", children: ticket.summary })] }), _jsxs("div", { className: "row g-3 mb-4 p-3 rounded-3 bg-light", children: [_jsxs("div", { className: "col-md-3 col-6", children: [_jsx("label", { className: "form-label text-muted small fw-semibold", children: "Requester" }), _jsx("div", { className: "fw-semibold text-dark", children: ticket.requester?.name || currentRequester.name })] }), _jsxs("div", { className: "col-md-3 col-6", children: [_jsx("label", { className: "form-label text-muted small fw-semibold", children: "Category" }), _jsx("div", { children: _jsx("span", { className: "badge bg-white text-dark border", children: ticket.category?.name }) })] }), _jsxs("div", { className: "col-md-3 col-6", children: [_jsx("label", { className: "form-label text-muted small fw-semibold", children: "Related System" }), _jsx("div", { children: _jsx("span", { className: "badge bg-white text-dark border", children: ticket.relatedSystem?.name }) })] }), _jsxs("div", { className: "col-md-3 col-6", children: [_jsx("label", { className: "form-label text-muted small fw-semibold", children: "Submitted On" }), _jsx("div", { className: "text-muted small", children: new Date(ticket.createdAt).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        }) })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h5", { className: "fw-bold mb-2", children: "Description" }), _jsx("div", { className: "p-3 rounded-3 bg-white border", style: { whiteSpace: "pre-wrap", minHeight: 100, color: "#1F2925" }, children: ticket.description })] }), _jsxs("div", { className: "border-top pt-4", children: [_jsxs("div", { className: "d-flex align-items-center justify-content-between mb-3", children: [_jsxs("h5", { className: "fw-bold m-0", children: ["Supporting Attachments (", activeAttachments.length, " / 5 Active)"] }), _jsx("button", { className: "btn btn-sm btn-zg-primary", onClick: () => setShowUploadModal(true), disabled: activeAttachments.length >= 5, children: "\u2795 Add Attachment" })] }), activeAttachments.length > 0 && (_jsx("div", { className: "list-group mb-3", children: activeAttachments.map((att) => (_jsxs("div", { className: "list-group-item d-flex align-items-center justify-content-between py-2 px-3", children: [_jsxs("div", { className: "d-flex align-items-center gap-3 overflow-hidden me-2", children: [_jsx("span", { className: "fs-5", children: att.mimeType.includes("pdf") ? "📄" : "🖼️" }), _jsxs("div", { children: [_jsx("div", { className: "fw-semibold text-dark text-truncate", style: { maxWidth: 320 }, children: att.fileName }), _jsxs("div", { className: "text-muted small", children: [(att.fileSize / 1024).toFixed(1), " KB \u2022 Attached ", new Date(att.createdAt).toLocaleDateString()] })] })] }), _jsxs("div", { className: "d-flex align-items-center gap-2", children: [_jsx("a", { href: getAttachmentDownloadUrl(att.id), target: "_blank", rel: "noopener noreferrer", className: "btn btn-sm btn-outline-primary", title: "Download file", children: "\u2193 Download" }), _jsx("button", { className: "btn btn-sm btn-outline-danger", onClick: () => setSelectedRemoveAttachment(att), title: "Soft-remove attachment", children: "\uD83D\uDDD1\uFE0F Remove" })] })] }, att.id))) })), removedAttachments.length > 0 && (_jsxs("div", { className: "mt-3", children: [_jsxs("p", { className: "fw-semibold text-muted small mb-2", children: ["Soft-Removed Attachments (", removedAttachments.length, "):"] }), _jsx("div", { className: "list-group", children: removedAttachments.map((att) => (_jsxs("div", { className: "list-group-item bg-light d-flex align-items-center justify-content-between py-2 px-3 text-muted", children: [_jsxs("div", { className: "d-flex align-items-center gap-3 overflow-hidden me-2", children: [_jsx("span", { className: "fs-5", children: "\uD83D\uDEAB" }), _jsxs("div", { children: [_jsx("div", { className: "text-decoration-line-through fw-semibold text-truncate", style: { maxWidth: 300 }, children: att.fileName }), _jsxs("div", { className: "small text-danger", children: ["Reason: \"", att.removalReason || "No reason specified", "\""] })] })] }), _jsxs("div", { className: "d-flex align-items-center gap-2", children: [_jsx("span", { className: "badge bg-secondary", children: "Removed" }), _jsx("button", { className: "btn btn-sm btn-outline-secondary disabled", disabled: true, children: "Blocked" })] })] }, att.id))) })] })), activeAttachments.length === 0 && removedAttachments.length === 0 && (_jsx("p", { className: "text-muted small m-0 italic", children: "No attachments added to this ticket." }))] })] }), showUploadModal && (_jsx("div", { className: "modal show d-block bg-dark bg-opacity-50", tabIndex: -1, children: _jsx("div", { className: "modal-dialog modal-dialog-centered", children: _jsx("div", { className: "modal-content zg-card", children: _jsxs("form", { onSubmit: handleUploadSubmit, children: [_jsxs("div", { className: "modal-header border-bottom", children: [_jsx("h5", { className: "modal-title fw-bold", children: "Add Permitted Attachment" }), _jsx("button", { type: "button", className: "btn-close", onClick: () => setShowUploadModal(false) })] }), _jsxs("div", { className: "modal-body", children: [_jsxs("p", { className: "text-muted small mb-3", children: ["Select a file to attach to ticket ", _jsx("strong", { children: ticket.ticketNo }), ". Allowed: JPG, PNG, WEBP, PDF (Max 5MB)."] }), uploadError && _jsx("div", { className: "alert alert-danger py-2 small mb-3", children: uploadError }), _jsx("input", { type: "file", className: "form-control", accept: "image/jpeg,image/png,image/webp,application/pdf", onChange: (e) => setUploadFile(e.target.files?.[0] || null), required: true })] }), _jsxs("div", { className: "modal-footer border-top", children: [_jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setShowUploadModal(false), children: "Cancel" }), _jsx("button", { type: "submit", className: "btn btn-zg-primary", disabled: !uploadFile || uploading, children: uploading ? "Uploading..." : "Upload File" })] })] }) }) }) })), selectedRemoveAttachment && (_jsx("div", { className: "modal show d-block bg-dark bg-opacity-50", tabIndex: -1, children: _jsx("div", { className: "modal-dialog modal-dialog-centered", children: _jsx("div", { className: "modal-content zg-card", children: _jsxs("form", { onSubmit: handleSoftRemoveSubmit, children: [_jsxs("div", { className: "modal-header border-bottom", children: [_jsx("h5", { className: "modal-title text-danger fw-bold", children: "Confirm Attachment Soft-Removal" }), _jsx("button", { type: "button", className: "btn-close", onClick: () => setSelectedRemoveAttachment(null) })] }), _jsxs("div", { className: "modal-body", children: [_jsxs("p", { className: "mb-2", children: ["Are you sure you want to soft-remove attachment ", _jsx("strong", { children: selectedRemoveAttachment.fileName }), "?"] }), _jsx("p", { className: "text-muted small mb-3", children: "Soft-removal will permanently block downloading and previewing for all users while preserving metadata for compliance." }), removeError && _jsx("div", { className: "alert alert-danger py-2 small mb-3", children: removeError }), _jsxs("label", { className: "form-label fw-semibold", children: ["Mandatory Removal Reason ", _jsx("span", { className: "zg-required-asterisk", children: "*" })] }), _jsx("textarea", { className: "form-control", rows: 3, placeholder: "Enter reason for removal (e.g. Uploaded wrong file, contains sensitive data)...", value: removalReason, onChange: (e) => setRemovalReason(e.target.value), required: true })] }), _jsxs("div", { className: "modal-footer border-top", children: [_jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setSelectedRemoveAttachment(null), children: "Cancel" }), _jsx("button", { type: "submit", className: "btn btn-danger fw-bold", disabled: !removalReason.trim() || removing, children: removing ? "Removing..." : "Soft-Remove Attachment" })] })] }) }) }) }))] }));
};
