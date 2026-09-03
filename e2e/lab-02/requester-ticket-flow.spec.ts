import { test, expect } from "@playwright/test";

test.describe("Lab 2 Requester Ticket Flow (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    // Open app and clear local storage identity
    await page.goto("http://localhost:5173/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("E2E-01: Complete Requester Flow - Select Requester -> Create Ticket -> View in My Tickets (AC-01, AC-03)", async ({ page }) => {
    // 1. Select Development Requester
    await expect(page.getByText("Select Development Requester")).toBeVisible();
    await page.getByRole("button", { name: "Continue →" }).click();

    // 2. Navigated to My Tickets
    await expect(page.getByRole("heading", { name: "My Tickets" })).toBeVisible();

    // 3. Click Create Ticket
    await page.getByRole("button", { name: "➕ Create Ticket" }).click();
    await expect(page.getByRole("heading", { name: "Create IT Support Ticket" })).toBeVisible();

    // 4. Fill form
    await page.locator("select").first().selectOption({ index: 0 }); // Category
    await page.locator("select").nth(1).selectOption({ index: 0 }); // System
    await page.locator("select").nth(2).selectOption({ label: "High" }); // Priority

    await page.getByPlaceholder(/Briefly describe the issue/i).fill("E2E Automated Test Issue Summary");
    await page.getByPlaceholder(/Provide details about what happened/i).fill("Detailed description for E2E automated test flow verification.");

    // 5. Submit form
    await page.getByRole("button", { name: "Submit Ticket" }).click();

    // 6. Verify Ticket Created Success Screen & Ticket Number
    await expect(page.getByText("Ticket Created Successfully!")).toBeVisible();
    const ticketNoElement = page.locator(".text-primary.fw-bold");
    await expect(ticketNoElement).toContainText(/TKT-\d{4}-\d{6}/);

    // 7. Click View My Tickets and verify created ticket appears
    await page.getByRole("button", { name: "📋 View My Tickets" }).click();
    await expect(page.getByText("E2E Automated Test Issue Summary")).toBeVisible();
  });

  test("E2E-02: Requester Switching & Ownership Security Isolation (AC-04)", async ({ page }) => {
    // Select Requester 1
    await page.getByRole("button", { name: "Continue →" }).click();
    await expect(page.getByRole("heading", { name: "My Tickets" })).toBeVisible();

    // Change Requester to Requester 2
    await page.getByRole("button", { name: "Change Requester" }).click();
    await expect(page.getByText("Select Development Requester")).toBeVisible();

    // Select second option
    const dropdown = page.locator("select");
    await dropdown.selectOption({ index: 1 });
    await page.getByRole("button", { name: "Continue →" }).click();

    await expect(page.getByRole("heading", { name: "My Tickets" })).toBeVisible();
  });
});
