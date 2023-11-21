"use strict";

//const crypto = require("crypto");
const mysql = require("mysql2/promise");
const crypto = require("crypto");
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { resolve } = require("path");
const { rejects } = require("assert");


dayjs.extend(utc)
dayjs.extend(timezone)

// open the database
const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "db_se_thesismanagement",
};

const pool = mysql.createPool(dbConfig);

exports.getUser = async (email, password) => {
  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await pool.execute(sql, [email]);

    if (results.length === 0) {
      return false;
    }

    const userRow = results[0];
    const user = {
      username: userRow.email,
      user_type: userRow.user_type_id,
    };

    const salt = userRow.salt;

    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const passwordHex = Buffer.from(userRow.password, "hex");

    if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
      return false;
    } else {
      return user;
    }
  } catch (error) {
    console.error("Error in getUser: ", error);
    throw error;
  }
};


exports.getUserByEmail = async (email) => {
  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await pool.execute(sql, [email]);

    if (results.length === 0) {
      return { error: "User not found." };
    }

    const userRow = results[0];
    const user = {
      username: userRow.email,
      user_type: userRow.user_type_id,
    };

    return user;
  } catch (error) {
    console.error("Error in getUserByEmail: ", error);
    throw error;
  }
};

//retrive the UserID from teh username
exports.getUserID = async (username) => {
  try {
    if (!username) {
      throw { error: "parameter is missing" };
    }

    const sql = "SELECT * FROM student WHERE email = ?";
    const [results] = await pool.execute(sql, [username]);

    if (results.length === 0) {
      throw { error: "User not found." };
    }

    const userRow = results[0];
    return userRow.id;
  } catch (error) {
    console.error("Error in getUserIDByEmail: ", error);
    throw error;
  }
};

//Get proposals
exports.getProposals = async (user_type, username, date) => {
  try {
    let studentTitleDegree;
    let studentApplicationid;

    let sql;

    if (user_type === 'STUD') {
      sql = "SELECT title_degree FROM student s JOIN degree_table d ON s.cod_degree = d.cod_degree WHERE s.email = ?";
      const [degreeResult] = await pool.execute(sql, [username]);
      studentTitleDegree = degreeResult[0].title_degree;

      sql = "SELECT thesis_id FROM student s JOIN application a ON s.id = a.student_id WHERE s.email = ?";
      const [applicationResult] = await pool.execute(sql, [username]);
      studentApplicationid = applicationResult.length !== 0 ? applicationResult.map((element) => element.thesis_id) : [];
    }

    let formattedDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');

    sql = "select t.id, title, description, tch.name ,tch.surname , thesis_level ,thesis_type , required_knowledge , notes, expiration, keywords , dg.title_degree , g.group_name, d.department_name  , is_archived from thesis t join teacher tch on t.supervisor_id = tch.id join degree_table dg on t.cod_degree = dg.cod_degree join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department where t.expiration > ?";
    const [thesisResults] = await pool.execute(sql, [formattedDate]);

    if (thesisResults.length === 0) {
      return { error: "no entry" };
    }

    let thesisFromSameDegreeOfStudent = thesisResults;

    if (user_type === 'STUD') {
      thesisFromSameDegreeOfStudent = thesisResults.filter(item => item.title_degree === studentTitleDegree && !studentApplicationid.includes(item.id));
    }

    //we have to modify results of query before sending them back to front end
    //2- we don't have cosupervisors field in query result. so we should add an array for cosupervisors for each row
    const addcosupervisorsArrayToResults = thesisFromSameDegreeOfStudent.map(item => {
      return { ...item, cosupervisors: [] };
    });

    //3- in this stage of result, we have only the group related to supervisor
    //to make it possible to add cosupervisors' group & department, we need to change group field from a string to an array of objects (group & department)
    const changeGroupValueToArray = addcosupervisorsArrayToResults.map(item => {
      return { ...item, group_name: [{ group: item.group_name, department: item.department_name }] };
    });

    //4- split keywords from a single string into an array
    const splitKeywordsToArray = changeGroupValueToArray.map(item => {
      let keywordsArray = [];
      if (item.keywords !== null && item.keywords !== undefined) {
        keywordsArray = item.keywords.split(',');
      }
      return { ...item, keywords: keywordsArray }
    });

    let finalResult = splitKeywordsToArray;

    sql = "select t.id, csve.cosupevisor_id, es.name, es.surname  from thesis t join thesis_cosupervisor_external csve on t.id = csve.thesis_id join external_supervisor es on csve.cosupevisor_id  = es.email";
    const [result] = await pool.execute(sql);

    if (result.length === 0) { }
    else {
      result.forEach(item => {
        const indexInsideFinalResult = finalResult.findIndex(fR => fR.id === item.id);//find corresponding thesis index inside finalResult
        if (indexInsideFinalResult >= 0) { // we get minus values in case of no match
          finalResult[indexInsideFinalResult].cosupervisors = [...finalResult[indexInsideFinalResult].cosupervisors, "" + item.name + " " + item.surname]
        }
      });
    }

    //check for cosupervisors which are university professor and add their name and department's name and group to finalresult
    sql = "select t.id, tch.name , tch.surname , g.group_name, d.department_name  from thesis t join thesis_cosupervisor_teacher csvt on t.id = csvt.thesis_id join teacher tch on csvt.cosupevisor_id = tch.id join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department";
    const [results] = await pool.execute(sql);

    if (result.length === 0) { }
    else {
      results.forEach(item => {
        const indexInsideFinalResult = finalResult.findIndex(fR => fR.id === item.id); //find corresponding thesis index inside finalResult
        if (indexInsideFinalResult >= 0) {
          finalResult[indexInsideFinalResult].cosupervisors = [...finalResult[indexInsideFinalResult].cosupervisors, "" + item.name + " " + item.surname];
          //check if we already has another supervisor from same group and department for the current thesis, so if we have, skip adding multiple record of the same group
          const repetitiveGroup = finalResult[indexInsideFinalResult].group_name.some(obj => {
            return JSON.stringify(obj) === JSON.stringify({ group: item.group_name, department: item.department_name });
          });
          if (!repetitiveGroup) {
            finalResult[indexInsideFinalResult].group_name = [...finalResult[indexInsideFinalResult].group_name, { group: item.group_name, department: item.department_name }];
          }
        }
      });
    }

    return finalResult

  } catch (error) {
    console.error("Error in getProposals: ", error);
    throw error;
  }
};

