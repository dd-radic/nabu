import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

// GET all classrooms for a specific user
router.get("/", async (req, res) => {
  const userId = req.query.userId;  // Get userId from query params
  try {
    const [rows] = await pool.query("SELECT * FROM ClassRoom WHERE OwnerID=?", [userId]);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Database error when retrieving classrooms for user ${userId}` });
  }
});

//GET ALL classrooms regardless of user
router.get("/all", async(req, res) => {
  try{
    const [rows] = await pool.query("SELECT * FROM ClassRoom");
    res.json(rows);
  }

  catch(err){
    console.error(err);
    res.status(500).json({error: "Database error when retrieving all classrooms"});
  }
});

// CREATE classroom
router.post("/add", async (req, res) => {
  try {
    const { title, description, ownerID } = req.body;

    if (!title || !ownerID) {
      return res.status(400).json({ error: "title and ownerID required" });
    }

    const id = await generateUniqueId("ClassRoom");
    const createdAt = new Date();

    await pool.query(
      "INSERT INTO ClassRoom (ID, OwnerID, Title, Description, CreatedAt) VALUES (?, ?, ?, ?, ?)",
      [id, ownerID, title, description, createdAt]
    );

    res.status(200).json({
      ID: id,
      OwnerID: ownerID,
      Title: title,
      Description: description,
      CreatedAt: createdAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//User JOINS Classroom
router.post("/join", async(req, res) => {
  try{
    const {userId, classroomId} = req.body;
    const currTime = new Date();

    await pool.query(
      "INSERT INTO UserClassroom (UserId, ClassRoomId, JoinedAt) VALUES (?, ?, ?)",
      [
        userId,
        classroomId,
        currTime
      ]
    );

    res.status(200).json({
      message: `User ${userId} successfully joined classroom ${classroomId}`
    });
  }

  catch(err){
    console.error(err);
    res.status(500).json({error: "Database error when adding user."})
  }
});

//User LEAVES Classroom
router.post("/leave", async(req, res) => {
  try{
    const {userId, classroomId} = req.body;

    await pool.query(
      "DELETE FROM UserClassroom WHERE (UserId=? AND ClassRoomId=?)",
      [userId, classroomId]
    );

    res.status(200).json({
      message: `User ${userId} successfully left classroom ${classroomId}`
    });
  }

  catch(err) {
    console.error(err);
    res.status(500).json({error: "Database error when removing user."});
  }
});

//GET if a user is in a classroom
router.get("/isMember",  async(req,res) => {
  try{
    const{userId, classroomId} = req.query;

    const [rows] = await pool.query(
      "SELECT * FROM UserClassroom WHERE (UserId=? AND ClassRoomId=?)",
      [userId, classroomId]
    );

    console.log("Rows: ", rows);

    if(rows.length === 0){
      console.log("Server: False");
      res.json(false);
    }
    console.log("Server: true");
    res.json(true);
  }

  catch (err) {
    console.error(err);
    res.status(500).json({error: "Database error in checking isMember"});
  }
});

export default router;
