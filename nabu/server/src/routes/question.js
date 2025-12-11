import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const quizId = req.body.quizId;

  if (!quizId) {
    return res.status(400).json({ error: "quizId required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Question WHERE QuizId = ?",
      [quizId]
    );
    res.json(rows);
  } catch (err) {
    console.error("QUIZ GET ERROR:", err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
});

router.post("/", async (req, res) => {
  try {
    const { tags, type, answer, query, quizId } = req.body;

    if (!type || !answer || !quizId) {
      return res.status(400).json({
        error: "missing elements required"
      });
    }

    const id = await generateUniqueId("Question");

    await pool.query(
      `INSERT INTO Question (Id, QuizId, Tags, Type, Answer, Query)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, quizId, tags, type, answer, query || null]
    );

    res.status(201).json({
      Id: id,
      QuizId: quizId,
      Tags: tags,
      Type: type,
      Answer: answer || null,
      Query: query,
      CreatedAt: new Date()
    });

  } catch (err) {
    console.error(err);
  res.status(500).json({ error: err.message, code: err.code });
  }
});


export default router;
