"use strict";

const {isStudent, isProfessor, isLoggedIn} = require("./controllers/middleware")
const {getProposals, getProposal} = require("./controllers/showThesis")
const {newApplication} = require("./controllers/manageApplication")
const {addFiles, getAllFiles, getStudentFilesList, getFile} = require("./controllers/manageFiles")
const {newThesis} = require("./controllers/manageThesis")
const {listExternalCosupervisors, createExternalCosupervisor} = require("./controllers/others")



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

// Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


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
app.get("/api/proposals", isLoggedIn, getProposals);

//GET PROPOSAL BY ID
app.get('/api/proposal/:id', isLoggedIn, getProposal);
//DO AN APPLICATION FOR A PROPOSAL
app.post('/api/newApplication/:thesis_id', isStudent, newApplication);
//ADD FILES
app.post('/api/newFiles/:thesis_id', isStudent, addFiles)

app.get('/api/getAllFiles/:student_id/:thesis_id', isProfessor, getAllFiles);

app.get('/api/getStudentFilesList/:student_id/:thesis_id', isProfessor, getStudentFilesList);

app.get('/api/getFile/:student_id/:thesis_id/:file_name', isProfessor, getFile);

//CREATES NEW THESIS AND RELATED INT/EXTERNAL COSUPERVISORS
app.post('/api/newThesis', isProfessor, [
  // Various checks of syntax of given data
  check('title').isLength({ min: 1, max: 100 }),
  check('supervisor_id').isLength({ min: 1, max: 7 }),
  check('thesis_level').isIn(['Bachelor', 'Master', 'bachelor', 'master']),
  check('type_name').isLength({ min: 1, max: 50 }),
  check('expiration').isISO8601().toDate().withMessage("Date time must be in format YYYY-MM-DD HH:MM:SS"), // TODO check if given date is NOT earlier than today
  check('cod_degree').isLength({ min: 1, max: 10 }),
  check('is_archived').isBoolean()], newThesis);

//RETURNS LIST OF EVERY EXTERNAL COSUPERVISORS
app.get('/api/listExternalCosupervisors',isLoggedIn,listExternalCosupervisors);

//CREATES NEW EXTERNAL COSUPERVISOR 
app.post('/api/newExternalCosupervisor', isProfessor, [
  // Various checks of syntax of given data
  check('email').isEmail(),
  check('surname').isLength({ min: 1, max: 50 }),
  check('name').isLength({ min: 1, max: 50 })
], createExternalCosupervisor);