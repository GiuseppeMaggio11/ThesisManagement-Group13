const dao = require("../dao");
const mysql = require("mysql2");

// open the database
const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "db_se_thesismanagement",
  };
const connection = mysql.createConnection(dbConfig);

describe("Prova", () => {
    test("Prova1", () => {
        expect(true).toBe(true);
    })
})