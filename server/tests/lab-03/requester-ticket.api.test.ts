import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Lab 3 Requester Ticket & Public Comment APIs", () => {
  let michaelToken: string;
  let jenniferToken: string;
  let adminToken: string;
  let createdTicketId: number;

  beforeAll(async () => {
    // Login as Michael Brown (Requester)
    const mRes = await request(app).post("/api/auth/login").send({
      email: "michael.brown@toktickit.com",
      password: "Password123!",
    });
    michaelToken = mRes.body.token;

    // Login as Jennifer Anderson (Requester)
    const jRes = await request(app).post("/api/auth/login").send({
      email: "jennifer.anderson@toktickit.com",
      password: "InitialPassword123!",
    });
    jenniferToken = jRes.body.token;

    // Login as John Smith (Admin)
    const aRes = await request(app).post("/api/auth/login").send({
      email: "john.smith@toktickit.com",
      password: "Password123!",
    });
    adminToken = aRes.body.token;
  });

  it("POST /api/requesters/tickets - should create a ticket under authenticated Requester identity", async () => {
    const res = await request(app)
      .post("/api/requesters/tickets")
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "HIGH",
        summary: "Laptop Screen Flickering Issue",
        description: "The laptop display flickers randomly during work and requires hardware inspection.",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.summary).toBe("Laptop Screen Flickering Issue");

    createdTicketId = res.body.data.id;
  });

  it("GET /api/requesters/tickets - should return paginated tickets owned strictly by Requester", async () => {
    const res = await request(app)
      .get("/api/requesters/tickets")
      .set("Authorization", `Bearer ${michaelToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty("totalItems");
    expect(res.body.pagination).toHaveProperty("currentPage", 1);
  });

  it("GET /api/requesters/tickets - should reject unauthenticated requests with 401", async () => {
    const res = await request(app).get("/api/requesters/tickets");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/tickets/:id/comments - should post a public comment on ticket", async () => {
    const res = await request(app)
      .post(`/api/tickets/${createdTicketId}/comments`)
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({
        content: "Adding additional screenshot details regarding the screen flicker.",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe("Adding additional screenshot details regarding the screen flicker.");
    expect(res.body.data.author.email).toBe("michael.brown@toktickit.com");
  });

  it("GET /api/tickets/:id/comments - should retrieve public comments for ticket", async () => {
    const res = await request(app)
      .get(`/api/tickets/${createdTicketId}/comments`)
      .set("Authorization", `Bearer ${michaelToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("POST /api/tickets/:id/comments - should prevent Requester from commenting on another user's ticket (403)", async () => {
    const res = await request(app)
      .post(`/api/tickets/${createdTicketId}/comments`)
      .set("Authorization", `Bearer ${jenniferToken}`)
      .send({
        content: "Unauthorized attempt to comment.",
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
