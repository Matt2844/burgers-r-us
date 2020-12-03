require('dotenv').config();
const accountSid = process.env.Twilio_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.Twilio_token;  // Your Auth Token from www.twilio.com/console
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const textNotification = function(app) {
  app.post("/order", function({body}, res) {
    client.messages.create({
     body: 'Hi Ariel, Burgers-R-Us here! We received your order and you can come pick it up in 20min. See you soon!',
     from: '+14052419824',
     to: '+1514-531-4732'
   }).then(message => console.log(message.sid));
  });
};

module.exports = textNotification;
