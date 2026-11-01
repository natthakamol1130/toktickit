import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TicketWorkflowPanel } from "../../src/components/TicketWorkflowPanel";
import { Ticket } from "../../src/types";

describe("Lab 4: Ticket Workflow, Resolution Gate & 409 Conflict UI (UI-04, UI-05)", () => {
  const baseTicket: Ticket = {
    id: 45,
    ticketNo: "TKT-2026-001234",
    requesterId: 1,
    categoryId: 1,
    relatedSystemId: 1,
    requestedPriority: "HIGH",
    itPriority: "HIGH",
    status: "IN_PROGRESS",
    summary: "Laptop battery drains quickly",
    description: "Battery drops from 100% to 15% in 30 minutes.",
    requesterResolvedInd: false,
    createdAt: "2026-10-30T10:00:00.000Z",
    updatedAt: "2026-10-31T14:00:00.000Z",
    category: { id: 1, name: "Hardware" },
    relatedSystem: { id: 1, name: "Corporate Laptop" },
  };

  it("UI-04a: should display only permitted status transitions for IT Staff and exclude disallowed jumps (AC-06)", () => {
    render(
      <TicketWorkflowPanel
        ticket={{ ...baseTicket, status: "OPEN" }}
        userRole="IT_STAFF"
      />
    );

    const select = screen.getByLabelText(
      /Permitted Status Transitions/i
    ) as HTMLSelectElement;
    const optionValues = Array.from(select.options).map((o) => o.value);

    // From OPEN, only OPEN (current), IN_PROGRESS, and WAITING_FOR_REQUESTER are permitted
    expect(optionValues).toContain("OPEN");
    expect(optionValues).toContain("IN_PROGRESS");
    expect(optionValues).toContain("WAITING_FOR_REQUESTER");
    expect(optionValues).not.toContain("CLOSED");
    expect(optionValues).not.toContain("RESOLVED");
  });

  it("UI-04b: should render Requester 'Problem Appears Resolved' control and IT Staff Advisory Resolution Banner (AC-07)", async () => {
    const onIndicateResolved = vi.fn().mockResolvedValue(undefined);

    const { rerender } = render(
      <TicketWorkflowPanel
        ticket={baseTicket}
        userRole="REQUESTER"
        onIndicateResolved={onIndicateResolved}
      />
    );

    // Requester does not see status dropdown, but sees Problem Appears Resolved button
    expect(
      screen.queryByLabelText(/Permitted Status Transitions/i)
    ).not.toBeInTheDocument();
    const indicateBtn = screen.getByRole("button", {
      name: /Problem Appears Resolved/i,
    });
    fireEvent.click(indicateBtn);

    fireEvent.change(screen.getByLabelText(/Optional Confirmation Note/i), {
      target: { value: "Battery replacement fixed the issue!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Confirm Advisory Resolution/i })
    );

    await waitFor(() => {
      expect(onIndicateResolved).toHaveBeenCalledWith(
        "Battery replacement fixed the issue!"
      );
    });

    // When requesterResolvedInd is true, IT Staff sees the Advisory Resolution Banner
    rerender(
      <TicketWorkflowPanel
        ticket={{ ...baseTicket, requesterResolvedInd: true }}
        userRole="IT_STAFF"
      />
    );

    expect(
      screen.getByTestId("staff-advisory-resolution-banner")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Formally Resolve Ticket/i })
    ).toBeInTheDocument();
  });

  it("UI-05: should display 409 Concurrency Conflict alert banner and trigger Refresh Details callback (AC-08, FR-09)", async () => {
    const conflictErr: any = new Error(
      "Conflict: Ticket was modified by another user since you loaded it."
    );
    conflictErr.status = 409;

    const onUpdateWorkflow = vi.fn().mockRejectedValue(conflictErr);
    const onRefreshTicket = vi.fn().mockResolvedValue(undefined);

    render(
      <TicketWorkflowPanel
        ticket={baseTicket}
        userRole="IT_STAFF"
        onUpdateWorkflow={onUpdateWorkflow}
        onRefreshTicket={onRefreshTicket}
      />
    );

    const select = screen.getByLabelText(/Permitted Status Transitions/i);
    fireEvent.change(select, { target: { value: "RESOLVED" } });
    fireEvent.click(screen.getByRole("button", { name: /Update Status/i }));

    const conflictBanner = await screen.findByTestId(
      "concurrency-conflict-banner"
    );
    expect(conflictBanner).toBeInTheDocument();
    expect(
      screen.getByText(/409 Concurrency Conflict Detected/i)
    ).toBeInTheDocument();

    const refreshBtn = screen.getByRole("button", { name: /Refresh Details/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(onRefreshTicket).toHaveBeenCalledTimes(1);
    });
  });
});
