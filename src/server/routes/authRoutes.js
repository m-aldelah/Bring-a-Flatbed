//module imports
require("dotenv").config({ path: "./.env" });

secret_key = process.env.STRIPE_API_SECRET_KEY;

const express = require("express");
const axios = require("axios");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//router definition
const router = express.Router();

//defining models
const User = mongoose.model("User");
const Listing = mongoose.model("Listing");

//contact form nodemailer
var nodemailer = require("nodemailer");

router.post("/getCusId", async (req, res) => {
  const tt = await User.findById(req.body.id).exec();
  if (tt.customerId !== null) {
    res.send(tt.customerId);
  } else {
    res.send("null");
  }
});
router.post("/checkUserHisbidForCar", async (req, res) => {
  const tt = await Listing.findById(req.body.LisId).exec();
  var result = "";
  const isObjectPresent = tt.bids.find((o) => o.bidderId === req.body.userID);
  if (isObjectPresent) {
    result = "found";
  } else if (!isObjectPresent) {
    result = "Not Found";
  }
  res.send(result);
});
///////////////////////////////////////////////
router.post("/payment", async (req, res) => {
  const cardNumber = req.body.number;
  const cvc = req.body.cvs;
  const exp = req.body.expiry;

  const customer = await CreateStripeCustomer();
  const customerID = customer.id;
  const token = await CreateToken(cardNumber, cvc, exp);
  const tokenID = token.id;
  if (token !== "Error") {
    const card = await CreateCard(customerID, tokenID);
    const cardID = card.id;
    const initial_payment =await CheckInitialPayment(customerID);
    if (initial_payment.status === "succeeded"){
      const refund = await refundInitialPayment(initial_payment.id);
      const setUpIndent = await CreateSetupIntent(customerID, cardID);
      await SaveCustomerID(customerID, req.body.userId);
      res.send(setUpIndent);
    }
    else{
      res.send("Error");
    }
  
  } else {
    res.send("Error");
  }

  //const setUpIndentID = setUpIndent.id;
});
async function CreateStripeCustomer() {
  let result = null;
  const headers = {
    Authorization: secret_key,
    "Content-Type": "application/json",
  };
  const req = await axios
    .post("https://api.stripe.com/v1/customers", {}, { headers })
    .then((response) => {
      result = response.data;
    })
    .catch((error) => {
      result = error;
    });
  return result;
}
async function CreateToken(cardNumber, cvc, exp) {
  let result = null;
  const exp_month = parseInt(exp.slice(0, 2));
  const exp_year = parseInt(exp.slice(3, 6));
  const headers = {
    Authorization: secret_key,
    "Content-Type": "application/json",
  };
  const url = `https://api.stripe.com/v1/tokens?card[number]=${cardNumber}&card[exp_month]=${exp_month}&card[exp_year]=20${exp_year}&card[cvc]=${cvc}`;
  const req = await axios
    .post(url, {}, { headers })
    .then((response) => {
      result = response.data;
    })
    .catch((error) => {
      result = "Error";
      //result = error;
    });

  return result;
}
async function CreateCard(customerID, tokenID) {
  let result = null;
  const headers = {
    Authorization: secret_key,
    "Content-Type": "application/json",
  };

  const url = `https://api.stripe.com/v1/customers/${customerID}/sources?source=${tokenID}`;
  const req = await axios
    .post(url, {}, { headers })
    .then((response) => {
      result = response.data;
    })
    .catch((error) => {
      result = error;
    });
  return result;
}
async function CheckInitialPayment(customerID) {
  let result = null;
  const headers = {
    Authorization: secret_key,
    "Content-Type": "application/json",
  };
  const req = await axios
    .post(`https://api.stripe.com/v1/payment_intents?amount=50&currency=usd&customer=${customerID}&confirm=true`, {}, { headers })
    .then((response) => {
      result = response.data;
    })
    .catch((error) => {
      result = error;
    });
    
  return result;
}
async function refundInitialPayment(payment_intent) {
  let result = null;
  const headers = {
    Authorization: secret_key,
    "Content-Type": "application/json",
  };
  const req = await axios
    .post(`https://api.stripe.com/v1/refunds?payment_intent=${payment_intent}`, {}, { headers })
    .then((response) => {
      result = response.data;
    })
    .catch((error) => {
      result = error;
    });
  return result;
}


