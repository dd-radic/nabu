import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "./db-connection.js";
import path from "path";
import dotenv from "dotenv";
import generateUniqueId from "./idGenerator.js";
dotenv.config({ path: "../.env" });


const app = express();

app.use(bodyParser.json());

// Prevent crashing on thrown async errors
app.use((req, res, next) => {
  Promise.resolve().then(() => next()).catch(next);
});


app.get("/api/health", (req, res) => { // Health check endpoint
  res.json({ message: "OK" });
});


//////////////////////////////////////////
////              USERS                ////
//////////////////////////////////////////

// === SIGNUP ===
// === SIGNUP ===
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const salt = await bcrypt.genSalt();
    const encPass = await bcrypt.hash(password, salt);
    //here we use the new Tabel User that i created in the database
    //generate unique id 8 char string for the users table and check for conflicts
    //and resolvem them by regenerating
    const table = "User";
    const userID = await generateUniqueId(table);

    let result;
    try{
      [result] = await pool.query(
        "INSERT INTO ?? (Id, Name, Email, Password) VALUES (?, ?, ?, ?)",
        [table, userID, username, email, encPass]
      );
    }catch(dbErr){
      throw dbErr;
    }
    console.log("New user added:", username, email);


    return res.status(200).json({
      message: "User signed up!",
      userId: result.insertId,
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(101).json({ error: err.message || "Unknown error" });
  }
});


// === LOGIN ===
app.post("/api/login", async (req, res) => {
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


//////////////////////////////////////////
////          START SERVER             ////
//////////////////////////////////////////

//Establishes where the express app listens from. This will be changed to the full website URL when releasing to production
export default app;

if (process.env.NODE_ENV !== "test") {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
