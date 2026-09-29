import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Lab 3 Administrator User Management REST APIs", () => {
  let adminToken: string; // ADMINISTRATOR
  let staffToken: string; // IT_STAFF
  let requesterToken: string; // REQUESTER
  let createdUserId: number;

  beforeAll(async () => {
    // Login as John Smith (Admin)
    const aRes = await request(app).post("/api/auth/login").send({
      email: "john.smith@toktickit.com",
      password: "Password123!",
    });
    adminToken = aRes.body.token;

    // Login as Kevin Patel (IT Staff)
    const sRes = await request(app).post("/api/auth/login").send({
      email: "kevin.patel@toktickit.com",
      password: "Password123!",
    });
    staffToken = sRes.body.token;

    // Login as Michael Brown (Requester)
    const rRes = await request(app).post("/api/auth/login").send({
      email: "michael.brown@toktickit.com",
      password: "Password123!",
    });
    requesterToken = rRes.body.token;
  });

  it("GET /api/admin/users - should return paginated user list for Administrator", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty("totalItems");
  });

  it("GET /api/admin/users - should reject non-Admin users with 403 Forbidden", async () => {
    const staffRes = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${staffToken}`);
    expect(staffRes.status).toBe(403);

    const reqRes = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${requesterToken}`);
    expect(reqRes.status).toBe(403);
  });

  it("POST /api/admin/users - should create a new user with initial password and mustChangePassword=true", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Alex Thompson",
        email: "alex.thompson.test@toktickit.com",
        department: "Infrastructure",
        role: "IT_STAFF",
        isActive: true,
        initialPassword: "InitialPassword123!",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Alex Thompson");
    expect(res.body.data.role).toBe("IT_STAFF");
    expect(res.body.data.mustChangePassword).toBe(true);

    createdUserId = res.body.data.id;
  });

  it("POST /api/admin/users - should reject duplicate email with 409 Conflict", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Duplicate User",
        email: "alex.thompson.test@toktickit.com",
        role: "REQUESTER",
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("PATCH /api/admin/users/:id - should update user profile and role", async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Alex Thompson Updated",
        department: "DevOps",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Alex Thompson Updated");
    expect(res.body.data.department).toBe("DevOps");
  });

  it("PATCH /api/admin/users/:id - should prevent Administrator self-deactivation (400)", async () => {
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${adminToken}`);
    const adminId = meRes.body.user.id;

    const res = await request(app)
      .patch(`/api/admin/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        isActive: false,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain("Self-deactivation");
  });

  it("PATCH /api/admin/users/:id - should prevent deactivating or downgrading the last active Administrator account (400)", async () => {
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${adminToken}`);
    const adminId = meRes.body.user.id;

    // Test downgrading last admin role
    const roleRes = await request(app)
      .patch(`/api/admin/users/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        role: "IT_STAFF",
      });

    expect(roleRes.status).toBe(400);
    expect(roleRes.body.success).toBe(false);
    expect(roleRes.body.error.message).toContain("last active Administrator");
  });

  it("POST /api/admin/users/:id/reset-password - should reset user initial password", async () => {
    const res = await request(app)
      .post(`/api/admin/users/${createdUserId}/reset-password`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        newInitialPassword: "NewTempPassword456!",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.mustChangePassword).toBe(true);
  });
});
