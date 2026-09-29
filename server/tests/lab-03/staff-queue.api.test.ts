import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Lab 3 Staff Queue, Workflow & Internal Notes APIs", () => {
  let kevinToken: string; // IT_STAFF
  let michaelToken: string; // REQUESTER
  let createdTicketId: number;

  beforeAll(async () => {
    // Login as Kevin Patel (IT Staff)
    const kRes = await request(app).post("/api/auth/login").send({
      email: "kevin.patel@toktickit.com",
      password: "Password123!",
    });
    kevinToken = kRes.body.token;

    // Login as Michael Brown (Requester)
    const mRes = await request(app).post("/api/auth/login").send({
      email: "michael.brown@toktickit.com",
      password: "Password123!",
    });
    michaelToken = mRes.body.token;

    // Create a test ticket as Requester for IT Staff queue handling
    const tRes = await request(app)
      .post("/api/requesters/tickets")
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "HIGH",
        summary: "VPN Connection Timeout Investigation",
        description: "VPN client fails to complete handshake when connecting from remote home network.",
      });
    createdTicketId = tRes.body.data.id;
  });

  it("GET /api/staff/tickets - should return ticket queue for IT Staff", async () => {
    const res = await request(app)
      .get("/api/staff/tickets")
      .set("Authorization", `Bearer ${kevinToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty("totalItems");
  });

  it("GET /api/staff/tickets - should reject Requester with 403 Forbidden", async () => {
    const res = await request(app)
      .get("/api/staff/tickets")
      .set("Authorization", `Bearer ${michaelToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("PATCH /api/staff/tickets/:id/assign - should claim ticket ownership for IT Staff", async () => {
    const res = await request(app)
      .patch(`/api/staff/tickets/${createdTicketId}/assign`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.owner).toBeDefined();
    expect(res.body.data.owner.email).toBe("kevin.patel@toktickit.com");
  });

  it("PATCH /api/staff/tickets/:id/workflow - should update IT Priority and Status", async () => {
    const res = await request(app)
      .patch(`/api/staff/tickets/${createdTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        itPriority: "URGENT",
        status: "IN_PROGRESS",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.itPriority).toBe("URGENT");
    expect(res.body.data.status).toBe("IN_PROGRESS");
  });

  it("POST /api/tickets/:id/notes - should allow IT Staff to post Internal Note", async () => {
    const res = await request(app)
      .post(`/api/tickets/${createdTicketId}/notes`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        content: "Verified firewall logs; user IP was blocked by rate limiter.",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe("Verified firewall logs; user IP was blocked by rate limiter.");
  });

  it("GET /api/tickets/:id/notes - should prevent Requester from viewing Internal Notes (403)", async () => {
    const res = await request(app)
      .get(`/api/tickets/${createdTicketId}/notes`)
      .set("Authorization", `Bearer ${michaelToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
