const dao = require("../dao");
const {validationResult} = require("express-validator");

async function newApplication (req,res){
    const thesis_id = req.params.thesis_id; // Extract thesis_id from the URL
    const date = req.body.date
    try {
      if (!Number.isInteger(Number(thesis_id))) {
        throw new Error('Thesis ID must be an integer');
      }
      const userID = await dao.getUserID(req.user.username);
      const isValid = await dao.isThesisValid(thesis_id, date);
      if (!isValid) {
        return res.status(422).json("This thesis is not valid")
      }
      const existing = await dao.isAlreadyExisting(userID, thesis_id);
      if (existing) {
        return res.status(422).json("You are already applied for this thesis")
      }
      const result = await dao.newApply(userID, thesis_id, date);
  
      res.status(200).json('Application created successfully');
    } catch (error) {
      res.status(500).json(error.message + ' ');
    }
};

async function getApplicationStudent (req,res){
    //const studentId = req.params.student_id;
    try{

      //DEVO CONTROLLARE SE L'ID E' DELL'UTENTE LOGGATO!!
      await dao.beginTransaction();
      
      const userID = await dao.getUserID(req.user.username);
      const Application = await dao.getStudentApplication(userID);
      console.log(Application)      
      await dao.commit()
      return res.status(200).json(Application);
    } catch (error){
      
      await dao.rollback()
      res.status(500).json(error.message + ' ');
    }
};


module.exports = {newApplication,getApplicationStudent}