//Get proposal by id
exports.getProposalById = async (requested_thesis_id, user_type, username) => {
  try {
    let sql;

    //all loged-in users can retrieve all the proposals. students can only retrieve thesis proposals which are intended for their degree
    if (user_type === 'STUD') {
      //check if the requested thesis degree is same to student's degree or not. if not, do not show anything to student
      sql = "select cod_degree from student where email = ?";
      const [result] = await pool.execute(sql, [username]);

      sql = "select cod_degree from thesis where id = ?";
      const [result2] = await pool.execute(sql, [requested_thesis_id]);

      if (result[0].cod_degree != result2[0].cod_degree) {
        return { error: 'you are not allowed to see proposals from other degrees' };
      }
    }

    sql = "select t.id, title, description, tch.name ,tch.surname , thesis_level ,thesis_type , required_knowledge , notes, expiration, keywords , dg.title_degree , g.group_name, d.department_name  , is_archived from thesis t join teacher tch on t.supervisor_id = tch.id join degree_table dg on t.cod_degree = dg.cod_degree join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department where t.id = ?";
    let [results] = await pool.execute(sql, [requested_thesis_id]);

    if (results.length === 0) {
      return { error: 'you are not allowed to see proposals from other degrees' };
    }

    const addcosupervisorsArrayToResult = { ...results[0], cosupervisors: [] }

    const changeGroupValueToArray = { ...addcosupervisorsArrayToResult, group_name: [{ group: addcosupervisorsArrayToResult.group_name, department: addcosupervisorsArrayToResult.department_name }] };

    let keywordsArray = [];
    if (changeGroupValueToArray.keywords !== null && changeGroupValueToArray.keywords !== undefined) {
      keywordsArray = changeGroupValueToArray.keywords.split(',');
    }
    const splitKeywordsToArray = { ...changeGroupValueToArray, keywords: keywordsArray };

    let finalResult = splitKeywordsToArray;

    //check for EXTERNAL cosupervisors and add their name & surname to finalresult
    sql = "select t.id, csve.cosupevisor_id, es.name, es.surname  from thesis t join thesis_cosupervisor_external csve on t.id = csve.thesis_id join external_supervisor es on csve.cosupevisor_id  = es.email  where t.id = ?";
    [results] = await pool.execute(sql, [requested_thesis_id]);

    if (results.length === 0) { }
    else {
      results.forEach(item => {
        finalResult.cosupervisors = [...finalResult.cosupervisors, "" + item.name + " " + item.surname]
      });
    }

    //check for cosupervisors which are university professor and add their name and department's name and group to finalresult
    sql = "select t.id, tch.name , tch.surname , g.group_name, d.department_name  from thesis t join thesis_cosupervisor_teacher csvt on t.id = csvt.thesis_id join teacher tch on csvt.cosupevisor_id = tch.id join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department where t.id = ?";
    results = await pool.execute(sql, [requested_thesis_id]);

    if (results.length === 0) { }
    else {
      results.forEach(item => {
        finalResult.cosupervisors = [...finalResult.cosupervisors, "" + item.name + " " + item.surname];

        const repetitiveGroup = finalResult.group_name.some(obj => {
          return JSON.stringify(obj) === JSON.stringify({ group: item.group_name, department: item.department_name });
        });
        if (!repetitiveGroup) {
          finalResult.group_name = [...finalResult.group_name, { group: item.group_name, department: item.department_name }];
        }
      });
    }

    return finalResult

  } catch (error) {
    console.error("Error in getProposalById: ", error);
    throw error;
  }
};

