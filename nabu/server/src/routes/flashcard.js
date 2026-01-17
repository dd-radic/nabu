import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

// DEBUG TEST
console.log("FLASHCARD ROUTER LOADED");

//---------- GET all flashcards for a user -----------
// Expects userId as a query parameter
router.get("/allCards", async (req, res) => {
    const userId = req.query.userId;
    //Return 400 if userId is not provided
    if (!userId) {
        return res.status(400).json({ error: "Missing userId query parameter" });
    }
    //Fetch flashcards from the database for the given userId
    try {
        const [rows] = await pool.query(
            "SELECT * FROM FlashCard WHERE CreatorId = ?",
            [userId]
        );
        //Return the flashcards with 200 status
        res.status(200).json(rows);
        //End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("FLASHCARD GET ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

//---------- CREATE flashcard -----------
// Expects classRoomId, title, information, tags in the request body
router.post("/create", async (req, res) => {
    //Generate a unique ID for the new flashcard
    const id = await generateUniqueId("FlashCard");
    const creatorId = req.query.userId;

    const { classRoomId, title, information, tags } = req.body;
    //Validate required fields and return 400 if missing
    if (!creatorId || !classRoomId) {
        return res.status(400).json({ error: "Missing creatorId or classRoomId" });
    }
    //Insert the new flashcard into the database
    try {
        await pool.query(
            `INSERT INTO FlashCard 
            (Id, CreatorId, ClassRoomId, Title, Information, Tags, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [id, creatorId, classRoomId, title, information, tags]
        );
        //Return the created flashcard details with 201 status
        res.json({ message: "Flashcard created successfully", id });
        //End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("FLASHCARD CREATE ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

//---------- DELETE flashcard -----------
// Expects flashCardId and creatorId as query parameters
router.delete("/delete", async (req, res) => {
    const flashCardId = req.query.flashCardId;
    const creatorId = req.query.creatorId;
    //Return 400 if flashCardId or creatorId is not provided
    if (!flashCardId || !creatorId) {
        return res.status(400).json({ error: "Missing flashCardId or userId" });
    }
    //Delete flashcard from the database
    try {
        const [result] = await pool.query(
            `DELETE FROM FlashCard WHERE Id = ? AND CreatorId = ?`,
            [flashCardId, creatorId]
        );
        // If no rows were affected, the flashcard was not found or unauthorized
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "FlashCard not found or unauthorized"
            });
        }
        //Return success message with 200 status for successful deletion
        res.json({ message: "Flashcard deleted successfully" });
        //End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("FLASHCARD DELETE ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
