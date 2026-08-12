import { useState } from "react";
import { checkSystem, Category } from "./api.js";

type UiState = "idle" | "loading" | "success" | "error";

export default function App() {
  const [state, setState] = useState<UiState>("idle");
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleCheck() {
    setState("loading");
    setErrorMessage("");
    try {
      const result = await checkSystem();
      setCategories(result.categories);
      setState("success");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unable to connect to TokTickIT API");
      }
      setState("error");
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <h1 className="h3 mb-4">
        TokTickIT <span className="text-success">IT Service Desk</span>
      </h1>

      <button
        className="btn btn-success mb-4"
        onClick={handleCheck}
        disabled={state === "loading"}
      >
        {state === "loading" ? "Loading…" : "Check System"}
      </button>

      {state === "loading" && (
        <div className="text-muted mt-3">Loading…</div>
      )}

      {state === "success" && (
        <div className="mt-3">
          <p className="mb-3">
            <strong>System Status:</strong> <span className="text-success fw-bold">Online</span>
          </p>

          <p className="fw-semibold mb-2">Supported Request Categories:</p>
          {categories.length > 0 ? (
            <ul className="list-unstyled ps-3">
              {categories.map((category) => (
                <li key={category.id} className="mb-1">
                  • {category.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted ps-3 mb-0">No categories found.</p>
          )}
        </div>
      )}

      {state === "error" && (
        <div className="mt-3">
          <p className="mb-2">
            <strong>System Status:</strong> <span className="text-danger fw-bold">Offline</span>
          </p>
          <p className="text-muted mb-0">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
