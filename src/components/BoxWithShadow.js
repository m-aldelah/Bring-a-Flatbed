import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../Styles/StyleSheet";
import { Feather } from "@expo/vector-icons";

/**
 *all props are optional
 * @param {*} props
 * @prop {number} width
 * @prop {number} height
 * @prop {style} style
 * @prop {function} onPress
 * @prop {jsx component} children
 *
 */

const BoxWithShadow = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={[
          styles.notificationsContainer,
          {
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: 0,
          },
          props.width ? { width: props.width } : {},
          props.height ? { height: props.height } : null,
          props.style ? props.style : null,
        ]}
      >
        {props.children}
      </View>
    </TouchableOpacity>
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
    paddingHorizontal: 10,
    backgroundColor: COLORS.Notification,
    elevation: 20,
    shadowOpacity: 0.5,
    shadowColor: COLORS.InActive,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
    },
  },
});
export default BoxWithShadow;
