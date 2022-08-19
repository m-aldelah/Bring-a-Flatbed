import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeStackNavigator from "./HomeStackNavigator";
import AddListingStackNavigator from "./AddListingStackNavigator";
import ModeratorStackNavigator from "./ModeratorStackNavigator";
import NotificationsStackNavigator from "./NotificationsStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import { authContext } from "../services/contexts/AuthProvider";

//StyleSheet
import { COLORS, Styles } from "../Styles/StyleSheet";

//Screen names
const homeName = "HomeTab";
const ListName = "ListVehicleTab";
const NotificationsName = "NotificationsTab";
const ProfileName = "ProfileTab";
const SignInName = "SignInTab";
const moderatorName = "mod";

const Tab = createBottomTabNavigator();
const getTabBarVisibility = (route) => {
  if (route === "SignIn") {
    return false;
  } else {
    return true;
  }
};
function TabNavigator() {
  const { currentUser } = React.useContext(authContext);
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.Secondary,
        tabBarLabelStyle: { fontSize: 10 },
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display:
            getFocusedRouteNameFromRoute(route) == "AuthStack" ? "none" : null,
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          size = 28;
          if (rn === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === ListName) {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (rn === NotificationsName) {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (rn === ProfileName) {
            iconName = focused ? "person" : "person-outline";
          } else if (rn === moderatorName) {
            iconName = focused ? "key" : "key-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={homeName}
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          tabBarLabel: "Home",
          headerStyle: { backgroundColor: COLORS.Secondary },
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
      <Tab.Screen
        name={ListName}
        component={AddListingStackNavigator}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          tabBarLabel: "List",
          headerStyle: { backgroundColor: COLORS.Secondary },
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
      {currentUser && currentUser.isModerator && (
        <Tab.Screen
          name={moderatorName}
          component={ModeratorStackNavigator}
          options={{
            headerShown: false,
            headerTitleAlign: "center",
            tabBarLabel: "Moderator",
            headerTitle: "Control panel",
            tabBarStyle: {
              borderWidth: 1,
            },
            headerStyle: { backgroundColor: COLORS.Secondary },
            headerTitleStyle: { fontWeight: "bold", color: "white" },
          }}
        />
      )}
      <Tab.Screen
        name={NotificationsName}
        component={NotificationsStackNavigator}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          tabBarLabel: "Notifications",
          headerStyle: { backgroundColor: COLORS.Secondary },
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
      <Tab.Screen
        name={ProfileName}
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          headerTitleAlign: "center",
          tabBarLabel: "Account",
          headerStyle: { backgroundColor: COLORS.Secondary },
          headerTitleStyle: { fontWeight: "bold", color: "white" },
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
