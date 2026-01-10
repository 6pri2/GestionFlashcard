import request from "supertest";
import app from "../server.js"; 
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import jwt from "jsonwebtoken";

// Tokens
let adminToken;
let userToken;
let nonExistentId = "00000000-0000-0000-0000-000000000000"; 
let testUserId;

beforeAll(async () => {
  const [admin] = await db.insert(users).values({
    email: "admin@test.com",
    password: "hashedpassword",
    firstname : "admin",
    lastname : "user",
    admin: true,
  }).returning();

  const [user] = await db.insert(users).values({
    email: "user@test.com",
    password: "hashedpassword",
    firstname : "basic",
    lastname : "user",
    admin: false,
  }).returning();

  testUserId = user.id;

  adminToken = jwt.sign({ userId: admin.id, admin: true }, process.env.JWT_SECRET);
  userToken = jwt.sign({ userId: user.id, admin: false }, process.env.JWT_SECRET);
});

describe("Admin routes", () => {
  describe("GET /admin/users", () => {
    it("should return 200 and list users for admin", async () => {
      const res = await request(app)
        .get("/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
      expect(res.body[0]).not.toHaveProperty("password");
    });

    it("should return 403 for non-admin", async () => {
      const res = await request(app)
        .get("/admin/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return 401 if no token provided", async () => {
      const res = await request(app).get("/admin/users");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /admin/users/:id", () => {
    it("should return 200 for admin with valid id", async () => {
      const res = await request(app)
        .get(`/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(testUserId);
      expect(res.body).not.toHaveProperty("password");
    });

    it("should return 404 for admin with non-existent id", async () => {
      const res = await request(app)
        .get(`/admin/users/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });

    it("should return 400 for invalid uuid", async () => {
      const res = await request(app)
        .get("/admin/users/invalid-uuid")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
    });

    it("should return 403 for non-admin", async () => {
      const res = await request(app)
        .get(`/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return 401 if no token provided", async () => {
      const res = await request(app).get(`/admin/users/${testUserId}`);
      expect(res.statusCode).toBe(401);
    });
  });

  describe("DELETE /admin/users/:id", () => {
    let userToDeleteId;

    beforeAll(async () => {
      const [newUser] = await db.insert(users).values({
        email: "delete@test.com",
        password: "hashedpassword",
        firstname : "first",
        lastname : "user",
        admin: false,
      }).returning();

      userToDeleteId = newUser.id;
    });

    it("should return 200 and delete user for admin", async () => {
      const res = await request(app)
        .delete(`/admin/users/${userToDeleteId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("userId", userToDeleteId);
    });

    it("should return 404 for admin with non-existent id", async () => {
      const res = await request(app)
        .delete(`/admin/users/${nonExistentId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });

    it("should return 400 for invalid uuid", async () => {
      const res = await request(app)
        .delete("/admin/users/invalid-uuid")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
    });

    it("should return 403 for non-admin", async () => {
      const res = await request(app)
        .delete(`/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return 401 if no token provided", async () => {
      const res = await request(app).delete(`/admin/users/${testUserId}`);
      expect(res.statusCode).toBe(401);
    });
  });
});
