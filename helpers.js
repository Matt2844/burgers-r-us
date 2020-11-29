
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm",
});


module.exports = (pool) => {

  // find a user with his/her email for login and register to see if email already in db
  // const getUserWithEmail = function(email) {
  //   const values = [email];

  //   let sqlQuery = `
  //   SELECT *
  //   FROM users
  //   WHERE email = $1;`
  //   return pool.query(sqlQuery, values).then((res) => console.log(res.rows))

  //   // return db.query(`
  //   // SELECT *
  //   // FROM users
  //   // WHERE email = $1
  //   // `, [email])
  //   // .then(res => res.rows[0])
  //   // .catch((err => console.error('query error', err.stack)));

  // }

  getUserWithEmail('Kiramz@mail.com')
  getUserWithEmail('bloooby@mail.com')
  exports.getUserWithEmail = getUserWithEmail;


  // find user with his/her id (probably for the checkout to know the phone number)
  const getUserWithId = function(id) {
    return db.query(`
    SELECT *
    FROM users
    WHERE id = $1
    `, [id])
    .then(res => res.rows[0])
    .catch((err => console.error('query error', err.stack)));
  }

  exports.getUserWithId = getUserWithId;

  //// FEW VALUES HARDCODED BUT WILL HAVE TO REFACTOR POST REGISTR ROUTE TO USE THIS AND PASS IT A USER OBJECT
  // add user to database when Register
  const addUser =  function(user) {
    return db.query(`
    INSERT INTO users (name, phone_number, email, password)
    VALUES ('ThatDude', '111-111-1111', $1, $2) RETURNING *;`,
    [user.name, user.phone_number, user.email, user.password])
    .then(res => res.row[0])
    .catch((err => console.error('query error', err.stack)));
    }

  exports.addUser = addUser;


  // get one menu item to show in shopping cart
  const getMenuItem = function(id) {
    return db.query(`
    SELECT name, picture, price
    FROM products
    WHERE id = $1
    `, [id])
    .then(res => res.rows[0])
    .catch((err => console.error('query error', err.stack)))
  }

  exports.getMenuItem = getMenuItem;






}

