import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

// =======================
// Mocks
// =======================
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

vi.mock("../src/idGenerator.js", () => ({
  default: vi.fn()
}));

import app from "../src/server.js";
import pool from "../src/db-connection.js";
import generateUniqueId from "../src/idGenerator.js";

describe("Question Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =======================
  // GET questions
  // =======================
  it("should return 400 if quizId missing", async () => {
    const res = await request(app)
      .get("/api/question");

    expect(res.status).toBe(400);
  });

  it("should return questions for quiz", async () => {
    pool.query.mockResolvedValueOnce([[
      { Id: "Q1", QuizId: "Z1", Type: "mc" }
    ]]);

    const res = await request(app)
      .get("/api/question?quizId=Z1");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  // =======================
  // CREATE question
  // =======================
  it("should return 400 if required fields missing", async () => {
    const res = await request(app)
      .post("/api/question")
      .send({ quizId: "Z1" });

    expect(res.status).toBe(400);
  });

  it("should create a question", async () => {
    generateUniqueId.mockResolvedValueOnce("QUE123");
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

  // =======================
  // DELETE question
  // =======================
  it("should return 207 if questionId missing", async () => {
    const res = await request(app)
      .delete("/api/question/delete");

    expect(res.status).toBe(207);
  });

  it("should return 207 if question not found", async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .delete("/api/question/delete?questionId=Q1");

    expect(res.status).toBe(207);
  });

  it("should delete question", async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/question/delete?questionId=Q1");

    expect(res.status).toBe(200);
  });
});
