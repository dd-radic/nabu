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
      Id: id,
      OwnerId: ownerID,
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

//====================UPDATES User score by Classroom=====================//
router.post("/updateScore", async(req, res) => {
    try{
        const userId = req.query.userId;
        const classroomId = req.query.classroomId;
        const dexp = req.query.dexp;

        const [result] = await pool.query(
            "SELECT * FROM ?? WHERE USERID = ? AND CLASSROOMID = ?",
            ["UserClassroom", userId, classroomId]
        );
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result[0];
        const newScore = (user.Score ? user.Score : 0) + parseInt(dexp);

        const [updateResult] = await pool.query(
            "UPDATE ?? SET SCORE = ? WHERE USERID = ? AND CLASSROOMID = ?",
            ["UserClassroom", newScore, userId, classroomId]
        );

        if (updateResult.affectedRows === 0) {
            return res.status(406).json({ error: "Failed to update User score in Classroom" });
        }

        res.status(200).json({ message: "User Score in Classroom updated successfully" });

    } catch(err){
        console.error("Error updating user score in Classroom:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
});

//================GETS a user's level in the classroom==========================//
router.get(`/userLevel`, async(req, res) => {
    try {
        const userId = req.query.userId;
        const classroomId = req.query.classroomId;

        const [userRows] = await pool.query(
            "SELECT * FROM ?? WHERE USERID = ? AND CLASSROOMID = ?",
            ["UserClassroom", userId, classroomId]
        );
        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userRows[0];
        const score = (user.Score ? parseInt(user.Score) : 0);

        //Calculate the level according to Pokemon's level calculation formula
        const level = Math.floor(Math.cbrt(5*score/4));

        res.status(200).json({
            userId : userId,
            classroomId : classroomId,
            level: level,
        });

    } catch(err){
        console.error("Error calculating user level in classroom", err);
        return res.status(407).json({ error: err.message || "Unknown error" });  
    }
});

//==============GETS all users in the classroom sorted by score=====================//
router.get(`/leaderboard`, async(req, res) => {
  try{
      const classroomId = req.query.classroomId;

      const [leaderboard] = await pool.query(
          `SELECT uc.UserId, uc.ClassRoomId, uc. Score, u.Name as Username 
            FROM ?? uc 
            JOIN ?? u ON uc.UserId = u.Id 
            WHERE CLASSROOMID = ? ORDER BY uc.Score DESC`,
          ["UserClassroom", "User", classroomId]
      );

      res.status(200).json({
        leaderboard: leaderboard
      });
      
    } catch (err) {
        console.error("Error fetching classroom leaderboard", err);
        return res.status(408).json({ error: err.message || "Unknown error" });  
    }
});

export default router;
