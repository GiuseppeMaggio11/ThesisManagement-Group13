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
      if (!existing) {
        return res.status(422).json("You are already applied for this thesis")
      }
      const result = await dao.newApply(userID, thesis_id, date);
  
      res.status(200).json('Application created successfully');
    } catch (error) {
      res.status(500).json(error.message + ' ');
    }
}

async function updateApplicationStatus (req,res) {
  const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(422).json({ errors: errors });
}

try {
  //begin transaction
  await dao.beginTransaction();
  const decision= {   
    student_id: req.body.student_id,
    thesis_id: req.body.thesis_id,
    status: req.body.status

  }
  const applications = await dao.getApplications();
  for( const application of applications) {
    if ( application.student_id == req.body.student_id && application.thesis_id==req.body.thesis_id){
        const updated_application = await dao.updateApplicationStatus(decision);
        await dao.commit();
        return res.json(updated_application); 
    }
  }
  return res.status(400).json(` error: Application of student: ${req.body.student_id} for thesis with id: ${req.body.thesis_id} not found `);
  //Return inserted data
  

} catch (err) {

  //rollback if errors occur
  await dao.rollback();

  //return error
  return res.status(503).json(  ` error: ${err} ` );
}
}


module.exports = {newApplication,updateApplicationStatus}