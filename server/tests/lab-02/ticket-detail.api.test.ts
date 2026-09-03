import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("API: Ticket Detail Endpoint", () => {
  let requesterAId: number;
  let requesterBId: number;
  let ticketIdOwnedByA: number;

  beforeAll(async () => {
    const reqRes = await request(app).get("/api/requesters");
    requesterAId = reqRes.body.data[0].id;
    requesterBId = reqRes.body.data[1].id;

    const catRes = await request(app).get("/api/categories");
    const sysRes = await request(app).get("/api/related-systems");
    const catId = Array.isArray(catRes.body) ? catRes.body[0].id : catRes.body.data[0].id;

    // Create a ticket owned by Requester A
    const createRes = await request(app)
      .post("/api/tickets")
      .set("x-requester-id", requesterAId.toString())
      .send({
        categoryId: catId,
        relatedSystemId: sysRes.body.data[0].id,
        requestedPriority: "MEDIUM",
        summary: "Detail ownership test ticket for A",
        description: "Testing ticket detail ownership isolation between requesters",
      });

    expect(createRes.status).toBe(201);
    ticketIdOwnedByA = createRes.body.data.id;
  });

  it("should return ticket details when requested by owner (AC-01, FR-11)", async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketIdOwnedByA}`)
      .set("x-requester-id", requesterAId.toString());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(ticketIdOwnedByA);
    expect(res.body.data.summary).toBe("Detail ownership test ticket for A");
  });

  it("API-04: should return 403 Forbidden when Requester B attempts to view Requester A's ticket (BR-05, AC-04)", async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketIdOwnedByA}`)
      .set("x-requester-id", requesterBId.toString());

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });
});
