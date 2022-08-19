import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS, Styles } from "../Styles/StyleSheet";

function AuthRequiredComponent(props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 17 }}>To continue you need to</Text>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("AuthStack");
        }}
      >
        <Text
          style={{
            fontSize: 17,
            color: COLORS.Secondary,
            fontWeight: "bold",
          }}
        >
          sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default AuthRequiredComponent;
