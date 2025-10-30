import mysql from "mysql2/promise";

// Configuration of the database connection pool
const pool = mysql.createPool({
  host: "91.98.132.189",       
  user: "Benjamin",             // Username
  password: "NabuProject2025!", // Password
  database: "nabu",             
  port: 3306
});
// !!!!!!!!!!!!!!
// Please dont use these credentials when working on the database. 
// You will get your own credentials from me (Benjamin) if needed.
export default pool;
