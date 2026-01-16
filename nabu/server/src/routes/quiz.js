import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

// Create a router
const router = express.Router();

//---------- GET all quizzes for a classroom -----------
// Expects classRoomId as a query parameter
router.get("/", async (req, res) => {
  const classRoomId = req.query.classRoomId;
  //Return 400 if classRoomId is not provided
  if (!classRoomId) {
    return res.status(400).json({ error: "classRoomId required" });
  }
  //Fetch quizzes from the database for the given classRoomId
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Quiz WHERE ClassRoomId = ?",
      [classRoomId]
    );
    //Return the quizzes with 200 status
    res.status(200).json(rows);
    //End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error("QUIZ GET ERROR:", err);
    console.log(rows[0])
    return res.status(500).json({ error: err.message, code: err.code });
  }
});

//---------- GET current quiz by quizId -----------
// Expects quizId as a query parameter
router.get("/getCurrent", async (req, res) => {
  const {quizId} = req.query;
  //Return 400 if quizId is not provided
  if (!quizId) {
    return res.status(400).json({ error: "quizId required" });
  }
  //Fetch quiz from the database for the given quizId
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Quiz WHERE Id = ?",
      [quizId]
    );
    //Return the quiz with 200 status
    return res.status(200).json(rows[0]);
    //End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error("QUIZ GET ERROR:", err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
});

//---------- CREATE quiz -----------
// Expects title, description, classRoomId, creatorId in the request body
router.post("/", async (req, res) => {
  try {
    const { title, description, classRoomId, creatorId } = req.body;
    //Validate required fields and return 400 if missing
    if (!title || !classRoomId || !creatorId) {
      return res.status(400).json({
        error: "title, classRoomId, creatorId are required"
      });
    }
    //Generate a unique ID for the new quiz
    const id = await generateUniqueId("Quiz");
    //Insert the new quiz into the database
    await pool.query(
      `INSERT INTO Quiz (Id, ClassRoomId, CreatorId, Title, Description)
       VALUES (?, ?, ?, ?, ?)`,
      [id, classRoomId, creatorId, title, description || null]
    );

    //Return the created quiz details with 201 status
    res.status(201).json({
      Id: id,
      ClassRoomId: classRoomId,
      CreatorId: creatorId,
      Title: title,
      Description: description || null,
      CreatedAt: new Date()
    });
    //End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error(err);
  res.status(500).json({ error: err.message, code: err.code });
  }
});

//---------- DELETE quiz -----------
// Expects quizId and creatorId as query parameters
router.delete(`/delete`, async(req, res) => {
  try {
    const creatorId = req.query.creatorId;
    const quizId = req.query.quizId;
    //Validate required fields and return 207 if missing
    if (!creatorId || !quizId) {
        return res.status(207).json({ error: "Missing quizId or creatorId" });
    }
    //Delete the quiz from the database
    const [result] = await pool.query(
          `DELETE FROM Quiz WHERE Id = ? AND CreatorId = ?`,
          [quizId, creatorId]
      );
      //If no rows were affected, the quiz was not found or unauthorized with 207 status
      if (result.affectedRows === 0) {
          return res.status(207).json({
              error: "Quiz not found or unauthorized"
          });
      }
      //Return success message with 200 status
      res.json({ message: "Quiz deleted successfully" });
    //End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("QUIZ DELETE ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
