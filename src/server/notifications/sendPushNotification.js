const axios = require("axios");

const sendPushNotification = async (token, body, title) => {
  try {
    if (!token || !title || !body)
      throw "token, body or title are not provided, sending push failed";

    let message = {
      to: token,
      sound: "default",
      body: body,
      title: title,
    };
    const config = {
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip,deflate",
        "content-type": "application/json",
      },
    };
    await axios.post("https://exp.host/--/api/v2/push/send", message, config);
  } catch (e) {
    console.log(e);
  }
};

module.exports = sendPushNotification;
