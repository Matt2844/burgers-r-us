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
const getUserWithEmail = require('./database')

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
  res.render("index");
});

//ROUTES BELOW PROBABLY NEED TO BE MOVED

app.get('/register', (req, res) => {
  res.render("register");
});

////// WILL NEED TO add NAME AND PHONE NUMBER once forms have been updated in the REGISTER HTML
////// WILL NEED to add template vars to use the newly aquired user information and add it to NAV to show
app.post('/register', (req, res) => {
  console.log(req.body.name, req.body.phone, req.body.email, req.body.password)
  if (!getUserWithEmail(req.body.email)) {
    let values = [req.body.name, req.body.phone, req.body.email, req.body.password]
    let sqlQuery = `INSERT INTO users(name, phone_number, email, password) VALUES ($1, $2, $3, $4) RETURNING *;`
    res.redirect('/')
    return pool.query(sqlQuery, values).then((res) => console.log(res.rows[0]));
  } else {
    res.send("You're already registered, please log-in")
  }

});

app.get('/checkout', (req, res) => {
  res.render("checkout");
});

//ROUTES ABOVE PROBABLY NEED TO BE MOVED

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
