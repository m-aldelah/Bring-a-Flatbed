import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../Styles/StyleSheet";

/**
 *
 * @param {string} text - text of the button
 * @param {style} style - style to the button container
 * @param {style} textStyle - styles to the button text
 * @param {function} onPress - on press function
 */

const Button = ({ onPress, style, textStyle, text, disabled }) => {
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          style ? style : null,
          disabled ? { backgroundColor: COLORS.InActive } : {},
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[styles.btnText, , textStyle ? textStyle : null]}>
          {text}
        </Text>
      </TouchableOpacity>
      {disabled && <Text style={styles.signinText}>Sign in to comment</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 50,
    backgroundColor: COLORS.Secondary,
    borderRadius: 10,
    textAlignVertical: "center",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  signinText: {
    top: 10,
    left: -8,
    color: COLORS.Secondary,
  },
});
export default Button;
