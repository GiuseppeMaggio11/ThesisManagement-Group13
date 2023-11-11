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
const fs=require('fs')
const zipdir = require('zip-dir');
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
    try{
    const userID = await dao.getUserID(req.user.username);
    console.log(userID)
    const userFolderPath = `studentsFiles/${userID}`;
    console.log(userFolderPath)
    fs.mkdirSync(userFolderPath, { recursive: true });

    cb(null, userFolderPath);
  }
    catch(error){
      throw new Error(error)
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = file.originalname
    let filename;
    if(uniqueSuffix.endsWith('.pdf')){
      filename=uniqueSuffix
    }
    else {
      filename = uniqueSuffix+'.pdf'
    }
    filename=filename.replace(/\s/g, "_");
    console.log(filename)
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


app.get("/api/session/userinfo", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});
/***API***/
app.post('/api/newApplication/:thesis_id', isStudent, async (req, res) => {
  const thesis_id = req.params.thesis_id; // Extract thesis_id from the URL
  console.log('thesis_id ' + thesis_id);

  try {
    if (!Number.isInteger(Number(thesis_id))) {
      throw new Error('Thesis ID must be an integer');
    }

    const userID = await dao.getUserID(req.user.username);
    console.log(userID);
    const result = await dao.newApply(userID, thesis_id);

    res.status(200).send('Application created successfully');
  } catch (error) {
    res.status(500).send(error.message + ' ');
  }
});


app.post('/api/newFiles', isStudent, async(req, res)=>{
  upload.array('file', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(500).send('Multer error');
    } else if (err) {
      res.status(500).send('An unexpected error occurred');
    }
    else{
      res.status(200).send('files uploaded correctly')
    }
  })
})


app.get('/api/getAllFiles/:student_id', isProfessor, async (req, res) => {
  try {
    const studentID = req.params.student_id;
    const userFolderPath = `studentsFiles/${studentID}`;

    zipdir(userFolderPath, { saveTo: `studentsFiles/student_files_${studentID}.zip` }, function (err, buffer) {
      if (err) {
        res.status(500).send('An error occurred while creating the zip archive.');
      } else {
        res.download(`studentsFiles/student_files_${studentID}.zip`);
      }
    });
  } catch (error) {
    res.status(500).send('An unexpected error occurred');
  }
});


app.get('/api/getStudentFilesList/:student_id', isProfessor, async (req, res) => {
  try {
    const studentID = req.params.student_id;
    const userFolderPath = `studentsFiles/${studentID}`;

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

app.get('/api/getFile/:student_id/:file_name', isProfessor, async (req, res) => {
  try {
    const studentID = req.params.student_id;
    const fileName = req.params.file_name;
    const filePath = `studentsFiles/${studentID}/${fileName}`;

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
