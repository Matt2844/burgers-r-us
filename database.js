// const properties = require("./json/properties.json");
// const users = require("./json/users.json");
const { Pool } = require("pg");
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);

/// Users

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm",
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const values = [email];

  const sqlQuery = ` SELECT *
  FROM users
  WHERE email = $1
  ; `;

  return pool.query(sqlQuery, values).then((res) => {
    if (res.rows[0] === undefined) {
      console.log(null)
      return null;
    }
    console.log(res.rows[0])
    return res.rows[0];
  });
};

const userLogin = function (email, password) {
  const values = [email];

  const sqlQuery = ` SELECT *
  FROM users
  WHERE email = $1 AND WHERE password = $2
  ; `;

  return pool.query(sqlQuery, values).then((res) => {
    if (res.rows[0] === undefined) {
      console.log(null)
      return null;
    }
    console.log(res.rows[0])
    return res.rows[0];
  });
};

module.exports = getUserWithEmail
