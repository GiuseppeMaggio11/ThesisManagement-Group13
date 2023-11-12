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

exports.getProposals = () => {
  return new Promise((resolve, reject) => {
    var finalResult;
    //joining associated tables, to provide easily readable thesis proposal fields
    const sql = "select t.id, title, description, tch.name ,tch.surname , thesis_level ,thesis_type , required_knowledge , notes, expiration, keywords , dg.title_degree , g.group_name, d.department_name  , is_archived from thesis t join teacher tch on t.supervisor_id = tch.id join degree_table dg on t.cod_degree = dg.cod_degree join group_table g on tch.cod_group = g.cod_group join department d on tch.cod_department = d.cod_department";
    connection.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        resolve({ error: "no entry" });
      } else {
        //we have to modify results of query before sending them back to front end
        //1- we don't have cosupervisors field in query result. so we should add an array for cosupervisors for each row
        const addCosupervisorArrayToResults = results.map(item => {
          return { ...item, cosupervisor: [] };
        });

        //2- in this stage of result, we have only the group related to supervisor
        //to make it possible to add cosupervisors' group & department, we need to change group field from a string to an array of objects (group & department)
        const changeGroupValueToArray = addCosupervisorArrayToResults.map(item => {
          return { ...item, group_name: [{group: item.group_name, department: item.department_name}]};
        });

        //3- split keywords from a single string into an array
        const splitKeywordsToArray = changeGroupValueToArray.map(item => {
          var keywordsArray = [];
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
              finalResult[indexInsideFinalResult].cosupervisor = [...finalResult[indexInsideFinalResult].cosupervisor, ""+item.name+" "+item.surname]
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
              finalResult[indexInsideFinalResult].cosupervisor = [...finalResult[indexInsideFinalResult].cosupervisor,""+item.name+" "+item.surname];
              //check if we already has another supervisor from same group and department for the current thesis, so if we have, skip adding multiple record of the same group
              const repetitiveGroup = finalResult[indexInsideFinalResult].group_name.some(obj => {
                return JSON.stringify(obj) === JSON.stringify({group: item.group_name, department: item.department_name});
              });
              if (!repetitiveGroup){
                finalResult[indexInsideFinalResult].group_name = [...finalResult[indexInsideFinalResult].group_name,{group: item.group_name, department: item.department_name}];
              }
            })
          }
          resolve(finalResult);  
        });
      }
    });
  });
};

process.on("exit", () => {
  console.log("Closing db connection");
  connection.end();
});
