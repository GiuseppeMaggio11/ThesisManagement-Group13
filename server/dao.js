"use strict";

//const crypto = require("crypto");
const mysql = require("mysql2");
const crypto = require("crypto");

// open the database
const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "db_se_thesismanagement",
};
const connection = mysql.createConnection(dbConfig);

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], (error, results, fields) => {
      if (error) {
        console.error("Errore nella query getUser:", error);
        reject(error);
      } else if (results.length === 0) {
        resolve(false);
      } else {
        const userRow = results[0];
        const user = {
          username: userRow.email,
          user_type: userRow.user_type_id,
        };
        const salt = userRow.salt;
        crypto.scrypt(password, salt, 64, (err, hashedPassword) => {
          if (err) reject(err);
          const passwordHex = Buffer.from(userRow.password, "hex");

          if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

exports.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], (error, results, fields) => {
      if (error) {
        console.error("Errore nella query getUserByEmail:", error);
        reject(error);
      } else if (results.length === 0) {
        resolve({ error: "User not found." });
      } else {
        const userRow = results[0];
        const user = {
          username: userRow.email,
          user_type: userRow.user_type_id,
        };
        resolve(user);
      }
    });
  });
};

exports.getUserID = (username) => {
  return new Promise((resolve, reject) => {
    if (!username) {
      reject({ error: "parameter is missing" });
    }
    const sql = "SELECT * FROM student WHERE email = ?";
    connection.query(sql, [username], (error, results, fields) => {
      if (error) {
        console.error("Errore nella query getUserIDByEmail:", error);
        reject(error);
      } else if (results.length === 0) {
        reject({ error: "User not found." });
      } else {
        const userRow = results[0];
        resolve(userRow.id);
      }
    });
  });
};

const isThesisValid = async (thesisID) => {
  if (!thesisID) {
    throw { error: "parameter is missing" };
  }
  const sql =
    "SELECT * FROM thesis WHERE id = ? AND expiration > NOW() AND is_archived = FALSE";
  try {
    const results = await connection.execute(sql, [thesisID]);

    if (results.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error in the query:", error);
    throw error;
  }
};

const isAlreadyExisting = async (studentID, thesisID) => {
  if (!thesisID || !studentID) {
    throw { error: "parameter is missing" };
  }

  const sql =
    "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?";
  try {
    const results= await connection.execute(sql, [studentID, thesisID]);
    console.log(results)
    if (results.count != 0) {
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    console.error("Error in the query:", error);
    throw error;
  }
};



// Function to create a new application
exports.newApply = async (studentID, ThesisID) => {
  const status = "pending";

  try {
    const isValid = await isThesisValid(ThesisID);
    const existing = await isAlreadyExisting(studentID, ThesisID);
    if (!isValid) {
      throw new Error( "The thesis does not exist or is not active");
    }
    if (existing) {
      throw new Error("You are already applied for this thesis");
    }
    const query =
      "INSERT INTO application (student_id, thesis_id, status, application_date) VALUES (?, ?, ?, ?)";
    const values = [studentID, ThesisID, status, new Date()];
    try {
      const result = await connection.execute(query, values);
      console.log(result);
      return result;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("You have already applied to this thesis.");
      } else {
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
};


process.on("exit", () => {
  console.log("Closing db connection");
  connection.end();
});
