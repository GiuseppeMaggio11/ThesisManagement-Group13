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

//Get proposals
exports.getProposals = (user_type, username) => {
  return new Promise((resolve, reject) => {
    let studentTitleDegree;
    //all loged-in users can retrieve all the proposals. students can only retrieve thesis proposals which are intended for their degree
    if(user_type === 'STUD'){
      //check if the requested thesis degree is same to student's degree or not. if not, do not show anything to student
      const sql = "select title_degree from student s join degree_table d on s.cod_degree = d.cod_degree where s.email = ?"; 
      connection.query(sql, [username], (error, result, fields) => {
        if(error){
          reject(error);
        }else {
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
        if(user_type === 'STUD'){
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
          return { ...item, group_name: [{group: item.group_name, department: item.department_name}]};
        });

        //4- split keywords from a single string into an array
        const splitKeywordsToArray = changeGroupValueToArray.map(item => {
          let keywordsArray = [];
          if (item.keywords !== null && item.keywords !== undefined){
             keywordsArray = item.keywords.split(',');
          }
          return {...item, keywords: keywordsArray}
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
              results.forEach(item =>{
              const indexInsideFinalResult = finalResult.findIndex (fR => fR.id === item.id);//find corresponding thesis index inside finalResult
              if(indexInsideFinalResult >= 0){ // we get minus values in case of no match
                finalResult[indexInsideFinalResult].cosupervisors = [...finalResult[indexInsideFinalResult].cosupervisors, ""+item.name+" "+item.surname]
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
              results.forEach(item =>{
              const indexInsideFinalResult = finalResult.findIndex (fR => fR.id === item.id); //find corresponding thesis index inside finalResult
              if(indexInsideFinalResult >= 0){
                finalResult[indexInsideFinalResult].cosupervisors = [...finalResult[indexInsideFinalResult].cosupervisors,""+item.name+" "+item.surname];
                //check if we already has another supervisor from same group and department for the current thesis, so if we have, skip adding multiple record of the same group
                const repetitiveGroup = finalResult[indexInsideFinalResult].group_name.some(obj => {
                  return JSON.stringify(obj) === JSON.stringify({group: item.group_name, department: item.department_name});
                });
                if (!repetitiveGroup){
                  finalResult[indexInsideFinalResult].group_name = [...finalResult[indexInsideFinalResult].group_name,{group: item.group_name, department: item.department_name}];
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
    if(user_type === 'STUD'){
      //check if the requested thesis degree is same to student's degree or not. if not, do not show anything to student
      const sql = "select cod_degree from student where email = ?"; 
      connection.query(sql, [username], (error, result, fields) => {
        if(error){
          reject(error);
        }else {
          const sql2 = "select cod_degree from thesis where id = ?"; 
          connection.query(sql2, [requested_thesis_id], (error, result2, fields) => {
            if(error){
              reject(error);    
            }else {
              if (result[0].cod_degree != result2[0].cod_degree){
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
        const addcosupervisorsArrayToResult = {...results[0], cosupervisors: []}

        const changeGroupValueToArray = {...addcosupervisorsArrayToResult, group_name: [{group: addcosupervisorsArrayToResult.group_name, department: addcosupervisorsArrayToResult.department_name}]};

        let keywordsArray = [];
        if(changeGroupValueToArray.keywords !== null && changeGroupValueToArray.keywords !== undefined){
          keywordsArray = changeGroupValueToArray.keywords.split(',');
        }
        const splitKeywordsToArray = {...changeGroupValueToArray, keywords: keywordsArray};
        finalResult = splitKeywordsToArray;

        //check for EXTERNAL cosupervisors and add their name & surname to finalresult
        const sql2 = "select t.id, csve.cosupevisor_id, es.name, es.surname  from thesis t join thesis_cosupervisor_external csve on t.id = csve.thesis_id join external_supervisor es on csve.cosupevisor_id  = es.email  where t.id = ?";
        connection.query(sql2, [requested_thesis_id], (error, results, fields) => {
          if (error) {
            reject(error);
          } else if (results.length === 0) {
          } else {
              results.forEach(item =>{
              finalResult.cosupervisors = [...finalResult.cosupervisors, ""+item.name+" "+item.surname]
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
              results.forEach(item =>{
              finalResult.cosupervisors = [...finalResult.cosupervisors,""+item.name+" "+item.surname];

              const repetitiveGroup = finalResult.group_name.some(obj => {
                return JSON.stringify(obj) === JSON.stringify({group: item.group_name, department: item.department_name});
              });
              if (!repetitiveGroup){
                finalResult.group_name = [...finalResult.group_name,{group: item.group_name, department: item.department_name}];
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
exports.isThesisValid = async (thesisID) => {
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
        resolve(rows[0].count === 1);
      }
    });
  });
};


// Function to create a new application
exports.newApply = async (studentID, ThesisID) => {
  const status = "pending";

  try {
    const sql =
      "INSERT INTO application (student_id, thesis_id, status, application_date) VALUES (?, ?, ?, ?)";

    return new Promise((resolve, reject) => {
      connection.query(sql, [studentID, ThesisID, status, new Date()], function (err, rows, fields) {
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









