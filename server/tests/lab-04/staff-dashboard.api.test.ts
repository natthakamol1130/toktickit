import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Lab 4: IT Staff & Administrator Dashboard REST APIs (API-11, API-12)", () => {
  let kevinToken: string; // IT_STAFF
  let adminToken: string; // ADMINISTRATOR
  let michaelToken: string; // REQUESTER

  beforeAll(async () => {
    const kRes = await request(app).post("/api/auth/login").send({
      email: "kevin.patel@toktickit.com",
      password: "Password123!",
    });
    kevinToken = kRes.body.token;

    const aRes = await request(app).post("/api/auth/login").send({
      email: "john.smith@toktickit.com",
      password: "Password123!",
    });
    adminToken = aRes.body.token;

    const mRes = await request(app).post("/api/auth/login").send({
      email: "michael.brown@toktickit.com",
      password: "Password123!",
    });
    michaelToken = mRes.body.token;
  });

  it("API-11: should return real-time operational queue metrics, priority breakdown, and recent tickets for IT Staff (AC-10, FR-11, BR-10)", async () => {
    const res = await request(app)
      .get("/api/staff/dashboard")
      .set("Authorization", `Bearer ${kevinToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();

    const { metrics, byPriority, recentTickets } = res.body.data;
    expect(typeof metrics.newTickets).toBe("number");
    expect(typeof metrics.openTickets).toBe("number");
    expect(typeof metrics.inProgress).toBe("number");
    expect(typeof metrics.waitingForRequester).toBe("number");
    expect(typeof metrics.myAssigned).toBe("number");
    expect(typeof metrics.unassigned).toBe("number");
    expect(metrics.myAssigned).toBeGreaterThanOrEqual(1);

    expect(byPriority).toBeDefined();
    expect(typeof byPriority.URGENT).toBe("number");
    expect(typeof byPriority.HIGH).toBe("number");
    expect(typeof byPriority.MEDIUM).toBe("number");
    expect(typeof byPriority.LOW).toBe("number");

    expect(Array.isArray(recentTickets)).toBe(true);
    expect(recentTickets.length).toBeGreaterThanOrEqual(1);
    expect(recentTickets.length).toBeLessThanOrEqual(5);
    expect(recentTickets[0].requester).toBeDefined();
    expect(recentTickets[0].ticketNumber).toBe(recentTickets[0].ticketNo);
  });

  it("API-12: should include userSummary account metrics for Administrator and support alias GET /api/dashboards/staff (FR-11, BR-11)", async () => {
    const res = await request(app)
      .get("/api/dashboards/staff")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { userSummary, metrics } = res.body.data;
    expect(userSummary).toBeDefined();
    expect(userSummary.totalUsers).toBeGreaterThanOrEqual(7);
    expect(userSummary.activeUsers).toBeGreaterThanOrEqual(5);
    expect(userSummary.inactiveUsers).toBeGreaterThanOrEqual(2);
    expect(userSummary.activeRequesters).toBeGreaterThanOrEqual(2);
    expect(userSummary.activeStaff).toBeGreaterThanOrEqual(2);
    expect(userSummary.activeAdmins).toBeGreaterThanOrEqual(1);
    expect(typeof metrics.unassignedCount).toBe("number");
  });

  it("API-11b: should reject Requester access to Staff Dashboard with 403 Forbidden and unauthenticated access with 401", async () => {
    const reqRes = await request(app)
      .get("/api/staff/dashboard")
      .set("Authorization", `Bearer ${michaelToken}`);
    expect(reqRes.status).toBe(403);

    const unauthRes = await request(app).get("/api/staff/dashboard");
    expect(unauthRes.status).toBe(401);
  });
});
