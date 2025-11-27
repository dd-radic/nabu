import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db-connection.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
        }

        // Get user from the new User table
        const [rows] = await pool.query(
        "SELECT * FROM ?? WHERE Name = ?", 
        ["User", username] 
        );

        if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0];

        
        const valid = await bcrypt.compare(password, user.Password);
        if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
        }

        
        const accesstoken = jwt.sign(
        { id: user.ID, username: user.Name },
        process.env.DB_JWT_KEY,
        { expiresIn: "1h" }
        );

        console.log("User logged in:", user.Email);

        res.status(200).json({
        user: user.Name,
        mail: user.Email,
        token: accesstoken,
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
});

export default router;