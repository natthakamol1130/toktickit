import { render, screen } from "@testing-library/react";
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
      summary: "Attachment Test Ticket",
      description: "Testing attachment list",
      requestedPriority: "MEDIUM",
      status: "NEW",
      createdAt: new Date().toISOString(),
      category: { id: 1, name: "Hardware" },
      relatedSystem: { id: 1, name: "Laptop" },
      attachments: [
        {
          id: 10,
          fileName: "sample_log.pdf",
          fileSize: 10240,
          mimeType: "application/pdf",
          isRemoved: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }),
  };
});

describe("UI-06: Attachment Section Component", () => {
  const mockUser = {
    id: 1,
    name: "Jennifer Anderson",
    email: "jennifer@kmutt.ac.th",
    department: "CPE",
  };

  it("should render active attachments and download/remove buttons", async () => {
    render(
      <TicketDetailView
        currentRequester={mockUser}
        ticketId={1}
        onBack={vi.fn()}
      />
    );

    expect(await screen.findByText(/sample_log.pdf/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Remove/i })).toBeInTheDocument();
  });
});
