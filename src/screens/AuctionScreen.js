import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { authContext } from "../services/contexts/AuthProvider";
import getLocalHost from "../services/getLocalHost";
import BoxWithShadow from "../components/BoxWithShadow";
import { COLORS } from "../Styles/StyleSheet";
import CommentSection from "../components/CommentComponent/CommentSection";
import Comment from "../components/CommentComponent/Comment";
import SubComment from "../components/CommentComponent/SubComment";
const AuctionScreen = ({ route }) => {
  const { listing } = route.params;
  const { currentUser } = useContext(authContext);
  const bid = () => {
    axios
      .post(`${getLocalHost()}:3000/bid`, {
        listingId: listing._id,
        userId: currentUser._id,
        currentPrice: listing.price,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch((err) => console.log("Erorr: ", err.message));
  };
  return (
    <View style={styles.container}>
      <BoxWithShadow>
        <Text style={styles.priceText}>${listing.price}</Text>
        <TouchableOpacity style={styles.bidBtn} onPress={bid}>
          <Text style={styles.bidBtnText}>Bid</Text>
        </TouchableOpacity>
      </BoxWithShadow>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    paddingBottom: 87,
  },
  priceText: {
    fontSize: 25,
    color: COLORS.Secondary,
    marginLeft: 10,
  },
  bidBtn: {
    backgroundColor: COLORS.Secondary,
    width: 80,
    padding: 10,
    height: "80%",
    borderRadius: 10,
    marginRight: 10,
  },
  bidBtnText: {
    fontSize: 25,
    color: COLORS.white,
    textAlign: "center",
  },
});

export default AuctionScreen;
