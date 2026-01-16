import express from "express";
import dotenv from "dotenv";
import cors from "cors";
//  ----  ROUTES  -----
// ideally we could have incorporated signup and login into user but at this point why bother
import classroomRoute from "./routes/classroom.js";
import loginRoute from "./routes/login.js";
import signupRoute from "./routes/signup.js";
import userRoute from "./routes/user.js";
import quizRoute from "./routes/quiz.js";
import questionRoute from "./routes/question.js";
import flashcardRoute from "./routes/flashcard.js";

dotenv.config({ path: "../.env" });


//  ----  CONTROLLERS  -----
//Express app setup
const app = express();
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes and origins (adjust as needed for production) 
// and allow credentials and specific headers
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

//Use the routers for each page's server endpoints
app.use("/api/classrooms", classroomRoute);
app.use("/api/login", loginRoute);
app.use("/api/signup", signupRoute);
app.use("/api/user", userRoute);
app.use("/api/quizzes", quizRoute);
app.use("/api/question", questionRoute);
app.use("/api/flashcard", flashcardRoute);

// Prevent crashing on thrown async errors
app.use((req, res, next) => {
  Promise.resolve().then(() => next()).catch(next);
});

//---------- HEALTH CHECK ENDPOINT -----------
app.get("/api/health", (req, res) => {
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

/////////////=========== Change Username ===========/////////////

app.put("/api/user/update-username", async (req, res) => {
  await users.submit(req, res);
});

app.put("/api/user", async (req, res) => {
  await users.submit(req, res);
});

/////////////=========== Delete User ===========/////////////

app.delete("/api/user/delete", async (req, res) => {
  await users.delete(req, res);
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
