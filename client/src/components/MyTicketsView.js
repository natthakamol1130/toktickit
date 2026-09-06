import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { fetchCategories, fetchTickets } from "../api.js";
export const MyTicketsView = ({ currentRequester, onSelectTicket, onCreateTicketClick, }) => {
    const [tickets, setTickets] = useState([]);
    const [meta, setMeta] = useState({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Filter & Search Controls State
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedPriority, setSelectedPriority] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        fetchCategories()
            .then(setCategories)
            .catch(() => { });
    }, []);
    const loadTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchTickets(currentRequester.id, {
                search,
                category: selectedCategory,
                priority: selectedPriority,
                status: selectedStatus,
                page: currentPage,
                limit: 10,
                sortBy,
                sortOrder,
            });
            setTickets(res.data);
            setMeta(res.meta);
        }
        catch (err) {
            setError(err.message || "Failed to load tickets");
        }
        finally {
            setLoading(false);
        }
    }, [currentRequester.id, search, selectedCategory, selectedPriority, selectedStatus, currentPage, sortBy, sortOrder]);
    useEffect(() => {
        loadTickets();
    }, [loadTickets]);
    const handleClearFilters = () => {
        setSearch("");
        setSelectedCategory("ALL");
        setSelectedPriority("ALL");
        setSelectedStatus("ALL");
        setSortBy("createdAt");
        setSortOrder("desc");
        setCurrentPage(1);
    };
    const isFiltered = search || selectedCategory !== "ALL" || selectedPriority !== "ALL" || selectedStatus !== "ALL";
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
    return (_jsxs("div", { className: "container py-4", children: [_jsxs("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "h3 fw-bold m-0", style: { color: "#D81B60" }, children: "My Tickets" }), _jsx("p", { className: "text-muted small m-0", children: "View and track all of your IT support requests" })] }), _jsx("button", { className: "btn btn-zg-primary fw-semibold", onClick: onCreateTicketClick, children: "\u2795 Create Ticket" })] }), _jsx("div", { className: "zg-card p-3 mb-4 shadow-sm", children: _jsxs("div", { className: "row g-2 align-items-center", children: [_jsx("div", { className: "col-lg-4 col-md-6", children: _jsxs("div", { className: "input-group", children: [_jsx("span", { className: "input-group-text bg-light border-end-0", children: "\uD83D\uDD0D" }), _jsx("input", { type: "text", className: "form-control border-start-0", placeholder: "Search by ticket number or summary...", value: search, onChange: (e) => {
                                            setSearch(e.target.value);
                                            setCurrentPage(1);
                                        } })] }) }), _jsx("div", { className: "col-lg-2 col-md-3 col-6", children: _jsxs("select", { className: "form-select", value: selectedCategory, onChange: (e) => {
                                    setSelectedCategory(e.target.value);
                                    setCurrentPage(1);
                                }, children: [_jsx("option", { value: "ALL", children: "All Categories" }), categories.map((c) => (_jsx("option", { value: c.id.toString(), children: c.name }, c.id)))] }) }), _jsx("div", { className: "col-lg-2 col-md-3 col-6", children: _jsxs("select", { className: "form-select", value: selectedPriority, onChange: (e) => {
                                    setSelectedPriority(e.target.value);
                                    setCurrentPage(1);
                                }, children: [_jsx("option", { value: "ALL", children: "All Priorities" }), _jsx("option", { value: "LOW", children: "Low" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HIGH", children: "High" }), _jsx("option", { value: "URGENT", children: "Urgent" })] }) }), _jsx("div", { className: "col-lg-2 col-md-3 col-6", children: _jsxs("select", { className: "form-select", value: selectedStatus, onChange: (e) => {
                                    setSelectedStatus(e.target.value);
                                    setCurrentPage(1);
                                }, children: [_jsx("option", { value: "ALL", children: "All Statuses" }), _jsx("option", { value: "NEW", children: "New" }), _jsx("option", { value: "IN_PROGRESS", children: "In Progress" }), _jsx("option", { value: "RESOLVED", children: "Resolved" }), _jsx("option", { value: "CLOSED", children: "Closed" })] }) }), _jsx("div", { className: "col-lg-2 col-md-3 col-6 text-end", children: isFiltered && (_jsx("button", { className: "btn btn-outline-danger btn-sm w-100", onClick: handleClearFilters, children: "\uD83D\uDD04 Clear Filters" })) })] }) }), error && (_jsx("div", { className: "alert alert-danger py-2 mb-4", role: "alert", children: error })), loading ? (_jsx("div", { className: "text-center py-5", children: _jsx("div", { className: "spinner-border text-success", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading tickets..." }) }) })) : tickets.length === 0 ? (isFiltered ? (
            /* No Results State */
            _jsxs("div", { className: "zg-card p-5 text-center my-4", children: [_jsx("div", { className: "fs-1 text-muted mb-2", children: "\uD83D\uDD0D" }), _jsx("h3", { className: "h5 fw-bold mb-2", children: "No Matching Tickets Found" }), _jsx("p", { className: "text-muted small mb-3", children: "No tickets match your search or filter criteria." }), _jsx("button", { className: "btn btn-outline-secondary btn-sm", onClick: handleClearFilters, children: "Clear All Filters" })] })) : (
            /* Empty State (No tickets owned) */
            _jsxs("div", { className: "zg-card p-5 text-center my-4", children: [_jsx("div", { className: "fs-1 text-success mb-2", children: "\uD83D\uDCE5" }), _jsx("h3", { className: "h5 fw-bold mb-2", children: "No IT Tickets Submitted Yet" }), _jsx("p", { className: "text-muted small mb-4", children: "You haven't submitted any support requests under this account." }), _jsx("button", { className: "btn btn-zg-primary px-4", onClick: onCreateTicketClick, children: "\u2795 Create Your First Ticket" })] }))) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "zg-card shadow-sm overflow-hidden mb-4 d-none d-md-block zg-desktop-table", children: _jsxs("table", { className: "table table-hover align-middle m-0", children: [_jsx("thead", { className: "table-light", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", children: "Ticket No" }), _jsx("th", { scope: "col", children: "Date" }), _jsx("th", { scope: "col", children: "Summary" }), _jsx("th", { scope: "col", children: "Category" }), _jsx("th", { scope: "col", children: "Requested Priority" }), _jsx("th", { scope: "col", children: "Status" }), _jsx("th", { scope: "col", className: "text-end", children: "Action" })] }) }), _jsx("tbody", { children: tickets.map((t) => (_jsxs("tr", { style: { cursor: "pointer" }, onClick: () => onSelectTicket(t.id), children: [_jsx("td", { className: "fw-bold text-success", children: t.ticketNo }), _jsx("td", { className: "text-muted small", children: new Date(t.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                }) }), _jsx("td", { className: "fw-semibold text-dark text-truncate", style: { maxWidth: 280 }, children: t.summary }), _jsx("td", { children: _jsx("span", { className: "badge bg-light text-dark border", children: t.category?.name }) }), _jsx("td", { children: renderPriorityBadge(t.requestedPriority) }), _jsx("td", { children: renderStatusBadge(t.status) }), _jsx("td", { className: "text-end", children: _jsx("button", { className: "btn btn-sm btn-outline-success", onClick: (e) => {
                                                        e.stopPropagation();
                                                        onSelectTicket(t.id);
                                                    }, children: "Open \u2192" }) })] }, t.id))) })] }) }), _jsx("div", { className: "zg-mobile-cards mb-4", children: _jsx("div", { className: "d-flex flex-column gap-3", children: tickets.map((t) => (_jsxs("div", { className: "zg-card p-3 shadow-sm cursor-pointer", onClick: () => onSelectTicket(t.id), children: [_jsxs("div", { className: "d-flex justify-content-between align-items-center mb-2", children: [_jsx("span", { className: "fw-bold text-success", children: t.ticketNo }), _jsx("div", { children: renderStatusBadge(t.status) })] }), _jsx("h6", { className: "fw-semibold text-dark mb-2", children: t.summary }), _jsxs("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2 text-muted small", children: [_jsxs("div", { children: [_jsx("span", { className: "me-2", children: t.category?.name }), renderPriorityBadge(t.requestedPriority)] }), _jsx("div", { children: new Date(t.createdAt).toLocaleDateString() })] })] }, t.id))) }) }), _jsxs("div", { className: "d-flex flex-wrap align-items-center justify-content-between gap-2", children: [_jsxs("div", { className: "text-muted small", children: ["Showing ", Math.min((meta.page - 1) * meta.limit + 1, meta.totalItems), " to", " ", Math.min(meta.page * meta.limit, meta.totalItems), " of ", meta.totalItems, " tickets"] }), _jsx("nav", { "aria-label": "Ticket list pagination", children: _jsxs("ul", { className: "pagination pagination-sm m-0", children: [_jsx("li", { className: `page-item ${meta.page <= 1 ? "disabled" : ""}`, children: _jsx("button", { className: "page-link", onClick: () => setCurrentPage((p) => Math.max(1, p - 1)), disabled: meta.page <= 1, children: "\u2039 Previous" }) }), Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((pg) => (_jsx("li", { className: `page-item ${pg === meta.page ? "active" : ""}`, children: _jsx("button", { className: "page-link", onClick: () => setCurrentPage(pg), children: pg }) }, pg))), _jsx("li", { className: `page-item ${meta.page >= meta.totalPages ? "disabled" : ""}`, children: _jsx("button", { className: "page-link", onClick: () => setCurrentPage((p) => Math.min(meta.totalPages, p + 1)), disabled: meta.page >= meta.totalPages, children: "Next \u203A" }) })] }) })] })] }))] }));
};
