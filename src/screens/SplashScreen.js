import React, { useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { authContext } from "../services/contexts/AuthProvider";

const SplashScreen = ({ navigation }) => {
  const auth = useContext(authContext);
  useEffect(async () => {
    try {
      const usr = await auth.tryAutoLogin();

      if (usr) {
        navigation.navigate("tab");
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <View style={styles.container}>
      <Text></Text>

      <View style={styles.header}>
        <Image
          style={styles.BAFLogo}
          source={require("../assets/imgs/BAFLogo.png")}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.Button}
          activeOpacity={1}
          onPress={() =>
            navigation.navigate("homeNav", {
              screen: "SignUp",
            })
          }
        >
          <Text style={styles.ButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.Button}
          activeOpacity={1}
          onPress={() =>
            navigation.navigate("homeNav", {
              screen: "SignIn",
            })
          }
        >
          <Text style={styles.ButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.GuestButton}
          activeOpacity={1}
          onPress={() =>
            navigation.navigate("tab", {
              screen: "HomeTab",
              params: {
                screen: "Home",
              },
            })
          }
        >
          <Text style={styles.GuestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#69876f",
  },
  BAFLogo: {
    marginTop: 30,
    height: 150,
    width: 150,
    alignItems: "center",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 2,
    backgroundColor: "#69876f",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,

    alignItems: "center",
  },

  Button: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",

    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 3, width: 3 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
    margin: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  ButtonText: {
    fontWeight: "bold",
    fontSize: 20,
  },

  GuestButton: {
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#69876f",

    margin: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  GuestText: {
    fontSize: 20,
    color: "white",
  },
});
