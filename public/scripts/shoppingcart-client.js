// Shopping Cart
// Linked to index.ejs
// Linked to checkout.ejs

// jQuery
$(document).ready(function() {
  console.log("DOM ready, (shopping cart)");
  let cart = []


  // Counter for the shopping cart icon and testing purposes
  const clickTesting = function() {
    let counter = 0;

    $('.add-cart').click(function() {
      console.log('added to cart');
      counter++;
      $('.cart-count').html(counter);
      $(this).parent().css("background-color", "pink");
    })
  };

  // Gets the elements for the DOM on click
  const addToCartClick = function() {

    $('.add-cart').click(function() {
      const buttonDiv = $(this).parent();
      let title = buttonDiv.find(".item-title").html();
      let price = buttonDiv.find(".item-price").html();
      let description = buttonDiv.find(".item-description").html();

      addItemToCart(title, price, description);
    })
  };


  const addItemToCart = function(title, price, description) {

    cart.push({ title, price, description })
    localStorage.setItem('cart', JSON.stringify(cart))
    let cartItemHTML =
      `<div id="order-item">
  <div class="remove-item">
    <button class="detele-btn" type="button" name="delete"><i class="far fa-trash-alt fa-2x"></i></button>
  </div>
  <div class="item-img">
    <img src="./docs/burger1.png" style="width:150px;height:150px">
  </div>
  <div class="item-details">
    <a class="cart-item-name">${title}
      <!-- reference to the item chosen -->
    </a>
    <div class="quantity">
      <button class="plus-btn" type="button" name="button">
        <i class="fas fa-plus"></i>
      </button>

      <input class="number-item" type="number" name="number" value="1">
      <button class="minus-btn" type="button" name="button">
        <i class="fas fa-minus"></i>
      </button>
      <span class="cart-total-price">${price}</span>

    </div>
  </div>
</div>`

    let foodItemElement = $('#menu').append(cartItemHTML);
    console.log('appended to checkout loaded');
    return foodItemElement;
  }

  addToCartClick();
  clickTesting();

});
