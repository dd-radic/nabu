import { test, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import pool from "../src/db-connection.js";

vi.mock("../src/db-connection.js");




beforeEach(() => {
  vi.clearAllMocks();
});


// === 1. Missing fields ===
test("POST /api/signup → missing fields", async () => {
  const res = await request(app)
    .post("/api/signup")
    .send({ username: "ben", email: "" }); // missing password

  expect(res.status).toBe(400);
  expect(res.body.error).toBe("Missing required fields");
});


// === 2. Successful signup ===
test("POST /api/signup → successful signup", async () => {
  pool.query.mockResolvedValueOnce([{ insertId: 123 }]);

  const res = await request(app)
    .post("/api/signup")
    .send({
      username: "ben",
      email: "ben@example.com",
      password: "pass123",
    });

  expect(res.status).toBe(200);
  expect(res.body.message).toBe("User signed up!");
  expect(res.body.userId).toBe(123);
});


// === 3. SQL error ===
test("POST /api/signup → DB error", async () => {
  pool.query.mockImplementationOnce(() => {
    throw new Error("irgendein Fehler");
  });

  const res = await request(app)
    .post("/api/signup")
    .send({
      username: "ben",
      email: "ben@example.com",
      password: "pass123",
    });

  // Wir erwarten nur den Status, NICHT den Body
  expect(res.status).toBe(101);
});
