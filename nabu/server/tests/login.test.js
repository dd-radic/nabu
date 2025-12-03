import { test, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// ENV + MOCKS MUST BE BEFORE IMPORTS
process.env.DB_JWT_KEY = "test-secret";

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn()
  }
}));

vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

import app from "../src/server.js";
import pool from "../src/db-connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

beforeEach(() => {
  vi.clearAllMocks();
});

// === 1. User not found ===
test("POST /api/login → user not found", async () => {
  pool.query.mockResolvedValueOnce([[]]);

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "123" });

  expect(res.status).toBe(404);
});

// === 2. Wrong password ===
test("POST /api/login → wrong password", async () => {
  pool.query.mockResolvedValueOnce([
    [{ id: 1, username: "ben", password: "HASHEDPW" }]
  ]);

  vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "wrong" });

  expect(res.status).toBe(401);
});

// === 3. Successful login ===
test("POST /api/login → successful login", async () => {
  pool.query.mockResolvedValueOnce([
    [{ id: 1, username: "ben", password: "HASHEDPW" }]
  ]);

  vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

  jwt.sign.mockReturnValue("FAKE_TOKEN");

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "correct" });

  expect(res.status).toBe(200);
  expect(res.body.accessToken || res.body.token).toBe("FAKE_TOKEN");
});