async function CreateSetupIntent(customerID, cardID) {
  let result = null;
  const headers = {
    Authorization: secret_key,
    "Content-Type": "application/json",
  };

  const url = `https://api.stripe.com/v1/setup_intents?customer=${customerID}&payment_method=${cardID}&confirm=${true}`;
  const req = await axios
    .post(url, {}, { headers })
    .then((response) => {
      result = response.data;
    })
    .catch((error) => {
      result = error;
    });
  return result;
}

async function SaveCustomerID(customerID, userId) {
  try {
    await User.findByIdAndUpdate(userId, {
      customerId: customerID,
    });
  } catch (e) {
    console.log("error" + e);
  }
}
///////////////////////////////////////////////

//handle requests
router.post("/new_user", async (req, res) => {
  var {
    email,
    password,
    firstName,
    lastName,
    username,
    phoneNumber,
    address,
    profileImage,
    city,
    state,
  } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  password = hashedPass;

  try {
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      username,
      phoneNumber,
      address,
      profileImage,
      city,
      state,
    });

    await user.save();

    res.send(user);
    sendEmail(firstName, lastName, email);
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

function sendEmail(firstName, lastName, email) {
  var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bringaflatbed@gmail.com",
      pass: "bringaflatbedbringaflatbed",
    },
  });

  const output = `<div style="background-color: #69876f; border-radius: 25px;">
  <div  style=" height: 50px; font-family: Verdana;">
  <h2 style="color:white; text-align: center; line-height: 50px;"> Bring a Flatbed Inquiry </h2>
  </div>
  <br>
  <div style="border-style: solid; border-color: #69876f; border-radius: 25px; padding-left: 20px; background-color: white">
    <p style="font-family: Verdana;">Hello ${firstName}, <br><br>You recently created a Bring a Flatbed account. If you did not
     create an account using the email: ${email}, please contact <u>bringaflatbed@gmail.com</u> as soon as possible. </p>


      <p style="font-family: Verdana;"> Thank you for choosing Bring a Flatbed <br> The Bring a Flatbed Team</p>

  </div>

  </div>
  `;

  var mailOptions = {
    from: "bringaflatbed@gmail.com",
    to: email,
    bcc: "bringaflatbed@gmail.com",
    subject: "Bring a Flatbed - Sign Up Confirmation",
    text: `Hi ${firstName}`,
    html: output,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email was sent");
      // res.send("email was sent");
    }
  });
}

router.post("/sign_in", async (req, res) => {
  let { email, password } = await req.body;
  try {
    await User.findOne(
      { email: new RegExp(`^${email}$`, "i") },
      (err, user) => {
        if (err) {
          return res.send(err);
        } else if (!user) {
          return res.send(false);
        } else {
          if (bcrypt.compareSync(password, user.password)) {
            res.send(user);
          } else {
            res.send(false);
          }
        }
      }
    )
      .clone()
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    return res.send(e.message);
  }
});

router.post("/get_user_by_id", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    res.send(user);
  } catch (e) {
    return res.status(422).send(e.message);
  }
});

