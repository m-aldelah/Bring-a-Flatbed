import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
function CommentButton({ text, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.text, style]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    fontWeight: "600",
    color: "dodgerblue",
    marginRight: 10,
  },
});
export default CommentButton;
