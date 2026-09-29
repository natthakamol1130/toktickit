import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../../src/App";
import * as api from "../../src/api";

vi.mock("../../src/api", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    loginApi: vi.fn(),
    getMeApi: vi.fn(),
    logoutApi: vi.fn(),
    changePasswordApi: vi.fn(),
    fetchTickets: vi.fn().mockResolvedValue({
      success: true,
      data: [],
      meta: { page: 1, limit: 10, totalItems: 0, totalPages: 1 },
    }),
    fetchCategories: vi.fn().mockResolvedValue([]),
    fetchRelatedSystems: vi.fn().mockResolvedValue([]),
    fetchRequesters: vi.fn().mockResolvedValue([
      { id: 1, name: "Jennifer Anderson", email: "jennifer@toktickit.com", department: "CPE" },
    ]),
  };
});

describe("Lab 3 E2E Client Application Integration", () => {
  it("should navigate to Login screen when clicking Sign In button", async () => {
    render(<App />);
    const signInBtn = await screen.findByRole("button", { name: /^Sign In$/i });
    fireEvent.click(signInBtn);

    expect(await screen.findByText(/Sign in to TokTickIT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it("should authenticate user and render role navigation header", async () => {
    const mockUser = {
      id: 1,
      email: "jennifer.anderson@toktickit.com",
      name: "Jennifer Anderson",
      role: "REQUESTER" as const,
      mustChangePassword: false,
    };

    vi.mocked(api.loginApi).mockResolvedValueOnce({
      success: true,
      token: "mock-jwt-token",
      user: mockUser,
    });

    render(<App />);
    const signInBtn = await screen.findByRole("button", { name: /^Sign In$/i });
    fireEvent.click(signInBtn);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "jennifer.anderson@toktickit.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "InitialPassword123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText("Jennifer Anderson")).toBeInTheDocument();
      expect(screen.getByText("Requester")).toBeInTheDocument();
    });
  });
});
