import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

// DEBUG TEST
console.log("FLASHCARD ROUTER LOADED");

// GET all flashcards for a user
router.get("/allCards", async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: "Missing userId query parameter" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT * FROM FlashCard WHERE CreatorId = ?",
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error("FLASHCARD GET ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a flashcard
router.post("/create", async (req, res) => {
    const id = await generateUniqueId("FlashCard");
    const creatorId = req.query.userId;

    const { classRoomId, title, information, tags } = req.body;

    if (!creatorId || !classRoomId) {
        return res.status(400).json({ error: "Missing creatorId or classRoomId" });
    }

    try {
        await pool.query(
            `INSERT INTO FlashCard 
            (Id, CreatorId, ClassRoomId, Title, Information, Tags, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [id, creatorId, classRoomId, title, information, tags]
        );

        res.json({ message: "Flashcard created successfully", id });
    } catch (err) {
        console.error("FLASHCARD CREATE ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete flashcard
router.delete("/delete", async (req, res) => {
    const flashCardId = req.query.flashCardId;
    const creatorId = req.query.userId;

    if (!flashCardId || !creatorId) {
        return res.status(400).json({ error: "Missing flashCardId or userId" });
    }

    try {
        const [result] = await pool.query(
            `DELETE FROM FlashCard WHERE Id = ? AND CreatorId = ?`,
            [flashCardId, creatorId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "FlashCard not found or unauthorized"
            });
        }

        res.json({ message: "Flashcard deleted successfully" });
    } catch (err) {
        console.error("FLASHCARD DELETE ERROR:", err);
        res.status(500).json({ error: "Database error" });
    }
});

export default router;
