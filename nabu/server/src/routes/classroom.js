import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

// =======================================
// GET all classrooms for a specific user
// =======================================
router.get("/", async (req, res) => {
  const userId = req.query.userId;

  try {
    const [rows] = await pool.query("SELECT * FROM ClassRoom WHERE OwnerID=?", [userId]);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Database error when retrieving classrooms for user ${userId}` });
  }
});

// =======================================
// GET ALL classrooms (admin)
// =======================================
router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM ClassRoom");
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error when retrieving all classrooms" });
  }
});

// =======================================
// CREATE classroom
// =======================================
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

// ========================================================
// USER JOINS CLASSROOM 
// ========================================================
router.post("/join", async (req, res) => {
  const {userId, classroomId} = req.body;

  try {
    // 1) classroom exists?
    const [cRows] = await pool.query(
      "SELECT OwnerId FROM ClassRoom WHERE Id = ?",
      [classroomId]
    );

    if (cRows.length === 0) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    const ownerId = cRows[0].OwnerId;

    // Owner cannot join their own room
    if (ownerId === userId) {
      return res.status(400).json({ error: "Owner cannot join their own ClassRoom" });
    }

    // 2) check if user already joined
    const [mRows] = await pool.query(
      "SELECT * FROM UserClassroom WHERE ClassRoomId = ? AND UserId = ?",
      [classroomId, userId]
    );

    if (mRows.length > 0) {
      return res.status(409).json({ error: "Already a member" });
    }

    // 3) insert membership
    await pool.query(
      "INSERT INTO UserClassroom (UserId, ClassRoomId, JoinedAt) VALUES (?, ?, NOW())",
      [userId, classroomId]
    );

    return res.status(201).json({ message: "Joined classroom" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server/Database error" });
  }
});

// ========================================================
// USER LEAVES CLASSROOM 
// ========================================================
router.delete("/leave", async (req, res) => {
  const {userId, classroomId} = req.body;

  try {
    // 1) classroom exists?
    const [cRows] = await pool.query(
      "SELECT OwnerId FROM ClassRoom WHERE Id = ?",
      [classroomId]
    );

    if (cRows.length === 0) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    const ownerId = cRows[0].OwnerId;

    // Owner can't leave
    if (ownerId === userId) {
      return res.status(400).json({ error: "Creator cannot leave their own classroom" });
    }

    // 2) check membership
    const [mRows] = await pool.query(
      "SELECT * FROM UserClassroom WHERE UserId = ? AND ClassRoomId = ?",
      [userId, classroomId]
    );

    if (mRows.length === 0) {
      return res.status(404).json({ error: "You are not a member of this classroom" });
    }

    // 3) remove membership
    await pool.query(
      "DELETE FROM UserClassroom WHERE UserId = ? AND ClassRoomId = ?",
      [userId, classroomId]
    );

    return res.status(200).json({ message: "Left classroom successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server/Database error" });
  }
});

// ========================================================
// CHECK IF USER IS MEMBER
// ========================================================
router.get("/isMember", async (req, res) => {
  const { userId, classroomId } = req.query;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM UserClassroom WHERE UserId = ? AND ClassRoomId = ?",
      [userId, classroomId]
    );

    if (rows.length === 0) {
      return res.json(false);
    }

    return res.json(true);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error in checking isMember" });
  }
});

// ========================================================
//DELETE a classroom
// ========================================================
router.delete("/delete", async(req, res) => {
  try {
    const {classroomId} = req.query;

    //Delete all of the member entries for this classroom in UserClassroom
    await pool.query(
      "DELETE FROM UserClassroom WHERE (ClassRoomId=?)",
      [classroomId]
    );

    //Delete the classroom
    await pool.query(
      "DELETE FROM ClassRoom WHERE (Id=?)",
      [classroomId]
    );

    res.status(200).json({
      message: `Classroom successfully deleted`
    });
  }

  catch (err) {
    console.error(err);
    res.status(500).json({error: "Database error when deleting classroom"});
  }
});

export default router;
