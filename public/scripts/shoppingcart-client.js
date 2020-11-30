// Shopping Cart
// Linked to index

// jQuery
$(document).ready(function() {
  console.log("DOM ready, (shopping cart)");

  clickTesting();



});

const clickTesting = function() {
  let counter = 0;

  $('.add-cart').click(function() {
    console.log('added to cart');
    counter++;
    $('#cart-counter').html(counter);
  })
};

