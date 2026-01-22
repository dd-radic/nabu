// ===================== Imports =====================

// vitest utilities for structuring and running test cases
import { describe, it, expect, beforeEach, vi } from "vitest";

// supertest is used to simulate HTTP requests against the Express app
import request from "supertest";


// ===================== Mocks =====================

// Mock the database connection FIRST
// This must be done before importing the app
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

// Mock bcrypt completely to control password comparison
// compare() is used inside the user routes
vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn()
  }
}));

// Mock jsonwebtoken to avoid real JWT creation/verification
// and to allow inspection of sign/verify behavior
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn()
  }
}));


// ===================== App & Dependencies =====================

// Import the Express app AFTER all mocks are defined
// so the mocked modules are injected into the routes
import app from "../src/server.js";

// Import mocked dependencies for direct control in tests
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../src/db-connection.js";


// ===================== Test Suite =====================

describe("User Routes", () => {

  // Reset all mocks and define env variables before each test
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DB_JWT_KEY = "test-secret";
  });


  // =====================
  // PUT /api/user/update-username
  // =====================

  // Should return 400 if username or password is missing
  it("should return 400 if username or password missing", async () => {
    const res = await request(app)
      .put("/api/user/update-username")
      .send({ username: "Ben" });

    expect(res.status).toBe(400);
  });

  // Should return 404 if the user does not exist in the database
  it("should return 404 if user does not exist", async () => {
    // Mock DB to return no user
    pool.query.mockResolvedValue([[]]);

    const res = await request(app)
      .put("/api/user/update-username")
      .send({ username: "Ben", password: "123" });

    expect(res.status).toBe(404);
  });

  // Should return 401 if password comparison fails
  it("should return 401 on wrong password", async () => {
    // Mock DB to return an existing user
    pool.query.mockResolvedValue([
      [{ ID: 1, Name: "Ben", Password: "hash", Email: "ben@test.de" }]
    ]);

    // Simulate wrong password
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .put("/api/user/update-username")
      .send({ username: "Ben", password: "wrong" });

    expect(res.status).toBe(401);
  });

  // Should update username and return a new JWT on success
  it("should login successfully and return token", async () => {
    // Mock DB to return an existing user
    pool.query.mockResolvedValue([
      [{ ID: 1, Name: "Ben", Password: "hash", Email: "ben@test.de" }]
    ]);

    // Simulate correct password
    bcrypt.compare.mockResolvedValue(true);

    // Mock JWT creation
    jwt.sign.mockReturnValue("FAKE_TOKEN");

    const res = await request(app)
      .put("/api/user/update-username")
      .send({ username: "Ben", password: "123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe("FAKE_TOKEN");
  });


  // =====================
  // GET /api/user
  // =====================

  // Should return 401 if no Authorization token is provided
  it("should return 401 if token missing", async () => {
    const res = await request(app).get("/api/user");
    expect(res.status).toBe(401);
  });

  // Should return user information if a valid JWT is provided
  it("should return user info with valid token", async () => {
    // Mock jwt.verify to simulate a valid token
    jwt.verify.mockImplementation((token, secret, cb) =>
      cb(null, { id: 1 })
    );

    // Mock DB to return user data
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
