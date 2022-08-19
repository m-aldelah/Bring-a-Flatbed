import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity } from "react-native";

//screens
import HomeScreen from "../screens/HomeScreen";
import AuctionScreen from "../screens/AuctionScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AddListingScreen from "../screens/AddListingScreen";
import SignIn from "../screens/SignInScreen";
import AuthStack from "./AuthStack";
import { authContext } from "../services/contexts/AuthProvider";
import AuthRequiredComponent from "../components/AuthRequiredComponent";
//StyleSheet
import { NavigationContainer } from "@react-navigation/native";

import { COLORS, Styles } from "../Styles/StyleSheet";

//Screen names
const homeName = "Home";
const ListName = "List a vehicle";
const NotificationsName = "Notifications";
const ProfileName = "Profile";
const SignInName = "SignIn";

const Stack = createNativeStackNavigator();

export default function NotificationsStackNavigator() {
  const { currentUser } = useContext(authContext);

  return (
    <>
      <Stack.Navigator
        initialRouteName={currentUser ? NotificationsName : "authRequired"}
      >
        <Stack.Screen
          name={homeName}
          component={HomeScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
        <Stack.Screen
          name={"authRequired"}
          component={AuthRequiredComponent}
          options={{
            headerTitleAlign: "center",
            title: "Notifications",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
        <Stack.Screen
          name={ListName}
          component={AddListingScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
        <Stack.Screen
          name={NotificationsName}
          component={NotificationsScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
        <Stack.Screen
          name={ProfileName}
          component={ProfileScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
        <Stack.Screen
          name={SignInName}
          component={SignIn}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
        <Stack.Screen
          name={"AuthStack"}
          component={AuthStack}
          options={{
            headerTitleAlign: "center",
            headerShown: false,
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
      </Stack.Navigator>
    </>
  );
}
