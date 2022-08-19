import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserPage from "../screens/UserProfile";
import CommentPage from "../screens/DetailsScreen";

const Stack = createNativeStackNavigator();

// const navigation = useNavigation();

// const navUserPage = () => {
//     navigation.navigate("UserPage")
// }

export default function App() {
    return(
        <NavigationContainer>
            <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "yellow",
                },
                headerTintColor:"black",
            }}
            >
                <Stack.Screen name="CommentsPage" component={CommentPage} />
                <Stack.Screen name="UserPage" component = {UserPage} />


            </Stack.Navigator>
        </NavigationContainer>
    )
}










