const axios = require("axios");

const sendEmailsAuctionResult = async (seller, bidder, listing) => {
  if (!seller || !bidder) return;
  const body = {
    seller_email: seller.email,
    bidder_email: bidder.email,
    name: seller.firstName,
    listing_title: listing.title,
  };
  const body2 = {
    seller_email: seller.email,
    bidder_email: bidder.email,
    name: seller.name,
    listing_title: listing.title,
  };
  const req = await axios
    .post("http://localhost:3000/seller_confirmation_email", body)
    .then((response) => {})
    .catch((error) => {
      console.log(error);
    });
  const req2 = await axios
    .post("http://localhost:3000/bidder_confirmation_email", body2)
    .then((response) => {})
    .catch((error) => {
      console.log(error);
    });
};

module.exports = sendEmailsAuctionResult;
