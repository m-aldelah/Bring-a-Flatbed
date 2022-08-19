import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../Styles/StyleSheet";
import { Feather } from "@expo/vector-icons";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

const Notification = (props) => {
  const getTimeAgo = (time) => {
    TimeAgo.addLocale(en);
    // Create formatter (English).
    const timeAgo = new TimeAgo("en-US");

    var time = new Date(parseInt(time, 16) * 1000);

    return timeAgo.format(time);
  };
  return (
    <View style={styles.notificationsContainer}>
      <View style={styles.leftContainer}>
        <Text style={styles.NotificationsTitle}>{`${props.body}`}</Text>
      </View>
      <Text style={styles.NotificationsTime}>{getTimeAgo(props.time)}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  notificationsContainer: {
    height: 50,
    width: "97%",
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 7,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 15,
    backgroundColor: COLORS.Notification,
    elevation: 20,
    shadowOpacity: 0.5,
    shadowColor: COLORS.InActive,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
    },
  },

  NotificationsTitle: {
    fontSize: 14,
    marginLeft: 7,
    marginTop: 3,
    marginRight: 10,
    textTransform: "capitalize",
    color: "#000",
  },
  NotificationsTime: {
    alignItems: "flex-end",
    color: COLORS.InActive,
  },

  leftContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
    flex: 1,
  },
});
export default Notification;
