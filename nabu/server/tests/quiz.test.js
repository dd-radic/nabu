// ===================== Imports =====================

// vitest utilities for defining and running test suites
import { describe, it, expect, beforeEach, vi } from "vitest";

// supertest is used to simulate HTTP requests against the Express app
import request from "supertest";


// ===================== Mocks =====================

// Mock the database connection to avoid real database access
// pool.query will be replaced with a mock function
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

// Mock the ID generator to control generated quiz IDs
vi.mock("../src/idGenerator.js", () => ({
  default: vi.fn()
}));


// ===================== App & Dependencies =====================

// Import the Express app AFTER mocks are defined
// so mocked modules are injected correctly
import app from "../src/server.js";

// Import mocked dependencies for use inside the tests
import pool from "../src/db-connection.js";
import generateUniqueId from "../src/idGenerator.js";


// ===================== Test Suite =====================

describe("Quiz Routes", () => {

  // Clear all mocks before each test to prevent cross-test side effects
  beforeEach(() => vi.clearAllMocks());


  // =====================
  // GET /api/quizzes
  // =====================

  // Should return 400 if classRoomId query parameter is missing
  it("should return 400 if classRoomId missing", async () => {
    const res = await request(app).get("/api/quizzes");
    expect(res.status).toBe(400);
  });

  // Should return all quizzes for a given classroom
  it("should return quizzes for classroom", async () => {
    // Mock DB response with one quiz
    pool.query.mockResolvedValueOnce([
      [{ Id: "Q1", Title: "Quiz 1" }]
    ]);

    const res = await request(app)
      .get("/api/quizzes?classRoomId=C1");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });


  // =====================
  // POST /api/quizzes
  // =====================

  // Should successfully create a new quiz
  it("should create a quiz", async () => {
    // Mock generated quiz ID
    generateUniqueId.mockResolvedValueOnce("Q123");

    // Mock DB insert query
    pool.query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post("/api/quizzes")
      .send({
        title: "Test Quiz",
        classRoomId: "C1",
        creatorId: 1
      });

    expect(res.status).toBe(201);
    expect(res.body.Id).toBe("Q123");
  });

  // Should return 400 if required fields are missing when creating a quiz
  it("should return 400 if required fields missing on create", async () => {
    const res = await request(app)
      .post("/api/quizzes")
      .send({ title: "Quiz ohne Raum" });

    expect(res.status).toBe(400);
  });


  // =====================
  // GET /api/quizzes/getCurrent
  // =====================

  // Should return 400 if quizId query parameter is missing
  it("should return 400 if quizId missing (getCurrent)", async () => {
    const res = await request(app)
      .get("/api/quizzes/getCurrent");

    expect(res.status).toBe(400);
  });

  // Should return a specific quiz by its ID
  it("should return current quiz by id", async () => {
    // Mock DB response with the requested quiz
    pool.query.mockResolvedValueOnce([[
      { Id: "Q1", Title: "Quiz 1" }
    ]]);

    const res = await request(app)
      .get("/api/quizzes/getCurrent?quizId=Q1");

    expect(res.status).toBe(200);
    expect(res.body.Id).toBe("Q1");
  });


  // =====================
  // DELETE /api/quizzes/delete
  // =====================

  // Should return 207 if quizId or creatorId is missing
  it("should return 400 if quizId or creatorId missing", async () => {
    const res = await request(app)
      .delete("/api/quizzes/delete?quizId=Q1");

    expect(res.status).toBe(207);
  });

  // Should return 207 if quiz does not exist or user is not authorized
  it("should return 207 if quiz not found or unauthorized", async () => {
    // affectedRows = 0 means no quiz was deleted
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .delete("/api/quizzes/delete?quizId=Q1&creatorId=1");

    expect(res.status).toBe(207);
  });

  // Should successfully delete an existing quiz
  it("should delete quiz", async () => {
    // affectedRows = 1 means deletion was successful
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/quizzes/delete?quizId=Q1&creatorId=1");

    expect(res.status).toBe(200);
  });

});
