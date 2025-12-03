import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db-connection.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
const router = express.Router();

router.put("/update-username", async (req, res) => {
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

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.DB_JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Failed to authenticate token" });
        }
        req.user = decoded; // Add decoded token data to request object
        next();
    });
};

// Route to get user data by JWT token
router.get("/", verifyToken, async (req, res) => {
    try {
        const { id } = req.user; // Extract user ID from the token
        // Query to get user data from the database
        const [rows] = await pool.query(
            "SELECT Name, Email, ID FROM ?? WHERE ID = ?", 
            ["User", id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0];

        // Send user data in response
        res.status(200).json({
            name: user.Name,
            mail: user.Email,
            id: user.ID,
        });

    } catch (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
});


export default router;