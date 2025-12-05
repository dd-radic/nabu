import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

// GET all classrooms
router.get("/", async (req, res) => {
  const userId = req.query.userId;  // Get userId from query params
  try {
    const [rows] = await pool.query("SELECT * FROM ClassRoom WHERE OwnerID=?", [userId]);
    res.json(rows);

    //TODO: REMOVE
    console.log(rows);
    //
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE classroom
router.post("/", async (req, res) => {
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

    res.status(201).json({
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

//Endpoint to join a ClassRoom
//JWT Tokens should be integrated with this Endpoint
router.post("/join", async (req, res) => {

  const classRoomId = req.query.classRoomId
  const userId = req.query.userId;

  try {
    // 1) classroom exists + owner
    const [cRows] = await pool.query(
      "SELECT OwnerId FROM ClassRoom WHERE Id = ?",
      [classRoomId]
    );
    
    if (cRows.length === 0) return res.status(404).json({ error: "Classroom not found" });

    const ownerId = cRows[0].OwnerId; // match DB column casing
    if (ownerId === userId) {
      return res.status(400).json({ error: "Owner cannot join his own ClassRoom" });
    }

    // 2) is the user already a member
    const [mRows] = await pool.query(
      "SELECT * FROM UserClassroom WHERE ClassRoomId = ? AND UserId = ?",
      [classRoomId, userId]
    );
    if (mRows.length > 0) {
      return res.status(409).json({ error: "Already a member" });
    }

    // 3) insert membership
    await pool.query(
      "INSERT INTO UserClassroom (UserId, ClassRoomId, JoinedAt) VALUES (?, ?, NOW());",
      [userId, classRoomId]
    );

    console.log("ClassRoom Joined succesfully")
    return res.status(201).json({ message: "Joined classroom" });
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server/Database error" });
  }
});


//EndPoint to DELETE (leave a classRoom)
//For now it expects a classRoomId and a userId as Parameters
router.delete("/leave", async (req, res) => {
  const classRoomId = req.query.classRoomId;
  const userId = req.query.userId;
  //For Debugin purposes
  console.log (`classRoomId: ${classRoomId} and userid ${userId}`);

  try {
    const [wRows] = await pool.query(
      "SELECT OwnerId FROM ClassRoom WHERE Id = ?",
      [classRoomId]
    );
    const wuserId = wRows[0].userId;
    if (wuserId == userId) {
      return res.status(404).json({error: "Creator can't leave a Room right now"})
    }


    // Check if user is a member first
    const [mRows] = await pool.query(
      "SELECT * FROM UserClassroom WHERE UserId = ? AND ClassRoomId = ? ",
      [userId, classRoomId]
    );

    if (mRows.length === 0) {
      return res.status(404).json({ error: "You are not a member of this classroom" });
    }

    // Delete the membership
    await pool.query(
      "DELETE FROM UserClassroom WHERE UserId = ? AND ClassRoomId = ?",
      [userId, classRoomId]
    );

    return res.status(200).json({ message: "Left classroom successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server/Database error" });
  }
});



export default router;