router.post("/contact_form", async (req, res) => {
  const { email, name, message } = req.body;

  var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bringaflatbed@gmail.com",
      pass: "bringaflatbedbringaflatbed",
    },
  });

  const output = `<div style="background-color: #69876f; border-radius: 25px;">
  <div  style=" height: 50px; font-family: Verdana;">
  <h2 style="color:white; text-align: center; line-height: 50px;"> Bring a Flatbed Inquiry </h2>
  </div>
  <br>
  <div style="border-style: solid; border-color: #69876f; border-radius: 25px; padding-left: 20px; background-color: white">
    <p style="font-family: Verdana;">Hello ${name}, <br><br>You recently filled out our contact form to reach a team member:</p>
      <ul style="font-family: Verdana;">
      <li> "${message}"</li>
      </ul>

      <p style="font-family: Verdana;"> A team member will reach out to you as soon as possible regarding your inquiry. </p>

      <p style="font-family: Verdana;"> Thank you for choosing Bring a Flatbed <br> The Bring a Flatbed Team</p>

  </div>

  </div>
  `;

  var mailOptions = {
    from: "bringaflatbed@gmail.com",
    to: email,
    bcc: "bringaflatbed@gmail.com",
    subject: "Bring a Flatbed - Inquiry",
    text: `Hi ${name}, you recently filled out our contact form: ${message}. Someone will reach out to you as soon as possible. Thank you for choosing Bring a Flatbed The Bring a Flatbed Team`,
    html: output,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.send("email was sent");
    }
  });
});

/*                 Auction ends and it's sold               */

/* Send email to the seller */
router.post("/seller_confirmation_email", async (req, res) => {
  if (!req) {
    return res.send("request body is empty");
  }
  const { seller_email, bidder_email, name, listing_title } = req.body;

  var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bringaflatbed@gmail.com",
      pass: "bringaflatbedbringaflatbed",
    },
  });

  const output = `<div style="background-color: #69876f; border-radius: 25px;">
  <div  style=" height: 50px; font-family: Verdana;">
  <h2 style="color:white; text-align: center; line-height: 50px;"> Bring a Flatbed Listing Sold </h2>
  </div>
  <br>
  <div style="border-style: solid; border-color: #69876f; border-radius: 25px; padding-left: 20px; background-color: white">
    <p style="font-family: Verdana;">Hello ${name}, <br><br></p>

    <p style="font-family: Verdana;">You sold  the ${listing_title} auction listing! </p> <br>
    <h3 style="font-family: Verdana;">Whats Next?</h3>
    <ul style="font-family: Verdana;">
        <li>Your saved payment method will be charged a $100.00 flat service fee.</li>
        <li>You can reach the winner of this auction at ${bidder_email}. The winner has also been notified with your email address.</li>
        <li>Contact the winner.</li>
        <li>For any questions or concerns, please contact bringaflatbed@gmail.com</li>
        
    </ul> <br>
    
    <h3 style="font-family: Verdana;">${listing_title} Payment Confirmation</h3>
    <p style="font-family: Verdana;">Bring a Flatbed Service Fee: &nbsp;&nbsp;&nbsp;&nbsp;$100.00 <br> Total Charged:&nbsp;&nbsp;&nbsp;&nbsp;<u>$100.00</u></p>
    <br>
    <i style="font-family: Verdana;">Bring a Flatbed is not responsible for any transactions outside the app.</i>

    <p style="font-family: Verdana;"> Thank you for choosing Bring a Flatbed <br> The Bring a Flatbed Team</p>

  </div>

  </div>
  `;

  var mailOptions = {
    from: "bringaflatbed@gmail.com",
    to: seller_email,
    subject: "Bring a Flatbed - Listing Sold!",
    text: `Hello ${name}, You sold  the ${listing_title} auction listing! Whats Next? Your saved payment method will be charged a $100.00 flat service fee.You can reach the winner of this auction at ${bidder_email}. The winner has also been notified with your email address. Contact the winner. For any questions or concerns, please contact bringaflatbed@gmail.com ${listing_title} Payment Confirmation Bring a Flatbed Service Fee: $100.00 Total Charged: $100.00 Bring a Flatbed is not responsible for any transactions outside the app. Thank you for choosing Bring a Flatbed. The Bring a Flatbed Team`,
    html: output,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.send("email was sent");
    }
  });
});