//returns true if the thesis is not expired or archived, otherwise true
exports.isThesisValid = async (thesisID, date) => {
  try {
    const formattedDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');

    const sql = "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>?";
    const [countResult] = await pool.execute(sql, [thesisID, formattedDate]);

    if (countResult[0].count === 0) {
      return false;
    } else if (countResult[0].count === 1) {
      return true;
    } else {
      throw new Error('Database error');
    }

  } catch (error) {
    console.error("Error in isThesisValid: ", error);
    throw error;
  }
};

//returns false is the student is not already applied for a thesis,  otherwise true
exports.isAlreadyExisting = async (studentID, thesisID) => {
  try {
    const sql = "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?";
    const [countResult] = await pool.execute(sql, [studentID, thesisID]);

    if (countResult[0].count === 1) {
      return true;
    } else if (countResult[0].count === 0) {
      return false;
    } else {
      throw new Error('Database error');
    }

  } catch (error) {
    console.error("Error in isAlreadyExisting: ", error);
    throw error;
  }
};



// Function to create a new application
exports.newApply = async (studentID, ThesisID, date) => {
  try {
    const status = "pending";
    const formattedDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss');

    const sql = "INSERT INTO application (student_id, thesis_id, status, application_date) VALUES (?, ?, ?, ?)";
    await pool.execute(sql, [studentID, ThesisID, status, formattedDate]);

    return "Application successful.";

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw "You have already applied to this thesis.";
    } else {
      console.error("Errore nella query newApply:", error);
      throw error;
    }
  }
};

// Creates a new thesis row in thesis table, must receive every data of thesis, returns newly created row, including autoicremented id ( used to add new rows in successive tables)
exports.createThesis = async (thesis) => {
  try {
    const sql = 'INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, is_archived, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
    const [rows] = await pool.execute(sql, [thesis.title, thesis.description, thesis.supervisor_id, thesis.thesis_level, thesis.type_name,
    thesis.required_knowledge, thesis.notes, thesis.expiration, thesis.cod_degree, thesis.is_archived, thesis.keywords]);

    const thesisrow = { id: rows.insertId, ...thesis }
    return thesisrow;

  } catch (error) {
    console.error("Error in createThesis: ", error);
    throw error;
  }
};

// Selects every teacher id from teacher table, return array of teachers codes
exports.getTeachers = async () => {
  try {
    const sql = `SELECT id FROM teacher`;
    const [rows] = await pool.execute(sql);

    const teachers = [];
    rows.map((e) => {
      teachers.push(e.id);
    });
    return teachers;

  } catch (error) {
    console.error("Error in getTeachers: ", error);
    throw error;
  }
};

// Selects every code of degrees from degree_table, returns array of degrees codes
exports.getDegrees = async () => {
  try {
    const sql = `SELECT cod_degree FROM degree_table`;
    const [rows] = await pool.execute(sql);
    
    const degrees = [];
    rows.map((e) => {
      degrees.push(e.cod_degree);
    })
    return degrees;

  } catch (error) {
    console.error("Error in getDegrees: ", error);
    throw error;
  }
};

