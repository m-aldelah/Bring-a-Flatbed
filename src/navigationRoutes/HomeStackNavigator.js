import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ImagePicker from "../components/ImagePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

//screens
import HomeScreen from "../screens/HomeScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddListingScreen from "../screens/AddListingScreen";
import SignIn from "../screens/SignInScreen";
import Button from "../components/Button";

//screens
import AuthStack from "./AuthStack";
import SplashScreen from "../screens/SplashScreen";
import SignUpScreen from "../screens/SignUpScreen";
import DetailesScreen from "../screens/DetailsScreen";
import AuctionScreen from "../screens/AuctionScreen";
import FAQScreen from "../screens/FAQScreen";
//StyleSheet

import { COLORS, Styles } from "../Styles/StyleSheet";

//Screen names
const homeName = "Home";
const ListName = "List a vehicle";
const NotificationsName = "Notifications";
const ProfileName = "Profile";
const SignInName = "SignIn";
const SignUpName = "SignUp";
const Stack = createNativeStackNavigator();
const SplashName = "Splash";
const DetailsName = "auctionDetails";
const AuctionName = "Auction";
const FAQName = "FAQ";
export default function HomeStackNavigator() {
  React.useEffect(async () => {
    let help = await AsyncStorage.getItem("@help");
    if (help === null) {
      let helpObject = {
        bidHelpUsed: false,
      };
      await AsyncStorage.setItem("@help", JSON.stringify(helpObject));
      let help = await AsyncStorage.getItem("@help");
      console.log(help);
    }
  }, []);

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={homeName}
          component={HomeScreen}
          options={{
            headerBackButtonMenuEnabled: false,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
        <Stack.Screen
          name={SplashName}
          component={SplashScreen}
          options={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
            tabBarVisible: false,
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
            headerShown: false,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
            tabBarVisible: false,
          }}
        />
        <Stack.Screen
          name={SignUpName}
          component={SignUpScreen}
          options={{
            headerShown: false,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
            tabBarStyle: { display: "none" },
          }}
        />
        <Stack.Screen
          name={DetailsName}
          component={DetailesScreen}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name={AuctionName}
          component={AuctionScreen}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}
