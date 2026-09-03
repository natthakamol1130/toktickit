import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("API: Create Ticket Endpoint", () => {
  let activeRequesterId: number;
  let categoryId: number;
  let relatedSystemId: number;

  beforeAll(async () => {
    // Fetch active requesters, categories, and systems
    const reqRes = await request(app).get("/api/requesters");
    expect(reqRes.status).toBe(200);
    activeRequesterId = reqRes.body.data[0].id;

    const catRes = await request(app).get("/api/categories");
    expect(catRes.status).toBe(200);
    categoryId = Array.isArray(catRes.body) ? catRes.body[0].id : catRes.body.data[0].id;

    const sysRes = await request(app).get("/api/related-systems");
    expect(sysRes.status).toBe(200);
    relatedSystemId = sysRes.body.data[0].id;
  });

  it("API-01: should create a valid ticket and return official Ticket Number (AC-01, FR-04)", async () => {
    const payload = {
      categoryId,
      relatedSystemId,
      requestedPriority: "HIGH",
      summary: "Cannot connect to campus Wi-Fi from library",
      description: "My laptop keeps disconnecting from the campus Wi-Fi whenever I walk into the central library building.",
    };

    const res = await request(app)
      .post("/api/tickets")
      .set("x-requester-id", activeRequesterId.toString())
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("ticketNo");
    expect(res.body.data.ticketNo).toMatch(/^TKT-\d{4}-\d{6}$/);
    expect(res.body.data.status).toBe("NEW");
    expect(res.body.data.summary).toBe(payload.summary);
  });

  it("API-02: should return 400 validation error when required fields are invalid (BR-08, AC-05)", async () => {
    const payload = {
      categoryId,
      relatedSystemId,
      requestedPriority: "MEDIUM",
      summary: "Abc",
      description: "Too short",
    };

    const res = await request(app)
      .post("/api/tickets")
      .set("x-requester-id", activeRequesterId.toString())
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details).toHaveProperty("summary");
    expect(res.body.error.details).toHaveProperty("description");
  });

  it("should return 401 Unauthorized if x-requester-id is missing", async () => {
    const res = await request(app).post("/api/tickets").send({
      categoryId,
      relatedSystemId,
      summary: "Valid summary for missing auth test",
      description: "Valid description long enough for test",
    });

    expect(res.status).toBe(401);
  });
});
