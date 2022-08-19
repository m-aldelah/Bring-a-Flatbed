import React, { useContext, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextComponent,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { authContext } from "../services/contexts/AuthProvider";
import axios from "axios";

import { COLORS } from "../Styles/StyleSheet";
import Button from "../components/Button";
import { showMessage, hideMessage } from "react-native-flash-message";
//dev imports
import getLocalHost from "../services/getLocalHost";
import PaymentModal from "../components/paymentComponent/PaymentModal";

const publishListing = (listing) => {
  axios
    .post(`${getLocalHost()}:3000/new_listing`, listing)
    .then(function (response) {
      console.log(response.data);
    })
    .catch((err) => console.log("Erorr: ", err.message));
};

const sendEmail = (confirmation_email) => {
  confirmation_email = JSON.stringify(confirmation_email);
  confirmation_email = JSON.parse(confirmation_email);
  axios
    .post(`${getLocalHost()}:3000/auction_created_email`, confirmation_email)
    .then(function (response) {
      console.log("Message sent succesfully.");
    })
    .catch((err) => {
      console.log("Erorr: ", err);
    });
};

const ListingFinalReviewScreen = (props) => {
  //let content = <Text>Loading...</Text>;
  const { listingData } = props.route.params;

  const { currentUser } = useContext(authContext);
  const [modalOpen, setmodalOpen] = useState(false);

  var checkPaymentMethod = async () =>{
    var currentCustomerId = null;
    console.log("get cus");
    await axios.post(`${getLocalHost()}:3000/getCusId`, {
      id: currentUser._id
    })
        .then(function (response) {
          currentCustomerId = response.data;
        })
        .catch((err) => {
          console.log("Erorr: ", err);
        });
        console.log("get fou");

      console.log("hello"+currentCustomerId);
      if(currentCustomerId === null)
      {
        console.log("hello2"+currentCustomerId);
        setmodalOpen(true);
      }
      else{
        console.log(" bid before");

        Alert.alert(
          "Payment Method",
          "You already have a payment method saved. Press change to change the card or press continue to use the same card",
          [

             {
                text: "change",
                onPress: () => setmodalOpen(true),
                style: "cancel"
             },
             { text: "continue",
                onPress: () => {

              console.log("fdfsfsdfsdfsdfsdfsd");
              publishListing(listingData);
              showMessage({
                message:
                  "Your listing has been posted for a review, we will update you once it is posted",
                type: "success",
              });
              sendEmail({
                seller_email: currentUser.email,
                name: currentUser.firstName,
                listing_title: listingData.title,
              });
              props.navigation.reset({
                index: 1,
                routes: [{ name: "tab" }],
              });

                }
             }
          ],
          { cancelable: false }
       );

      }


  }

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <Button
            text="edit"
            style={styles.editBtn}
            textStyle={styles.editBtnText}
            onPress={() => props.navigation.popToTop()}
          />
          <Text style={styles.almostThere}>Almost There</Text>


          <View style={styles.coverImage}>
            <Image
              style={{ width: 250, height: 250 }}
              source={{ uri: listingData.images[0] }}
            />

          </View>
          <Text style={styles.titleText}>{listingData.title}</Text>
          <ScrollView
        style={{ height: "100%", width: "100%" }}
        scrollEnabled={true}
      >
          <View style={styles.bottomContainer}>

            
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={styles.column}>Year</Text>
                <Text style={styles.column}>{listingData.year}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.column}>Make</Text>
                <Text style={styles.column}>{listingData.make}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.column}>Model</Text>
                <Text style={styles.column}>{listingData.model}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.column}>Year</Text>
                <Text style={styles.column}>{listingData.year}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.column}>VIN</Text>
                <Text style={styles.column}>{listingData.VIN}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.column}>Minimum Price:</Text>
                <Text style={styles.column}>${listingData.minimumPrice}</Text>
              </View>
              <View
                style={[
                  styles.row,
                  {
                    marginTop: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#ccc",
                    paddingTop: 2,
                    shadowOpacity: 0.5,
                    shadowColor: COLORS.Secondary,
                    shadowRadius: 3,
                    shadowOffset: {
                      height: 0.5,
                    },
                  },
                ]}
              >
                <Text
                  style={[
                    styles.column,
                    { color: COLORS.Secondary, fontWeight: "800" },
                  ]}
                >
                  Fees
                </Text>
                <Text
                  style={[
                    styles.column,
                    { color: COLORS.Secondary, fontWeight: "800" },
                  ]}
                >
                  $100
                </Text>
              </View>
            </View>


          </View>
          </ScrollView>
          

          <Button
              text="List"
              style={styles.btns}
              onPress={() => {
                // publishListing(listingData);
                // sendEmail({
                //   seller_email: currentUser.email,
                //   name: currentUser.firstName,
                //   listing_title: listingData.title,
                // });
                // props.navigation.reset({
                //   index: 1,
                //   routes: [{ name: "tab" }],
                // });
                checkPaymentMethod();


              }}
            />
            <Button
              text="Cancel"
              style={[styles.btns, { backgroundColor: "#666" }]}
              onPress={() => {
                props.navigation.reset({
                  index: 0,
                  routes: [
                    { name: "tab", params: { screen: "ListVehicleTab" } },
                  ],
                });

                showMessage({
                  message: "Your listing is not posted",
                  type: "info",
                });
              }}
            />

