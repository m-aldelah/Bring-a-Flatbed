import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { COLORS, styles } from "../Styles/StyleSheet";
import Button from "../components/Button";

const ListingPhotos = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
      <Button text={"Take Photos"} />
      <Button text={"Choose Photos"} />
    </View>
  );
};

export default ListingPhotos;
