import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChangePassword } from "../../src/pages/ChangePassword";
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

describe("Lab 3 Auth UI: Change Password Screen", () => {
  it("should render mandatory change password title and criteria checklist", () => {
    render(
      <AuthProvider>
        <ChangePassword isMandatory={true} />
      </AuthProvider>
    );

    expect(screen.getByText(/Mandatory Password Update/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm New Password$/i)).toBeInTheDocument();
    expect(screen.getByText(/At least 8 characters long/i)).toBeInTheDocument();
  });

  it("should keep submit button disabled until all criteria are met", () => {
    render(
      <AuthProvider>
        <ChangePassword />
      </AuthProvider>
    );

    const submitBtn = screen.getByRole("button", { name: /Save New Password/i });
    expect(submitBtn).toBeDisabled();

    // Fill current password
    fireEvent.change(screen.getByLabelText(/Current Password/i), {
      target: { value: "InitialPassword123!" },
    });

    // Fill invalid weak password
    fireEvent.change(screen.getByLabelText(/^New Password$/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm New Password$/i), {
      target: { value: "short" },
    });
    expect(submitBtn).toBeDisabled();

    // Fill valid password meeting all rules
    fireEvent.change(screen.getByLabelText(/^New Password$/i), {
      target: { value: "NewSecurePassword456!" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm New Password$/i), {
      target: { value: "NewSecurePassword456!" },
    });

    expect(submitBtn).not.toBeDisabled();
  });

  it("should call changePasswordApi upon form submission", async () => {
    vi.mocked(api.changePasswordApi).mockResolvedValueOnce({
      success: true,
      message: "Password changed successfully",
    });

    // Mock localStorage token so useAuth has a token
    localStorage.setItem("toktickit_token", "mock-valid-jwt");

    const handleSuccess = vi.fn();

    render(
      <AuthProvider>
        <ChangePassword onSuccess={handleSuccess} />
      </AuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/Current Password/i), {
      target: { value: "InitialPassword123!" },
    });
    fireEvent.change(screen.getByLabelText(/^New Password$/i), {
      target: { value: "NewSecurePassword456!" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm New Password$/i), {
      target: { value: "NewSecurePassword456!" },
    });

    const submitBtn = screen.getByRole("button", { name: /Save New Password/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.changePasswordApi).toHaveBeenCalledWith(
        "mock-valid-jwt",
        "InitialPassword123!",
        "NewSecurePassword456!"
      );
    });

    localStorage.removeItem("toktickit_token");
  });
});
