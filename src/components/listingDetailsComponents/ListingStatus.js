import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../Styles/StyleSheet";

function ListingStatus({ status }) {
  if (status === "approved") {
    status = "Active";
  }

  return (
    <View style={style.listingStatus}>
      <Text style={{ color: COLORS.white }}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  listingStatus: {
    top: -20,
    width: 120,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 0,
    backgroundColor: COLORS.Secondary,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ListingStatus;
