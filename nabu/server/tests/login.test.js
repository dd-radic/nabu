import { test, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import pool from "../src/db-connection.js";
import bcrypt from "bcrypt";

vi.mock("../src/db-connection.js");

beforeEach(() => {
  vi.clearAllMocks();
});


// === 1. User not found ===
test("POST /api/login → user not found", async () => {
  pool.query.mockResolvedValueOnce([[]]); // no rows

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "123" });

  expect(res.status).toBe(404);
  expect(res.body.error).toBe("User not found");
});


// === 2. Wrong password ===
test("POST /api/login → wrong password", async () => {
  // Mock DB result
  pool.query.mockResolvedValueOnce([
    [{ id: 1, username: "ben", password: "HASHEDPW" }],
  ]);

  // Mock bcrypt.compare
  vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "wrong" });

  expect(res.status).toBe(401);
  expect(res.body.error).toBe("Invalid password");
});


// === 3. Successful login ===
test("POST /api/login → successful login", async () => {
  pool.query.mockResolvedValueOnce([
    [{ id: 1, username: "ben", password: "HASHEDPW" }],
  ]);

  vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "correct" });

  expect(res.status).toBe(200);
  expect(res.body.message).toBe("User logged in successfully!");
  expect(res.body.accessToken).toBeDefined();
});
