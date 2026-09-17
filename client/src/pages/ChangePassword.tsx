import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface ChangePasswordProps {
  isMandatory?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({
  isMandatory = false,
  onSuccess,
  onCancel,
}) => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Real-time validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const matchesConfirm = newPassword === confirmPassword && confirmPassword.length > 0;

  const isFormValid =
    currentPassword.length > 0 &&
    hasMinLength &&
    hasUpper &&
    hasLower &&
    hasNumberOrSpecial &&
    matchesConfirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!isFormValid) {
      if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match.");
      } else {
        setError("Please ensure your new password meets all security criteria.");
      }
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccessMsg("Password changed successfully!");
      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light px-3 py-5">
      <div
        className="card shadow-sm border-0 w-100"
        style={{ maxWidth: "480px", borderRadius: "12px", overflow: "hidden" }}
      >
        <div className="card-header bg-white border-bottom-0 text-center pt-4 pb-2">
          {/* Hot Pink Heading as requested by user */}
          <h2 className="fw-bold mb-1" style={{ color: "#006B3C", fontSize: "1.75rem" }}>
            {isMandatory ? "Mandatory Password Update" : "Change Password"}
          </h2>
          <p className="text-muted small mb-0">
            {isMandatory
              ? "You must update your initial password before accessing TokTickIT."
              : "Update your account password to maintain security."}
          </p>
        </div>

        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger py-2 px-3 small border-0 mb-3" role="alert">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2 px-3 small border-0 mb-3" role="alert">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label
                htmlFor="current-password"
                className="form-label fw-semibold text-secondary small"
              >
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                className="form-control"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={submitting}
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="new-password"
                className="form-label fw-semibold text-secondary small"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                className="form-control"
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="confirm-password"
                className="form-label fw-semibold text-secondary small"
              >
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="form-control"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="p-3 bg-light rounded-3 mb-4 border">
              <div className="fw-semibold text-secondary extra-small text-uppercase tracking-wide mb-2">
                Password Criteria
              </div>
              <ul className="list-unstyled mb-0 small">
                <li className={hasMinLength ? "text-success fw-medium" : "text-muted"}>
                  {hasMinLength ? "[✓]" : "[ ]"} At least 8 characters long
                </li>
                <li className={hasUpper && hasLower ? "text-success fw-medium" : "text-muted"}>
                  {hasUpper && hasLower ? "[✓]" : "[ ]"} Upper & lower case letters
                </li>
                <li className={hasNumberOrSpecial ? "text-success fw-medium" : "text-muted"}>
                  {hasNumberOrSpecial ? "[✓]" : "[ ]"} Number & special character
                </li>
                <li className={matchesConfirm ? "text-success fw-medium" : "text-muted"}>
                  {matchesConfirm ? "[✓]" : "[ ]"} Confirmation matches new password
                </li>
              </ul>
            </div>

            <div className="d-flex gap-2">
              {!isMandatory && onCancel && (
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-grow-1 py-2 fw-semibold"
                  onClick={onCancel}
                  disabled={submitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary flex-grow-1 py-2 fw-bold text-white shadow-sm"
                style={{
                  backgroundColor: "#006B3C",
                  borderColor: "#006B3C",
                  borderRadius: "8px",
                }}
                disabled={submitting || !isFormValid}
              >
                {submitting ? "Updating..." : "Save New Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
