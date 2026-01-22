import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

// Create a router
const router = express.Router();

//---------- GET questions by quizId -----------
// Expects quizId as a query parameter
router.get("/", async (req, res) => {
  const {quizId} = req.query;
  //Return 400 if quizId is not provided
  if (!quizId) {
    return res.status(400).json({ error: "quizId required" });
  }
  //Fetch questions from the database for the given quizId
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Question WHERE QuizId = ?",
      [quizId]
    );
    //Return the questions with 200 status
    res.json(rows);
    //End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error("QUIZ GET ERROR:", err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
});

//---------- CREATE question -----------
// Expects tags, type, answer, query, quizId in the request body
router.post("/", async (req, res) => {
  try {
    const { tags, type, answer, query, quizId } = req.body;
    //Validate required fields and return 400 if missing
    if (!type || !answer || !quizId) {
      return res.status(400).json({
        error: "missing elements required"
      });
    }
    //Generate a unique ID for the new question
    const id = await generateUniqueId("Question");
    //Insert the new question into the database
    await pool.query(
      `INSERT INTO Question (Id, QuizId, Tags, Type, Answer, Query)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, quizId, tags, type, answer, query || null]
    );
    //Return the created question details with 201 status
    res.status(201).json({
      Id: id,
      QuizId: quizId,
      Tags: tags,
      Type: type,
      Answer: answer || null,
      Query: query,
      CreatedAt: new Date()
    });
    //End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error(err);
  res.status(500).json({ error: err.message, code: err.code });
  }
});

//---------- DELETE question -----------
// Expects questionId as a query parameter
router.delete(`/delete`, async(req, res) => {
    try {
      const id = req.query.questionId;
      console.log(id);
      //Validate required fields and return 207 if missing
      if (!id) {
          return res.status(207).json({ error: "Missing questionId" });
      }
      //Delete the question from the database
    const [result] = await pool.query(
          `DELETE FROM Question WHERE Id = ?`,
          [id]
      );
      //If no rows were affected, the question was not found with 207 status
      if (result.affectedRows === 0) {
          return res.status(207).json({
              error: "Question not found"
          });
      }
      //Return success message with 200 status
      res.json({ message: "Question deleted successfully" });
      //End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("QUESTION DELETE ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
})


export default router;
