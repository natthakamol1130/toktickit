import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("API: Attachment Endpoints", () => {
  let requesterId: number;
  let ticketId: number;

  beforeAll(async () => {
    const reqRes = await request(app).get("/api/requesters");
    requesterId = reqRes.body.data[0].id;

    const catRes = await request(app).get("/api/categories");
    const sysRes = await request(app).get("/api/related-systems");
    const catId = Array.isArray(catRes.body) ? catRes.body[0].id : catRes.body.data[0].id;

    const createRes = await request(app)
      .post("/api/tickets")
      .set("x-requester-id", requesterId.toString())
      .send({
        categoryId: catId,
        relatedSystemId: sysRes.body.data[0].id,
        requestedPriority: "LOW",
        summary: "Attachment lifecycle test ticket",
        description: "Testing upload, soft removal, and download blocking for attachments",
      });

    ticketId = createRes.body.data.id;
  });

  it("API-05: should reject attachment upload with unsupported mime type (BR-06, AC-06)", async () => {
    const res = await request(app)
      .post(`/api/tickets/${ticketId}/attachments`)
      .set("x-requester-id", requesterId.toString())
      .attach("file", Buffer.from("console.log('test')"), {
        filename: "script.exe",
        contentType: "application/x-msdownload",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("API-07 & API-08: should upload active attachment, soft-remove with reason, and block download (BR-07, AC-08)", async () => {
    // 1. Upload valid attachment
    const uploadRes = await request(app)
      .post(`/api/tickets/${ticketId}/attachments`)
      .set("x-requester-id", requesterId.toString())
      .attach("file", Buffer.from("%PDF-1.4 dummy pdf content"), {
        filename: "test_doc.pdf",
        contentType: "application/pdf",
      });

    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.success).toBe(true);
    const attachmentId = uploadRes.body.data.id;

    // 2. Download active attachment
    const downloadRes = await request(app)
      .get(`/api/attachments/${attachmentId}/download`)
      .set("x-requester-id", requesterId.toString());

    expect(downloadRes.status).toBe(200);

    // 3. Soft-remove attachment with reason
    const removeRes = await request(app)
      .delete(`/api/attachments/${attachmentId}`)
      .set("x-requester-id", requesterId.toString())
      .send({ reason: "Uploaded outdated document" });

    expect(removeRes.status).toBe(200);
    expect(removeRes.body.data.isRemoved).toBe(true);
    expect(removeRes.body.data.removalReason).toBe("Uploaded outdated document");

    // 4. Download soft-removed attachment (should be blocked with 410 Gone)
    const blockedRes = await request(app)
      .get(`/api/attachments/${attachmentId}/download`)
      .set("x-requester-id", requesterId.toString());

    expect(blockedRes.status).toBe(410);
    expect(blockedRes.body.error.code).toBe("ATTACHMENT_REMOVED");
  });
});
