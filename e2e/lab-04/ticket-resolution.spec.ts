import { test, expect } from "@playwright/test";

test.describe("Lab 4 E2E-02: Ticket Resolution Gate & Concurrency Conflict Detection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("E2E-02: Requester indicates problem resolved (advisory) -> Staff formally resolves -> Stale update triggers 409 Conflict (AC-07, AC-08)", async ({
    page,
    request,
  }) => {
    // 1. Login as Requester (Alice Johnson) and create or select an active ticket
    const reqLogin = await request.post("http://localhost:3000/api/auth/login", {
      data: { email: "alice.johnson@toktickit.local", password: "Password123!" },
    });
    expect(reqLogin.ok()).toBeTruthy();
    const { token: reqToken, user: reqUser } = await reqLogin.json();

    // Login as IT Staff (Bob Chen)
    const staffLogin = await request.post("http://localhost:3000/api/auth/login", {
      data: { email: "bob.chen@toktickit.local", password: "Password123!" },
    });
    expect(staffLogin.ok()).toBeTruthy();
    const { token: staffToken } = await staffLogin.json();

    // Find an IN_PROGRESS or OPEN ticket owned by Alice
    const myTicketsRes = await request.get(
      "http://localhost:3000/api/requester/tickets",
      {
        headers: { Authorization: `Bearer ${reqToken}` },
      }
    );
    const myTickets = (await myTicketsRes.json()).data;
    const activeTicket =
      myTickets.find(
        (t: any) => t.status === "IN_PROGRESS" || t.status === "OPEN"
      ) || myTickets[0];
    expect(activeTicket).toBeDefined();

    // 2. Requester triggers "Problem Appears Resolved" advisory endpoint (AC-07)
    const indicateRes = await request.patch(
      `http://localhost:3000/api/requester/tickets/${activeTicket.id}/indicate-resolved`,
      {
        headers: { Authorization: `Bearer ${reqToken}` },
        data: { note: "Issue appears fixed on my laptop now, thank you!" },
      }
    );
    expect(indicateRes.status()).toBe(200);
    const indicatedTicket = (await indicateRes.json()).data;

    // Status must NOT become RESOLVED automatically (Resolution Gate BR-07)
    expect(indicatedTicket.requesterResolved).toBe(true);
    expect(indicatedTicket.status).toBe(activeTicket.status);

    // 3. Stale concurrency check: attempt status update with outdated expectedUpdatedAt (AC-08)
    const staleRes = await request.patch(
      `http://localhost:3000/api/staff/tickets/${activeTicket.id}`,
      {
        headers: { Authorization: `Bearer ${staffToken}` },
        data: {
          status: "RESOLVED",
          expectedUpdatedAt: "2020-01-01T00:00:00.000Z",
        },
      }
    );
    expect(staleRes.status()).toBe(409);

    // 4. Formal resolution by IT Staff with current expectedUpdatedAt (AC-06, AC-07)
    const resolveRes = await request.patch(
      `http://localhost:3000/api/staff/tickets/${activeTicket.id}`,
      {
        headers: { Authorization: `Bearer ${staffToken}` },
        data: {
          status: "RESOLVED",
          expectedUpdatedAt: indicatedTicket.updatedAt,
        },
      }
    );
    expect(resolveRes.status()).toBe(200);
    const resolvedBody = await resolveRes.json();
    expect(resolvedBody.data.status).toBe("RESOLVED");

    // 5. Verify UI reflects RESOLVED status for Requester
    await page.evaluate(
      ({ token, user }) => {
        localStorage.setItem("toktickit_auth_token", token);
        localStorage.setItem("toktickit_auth_user", JSON.stringify(user));
      },
      { token: reqToken, user: reqUser }
    );
    await page.reload();
    await expect(page.getByText(activeTicket.summary).first()).toBeVisible();
  });
});
