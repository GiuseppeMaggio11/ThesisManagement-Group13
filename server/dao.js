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

// Creates a new thesis row in thesis table, must receive every data of thesis, returns newly created row, including autoicremented id ( used to add new rows in successive tables)
exports.createThesis = (thesis) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO thesis (title, description, supervisor_id, thesis_level, type_name, required_knowledge, notes, expiration, cod_degree, is_archived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ';
    connection.query(sql, [thesis.title, thesis.description, thesis.supervisor_id, thesis.thesis_level, thesis.type_name, 
                  thesis.required_knowledge, thesis.notes, thesis.expiration, thesis.cod_degree, thesis.is_archived], function (err, rows) {
      if (err) {
        reject(err);
      }
      const thesisrow = { id: rows.insertId, ...thesis}
      resolve(thesisrow);
    });
  });
};

// Inserts new row in type_table, must receive type not currently present in table, returns newly inserted type
exports.createThesis_type = (type) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO type_table (name) VALUES (?)';
    connection.query(sql, [type], function (err) {
      if (err) {
        reject(err);
      }
      resolve(type);
    });
  });
};

// Selects every row from type_table, returns array of every type stored in table
exports.getThesis_types = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT * FROM type_table`;
      connection.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const types = [];
        rows.map((e) =>{
          types.push(e.name);
        })        
        resolve(types);
      };
    });
  });
};

// Selects every row from keyword table, returns array of all keywords stored in table
exports.getKeywords = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT * FROM keyword`;
      connection.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const keywords = [];
        rows.map((e) =>{
          keywords.push(e.name);
        })
        resolve(keywords);
      };
    });
  });
};

// Inserts new row  in keyword table, must receive a new keyword not already present in table, returns newly inserted row
exports.createKeyword = (keyword) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO keyword (name) VALUES (?)';
    connection.query(sql, [keyword], function (err) {
      if (err) {
        reject(err);
      }
      resolve(keyword);
    });
  });
};

// Inserts in thesis_keyword table a new row, must receive thesis id and keyword, returns inserted row
exports.createThesis_keyword = (thesis_id, keyword) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO thesis_keyword (thesis_id, keyword_name) VALUES (?,?)';
    connection.query(sql, [thesis_id, keyword], function (err) {
      if (err) {
        reject(err);
      }
      const thesis_keyword = {
        thesis_id: thesis_id,
        keyword: keyword
      }
      resolve(thesis_keyword);
    });
  });
};

// Selects every teacher id from teacher table, return array of teachers codes
exports.getTeachers = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT id FROM teacher`;
      connection.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const teachers = [];
        rows.map((e) =>{
          teachers.push(e.id);
        })
        resolve(teachers);
      };
    });
  });
};

// Selects every code of degrees from degree_table, returns array of degrees codes
exports.getDegrees = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT cod_degree FROM degree_table`;
      connection.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const degrees = [];
        rows.map((e) =>{
          degrees.push(e.cod_degree);
        })
        resolve(degrees);
      };
    });
  });
};

// Selects every code of research groups from group_table, returns array of codes
exports.getCodes_group = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT cod_group FROM group_table`;
      connection.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const codes_group = [];
        rows.map((e) =>{
          codes_group.push(e.cod_group);
        })
        resolve(codes_group);
      };
    });
  });
};

// Inserts new row in thesis_group table, must receive id of thesis and id of related group, returns new inserted row
exports.createThesis_group = (thesis_id ,group_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO thesis_group (thesis_id, group_id) VALUES (?,?)';
    connection.query(sql, [thesis_id, group_id], function (err) {
      if (err) {
        reject(err);
      }
      const thesis_group ={ 
        thesis_id: thesis_id,
        group_id: group_id
      }
      resolve(thesis_group);
    });
  });
};

// Insert new row in thesis_cosupervisor table, must receive thesis id and cosupervisor id
exports.createThesis_cosupervisor = (thesis_id ,cosupervisor_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO thesis_cosupervisor (thesis_id, cosupevisor_id) VALUES (?,?)';
    connection.query(sql, [thesis_id, cosupervisor_id], function (err) {
      if (err) {
        reject(err);
      }
      const thesis_cosupervisor ={ 
        thesis_id: thesis_id,
        thesis_cosupervisor: cosupervisor_id
      }
      resolve(thesis_cosupervisor);
    });
  });
};

// Selects every email from external_supervisor table, returns array of email
exports.getExternal_cosupervisors = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT email FROM external_supervisor`;
      connection.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const external_supervisor_codes = [];
        rows.map((e) =>{
          external_supervisor_codes.push(e.email);
        })
        resolve(external_supervisor_codes);
      };
    });
  });
};