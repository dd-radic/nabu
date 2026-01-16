import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db-connection.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

// Create a router
const router = express.Router();

//---------- UPDATE USERNAME ENDPOINT -----------
//Route to update username with password verification it
//requires username and password in the request body and 
router.put("/update-username", async (req, res) => {
    //check if username and password are provided and return 400 if not
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }

        //Fetch user by username from the database and check if password matches
        //if not return 404 for user not found
        const [rows] = await pool.query(
            "SELECT * FROM ?? WHERE Name = ?",
            ["User", username]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0];

        //return 401 if password is invalid
        const valid = await bcrypt.compare(password, user.Password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        //JWT token generation with 1 hour expiry and return user data and token
        const accesstoken = jwt.sign(
            { id: user.ID, username: user.Name },
            process.env.DB_JWT_KEY,
            { expiresIn: "1h" }
        );

        console.log("User logged in:", user.Email);
        //return user data and token with 200 status
        res.status(200).json({
            user: user.Name,
            mail: user.Email,
            token: accesstoken,
        });
        //End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
});

//Middleware to verify JWT token
//A try catch block is added to handle unexpected errors during token verification.
const verifyToken = (req, res, next) => {
    try{
    const token = req.headers["authorization"]?.split(" ")[1];
    // If no token is provided, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    // Verify the token including error handling for invalid tokens as 403 Forbidden
    jwt.verify(token, process.env.DB_JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Failed to authenticate token" });
        }
        // Add decoded token data to request object
        req.user = decoded;
        next();
    });//end of jwt.verify return 500 on unexpected errors
    } catch(err){
        console.error("Token verification error:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
};

//---------- GET USER DATA -----------
// Route to get user data by JWT token
router.get("/", verifyToken, async (req, res) => {
    try {
        // Get user ID from the token
        const { id } = req.user; 
        // Fetch user data from the database
        const [rows] = await pool.query(
            "SELECT Name, Email, ID FROM ?? WHERE ID = ?",
            ["User", id]
        );
        // If user not found, return 404
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0];

        // Return user data with 200 status
        res.status(200).json({
            name: user.Name,
            email: user.Email,
            id: user.ID,
        });
        // End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
});

//---------- DELETE USER -----------
// Route to delete user account by JWT token
//and deletes the user associated with the token
router.delete("/delete", verifyToken, async (req, res) => {
    try {
        // Get user ID from the the request object set by verifyToken middleware
        const userId = req.user.id;
        // Delete user from the database
        const [result] = await pool.query(
            "DELETE FROM ?? WHERE ID = ?",
            ["User", userId]
        );
        // If no rows were affected, the user was not found with 404 status
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        // Return success message with 200 status for successful deletion
        res.status(200).json({ message: "Account deleted successfully" });
        // End of try block returning 500 on unexpected errors
    } catch (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
});

//---------- UPDATE USER EXP -----------
//Route to update user EXP by a given amount it requires userId and dexp as query parameters
//The variables expected as query parameters are:
//userId: The ID of the user whose EXP is to be updated.
//dexp: The amount of EXP to add to the user's current EXP.
router.post('/updateExp', async(req, res) => {
    try{
        //Get userId and dexp from query parameters
        const userId = req.query.userId;
        const dexp = req.query.dexp;
        //Fetch user by userId from the database
        const [userRows] = await pool.query(
            "SELECT * FROM ?? WHERE ID = ?",
            ["User", userId]
        );
        //If user not found return 404
        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        //Calculate new EXP and update in the database
        const user = userRows[0];
        const newExp = (user.EXP ? user.EXP : 0) + parseInt(dexp);

        const [result] = await pool.query(
            "UPDATE ?? SET EXP = ? WHERE ID = ?",
            ["User", newExp, userId]
        );
        //If no rows were affected, return 406
        if (result.affectedRows === 0) {
            return res.status(406).json({ error: "Failed to update User EXP" });
        }
        //Return success message with 200 status
        res.status(200).json({ message: "User EXP updated successfully" });
        //End of try block returning 500 on unexpected errors
    } catch(err){
        console.error("Error updating user EXP:", err);
        return res.status(500).json({ error: err.message || "Unknown error" });
    }
});

//---------- GET USER LEVEL -----------
//Route to get user level based on EXP it requires userId as a query parameter
//The variable expected as a query parameter is:
//userId: The ID of the user whose level is to be calculated.
router.get(`/level`, async(req, res) => {
    try {
        //Get userId from query parameters
        const userId = req.query.userId;
        //Fetch user by userId from the database
            const [userRows] = await pool.query(
            "SELECT * FROM ?? WHERE ID = ?",
            ["User", userId]
        );
        //If user not found return 404
        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        //Calculate level based on EXP and return it
        const user = userRows[0];
        const exp = (user.EXP ? parseInt(user.EXP) : 0);

        //Calculate the level according to Pokemon's level calculation formula
        const level = Math.floor(Math.cbrt(5*exp/4));
        //Return userId and level with 200 status
        res.status(200).json({
            userId : userId,
            level: level,
        });
    //End of try block returning 407 on unexpected errors
    } catch(err){
        console.error("Error calculating user level", err);
        return res.status(407).json({ error: err.message || "Unknown error" });  
    }
});


export default router;