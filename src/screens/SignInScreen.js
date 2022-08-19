import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  Button,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";

//dev imports
import getLocalHost from "../services/getLocalHost";
import styles from "../Styles/SignInStylesheet";
import { authContext } from "../services/contexts/AuthProvider";
import { Formik } from "formik";
import axios from "axios";
import * as yup from "yup";
import ValidationError from "../components/ValidationError";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  password: yup.string().required("Password is required"),
});

function SignIn({ navigation }) {
  let user = useContext(authContext);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        email: "",
        password: "",
      }}
      onSubmit={(values, onSubmitProps) => {
        values = JSON.stringify(values);
        values = values.replace(/(^[,\s]+)|([,\s]+$)/g, "");
        values = JSON.parse(values);
        axios
          .post(`${getLocalHost()}:3000/sign_in`, values)
          .then(function (response) {
            if (response.data) {
              console.log(response.data);
              user.setCurrentValidatedUser(response.data);
              navigation.navigate("tab", {
                screen: "HomeTab",
                params: {
                  screen: "Home",
                },
              });
              onSubmitProps.resetForm();
              return true;
              
            } else {
              onSubmitProps.resetForm();
              Alert.alert("Invalid username/password");
              
            }
          })
          .catch((err) => {
            console.log("Erorr: ", err);
          });
      }}
    >
      {(props) => (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              style={styles.BAFLogo}
              source={require("../assets/imgs/BAFLogo.png")}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.title}>Sign In</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={props.handleChange("email")}
              value={props.values.email}
            />
            {props.errors.email && props.touched.email ? (
              <ValidationError error={props.errors.email} />
            ) : (
              <></>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              password={true}
              onChangeText={props.handleChange("password")}
              value={props.values.password}
            />
            {props.errors.password && props.touched.password ? (
              <ValidationError error={props.errors.password} />
            ) : (
              <></>
            )}
            <TouchableOpacity
              style={styles.Button}
              activeOpacity={0.5}
              onPress={props.handleSubmit}
            >
              <Text style={styles.ButtonText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.signUpText}>Not a user?</Text>

            <TouchableOpacity
              style={styles.Button}
              activeOpacity={0.5}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.ButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
}

export default SignIn;
