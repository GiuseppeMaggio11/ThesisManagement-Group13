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

app.post('/api/newThesis', isProfessor, [
  // Various checks of syntax of given data
  check('title').isLength({ min: 1, max: 100 }),
  check('supervisor_id').isLength({ min: 1, max: 7 }),
  check('thesis_level').isIn(['bachelor', 'master']),
  check('type_name').isLength({ min: 1, max: 50 }),
  check('expiration').isISO8601().toDate().withMessage("Date time must be in forma YYYY-MM-DD HH:MM:SS"), // TODO check if given date is NOT earlier than today
  check('cod_degree').isLength({ min: 1, max: 10 }),
  check('is_archived').isBoolean()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors });
  }

  try {

    // ---Professor should be able to insert whatever he wants as type of thesis
    // Get every type of thesis from db
    const thesis_types = await dao.getThesis_types();
    // If the type of new thesis is not in list, add it
    if (!thesis_types.includes(req.body.type_name)) {
      const result_thesis_type = dao.createThesis_type(req.body.type_name);
    }


    // ---Professor should be able to insert any quantity of words as new keywords for a thesis
    // Get every keyword from db 
    const stored_keywords = await dao.getKeywords();
    // For every keyword of new thesis, check if its already stored in list, if not add it
    req.body.keywords.forEach(keyword => {
      if (!stored_keywords.includes(keyword)) {
        const result_keyword = dao.createKeyword(keyword);
      }
    });


    // ---Main supervisor is a teacher, check if given supervisor_id is in teacher table, if it isn't raise error   
    //Get every teacher id from teacher table
    const teachers = await dao.getTeachers();
    //Check if given teacher id is in list
    if (!teachers.includes(req.body.supervisor_id)) {
      return res.status(400).json({ error: `Supervisor_id: ${req.body.supervisor_id} is not a teacher` });
    }

    // ---Cod_degree should be an actual degree, must be in degree table
    //Get every cod_degree from degree_table table in db
    const degrees = await dao.getDegrees()
    //If given cod_degre si not in list raise error
    if (!degrees.includes(req.body.cod_degree)) {
      return res.status(400).json({ error: `Cod_degree: ${req.body.cod_degree} is not a valid degree code` });
    }

    // --- Group_id should be and actual research group id, must be in group_table
    // Get every cod_group from group_table table in db
    const codes_group = await dao.getCodes_group();
    // If given cod_group is not in list  raise error
    if (!codes_group.includes(req.body.cod_group)) {
      return res.status(400).json({ error: `Cod_group: ${req.body.cod_group} is not a valid research group code` });
    }

    const external_supervisor_codes = await dao.getExternal_cosupervisors();
    for(const cosupervisor of req.body.cosupervisors){
      if(! (external_supervisor_codes.includes(cosupervisor) || teachers.includes(cosupervisor))){
        return res.status(400).json({ error: `Cosupervisor code: ${cosupervisor} is not a valid internal or external supervisor code` })
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
    }
    //Insert new thesis in db
    const result_thesis = await dao.createThesis(thesis);

    //Create a new thesis_keyword row which links thesis to its relative keywords
    for (const keyword of req.body.keywords) {
      const result_Thesis_keywords = [];
      result_Thesis_keywords.push(await dao.createThesis_keyword(result_thesis.id, keyword));

    };

    //Create a new thesis_group row which links thesis to its research group
     const result_thesis_group = await dao.createThesis_group(result_thesis.id, req.body.cod_group);
/*
    TODO AFTER DB FIXES

    //Create new thesis cosupervisor
    for (const cosupervisore of req.body.cosupervisors) {
      const result_thesis_cosupervisor = [];
      result_thesis_cosupervisor.push(await dao.createThesis_cosupervisor(result_thesis.id, cosupervisore))
    }
*/
    //Return inserted data
    return res.json(result_thesis);
  } catch (err) {
    return res.status(503).json({ error: ` error: ${err} ` });
  }



});