/* Send email to the bid winner */
router.post("/bidder_confirmation_email", async (req, res) => {
  if (!req) {
    return res.send("/request body is empty");
  }
  const { seller_email, bidder_email, name, listing_title } = req.body;

  var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bringaflatbed@gmail.com",
      pass: "bringaflatbedbringaflatbed",
    },
  });

  const output = `<div style="background-color: #69876f; border-radius: 25px;">
  <div  style=" height: 50px; font-family: Verdana;">
  <h2 style="color:white; text-align: center; line-height: 50px;"> Bring a Flatbed Listing Won </h2>
  </div>
  <br>
  <div style="border-style: solid; border-color: #69876f; border-radius: 25px; padding-left: 20px; background-color: white">
    <p style="font-family: Verdana;">Hello ${name}, <br><br></p>

    <p style="font-family: Verdana;">You won the ${listing_title} auction listing! </p> <br>
    <h3 style="font-family: Verdana;">Whats Next?</h3>
    <ul style="font-family: Verdana;">
        <li>Your saved payment method will be charged a $100.00 flat service fee.</li>
        <li>You can reach the seller of this auction at ${seller_email}. The seller has also been notified with your email address.</li>
        <li>Contact the seller.</li>
        <li>For any questions or concerns, please contact bringaflatbed@gmail.com</li>
        
    </ul> <br>
    
    <h3 style="font-family: Verdana;">${listing_title} Payment Confirmation</h3>
    <p style="font-family: Verdana;">Bring a Flatbed Service Fee: &nbsp;&nbsp;&nbsp;&nbsp;$100.00 <br> Total Charged:&nbsp;&nbsp;&nbsp;&nbsp;<u>$100.00</u></p>
    <br>
    <i style="font-family: Verdana;">Bring a Flatbed is not responsible for any transactions outside the app.</i>

    <p style="font-family: Verdana;"> Thank you for choosing Bring a Flatbed <br> The Bring a Flatbed Team</p>

  </div>

  </div>
  `;

  var mailOptions = {
    from: "bringaflatbed@gmail.com",
    to: bidder_email,
    subject: "Bring a Flatbed - Listing Won!",
    text: `Hello ${name}, You won  the ${listing_title} auction listing! Whats Next? Your saved payment method will be charged a $100.00 flat service fee.You can reach the seller of this auction at ${seller_email}. The seller has also been notified with your email address. Contact the seller. For any questions or concerns, please contact bringaflatbed@gmail.com ${listing_title} Payment Confirmation Bring a Flatbed Service Fee: $100.00 Total Charged: $100.00 Bring a Flatbed is not responsible for any transactions outside the app. Thank you for choosing Bring a Flatbed. The Bring a Flatbed Team`,
    html: output,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.send("email was sent");
    }
  });
});

/*                 Auction ends and it's not sold             */

router.post("/auction_timed_out_email", async (req, res) => {
  if (!req) {
    return res.send("request body is empty");
  }
  const { seller_email, name, listing_title } = req.body;

  var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bringaflatbed@gmail.com",
      pass: "bringaflatbedbringaflatbed",
    },
  });

  const output = `<div style="background-color: #69876f; border-radius: 25px;">
  <div  style=" height: 50px; font-family: Verdana;">
  <h2 style="color:white; text-align: center; line-height: 50px;"> Bring a Flatbed Auction Timed Out </h2>
  </div>
  <br>
  <div style="border-style: solid; border-color: #69876f; border-radius: 25px; padding-left: 20px; background-color: white">
    <p style="font-family: Verdana;">Hello ${name}, <br><br></p>

    <p style="font-family: Verdana;">Your ${listing_title} auction listing has expired.</p>

    <p style="font-family: Verdana;"> Thank you for choosing Bring a Flatbed <br> The Bring a Flatbed Team</p>

  </div>

  </div>
  `;

  var mailOptions = {
    from: "bringaflatbed@gmail.com",
    to: seller_email,
    subject: "Bring a Flatbed - Listing Auction Timed Out!",
    text: `Hi ${name}, Your ${listing_title} auction listing has expired. Thank you for choosing Bring a Flatbed The Bring a Flatbed Team`,
    html: output,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.send("email was sent");
    }
  });
});

/*                 Auction Created            */

