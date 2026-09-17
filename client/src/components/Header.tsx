import React from "react";
import { RequesterUser } from "../types";

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
    <header className="zg-navbar py-2 px-3 mb-4 shadow-sm">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between">
        {/* Brand & Identity */}
        <div className="d-flex align-items-center me-3">
          <span
            className="fs-4 fw-bold me-4 cursor-pointer d-flex align-items-center text-white"
            onClick={() => onTabChange("my-tickets")}
          >
            <svg
              className="me-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="4" ry="4" fill="#006B3C" stroke="#EAF6EF" />
              <path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>
            TokTickIT
          </span>

          {/* Nav Tabs */}
          {currentRequester && (
            <nav className="d-flex gap-2">
              <button
                className={`nav-link border-0 bg-transparent d-flex align-items-center gap-1 ${
                  activeTab === "my-tickets" ? "active" : ""
                }`}
                onClick={() => onTabChange("my-tickets")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                My Tickets
              </button>
              <button
                className={`nav-link border-0 bg-transparent d-flex align-items-center gap-1 ${
                  activeTab === "create-ticket" ? "active" : ""
                }`}
                onClick={() => onTabChange("create-ticket")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Ticket
              </button>
            </nav>
          )}
        </div>

        {/* Current Requester Identity & Switch Action */}
        <div className="d-flex align-items-center gap-3">
          {currentRequester ? (
            <div className="d-flex align-items-center gap-2 bg-white text-dark py-1 px-3 rounded-pill shadow-sm">
              <span className="fs-6 d-flex align-items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006B3C" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <strong>{currentRequester.name}</strong>
              </span>
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
