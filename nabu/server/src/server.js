import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "./db-connection.js";
import path from "path";
import dotenv from "dotenv";
import generateUniqueId from "./idGenerator.js";
dotenv.config({ path: "../.env" });

//Get API function definitions from other files
import * as login from './routes/login.js';
import * as signup from './routes/signup.js';

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
app.post("/api/signup", async (req, res) => {
  await signup.submit(req, res);
});


// === LOGIN ===
app.post("/api/login", async(req, res) =>{
  await login.submit(req, res);
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
