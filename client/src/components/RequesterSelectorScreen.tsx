import React, { useEffect, useState } from "react";
import { RequesterUser } from "../types.js";
import { fetchRequesters } from "../api.js";

interface RequesterSelectorScreenProps {
  onSelectRequester: (user: RequesterUser) => void;
}

export const RequesterSelectorScreen: React.FC<RequesterSelectorScreenProps> = ({
  onSelectRequester,
}) => {
  const [requesters, setRequesters] = useState<RequesterUser[]>([]);
  const [selectedId, setSelectedId] = useState<number | string | "">("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="zg-card p-4 shadow-sm text-center" style={{ maxWidth: 540, width: "100%" }}>
        <div className="mb-3">
          <span className="display-4 text-success">👤</span>
        </div>
        <h2 className="h4 fw-bold mb-2">Select Development Requester</h2>
        <p className="text-muted small mb-4">
          Choose a development requester to simulate the current requester context for Lab 2.
          This is for testing only and is not a login screen.
        </p>

        {loading && (
          <div className="spinner-border text-success my-4" role="status">
            <span className="visually-hidden">Loading requesters...</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 mb-3" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && requesters.length === 0 && (
          <div className="alert alert-warning py-2 mb-3" role="alert">
            No active development requesters found in database.
          </div>
        )}

        {!loading && requesters.length > 0 && (
          <div className="text-start mb-4">
            <label className="form-label fw-semibold">
              Development Requester <span className="zg-required-asterisk">*</span>
            </label>
            <select
              className="form-select form-select-lg"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {requesters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.department}) - {r.email}
                </option>
              ))}
            </select>

            <div className="alert alert-info d-flex align-items-center gap-2 mt-3 py-2 px-3 small rounded-3" role="alert">
              <span>ℹ️</span>
              <div>Only active development requesters are shown. Authentication coming in Lab 3.</div>
            </div>
          </div>
        )}

        <button
          className="btn btn-zg-primary btn-lg w-100 fw-bold"
          onClick={handleContinue}
          disabled={loading || !selectedId}
        >
          Continue →
        </button>
      </div>
    </div>
  );
};
