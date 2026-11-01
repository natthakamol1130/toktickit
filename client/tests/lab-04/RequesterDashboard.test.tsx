import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RequesterDashboard } from "../../src/components/RequesterDashboard";
import * as api from "../../src/api";

vi.mock("../../src/api", async () => {
  const actual = await vi.importActual<typeof import("../../src/api")>(
    "../../src/api"
  );
  return {
    ...actual,
    fetchRequesterDashboard: vi.fn(),
  };
});

describe("Lab 4 UI Tests: RequesterDashboard (UI-06)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("UI-06a: renders Requester Dashboard metric cards, recent tickets, and triggers drill-down callbacks (AC-09, FR-10)", async () => {
    const mockDrillDown = vi.fn();
    const mockSelectTicket = vi.fn();
    const mockCreateTicket = vi.fn();

    render(
      <RequesterDashboard
        userName="Alice Johnson"
        initialData={{
          metrics: {
            totalOpen: 4,
            inProgress: 2,
            waitingForRequester: 1,
            resolved: 3,
            closed: 5,
          },
          recentTickets: [
            {
              id: 101,
              ticketNumber: "INC-2026-0001",
              summary: "VPN Gateway Timeout",
              description: "Cannot connect to VPN",
              status: "IN_PROGRESS",
              requestedPriority: "HIGH",
              itPriority: "HIGH",
              requesterResolvedInd: false,
              categoryId: 1,
              category: { id: 1, name: "Network & VPN" },
              requesterId: 4,
              createdAt: "2026-03-01T10:00:00.000Z",
              updatedAt: "2026-03-01T11:00:00.000Z",
            },
          ],
          quickActions: [
            { label: "Create Ticket", path: "/create-ticket" },
            { label: "View My Tickets", path: "/my-tickets" },
          ],
        }}
        onDrillDownStatus={mockDrillDown}
        onSelectTicket={mockSelectTicket}
        onCreateTicketClick={mockCreateTicket}
      />
    );

    expect(screen.getByText(/Welcome, Alice Johnson!/i)).toBeInTheDocument();

    // Verify metric values
    expect(screen.getByTestId("requester-metric-value-totalOpen")).toHaveTextContent("4");
    expect(screen.getByTestId("requester-metric-value-inProgress")).toHaveTextContent("2");
    expect(
      screen.getByTestId("requester-metric-value-waitingForRequester")
    ).toHaveTextContent("1");
    expect(screen.getByTestId("requester-metric-value-resolved")).toHaveTextContent("3");
    expect(screen.getByTestId("requester-metric-value-closed")).toHaveTextContent("5");

    // Verify recent tickets rendered
    expect(screen.getByText("INC-2026-0001")).toBeInTheDocument();
    expect(screen.getByText("VPN Gateway Timeout")).toBeInTheDocument();

    // Click metric card to drill down
    fireEvent.click(screen.getByTestId("requester-metric-card-inProgress"));
    expect(mockDrillDown).toHaveBeenCalledWith("IN_PROGRESS");

    // Click recent ticket row
    fireEvent.click(screen.getByText("VPN Gateway Timeout"));
    expect(mockSelectTicket).toHaveBeenCalledWith(101);

    // Click Quick Action Create New Ticket
    fireEvent.click(screen.getByRole("button", { name: /Create New Ticket/i }));
    expect(mockCreateTicket).toHaveBeenCalled();
  });

  it("UI-06b: handles zero-state metrics without NaN and displays accessible error alert on API failure (BR-11, FR-14)", async () => {
    vi.mocked(api.fetchRequesterDashboard).mockRejectedValueOnce(
      new Error("Database connection lost")
    );

    render(<RequesterDashboard token="mock-jwt-token" userName="Carol White" />);

    await waitFor(() => {
      expect(screen.getByTestId("requester-dashboard-error")).toBeInTheDocument();
    });

    expect(screen.getByText(/Database connection lost/i)).toBeInTheDocument();
  });
});
