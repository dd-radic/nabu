import mysql from "mysql2/promise";

// Verbindungskonfiguration
const pool = mysql.createPool({
  host: "91.98.132.189",       // oder "localhost" falls lokal
  user: "Benjamin",             // dein MySQL-Benutzer
  password: "NabuProject2025!", // dein Passwort
  database: "nabu",             // deine Datenbank
  port: 3306
});

export default pool;
