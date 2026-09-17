import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Lab 3 Authentication REST API Endpoints", () => {
  it("POST /api/auth/login - should authenticate valid user credentials (AC-01)", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "jennifer.anderson@toktickit.com",
      password: "InitialPassword123!",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "jennifer.anderson@toktickit.com");
    expect(res.body.user).toHaveProperty("role", "REQUESTER");
    expect(res.body.user).toHaveProperty("mustChangePassword", true);
  });

  it("POST /api/auth/login - should reject invalid password or non-existent user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "jennifer.anderson@toktickit.com",
      password: "WrongPassword999!",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.error).toHaveProperty("message");
  });

  it("POST /api/auth/login - should reject inactive user account (AC-07, BR-01)", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "inactive.requester@toktickit.com",
      password: "Password123!",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.error.message).toContain("disabled");
  });

  it("GET /api/auth/me - should return authenticated user profile", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "michael.brown@toktickit.com",
      password: "Password123!",
    });

    const token = loginRes.body.token;
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body).toHaveProperty("success", true);
    expect(meRes.body.user).toHaveProperty("email", "michael.brown@toktickit.com");
    expect(meRes.body.user).toHaveProperty("role", "REQUESTER");
  });

  it("GET /api/auth/me - should reject request without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("success", false);
  });

  it("POST /api/auth/change-password - should enforce valid password change (AC-02, BR-02)", async () => {
    // 1. Login with initial password
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "jennifer.anderson@toktickit.com",
      password: "InitialPassword123!",
    });

    const token = loginRes.body.token;

    // 2. Change password
    const changeRes = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "InitialPassword123!",
        newPassword: "NewSecurePassword888!",
      });

    expect(changeRes.status).toBe(200);
    expect(changeRes.body).toHaveProperty("success", true);
    expect(changeRes.body.user).toHaveProperty("mustChangePassword", false);

    // 3. Verify login works with new password
    const newLoginRes = await request(app).post("/api/auth/login").send({
      email: "jennifer.anderson@toktickit.com",
      password: "NewSecurePassword888!",
    });

    expect(newLoginRes.status).toBe(200);
    expect(newLoginRes.body.user).toHaveProperty("mustChangePassword", false);

    // Reset password back for idempotent testing
    await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${newLoginRes.body.token}`)
      .send({
        currentPassword: "NewSecurePassword888!",
        newPassword: "InitialPassword123!",
      });
  });
});
