import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { authContext } from "../services/contexts/AuthProvider";
import SplashScreen from "../screens/SplashScreen";
import { COLORS, Styles } from "../Styles/StyleSheet";
import HomeStackNavigator from "./HomeStackNavigator";
import TabNavigator from "./TabNavigator";
import UserPage from "../screens/UserProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
const homeName = "Home";

const SplashName = "Splash";

const Stack = createNativeStackNavigator();

function AuthStack(props) {
  const { tryAutoLogin, currentUser } = useContext(authContext);
  useEffect(async () => {
    tryAutoLogin();
  }, []);
  return (
    <Stack.Navigator initialRouteName={currentUser ? "tab" : SplashName}>
      <Stack.Screen
        name={SplashName}
        component={SplashScreen}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: COLORS.Secondary },
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
      <Stack.Screen
        name="homeNav"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: COLORS.Secondary },
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
      <Stack.Screen
        name="tab"
        component={TabNavigator}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: COLORS.Secondary },
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
      <Stack.Screen
        name="UserPage"
        component={UserPage}
        options={{
          title: " ",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: COLORS.Secondary },
          headerTitleStyle: { fontWeight: "bold", color: "white" },
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
