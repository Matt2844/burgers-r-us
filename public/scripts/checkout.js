const { Pool } = require("pg")

const properties = require('./json/properties.json');
const users = require('./json/users.json');
const pool = require('./index');


$(document).ready(function() {


  // STEP 1: when user click on Add to cart, the item is added to orders database
  $('#add-cart').click(addItemToCart)


  // STEP 2: add choosen item to the orders database
  const addItemToCart = function(product) {
    return pool.query(`
    INSERT INTO orders (name, price, picture, description)
    VALUES ($1 $2 $3 $4) RETURNING *`,
    [product.name, product.price, product.picture, product.description])
   .then(res => res.row[0])
  }

  exports.addItemToCart = addItemToCart;







  // checkout page :


  // STEP 3: For every item in the order database, we create a new element to render on the checkout page
  const renderOrderedItem = function(items) {
    for (let item of items) {
      const itemOrdered = createItemElement(item)
      $('#order-item').append(itemOrdered)
    }
  }

  exports.renderOrderedItem = renderOrderedItem;



  // create a new element for every item in the order database
  const createItemElement = function(item) {
      let itemElm = `
      <div id="order-item">
      <div class="remove-item">
        <button class="detele-btn" type="button" name="delete"><i class="far fa-trash-alt fa-2x"></i></button>
      </div>
      <div class="item-img">
        <img src="${item.picture}">
      </div>
      <div class="item-details">
        <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="${item.description}">
        ${item.name}
        </button>
        <div class="quantity">
          <button class="plus-btn" type="button" name="button">
            <i class="fas fa-plus"></i>
          </button>

          <input class="number-item" type="number" name="number" value="1">
          <button class="minus-btn" type="button" name="button">
            <i class="fas fa-minus"></i>
          </button>
          <span class="cart-total-price">${item.price}</span>
          </div>
        </div>
      </div>
    </div>`
    return itemElm;
  }

});
