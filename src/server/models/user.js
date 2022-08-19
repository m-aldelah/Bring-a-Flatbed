const mongoose = require("mongoose");

/*
 * first & last name -> string
 * username -> string & unique
 * phone# -> phone number
 * email -> string & unique
 * bidingHistory -> object of listings and time stamp
 * profile image -> string reference to s3 bucket
 * lisitngs -> object of all listing IDs
 * type  -> string (changed to isModerator-> Boolean)
 * address -> string
 *
 * associations :
 * 1. creates lisitng
 * 2. adds vehicle
 */

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  listings: {
    type: Array,
    default: null,
  },
  isModerator: {
    type: Boolean,
    default: false,
  },
  bidHistory: {
    type: Array,
    default: [],
  },
  pushToken: {
    type: String,
  },
  customerId: {
    type: String,
    default: null,
  },
  notifications: [
    {
      title: {
        type: String,
      },
      body: {
        type: String,
      },
    },
  ],
});

mongoose.model("User", userSchema);
