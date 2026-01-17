import express from "express";
import bcrypt from "bcrypt";
import pool from "../db-connection.js";
import dotenv from "dotenv";
import generateUniqueId from "../idGenerator.js";
dotenv.config({
  path: "../../.env"
});

// Create a router
const router = express.Router();

//---------- SIGNUP -----------
// Route to handle user signup it requires username, email and password in the request body

router.post("/", async (req, res) => {
  //get the username, email and password from the request body
  try {
    const {username, email, password} = req.body;
    //Check if all fields are provided and return 400 if not
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }
    //Encrypt the password before storing it
    const salt = await bcrypt.genSalt();
    const encPass = await bcrypt.hash(password, salt);
    //here we use the new Tabel User that i created in the database
    //generate unique id 8 char string for the users table and check for conflicts
    //and resolvem them by regenerating
    const table = "User";
    const userID = await generateUniqueId(table);

    let result;
      //The query to Insert the new user into the database
    try {
      [result] = await pool.query(
        "INSERT INTO ?? (Id, Name, Email, Password) VALUES (?, ?, ?, ?)",
        [table, userID, username, email, encPass]
      );
    } catch (dbErr) {
      throw dbErr;
    }
    //Log the new user added
    console.log("New user added:", username, email);

    return res.status(200).json({
      message: "User signed up!",
      userId: result.ID,
      username: username,
      password: password
    });
    //End of try block returning 101 on unexpected errors
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(101).json({
      error: err.message || "Unknown error"
    });
  }
});

export default router;