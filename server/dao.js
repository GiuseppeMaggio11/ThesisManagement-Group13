"use strict";

//const crypto = require("crypto");
const mysql = require("mysql2");
const crypto = require("crypto");
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');


dayjs.extend(utc)
dayjs.extend(timezone)

// open the database
const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "test_thesismanagement",
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

//Get proposals
exports.getProposals = (user_type, username) => {
  return new Promise((resolve, reject) => {
    let studentTitleDegree;
    //all loged-in users can retrieve all the proposals. students can only retrieve thesis proposals which are intended for their degree
    if (user_type === 'STUD') {
      //check if the requested thesis degree is same to student's degree or not. if not, do not show anything to student
      const sql = "select title_degree from student s join degree_table d on s.cod_degree = d.cod_degree where s.email = ?";
      connection.query(sql, [username], (error, result, fields) => {
        if (error) {
          reject(error);
        } else {
          studentTitleDegree = result[0].title_degree;
        }
      });
    }

    let finalResult;
    //joining associated tables, to provide easily readable thesis proposal fields
    const sql = "select t.id, title, description, tch.name ,tch.surname , thesis_level ,thesis_type , required_knowledge , notes, expiration, keywords , dg.title_degree , g.group_name, d.department_name  , is_archived from thesis t join teacher tch on t.supervisor_id = tch.id join degree_table dg on t.cod_degree = dg.cod_degree join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department";
    connection.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        resolve({ error: "no entry" });
      } else {
        let thesisFromSameDegreeOfStudent = results;
        //if the user which made the request is a student, then we should show him only thesis which are offered inside student's degree
        if (user_type === 'STUD') {
          thesisFromSameDegreeOfStudent = results.filter(item => item.title_degree === studentTitleDegree);
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
        })
        finalResult = splitKeywordsToArray;


        //check for EXTERNAL cosupervisors and add their name & surname to finalresult
        const sql2 = "select t.id, csve.cosupevisor_id, es.name, es.surname  from thesis t join thesis_cosupervisor_external csve on t.id = csve.thesis_id join external_supervisor es on csve.cosupevisor_id  = es.email";
        connection.query(sql2, (error, results, fields) => {
          if (error) {
            reject(error);
          } else if (results.length === 0) {
          } else {
            //iterate over result of query and search for corresponding row (based on thesis id) inside JSON array results of SQL1 (finalResult)
            //then add name & surname of external supervisor to the JSON array
            results.forEach(item => {
              const indexInsideFinalResult = finalResult.findIndex(fR => fR.id === item.id);//find corresponding thesis index inside finalResult
              if (indexInsideFinalResult >= 0) { // we get minus values in case of no match
                finalResult[indexInsideFinalResult].cosupervisors = [...finalResult[indexInsideFinalResult].cosupervisors, "" + item.name + " " + item.surname]
              }
            })
          }
        });

        //check for cosupervisors which are university professor and add their name and department's name and group to finalresult
        const sql3 = "select t.id, tch.name , tch.surname , g.group_name, d.department_name  from thesis t join thesis_cosupervisor_teacher csvt on t.id = csvt.thesis_id join teacher tch on csvt.cosupevisor_id = tch.id join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department";
        connection.query(sql3, (error, results, fields) => {
          if (error) {
            reject(error);
          } else if (results.length === 0) {
          } else {
            //iterate over result of query and search for corresponding row (based on thesis id) inside JSON array results of SQL1 (finalResult)
            //then add name & surname, group & department of cosupervisor (which is a professor) to the JSON array
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
            })
          }
          resolve(finalResult);
        });
      }
    });
  });
};

