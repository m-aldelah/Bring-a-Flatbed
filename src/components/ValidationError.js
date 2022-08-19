import React from "react";
import { Text } from "react-native";
import { COLORS, styles } from "../Styles/StyleSheet";

const ValidationError = (props) => {
  return <Text style={styles.validationError}>{props.error}</Text>;
};

export default ValidationError;
