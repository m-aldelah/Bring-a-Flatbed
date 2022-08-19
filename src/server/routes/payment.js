//module imports
const express = require("express");
const mongoose = require("mongoose");
const stripe = require("stripe")(
  "sk_test_51KgKoDATyxdufmsVWq6wK55BdOSSnoybTBCgWud9WTasKiQxExmFtdPLusJpgtTSacUfwkXv0qfmKZFNPut058Nj0015P6rxXi"
);
//router definition
const router = express.Router();

//defining models
const User = mongoose.model("User");
const Listing = mongoose.model("Listing");

//handle requests

router.post("/create-payment-intent", async (req, res) => {
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 199,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = router;
