const mongoose = require("mongoose");
const User = mongoose.model("User");
const sendPushNotification = require("./sendPushNotification");

const watchForNotification = () => {
  let filter = [
    {
      $match: {
        $and: [
          {
            "fullDocument.notifications": {
              $exists: true,
            },
          },
          { operationType: "update" },
        ],
      },
    },
  ];
  User.watch(filter, { fullDocument: "updateLookup" }).on("change", (data) => {
    const { title, body } = Object.entries(
      data.updateDescription.updatedFields
    )[0][1];

    const { pushToken } = data.fullDocument;
    sendPushNotification(pushToken, body, title);
    //console.log(data);
  });
};

module.exports = watchForNotification;
