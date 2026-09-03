import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RequesterSelectorScreen } from "../../src/components/RequesterSelectorScreen.js";
import * as api from "../../src/api.js";

vi.mock("../../src/api.js", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    fetchRequesters: vi.fn().mockResolvedValue([
      { id: 1, name: "Jennifer Anderson", email: "jennifer@kmutt.ac.th", department: "CPE" },
      { id: 2, name: "Michael Brown", email: "michael@kmutt.ac.th", department: "IT" },
    ]),
  };
});

describe("UI-01: Development Requester Selector Screen", () => {
  it("should render dropdown with active requesters and continue button", async () => {
    const onSelect = vi.fn();
    render(<RequesterSelectorScreen onSelectRequester={onSelect} />);

    expect(await screen.findByText(/Select Development Requester/i)).toBeInTheDocument();
    expect(await screen.findByText(/Jennifer Anderson/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue/i })).toBeInTheDocument();
  });
});