router.post("/auction_created_email", async (req, res) => {
  if (!req) {
    return res.send("request body is empty");
  }
  const { seller_email, name, listing_title } = req.body;

  var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bringaflatbed@gmail.com",
      pass: "bringaflatbedbringaflatbed",
    },
  });

  const output = `<div style="background-color: #69876f; border-radius: 25px;">
  <div  style=" height: 50px; font-family: Verdana;">
  <h2 style="color:white; text-align: center; line-height: 50px;"> Bring a Flatbed Auction Created </h2>
  </div>
  <br>
  <div style="border-style: solid; border-color: #69876f; border-radius: 25px; padding-left: 20px; background-color: white">
    <p style="font-family: Verdana;">Hello ${name}, <br><br></p>

    <p style="font-family: Verdana;">Your <b>${listing_title}</b> auction listing has been created!</p>

    <p style="font-family: Verdana;"> Thank you for choosing Bring a Flatbed, <br> The Bring a Flatbed Team</p>

  </div>

  </div>
  `;

  var mailOptions = {
    from: "bringaflatbed@gmail.com",
    to: seller_email,
    subject: "Bring a Flatbed - Listing Auction Created!",
    text: `Hi ${name}, Your ${listing_title} auction listing has been created! Thank you for choosing Bring a Flatbed, The Bring a Flatbed Team`,
    html: output,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.send("email was sent");
    }
  });
});

router.post("/new_listing", async (req, res) => {
  if (!req) {
    return res.send("request body is empty");
  }
  const {
    title,
    make,
    model,
    year,
    VIN,
    price,
    features,
    description,
    driverLicense,
    images,
    duration,
    carTitle,
    seller,
    city,
    state,
    minimumPrice,
  } = req.body;

  try {
    const listing = new Listing({
      title,
      make,
      model,
      year,
      VIN,
      price,
      features,
      description,
      driverLicense,
      images,
      duration,
      carTitle,
      seller,
      city,
      state,
      minimumPrice,
    });
    await listing.save();
    return res.send("listing created");
  } catch (e) {
    return res.send(e);
  }
});

