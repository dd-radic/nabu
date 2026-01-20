// ===================== Imports =====================

// vitest testing utilities
import { describe, it, expect, beforeEach, vi } from "vitest";

// supertest is used to simulate HTTP requests against the Express app
import request from "supertest";


// ===================== Mocks =====================

// Mock the database connection so no real DB is used during tests
// pool.query will be replaced by a mock function
vi.mock("../src/db-connection.js", () => ({
  default: { query: vi.fn() }
}));

// Mock the ID generator to control generated IDs in tests
vi.mock("../src/idGenerator.js", () => ({
  default: vi.fn()
}));


// ===================== App & Dependencies =====================

// Import the Express app (after mocks, so mocks are applied correctly)
import app from "../src/server.js";

// Import mocked dependencies to control their behavior
import pool from "../src/db-connection.js";
import generateUniqueId from "../src/idGenerator.js";


// ===================== Test Suite =====================

describe("Flashcard Routes", () => {

  // Reset all mocks before each test to avoid side effects
  beforeEach(() => vi.clearAllMocks());


  // ---------- GET /allCards ----------

  // Should fail if userId query parameter is missing
  it("should return 400 if userId missing", async () => {
    const res = await request(app).get("/api/flashcard/allCards");
    expect(res.status).toBe(400);
  });

  // Should return flashcards for a valid user
 it("should return flashcards for user", async () => {
  pool.query
    .mockResolvedValueOnce([[{ ID: 1 }]])              // user exists
    .mockResolvedValueOnce([[{ Id: "F1", Title: "Card" }]]); // cards

  const res = await request(app)
    .get("/api/flashcard/allCards?userId=1");

  expect(res.status).toBe(200);        
  expect(res.body.length).toBe(1);     
});



  // ---------- POST /create ----------

  // Should successfully create a flashcard
  it("should create flashcard", async () => {
    // Mock ID generator result
    generateUniqueId.mockResolvedValueOnce("F123");

    // Mock DB insert query (no return value needed here)
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


  // ---------- Validation Tests ----------

  // GET allCards – should not hit DB if userId is missing
  it("should not query database if userId missing", async () => {
    const res = await request(app).get("/api/flashcard/allCards");

    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  // POST create – missing classRoomId should return 400
  it("should return 400 if classRoomId missing", async () => {
    generateUniqueId.mockResolvedValueOnce("F123");

    const res = await request(app)
      .post("/api/flashcard/create?userId=1")
      .send({
        title: "Card",
        information: "Info"
      });

    expect(res.status).toBe(400);
  });


  // ---------- DELETE /delete ----------

  // DELETE – missing creatorId should return 400
  it("should return 400 if creatorId missing", async () => {
    const res = await request(app)
      .delete("/api/flashcard/delete?flashCardId=F1");

    expect(res.status).toBe(400);
  });

  // DELETE – flashcard does not exist or user is not owner
  it("should return 404 if flashcard not found or unauthorized", async () => {
  pool.query
    .mockResolvedValueOnce([[]])                 // SELECT → not found
    .mockResolvedValueOnce([{ affectedRows: 0 }]); // DELETE

  const res = await request(app)
    .delete("/api/flashcard/delete?flashCardId=F1&creatorId=1");

  expect(res.status).toBe(404);
});


  // DELETE – successful deletion
 it("should delete flashcard", async () => {
  pool.query
    .mockResolvedValueOnce([[{ Id: "F1", CreatorId: 1 }]]) // ownership OK
    .mockResolvedValueOnce([{ affectedRows: 1 }]);         // delete OK

  const res = await request(app)
    .delete("/api/flashcard/delete?flashCardId=F1&creatorId=1");

  expect(res.status).toBe(200);
});


});
