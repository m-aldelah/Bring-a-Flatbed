const mongoose = require("mongoose");
const Listing = mongoose.model("Listing");
const User = mongoose.model("User");
const sendEmailsAuctionResult = require("../notifications/sendEmailsAuctionResult");
const ChargePaymentAuctionended = require("../notifications/ChargePaymentAuctionended");

const watchForExpired = () => {
  let interval = setInterval(async () => {
    let dateBeforeSevenDays = new Date();
    dateBeforeSevenDays.setDate(dateBeforeSevenDays.getDate() - 7);

    const listings = await Listing.find({
      $and: [
        {
          creationTime: { $lte: dateBeforeSevenDays },
        },
        {
          status: "approved",
        },
      ],
    });

    if (listings.length <= 0) return;

    const updateQuery = await Listing.updateMany(
      { _id: { $in: listings.map(({ _id }) => _id) } },
      { $set: { status: "expired" } },
      { multi: true }
    );

    auctionWining(listings);

    //notify seller
    listings.forEach(async (listing) => {
      await User.findByIdAndUpdate(listing.seller.id, {
        $push: {
          notifications: {
            title: `${listing.title}`,
            body: `Your listing for ${listing.title} has expired`,
          },
        },
      });

      //notify winner
      await User.findByIdAndUpdate(
        listing.bids[listing.bids.length - 1].bidderId,
        {
          $push: {
            notifications: {
              title: `You Won!`,
              body: `You won the ${listing.title}`,
            },
          },
        }
      );

      //notify watchers
      if (listing.usersWatching?.length > 0) {
        await User.updateMany(
          {
            _id: { $in: listing.usersWatching.map(({ userId }) => userId) },
          },
          {
            $push: {
              notifications: {
                title: `${listing.title}`,
                body: `A listing you are watching has expired`,
              },
            },
          }
        );
      }
    });
  }, 6000);
};

/* utility functions */

const getUserFromId = async (userId) => {
  const userObject = await User.findById(userId);

  return await userObject;
};

const auctionWining = (listings) => {
  console.log("checking for winner");
  listings.forEach(async (listing) => {
    if (listing.bids.length === 0) {
      return;
    }

    let minimumPrice = listing?.minimumPrice;
    minimumPrice ? minimumPrice : 0;

    if (listing.bids[listing.bids.length - 1].bid >= minimumPrice) {
      //if highest bid is larger than minimum price
      let seller = await getUserFromId(listing.seller.id);
      let buyer = await getUserFromId(
        listing.bids[listing.bids.length - 1].bidderId
      );

      //notify seller and bidder
      sendEmailsAuctionResult(seller, buyer, listing);
      ChargePaymentAuctionended(seller, buyer);
    } //{ if highest bid doesn't meet minimum price
    else {
      console.log("there is no winner");
    }
  });
};
module.exports = watchForExpired;
