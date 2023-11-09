"use strict";

const crypto = require("crypto");
const mysql = require("mysql2");

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

process.on("exit", () => {
  console.log("Closing db connection");
  connection.end();
});
