import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { authContext } from "../services/contexts/AuthProvider";
//screens
import ModeratorScreen from "../screens/ModeratorScreen";

//StyleSheet
import { COLORS, Styles } from "../Styles/StyleSheet";

import DetailesScreen from "../screens/DetailsScreen";

const DetailsName = "auctionDetails";
const Stack = createNativeStackNavigator();

export default function AddListingStackNavigator() {
  const { currentUser } = useContext(authContext);

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="control panel"
          component={ModeratorScreen}
          options={{
            headerTitle: "Control Panel",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
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
