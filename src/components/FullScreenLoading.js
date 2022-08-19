import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { COLORS } from "../Styles/StyleSheet";
function FullScreenLoading() {
  return (
    <View
      style={{
        display: "flex",
        position: "absolute",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
        backgroundColor: COLORS.Secondary,
        opacity: 0.3,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

export default FullScreenLoading;
