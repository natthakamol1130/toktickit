import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Lab 4: Ticket Workflow State Machine, Resolution Gate & Concurrency APIs", () => {
  let kevinToken: string; // IT_STAFF
  let adminToken: string; // ADMINISTRATOR
  let michaelToken: string; // REQUESTER (Ticket Owner)
  let sarahToken: string; // REQUESTER (Unrelated Requester)
  let workflowTicketId: number;
  let resolutionGateTicketId: number;
  let concurrencyTicketId: number;

  beforeAll(async () => {
    // Login Kevin Patel (IT_STAFF)
    const kRes = await request(app).post("/api/auth/login").send({
      email: "kevin.patel@toktickit.com",
      password: "Password123!",
    });
    kevinToken = kRes.body.token;

    // Login John Smith (ADMINISTRATOR)
    const aRes = await request(app).post("/api/auth/login").send({
      email: "john.smith@toktickit.com",
      password: "Password123!",
    });
    adminToken = aRes.body.token;

    // Login Michael Brown (REQUESTER)
    const mRes = await request(app).post("/api/auth/login").send({
      email: "michael.brown@toktickit.com",
      password: "Password123!",
    });
    michaelToken = mRes.body.token;

    // Login Sarah Johnson (REQUESTER)
    const sRes = await request(app).post("/api/auth/login").send({
      email: "sarah.johnson@toktickit.com",
      password: "Password123!",
    });
    sarahToken = sRes.body.token;

    // 1. Create ticket for transition matrix tests (starts in NEW)
    const t1 = await request(app)
      .post("/api/requesters/tickets")
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "MEDIUM",
        summary: "Transition Matrix Verification Ticket",
        description: "Testing permitted and disallowed ticket status transitions on the backend.",
      });
    workflowTicketId = t1.body.data.id;

    // 2. Create ticket for Resolution Gate & Advisory Flag tests
    const t2 = await request(app)
      .post("/api/requesters/tickets")
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "HIGH",
        summary: "Resolution Gate Advisory Test Ticket",
        description: "Testing requester advisory resolution vs formal IT Staff resolution.",
      });
    resolutionGateTicketId = t2.body.data.id;

    // Assign and move t2 to IN_PROGRESS
    await request(app)
      .patch(`/api/staff/tickets/${resolutionGateTicketId}/assign`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({});

    // 3. Create ticket for Concurrency 409 Conflict tests
    const t3 = await request(app)
      .post("/api/requesters/tickets")
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({
        categoryId: 1,
        relatedSystemId: 1,
        requestedPriority: "HIGH",
        summary: "Optimistic Concurrency Test Ticket",
        description: "Testing stale updatedAt detection and 409 Conflict safe failure.",
      });
    concurrencyTicketId = t3.body.data.id;
  });

  // -------------------------------------------------------------------------
  // API-07: State Transition Matrix Enforcement (AC-06, FR-07, BR-06)
  // -------------------------------------------------------------------------
  it("API-07a: should reject disallowed status transition from NEW directly to RESOLVED or CLOSED (400 Bad Request - AC-06)", async () => {
    const resResolved = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "RESOLVED" });

    expect(resResolved.status).toBe(400);
    expect(resResolved.body.success).toBe(false);
    expect(resResolved.body.error.message).toMatch(/Disallowed status transition/i);

    const resClosed = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "CLOSED" });

    expect(resClosed.status).toBe(400);
    expect(resClosed.body.success).toBe(false);
  });

  it("API-07b: should allow valid transition NEW -> OPEN and reject OPEN directly to CLOSED (400 Bad Request - AC-06)", async () => {
    // Valid: NEW -> OPEN
    const openRes = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "OPEN", itPriority: "MEDIUM" });

    expect(openRes.status).toBe(200);
    expect(openRes.body.data.status).toBe("OPEN");

    // Invalid: OPEN -> CLOSED directly
    const invalidCloseRes = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "CLOSED" });

    expect(invalidCloseRes.status).toBe(400);
    expect(invalidCloseRes.body.success).toBe(false);
    expect(invalidCloseRes.body.error.message).toContain("OPEN to CLOSED");
  });

  it("API-07c: should support complete valid lifecycle OPEN -> IN_PROGRESS -> WAITING_FOR_REQUESTER -> RESOLVED -> REOPENED -> RESOLVED -> CLOSED", async () => {
    // OPEN -> IN_PROGRESS
    const inProgRes = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "IN_PROGRESS" });
    expect(inProgRes.status).toBe(200);
    expect(inProgRes.body.data.status).toBe("IN_PROGRESS");

    // IN_PROGRESS -> WAITING_FOR_REQUESTER
    const waitingRes = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "WAITING_FOR_REQUESTER" });
    expect(waitingRes.status).toBe(200);
    expect(waitingRes.body.data.status).toBe("WAITING_FOR_REQUESTER");

    // WAITING_FOR_REQUESTER -> RESOLVED
    const resolvedRes = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "RESOLVED" });
    expect(resolvedRes.status).toBe(200);
    expect(resolvedRes.body.data.status).toBe("RESOLVED");

    // RESOLVED -> REOPENED
    const reopenedRes = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "REOPENED" });
    expect(reopenedRes.status).toBe(200);
    expect(reopenedRes.body.data.status).toBe("REOPENED");

    // REOPENED -> RESOLVED
    const reResolvedRes = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "RESOLVED" });
    expect(reResolvedRes.status).toBe(200);
    expect(reResolvedRes.body.data.status).toBe("RESOLVED");

    // RESOLVED -> CLOSED
    const closedRes = await request(app)
      .patch(`/api/staff/tickets/${workflowTicketId}/workflow`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "CLOSED" });
    expect(closedRes.status).toBe(200);
    expect(closedRes.body.data.status).toBe("CLOSED");
  });

  // -------------------------------------------------------------------------
  // API-08: Resolution Gate & Requester Advisory Indication (AC-07, FR-08, BR-07)
  // -------------------------------------------------------------------------
  it("API-08a: should block Requester from directly transitioning a ticket to RESOLVED or CLOSED (403 Forbidden - AC-07)", async () => {
    const staffEndpointAttempt = await request(app)
      .patch(`/api/staff/tickets/${resolutionGateTicketId}/workflow`)
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({ status: "RESOLVED" });
    expect(staffEndpointAttempt.status).toBe(403);

    const statusEndpointAttempt = await request(app)
      .patch(`/api/tickets/${resolutionGateTicketId}/status`)
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({ status: "RESOLVED" });
    expect(statusEndpointAttempt.status).toBe(403);
    expect(statusEndpointAttempt.body.success).toBe(false);
  });

  it("API-08b: should record Requester 'Problem Appears Resolved' as advisory only (requesterResolvedInd=true) while keeping status IN_PROGRESS (AC-07)", async () => {
    // Non-owner requester must be blocked with 403
    const unauthorizedRes = await request(app)
      .patch(`/api/tickets/${resolutionGateTicketId}/indicate-resolved`)
      .set("Authorization", `Bearer ${sarahToken}`)
      .send({ note: "Trying to resolve someone else's ticket" });
    expect(unauthorizedRes.status).toBe(403);

    // Owner requester triggers advisory resolution indication
    const res = await request(app)
      .patch(`/api/tickets/${resolutionGateTicketId}/indicate-resolved`)
      .set("Authorization", `Bearer ${michaelToken}`)
      .send({ note: "The network connection is stable now after router reboot." });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.requesterResolvedInd).toBe(true);
    // Crucial Resolution Gate check: Ticket status MUST remain IN_PROGRESS
    expect(res.body.data.status).toBe("IN_PROGRESS");

    // Verify IT Staff inspects ticket detail and sees requesterResolvedInd = true and public comment
    const staffDetailRes = await request(app)
      .get(`/api/staff/tickets/${resolutionGateTicketId}`)
      .set("Authorization", `Bearer ${kevinToken}`);
    expect(staffDetailRes.status).toBe(200);
    expect(staffDetailRes.body.data.requesterResolvedInd).toBe(true);
    expect(staffDetailRes.body.data.status).toBe("IN_PROGRESS");
    expect(
      staffDetailRes.body.data.publicComments.some((c: any) =>
        c.content.includes("Requester indicated that the problem appears resolved")
      )
    ).toBe(true);

    // Formal resolution by IT Staff succeeds
    const formalResolveRes = await request(app)
      .patch(`/api/staff/tickets/${resolutionGateTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({ status: "RESOLVED" });
    expect(formalResolveRes.status).toBe(200);
    expect(formalResolveRes.body.data.status).toBe("RESOLVED");
  });

  // -------------------------------------------------------------------------
  // API-09: Optimistic Concurrency Control on Ticket Updates (AC-08, FR-09, BR-08)
  // -------------------------------------------------------------------------
  it("API-09: should reject ticket update with stale expectedUpdatedAt timestamp (409 Conflict - AC-08)", async () => {
    // 1. Fetch initial ticket state and timestamp
    const detailRes = await request(app)
      .get(`/api/staff/tickets/${concurrencyTicketId}`)
      .set("Authorization", `Bearer ${kevinToken}`);
    expect(detailRes.status).toBe(200);
    const initialUpdatedAt = detailRes.body.data.updatedAt;

    // Wait 1.1s so the next update produces a distinctly newer timestamp (>1000ms tolerance)
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // 2. First update with valid expectedUpdatedAt succeeds (NEW -> OPEN)
    const firstUpdate = await request(app)
      .patch(`/api/staff/tickets/${concurrencyTicketId}/workflow`)
      .set("Authorization", `Bearer ${kevinToken}`)
      .send({
        status: "OPEN",
        itPriority: "HIGH",
        expectedUpdatedAt: initialUpdatedAt,
      });
    expect(firstUpdate.status).toBe(200);
    expect(firstUpdate.body.data.status).toBe("OPEN");

    // 3. Second concurrent update using the STALE initialUpdatedAt must fail with 409 Conflict
    const staleUpdate = await request(app)
      .patch(`/api/staff/tickets/${concurrencyTicketId}/workflow`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "IN_PROGRESS",
        expectedUpdatedAt: initialUpdatedAt,
      });

    expect(staleUpdate.status).toBe(409);
    expect(staleUpdate.body.success).toBe(false);
    expect(staleUpdate.body.error).toBe("Conflict");
    expect(staleUpdate.body.currentTicket).toBeDefined();
    expect(staleUpdate.body.currentTicket.status).toBe("OPEN");
  });
});
