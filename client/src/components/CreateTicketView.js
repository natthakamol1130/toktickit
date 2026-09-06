import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { fetchCategories, fetchRelatedSystems, createTicket } from "../api.js";
export const CreateTicketView = ({ currentRequester, onTicketCreated, onCancel, }) => {
    const [categories, setCategories] = useState([]);
    const [systems, setSystems] = useState([]);
    const [loadingRefData, setLoadingRefData] = useState(true);
    // Form State
    const [categoryId, setCategoryId] = useState("");
    const [relatedSystemId, setRelatedSystemId] = useState("");
    const [requestedPriority, setRequestedPriority] = useState("MEDIUM");
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    // UI & Validation State
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [globalError, setGlobalError] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [createdTicket, setCreatedTicket] = useState(null);
    useEffect(() => {
        Promise.all([fetchCategories(), fetchRelatedSystems()])
            .then(([cats, sys]) => {
            setCategories(cats);
            setSystems(sys);
            if (cats.length > 0)
                setCategoryId(cats[0].id.toString());
            if (sys.length > 0)
                setRelatedSystemId(sys[0].id.toString());
        })
            .catch((err) => setGlobalError(err.message))
            .finally(() => setLoadingRefData(false));
    }, []);
    const handleFileChange = (e) => {
        setFileError(null);
        if (!e.target.files)
            return;
        const newFiles = Array.from(e.target.files);
        const allowedMime = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        let err = null;
        if (selectedFiles.length + newFiles.length > 5) {
            err = "Maximum limit of 5 attachments per ticket reached";
        }
        const validFiles = [];
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
        }
        else {
            setSelectedFiles((prev) => [...prev, ...validFiles]);
        }
    };
    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setFileError(null);
    };
    const validate = () => {
        const errors = {};
        if (!categoryId)
            errors.categoryId = "Category is required";
        if (!relatedSystemId)
            errors.relatedSystemId = "Related system is required";
        if (!summary || summary.trim().length < 5 || summary.trim().length > 150) {
            errors.summary = "Summary must be between 5 and 150 characters";
        }
        if (!description || description.trim().length < 10 || description.trim().length > 2000) {
            errors.description = "Description must be between 10 and 2000 characters";
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setGlobalError(null);
        if (!validate())
            return;
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
        }
        catch (err) {
            if (err.details) {
                const mapped = {};
                Object.keys(err.details).forEach((key) => {
                    mapped[key] = Array.isArray(err.details[key]) ? err.details[key][0] : err.details[key];
                });
                setFieldErrors(mapped);
            }
            setGlobalError(err.message || "Failed to create ticket");
        }
        finally {
            setSubmitting(false);
        }
    };
    if (createdTicket) {
        return (_jsx("div", { className: "container py-5 d-flex justify-content-center", children: _jsxs("div", { className: "zg-card p-4 text-center shadow-sm", style: { maxWidth: 600, width: "100%" }, children: [_jsx("div", { className: "text-success display-1 mb-3", children: "\u2705" }), _jsx("h2", { className: "h3 fw-bold text-success mb-2", children: "Ticket Created Successfully!" }), _jsx("p", { className: "text-muted mb-4", children: "Your IT support request has been recorded." }), _jsxs("div", { className: "bg-light p-3 rounded-3 mb-4 text-start", children: [_jsxs("div", { className: "row mb-2", children: [_jsx("div", { className: "col-4 fw-semibold text-muted", children: "Ticket Number:" }), _jsx("div", { className: "col-8 fw-bold fs-5 text-primary", children: createdTicket.ticketNo })] }), _jsxs("div", { className: "row mb-2", children: [_jsx("div", { className: "col-4 fw-semibold text-muted", children: "Status:" }), _jsx("div", { className: "col-8", children: _jsx("span", { className: "badge badge-status-new", children: "NEW" }) })] }), _jsxs("div", { className: "row mb-2", children: [_jsx("div", { className: "col-4 fw-semibold text-muted", children: "Summary:" }), _jsx("div", { className: "col-8 text-dark", children: createdTicket.summary })] })] }), _jsxs("div", { className: "d-flex justify-content-center gap-3", children: [_jsx("button", { className: "btn btn-outline-secondary", onClick: () => {
                                    setCreatedTicket(null);
                                    setSummary("");
                                    setDescription("");
                                    setSelectedFiles([]);
                                }, children: "\u2795 Create Another Ticket" }), _jsx("button", { className: "btn btn-zg-primary", onClick: () => onTicketCreated(createdTicket), children: "\uD83D\uDCCB View My Tickets" })] })] }) }));
    }
    return (_jsxs("div", { className: "container py-4", style: { maxWidth: 900 }, children: [_jsxs("div", { className: "d-flex align-items-center justify-content-between mb-4", children: [_jsx("h1", { className: "h3 fw-bold m-0", style: { color: "#D81B60" }, children: "Create IT Support Ticket" }), _jsx("button", { className: "btn btn-outline-secondary btn-sm", onClick: onCancel, children: "\u2190 Back to My Tickets" })] }), globalError && (_jsxs("div", { className: "alert alert-danger d-flex align-items-center gap-2 mb-4", role: "alert", children: [_jsx("span", { children: "\u26A0\uFE0F" }), _jsx("div", { children: globalError })] })), loadingRefData ? (_jsx("div", { className: "text-center py-5", children: _jsx("div", { className: "spinner-border text-success", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading reference data..." }) }) })) : (_jsxs("form", { onSubmit: handleSubmit, noValidate: true, children: [_jsxs("div", { className: "zg-card p-4 mb-4", children: [_jsx("h5", { className: "fw-bold mb-3 border-bottom pb-2", children: "1. Ticket Metadata (Read-Only)" }), _jsxs("div", { className: "row g-3 mb-4", children: [_jsxs("div", { className: "col-md-4", children: [_jsx("label", { className: "form-label text-muted small fw-semibold", children: "Ticket No." }), _jsx("input", { type: "text", className: "form-control zg-read-only-field", value: "Auto-generated after submission", disabled: true })] }), _jsxs("div", { className: "col-md-4", children: [_jsx("label", { className: "form-label text-muted small fw-semibold", children: "Requester" }), _jsx("input", { type: "text", className: "form-control zg-read-only-field", value: `${currentRequester.name} (${currentRequester.department})`, disabled: true })] }), _jsxs("div", { className: "col-md-4", children: [_jsx("label", { className: "form-label text-muted small fw-semibold", children: "Initial Status" }), _jsx("input", { type: "text", className: "form-control zg-read-only-field", value: "New", disabled: true })] })] }), _jsx("h5", { className: "fw-bold mb-3 border-bottom pb-2", children: "2. Problem Classification" }), _jsxs("div", { className: "row g-3 mb-4", children: [_jsxs("div", { className: "col-md-4", children: [_jsxs("label", { className: "form-label fw-semibold", children: ["Category ", _jsx("span", { className: "zg-required-asterisk", children: "*" })] }), _jsx("select", { className: `form-select ${fieldErrors.categoryId ? "is-invalid" : ""}`, value: categoryId, onChange: (e) => setCategoryId(e.target.value), children: categories.map((c) => (_jsx("option", { value: c.id, children: c.name }, c.id))) }), fieldErrors.categoryId && (_jsx("div", { className: "invalid-feedback", children: fieldErrors.categoryId }))] }), _jsxs("div", { className: "col-md-4", children: [_jsxs("label", { className: "form-label fw-semibold", children: ["Related System ", _jsx("span", { className: "zg-required-asterisk", children: "*" })] }), _jsx("select", { className: `form-select ${fieldErrors.relatedSystemId ? "is-invalid" : ""}`, value: relatedSystemId, onChange: (e) => setRelatedSystemId(e.target.value), children: systems.map((s) => (_jsx("option", { value: s.id, children: s.name }, s.id))) }), fieldErrors.relatedSystemId && (_jsx("div", { className: "invalid-feedback", children: fieldErrors.relatedSystemId }))] }), _jsxs("div", { className: "col-md-4", children: [_jsx("label", { className: "form-label fw-semibold", children: "Requested Priority" }), _jsxs("select", { className: "form-select", value: requestedPriority, onChange: (e) => setRequestedPriority(e.target.value), children: [_jsx("option", { value: "LOW", children: "Low" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HIGH", children: "High" }), _jsx("option", { value: "URGENT", children: "Urgent" })] })] })] }), _jsx("h5", { className: "fw-bold mb-3 border-bottom pb-2", children: "3. Problem Details" }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "d-flex justify-content-between", children: [_jsxs("label", { className: "form-label fw-semibold", children: ["Ticket Summary ", _jsx("span", { className: "zg-required-asterisk", children: "*" })] }), _jsxs("span", { className: "text-muted small", children: [summary.length, " / 150"] })] }), _jsx("input", { type: "text", className: `form-control ${fieldErrors.summary ? "is-invalid" : ""}`, placeholder: "Briefly describe the issue (e.g. Laptop battery drains quickly)", value: summary, maxLength: 150, onChange: (e) => setSummary(e.target.value) }), fieldErrors.summary && (_jsx("div", { className: "invalid-feedback", children: fieldErrors.summary }))] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "d-flex justify-content-between", children: [_jsxs("label", { className: "form-label fw-semibold", children: ["Description ", _jsx("span", { className: "zg-required-asterisk", children: "*" })] }), _jsxs("span", { className: "text-muted small", children: [description.length, " / 2000"] })] }), _jsx("textarea", { className: `form-control ${fieldErrors.description ? "is-invalid" : ""}`, rows: 5, placeholder: "Provide details about what happened, steps to reproduce, or error messages...", value: description, maxLength: 2000, onChange: (e) => setDescription(e.target.value) }), fieldErrors.description && (_jsx("div", { className: "invalid-feedback", children: fieldErrors.description }))] }), _jsx("h5", { className: "fw-bold mb-3 border-bottom pb-2", children: "4. Supporting Evidence Attachments" }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "zg-dropzone", onClick: () => document.getElementById("fileInput")?.click(), children: [_jsx("span", { className: "fs-3", children: "\uD83D\uDCC1" }), _jsx("p", { className: "mb-1 fw-semibold", children: "Click to select supporting files" }), _jsx("p", { className: "text-muted small mb-0", children: "Permitted: JPG, PNG, WEBP, PDF (Max 5MB per file, Max 5 active attachments)" }), _jsx("input", { id: "fileInput", type: "file", multiple: true, accept: "image/jpeg,image/png,image/webp,application/pdf", className: "d-none", onChange: handleFileChange })] }), fileError && (_jsx("div", { className: "alert alert-danger py-2 mt-2 small", role: "alert", children: fileError })), selectedFiles.length > 0 && (_jsxs("div", { className: "mt-3", children: [_jsxs("p", { className: "fw-semibold small mb-2", children: ["Selected Attachments (", selectedFiles.length, " / 5):"] }), _jsx("ul", { className: "list-group", children: selectedFiles.map((file, idx) => (_jsxs("li", { className: "list-group-item d-flex justify-content-between align-items-center py-2 px-3", children: [_jsxs("div", { className: "d-flex align-items-center gap-2 overflow-hidden me-2", children: [_jsx("span", { children: file.type.includes("pdf") ? "📄" : "🖼️" }), _jsx("span", { className: "text-truncate", children: file.name }), _jsxs("span", { className: "badge bg-light text-dark border", children: [(file.size / 1024 / 1024).toFixed(2), " MB"] })] }), _jsx("button", { type: "button", className: "btn btn-sm btn-outline-danger", onClick: () => removeFile(idx), children: "\u2715" })] }, idx))) })] }))] })] }), _jsxs("div", { className: "d-flex justify-content-end gap-3", children: [_jsx("button", { type: "button", className: "btn btn-outline-secondary px-4", onClick: onCancel, disabled: submitting, children: "Cancel" }), _jsx("button", { type: "submit", className: "btn btn-zg-primary px-5 fw-bold", disabled: submitting, children: submitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "spinner-border spinner-border-sm me-2", role: "status", "aria-hidden": "true" }), "Submitting Ticket..."] })) : ("Submit Ticket") })] })] }))] }));
};
