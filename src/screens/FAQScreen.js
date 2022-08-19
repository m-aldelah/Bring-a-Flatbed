import React, { useState } from "react";
import {
  Text,
  View,
  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform,
  ScrollView,
  Alert,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import getLocalHost from "../services/getLocalHost";
import * as yup from "yup";
import axios from "axios";
import ValidationError from "../components/ValidationError";
import Accordion from "../components/Accordion";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  name: yup.string().required("Full name is required"),

  message: yup.string().required("Message is required"),
});

const FAQScreen = (props) => {
  const question1 = (
    <View>
      <Text style={styles.sectionTitle}> What is Bring a Flatbed? </Text>
    </View>
  );
  const answer1 = (
    <View>
      <Text style={styles.sectionDescription}>
        Bring a Flatbed is an online auction house for cheap hobbyist cars. This
        auction house is aimed at cars in less-than-ideal condition.
      </Text>
    </View>
  );

  const question2 = (
    <View>
      <Text style={styles.sectionTitle}> {`Why Bring a Flatbed?`} </Text>
    </View>
  );
  const answer2 = (
    <View>
      <Text
        style={styles.sectionDescription}
      >{`Most auction sites are for pristine collector cars with ridiculous fees. Using Bring a Flatbed, buyers will be able to get the best price for their common non-pristine vehicle.`}</Text>
    </View>
  );
  const question3 = (
    <View>
      <Text style={styles.sectionTitle}>
        {" "}
        {`How Does the Buying/Selling Process Work?`}
      </Text>
    </View>
  );
  const answer3 = (
    <View>
      <Text style={styles.sectionDescription}>
        {`As a seller, you are able to list your vehicle using the "List" tab on the bottom tab-bar. Information about your vehicle is requested, this includes: title, year, make, model, VIN, description, and features. An image of your driver's licence and vehicle title are required for verification. You are then allowed to upload a maxiumum of 15 photos. There is a $100.00 service fee required for every listing posted. The payment will remain on hold until the vehicle is sold. Once you submit your listing, a BAF Moderator must approve it before it goes live on the app. If the minimum vehicle listing entered by the user is above the highest bid, the vehicle will not be sold. If you succesfully sell your vehicle, a confirmation email will be sent to you with the winners email address. This can be used to contact the winner and complete the transaction outside the application.

As a buyer, you can search for listing or view them through the homepage. Simply press the listing to view more information. The comment section on the listing detials page may be used for questions. To bid on a vehicle, press the hand button to increase the currect bid. (Bids may only be increased by multiples of $100). To leave a bid, you must pay a $100.00 service fee per listing. Your payment will remian on hold until you are the winner of the auction. If you win the auction, a confirmation email will be sent to you with the sellers email address. This can be used to contact the seller and complete the transaction outside the application.`}
      </Text>
    </View>
  );

  const contactTitle = (
    <View>
      <Text style={styles.sectionTitle}> Contact Us? </Text>
    </View>
  );

  return (
    <ScrollView>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          name: "",
          email: "",
          message: "",
        }}
        onSubmit={(values, onSubmitProps) => {
          values = JSON.stringify(values);
          values = JSON.parse(values);
          axios
            .post(`${getLocalHost()}:3000/contact_form`, values)
            .then(function (response) {
              Alert.alert("Message sent succesfully.");
              onSubmitProps.resetForm();
            })
            .catch((err) => {
              console.log("Erorr: ", err);
            });
        }}
      >
        {(props) => (
          <KeyboardAvoidingView
            enabled
            behavior={Platform.OS == "ios" ? "padding" : null}
          >
            <View style={styles.background1}>
              <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                  <View style={styles.header}>
                    <Text style={styles.TitleText}>
                      Frequently Asked Questions
                    </Text>
                  </View>

                  <View style={styles.footer}>
                    <Accordion
                      style={{ width: 20, height: 100 }}
                      title={question1}
                    >
                      {answer1}
                    </Accordion>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.divider} />
                    </View>

                    <Accordion
                      style={{ width: 20, height: 100 }}
                      title={question2}
                    >
                      {answer2}
                    </Accordion>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.divider} />
                    </View>

                    <Accordion
                      style={{ height: 100, width: 20 }}
                      title={question3}
                    >
                      {answer3}
                    </Accordion>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.divider} />
                    </View>

                    <Accordion
                      style={{ width: 20, height: 100 }}
                      title={contactTitle}
                    >
                      <View>
                        <TextInput
                          style={styles.input}
                          placeholder="Full Name"
                          onChangeText={props.handleChange("name")}
                          value={props.values.name}
                        />
                        {props.errors.name && props.touched.name ? (
                          <ValidationError error={props.errors.name} />
                        ) : (
                          <></>
                        )}

                        <TextInput
                          style={styles.input}
                          placeholder="Email Address"
                          onChangeText={props.handleChange("email")}
                          value={props.values.email}
                        />
                        {props.errors.email && props.touched.email ? (
                          <ValidationError error={props.errors.email} />
                        ) : (
                          <></>
                        )}

                        <TextInput
                          multiline
                          style={[
                            styles.input,
                            { height: 120, textAlignVertical: "top" },
                          ]}
                          placeholder="Message"
                          onChangeText={props.handleChange("message")}
                          value={props.values.message}
                        />
                        {props.errors.message && props.touched.message ? (
                          <ValidationError error={props.errors.message} />
                        ) : (
                          <></>
                        )}

                        <TouchableOpacity
                          style={styles.Button}
                          activeOpacity={0.5}
                          onPress={props.handleSubmit}
                        >
                          <Text style={styles.ButtonText}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </Accordion>
                    <View style={{ alignItems: "center" }}>
                      <View style={styles.divider} />
                    </View>
                  </View>
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </ScrollView>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  header: {
    flex: 1, //takes up 2/3 of the screen
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  footer: {
    flex: 3, //takes up 1/3 of the screen
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  background1: {
    height: "100%",
    flex: 2,
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  TitleText: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#69876f",
    textAlign: "center",
  },
  safeArea: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    marginRight: 5,

    fontWeight: "bold",
    color: "#69876f",
  },
  sectionDescription: {
    fontSize: 14,
    width: "90%",
    marginLeft: "5%",
    flexWrap: "wrap",
    flexDirection: "row",
    flexShrink: 1,
  },
  divider: {
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "100%",
    margin: 10,
  },
  input: {
    height: 40,
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  Button: {
    alignItems: "center",
    color: "green",
  },

  ButtonText: {
    marginTop: 5,
    fontSize: 17,
    color: "white",
    borderColor: "#69876f",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#69876f",
    overflow: "hidden",
    borderColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
