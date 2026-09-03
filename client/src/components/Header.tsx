import React from "react";
import { RequesterUser } from "../types.js";

interface HeaderProps {
  currentRequester: RequesterUser | null;
  activeTab: "my-tickets" | "create-ticket";
  onTabChange: (tab: "my-tickets" | "create-ticket") => void;
  onChangeRequester: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRequester,
  activeTab,
  onTabChange,
  onChangeRequester,
}) => {
  return (
    <header className="zg-navbar py-2 px-3 mb-4">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between">
        {/* Brand & Identity */}
        <div className="d-flex align-items-center me-3">
          <span className="fs-4 fw-bold me-4 cursor-pointer" onClick={() => onTabChange("my-tickets")}>
            🟢 TokTickIT
          </span>

          {/* Nav Tabs */}
          {currentRequester && (
            <nav className="d-flex gap-2">
              <button
                className={`nav-link border-0 bg-transparent ${activeTab === "my-tickets" ? "active" : ""}`}
                onClick={() => onTabChange("my-tickets")}
              >
                📋 My Tickets
              </button>
              <button
                className={`nav-link border-0 bg-transparent ${activeTab === "create-ticket" ? "active" : ""}`}
                onClick={() => onTabChange("create-ticket")}
              >
                ➕ Create Ticket
              </button>
            </nav>
          )}
        </div>

        {/* Current Requester Identity & Switch Action */}
        <div className="d-flex align-items-center gap-3">
          {currentRequester ? (
            <div className="d-flex align-items-center gap-2 bg-white text-dark py-1 px-3 rounded-pill shadow-sm">
              <span className="fs-6">👤 <strong>{currentRequester.name}</strong></span>
              <span className="badge bg-secondary">{currentRequester.department}</span>
              <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={onChangeRequester}
                title="Change active requester"
              >
                Change Requester
              </button>
            </div>
          ) : (
            <span className="badge bg-warning text-dark fs-6 py-2 px-3">No Requester Selected</span>
          )}
        </div>
      </div>
    </header>
  );
};
