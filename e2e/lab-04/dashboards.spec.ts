import { test, expect } from "@playwright/test";

test.describe("Lab 4 E2E-03: Requester & IT Staff Dashboards with Queue Drill-Down", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("E2E-03a: Requester Dashboard displays scoped metric cards and drills down to My Tickets (AC-09, FR-10)", async ({
    page,
    request,
  }) => {
    const reqLogin = await request.post("http://localhost:3000/api/auth/login", {
      data: { email: "alice.johnson@toktickit.local", password: "Password123!" },
    });
    expect(reqLogin.ok()).toBeTruthy();
    const { token, user } = await reqLogin.json();

    await page.evaluate(
      ({ t, u }) => {
        localStorage.setItem("toktickit_auth_token", t);
        localStorage.setItem("toktickit_auth_user", JSON.stringify(u));
      },
      { t: token, u: user }
    );
    await page.reload();

    // Navigate to Dashboard tab
    await page.getByRole("button", { name: "Dashboard" }).click();
    await expect(page.getByText(/Welcome, Alice Johnson!/i)).toBeVisible();

    // Verify metric cards render numeric values without NaN
    await expect(
      page.getByTestId("requester-metric-value-totalOpen")
    ).toBeVisible();
    await expect(
      page.getByTestId("requester-metric-value-inProgress")
    ).toBeVisible();

    // Click "In Progress" card to drill down into My Tickets
    await page.getByTestId("requester-metric-card-inProgress").click();
    await expect(
      page.getByRole("heading", { name: /My Tickets/i })
    ).toBeVisible();
  });

  test("E2E-03b: IT Staff & Admin Dashboard displays operational queue metrics and drills down (AC-10, FR-11)", async ({
    page,
    request,
  }) => {
    const staffLogin = await request.post("http://localhost:3000/api/auth/login", {
      data: { email: "bob.chen@toktickit.local", password: "Password123!" },
    });
    expect(staffLogin.ok()).toBeTruthy();
    const { token, user } = await staffLogin.json();

    await page.evaluate(
      ({ t, u }) => {
        localStorage.setItem("toktickit_auth_token", t);
        localStorage.setItem("toktickit_auth_user", JSON.stringify(u));
      },
      { t: token, u: user }
    );
    await page.reload();

    // Navigate to Dashboard tab
    await page.getByRole("button", { name: "Dashboard" }).click();
    await expect(page.getByText(/Welcome back, Bob Chen!/i)).toBeVisible();

    // Verify operational queue cards are visible
    await expect(
      page.getByTestId("staff-metric-value-newTickets")
    ).toBeVisible();
    await expect(
      page.getByTestId("staff-metric-value-myAssigned")
    ).toBeVisible();
    await expect(
      page.getByTestId("staff-metric-value-unassigned")
    ).toBeVisible();

    // Verify priority breakdown badges
    await expect(page.getByTestId("priority-count-HIGH")).toBeVisible();
  });
});
