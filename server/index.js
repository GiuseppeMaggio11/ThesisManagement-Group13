"use strict";

const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const { check, validationResult, body } = require("express-validator");
const dao = require("./dao");
const cors = require("cors");
const multer = require('multer');
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const fs = require('fs')
const zipdir = require('zip-dir');


const app = express();
const port = 3001;

app.use(morgan("dev"));
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static("public"));

app.use(
  session({
    secret: "hjsojsdjndhirheish",
    resave: false,
    saveUninitialized: false,
  })
);
passport.use(
  new LocalStrategy(function (username, password, done) {
    dao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  dao
    .getUserByEmail(username)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userID = await dao.getUserID(req.user.username);
      const thesis_id = req.params.thesis_id;
      const userFolderPath = `studentFiles/${userID}/${thesis_id}`;

      // Create directories recursively if they don't exist
      fs.mkdirSync(userFolderPath, { recursive: true });

      cb(null, userFolderPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = file.originalname;
    let filename;

    if (uniqueSuffix.endsWith('.pdf')) {
      filename = uniqueSuffix;
    } else {
      filename = uniqueSuffix + '.pdf';
    }

    filename = filename.replace(/\s/g, "_");
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Solo file PDF sono ammessi!");
    }
  }
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Not authenticated" });
};

const isProfessor = (req, res, next) => {
  if (req.isAuthenticated() && req.user.user_type === "PROF") return next();
  return res.status(401).json({ error: "Not professor" });
};

const isStudent = (req, res, next) => {
  if (req.isAuthenticated() && req.user.user_type === "STUD") return next();
  return res.status(401).json({ error: "Not student" });
};

app.use(passport.initialize());
app.use(passport.session());


/***USER - API***/
// login
app.post("/api/session/login", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);

      return res.json(req.user);
    });
  })(req, res, next);
});

// logout
app.delete("/api/session/logout", (req, res) => {
  req.logout(() => {
    res.end();
  });
});
//Session user info
app.get("/api/session/userinfo", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});
/***API***/

//GET PROPOSALS
app.get("/api/proposals", isLoggedIn, async (req, res) => {
  try {
    const proposals = await dao.getProposals(req.user.user_type, req.user.username, req.query.date);
    res.status(200).json(proposals);
  } catch (err) {
    res.status(500).json({ error: ` error: ${err} ` });
  }
});

//GET PROPOSAL BY ID
app.get('/api/proposal/:id', isLoggedIn, async (req, res) => {
  const thesis_id = req.params.id; // Extract thesis_id from the URL
  try {
    if (!Number.isInteger(Number(thesis_id))) {
      throw new Error('Thesis ID must be an integer');
    }

    const proposal = await dao.getProposalById(thesis_id, req.user.user_type, req.user.username);
    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).send(error.message + ' ');
  }
});
//DO AN APPLICATION FOR A PROPOSAL
app.post('/api/newApplication/:thesis_id', isStudent, async (req, res) => {
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
});


app.post('/api/newFiles/:thesis_id', isStudent, async (req, res) => {
  const thesis_id = req.params.thesis_id;
  try {
    if (!Number.isInteger(Number(thesis_id))) {
      throw new Error('Thesis ID must be an integer');
    }
    upload.array('file', 10)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(422).send('Multer error');
        console.log(err)
      } else if (err) {
        res.status(422).send('An unexpected error occurred');
        console.log(err)
      }
      else {
        res.status(200).send('files uploaded correctly')
      }
    })
  }
  catch (error) {
    res.status(422).send(error);
  }
})


app.get('/api/getAllFiles/:student_id/:thesis_id', isProfessor, async (req, res) => {
  try {
    const studentID = req.params.student_id;
    const thesisID = req.params.thesis_id;
    const userFolderPath = `studentFiles/${studentID}/${thesisID}`;
    const zipFilePath = `studentFiles/${studentID}/${thesisID}/student_files_${studentID}.zip`;

    zipdir(userFolderPath, { saveTo: zipFilePath }, function (err, buffer) {
      if (err) {
        res.status(500).send('An error occurred while creating the zip archive.');
      } else {
        res.download(zipFilePath, () => {
          // Delete the file after the download is complete
          fs.unlink(zipFilePath, (err) => {
            if (err) {
              console.error('Error deleting the zip file:', err);
            } else {
              console.log('Zip file deleted successfully.');
            }
          });
        });
      }
    });
  } catch (error) {
    res.status(500).send('An unexpected error occurred');
  }
});

