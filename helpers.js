module.exports = (db) => {

  // find a user with his/her email for login and register to see if email already in db
  const getUserWithEmail = function(email) {
    return db.query(`
    SELECT *
    FROM users
    WHERE email = $1
    `, [email])
    .then(res => res.rows[0])
    .catch((err => console.error('query error', err.stack)));
  }

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


  // add user to database when Register
  const addUser =  function(user) {
    return db.query(`
    INSERT INTO users (name, phone_number, email, password)
    VALUES ($1, $2, $3, $4) RETURNING *;`,
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
