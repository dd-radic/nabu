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
    console.error("QUIZ GET ERROR:", err);
    console.log(rows[0])
    return res.status(500).json({ error: err.message, code: err.code });
  }
});

// ============================
// CREATE quiz
// ============================
router.post("/", async (req, res) => {
  try {
    const { title, description, classRoomId, creatorId } = req.body;
    console.log("REQ BODY KOMMT AN:", req.body);
console.log("Description, die ankommt:", description);

    if (!title || !classRoomId || !creatorId) {
      return res.status(400).json({
        error: "title, classRoomId, creatorId are required"
      });
    }

    const id = await generateUniqueId("Quiz");

    await pool.query(
      `INSERT INTO Quiz (Id, ClassRoomId, CreatorId, Title, Description)
       VALUES (?, ?, ?, ?, ?)`,
      [id, classRoomId, creatorId, title, description || null]
    );

    res.status(201).json({
      Id: id,
      ClassRoomId: classRoomId,
      CreatorId: creatorId,
      Title: title,
      Description: description || null,
      CreatedAt: new Date()
    });

  } catch (err) {
    console.error(err);
  res.status(500).json({ error: err.message, code: err.code });
  }
});

export default router;
