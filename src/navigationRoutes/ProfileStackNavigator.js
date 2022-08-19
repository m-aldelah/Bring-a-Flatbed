import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";
import CommentButton from "../components/CommentComponent/CommentButton";
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
import FAQScreen from "../screens/FAQScreen";
import DetailesScreen from "../screens/DetailsScreen";
//StyleSheet
import { COLORS, Styles } from "../Styles/StyleSheet";
import { NavigationContainer } from "@react-navigation/native";
import AuthRequiredComponent from "../components/AuthRequiredComponent";
// import Button from "../../src/components/Button"
//Screen names
const homeName = "Home";
const ListName = "List a vehicle";
const NotificationsName = "Notifications";
const ProfileName = "Profile";
const SignInName = "SignIn";
//const FAQname = "FAQ";
const paymentName = "payment";
const DetailsName = "auctionDetails";
const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator({ navigation }) {
  const { currentUser } = useContext(authContext);

  return (
    <>
      <Stack.Navigator
        initialRouteName={currentUser ? ProfileName : "authRequired"}
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
            title: "Profile",
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

            headerRight: () => (
              <CommentButton
                text="FAQ"
                style={{
                  borderRadius: 0,
                  width: "100%",
                  fontSize: 14,
                  color: "white",
                }}
                onPress={() => navigation.navigate("FAQ")}
              />
            ),
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
        <Stack.Screen
          name={"FAQ"}
          component={FAQScreen}
          options={{
            headerShown: true,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
            headerBackTitleVisible: false,
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


      </Stack.Navigator>
    </>
  );
}
