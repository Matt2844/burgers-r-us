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
const bcrypt = require("bcrypt");

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

////////COOKIE SESSIONS

const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

/////////////IMPORT FOR FUNCTIONS IN DATABASE.js
const {getUserWithEmail, getUserWithId, productsObj } = require('./database')

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
const nodemon = require('nodemon');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  console.log(req.session.user_id)
  getUserWithId(req.session.user_id).then((response) => {
    console.log("THIS IS IN THE GET / ROUTE", response)
    const templateVars = { user: response,
      ArrObj: productsObj}
    res.render("index", templateVars);
  })
});

//ROUTES BELOW PROBABLY NEED TO BE MOVED

app.get('/register', (req, res) => {
  const templateVars = { user: null }
  res.render("register", templateVars);
});

app.get('/invalidLogin', (req, res) => {
  const templateVars = {user: null , message: "Invalid Login Credentials, please check your information and try again"}
  res.render("registerFailed", templateVars);
});

app.get('/accountMissing', (req, res) => {
  const templateVars = {user: null , message: "You don't have an account, you need to register"}
  res.render("registerFailed", templateVars);
});

app.get('/registerFailed', (req, res) => {
  const templateVars = {user: null , message: "You're already a member! please log in.🍔 "}
  res.render("registerFailed", templateVars);
});

////// WILL NEED to add template vars to use the newly aquired user information and add it to NAV to show
app.post('/register', (req, res) => {
  let inputEmail = req.body.email.toLowerCase()
  getUserWithEmail(inputEmail).then((response) => {
    if(!response) {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      let values = [req.body.name, req.body.phone, inputEmail, hashedPassword] ///email enterred will be lower case when added
      let sqlQuery = `INSERT INTO users(name, phone_number, email, password) VALUES ($1, $2, $3, $4) RETURNING *;`
      return pool.query(sqlQuery, values).then((result) => {
        req.session.user_id = result.rows[0].id;
        res.redirect('/')
        return result.rows[0];
      })
    } else {
      res.redirect('/registerFailed')
    }
  })
})

app.post('/login', (req, res) => {
  let inputEmail = req.body.email.toLowerCase()
  getUserWithEmail(inputEmail).then((response) => {
    if(response === null) {
      res.redirect('/accountMissing')
    } else if (bcrypt.compareSync(req.body.password, response.password)) {
      console.log("IF CHECK IN SHOULD WORK",response)
      req.session.user_id = response.id;
      res.redirect('/')
    } else if (response.password !== req.body.password) {
      res.redirect('/invalidLogin')
    }
  })
});

app.get('/checkout', (req, res) => {
  getUserWithId(req.session.user_id).then((response) => {
    const templateVars = { user: response,
      ArrObj: productsObj}
    res.render("checkout", templateVars);
  })
});

//ROUTES ABOVE PROBABLY NEED TO BE MOVED

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});