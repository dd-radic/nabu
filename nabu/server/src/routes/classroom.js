import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

//---------- GET all classrooms for a specific user -----------
// Expects userId as a query parameter
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  // fetch classrooms from the database for the given userId and respond with 200 status + data
  try {
    const [rows] = await pool.query("SELECT * FROM ClassRoom WHERE OwnerID=?", [userId]);
    res.status(200).json(rows);
  //End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Database error when retrieving classrooms for user ${userId}` });
  }
});

//---------- Get all classrooms -----------
// No parameters needed
router.get("/all", async (req, res) => {
  // fetch all classrooms from the database and respond with 200 status + data
  try {
    const [rows] = await pool.query("SELECT * FROM ClassRoom");
    res.status(200).json(rows);
    //
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error when retrieving all classrooms" });
  }
});

//---------- Creat a Classroom -----------
//Expects a title, description and ownerid in the request body
router.post("/add", async (req, res) => {

  try {
    const { title, description, ownerID } = req.body;
    // Check if ownerid or title are not missing
    if (!title || !ownerID) {
      return res.status(400).json({ error: "title and ownerID required" });
    }
    // Generate a uniqe id for the ClassRoom
    const id = await generateUniqueId("ClassRoom");
    const createdAt = new Date();
    // Create the classroom in the database
    await pool.query(
      "INSERT INTO ClassRoom (ID, OwnerID, Title, Description, CreatedAt) VALUES (?, ?, ?, ?, ?)",
      [id, ownerID, title, description, createdAt]
    );
    // Respond with the created classroom data
    res.status(200).json({
      Id: id,
      OwnerId: ownerID,
      Title: title,
      Description: description,
      CreatedAt: createdAt
    });
    //End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

//---------- User joins a classroom -----------
// Expects userId and classroomId in the request body
router.post("/join", async (req, res) => {
  const {userId, classroomId} = req.body;
  //check if user is already a member, if not add them
  try {
    // 1) classroom exists?
    const [cRows] = await pool.query(
      "SELECT OwnerId FROM ClassRoom WHERE Id = ?",
      [classroomId]
    );
    // If classroom does not exist, return 404
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
    // If already a member, return 409
    if (mRows.length > 0) {
      return res.status(409).json({ error: "Already a member" });
    }

    // 3) insert membership
    await pool.query(
      "INSERT INTO UserClassroom (UserId, ClassRoomId, JoinedAt) VALUES (?, ?, NOW())",
      [userId, classroomId]
    );
    // Return success with status 201
    return res.status(201).json({ message: "Joined classroom" });
    // End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server/Database error" });
  }
});

//---------- User leaves a classroom -----------
// Expects userId and classroomId in the request body
router.delete("/leave", async (req, res) => {
  const {userId, classroomId} = req.body;

  try {
    // 1) classroom exists?
    const [cRows] = await pool.query(
      "SELECT OwnerId FROM ClassRoom WHERE Id = ?",
      [classroomId]
    );
    // If classroom does not exist, return 404
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
    // If not a member, return 404
    if (mRows.length === 0) {
      return res.status(404).json({ error: "You are not a member of this classroom" });
    }

    // 3) remove membership
    await pool.query(
      "DELETE FROM UserClassroom WHERE UserId = ? AND ClassRoomId = ?",
      [userId, classroomId]
    );
    // Return success with status 200
    return res.status(200).json({ message: "Left classroom successfully" });
    // End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server/Database error" });
  }
});

//---------- Check if user is member of a classroom -----------
// Expects userId and classroomId as query parameters
router.get("/isMember", async (req, res) => {
  const { userId, classroomId } = req.query;
  // Check membership in the database
  try {
    const [rows] = await pool.query(
      "SELECT * FROM UserClassroom WHERE UserId = ? AND ClassRoomId = ?",
      [userId, classroomId]
    );
    // If no rows, user is not a member
    if (rows.length === 0) {
      return res.json(false);
    }
    // User is a member
    return res.json(true);
    // End of try block returning 500 on unexpected errors
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error in checking isMember" });
  }
});

//---------- Deletes a Classroom -----------
// Expects classroomId as a query parameter
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
    //Respond with success message and 200
    res.status(200).json({
      message: `Classroom successfully deleted`
    });
  }
  //End of try block returning 500 on unexpected errors
  catch (err) {
    console.error(err);
    res.status(500).json({error: "Database error when deleting classroom"});
  }
});

//---------- Updates User score by Classroom -----------
// Expects userId, classroomId and dexp as query parameters
router.post("/updateScore", async(req, res) => {
    
    try{
        const userId = req.query.userId;
        const classroomId = req.query.classroomId;
        const dexp = req.query.dexp;
        //Fetch the user in the classroom
        const [result] = await pool.query(
            "SELECT * FROM ?? WHERE USERID = ? AND CLASSROOMID = ?",
            ["UserClassroom", userId, classroomId]
        );
        //If user not found, return 404
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        //Update the user's score
        const user = result[0];
        const newScore = (user.Score ? user.Score : 0) + parseInt(dexp);
        //Perform the update in the database
        const [updateResult] = await pool.query(
            "UPDATE ?? SET SCORE = ? WHERE USERID = ? AND CLASSROOMID = ?",
            ["UserClassroom", newScore, userId, classroomId]
        );
        //If no rows were affected, return 406
        if (updateResult.affectedRows === 0) {
            return res.status(406).json({ error: "Failed to update User score in Classroom" });
        }
        //Return success message
        res.status(200).json({ message: "User Score in Classroom updated successfully" });
        //End of try block with 500 on unexpected errors
    } catch(err){
        console.error("Error updating user score in Classroom:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
});

//---------- Gets a user's level in the classroom ----------- 
// Expects userId and classroomId as query parameters
router.get(`/userLevel`, async(req, res) => {
    try {
        const userId = req.query.userId;
        const classroomId = req.query.classroomId;
        //Fetch the user in the classroom to get their score
        const [userRows] = await pool.query(
            "SELECT * FROM ?? WHERE USERID = ? AND CLASSROOMID = ?",
            ["UserClassroom", userId, classroomId]
        );
        //If user not found, return 404
        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        //Calculate level from score
        const user = userRows[0];
        const score = (user.Score ? parseInt(user.Score) : 0);

        //Calculate the level according to Pokemon's level calculation formula
        const level = Math.floor(Math.cbrt(5*score/4));
        //Return the level to the client with 200 status
        res.status(200).json({
            userId : userId,
            classroomId : classroomId,
            level: level,
        });
        //End of try block with 407 on unexpected errors
    } catch(err){
        console.error("Error calculating user level in classroom", err);
        return res.status(407).json({ error: err.message || "Unknown error" });  
    }
});

//---------- Gets all the users in the classroom sorted by score -----------
// Expects classroomId as a query parameter
router.get(`/leaderboard`, async(req, res) => {
  try{
      const classroomId = req.query.classroomId;
      //Fetch all users in the classroom sorted by score descending
      const [leaderboard] = await pool.query(
          `SELECT uc.UserId, uc.ClassRoomId, uc. Score, u.Name as Username 
            FROM ?? uc 
            JOIN ?? u ON uc.UserId = u.Id 
            WHERE CLASSROOMID = ? ORDER BY uc.Score DESC`,
          ["UserClassroom", "User", classroomId]
      );
      //Return the leaderboard to the client with 200 status
      res.status(200).json({
        leaderboard: leaderboard
      });
      //End of try block with 408 on unexpected errors
    } catch (err) {
        console.error("Error fetching classroom leaderboard", err);
        return res.status(408).json({ error: err.message || "Unknown error" });  
    }
});

export default router;
