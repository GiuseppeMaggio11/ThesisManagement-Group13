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

//retrive the UserID from teh username
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

//returns true if the thesis is not expired or archived, otherwise true
exports.isThesisValid = async (thesisID, date) => {
  let formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  if (!thesisID) {
    throw { error: "parameter is missing" };
  }
  const sql =
    "SELECT * FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE";
  try {
    const results = await connection.execute(sql, [thesisID, formattedDate]);

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

//returns false is the student is not already applied for a thesis,  otherwise true
exports.isAlreadyExisting = async (studentID, thesisID) => {
  if (!thesisID || !studentID) {
    throw { error: "parameter is missing" };
  }
  const sql =
    "SELECT COUNT(*) as count FROM application_table WHERE student_id = ? AND thesis_id = ?";

  return new Promise((resolve, reject) => {
    connection.query(sql, [studentID, thesisID], function (err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows[0].count === 1);
      }
    });
  });
};



// Function to create a new application
exports.newApply = async (studentID, ThesisID, date) => {
  const status = "pending";
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  try {
    const sql =
      "INSERT INTO application_table (student_id, thesis_id, status, application_date) VALUES (?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
      connection.query(sql, [studentID, ThesisID, status, formattedDate], function (err, rows, fields) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            reject("You have already applied to this thesis.");
          } else {
            reject(err);
          }
        } else {
          resolve(rows);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};


process.on("exit", () => {
  console.log("Closing db connection");
  connection.end();
});
