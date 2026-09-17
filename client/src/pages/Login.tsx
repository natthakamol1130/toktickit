import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface LoginProps {
  onSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in both Email and Password fields.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials or account deactivated.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light px-3 py-5">
      <div
        className="card shadow-sm border-0 w-100"
        style={{ maxWidth: "440px", borderRadius: "12px", overflow: "hidden" }}
      >
        <div
          className="card-header bg-white border-bottom-0 text-center pt-4 pb-2"
        >
          <div className="d-inline-flex align-items-center justify-content-center mb-2" style={{ color: "#006B3C" }}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 5v2" />
              <path d="M15 11v2" />
              <path d="M15 17v2" />
              <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
            </svg>
          </div>
          {/* Hot Pink Heading as requested by user */}
          <h2
            className="fw-bold mb-1"
            style={{ color: "#006B3C", fontSize: "1.75rem" }}
          >
            Sign in to TokTickIT
          </h2>
          <p className="text-muted small mb-0">Enter your credentials to access IT Services</p>
        </div>

        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger py-2 px-3 small border-0 mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label fw-semibold text-secondary small">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="form-control form-control-lg fs-6"
                placeholder="e.g. jennifer.anderson@toktickit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="login-password" className="form-label fw-semibold text-secondary small">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="form-control form-control-lg fs-6"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2.5 fw-bold text-white shadow-sm"
              style={{
                backgroundColor: "#006B3C",
                borderColor: "#006B3C",
                borderRadius: "8px",
              }}
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <div className="card-footer bg-white border-top-0 text-center pb-4 pt-0 text-muted extra-small">
          TokTickIT Access Management System • Zen Green Theme
        </div>
      </div>
    </div>
  );
};
