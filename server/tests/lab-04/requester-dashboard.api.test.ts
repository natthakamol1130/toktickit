import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Lab 4: Requester Dashboard REST API (API-10)", () => {
  let michaelToken: string; // REQUESTER
  let michaelId: number;
  let sarahToken: string; // REQUESTER
  let sarahId: number;
  let kevinToken: string; // IT_STAFF

  beforeAll(async () => {
    const mRes = await request(app).post("/api/auth/login").send({
      email: "michael.brown@toktickit.com",
      password: "Password123!",
    });
    michaelToken = mRes.body.token;
    michaelId = mRes.body.user.id;

    const sRes = await request(app).post("/api/auth/login").send({
      email: "sarah.johnson@toktickit.com",
      password: "Password123!",
    });
    sarahToken = sRes.body.token;
    sarahId = sRes.body.user.id;

    const kRes = await request(app).post("/api/auth/login").send({
      email: "kevin.patel@toktickit.com",
      password: "Password123!",
    });
    kevinToken = kRes.body.token;
  });

  it("API-10a: should return Requester dashboard metrics strictly isolated to authenticated Requester (AC-09, BR-09)", async () => {
    const res = await request(app)
      .get("/api/requesters/dashboard")
      .set("Authorization", `Bearer ${michaelToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.metrics).toBeDefined();

    const { metrics, recentTickets, quickActions } = res.body.data;
    expect(typeof metrics.totalOpen).toBe("number");
    expect(typeof metrics.inProgress).toBe("number");
    expect(typeof metrics.waitingForRequester).toBe("number");
    expect(typeof metrics.resolved).toBe("number");
    expect(typeof metrics.closed).toBe("number");
    expect(metrics.totalOpen).toBeGreaterThanOrEqual(0);

    expect(Array.isArray(recentTickets)).toBe(true);
    expect(recentTickets.length).toBeLessThanOrEqual(5);
    for (const ticket of recentTickets) {
      expect(ticket.requesterId).toBe(michaelId);
      expect(ticket.requesterId).not.toBe(sarahId);
      expect(ticket.ticketNumber).toBe(ticket.ticketNo);
      expect(ticket.category).toBeDefined();
    }

    expect(Array.isArray(quickActions)).toBe(true);
    expect(quickActions.length).toBeGreaterThanOrEqual(2);
  });

  it("API-10b: should also support alias GET /api/dashboards/requester and return numeric 0 without NaN or null for empty status buckets (BR-11)", async () => {
    const res = await request(app)
      .get("/api/dashboards/requester")
      .set("Authorization", `Bearer ${sarahToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { metrics, recentTickets } = res.body.data;
    for (const key of [
      "totalOpen",
      "openCount",
      "inProgress",
      "inProgressCount",
      "waitingForRequester",
      "waitingOnMeCount",
      "resolved",
      "resolvedCount",
      "closed",
      "closedCount",
    ]) {
      expect(typeof metrics[key]).toBe("number");
      expect(Number.isNaN(metrics[key])).toBe(false);
      expect(metrics[key]).not.toBeNull();
      expect(metrics[key]).toBeGreaterThanOrEqual(0);
    }

    for (const ticket of recentTickets) {
      expect(ticket.requesterId).toBe(sarahId);
    }
  });

  it("API-10c: should reject unauthenticated access with 401 and non-Requester roles with 403", async () => {
    const unauthRes = await request(app).get("/api/requesters/dashboard");
    expect(unauthRes.status).toBe(401);

    const staffRes = await request(app)
      .get("/api/requesters/dashboard")
      .set("Authorization", `Bearer ${kevinToken}`);
    expect(staffRes.status).toBe(403);
  });
});
