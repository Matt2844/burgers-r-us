// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

////////////POOL ADDED TO ACCESS DB-------------------------
const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm",
});

////////COOKIE SESSIONS

const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

/////////////IMPORT FOR FUNCTIONS IN DATABASE.js
const { getUserWithEmail, getUserWithId, productsObj } = require("./database");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const nodemon = require("nodemon");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


app.get("/", (req, res) => {
  console.log(req.session.user_id);
  getUserWithId(req.session.user_id).then((response) => {
    const templateVars = { user: response, ArrObj: productsObj };
    res.render("index", templateVars);
  });
});

//3 below routes render /RegisterFailed with a different message depending on the error

app.get("/invalidLogin", (req, res) => {
  const templateVars = {
    user: null,
    message:
      "Invalid Login Credentials, please check your information and try again",
  };
  res.render("registerFailed", templateVars);
});

app.get("/accountMissing", (req, res) => {
  const templateVars = {
    user: null,
    message: "You don't have an account, you need to register",
  };
  res.render("registerFailed", templateVars);
});

app.get("/registerFailed", (req, res) => {
  const templateVars = {
    user: null,
    message: "You're already a member! please log in.🍔 ",
  };
  res.render("registerFailed", templateVars);
});


///////////--------------------------------------------END OF ERROR ROUTES

/// REGISTER ROUTES----------
app.get("/register", (req, res) => {
  const templateVars = { user: null };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  getUserWithEmail(req.body.email).then((response) => {
    if (!response) {
      let values = [
        req.body.name,
        req.body.phone,
        req.body.email,
        req.body.password,
      ];
      let sqlQuery = `INSERT INTO users(name, phone_number, email, password) VALUES ($1, $2, $3, $4) RETURNING *;`;
      return pool.query(sqlQuery, values).then((result) => {
        res.redirect("/");
        req.session.user_id = result.rows[0].id;
        return result.rows[0];
      });
    } else {
      res.redirect("/registerFailed");
    }
  });
});

////////--------Log in/out ROUTES

app.post("/login", (req, res) => {
  getUserWithEmail(req.body.email).then((response) => {
    if (response === null) {
      res.redirect("/accountMissing");
    } else if (response.password !== req.body.password) {
      res.redirect("/invalidLogin");
    } else if (response.password === req.body.password) {
      req.session.user_id = response.id;
      res.redirect("/");
    }
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("session"); /// res.cookies can erase a cooking by refering only to it's name
  res.redirect("/");
});

app.get("/checkout", (req, res) => {
  getUserWithId(req.session.user_id).then((response) => {
    const templateVars = { user: response, ArrObj: productsObj };
    res.render("checkout", templateVars);
  });
});





//////////server connection route -----
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
