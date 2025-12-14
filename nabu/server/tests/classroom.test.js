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

describe("Classroom Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =======================
  // GET classrooms by user
  // =======================
  it("should return classrooms for a user", async () => {
    pool.query.mockResolvedValueOnce([
      [{ ID: "1", OwnerID: "7", Title: "Math", Description: "basic" }]
    ]);

    const res = await request(app).get("/api/classrooms?userId=7");

    expect(res.status).toBe(200);
    expect(res.body[0].Title).toBe("Math");
  });

  it("should return empty array if user has no classrooms", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/classrooms?userId=99");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  // =======================
  // GET all classrooms
  // =======================
  it("should return all classrooms (admin)", async () => {
    pool.query.mockResolvedValueOnce([
      [{ ID: "1", Title: "Math" }, { ID: "2", Title: "Physics" }]
    ]);

    const res = await request(app).get("/api/classrooms/all");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  // =======================
  // CREATE classroom
  // =======================
  it("should create a classroom", async () => {
    generateUniqueId.mockResolvedValueOnce("NEW123");
    pool.query.mockResolvedValueOnce([{}]);

    const res = await request(app)
      .post("/api/classrooms/add")
      .send({
        title: "Biology",
        description: "Cells",
        ownerID: 5
      });

    expect(res.status).toBe(200);
    expect(res.body.Title).toBe("Biology");
  });

  // =======================
  // JOIN classroom
  // =======================
  it("should allow user to join classroom", async () => {
    pool.query
      .mockResolvedValueOnce([[{ OwnerId: 1 }]]) // classroom exists
      .mockResolvedValueOnce([[]])               // not member
      .mockResolvedValueOnce([{}]);              // insert ok

    const res = await request(app)
      .post("/api/classrooms/join")
      .send({ userId: 2, classroomId: "C1" });

    expect(res.status).toBe(201);
  });

  // =======================
  // LEAVE classroom
  // =======================
  it("should allow user to leave classroom", async () => {
    pool.query
      .mockResolvedValueOnce([[{ OwnerId: 1 }]]) // classroom exists
      .mockResolvedValueOnce([[{ UserId: 2 }]])  // membership exists
      .mockResolvedValueOnce([{}]);              // delete ok

    const res = await request(app)
      .delete("/api/classrooms/leave")
      .send({ userId: 2, classroomId: "C1" });

    expect(res.status).toBe(200);
  });

  // =======================
  // IS MEMBER
  // =======================
  it("should return true if user is member", async () => {
    pool.query.mockResolvedValueOnce([[{ UserId: 2 }]]);

    const res = await request(app)
      .get("/api/classrooms/isMember?userId=2&classroomId=C1");

    expect(res.body).toBe(true);
  });

  // =======================
  // DELETE classroom
  // =======================
  it("should delete a classroom", async () => {
    pool.query
      .mockResolvedValueOnce([{}]) // delete UserClassroom
      .mockResolvedValueOnce([{}]); // delete ClassRoom

    const res = await request(app)
      .delete("/api/classrooms/delete?classroomId=C1");

    expect(res.status).toBe(200);
  });
});
