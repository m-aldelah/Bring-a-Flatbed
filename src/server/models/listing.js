const mongoose = require("mongoose");

/**
 * title -> string
 * price -> Decimal128
 * driverLicense -> string (contains the licenes number)
 * duration -> Number (of days)
 * creationTime -> Date
 * status -> string
 * images -> Array (of strings containg reference to the bucket)
 *
 *
 * Associations
 * 1. has comments
 * 2. has a vehicle
 */

const lisitngSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  carTitle: {
    type: Array,
  },
  driverLicense: {
    type: Array,
  },
  duration: {
    type: Number,
  },
  creationTime: {
    type: Date,
    default: new Date().getTime(),
  },
  status: {
    type: String,
    default: "pending",
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  images: {
    type: Array,
  },
  model: {
    type: String,
  },
  make: {
    type: String,
  },
  year: {
    type: String,
  },
  features: {
    type: String,
  },
  description: {
    type: String,
  },
  VIN: {
    type: String,
  },
  minimumPrice: {
    type: Number,
    default: 0,
  },
  bids: {
    type: Array,
  },
  seller: {
    id: {
      type: mongoose.ObjectId,
    },
    username: {
      type: String,
    },
    pushToken: {
      type: String,
    },
  },
  usersWatching: {
    type: Array,
  },
  comments: [
    {
      authorId: {
        type: mongoose.ObjectId,
        required: true,
      },
      authorUsername: {
        type: String,
      },
      authorprofileImage: {
        type: String,
      },
      content: {
        type: String,
        required: true,
      },

      replies: [
        {
          authorId: {
            type: mongoose.ObjectId,
            required: true,
          },
          authorUsername: {
            type: String,
          },
          authorprofileImage: {
            type: String,
          },
          content: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

mongoose.model("Listing", lisitngSchema);
