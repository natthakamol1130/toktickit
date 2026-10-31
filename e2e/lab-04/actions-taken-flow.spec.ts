import { test, expect } from "@playwright/test";

test.describe("Lab 4 E2E-01: Multi-Staff Actions Taken Recording & Requester Read-Only Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("E2E-01: IT Staff A records action -> IT Staff B adds follow-up preserving Ticket Owner -> Requester views read-only (AC-01, AC-04, AC-05)", async ({
    page,
    request,
  }) => {
    // 1. Authenticate as IT Staff A (Bob Chen) via API & UI
    const staffALogin = await request.post("http://localhost:3000/api/auth/login", {
      data: { email: "bob.chen@toktickit.local", password: "Password123!" },
    });
    expect(staffALogin.ok()).toBeTruthy();
    const staffABody = await staffALogin.json();
    const staffAToken = staffABody.token;

    // Fetch a ticket owned by Bob Chen (INC-2026-0001)
    const queueRes = await request.get("http://localhost:3000/api/staff/tickets", {
      headers: { Authorization: `Bearer ${staffAToken}` },
    });
    expect(queueRes.ok()).toBeTruthy();
    const queueBody = await queueRes.json();
    const targetTicket = queueBody.data[0];
    expect(targetTicket).toBeDefined();

    // 2. Staff A records initial Action Taken
    const actionARes = await request.post(
      `http://localhost:3000/api/tickets/${targetTicket.id}/actions-taken`,
      {
        headers: { Authorization: `Bearer ${staffAToken}` },
        data: {
          description: "E2E-01 Staff A diagnostic check on enterprise gateway",
          result: "Verified packet loss on secondary interface; scheduled firmware patch",
          followUpRequired: true,
          followUpNote: "Staff B to verify routing table after firmware reload",
          attachmentNotes: "gateway-diag.log",
        },
      }
    );
    expect(actionARes.status()).toBe(201);

    // 3. Authenticate as IT Staff B (Diana Patel) and record collaborative follow-up action (AC-05)
    const staffBLogin = await request.post("http://localhost:3000/api/auth/login", {
      data: { email: "diana.patel@toktickit.local", password: "Password123!" },
    });
    expect(staffBLogin.ok()).toBeTruthy();
    const staffBToken = (await staffBLogin.json()).token;

    const actionBRes = await request.post(
      `http://localhost:3000/api/tickets/${targetTicket.id}/actions-taken`,
      {
        headers: { Authorization: `Bearer ${staffBToken}` },
        data: {
          description: "E2E-01 Staff B collaborative routing verification",
          result: "BGP peerings re-established with 0% packet loss",
          followUpRequired: false,
        },
      }
    );
    expect(actionBRes.status()).toBe(201);
    const actionBBody = await actionBRes.json();
    expect(actionBBody.data.performer.email).toBe("diana.patel@toktickit.local");

    // Verify Ticket Owner remained unchanged (AC-05, BR-02)
    const detailAfterB = await request.get(
      `http://localhost:3000/api/staff/tickets/${targetTicket.id}`,
      {
        headers: { Authorization: `Bearer ${staffAToken}` },
      }
    );
    const detailBody = await detailAfterB.json();
    expect(detailBody.data.ownerId).toBe(targetTicket.ownerId);

    // 4. Owning Requester (Alice Johnson) views Actions Taken in read-only mode (AC-04)
    const reqLogin = await request.post("http://localhost:3000/api/auth/login", {
      data: { email: "alice.johnson@toktickit.local", password: "Password123!" },
    });
    expect(reqLogin.ok()).toBeTruthy();
    const reqBody = await reqLogin.json();

    await page.evaluate(
      ({ token, user }) => {
        localStorage.setItem("toktickit_auth_token", token);
        localStorage.setItem("toktickit_auth_user", JSON.stringify(user));
      },
      { token: reqBody.token, user: reqBody.user }
    );
    await page.reload();

    // Open ticket detail in UI and verify read-only Actions Taken Work Log
    await page.getByText(targetTicket.summary).first().click();
    await expect(
      page.getByRole("heading", { name: /Actions Taken Work Log/i })
    ).toBeVisible();
    await expect(
      page.getByText("E2E-01 Staff A diagnostic check on enterprise gateway")
    ).toBeVisible();
    await expect(
      page.getByText("E2E-01 Staff B collaborative routing verification")
    ).toBeVisible();

    // Requester must NOT see "+ Add Action Taken" or "Edit Action" controls (AC-03, AC-04)
    await expect(
      page.getByRole("button", { name: /\+ Add Action Taken/i })
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Edit Action/i })
    ).toHaveCount(0);
  });
});
