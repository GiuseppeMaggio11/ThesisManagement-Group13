const dao = require("../dao");
const {validationResult} = require("express-validator");

async function newThesis (req,res) {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors });
  }

  try {

    //inizio transazione
    await dao.beginTransaction();

    // ---MAIN SUPEVISOR is a teacher, check if given supervisor_id is in teacher table, if it isn't raise error   
    //Get every teacher id from teacher table
    const teachers = await dao.getTeachers();
    //Check if given teacher id is in list
    if (!teachers.includes(req.body.supervisor_id)) {
      return res.status(400).json({ error: `Supervisor_id: ${req.body.supervisor_id} is not a teacher` });
    }

    // ---INTERNAL COSUPERVISOR is a teacher, check if given cosupervisors_internal id is in teacher table, if it isn't raise error   
    if (req.body.cosupervisors_internal != null) {
      for (const internal_cosupervisor of req.body.cosupervisors_internal) {
        if (!teachers.includes(internal_cosupervisor)) {
          return res.status(400).json({ error: `Internal cosupervisor_id: ${internal_cosupervisor} is not a teacher` });
        }
      }
    }

    // ---EXTERNAL COSUPERVISOR is a teacher, check if given email in cosupervisors_external is in external_supervisor table, if it isn't raise error   
    const external_cosupervisors_emails = await dao.getExternal_cosupervisors_emails()
    if (req.body.cosupervisors_external != null) {
      for (const external_cosupervisor of req.body.cosupervisors_external) {
        if (!external_cosupervisors_emails.includes(external_cosupervisor)) {
          return res.status(400).json({ error: `External cosupervisor email: ${external_cosupervisor} is not a valid external cosupervisor email` });
        }
      }
    }

    // ---DEGREE CODE should be an actual degree, must be in degree table
    //Get every cod_degree from degree_table table in db
    const degrees = await dao.getCodDegrees()
    //If given cod_degre si not in list raise error
    if (!degrees.includes(req.body.cod_degree)) {
      return res.status(400).json({ error: `Cod_degree: ${req.body.cod_degree} is not a valid degree code` });
    }

    // --- GROUP COD should be an actual research group id, must be in group_table
    // Get every cod_group from group_table table in db
    const codes_group = await dao.getCodes_group();
    // If given cod_group is not in list  raise error
    for (const cod_group of req.body.cod_group) {
      if (!codes_group.includes(cod_group)) {
        return res.status(400).json({ error: `Cod_group: ${cod_group} is not a valid research group code` });
      }
    }

    //Create thesis object which contains data from front end
    const thesis = {
      title: req.body.title,
      description: req.body.description,
      supervisor_id: req.body.supervisor_id,
      thesis_level: req.body.thesis_level,
      type_name: req.body.type_name,
      required_knowledge: req.body.required_knowledge,
      notes: req.body.notes,
      expiration: req.body.expiration,
      cod_degree: req.body.cod_degree,
      is_archived: req.body.is_archived,
      keywords: req.body.keywords,
      internal_cosupervisiors: req.body.cosupervisors_internal,
      external_cosupervisiors: req.body.cosupervisors_external
    }
    //Insert new thesis in db
    const result_thesis = await dao.createThesis(thesis);

    //Create new rows which link thesis to its research group
    if (req.body.cod_group != null) {
      for (const cod_group of req.body.cod_group) {
        const result_groups = [];
        result_groups.push(await dao.createThesis_group(result_thesis.id, cod_group))
      }
    }

    //Create new rows which link thesis to interal cosupervisor
    if (req.body.cosupervisors_internal != null) {
      for (const internal_cosupervisor of req.body.cosupervisors_internal) {
        const result_cosupervisors_internal = [];
        result_cosupervisors_internal.push(await dao.createThesis_cosupervisor_teacher(result_thesis.id, internal_cosupervisor))
      }
    }

    //Create new rows which link thesis to external cosupervisor
    if (req.body.cosupervisors_external != null) {
      for (const external_cosupervisor of req.body.cosupervisors_external) {
        const result_cosupervisors_external = [];
        result_cosupervisors_external.push(await dao.createThesis_cosupervisor_external(result_thesis.id, external_cosupervisor))
      }
    }

    await dao.commit();

    //Return inserted data
    return res.status(200).json(result_thesis);

  } catch (err) {

    //rollback if errors occur
    await dao.rollback();

    //return error
    return res.status(503).json({ error: ` error: ${err} ` });
  }
}


//updates is_archived value of every thesis based on new virtualclock time
async function updateThesesArchivation(req, res) {
  try {
    await dao.beginTransaction();
    const response_msg = await dao.updateThesesArchivation(req.body.datetime);
    await dao.commit();
    res.status(200).json(response_msg);
    
  }
  catch (err) {
    await dao.rollback();
    res.status(500).json(err)
  };
}

//updates is_archived value of choosen thesis manually
async function updateThesesArchivationManual(req, res) {

  try {
    await dao.beginTransaction();
    const response_msg = await dao.updateThesesArchivationManual(req.body.thesis_id);
    await dao.commit();
    res.status(200).json(response_msg);
    
  }
  catch (err) {
    await dao.rollback();
    res.status(500).json(err)
  };
}

//delete proposals by a professor
async function deleteProposal(req,res){
  try { // check if the request body is in a correct format {thesis_id : INTEGER}
    if ( !("thesis_id" in req.body)){
      return res.status(400).json({error: "bad input format"});
    }
    const thesis_id = req.body.thesis_id;
    //check if the requested proposal id is a positive integer or not. because thesis IDs in database are positive integers
    if ( !Number.isInteger(thesis_id) || thesis_id < 0){
      return res.status(400).json({error: "thesis_id in the body should be a positive integer"});   
    }

    await dao.beginTransaction();

    //to prevent a professor from deleting other professor's proposals
    const professorID = await dao.getProfID(req.user.username);
    //if a proposal has an active application or is expired or archived, we can't delete it. here we check this fact
    const response_msg = await dao.checkBeforeDeleteProposal(thesis_id, professorID);
    if (response_msg !== "ok"){
      return res.status(400).json({error: response_msg});
    }
    await dao.deleteProposal(thesis_id);
    //to set the state of all the applications related to that proposal to Cancelled
    await dao.updateApplicationsAfterProposalDeletion(thesis_id);

    await dao.commit();
    return res.status(200).json({result: `The proposal has been deleted successfully`});
  }
  catch (err) {
    await dao.rollback();
    return res.status(500).json(err);
  };
}

module.exports = {newThesis,updateThesesArchivation, updateThesesArchivationManual, deleteProposal}