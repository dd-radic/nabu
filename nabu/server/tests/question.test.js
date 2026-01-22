// ===================== Imports =====================

// vitest utilities for structuring and running tests
import { describe, it, expect, beforeEach, vi } from "vitest";

// supertest allows HTTP requests against the Express app
import request from "supertest";


// ===================== Mocks =====================

// Mock the database connection so tests do not use a real database
// pool.query will be replaced by a mock function
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

// Mock the ID generator to control generated question IDs
vi.mock("../src/idGenerator.js", () => ({
  default: vi.fn()
}));


// ===================== App & Dependencies =====================

// Import the Express app AFTER mocks are defined
// so the mocked modules are injected into the app
import app from "../src/server.js";

// Import mocked dependencies for use in test assertions
import pool from "../src/db-connection.js";
import generateUniqueId from "../src/idGenerator.js";


// ===================== Test Suite =====================

describe("Question Routes", () => {

  // Reset all mocks before each test to avoid cross-test pollution
  beforeEach(() => {
    vi.clearAllMocks();
  });


  // =====================
  // GET /api/question
  // =====================

  // Should fail if quizId query parameter is missing
  it("should return 400 if quizId missing", async () => {
    const res = await request(app)
      .get("/api/question");

    expect(res.status).toBe(400);
  });

  // Should return all questions belonging to a specific quiz
  it("should return questions for quiz", async () => {
    // Mock DB response with one question
    pool.query.mockResolvedValueOnce([[
      { Id: "Q1", QuizId: "Z1", Type: "mc" }
    ]]);

    const res = await request(app)
      .get("/api/question?quizId=Z1");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });


  // =====================
  // POST /api/question
  // =====================

  // Should fail if required fields are missing in request body
  it("should return 400 if required fields missing", async () => {
    const res = await request(app)
      .post("/api/question")
      .send({ quizId: "Z1" });

    expect(res.status).toBe(400);
  });

  // Should successfully create a new question
  it("should create a question", async () => {
    // Mock generated question ID
    generateUniqueId.mockResolvedValueOnce("QUE123");

    // Mock DB insert result
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .post("/api/question")
      .send({
        quizId: "Z1",
        type: "text",
        answer: "42",
        tags: "math",
        query: "What is the answer?"
      });

    expect(res.status).toBe(201);
    expect(res.body.Id).toBe("QUE123");
  });


  // =====================
  // DELETE /api/question/delete
  // =====================

  // Should return 207 if questionId query parameter is missing
  it("should return 207 if questionId missing", async () => {
    const res = await request(app)
      .delete("/api/question/delete");

    expect(res.status).toBe(207);
  });

  // Should return 207 if the question does not exist
  it("should return 207 if question not found", async () => {
    // affectedRows = 0 means nothing was deleted
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .delete("/api/question/delete?questionId=Q1");

    expect(res.status).toBe(207);
  });

  // Should successfully delete an existing question
  it("should delete question", async () => {
    // affectedRows = 1 means deletion was successful
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/question/delete?questionId=Q1");

    expect(res.status).toBe(200);
  });

});
