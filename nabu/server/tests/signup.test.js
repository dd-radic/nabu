import { test, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock DB before imports
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

import app from "../src/server.js";
import pool from "../src/db-connection.js";

beforeEach(() => {
  vi.clearAllMocks();
});

// === 1. Missing fields ===
test("POST /api/signup → missing fields", async () => {
  const res = await request(app)
    .post("/api/signup")
    .send({ username: "ben", email: "" });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe("Missing required fields");
});

// === 2. Successful signup ===
test("POST /api/signup → successful signup", async () => {

  // generateUniqueId() calls pool.query once → return no conflict
  // INSERT INTO User (...) calls pool.query again → return ID
  pool.query
    .mockResolvedValueOnce([[]])         // FIRST: generateUniqueId() conflict check
    .mockResolvedValueOnce([{ ID: 123 }]); // SECOND: INSERT result

  const res = await request(app)
    .post("/api/signup")
    .send({
      username: "ben",
      email: "ben@example.com",
      password: "pass123"
    });

  expect(res.status).toBe(200);
  expect(res.body.message).toBe("User signed up!");
  expect(res.body.userId).toBe(123); // correct for your signup.js
});

// === 3. SQL error ===
test("POST /api/signup → DB error", async () => {

  // first call (generateUniqueId) should work
  pool.query.mockResolvedValueOnce([[]]);

  // second call throws → INSERT fails
  pool.query.mockImplementationOnce(() => {
    throw new Error("irgendein Fehler");
  });

  const res = await request(app)
    .post("/api/signup")
    .send({
      username: "ben",
      email: "ben@example.com",
      password: "pass123"
    });

  expect(res.status).toBe(101); // your backend returns 101 on error
});
