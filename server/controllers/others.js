const dao = require("../dao");
const {validationResult} = require("express-validator");

async function listExternalCosupervisors (req,res) {
    try{
        const external_supervisors = await dao.getExternal_cosupervisors()
        res.status(200).json(external_supervisors);
    }
    catch(err) {
        res.status(500).json(err)
    };
}

async function createExternalCosupervisor (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(422).json({ errors: errors });
    }
  
    try {
      //begin new transaction
      await dao.beginTransaction();
      //check if new external cosupervisor is already in db
      const external_cosupervisors_emails = await dao.getExternal_cosupervisors_emails()
      if (external_cosupervisors_emails.includes(req.body.email)) {
        return res.status(400).json({ error: `External cosupervisor email: ${req.body.email} is already present in db` });
      }
  
      //Create external_cosupervisor object which contains data from front end
      const external_cosupervisor = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email
      }
      //Insert new cosupervisor in db
      const result_external_cosupervisor = await dao.create_external_cosupervisor(external_cosupervisor);
  
      //commit transaction
      await dao.commit();
  
      //Return inserted data
       res.status(200).json(result_external_cosupervisor);
      
    } catch (err) {
      //rolback if error occurs
      await dao.rollback();
      //return error code
        res.status(503).json({ error: ` error: ${err} ` });
    }
}

module.exports = {listExternalCosupervisors, createExternalCosupervisor}