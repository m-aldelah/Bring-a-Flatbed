require("dotenv").config({ path: "./.env" });
secret_key = process.env.STRIPE_API_SECRET_KEY;
const axios = require("axios");

const ChargePaymentAuctionended = async (seller, bidder) => {
    let result = null;
  const headers = {
    Authorization:
      secret_key,
    "Content-Type": "application/json",
  };
  const SellerPayment = await axios
    .post(`https://api.stripe.com/v1/payment_intents?amount=100&currency=usd&customer=${seller.customerId}&confirm=true`, {}, { headers })
    .then((response) => {
      result = response.data;
    })
    .catch((error) => {
      result = error;
    });

      const BidderPayment = await axios
        .post(`https://api.stripe.com/v1/payment_intents?amount=100&currency=usd&customer=${bidder.customerId}&confirm=true`, {}, { headers })
        .then((response) => {
          result = response.data;
        })
        .catch((error) => {
          result = error;
        });
  return result;
};
module.exports = ChargePaymentAuctionended;
