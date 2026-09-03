import { useState, useEffect } from "react";
import { RequesterUser, Ticket } from "./types.js";
import { Header } from "./components/Header.jsx";
import { RequesterSelectorScreen } from "./components/RequesterSelectorScreen.jsx";
import { CreateTicketView } from "./components/CreateTicketView.jsx";
import { MyTicketsView } from "./components/MyTicketsView.jsx";
import { TicketDetailView } from "./components/TicketDetailView.jsx";

type ViewMode = "selector" | "my-tickets" | "create-ticket" | "ticket-detail";

export default function App() {
  const [currentRequester, setCurrentRequester] = useState<RequesterUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewMode>("selector");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

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
      } catch (e) {
        localStorage.removeItem("toktickit_requester");
      }
    }
  }, []);

  const handleSelectRequester = (user: RequesterUser) => {
    setCurrentRequester(user);
    localStorage.setItem("toktickit_requester", JSON.stringify(user));
    setCurrentView("my-tickets");
  };

  const handleChangeRequester = () => {
    setCurrentRequester(null);
    localStorage.removeItem("toktickit_requester");
    setCurrentView("selector");
  };

  const handleNavigateTab = (tab: "my-tickets" | "create-ticket") => {
    if (!currentRequester) {
      setCurrentView("selector");
      return;
    }
    setCurrentView(tab);
  };

  const handleOpenTicketDetail = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setCurrentView("ticket-detail");
  };

  const handleTicketCreated = (_ticket: Ticket) => {
    setCurrentView("my-tickets");
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Header
        currentRequester={currentRequester}
        activeTab={currentView === "create-ticket" ? "create-ticket" : "my-tickets"}
        onTabChange={handleNavigateTab}
        onChangeRequester={handleChangeRequester}
      />

      <main className="flex-grow-1">
        {currentView === "selector" || !currentRequester ? (
          <RequesterSelectorScreen onSelectRequester={handleSelectRequester} />
        ) : currentView === "create-ticket" ? (
          <CreateTicketView
            currentRequester={currentRequester}
            onTicketCreated={handleTicketCreated}
            onCancel={() => setCurrentView("my-tickets")}
          />
        ) : currentView === "ticket-detail" && selectedTicketId ? (
          <TicketDetailView
            currentRequester={currentRequester}
            ticketId={selectedTicketId}
            onBack={() => setCurrentView("my-tickets")}
          />
        ) : (
          <MyTicketsView
            currentRequester={currentRequester}
            onSelectTicket={handleOpenTicketDetail}
            onCreateTicketClick={() => setCurrentView("create-ticket")}
          />
        )}
      </main>

      <footer className="py-3 px-4 bg-white border-top text-center text-muted small mt-auto">
        TokTickIT v1.0 • Lab 2 Requester Ticketing MVP • Zen Green Theme
      </footer>
    </div>
  );
}
