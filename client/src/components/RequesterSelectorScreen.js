import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchRequesters } from "../api.js";
export const RequesterSelectorScreen = ({ onSelectRequester, }) => {
    const [requesters, setRequesters] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchRequesters()
            .then((data) => {
            setRequesters(data);
            if (data.length > 0) {
                setSelectedId(data[0].id);
            }
        })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);
    const handleContinue = () => {
        const found = requesters.find((r) => String(r.id) === String(selectedId));
        if (found) {
            onSelectRequester(found);
        }
    };
    return (_jsx("div", { className: "container py-5 d-flex justify-content-center", children: _jsxs("div", { className: "zg-card p-4 shadow-sm text-center", style: { maxWidth: 540, width: "100%" }, children: [_jsx("div", { className: "mb-3", children: _jsx("span", { className: "display-4 text-success", children: "\uD83D\uDC64" }) }), _jsx("h2", { className: "h4 fw-bold mb-2", children: "Select Development Requester" }), _jsx("p", { className: "text-muted small mb-4", children: "Choose a development requester to simulate the current requester context for Lab 2. This is for testing only and is not a login screen." }), loading && (_jsx("div", { className: "spinner-border text-success my-4", role: "status", children: _jsx("span", { className: "visually-hidden", children: "Loading requesters..." }) })), error && (_jsx("div", { className: "alert alert-danger py-2 mb-3", role: "alert", children: error })), !loading && !error && requesters.length === 0 && (_jsx("div", { className: "alert alert-warning py-2 mb-3", role: "alert", children: "No active development requesters found in database." })), !loading && requesters.length > 0 && (_jsxs("div", { className: "text-start mb-4", children: [_jsxs("label", { className: "form-label fw-semibold", children: ["Development Requester ", _jsx("span", { className: "zg-required-asterisk", children: "*" })] }), _jsx("select", { className: "form-select form-select-lg", value: selectedId, onChange: (e) => setSelectedId(e.target.value), children: requesters.map((r) => (_jsxs("option", { value: r.id, children: [r.name, " (", r.department, ") - ", r.email] }, r.id))) }), _jsxs("div", { className: "alert alert-info d-flex align-items-center gap-2 mt-3 py-2 px-3 small rounded-3", role: "alert", children: [_jsx("span", { children: "\u2139\uFE0F" }), _jsx("div", { children: "Only active development requesters are shown. Authentication coming in Lab 3." })] })] })), _jsx("button", { className: "btn btn-zg-primary btn-lg w-100 fw-bold", onClick: handleContinue, disabled: loading || !selectedId, children: "Continue \u2192" })] }) }));
};
