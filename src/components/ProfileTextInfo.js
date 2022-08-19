import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function ProfileTextInfo({ title, info }) {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{title}</Text>
      <Text style={styles.infoStyle}>{info}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 15,
    justifyContent: "space-evenly",
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 12.5,
    color: "#969696",
    fontSize: 12,
  },
  infoStyle: {
    fontWeight: "bold",
    fontSize: 12.5,
    color: "#000",
    textTransform: "capitalize",
  },
});
export default ProfileTextInfo;
