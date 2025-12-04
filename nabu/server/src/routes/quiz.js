import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();


// ============================
// GET all quizzes for a classroom
// ============================
router.get("/", async (req, res) => {
  const classRoomId = req.query.classRoomId;

  if (!classRoomId) {
    return res.status(400).json({ error: "classRoomId required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Quiz WHERE ClassRoomId = ?",
      [classRoomId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// ============================
// CREATE quiz
// ============================
router.post("/", async (req, res) => {
  try {
    const { title, classRoomId, creatorId } = req.body;

    if (!title || !classRoomId || !creatorId) {
      return res.status(400).json({
        error: "title, classRoomId, creatorId are required"
      });
    }

    const id = await generateUniqueId("Quiz");

    await pool.query(
      `INSERT INTO Quiz (Id, ClassRoomId, CreatorId, Title)
       VALUES (?, ?, ?, ?)`,
      [id, classRoomId, creatorId, title]
    );

    res.status(201).json({
      Id: id,
      ClassRoomId: classRoomId,
      CreatorId: creatorId,
      Title: title,
      CreatedAt: new Date()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
