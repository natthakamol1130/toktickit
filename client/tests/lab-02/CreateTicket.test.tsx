import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CreateTicketView } from "../../src/components/CreateTicketView.js";
import * as api from "../../src/api.js";

vi.mock("../../src/api.js", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    fetchCategories: vi.fn().mockResolvedValue([{ id: 1, name: "Hardware" }]),
    fetchRelatedSystems: vi.fn().mockResolvedValue([{ id: 1, name: "Laptop" }]),
    createTicket: vi.fn().mockResolvedValue({
      id: 101,
      ticketNo: "TKT-2026-000101",
      summary: "Test Ticket",
      status: "NEW",
    }),
  };
});

describe("UI-02 & UI-03: Create Ticket Form Component", () => {
  const mockUser = {
    id: 1,
    name: "Jennifer Anderson",
    email: "jennifer@kmutt.ac.th",
    department: "CPE",
  };

  it("should display form fields and validate required input lengths", async () => {
    render(
      <CreateTicketView
        currentRequester={mockUser}
        onTicketCreated={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(await screen.findByText(/Create IT Support Ticket/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Submit Ticket/i })).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: /Submit Ticket/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Summary must be between 5 and 150 characters/i)).toBeInTheDocument();
  });
});
