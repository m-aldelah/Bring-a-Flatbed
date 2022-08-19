const mongoose = require("mongoose");
const Listing = mongoose.model("Listing");
const User = mongoose.model("User");

const updateManyQueryListings = async () => {
  await Listing.updateMany({ status: "expired" }, { status: "approved" });
  console.log("hi");
};
module.exports = updateManyQueryListings;
