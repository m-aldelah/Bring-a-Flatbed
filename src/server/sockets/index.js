const mongoose = require("mongoose");
const { io } = require("socket.io-client");
//defining models
const User = mongoose.model("User");
const Listing = mongoose.model("Listing");

module.exports = function (io) {
  // socket io configs
  io.on("connection", (socket) => {
    socket.on("watch-listing", ({ listingId }) => {
      let filter = [
        {
          $match: {
            "documentKey._id": mongoose.Types.ObjectId(listingId),
          },
        },
      ];
      Listing.watch(filter).on("change", (data) => {
        io.emit(`change:${listingId}`);
      });
    });
  });
};
