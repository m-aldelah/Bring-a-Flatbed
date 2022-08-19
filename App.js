import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./src/screens/SignInScreen";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "./src/screens/SplashScreen";
import ListingFinalReviewScreen from "./src/screens/ListingFinalReviewScreen";
import SignUp from "./src/screens/SignUpScreen";
import AuthProvider from "./src/services/contexts/AuthProvider";
import { StripeProvider } from "@stripe/stripe-react-native";
import { ActivityIndicator, LogBox, View } from "react-native";
import FlashMessage from "react-native-flash-message";
//ignore the require cycle warning
LogBox.ignoreLogs(["Require cycle:", "VirtualizedList:"]);

//import colors
import { COLORS } from "./src/Styles/StyleSheet";
import AuthStack from "./src/navigationRoutes/AuthStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
function App() {
  return (

    <StripeProvider publishableKey="pk_live_51KgKoDATyxdufmsVW8Dui9TBYZob29tBO4CXnrYJGE8sKZONhX3LBrjTSTEL695SxjVKEbvumxwqTgu9cTrulzKg00PYWjhDlY">
      <AuthProvider>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
        <FlashMessage position="top" duration={2500} icon={{ icon: "auto" }} />
      </AuthProvider>
    </StripeProvider>
  );
}

export default App;
