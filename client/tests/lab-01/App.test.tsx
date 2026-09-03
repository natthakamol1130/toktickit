import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../src/App.js";

vi.mock("../../src/api.js", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    fetchRequesters: vi.fn().mockResolvedValue([
      { id: 1, name: "Jennifer Anderson", email: "jennifer@kmutt.ac.th", department: "CPE" },
    ]),
  };
});

describe("App (Lab 2 Increment)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the TokTickIT heading and Requester Selector screen", async () => {
    render(<App />);
    expect(screen.getAllByText(/TokTickIT/i).length).toBeGreaterThan(0);
    expect(await screen.findByText(/Select Development Requester/i)).toBeInTheDocument();
  });
});
