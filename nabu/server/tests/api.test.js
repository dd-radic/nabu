import request from "supertest";
import { test, expect } from "vitest";
import app from "../src/server.js";


test("GET /api/health returns OK", async () => {
  const res = await request(app).get("/api/health");

  expect(res.status).toBe(200);
  expect(res.body).toEqual({ message: "OK" });
});
