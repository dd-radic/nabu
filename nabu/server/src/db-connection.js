import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // <-- WICHTIGER FIX


// Configuration of the database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// !!!!!!!!!!!!!!
// Please dont use these credentials when working on the database. 
// You will get your own credentials from me (Benjamin) if needed.
export default pool;
