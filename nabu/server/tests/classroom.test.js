import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

// Mocks
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

vi.mock("../src/idGenerator.js", () => ({
  default: vi.fn()
}));

import app from "../src/server.js";
import pool from "../src/db-connection.js";
import generateUniqueId from "../src/idGenerator.js";

describe("Classroom Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return classrooms for a user", async () => {
    pool.query.mockResolvedValue([
      [{ ID: "1", OwnerID: "7", Title: "Math", Description: "basic" }]
    ]);

    const res = await request(app).get("/api/classrooms?userId=7");

    expect(res.status).toBe(200);
    expect(res.body[0].Title).toBe("Math");
  });

  it("should return empty array if user has no classrooms", async () => {
    pool.query.mockResolvedValue([[]]);

    const res = await request(app).get("/api/classrooms?userId=99");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 404 if title or ownerID missing", async () => {
    const res = await request(app)
      .post("/api/classrooms")
      .send({ title: "Physics" });

    expect(res.status).toBe(404);
  });

  it("should return 404 when trying to create a classroom", async () => {
    generateUniqueId.mockResolvedValue("NEW123");
    pool.query.mockResolvedValue([{ affectedRows: 1 }]);

    const res = await request(app)
      .post("/api/classrooms")
      .send({
        title: "Biology",
        description: "Cells",
        ownerID: 5
      });

    expect(res.status).toBe(404);
  });
});