router.post("/new_comment", async (req, res) => {
  const { authorId, listingId, content, authorUsername, authorprofileImage } =
    req.body;

  try {
    const listing = await Listing.findByIdAndUpdate(listingId, {
      $push: {
        comments: { authorId, content, authorUsername, authorprofileImage },
      },
    });

    res.send("done");
  } catch (err) {
    return res.status(422).send(err.message);
  }
});
router.post("/delete_comment", async (req, res) => {
  const { listingId, commentId } = req.body;

  try {
    const listing = await Listing.findById(listingId);
    console.log(listing.comments.pull({ _id: commentId }));

    await listing.save();
    res.send("done");
  } catch (err) {
    return res.status(422).send(err.message);
  }
});
router.post("/delete_reply", async (req, res) => {
  const { listingId, commentId, replyId } = req.body;

  try {
    const listing = await Listing.findById(listingId);
    console.log(listing.comments.id(commentId).replies.pull({ _id: replyId }));

    await listing.save();
    res.send("done");
  } catch (err) {
    return res.status(422).send(err.message);
  }
});
router.post("/new_reply", async (req, res) => {
  const {
    authorId,
    listingId,
    commentId,
    content,
    authorUsername,
    authorprofileImage,
  } = req.body;

  try {
    Listing.findById(listingId, async (err, listing) => {
      if (err) {
        return res.status(422).send(err.message);
      } else {
        listing.comments.id(commentId)?.replies.push({
          authorId,
          content,
          authorUsername,
          authorprofileImage,
        });

        await listing.save((e) => console.log(e));
        res.send(listing);
      }
    });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/retrieve_comments", async (req, res) => {
  const { listingId, limit = null } = req.body;

  try {
    const listing = await Listing.findById(listingId);

    if (listing && listing.comments != undefined) {
      if (limit) {
        res.send(listing.comments.slice(0, limit));
      } else {
        res.send(listing.comments.reverse());
      }
    } else {
      return null;
    }
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/new_vehicle", async (req, res) => {
  const { model, make, features, quirks, VIN } = req.body;

  try {
    const vehicle = new Vehicle({
      model,
      make,
      features,
      quirks,
      VIN,
    });

    await vehicle.save();
    res.send("done");
  } catch (err) {
    return res.status(422).send(err.message);
  }
});
router.post("/retrieve_MMY_Lists", async (req, res) => {
  var makeList = null;
  var madeList = null;
  var yearList = null;
  try {
    const makeList = await Listing.distinct("make");
    const madeList = await Listing.distinct("model");
    const yearList = await Listing.distinct("year");
    const descList = await Listing.distinct("description");
    res.send({ makeList, madeList, yearList, descList });
  } catch (e) {
    return res.status(422).send(e.message);
  }
});
router.post("/retrieve_listings", async (req, res) => {
  const { count, countSkip, filter } = req.body;
  count ? count : 20;
  countSkip ? countSkip : 1;
  filter ? filter : {};
  try {
    const listings = await Listing.find(filter)
      .sort({ creationTime: 1 })
      .limit(count)
      .skip(countSkip);

    res.send(listings);
  } catch (e) {
    return res.status(422).send(e.message);
  }
});
router.post("/update_listing_status", async (req, res) => {
  const { listingId, newStatus } = req.body;

  try {
    await Listing.findByIdAndUpdate(listingId, {
      status: newStatus,
      creationTime: new Date().getTime(),
    });

    return res.status(200).send("StatusUpdated");
  } catch (e) {
    return res.status(422).send(e.message);
  }
});
router.post("/delete_listing", async (req, res) => {
  const { listingId } = req.body;

  try {
    await Listing.findByIdAndDelete(listingId);

    return res.status(200).send("listing deleted");
  } catch (e) {
    return res.status(422).send(e.message);
  }
});

router.post("/bid_sniped", async (req, res) => {
  const { listingId, updatedTime } = req.body;
  try {
    await Listing.findByIdAndUpdate(listingId, {
      creationTime: updatedTime,
    });

    return res.status(200).send("5 minutes added to bid");
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/bid", async (req, res) => {
  const { listingId, userId, currentPrice, bidAmount } = req.body;
  let price =  bidAmount;

  try {
    const listing = await Listing.findByIdAndUpdate(
      listingId,
      {
        $push: { bids: { bidderId: userId, bid: price } },
        price: price,
      },
      async (err, listing) => {
        await User.findByIdAndUpdate(userId, {
          $push: { bidHistory: { listingId, bid: price } },
        });
        return res.status(200).send("bid submitted");
      }
    ).clone();
  } catch (e) {
    return res.status(422).send(e.message);
  }
});

router.post("/store_notification_token", async (req, res) => {
  const { userId, pushToken } = req.body;

  try {
    const user = await User.findById(userId);
    user.pushToken = pushToken;

    await user.save();

    return res.send("push notification token has been added");
  } catch (e) {
    res.status(422).send(e.message);
  }
});

router.post("/new_notification", async (req, res) => {
  const { userId, title, body } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      $push: { notifications: { title, body } },
    });

    return res.send("notification is added to the user document");
  } catch (e) {
    res.status(422).send(e.message);
  }
});

router.post("/retrieve_notifications_for_user", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    return res.send(user.notifications.reverse());
  } catch (e) {
    res.status(422).send(e.message);
  }
});

router.post("/watch_listing", async (req, res) => {
  const { listingId, userId, pushToken } = req.body;
  try {
    await Listing.findByIdAndUpdate(listingId, {
      $push: {
        usersWatching: { userId, pushToken },
      },
    });
    res.send("done");
  } catch (e) {
    res.status(422).send(e.message);
  }
});

router.post("/unwatch_listing", async (req, res) => {
  const { listingId, userId } = req.body;
  try {
    await Listing.findByIdAndUpdate(listingId, {
      $pull: {
        usersWatching: { userId },
      },
    });
    res.send("done");
  } catch (e) {
    res.status(422).send(e.message);
  }
});
module.exports = router;
