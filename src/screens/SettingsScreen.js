import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { authContext } from "../services/contexts/AuthProvider";

const SettingsScreen = ({ navigation }) => {
  let { currentValidatedUser } = useContext(authContext);
  if (currentValidatedUser) {
    navigation.navigate("tab");
    return;
  } else {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Settings Screen</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({});

export default SettingsScreen;