// Selects every code of research groups from group_table, returns array of codes
exports.getCodes_group = async () => {
  try {
    const sql = `SELECT cod_group FROM group_table`;
    const [rows] = await pool.execute(sql);

    const codes_group = [];
    rows.map((e) => {
      codes_group.push(e.cod_group);
    })
    return codes_group;

  } catch (error) {
    console.error("Error in getCodes_group: ", error);
    throw error;
  }
};

// Inserts new row in thesis_group table, must receive id of thesis and id of related group, returns new inserted row
exports.createThesis_group = async (thesis_id, group_id) => {
  try {
    const sql = 'INSERT INTO thesis_group (thesis_id, group_id) VALUES (?,?)';
    await pool.execute(sql, [thesis_id, group_id]);

    const thesis_group = {
      thesis_id: thesis_id,
      group_id: group_id
    }
    return thesis_group;

  } catch (error) {
    console.error("Error in createThesis_group: ", error);
    throw error;
  }
};

// Insert new row in thesis_cosupervisor table, must receive thesis id and cosupervisor id
exports.createThesis_cosupervisor_teacher = async (thesis_id, professor_id) => {
  try {
    const sql = 'INSERT INTO thesis_cosupervisor_teacher (thesis_id, cosupevisor_id) VALUES (?,?)';
    await pool.execute(sql, [thesis_id, professor_id]);

    const thesis_cosupervisor = {
      thesis_id: thesis_id,
      thesis_cosupervisor: professor_id
    }
    return thesis_cosupervisor;

  } catch (error) {
    console.error("Error in createThesis_cosupervisor_teacher: ", error);
    throw error;
  }
};

// Insert new row in thesis_cosupervisor_external table, must receive thesis id and email
exports.createThesis_cosupervisor_external = async (thesis_id, email) => {
  try {
    const sql = 'INSERT INTO thesis_cosupervisor_external (thesis_id, cosupevisor_id) VALUES (?,?)';
    await pool.execute(sql, [thesis_id, email]);

    const thesis_cosupervisor = {
      thesis_id: thesis_id,
      thesis_cosupervisor: email
    }
    return thesis_cosupervisor;

  } catch (error) {
    console.error("Error in createThesis_cosupervisor_external: ", error);
    throw error;
  }
};

// Selects every external supervisor from external_supervisor table, returns array of external cosupervisors
exports.getExternal_cosupervisors = async () => {
  try {
    const sql = `SELECT * FROM external_supervisor`;
    const [rows] = await pool.execute(sql);

    const external_supervisors = [];
    rows.map((e) => {
      const external_supervisor = {
        name: e.name,
        surname: e.surname,
        email: e.email
      }
      external_supervisors.push(external_supervisor);
    })
    return external_supervisors;

  } catch (error) {
    console.error("Error in getExternal_cosupervisors: ", error);
    throw error;
  }
};

//return every email of external cosupervisors
exports.getExternal_cosupervisors_emails = async () => {
  try {
    const sql = `SELECT email FROM external_supervisor`;
    const [rows] = await pool.execute(sql);

    const external_cosupervisor_emails = [];
    rows.map((e) => {
      external_cosupervisor_emails.push(e.email);
    })
    return external_cosupervisor_emails;

  } catch (error) {
    console.error("Error in getExternal_cosupervisors_emails: ", error);
    throw error;
  }
};

// create new external cosuper visor
exports.create_external_cosupervisor = async (external_cosupervisor) => {
  try {
    const sql = 'INSERT INTO external_supervisor (email, surname, name) VALUES (?,?,?)';
    await pool.execute(sql, [external_cosupervisor.email, external_cosupervisor.surname, external_cosupervisor.name]);

    return external_cosupervisor

  } catch (error) {
    console.error("Error in create_external_cosupervisor: ", error);
    throw error;
  }
};

exports.getStudentApplication = (studentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM application WHERE student_id = ?';
    connection.query(sql, [studentId], (err, rows) =>{
      if(err){
        reject(err);
      }
        resolve(rows);
    })
  })
}

//begin transaction function
exports.beginTransaction = async () => {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

  } catch (error) {
    console.error("Error in beginTransaction: ", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

//commit function for transactions
exports.commit = async () => {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.commit();

  } catch (error) {
    console.error("Error in commit: ", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

//rollback function for transactions
exports.rollback = async () => {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.rollback();
      } catch (error) {
    console.error("Error in rollback: ", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

process.on("exit", () => {
  console.log("Closing db connection");
  connection.end();
});

