import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { StaffDashboard } from "../../src/components/StaffDashboard";
import * as api from "../../src/api";

vi.mock("../../src/api", async () => {
  const actual = await vi.importActual<typeof import("../../src/api")>(
    "../../src/api"
  );
  return {
    ...actual,
    fetchStaffDashboard: vi.fn(),
  };
});

describe("Lab 4 UI Tests: StaffDashboard (UI-07, UI-08)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("UI-07a: renders IT Staff operational queue metric cards, priority breakdown, and drill-down navigation (AC-10, FR-11)", () => {
    const mockDrillDown = vi.fn();
    const mockSelectTicket = vi.fn();

    render(
      <StaffDashboard
        userName="Bob Chen"
        userRole="IT_STAFF"
        initialData={{
          metrics: {
            newTickets: 2,
            openTickets: 3,
            inProgress: 4,
            waitingForRequester: 1,
            myAssigned: 5,
            unassigned: 2,
          },
          byPriority: {
            URGENT: 1,
            HIGH: 3,
            MEDIUM: 4,
            LOW: 2,
          },
          recentTickets: [
            {
              id: 202,
              ticketNumber: "INC-2026-0002",
              summary: "Docking Station Display Flickering",
              description: "Monitors blink every 10 mins",
              status: "OPEN",
              requestedPriority: "MEDIUM",
              itPriority: "MEDIUM",
              requesterResolvedInd: false,
              categoryId: 2,
              requesterId: 4,
              requester: { id: 4, name: "Alice Johnson", email: "alice@toktickit.local", department: "Engineering" },
              owner: { id: 2, name: "Bob Chen", email: "bob@toktickit.local" },
              createdAt: "2026-03-01T10:00:00.000Z",
              updatedAt: "2026-03-01T11:00:00.000Z",
            },
          ],
        }}
        onDrillDownQueue={mockDrillDown}
        onSelectTicket={mockSelectTicket}
      />
    );

    expect(screen.getByText(/Welcome back, Bob Chen!/i)).toBeInTheDocument();

    // Check operational queue counts
    expect(screen.getByTestId("staff-metric-value-newTickets")).toHaveTextContent("2");
    expect(screen.getByTestId("staff-metric-value-openTickets")).toHaveTextContent("3");
    expect(screen.getByTestId("staff-metric-value-inProgress")).toHaveTextContent("4");
    expect(
      screen.getByTestId("staff-metric-value-waitingForRequester")
    ).toHaveTextContent("1");
    expect(screen.getByTestId("staff-metric-value-myAssigned")).toHaveTextContent("5");
    expect(screen.getByTestId("staff-metric-value-unassigned")).toHaveTextContent("2");

    // Check priority counts
    expect(screen.getByTestId("priority-count-URGENT")).toHaveTextContent("1");
    expect(screen.getByTestId("priority-count-HIGH")).toHaveTextContent("3");

    // Trigger drill-down on "Assigned to Me"
    fireEvent.click(screen.getByTestId("staff-metric-card-myAssigned"));
    expect(mockDrillDown).toHaveBeenCalledWith({ assignment: "ME" });

    // Trigger drill-down on "Unassigned"
    fireEvent.click(screen.getByTestId("staff-metric-card-unassigned"));
    expect(mockDrillDown).toHaveBeenCalledWith({ assignment: "UNASSIGNED" });

    // Trigger drill-down on status "IN_PROGRESS"
    fireEvent.click(screen.getByTestId("staff-metric-card-inProgress"));
    expect(mockDrillDown).toHaveBeenCalledWith({ status: "IN_PROGRESS" });

    // Non-admin should not render admin user summary
    expect(
      screen.queryByTestId("admin-user-summary-section")
    ).not.toBeInTheDocument();
  });

  it("UI-07b: renders Administrator User Account Summary section when role is ADMINISTRATOR (FR-11)", () => {
    render(
      <StaffDashboard
        userName="System Admin"
        userRole="ADMINISTRATOR"
        initialData={{
          metrics: {
            newTickets: 1,
            openTickets: 1,
            inProgress: 1,
            waitingForRequester: 0,
            myAssigned: 0,
            unassigned: 1,
          },
          byPriority: { URGENT: 0, HIGH: 1, MEDIUM: 1, LOW: 1 },
          recentTickets: [],
          userSummary: {
            totalUsers: 6,
            activeUsers: 5,
            inactiveUsers: 1,
            activeRequesters: 2,
            activeStaff: 2,
            activeAdmins: 1,
          },
        }}
      />
    );

    const adminSection = screen.getByTestId("admin-user-summary-section");
    expect(adminSection).toBeInTheDocument();
    expect(
      screen.getByText(/Administrator User Account Summary/i)
    ).toBeInTheDocument();
    expect(adminSection).toHaveTextContent("6");
  });

  it("UI-08: renders 0 cleanly without NaN for empty buckets and displays error alert on API failure (BR-11, FR-14)", async () => {
    // 1. Test zero-state without token/data
    const { unmount } = render(<StaffDashboard userName="Diana Patel" />);

    expect(screen.getByTestId("staff-metric-value-newTickets")).toHaveTextContent("0");
    expect(screen.getByTestId("staff-metric-value-unassigned")).toHaveTextContent("0");
    expect(screen.queryByText(/NaN/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/No tickets found in the service-desk queue/i)
    ).toBeInTheDocument();

    unmount();

    // 2. Test API error state
    vi.mocked(api.fetchStaffDashboard).mockRejectedValueOnce(
      new Error("Service unavailable (503)")
    );

    render(<StaffDashboard token="valid-staff-token" userName="Diana Patel" />);

    await waitFor(() => {
      expect(screen.getByTestId("staff-dashboard-error")).toBeInTheDocument();
    });
    expect(screen.getByText(/Service unavailable \(503\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });
});
