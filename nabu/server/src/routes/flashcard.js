import express from "express";
import pool from "../db-connection.js";
import generateUniqueId from "../idGenerator.js";

const router = express.Router();

//Get all Flashcards that a user has created
//userId should be sent in the query parameters!!!
router.get("/allCards", async (req, res) =>{
    const userId = req.query.userId;
    if (!userId) {
    return res.status(400).json({ error: "Missing userId query parameter" });
    }

    try{
        
        const [rows] = await pool.query("SELECT * FROM FlashCard WHERE CreatorId=?", [userId]);
        res.json(rows);
        
    }catch (err){
        console.error(err);
        res.status(500).json({error : "Database error"})
    }
})

//Endpoint to create a new Flashcard in a given ClassRoom, userId and ClassRoom id is required
//userId should be in the query parameters and ClassRoom id and the rest in the json body
router.post("/create", async (req, res) =>{
    const table = "FlashCard";
    const id = await generateUniqueId(table);
    const creatorId = req.query.userId;
    const classRoomId = req.body.classRoomId;
    const title = req.body.title;
    const information = req.body.information;
    const tags = req.body.tags;
    if (!creatorId || !classRoomId) {
        return res.status(400).json({error : "UserId/ClassRoomId parameter is missing"});
    }
    try{
        const sql = `
        INSERT INTO FlashCard
        (Id, CreatorId, ClassRoomId, Title, Information, Tags, CreatedAt)
        VALUES (?, ?, ?, ?, ?, ?, DEFAULT)
        `;
        const [rows] = await pool.query(sql, [id, creatorId, classRoomId, title, information, tags]);
         res.json({ message: "FlashCard Created successfully" });

    }catch (err){
        console.error(err);
        res.status(500).json({error: "Database error"})
    }
})

//Endpoint to delte a FlashCard
//This end point expects a FlashCard id and a creatorId or userId
router.delete("/delete", async (req, res) => {
    const flashCardId = req.query.flashCardId; // Id of the flashcard to delete
    const creatorId = req.query.userId;        // check ownership

    if (!flashCardId || !creatorId) {
        return res.status(400).json({ error: "Missing flashCardId or userId" });
    }

    try {
        const sql = `
            DELETE FROM FlashCard
            WHERE Id = ? AND CreatorId = ?
        `;
        const [result] = await pool.query(sql, [flashCardId, creatorId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "FlashCard not found or you do not have permission" });
        }

        res.json({ message: "FlashCard deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});


export default router;
