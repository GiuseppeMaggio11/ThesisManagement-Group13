"use strict";

const {
  isStudent,
  isProfessor,
  isLoggedIn,
} = require("./controllers/middleware");
const { getProposals, getProposal } = require("./controllers/showThesis");
const { newApplication } = require("./controllers/manageApplication");
const {
  addFiles,
  getAllFiles,
  getStudentFilesList,
  getFile,
} = require("./controllers/manageFiles");
const { newThesis } = require("./controllers/manageThesis");
const {
  listExternalCosupervisors,
  createExternalCosupervisor,
} = require("./controllers/others");

const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const { check, validationResult, body } = require("express-validator");
const dao = require("./dao");
const cors = require("cors");
const multer = require("multer");
//const LocalStrategy = require("passport-local").Strategy;
const SamlStrategy = require("@node-saml/passport-saml").Strategy;
const session = require("express-session");
const fs = require("fs");
const zipdir = require("zip-dir");
const bodyParser = require("body-parser");

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

passport.serializeUser((expressUser, done) => {
  done(null, expressUser);
});

passport.deserializeUser((expressUser, done) => {
  done(null, expressUser);
});
passport.use(
  new SamlStrategy(
    {
      path: "/login/callback",
      entryPoint:
        "https://dev-alc65i0s4u7pc5m2.us.auth0.com/samlp/NIBQ40Cep9RJAwUIviRdgPCAPMhY7iG8",
      issuer: "http:localhost:3001",
      cert: fs.readFileSync("./SAML2.0/dev-alc65i0s4u7pc5m2.pem", "utf-8"),
      logoutUrl:
        "https://dev-alc65i0s4u7pc5m2.us.auth0.com/samlp/NIBQ40Cep9RJAwUIviRdgPCAPMhY7iG8/logout",
      wantAssertionsSigned: false,
      wantAuthnResponseSigned: false,
    },
    function (profile, done) {
      /*findByEmail(profile.email, function (err, user) {
         if (err) {
          return done(err);
        }
        return done(null, user); 
        
      });
      console.log(profile);*/
      done(null, profile);
    }
  )
);

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

    if (uniqueSuffix.endsWith(".pdf")) {
      filename = uniqueSuffix;
    } else {
      filename = uniqueSuffix + ".pdf";
    }

    filename = filename.replace(/\s/g, "_");
    cb(null, filename);
  },
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
  },
});

app.use(passport.initialize());
app.use(passport.session());

/***USER - API***/
//Session user info
app.get(
  "/login",
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

// login
app.post(
  "/login/callback",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("http://localhost:5173");
  }
);

app.get("/whoami", (req, res) => {
  try {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    } else res.status(401).json({ error: "Unauthenticated user!" });
  } catch (error) {
    console.log(error);
  }
});

// logout
/* app.delete("/api/session/logout", (req, res) => {
  req.logout(() => {
    res.end();
  });
}); */
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.post("/logout/callback", (req, res) => {
  // Perform any additional cleanup or redirect logic here
  res.redirect("/");
});
/***API***/

//GET PROPOSALS
app.get("/api/proposals", isLoggedIn, getProposals);

//GET PROPOSAL BY ID
app.get("/api/proposal/:id", isLoggedIn, getProposal);
//DO AN APPLICATION FOR A PROPOSAL
app.post("/api/newApplication/:thesis_id", isStudent, newApplication);
//ADD FILES
app.post("/api/newFiles/:thesis_id", isStudent, addFiles);

app.get("/api/getAllFiles/:student_id/:thesis_id", isProfessor, getAllFiles);

app.get(
  "/api/getStudentFilesList/:student_id/:thesis_id",
  isProfessor,
  getStudentFilesList
);

app.get("/api/getFile/:student_id/:thesis_id/:file_name", isProfessor, getFile);

//CREATES NEW THESIS AND RELATED INT/EXTERNAL COSUPERVISORS
app.post(
  "/api/newThesis",
  isProfessor,
  [
    // Various checks of syntax of given data
    check("title").isLength({ min: 1, max: 100 }),
    check("supervisor_id").isLength({ min: 1, max: 7 }),
    check("thesis_level").isIn(["Bachelor", "Master", "bachelor", "master"]),
    check("type_name").isLength({ min: 1, max: 50 }),
    check("expiration")
      .isISO8601()
      .toDate()
      .withMessage("Date time must be in format YYYY-MM-DD HH:MM:SS"), // TODO check if given date is NOT earlier than today
    check("cod_degree").isLength({ min: 1, max: 10 }),
    check("is_archived").isBoolean(),
  ],
  newThesis
);

//RETURNS LIST OF EVERY EXTERNAL COSUPERVISORS
app.get(
  "/api/listExternalCosupervisors",
  isProfessor,
  listExternalCosupervisors
);

//CREATES NEW EXTERNAL COSUPERVISOR
app.post(
  "/api/newExternalCosupervisor",
  isProfessor,
  [
    // Various checks of syntax of given data
    check("email").isEmail(),
    check("surname").isLength({ min: 1, max: 50 }),
    check("name").isLength({ min: 1, max: 50 }),
  ],
  createExternalCosupervisor
);

// Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