//Get proposal by id
exports.getProposalById = (requested_thesis_id, user_type, username) => {
  return new Promise((resolve, reject) => {
    //all loged-in users can retrieve all the proposals. students can only retrieve thesis proposals which are intended for their degree
    if (user_type === 'STUD') {
      //check if the requested thesis degree is same to student's degree or not. if not, do not show anything to student
      const sql = "select cod_degree from student where email = ?";
      connection.query(sql, [username], (error, result, fields) => {
        if (error) {
          reject(error);
        } else {
          const sql2 = "select cod_degree from thesis where id = ?";
          connection.query(sql2, [requested_thesis_id], (error, result2, fields) => {
            if (error) {
              reject(error);
            } else {
              if (result[0].cod_degree != result2[0].cod_degree) {
                resolve({ error: 'you are not allowed to see proposals from other degrees' });
              }
            }
          });
        }
      });
    }
    let finalResult;
    //joining associated tables, to provide easily readable thesis proposal fields
    const sql = "select t.id, title, description, tch.name ,tch.surname , thesis_level ,thesis_type , required_knowledge , notes, expiration, keywords , dg.title_degree , g.group_name, d.department_name  , is_archived from thesis t join teacher tch on t.supervisor_id = tch.id join degree_table dg on t.cod_degree = dg.cod_degree join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department where t.id = ?";
    connection.query(sql, [requested_thesis_id], (error, results, fields) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        resolve({ error: `no proposal with id: ${requested_thesis_id}` });
      } else {
        const addcosupervisorsArrayToResult = { ...results[0], cosupervisors: [] }

        const changeGroupValueToArray = { ...addcosupervisorsArrayToResult, group_name: [{ group: addcosupervisorsArrayToResult.group_name, department: addcosupervisorsArrayToResult.department_name }] };

        let keywordsArray = [];
        if (changeGroupValueToArray.keywords !== null && changeGroupValueToArray.keywords !== undefined) {
          keywordsArray = changeGroupValueToArray.keywords.split(',');
        }
        const splitKeywordsToArray = { ...changeGroupValueToArray, keywords: keywordsArray };
        finalResult = splitKeywordsToArray;

        //check for EXTERNAL cosupervisors and add their name & surname to finalresult
        const sql2 = "select t.id, csve.cosupevisor_id, es.name, es.surname  from thesis t join thesis_cosupervisor_external csve on t.id = csve.thesis_id join external_supervisor es on csve.cosupevisor_id  = es.email  where t.id = ?";
        connection.query(sql2, [requested_thesis_id], (error, results, fields) => {
          if (error) {
            reject(error);
          } else if (results.length === 0) {
          } else {
            results.forEach(item => {
              finalResult.cosupervisors = [...finalResult.cosupervisors, "" + item.name + " " + item.surname]
            })
          }
        });

        //check for cosupervisors which are university professor and add their name and department's name and group to finalresult
        const sql3 = "select t.id, tch.name , tch.surname , g.group_name, d.department_name  from thesis t join thesis_cosupervisor_teacher csvt on t.id = csvt.thesis_id join teacher tch on csvt.cosupevisor_id = tch.id join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department where t.id = ?";
        connection.query(sql3, [requested_thesis_id], (error, results, fields) => {
          if (error) {
            reject(error);
          } else if (results.length === 0) {
          } else {
            results.forEach(item => {
              finalResult.cosupervisors = [...finalResult.cosupervisors, "" + item.name + " " + item.surname];

              const repetitiveGroup = finalResult.group_name.some(obj => {
                return JSON.stringify(obj) === JSON.stringify({ group: item.group_name, department: item.department_name });
              });
              if (!repetitiveGroup) {
                finalResult.group_name = [...finalResult.group_name, { group: item.group_name, department: item.department_name }];
              }
            })
          }
          resolve(finalResult);
        });
      }
    });
  });
};

//returns true if the thesis is not expired or archived, otherwise true
exports.isThesisValid = async (thesisID, date) => {
  let formattedDate = new dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  console.log('formattedDate' + formattedDate)
  if (!thesisID) {
    throw { error: "parameter is missing" };
  }
  const sql =
    "SELECT COUNT(*) as count FROM thesis WHERE id = ? AND expiration>? AND is_archived = FALSE";
  return new Promise((resolve, reject) => {
    connection.execute(sql, [thesisID, formattedDate]), function (err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        if (rows[0].count === 0) {
          resolve(false)
        }
        else if (rows[0].count === 1) {
          resolve(true)
        }
        else
          reject('Database error')
      }
    }
  });
};

