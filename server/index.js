"use strict";

const express = require("express");
const morgan = require("morgan");
const { check, validationResult, body } = require("express-validator");
const dao = require("./dao");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

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

app.use(
  session({
    secret: "hjsojsdjndhirheish",
    resave: false,
    saveUninitialized: false,
  })
);

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

app.get("/api/session/userinfo", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

/***API***/

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