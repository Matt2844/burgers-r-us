// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');
/// cookie sessions

const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

////////////POOL ADDED TO ACCESS DB-------------------------
const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm",
});

/////////////IMPORT FOR FUNCTIONS IN DATABASE.js
const {getUserWithEmail, getUserWithID } = require('./database')

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
    getUserWithID(req.session.user_id).then((response) => {
      console.log("this is the RESPONSE value from /:", response)
      const templateVars = { user: response }
      res.render("index", templateVars);
    })
});

//ROUTES BELOW PROBABLY NEED TO BE MOVED

app.get('/register', (req, res) => {
  const templateVars = { user: null }
  res.render("register", templateVars);
});

app.get('/registerFailed', (req,res) => {
  res.render("registerFailed")
})
////// WILL NEED to add template vars to use the newly aquired user information and add it to NAV to show
app.post('/register', (req, res) => {
  getUserWithEmail(req.body.email).then((response) => {
    if(!response) {
      let values = [req.body.name, req.body.phone, req.body.email, req.body.password]
      let sqlQuery = `INSERT INTO users(name, phone_number, email, password) VALUES ($1, $2, $3, $4) RETURNING *;`
      return pool.query(sqlQuery, values).then((result) => {
        console.log(result.rows[0]);
        req.session.user_id = result.rows[0].id
        result.rows[0]
        res.redirect('/')
      })
    } else {
      res.render("registerFailed")
    }
  })
})

app.post('/login', (req, res) => {
  console.log(req.body.email, req.body.password)
  getUserWithEmail(req.body.email).then((response) => {
    if(!response) {
      res.send("You don't have an account, you need to register")
    } else if (response.password !== req.body.password) {
      res.send("Invalid Login Credentials, please check your information and try again")
    } else if (response.password === req.body.password) {
      req.session.user_id = response.id
      res.redirect('/');
    }
  })
})

app.post("/logout", (req, res) => {
  res.clearCookie("session"); /// res.cookies can erase a cooking by refering only to it's name
  res.redirect("/");
});

app.get('/checkout', (req, res) => {
  const templateVars = { user: null }
  res.render("checkout", templateVars);
});

//ROUTES ABOVE PROBABLY NEED TO BE MOVED

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
