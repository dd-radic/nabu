import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

vi.mock("../src/idGenerator.js", () => ({
  default: vi.fn()
}));

import app from "../src/server.js";
import pool from "../src/db-connection.js";
import generateUniqueId from "../src/idGenerator.js";

describe("Quiz Routes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 400 if classRoomId missing", async () => {
    const res = await request(app).get("/api/quizzes");
    expect(res.status).toBe(400);
  });

  it("should return quizzes for classroom", async () => {
    pool.query.mockResolvedValueOnce([
      [{ Id: "Q1", Title: "Quiz 1" }]
    ]);

    const res = await request(app)
      .get("/api/quizzes?classRoomId=C1");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should create a quiz", async () => {
    generateUniqueId.mockResolvedValueOnce("Q123");
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
});
