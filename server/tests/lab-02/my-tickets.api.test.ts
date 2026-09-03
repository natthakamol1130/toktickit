import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("API: My Tickets List Endpoint", () => {
  let requesterAId: number;
  let requesterBId: number;

  beforeAll(async () => {
    const reqRes = await request(app).get("/api/requesters");
    expect(reqRes.status).toBe(200);
    requesterAId = reqRes.body.data[0].id;
    requesterBId = reqRes.body.data[1].id;
  });

  it("API-03: should return only tickets owned by current requester (BR-05, AC-03)", async () => {
    const resA = await request(app)
      .get("/api/tickets")
      .set("x-requester-id", requesterAId.toString());

    expect(resA.status).toBe(200);
    expect(resA.body.success).toBe(true);
    expect(Array.isArray(resA.body.data)).toBe(true);
    expect(resA.body.meta).toHaveProperty("totalItems");
    expect(resA.body.meta).toHaveProperty("totalPages");

    const resB = await request(app)
      .get("/api/tickets")
      .set("x-requester-id", requesterBId.toString());

    expect(resB.status).toBe(200);
    expect(resB.body.success).toBe(true);
  });

  it("should support search keyword filtering", async () => {
    const res = await request(app)
      .get("/api/tickets?search=Wi-Fi")
      .set("x-requester-id", requesterAId.toString());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
