import pool from './db-connection.js';
//The characters we will use to generate the id
const char = "ABCDEFGHIJKLMNOBQRSTUVWXYZabcdefghijklmnobqrstuvwxyz0123456789";

function idGenerator() {
    let id = "";
    for (let i = 0; i < 7; i++){
        //Math.random() returns a float between 0 and 1 eg. 0,5 then we multiply it
        //by the length of char to get a number between 0 and char.length = 62 and we floor it
        //to get a whole number.
        //so we randomly  pick a character between index 0 and 61
        id += char.charAt(Math.floor(Math.random() * char.length));
    }
    return id;
}

//returns true if id is taken in the table
async function isIdTaken(table, id) {
    //send an sql query to check if id exists in the table
  const [rows] = await pool.query(`SELECT * FROM ?? WHERE Id = ?`, [table, id]);
  return rows.length > 0; // true if conflict exists
}

//retun a unique id for each table with a prefix e.g User = Uxxxxxxx
async function generateUniqueId(table) {
  let uniqueId;

  if (table === "User") {
    uniqueId = "U";
  } else if (table === "ClassRoom") {
    uniqueId = "C";
  } else if (table === "FlashCard") {
    uniqueId = "F";
  } else if (table === "Question" || table === "Quiz") {
    uniqueId = "Q";
  } else {
    console.error("Error: The Table is not recognized in the generateUniqueId Function");
    return;
  }

  let isTaken = true;
  
   //keep generating ids until we find one that is not taken
  //isTaken turns false if theres no conflict
  while (isTaken) {
    uniqueId = uniqueId.charAt(0) + idGenerator(); // assumes idGenerator uses the prefix already
    isTaken = await isIdTaken(table, uniqueId);
  }

  return uniqueId;
}


export default generateUniqueId;
