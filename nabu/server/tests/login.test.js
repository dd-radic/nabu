// ===================== Imports =====================

// vitest utilities for writing and running tests
import { test, expect, vi, beforeEach } from "vitest";

// supertest is used to simulate HTTP requests against the Express app
import request from "supertest";


// ===================== Environment Setup =====================

// JWT secret must be defined BEFORE the app is imported
// otherwise jsonwebtoken.sign() would fail
process.env.DB_JWT_KEY = "test-secret";


// ===================== Mocks =====================

// Mock jsonwebtoken to avoid generating real JWTs
// and to allow inspection of sign() calls
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn()
  }
}));

// Mock the database connection so no real DB is accessed
// pool.query will be replaced with a mock function
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));


// ===================== App & Dependencies =====================

// Import the Express app AFTER mocks are defined
// so the mocked modules are used inside the app
import app from "../src/server.js";

// Import mocked dependencies for direct control in tests
import pool from "../src/db-connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// ===================== Test Setup =====================

// Clear all mocks before each test to avoid side effects
beforeEach(() => {
  vi.clearAllMocks();
});


// ===================== Login Route Tests =====================

// === 1. User not found ===
// If no user is returned from the database, the API should respond with 404
test("POST /api/login → user not found", async () => {
  // Mock DB query to return no users
  pool.query.mockResolvedValueOnce([[]]);

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "123" });

  expect(res.status).toBe(404);
});


// === 2. Wrong password ===
// If the user exists but the password comparison fails,
// the API should return 401 (unauthorized)
test("POST /api/login → wrong password", async () => {
  // Mock DB to return a user
  pool.query.mockResolvedValueOnce([
    [{ id: 1, username: "ben", password: "HASHEDPW" }]
  ]);

  // Mock bcrypt.compare to simulate wrong password
  vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "wrong" });

  expect(res.status).toBe(401);
});


// === 3. Successful login ===
// If user exists and password is correct,
// the API should return 200 and a JWT
test("POST /api/login → successful login", async () => {
  // Mock DB to return a valid user
  pool.query.mockResolvedValueOnce([[
    {
      Id: 1,
      Name: "ben",
      Password: "HASHEDPW",
      Email: "ben@test.de"
    }
  ]]);

  // Simulate correct password
  vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

  // Mock JWT creation
  jwt.sign.mockReturnValue("FAKE_TOKEN");

  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "correct" });

  expect(res.status).toBe(200);
  expect(res.body.accessToken || res.body.token).toBe("FAKE_TOKEN");
});


// === 4. Missing credentials ===
// If username or password is missing,
// the API should return 400 (bad request)
test("POST /api/login → missing credentials", async () => {
  const res = await request(app)
    .post("/api/login")
    .send({ username: "ben" });

  expect(res.status).toBe(400);
});


// ===================== Additional Behavior Tests =====================

// Ensure that bcrypt.compare is NOT called
// if the user does not exist
test("POST /api/login → does not check password if user not found", async () => {
  // Mock DB to return no user
  pool.query.mockResolvedValueOnce([[]]);

  // Spy on bcrypt.compare
  const spy = vi.spyOn(bcrypt, "compare");

  await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "123" });

  expect(spy).not.toHaveBeenCalled();
});


// Ensure JWT payload contains correct user data
test("POST /api/login → jwt payload is correct", async () => {
  // Mock DB to return a valid user
  pool.query.mockResolvedValueOnce([[
    {
      Id: 1,
      Name: "ben",
      Password: "HASHEDPW",
      Email: "ben@test.de"
    }
  ]]);

  // Simulate successful password check
  vi.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

  // Mock JWT generation
  jwt.sign.mockReturnValue("FAKE_TOKEN");

  await request(app)
    .post("/api/login")
    .send({ username: "ben", password: "correct" });

  // Verify JWT payload and secret
  expect(jwt.sign).toHaveBeenCalledWith(
    { id: 1, username: "ben" },
    process.env.DB_JWT_KEY
  );
});
// ===================== End of Tests =====================