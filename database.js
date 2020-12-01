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


const productsObj = [
  {
    name: 'Nachos',
    picture: './docs/nachos.jpg',
    description: 'Homemade cheese sauce, salsa, jalapeños.',
    price: 11.95,
    category: 'Appetizers'
  },
  {
    name: 'Chili Nachos',
    picture: './docs/nachos_chili.jpg',
    description: 'Homemade beef chili, jalapeños, homemade cheese sauce, salsa.',
    price: 13.95,
    category: 'Appetizers'
  },
  {
    name: 'Cheese Sticks',
    picture: './docs/cheese_stick.jpg',
    description: 'Mozzarella cheese sticks. Served with marinara sauce',
    price: 9.95,
    category: 'Appetizers'
  },
  {
    name: 'Fried Pickles',
    picture: './docs/fried_pickles.jpg',
    description: 'Served with chipotle Sriracha dip',
    price: 7.95,
    category: 'Appetizers'
  },
  {
    name: 'Cheese Burger',
    picture: './docs/burger2.jpg',
    description: 'Classic Cheese Burger served on homemade buns',
    price: 13.95,
    category: 'Burgers'
  },
  {
    name: 'Poutine Burger',
    picture: './docs/Burger_poutine.jpg',
    description: 'Undecided between a poutine and a burger? Why not both stacked together?',
    price: 17.95,
    category: 'Burgers'
  },
  {
    name: 'Burger Rocket',
    picture: './docs/Burger_Rocket.jpg',
    description: 'Fried Onion rings, bacon, monterey jack, pickles and lettuce. This will take you to the moon!',
    price: 19.95,
    category: 'Burgers'
  },
  {
    name: 'Sammy Ds',
    picture: './docs/Burger_SammyD.jpg',
    description: 'Homemade beef chili, cheddar, tortilla chips. Not sure who Sammy was but he sure made a damn great burger!',
    price: 18.95,
    category: 'Burgers'
  },
  {
    name: 'Barnyard',
    picture: './docs/Burger_Banyard',
    description: 'Smoky BBQ sauce, bacon, blue cheese, caramelized onions. This is what love taste like',
    price: 20.95,
    category: 'Burgers'
  },
  {
    name: 'Cowboy',
    picture: './docs/Burger_Cowboy.jpg',
    description: 'Bacon, mushrooms, caramelized onions, smoky BBQ sauce, cheddar and Monterey Jack. Also served without mushrooms for people with working taste buds',
    price: 20.95,
    category: 'Burgers'
  },
  {
    name: 'Burger Tower',
    picture: './docs/Burger_Tower.jpg',
    description: '6 quarter-pound beef patties, bacon, 3 slices of Monterey Jack & cheddar because screw that diet!',
    price: 32.95,
    category: 'Burgers'
  },
  {
    name: 'Porky',
    picture: './docs/Burger_PorkyPig.jpg',
    description: 'Pulled pork, bacon, ham, Monterey Jack, smoky BBQ sauce. Try not to think of that adorable looney tunes Character while you eat this you psycho!',
    price: 20.95,
    category: 'Burgers'
  },
  {
    name: 'Southern comfort',
    picture: './docs/Burger_Southern.jpg',
    description: 'Crispy fried chicken, candied bacon, Monterey Jack cheese, maple mayonnaise. Served between two waffles. Your judgment means nothing to us.',
    price: 19.95,
    category: 'Burgers'
  },
  {
    name: 'Mac and Cheese',
    picture: './docs/Mac_Hotdog-mac.jpg',
    description: 'The classic you know and love. Ask for extra cheese, we wont judge',
    price: 9.95,
    category: 'Classics'
  },
  {
    name: 'Poutine',
    picture: './docs/Poutine_Regular.jpg',
    description: 'fries, cheese curds and gravy. Can only be ordered in French',
    price: 9.95,
    category: 'Classics'
  },
  {
    name: 'Smoked meat poutine',
    picture: './docs/Poutine_SmokedMeat.jpg',
    description: 'Pulled smoked meat on a classic poutine. Nuff said',
    price: 13.95,
    category: 'Classics'
  },
  {
    name: 'Cheesy Dog',
    picture: './docs/Mac_Hotdog-mac.jpg',
    description: 'Mac N Cheese topped with baked mozzarella. You know you want two of these',
    price: 11.95,
    category: 'Classics'
  },
  {
    name: 'Chicken Sub',
    picture: './docs/Sandwich-Chicken.jpg',
    description: 'Grilled chicken, mushrooms, green peppers, caramelized onions topped with aged Mozzarella (Legal age).',
    price: 15.95,
    category: 'Classics'
  },
  {
    name: 'Heineken',
    picture: 'undefinedURL',
    description: 'Refreshing pale beer. Served in a coffee cup to anyone ordering before noon',
    price: 6.95,
    category: 'Beverages'
  },
  {
    name: 'Pabs Blue Ribbon',
    picture: 'undefinedURL',
    description: 'American Lager. Buy two and get a free beanie',
    price: 6.95,
    category: 'Beverages'
  },
  {
    name: 'Sodas',
    picture: 'undefinedURL',
    description: 'All the sodas, none of the diet options',
    price: 2.95,
    category: 'Beverages'
  }
]

/// ONLY USED TO AVOID MANUALLY CREATING THE PRODUCTS ARRAY OF OBJECT
const makeObject = function() {
  let arrayObj = []
  let sqlQuery = 'SELECT * FROM products;'

  return pool.query(sqlQuery, []).then((res) => {
    for (let row of res.rows) {
      arrayObj.push({
        name: row.name,
        picture: row.picture,
        description: row.description,
        price: row.price,
        category: row.category
      })
    }
    return arrayObj
  })

}

const createProductHtml = function(obj) {
  let productLine = `
  <div class="item">
  <div class="item-img">
    <img class="product-img" src="${obj.picture}" style="width:150px;height:150px">
  </div>
  <div class="detail">
    <div class="item-header">
      <h3 class="item-title">${obj.name}</h3>
      <span class="item-dot"></span>
      <span class="item-price">${obj.price}</span>
    </div>
    <p class="item-description">${obj.description}</p>
    <button class="add-cart">Add to cart</button>
  </div>
</div>`;

  return productLine;
};

// makeObject()

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  console.log("Email being received", email)
  const values = [email];

  const sqlQuery = ` SELECT *
  FROM users
  WHERE email = $1
  ; `;

  return pool.query(sqlQuery, values).then((res) => {
    // console.log("Length VALUE", res.rows.length)
    if (res.rows.length === 0) {
      // console.log(null)
      return null;
    }
    // console.log(res.rows[0])
    return res.rows[0];
  });
};

const getUserWithId = (ID) => {
  const values = [ID];
  const sqlQuery = `SELECT * FROM users WHERE id = $1`

  return pool.query(sqlQuery, values).then((res)=>{
    if (res.rows.length === 0) {
      console.log("IN length check=", res.rows[0])
      return null
    } else {
      console.log("Final state=", res.rows[0])
      return res.rows[0];
    }
  })
}

module.exports = {
  getUserWithEmail,
  makeObject,
  createProductHtml,
  getUserWithId,
  productsObj
}
