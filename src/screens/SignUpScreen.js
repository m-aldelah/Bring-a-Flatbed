import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { authContext } from "../services/contexts/AuthProvider";

import generateUsername from "../services/generateUsername";
//dev imports
import getLocalHost from "../services/getLocalHost";
import text from "./TACText";
import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import styles from "../Styles/SignUpStylesheet";

import ValidationError from "../components/ValidationError";

const ModalPoup = ({ visible, children }) => {
  const [showModal, setShowModal] = React.useState(visible);

  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),

  lastName: yup.string().required("Last name is required"),

  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),

  phoneNumber: yup
    .string()
    .matches(/^\d+$/, "Phone number must be digits only")
    .required("Phone number is required"),

  street: yup.string().required("Address is required"),
  city: yup.string().required("Address is required"),
  state: yup.string().required("Address is required"),
  zipcode: yup.string().required("Address is required"),
});
const getUsernameSearchString = (usr) => {
  let first = usr.split("_")[0];
  let second = usr.split("_")[1].split("#")[0];

  return first + " " + second;
};
function SignUp({ props, navigation }) {
  let user = useContext(authContext);
  const [visible, setVisible] = React.useState(false);
  const [username, setUsername] = useState(generateUsername());
  const [pfp, setpfp] = useState(
    `https://source.unsplash.com/random/?${getUsernameSearchString(
      username
    )}/50x50`
  );
  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS == "ios" ? "padding" : null}
    >
      <ScrollView>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            email: "",
            phoneNumber: "",
            street: "",
            city: "",
            state: "",
            zipcode: "",
          }}
          onSubmit={(values, onSubmitProps) => {
            values.username = username;
            values.profileImage = pfp;
            values = JSON.stringify(values);
            values = values.replace(/(^[,\s]+)|([,\s]+$)/g, "");
            values = JSON.parse(values);
            axios
              .post(`${getLocalHost()}:3000/new_user`, values)
              .then(function (response) {
                user.setCurrentValidatedUser(response.data);
                navigation.navigate("tab", {
                  screen: "HomeTab",
                  params: {
                    screen: "Home",
                  },
                });
              })
              .catch((err) => {
                Alert.alert("User already exists, please try signing in.");
                onSubmitProps.resetForm();
                console.log("Erorr: ", err);
                //const errMessage = 'User already exists, please sign in';
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
                <Text style={styles.title}>Sign Up</Text>

                <View style={styles.pfpAndName}>
                  <Image
                    style={styles.ProfilePicture}
                    source={{
                      uri: pfp,
                    }}
                  />

                  <View style={styles.firstLastName}>
                    <TextInput
                      style={styles.input}
                      placeholder="First Name"
                      onChangeText={props.handleChange("firstName")}
                      value={props.values.firstName}
                    />
                    {props.errors.firstName && props.touched.firstName ? (
                      <ValidationError error={props.errors.firstName} />
                    ) : (
                      <></>
                    )}
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      onChangeText={props.handleChange("lastName")}
                      value={props.values.lastName}
                    />
                    {props.errors.lastName && props.touched.lastName ? (
                      <ValidationError error={props.errors.lastName} />
                    ) : (
                      <></>
                    )}
                  </View>
                </View>

                <TextInput
                  style={styles.username}
                  placeholder="Username"
                  editable={false}
                  onChangeText={(v) => props.handleChange("username")(v)}
                  value={username}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={true}
                  password={true}
                  require={true}
                  onChangeText={props.handleChange("password")}
                  value={props.values.password}
                />
                {props.errors.password && props.touched.password ? (
                  <ValidationError error={props.errors.password} />
                ) : (
                  <></>
                )}

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
                  placeholder="Phone Number"
                  keyboardType={"phone-pad"}
                  onChangeText={props.handleChange("phoneNumber")}
                  value={props.values.phoneNumber}
                />
                {props.errors.phoneNumber && props.touched.phoneNumber ? (
                  <ValidationError error={props.errors.phoneNumber} />
                ) : (
                  <></>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Street Address"
                  onChangeText={props.handleChange("street")}
                  value={props.values.street}
                />
                {props.errors.street ||
                props.errors.city ||
                props.errors.state ||
                props.errors.zipcode ? (
                  <ValidationError error="address is required" />
                ) : (
                  <></>
                )}

                <View style={styles.address}>
                  <TextInput
                    style={[styles.input, styles.city]}
                    placeholder="City"
                    onChangeText={props.handleChange("city")}
                    value={props.values.city}
                  />

                  <TextInput
                    autoCapitalize={"characters"}
                    style={[styles.input, styles.state]}
                    placeholder="ST"
                    onChangeText={props.handleChange("state")}
                    value={props.values.state}
                  />

                  <TextInput
                    style={[styles.input, styles.zip]}
                    placeholder="ZIP"
                    onChangeText={props.handleChange("zipcode")}
                    value={props.values.zipcode}
                  />
                </View>

                <ModalPoup propagateSwipe={true} visible={visible}>
                  <View style={{ height: 500 }}>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.headerTAC}>
                        <TouchableOpacity onPress={() => setVisible(false)}>
                          <Image
                            source={require("../assets/imgs/X.png")}
                            style={{ height: 20, width: 20 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={{ textAlign: "center", color: "dodgerblue" }}>
                      Terms and Conditions
                    </Text>
                    <ScrollView>
                      <Text
                        style={{
                          marginVertical: 30,
                          fontSize: 10,

                          flex: 1,
                        }}
                      >
                        {text}
                      </Text>
                    </ScrollView>
                  </View>
                </ModalPoup>

                <Text style={styles.TAC}>
                  By Signing Up, I agree to the{" "}
                  <TouchableOpacity onPress={() => setVisible(true)}>
                    <Text style={styles.TACLink}>BAF Terms and Conditions</Text>
                  </TouchableOpacity>
                </Text>

                <TouchableOpacity
                  style={styles.Button}
                  activeOpacity={0.5}
                  onPress={props.handleSubmit}
                >
                  <Text style={[styles.ButtonText, styles.SignUpIn]}>
                    Create Account
                  </Text>
                </TouchableOpacity>

                <Text style={styles.signInText}>Already a user?</Text>

                <TouchableOpacity
                  style={styles.Button}
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate("SignIn")}
                >
                  <Text style={styles.ButtonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignUp;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;
