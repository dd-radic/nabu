import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db-connection.js";
import dotenv from "dotenv";
dotenv.config({
    path: "../../.env"
});
// Create a router
const router = express.Router();

//---------- LOGIN -----------
// Route to handle user login it requires username and password in the request body
router.post("/", async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;
        //Check if username and password are provided and return 400 if not
        if (!username || !password) {
            return res.status(400).json({
                error: "Missing username or password"
            });
        }

        // Get user from the new User table
        const [rows] = await pool.query(
            "SELECT * FROM ?? WHERE Name = ?",
            ["User", username]
        );
        // If user not found, return 404
        if (rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const user = rows[0];
        // Validate password and return 401 if invalid
        const valid = await bcrypt.compare(password, user.Password);
        if (!valid) {
            return res.status(401).json({
                error: "Invalid password"
            });
        }

        // JWT token generation without expiry and return user data and token
        const accesstoken = jwt.sign({
                id: user.Id,
                username: user.Name
            },
            process.env.DB_JWT_KEY,
        );

        console.log("User logged in:", user.Email);
        // Return user data and token with 200 status
        res.status(200).json({
            user: user.Name,
            mail: user.Email,
            token: accesstoken,
        });
        // End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            error: err.message || "Unknown error"
        });
    }
});

export default router;