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

router.get("/getCurrent", async (req, res) => {
  const {quizId} = req.query;
  if (!quizId) {
    return res.status(400).json({ error: "quizId required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Quiz WHERE Id = ?",
      [quizId]
    );
    
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("QUIZ GET ERROR:", err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
});

//Mark Complete
router.post("/getCurrent/markComplete", async (req, res) => {
  const {payload} = req.query;
  if (!payload.quizId) {
    return res.status(400).json({ error: "quizId required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Quiz WHERE Id = ?",
      [quizId]
    );
    
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("QUIZ GET ERROR:", err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
});


// ============================
// CREATE quiz
// ============================
router.post("/", async (req, res) => {
  try {
    const { title, description, classRoomId, creatorId } = req.body;

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

//==========DELETE Quiz===============================//
router.delete(`/delete`, async(req, res) => {
  try {
    const creatorId = req.query.creatorId;
    const quizId = req.query.quizId;

    if (!creatorId || !quizId) {
        return res.status(207).json({ error: "Missing quizId or creatorId" });
    }

    const [result] = await pool.query(
          `DELETE FROM Quiz WHERE Id = ? AND CreatorId = ?`,
          [quizId, creatorId]
      );

      if (result.affectedRows === 0) {
          return res.status(207).json({
              error: "Quiz not found or unauthorized"
          });
      }

      res.json({ message: "Quiz deleted successfully" });
    } catch (err) {
        console.error("QUIZ DELETE ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
