import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "./db-connection.js";
import path from "path";
import dotenv from "dotenv";
import generateUniqueId from "./idGenerator.js";
import cors from "cors";

import classroomRoute from "./routes/classroom.js";
import loginRoute from "./routes/login.js";
import signupRoute from "./routes/signup.js";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());

//Use the routers for each page's server endpoints
app.use("/api/classrooms", classroomRoute);
app.use("/api/login", loginRoute);
app.use("/api/signup", signupRoute);

// Prevent crashing on thrown async errors
app.use((req, res, next) => {
  Promise.resolve().then(() => next()).catch(next);
});


app.get("/api/health", (req, res) => { // Health check endpoint
  res.json({ message: "OK" });
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
