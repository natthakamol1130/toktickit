import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TicketDetailView } from "../../src/components/TicketDetailView.js";
import * as api from "../../src/api.js";

vi.mock("../../src/api.js", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    fetchTicketDetail: vi.fn().mockResolvedValue({
      id: 1,
      ticketNo: "TKT-2026-000001",
      summary: "Detail Test Ticket",
      description: "Testing ticket detail read-only view",
      requestedPriority: "HIGH",
      status: "NEW",
      createdAt: new Date().toISOString(),
      category: { id: 1, name: "Hardware" },
      relatedSystem: { id: 1, name: "Laptop" },
      attachments: [],
    }),
  };
});

describe("UI-06: Requester Ticket Detail Component", () => {
  const mockUser = {
    id: 1,
    name: "Jennifer Anderson",
    email: "jennifer@kmutt.ac.th",
    department: "CPE",
  };

  it("should render read-only ticket details", async () => {
    render(
      <TicketDetailView
        currentRequester={mockUser}
        ticketId={1}
        onBack={vi.fn()}
      />
    );

    expect(await screen.findByText(/TKT-2026-000001/i)).toBeInTheDocument();
    expect(screen.getByText(/Detail Test Ticket/i)).toBeInTheDocument();
  });
});
