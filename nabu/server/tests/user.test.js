import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

// DB MOCK MUSS ZUERST KOMMEN
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

// bcrypt MOCK MUSS KOMPLETT DEFINIERT SEIN
vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn()
  }
}));

// jwt mock
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn()
  }
}));

import app from "../src/server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../src/db-connection.js";

describe("User Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DB_JWT_KEY = "test-secret";
  });

  it("should return 400 if username or password missing", async () => {
    const res = await request(app)
      .put("/api/user/update-username")
      .send({ username: "Ben" });

    expect(res.status).toBe(400);
  });

  it("should return 404 if user does not exist", async () => {
    pool.query.mockResolvedValue([[]]);

    const res = await request(app)
      .put("/api/user/update-username")
      .send({ username: "Ben", password: "123" });

    expect(res.status).toBe(404);
  });

  it("should return 401 on wrong password", async () => {
    pool.query.mockResolvedValue([
      [{ ID: 1, Name: "Ben", Password: "hash", Email: "ben@test.de" }]
    ]);

    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .put("/api/user/update-username")
      .send({ username: "Ben", password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("should login successfully and return token", async () => {
    pool.query.mockResolvedValue([
      [{ ID: 1, Name: "Ben", Password: "hash", Email: "ben@test.de" }]
    ]);

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("FAKE_TOKEN");

    const res = await request(app)
      .put("/api/user/update-username")
      .send({ username: "Ben", password: "123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("FAKE_TOKEN");
  });

  it("should return 401 if token missing", async () => {
    const res = await request(app).get("/api/user");
    expect(res.status).toBe(401);
  });

  it("should return user info with valid token", async () => {
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, { id: 1 })
    );

    pool.query.mockResolvedValue([
      [{ ID: 1, Name: "Ben", Email: "ben@test.de" }]
    ]);

    const res = await request(app)
      .get("/api/user")
      .set("Authorization", "Bearer mytoken");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Ben");
  });
});
