import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const {quizId} = req.query;

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

router.delete(`/delete`, async(req, res) => {
    try {
      const id = req.query.questionId;
      console.log(id);

      if (!id) {
          return res.status(207).json({ error: "Missing questionId" });
      }

    const [result] = await pool.query(
          `DELETE FROM Question WHERE Id = ?`,
          [id]
      );

      if (result.affectedRows === 0) {
          return res.status(207).json({
              error: "Question not found"
          });
      }

      res.json({ message: "Question deleted successfully" });
    } catch (err) {
        console.error("QUESTION DELETE ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
})


export default router;
