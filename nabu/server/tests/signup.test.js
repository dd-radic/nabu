// ===================== Imports =====================

// vitest utilities for writing and executing tests
import { test, expect, vi, beforeEach } from "vitest";

// supertest is used to simulate HTTP requests against the Express app
import request from "supertest";


// ===================== Mocks =====================

// Mock the database connection BEFORE importing the app
// so that no real database is accessed during tests
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));


// ===================== App & Dependencies =====================

// Import the Express app AFTER mocks are defined
// ensures the mocked DB connection is injected
import app from "../src/server.js";

// Import mocked database pool for controlling query behavior
import pool from "../src/db-connection.js";


// ===================== Test Setup =====================

// Reset all mocks before each test to prevent cross-test side effects
beforeEach(() => {
  vi.clearAllMocks();
});


// ===================== Signup Route Tests =====================

// === 1. Missing fields ===
// If required signup fields are missing,
// the API should return 400 with an error message
test("POST /api/signup → missing fields", async () => {
  const res = await request(app)
    .post("/api/signup")
    .send({ username: "ben", email: "" });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe("Missing required fields");
});


// === 2. Successful signup ===
// If all required fields are provided and no DB conflict occurs,
// the API should create a new user and return the user ID
test("POST /api/signup → successful signup", async () => {

  // First pool.query call:
  // generateUniqueId() checks whether the generated ID already exists
  pool.query
    .mockResolvedValueOnce([[]])           // No ID conflict found

    // Second pool.query call:
    // INSERT INTO User (...) returns the inserted user ID
    .mockResolvedValueOnce([{ ID: 123 }]); // Insert successful

  const res = await request(app)
    .post("/api/signup")
    .send({
      username: "ben",
      email: "ben@example.com",
      password: "pass123"
    });

  expect(res.status).toBe(200);
  expect(res.body.message).toBe("User signed up!");
  expect(res.body.userId).toBe(123); // matches signup.js behavior
});


// === 3. Database error ===
// If an unexpected database error occurs during signup,
// the API should return a custom error status code
test("POST /api/signup → DB error", async () => {

  // First DB call (ID conflict check) succeeds
  pool.query.mockResolvedValueOnce([[]]);

  // Second DB call (INSERT) throws an error
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

  // Your backend returns status code 101 on SQL errors
  expect(res.status).toBe(101);
});
