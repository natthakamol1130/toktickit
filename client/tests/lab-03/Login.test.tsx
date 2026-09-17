import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Login } from "../../src/pages/Login";
import { AuthProvider } from "../../src/contexts/AuthContext";
import * as api from "../../src/api";

vi.mock("../../src/api", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    loginApi: vi.fn(),
    getMeApi: vi.fn(),
    logoutApi: vi.fn(),
    changePasswordApi: vi.fn(),
  };
});

describe("Lab 3 Auth UI: Login Screen", () => {
  it("should render the login form with title and input fields", () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByText(/Sign in to TokTickIT/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("should show validation error when fields are empty", async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    const submitBtn = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Please fill in both Email and Password fields/i)
    ).toBeInTheDocument();
  });

  it("should display error message on failed login API response", async () => {
    vi.mocked(api.loginApi).mockRejectedValueOnce(
      new Error("Invalid credentials or account deactivated")
    );

    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "wrong@toktickit.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "WrongPass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(
      await screen.findByText(/Invalid credentials or account deactivated/i)
    ).toBeInTheDocument();
  });

  it("should call loginApi and succeed with valid credentials", async () => {
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

    const handleSuccess = vi.fn();

    render(
      <AuthProvider>
        <Login onSuccess={handleSuccess} />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "jennifer.anderson@toktickit.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "InitialPassword123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    await waitFor(() => {
      expect(api.loginApi).toHaveBeenCalledWith(
        "jennifer.anderson@toktickit.com",
        "InitialPassword123!"
      );
      expect(handleSuccess).toHaveBeenCalled();
    });
  });
});
