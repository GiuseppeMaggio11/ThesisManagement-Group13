const dao = require("../dao");
const { validationResult } = require("express-validator");
const fs = require("fs");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "group13.thesismanagement@gmail.com",
    pass: "xuzg drbh ezyn zaqg",
  },
});
// accept one student application, cancels all other applications for that student,
//rejects every other student application to that same thesis
async function updateApplicationStatus(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors });
  }

  try {
    await dao.beginTransaction();
    let decision = {
      student_id: req.body.student_id,
      thesis_id: req.body.thesis_id,
      status: req.body.status,
    };
    const applications = await dao.getApplications();
    for (const application of applications) {
      if (
        application.student_id == req.body.student_id &&
        application.thesis_id == req.body.thesis_id
      ) {
        const updated_application = await dao.updateApplicationStatus(decision);
        if (decision.status === "Accepted") {
          for (const a of applications) {
            if (
              a.student_id == req.body.student_id &&
              a.thesis_id !== req.body.thesis_id
            ) {
              /*let dir = `studentFiles/${a.student_id}/${a.thesis_id}`;
              console.log(dir);
              fs.rmSync(dir, { recursive: true, force: true });*/
            }
          }
          //cancel every other student applications for that thesis
          const result_reject = await dao.rejectApplicationsExcept(decision);
          //cancels every other application of that student
          //const result_cancel = await dao.cancelStudentApplications(decision);
        }
        const emailData = await dao.getDataStudentApplicationEmail(
          decision.thesis_id,
          decision.student_id
        );
        const mailOptions = {
          from: "group13.thesismanagement@gmail.com",
          to: `group13.thesismanagement@gmail.com`,
          subject: `Status for thesis ${emailData.title}`,
          text: `Your application for thesis ${emailData.title} was ${decision.status}`,
        };
        transporter.sendMail(mailOptions, async (error, info) => {
          if (!error) {
            console.log("Email mandata");
          } else {
            console.log(error);
          }
        });
        await dao.commit();
        return res.status(200).json(updated_application);
      }
    }

    await dao.rollback();
    return res
      .status(400)
      .json(
        ` error: Application of student: ${req.body.student_id} for thesis with id: ${req.body.thesis_id} not found `
      );
  } catch (err) {
    await dao.rollback();
    return res.status(503).json(err);
  }
}

async function newApplication(req, res) {
  const thesis_id = req.params.thesis_id; // Extract thesis_id from the URL
  const date = req.body.date;
  try {
    if (!Number.isInteger(Number(thesis_id))) {
      return res.status(422).json("Thesis ID must be an integer");
    }
    const userID = await dao.getUserID(req.user.username);
    const isValid = await dao.isThesisValid(thesis_id, date);
    if (!isValid) {
      return res.status(422).json("This thesis is not valid");
    }
    const existing = await dao.isAlreadyExisting(userID, thesis_id);
    if (existing) {
      return res.status(422).json("You are already applied for this thesis");
    }
    const applications = await dao.getApplications();
    for (const application of applications) {
      if (
        userID == application.student_id &&
        application.status !== "Refused"
      ) {
        return res.status(422).json("You are already applied for a thesis");
      }
    }
    const result = await dao.newApply(userID, thesis_id, date);
    const emailData = await dao.getDataTeacherApplicationEmail(thesis_id);
    const mailOptions = {
      from: "group13.thesismanagement@gmail.com",
      to: `group13.thesismanagement@gmail.com`,
      subject: `Application for thesis ${emailData.title}`,
      text: `You receive an Application for thesis ${emailData.title} from ${req.user.username}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (!error) {
        console.log("Email mandata");
      } else {
        console.log(error);
      }
    });

    res.status(200).json("Application created successfully");
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getApplicationStudent(req, res) {
  try {
    let ThesisInfo;
    const userID = await dao.getUserID(req.user.username);
    const Application = await dao.getStudentApplication(userID);
    let Result = await Promise.all(
      Application.map(async (thesis) => {
        ThesisInfo = await dao.getProposalById(
          thesis.thesis_id,
          req.user.user_type,
          req.user.username
        );
        return { ...ThesisInfo, status: thesis.status };
      })
    );

    return res.status(200).json(Result);
  } catch (error) {
    res.status(500).json(error);
  }
}

//this is for getting all the ACTIVE applications related to all the proposals of a specific professor (which makes this request)
async function getApplications(req, res) {
  try {
    const results = await dao.getApplicationsForProfessor(req.user.username);
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json(err);
  }
}

async function isApplied(req, res) {
  try {
    const userID = await dao.getUserID(req.user.username);
    const applications = await dao.getApplications();
    for (const application of applications) {
      if (
        userID == application.student_id &&
        application.status !== "Refused"
      ) {
        return res.status(200).json(1);
      }
    }
    return res.status(200).json(0);
  } catch (err) {
    return res.status(500).json(`error: ${err} `);
  }
}

module.exports = {
  newApplication,
  updateApplicationStatus,
  getApplications,
  getApplicationStudent,
  isApplied,
};
