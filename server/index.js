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
app.get("/api/proposals", async (req, res) => {
  try{
    const proposals = await dao.getProposals();
    res.status(200).json(proposals);
  }catch(err){
    res.status(500).json({ error: ` error: ${err} ` });
  }
});


// Activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
