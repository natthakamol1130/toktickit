import React from "react";
import { RequesterUser, User } from "../types";

export type NavTab =
  | "my-tickets"
  | "create-ticket"
  | "staff-queue"
  | "my-queue"
  | "user-management";

interface HeaderProps {
  currentRequester?: RequesterUser | null;
  authUser?: User | null;
  activeTab: string;
  onTabChange: (tab: NavTab) => void;
  onChangeRequester?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRequester,
  authUser,
  activeTab,
  onTabChange,
  onChangeRequester,
  onChangePassword,
  onLogout,
  onLoginClick,
}) => {
  const role = authUser?.role;

  const renderRoleBadge = () => {
    if (!role) return null;
    switch (role) {
      case "REQUESTER":
        return <span className="badge bg-success-subtle text-success border border-success-subtle">Requester</span>;
      case "IT_STAFF":
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">IT Staff</span>;
      case "ADMINISTRATOR":
        return <span className="badge bg-warning-subtle text-dark border border-warning">Administrator</span>;
      default:
        return null;
    }
  };

  return (
    <header className="zg-navbar py-2 px-3 mb-4 shadow-sm">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between">
        {/* Brand & Identity */}
        <div className="d-flex align-items-center me-3">
          <span
            className="fs-4 fw-bold me-4 cursor-pointer d-flex align-items-center text-white"
            onClick={() => {
              if (role === "ADMINISTRATOR") onTabChange("user-management");
              else if (role === "IT_STAFF") onTabChange("staff-queue");
              else onTabChange("my-tickets");
            }}
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

          {/* Role-based Navigation Tabs */}
          <nav className="d-flex gap-2">
            {(!authUser || role === "REQUESTER") && (
              <>
                <button
                  className={`nav-link border-0 bg-transparent d-flex align-items-center gap-1 ${
                    activeTab === "my-tickets" ? "active" : ""
                  }`}
                  onClick={() => onTabChange("my-tickets")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
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
              </>
            )}

            {role === "IT_STAFF" && (
              <>
                <button
                  className={`nav-link border-0 bg-transparent d-flex align-items-center gap-1 ${
                    activeTab === "staff-queue" ? "active" : ""
                  }`}
                  onClick={() => onTabChange("staff-queue")}
                >
                  Ticket Queue
                </button>
                <button
                  className={`nav-link border-0 bg-transparent d-flex align-items-center gap-1 ${
                    activeTab === "my-queue" ? "active" : ""
                  }`}
                  onClick={() => onTabChange("my-queue")}
                >
                  My Queue
                </button>
                <button
                  className={`nav-link border-0 bg-transparent d-flex align-items-center gap-1 ${
                    activeTab === "create-ticket" ? "active" : ""
                  }`}
                  onClick={() => onTabChange("create-ticket")}
                >
                  Create Ticket
                </button>
              </>
            )}

            {role === "ADMINISTRATOR" && (
              <>
                <button
                  className={`nav-link border-0 bg-transparent d-flex align-items-center gap-1 ${
                    activeTab === "user-management" ? "active" : ""
                  }`}
                  onClick={() => onTabChange("user-management")}
                >
                  User Management
                </button>
                <button
                  className={`nav-link border-0 bg-transparent d-flex align-items-center gap-1 ${
                    activeTab === "staff-queue" ? "active" : ""
                  }`}
                  onClick={() => onTabChange("staff-queue")}
                >
                  Ticket Queue
                </button>
              </>
            )}
          </nav>
        </div>

        {/* User Identity & Actions */}
        <div className="d-flex align-items-center gap-3">
          {authUser ? (
            <div className="d-flex align-items-center gap-2 bg-white text-dark py-1 px-3 rounded-pill shadow-sm">
              <span className="fs-6 d-flex align-items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006B3C" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <strong>{authUser.name}</strong>
              </span>
              {renderRoleBadge()}
              {onChangePassword && (
                <button
                  className="btn btn-sm btn-outline-secondary ms-1 py-0 px-2 extra-small"
                  onClick={onChangePassword}
                >
                  Change Password
                </button>
              )}
              {onLogout && (
                <button
                  className="btn btn-sm btn-outline-danger ms-1 py-0 px-2 extra-small"
                  onClick={onLogout}
                >
                  Logout
                </button>
              )}
            </div>
          ) : currentRequester ? (
            <div className="d-flex align-items-center gap-2 bg-white text-dark py-1 px-3 rounded-pill shadow-sm">
              <span className="fs-6 d-flex align-items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006B3C" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <strong>{currentRequester.name}</strong>
              </span>
              <span className="badge bg-secondary">{currentRequester.department}</span>
              {onChangeRequester && (
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={onChangeRequester}
                >
                  Change Requester
                </button>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-secondary text-white fs-6 py-1 px-3">Guest Context</span>
              {onLoginClick && (
                <button
                  className="btn btn-sm text-white fw-bold shadow-sm"
                  style={{ backgroundColor: "#006B3C", borderColor: "#006B3C" }}
                  onClick={onLoginClick}
                >
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