//returns false is the student is not already applied for a thesis,  otherwise true
exports.isAlreadyExisting = async (studentID, thesisID) => {
  if (!thesisID || !studentID) {
    throw { error: "parameter is missing" };
  }
  const sql =
    "SELECT COUNT(*) as count FROM application WHERE student_id = ? AND thesis_id = ?";

  return new Promise((resolve, reject) => {
    connection.query(sql, [studentID, thesisID], function (err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        if (rows[0].count === 1) {
          resolve(false)
        }
        else if (rows[0].count === 0) {
          resolve(true)
        }
        else
          reject('Database error')
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
      "INSERT INTO application (student_id, thesis_id, status, application_date) VALUES (?, ?, ?, ?)";

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

// Creates a new thesis row in thesis table, must receive every data of thesis, returns newly created row, including autoicremented id ( used to add new rows in successive tables)
exports.createThesis = (thesis) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO thesis (title, description, supervisor_id, thesis_level, thesis_type, required_knowledge, notes, expiration, cod_degree, is_archived, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?); ';
    connection.query(sql, [thesis.title, thesis.description, thesis.supervisor_id, thesis.thesis_level, thesis.type_name,
    thesis.required_knowledge, thesis.notes, thesis.expiration, thesis.cod_degree, thesis.is_archived, thesis.keywords], function (err, rows) {
      if (err) {
        reject(err);
      }
      const thesisrow = { id: rows.insertId, ...thesis }
      resolve(thesisrow);
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
        rows.map((e) => {
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
        rows.map((e) => {
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
        rows.map((e) => {
          codes_group.push(e.cod_group);
        })
        resolve(codes_group);
      };
    });
  });
};

// Inserts new row in thesis_group table, must receive id of thesis and id of related group, returns new inserted row
exports.createThesis_group = (thesis_id, group_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO thesis_group (thesis_id, group_id) VALUES (?,?)';
    connection.query(sql, [thesis_id, group_id], function (err) {
      if (err) {
        reject(err);
      }
      const thesis_group = {
        thesis_id: thesis_id,
        group_id: group_id
      }
      resolve(thesis_group);
    });
  });
};

// Insert new row in thesis_cosupervisor table, must receive thesis id and cosupervisor id
exports.createThesis_cosupervisor_teacher = (thesis_id, professor_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO thesis_cosupervisor_teacher (thesis_id, cosupevisor_id) VALUES (?,?)';
    connection.query(sql, [thesis_id, professor_id], function (err) {
      if (err) {
        reject(err);
      }
      const thesis_cosupervisor = {
        thesis_id: thesis_id,
        thesis_cosupervisor: professor_id
      }
      resolve(thesis_cosupervisor);
    });
  });
};

// Insert new row in thesis_cosupervisor_external table, must receive thesis id and email
exports.createThesis_cosupervisor_external = (thesis_id, email) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO thesis_cosupervisor_external (thesis_id, cosupevisor_id) VALUES (?,?)';
    connection.query(sql, [thesis_id, email], function (err) {
      if (err) {
        reject(err);
      }
      const thesis_cosupervisor = {
        thesis_id: thesis_id,
        thesis_cosupervisor: email
      }
      resolve(thesis_cosupervisor);
    });
  });
};

// Selects every external supervisor from external_supervisor table, returns array of external cosupervisors
exports.getExternal_cosupervisors = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT * FROM external_supervisor`;
    connection.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const external_supervisors = [];
        rows.map((e) => {
          const external_supervisor = {
            name: e.name,
            surname: e.surname,
            email: e.email
          }
          external_supervisors.push(external_supervisor);
        })
        resolve(external_supervisors);
      };
    });
  });
};

//return every email of external cosupervisors
exports.getExternal_cosupervisors_emails = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT email FROM external_supervisor`;
    connection.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        const external_cosupervisor_emails = [];
        rows.map((e) => {

          external_cosupervisor_emails.push(e.email);
        })
        resolve(external_cosupervisor_emails);
      };
    });
  });
};

// create new external cosuper visor
exports.create_external_cosupervisor = (external_cosupervisor) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO external_supervisor (email, surname, name) VALUES (?,?,?)';
    connection.query(sql, [external_cosupervisor.email, external_cosupervisor.surname, external_cosupervisor.name], function (err) {
      if (err) {
        reject(err);
      }
      resolve(external_cosupervisor);
    });
  });
};

//begin transaction function
exports.beginTransaction = () => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//commit function for transactions
exports.commit = () => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//rollback function for transactions
exports.rollback = () => {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};



process.on("exit", () => {
  console.log("Closing db connection");
  connection.end();
});