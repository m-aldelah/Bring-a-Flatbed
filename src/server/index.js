//import models
require("./models/user.js");
require("./models/listing.js");

//module imports
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRoutes.js");
const paymentRouter = require("./routes/payment.js");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const watchForNotification = require("./notifications/watchForNotification");
const watchForExpired = require("./listingExpiry");
const testUpdateManyQuery = require("../server/tests/updateManyQuery");
//initiat express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(authRouter);
app.use(paymentRouter);

//mongoDb uri token
const MongoDbUri =
  "mongodb+srv://admin:bafb@bafb.wc0fg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(MongoDbUri);

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});

mongoose.connection.on("error", (e) => {
  console.log("Error connecting to mongoDb ", e);
});

app.get("/", (req, res) => {
  res.send("");
});

server.listen(3000, () => {
  console.log("listening");
});

require("./sockets/")(io);

watchForNotification();
watchForExpired();
// testUpdateManyQuery();
