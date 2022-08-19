import React, { useState, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authContext = createContext();
function AuthProvider(props) {
  const [currentUser, setCurrentUser] = useState(null); // the state of the current authorized user.
  const [authIsLoading, setAuthIsLoading] = useState(true); //the loading state for the authentication.
  const [logoutIsLoading, setLogoutIsLoading] = useState(true); //the loading state for the logging out.

  //set the state for the current user.
  const setCurrentValidatedUser = async (usr) => {
    try {
      setCurrentUser(usr); //set user for the current session
      //save user in the local storage
      usr = JSON.stringify(usr);
      await AsyncStorage.setItem("@currentValidatedUser", usr);
      setAuthIsLoading(false);
    } catch (e) {
      console.log("error in authprovider js file", e);
      throw new Error(
        "couldn't retrieve current user token check authProvider.js file"
      );
    }
    return true;
  };

  const tryAutoLogin = async () => {
    try {
      // get from local storage if some user is not found in the current session
      const user = await AsyncStorage.getItem("@currentValidatedUser");
      setAuthIsLoading(false);
      if (user) {
        setCurrentUser(JSON.parse(user));
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("error in authprovider js file", e);
    }
  };

  const logoutCurrentUser = async (navigation) => {
    if (currentUser) {
      try {
        setLogoutIsLoading(true);
        setCurrentUser(null);
        await AsyncStorage.removeItem("@currentValidatedUser");
        navigation.replace("AuthStack");

        setLogoutIsLoading(false);
      } catch (e) {
        console.log(e, "in logout function");
      }
    }
  };
  return (
    <authContext.Provider
      value={{
        currentUser,
        setCurrentValidatedUser,
        tryAutoLogin,
        authIsLoading,
        logoutIsLoading,
        logoutCurrentUser,
      }}
    >
      {props.children}
    </authContext.Provider>
  );
}
export { authContext };
export default AuthProvider;