app.get('/api/getStudentFilesList/:student_id/:thesis_id', isProfessor, async (req, res) => {
  try {
    const studentID = req.params.student_id;
    const thesisID = req.params.thesis_id;
    const userFolderPath = `studentFiles/${studentID}/${thesisID}`;

    fs.readdir(userFolderPath, (err, files) => {
      if (err) {
        res.status(500).send('An error occurred while reading files.');
      } else {
        const fileNames = files.map(file => file);
        res.status(200).json(fileNames);
      }
    });
  } catch (error) {
    res.status(500).send('An unexpected error occurred');
  }
});

app.get('/api/getFile/:student_id/:thesis_id/:file_name', isProfessor, async (req, res) => {
  try {
    const studentID = req.params.student_id;
    const thesisID = req.params.thesis_id;
    const fileName = req.params.file_name;
    const filePath = `studentFiles/${studentID}/${thesisID}/${fileName}`;

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).send('File not found');
      } else {
        res.download(filePath, fileName);
      }
    });
  } catch (error) {
    res.status(500).send('An unexpected error occurred');
  }
});

// Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


//CREATES NEW THESIS AND RELATED INT/EXTERNAL COSUPERVISORS
app.post('/api/newThesis', isProfessor, [
  // Various checks of syntax of given data
  check('title').isLength({ min: 1, max: 100 }),
  check('supervisor_id').isLength({ min: 1, max: 7 }),
  check('thesis_level').isIn(['Bachelor', 'Master', 'bachelor', 'master']),
  check('type_name').isLength({ min: 1, max: 50 }),
  check('expiration').isISO8601().toDate().withMessage("Date time must be in format YYYY-MM-DD HH:MM:SS"), // TODO check if given date is NOT earlier than today
  check('cod_degree').isLength({ min: 1, max: 10 }),
  check('is_archived').isBoolean()
], async (req, res) => {
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
    const degrees = await dao.getDegrees()
    //If given cod_degre si not in list raise error
    if (!degrees.includes(req.body.cod_degree)) {
      return res.status(400).json({ error: `Cod_degree: ${req.body.cod_degree} is not a valid degree code` });
    }

    // --- GROUP COD should be an actual research group id, must be in group_table
    // Get every cod_group from group_table table in db
    const codes_group = await dao.getCodes_group();
    // If given cod_group is not in list  raise error
    if (!codes_group.includes(req.body.cod_group)) {
      return res.status(400).json({ error: `Cod_group: ${req.body.cod_group} is not a valid research group code` });
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

    //Create a new thesis_group row which links thesis to its research group
    const result_thesis_group = await dao.createThesis_group(result_thesis.id, req.body.cod_group);

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
    return res.json(result_thesis);

  } catch (err) {

    //rollback if errors occur
    await dao.rollback();

    //return error
    return res.status(503).json({ error: ` error: ${err} ` });
  }
});

//RETURNS LIST OF EVERY EXTERNAL COSUPERVISORS
app.get('/api/listExternalCosupervisors',
  isProfessor,
  (req, res) => {
    dao.getExternal_cosupervisors()
      .then(external_supervisors => res.json(external_supervisors))
      .catch((err) => res.status(500).json(err));
  }
);

//CREATES NEW EXTERNAL COSUPERVISOR 
app.post('/api/newExternalCosupervisor', isProfessor, [
  // Various checks of syntax of given data
  check('email').isEmail(),
  check('surname').isLength({ min: 1, max: 50 }),
  check('name').isLength({ min: 1, max: 50 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors });
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
    return res.json(result_external_cosupervisor);
    
  } catch (err) {
    //rolback if error occurs
    await dao.rollback();
    //return error code
    return res.status(503).json({ error: ` error: ${err} ` });
  }
});