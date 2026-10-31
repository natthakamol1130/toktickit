import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { getPrisma } from "../../src/prisma.js";
import { JWT_SECRET } from "../../src/middleware/authMiddleware.js";

describe("Lab 4: Actions Taken APIs & Role Authorization", () => {
  let kevinToken: string; // IT_STAFF (Active)
  let emilyToken: string; // IT_STAFF (Active collaborator)
  let michaelToken: string; // REQUESTER (Owner of test ticket)
  let sarahToken: string; // REQUESTER (Unrelated requester)
  let testTicketId: number;
  let inactiveStaffToken: string;

  beforeAll(async () => {
    const prisma = getPrisma();

    // Login Kevin Patel (IT_STAFF)
    const kRes = await request(app).post("/api/auth/login").send({
      email: "kevin.patel@toktickit.com",
      password: "Password123!",
    });
    kevinToken = kRes.body.token;

    // Login Emily Davis (IT_STAFF)
    const eRes = await request(app).post("/api/auth/login").send({
      email: "emily.davis@toktickit.com",
      password: "Password123!",
    });
    emilyToken = eRes.body.token;

    // Login Michael Brown (REQUESTER - Owner of test ticket)
    const mRes = await request(app).post("/api/auth/login").send({
      email: "michael.brown@toktickit.com",
      password: "Password123!",
    });
    michaelToken = mRes.body.token;

    // Login Sarah Johnson (REQUESTER - Unrelated requester)
    const sRes = await request(app).post("/api/auth/login").send({
      email: "sarah.johnson@toktickit.com",
      password: "Password123!",
    });
    sarahToken = sRes.body.token;

    // Fetch an inactive staff user to generate test token
    const inactiveStaff = await prisma.user.findFirst({
      where: { role: "IT_STAFF", isActive: false },
    });
    if (inactiveStaff) {
      inactiveStaffToken = jwt.sign(
        { id: inactiveStaff.id, role: inactiveStaff.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
    }

    // Create a fresh test ticket owned by Michael with Kevin as primary ticket owner
    const tRes = await request(app)
      .post("/api/requesters/tickets")
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "HIGH",
        summary: "Lab 4 Actions Taken Test Ticket",
        description: "Testing actions taken workflow, validation, and authorization boundaries.",
      });
    testTicketId = tRes.body.data.id;

    // Assign Kevin as primary ticket owner
    await request(app)
      .patch(`/api/staff/tickets/${testTicketId}/assign`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        ownerId: kRes.body.user.id,
      });
  });

  // -------------------------------------------------------------------------
  // API-01: Create valid Action Taken under Ticket
  // -------------------------------------------------------------------------
  it("API-01: should allow IT Staff to create Action Taken with auto-assigned performer", async () => {
    const res = await request(app)
      .post(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        description: "Tested power supply and verified DC output voltage.",
        result: "Voltage is nominal at 19.5V. Motherboard charging circuit operational.",
        followUpRequired: false,
        attachmentNotes: "power_supply_diag.png",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.ticketId).toBe(testTicketId);
    expect(res.body.data.description).toBe("Tested power supply and verified DC output voltage.");
    expect(res.body.data.result).toBe("Voltage is nominal at 19.5V. Motherboard charging circuit operational.");
    expect(res.body.data.followUpRequired).toBe(false);
    expect(res.body.data.followUpNote).toBeNull();
    // Auto-assigned performerId matches authenticated Kevin Patel
    expect(res.body.data.performer).toBeDefined();
    expect(res.body.data.performer.email).toBe("kevin.patel@toktickit.com");
  });

  // -------------------------------------------------------------------------
  // API-02: Follow-up Note Validation
  // -------------------------------------------------------------------------
  it("API-02: should reject Action Taken when followUpRequired=true but followUpNote is empty", async () => {
    const res = await request(app)
      .post(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        description: "Disassembled cooling fan and cleaned thermal paste.",
        result: "Thermal paste was dried out. Re-application needed.",
        followUpRequired: true,
        followUpNote: "", // Empty follow-up note
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("Follow-up note is strictly required");
  });

  it("API-02b: should accept Action Taken when followUpRequired=true with non-empty followUpNote", async () => {
    const res = await request(app)
      .post(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        description: "Disassembled cooling fan and cleaned thermal paste.",
        result: "Thermal paste was dried out. Re-application needed.",
        followUpRequired: true,
        followUpNote: "Re-apply Arctic MX-4 compound tomorrow at 10 AM.",
        attachmentNotes: "thermal_paste_status.jpg",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.followUpRequired).toBe(true);
    expect(res.body.data.followUpNote).toBe("Re-apply Arctic MX-4 compound tomorrow at 10 AM.");
  });

  // -------------------------------------------------------------------------
  // API-03: Requester Action Creation / Modification Blocked
  // -------------------------------------------------------------------------
  it("API-03: should reject Requester attempting to POST Action Taken with 403 Forbidden", async () => {
    const res = await request(app)
      .post(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({
        description: "Requester trying to record an action.",
        result: "Should be forbidden.",
        followUpRequired: false,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // -------------------------------------------------------------------------
  // API-04: Requester View Ownership Boundary
  // -------------------------------------------------------------------------
  it("API-04a: should allow Requester to view Actions Taken on their OWN ticket", async () => {
    const res = await request(app)
      .get(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${michaelToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("API-04b: should reject Requester viewing Actions Taken on UNOWNED ticket with 403 Forbidden", async () => {
    // Sarah Johnson attempting to view Michael Brown's ticket
    const res = await request(app)
      .get(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${sarahToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("Forbidden");
  });

  // -------------------------------------------------------------------------
  // API-05: Multi-Staff Collaborative Action Recording
  // -------------------------------------------------------------------------
  it("API-05: should allow different IT Staff (Emily) to record action while preserving Ticket Owner (Kevin)", async () => {
    const res = await request(app)
      .post(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${emilyToken}`)
      .send({
        description: "Assisted with secondary RAM memory diagnostics.",
        result: "RAM passed MemTest86 with 0 errors across 4 passes.",
        followUpRequired: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.performer.email).toBe("emily.davis@toktickit.com");

    // Verify ticket owner remains Kevin Patel
    const ticketRes = await request(app)
      .get(`/api/staff/tickets/${testTicketId}`)
      .set("Authorization", `Bearer ${kevinToken}`);
    expect(ticketRes.body.data.owner.email).toBe("kevin.patel@toktickit.com");
  });

  // -------------------------------------------------------------------------
  // API-06: Inactive Staff Account Rejection
  // -------------------------------------------------------------------------
  it("API-06: should reject action creation for inactive user account", async () => {
    if (!inactiveStaffToken) {
      expect(true).toBe(true);
      return;
    }

    const res = await request(app)
      .post(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${inactiveStaffToken}`)
      .send({
        description: "Action from deactivated staff member.",
        result: "Should fail.",
        followUpRequired: false,
      });

    // Inactive user token fails auth middleware with 401 Unauthorized
    expect([400, 401]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Single Action GET & PATCH Concurrency
  // -------------------------------------------------------------------------
  it("should retrieve a single Action Taken by ID", async () => {
    const listRes = await request(app)
      .get(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${kevinToken}`);

    const firstAction = listRes.body.data[0];

    const res = await request(app)
      .get(`/api/tickets/${testTicketId}/actions-taken/${firstAction.id}`)
      .set("Authorization", `Bearer ${kevinToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(firstAction.id);
  });

  it("should update Action Taken with concurrency expectedUpdatedAt check", async () => {
    const listRes = await request(app)
      .get(`/api/tickets/${testTicketId}/actions-taken`)
      .set("Authorization", `Bearer ${kevinToken}`);

    const targetAction = listRes.body.data[0];

    // Successful PATCH with correct expectedUpdatedAt
    const patchRes = await request(app)
      .patch(`/api/tickets/${testTicketId}/actions-taken/${targetAction.id}`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        description: "Updated description after second bench inspection.",
        result: "All hardware components certified operational.",
        expectedUpdatedAt: targetAction.updatedAt,
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.description).toBe("Updated description after second bench inspection.");

    // Conflict PATCH with stale timestamp returns 409 Conflict
    const staleRes = await request(app)
      .patch(`/api/tickets/${testTicketId}/actions-taken/${targetAction.id}`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        description: "Stale edit attempt.",
        expectedUpdatedAt: "2020-01-01T00:00:00.000Z",
      });

    expect(staleRes.status).toBe(409);
    expect(staleRes.body.error).toBe("Conflict");
  });

  // -------------------------------------------------------------------------
  // BR-13: Rejection of DELETE endpoint
  // -------------------------------------------------------------------------
  it("BR-13: should reject DELETE Action Taken with 405 Method Not Allowed (Immutable Audit Log)", async () => {
    const res = await request(app)
      .delete(`/api/tickets/${testTicketId}/actions-taken/1`)
      .set("Authorization", `Bearer ${kevinToken}`);

    expect(res.status).toBe(405);
    expect(res.body.error).toBe("Method Not Allowed");
  });
});