{/*
          //         <Text style={styles.finalReviewText}>
          //             {listingData.duration} days
          //           </Text>
          //           <Text style={styles.finalReviewText}>{listingData.description}</Text>
          //           <Text style={styles.finalReviewText}>{listingData.features}</Text>
          //           <TouchableOpacity */}
          {/* //             style={styles.finalReviewButton}
          //             onPress={() => {
          //               checkPaymentMethod();
          //
          //
          //               // console.log("fdfsfsdfsdfsdfsdfsd");
          //               // publishListing(listingData);
          //               // sendEmail(confirmation_email);
          //               // props.navigation.navigate("auctionDetails", {
          //               //   listing: { ...listingData, price: 0 },
          //               // });
          //             }}
          //           >
          //             <Text>List</Text>
          //           </TouchableOpacity> */}

        </View>

        <PaymentModal visible = {modalOpen} closeModal={(val) => {
           console.log(val);
           if(val == "test")
           {
             console.log(val);
          console.log("fdfsfsdfsdfsdfsdfsd");

              publishListing(listingData);
              sendEmail({
                seller_email: currentUser.email,
                name: currentUser.firstName,
                listing_title: listingData.title,
              });
              setmodalOpen(false);
              showMessage({
                message:
                  "Your listing has been posted for a review, we will update you once it is posted",
                type: "success",
              });
              props.navigation.reset({
                index: 1,
                routes: [{ name: "tab" }],
              });


           }
           else{setmodalOpen(false);};
           }} bidInfo={[null, null]}/>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowOpacity: 0.5,
    shadowColor: COLORS.Secondary,
    shadowRadius: 5,
    shadowOffset: {
      height: 0,
    },
  },
  bottomContainer: {
    paddingTop: 10,
    width: "100%",
    alignItems: "center",
  },
  almostThere: {
    color: COLORS.Secondary,
    fontSize: 25,
    fontWeight: "bold",
    elevation: 10,
    shadowOpacity: 0.2,
    shadowColor: COLORS.Secondary,
    shadowRadius: 3,
    shadowOffset: {
      height: 0.5,
    },
    marginTop: 5,
    marginBottom: 10,
  },
  titleText: {
    color: COLORS.Secondary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    width: "90%",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: COLORS.grey,
    // borderBottomWidth: 1,
  },
  column: {
    padding: 7,
    fontWeight: "500",
    color: COLORS.InActive,
  },
  btns: {
    width: "90%",
    height: 40,
    borderRadius: 5,
    marginBottom: 10,
  },
  editBtn: {
    position: "absolute",
    zIndex: 99,
    width: 50,
    height: 35,
    left: 5,
    top: 5,
    borderRadius: 100,
  },
  editBtnText: {
    fontSize: 13,
  },
});
export default ListingFinalReviewScreen;
