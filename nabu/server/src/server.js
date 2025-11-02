//const express = require("express");
//const app = express();
//const bodyParser = require("body-parser");
//const jwt = require("jsonwebtoken");
//const bcrypt = require("bcrypt");
//const pool = require("./db-connection.js"); // use pool instead of { connect }
//const path = require("path");

//Not completely sure if these two are needed
//const { exec } = require("child_process");
//const { profile } = require("console");
//

import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "./db-connection.js";
import path from "path";

const app = express();

app.use(bodyParser.json());

//////////////////////////////////////////
////              USERS                ////
//////////////////////////////////////////

// === SIGNUP ===
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Encrypt password with bcrypt
    const salt = await bcrypt.genSalt();
    const encPass = await bcrypt.hash(password, salt);

    // Execute SQL query to insert new user
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, encPass]
    );

    console.log("New user added:", username, email);

    //Note: res.status(200) means that the API call succeeded
    res.status(200).json({
      message: "User signed up!",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Signup error:", err);
    //Note: Each page should throw a different MSB for its status, and each error should throw a different LSB,
    //Example: Another error on this page could have res.status(102) and an error on another page could have res.status(201)
    res.status(101).json({ error: err.message });
  }
});

// === LOGIN ===
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user from database
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];

    // Compare password with hash
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Create JWT access token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      "supersecretkey", // TODO: move to .env file
      { expiresIn: "1h" }
    );

    console.log("User logged in:", username);

    res.status(200).json({
      message: "User logged in successfully!",
      accessToken: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(301).json({ error: err.message });
  }
});

//////////////////////////////////////////
////          START SERVER             ////
//////////////////////////////////////////

//Establishes where the express app listens from. This will be changed to the full website URL when releasing to production
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
