"use strict";

//const crypto = require("crypto");
const mysql = require("mysql2");

// open the database
const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "db_se_thesismanagement",
};
const connection = mysql.createConnection(dbConfig);

process.on("exit", () => {
  console.log("Closing db connection");
  connection.end();
});
