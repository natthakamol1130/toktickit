import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MyTicketsView } from "../../src/components/MyTicketsView.js";
import * as api from "../../src/api.js";

vi.mock("../../src/api.js", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    fetchCategories: vi.fn().mockResolvedValue([{ id: 1, name: "Hardware" }]),
    fetchTickets: vi.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          ticketNo: "TKT-2026-000001",
          summary: "Laptop battery problem",
          requestedPriority: "MEDIUM",
          status: "NEW",
          createdAt: new Date().toISOString(),
          category: { id: 1, name: "Hardware" },
          relatedSystem: { id: 1, name: "Laptop" },
        },
      ],
      meta: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
    }),
  };
});

describe("UI-04 & UI-05: My Tickets Dashboard Component", () => {
  const mockUser = {
    id: 1,
    name: "Jennifer Anderson",
    email: "jennifer@kmutt.ac.th",
    department: "CPE",
  };

  it("should render tickets table and search control", async () => {
    render(
      <MyTicketsView
        currentRequester={mockUser}
        onSelectTicket={vi.fn()}
        onCreateTicketClick={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText(/TKT-2026-000001/i).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText(/Laptop battery problem/i).length).toBeGreaterThan(0);
  });
});
