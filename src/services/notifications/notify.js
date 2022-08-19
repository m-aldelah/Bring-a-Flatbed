import axios from "axios";
import getLocalHost from "../getLocalHost";

/**
 *
 * @param {Id object} userId
 * id of user to be sent a notification
 * @param {string} title
 * title of the push notification
 * @param {string} body
 * body of the push
 */

const notify = async (userId, title, body) => {
  if (!userId || !title || !body) throw Error;

  try {
    await axios.post(`${getLocalHost()}:3000/new_notification`, {
      userId,
      title,
      body,
    });
  } catch (e) {
    throw e;
  }
};

export default notify;
