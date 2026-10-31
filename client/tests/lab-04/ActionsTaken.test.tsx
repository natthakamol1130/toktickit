import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ActionsTakenSection } from "../../src/components/ActionsTakenSection";
import { ActionTaken } from "../../src/types";

describe("Lab 4: Actions Taken UI Component (UI-01, UI-02, UI-03)", () => {
  const sampleActions: ActionTaken[] = [
    {
      id: 101,
      ticketId: 1,
      actionDateTime: "2026-10-31T14:30:00.000Z",
      description: "Inspected power delivery circuit and replaced swollen capacitor.",
      result: "System boots reliably, completed 30-minute stress test.",
      followUpRequired: true,
      followUpNote: "Check stability during heavy workload next Tuesday.",
      attachmentNotes: "Refer to diagnostics-log.txt in ticket attachments.",
      performer: {
        id: 3,
        name: "Kevin Patel",
        role: "IT_STAFF",
      },
      updatedAt: "2026-10-31T14:32:10.000Z",
    },
    {
      id: 102,
      ticketId: 1,
      actionDateTime: "2026-10-31T16:00:00.000Z",
      description: "Verified network driver configuration.",
      result: "Zero packet loss observed.",
      followUpRequired: false,
      followUpNote: null,
      attachmentNotes: null,
      performer: {
        id: 4,
        name: "Emily Davis",
        role: "IT_STAFF",
      },
      updatedAt: "2026-10-31T16:05:00.000Z",
    },
  ];

  it("UI-01: should render chronological Actions Taken list with performer, description, result, and follow-up badges (AC-01, FR-01)", () => {
    render(
      <ActionsTakenSection
        ticketId={1}
        actions={sampleActions}
        userRole="IT_STAFF"
        currentUserName="Kevin Patel"
      />
    );

    expect(screen.getByText(/Actions Taken Work Log/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/Performed by: Kevin Patel/i)).toBeInTheDocument();
    expect(screen.getByText(/Performed by: Emily Davis/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Inspected power delivery circuit and replaced swollen capacitor/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Check stability during heavy workload next Tuesday/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Follow-up Required/i)).toBeInTheDocument();
    expect(screen.getByText(/No Follow-up/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /\+ Add Action Taken/i })
    ).toBeInTheDocument();
  });

  it("UI-02: should dynamically require followUpNote when followUpRequired is toggled in Add Action modal (AC-02, FR-03)", async () => {
    const onCreateAction = vi.fn().mockResolvedValue(undefined);

    render(
      <ActionsTakenSection
        ticketId={1}
        actions={[]}
        userRole="IT_STAFF"
        currentUserName="Kevin Patel"
        onCreateAction={onCreateAction}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /\+ Add Action Taken/i }));

    fireEvent.change(screen.getByLabelText(/Action Description/i), {
      target: { value: "Replaced thermal paste and cleaned fan assembly." },
    });
    fireEvent.change(screen.getByLabelText(/Result \/ Outcome/i), {
      target: { value: "CPU temperatures dropped by 18C under load." },
    });

    // Toggle Follow-Up Required ON
    const followUpToggle = screen.getByLabelText(/Follow-Up Required/i);
    fireEvent.click(followUpToggle);

    // Follow-up Note input appears
    const followUpNoteInput = screen.getByLabelText(/Follow-Up Note/i);
    expect(followUpNoteInput).toBeInTheDocument();

    // Attempt submit with empty followUpNote -> should show validation error
    fireEvent.click(screen.getByRole("button", { name: /Save Action/i }));

    expect(
      await screen.findByText(
        /Follow-up Note is required when Follow-up Required is checked/i
      )
    ).toBeInTheDocument();
    expect(onCreateAction).not.toHaveBeenCalled();

    // Fill followUpNote and submit -> succeeds
    fireEvent.change(followUpNoteInput, {
      target: { value: "Verify fan acoustics after 48 hours of operation." },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Action/i }));

    await waitFor(() => {
      expect(onCreateAction).toHaveBeenCalledTimes(1);
    });
    expect(onCreateAction.mock.calls[0][0]).toMatchObject({
      description: "Replaced thermal paste and cleaned fan assembly.",
      result: "CPU temperatures dropped by 18C under load.",
      followUpRequired: true,
      followUpNote: "Verify fan acoustics after 48 hours of operation.",
    });
  });

  it("UI-03: should render strictly read-only Actions Taken view for Requester with Add and Edit buttons hidden (AC-03, AC-04, FR-04)", () => {
    render(
      <ActionsTakenSection
        ticketId={1}
        actions={sampleActions}
        userRole="REQUESTER"
      />
    );

    expect(
      screen.getByText(/Inspected power delivery circuit and replaced swollen capacitor/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /\+ Add Action Taken/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Edit Action/i })
    ).not.toBeInTheDocument();
  });
});
