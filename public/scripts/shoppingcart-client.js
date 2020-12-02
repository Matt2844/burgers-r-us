// Shopping Cart
// Linked to index.ejs
// Linked to checkout.ejs

// jQuery
$(document).ready(function() {
  console.log("DOM ready, (shopping cart)");
  let cart = []


  // Changes the food item title to pink and mostly for testing purposes
  const clickTesting = function() {

    $('.add-cart').click(function() {
      console.log('added to cart');
      const buttonDiv = $(this).parent();
      let title = buttonDiv.find(".item-title");
      let colorfulTitle = title.css("color", "pink");
      colorfulTitle;
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
  }

  addToCartClick();
  clickTesting();

});
