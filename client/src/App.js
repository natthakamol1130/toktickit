import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Header } from "./components/Header.jsx";
import { RequesterSelectorScreen } from "./components/RequesterSelectorScreen.jsx";
import { CreateTicketView } from "./components/CreateTicketView.jsx";
import { MyTicketsView } from "./components/MyTicketsView.jsx";
import { TicketDetailView } from "./components/TicketDetailView.jsx";
export default function App() {
    const [currentRequester, setCurrentRequester] = useState(null);
    const [currentView, setCurrentView] = useState("selector");
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    // Restore saved requester from LocalStorage on initial load
    useEffect(() => {
        const saved = localStorage.getItem("toktickit_requester");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.id && parsed.name) {
                    setCurrentRequester(parsed);
                    setCurrentView("my-tickets");
                }
            }
            catch (e) {
                localStorage.removeItem("toktickit_requester");
            }
        }
    }, []);
    const handleSelectRequester = (user) => {
        setCurrentRequester(user);
        localStorage.setItem("toktickit_requester", JSON.stringify(user));
        setCurrentView("my-tickets");
    };
    const handleChangeRequester = () => {
        setCurrentRequester(null);
        localStorage.removeItem("toktickit_requester");
        setCurrentView("selector");
    };
    const handleNavigateTab = (tab) => {
        if (!currentRequester) {
            setCurrentView("selector");
            return;
        }
        setCurrentView(tab);
    };
    const handleOpenTicketDetail = (ticketId) => {
        setSelectedTicketId(ticketId);
        setCurrentView("ticket-detail");
    };
    const handleTicketCreated = (_ticket) => {
        setCurrentView("my-tickets");
    };
    return (_jsxs("div", { className: "min-vh-100 d-flex flex-column bg-light", children: [_jsx(Header, { currentRequester: currentRequester, activeTab: currentView === "create-ticket" ? "create-ticket" : "my-tickets", onTabChange: handleNavigateTab, onChangeRequester: handleChangeRequester }), _jsx("main", { className: "flex-grow-1", children: currentView === "selector" || !currentRequester ? (_jsx(RequesterSelectorScreen, { onSelectRequester: handleSelectRequester })) : currentView === "create-ticket" ? (_jsx(CreateTicketView, { currentRequester: currentRequester, onTicketCreated: handleTicketCreated, onCancel: () => setCurrentView("my-tickets") })) : currentView === "ticket-detail" && selectedTicketId ? (_jsx(TicketDetailView, { currentRequester: currentRequester, ticketId: selectedTicketId, onBack: () => setCurrentView("my-tickets") })) : (_jsx(MyTicketsView, { currentRequester: currentRequester, onSelectTicket: handleOpenTicketDetail, onCreateTicketClick: () => setCurrentView("create-ticket") })) }), _jsx("footer", { className: "py-3 px-4 bg-white border-top text-center text-muted small mt-auto", children: "TokTickIT v1.0 \u2022 Lab 2 Requester Ticketing MVP \u2022 Zen Green Theme" })] }));
}
