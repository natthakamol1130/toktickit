import { useState, useEffect } from "react";
import { RequesterUser, Ticket } from "./types";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Header, NavTab } from "./components/Header";
import { RequesterSelectorScreen } from "./components/RequesterSelectorScreen";
import { CreateTicketView } from "./components/CreateTicketView";
import { MyTicketsView } from "./components/MyTicketsView";
import { TicketDetailView } from "./components/TicketDetailView";
import { Login } from "./pages/Login";
import { ChangePassword } from "./pages/ChangePassword";

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [currentRequester, setCurrentRequester] = useState<RequesterUser | null>(null);
  const [currentView, setCurrentView] = useState<string>("my-tickets");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [useLegacySelector, setUseLegacySelector] = useState<boolean>(true);

  // Restore saved requester from LocalStorage on initial load
  useEffect(() => {
    const saved = localStorage.getItem("toktickit_requester");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.name) {
          setCurrentRequester(parsed);
        }
      } catch (e) {
        localStorage.removeItem("toktickit_requester");
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading TokTickIT...</span>
        </div>
      </div>
    );
  }

  // 1. Mandatory Password Change Workflow
  if (user && user.mustChangePassword) {
    return (
      <ChangePassword
        isMandatory={true}
        onSuccess={() => setCurrentView("my-tickets")}
      />
    );
  }

  // 2. Unauthenticated state -> render Login (or legacy selector toggle)
  if (!user && !currentRequester) {
    if (useLegacySelector) {
      return (
        <div className="min-vh-100 d-flex flex-column bg-light">
          <Header
            activeTab="my-tickets"
            onTabChange={() => {}}
            onLoginClick={() => setUseLegacySelector(false)}
          />
          <main className="flex-grow-1">
            <RequesterSelectorScreen
              onSelectRequester={(u) => {
                setCurrentRequester(u);
                localStorage.setItem("toktickit_requester", JSON.stringify(u));
                setCurrentView("my-tickets");
              }}
            />
          </main>
        </div>
      );
    }

    return <Login onSwitchToLegacy={() => setUseLegacySelector(true)} />;
  }

  const handleSelectRequester = (u: RequesterUser) => {
    setCurrentRequester(u);
    localStorage.setItem("toktickit_requester", JSON.stringify(u));
    setCurrentView("my-tickets");
  };

  const handleChangeRequester = () => {
    setCurrentRequester(null);
    localStorage.removeItem("toktickit_requester");
    setUseLegacySelector(true);
  };

  const handleNavigateTab = (tab: NavTab) => {
    setCurrentView(tab);
  };

  const handleOpenTicketDetail = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setCurrentView("ticket-detail");
  };

  const handleTicketCreated = (_ticket: Ticket) => {
    setCurrentView("my-tickets");
  };

  const requesterForLegacy = currentRequester || (user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    department: "IT Services",
  } : null);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Header
        currentRequester={currentRequester}
        authUser={user}
        activeTab={currentView}
        onTabChange={handleNavigateTab}
        onChangeRequester={handleChangeRequester}
        onChangePassword={() => setCurrentView("change-password")}
        onLogout={logout}
      />

      <main className="flex-grow-1">
        {currentView === "change-password" ? (
          <ChangePassword
            isMandatory={false}
            onSuccess={() => setCurrentView("my-tickets")}
            onCancel={() => setCurrentView("my-tickets")}
          />
        ) : currentView === "create-ticket" && requesterForLegacy ? (
          <CreateTicketView
            currentRequester={requesterForLegacy}
            onTicketCreated={handleTicketCreated}
            onCancel={() => setCurrentView("my-tickets")}
          />
        ) : currentView === "ticket-detail" && selectedTicketId && requesterForLegacy ? (
          <TicketDetailView
            currentRequester={requesterForLegacy}
            ticketId={selectedTicketId}
            onBack={() => setCurrentView("my-tickets")}
          />
        ) : requesterForLegacy ? (
          <MyTicketsView
            currentRequester={requesterForLegacy}
            onSelectTicket={handleOpenTicketDetail}
            onCreateTicketClick={() => setCurrentView("create-ticket")}
          />
        ) : (
          <RequesterSelectorScreen onSelectRequester={handleSelectRequester} />
        )}
      </main>

      <footer className="py-3 px-4 bg-white border-top text-center text-muted small mt-auto">
        TokTickIT v1.0 • Lab 3 Multi-Role Authentication & Ticketing System • Zen Green Theme
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
