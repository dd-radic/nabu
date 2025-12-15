import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

vi.mock("../src/idGenerator.js", () => ({
  default: vi.fn() }
));

import app from "../src/server.js";
import pool from "../src/db-connection.js";
import generateUniqueId from "../src/idGenerator.js";

describe("Flashcard Routes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 400 if userId missing", async () => {
    const res = await request(app).get("/api/flashcard/allCards");
    expect(res.status).toBe(400);
  });

  it("should return flashcards for user", async () => {
    pool.query.mockResolvedValueOnce([
      [{ Id: "F1", Title: "Card" }]
    ]);

    const res = await request(app)
      .get("/api/flashcard/allCards?userId=1");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("should create flashcard", async () => {
    generateUniqueId.mockResolvedValueOnce("F123");
    pool.query.mockResolvedValueOnce([]);

    const res = await request(app)
      .post("/api/flashcard/create?userId=1")
      .send({
        classRoomId: "C1",
        title: "Card",
        information: "Info",
        tags: "bio"
      });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe("F123");
  });

  it("should delete flashcard", async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/flashcard/delete?flashCardId=F1&userId=1");

    expect(res.status).toBe(200);
  });
});
