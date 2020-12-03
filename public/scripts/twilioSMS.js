const accountSid = 'AC32c900fca67e78da0d8065c48f1b90b8'; // Your Account SID from www.twilio.com/console
const authToken = '3ef125be26316759315f25bcd4754902';   // Your Auth Token from www.twilio.com/console
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

$(document).ready(function () {
  $("myBtn").on("click", function (event) {
    console.log("BUTTON CLICKED")
    client.messages
  .create({
     body: 'Hi user.name, Burgers-R-Us here! We received your order and you can come pick it up in 20min. See you soon!',
     from: '+14052419824',
     to: '+1514-531-4732'
   })
  .then(message => console.log(message.sid));
  })
});
