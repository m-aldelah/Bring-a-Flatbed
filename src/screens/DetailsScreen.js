import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Keyboard,
  RefreshControl,
  Alert,
} from "react-native";
import axios from "axios";
import ImageView from "react-native-image-viewing";
import { COLORS, styles } from "../Styles/StyleSheet";
import ImageSlider from "../components/listingDetailsComponents/ImageSlider";
import NewCommentModal from "../components/CommentComponent/NewCommentModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentSection from "../components/CommentComponent/CommentSection";
import Button from "../components/Button";
const { width } = Dimensions.get("screen");
import { authContext } from "../services/contexts/AuthProvider";
import ListingStatus from "../components/listingDetailsComponents/ListingStatus";
import DetailsContainer from "../components/listingDetailsComponents/DetailsContainer";
import ListingFooter from "../components/listingDetailsComponents/ListingFooter";
import getLocalHost from "../services/getLocalHost";
import io from "socket.io-client";
import notify from "../services/notifications/notify";
import { useIsFocused } from "@react-navigation/native";
import LikeButton from "../components/LikeButton";
import PaymentModal from "../components/paymentComponent/PaymentModal";

const DetailsScreen = ({ navigation, route }) => {
  const { currentUser } = useContext(authContext);
  const [listing, setListing] = useState(route.params.listing);
  const [modalOpen, setmodalOpen] = useState(false);
  const [amountOfbid, setamountOfbid] = useState(0);
  const [isNewCommentOpen, setNewCommentOpen] = useState(false);
  const [footerHidden, setFooterHidden] = useState(false);
  const [fullScreenImagesVisible, openFullscreenImages] = useState(false);
  const focused = useIsFocused();
  const [isSniped, setSnipe] = useState();
  useEffect(() => {
    let closed = false;
    if (!closed) {
      const socket = io(`${getLocalHost()}:3000`);
      Keyboard.addListener("keyboardWillShow", () => setFooterHidden(true));
      Keyboard.addListener("keyboardWillHide", () => setFooterHidden(false));
      navigation.setOptions({
        title: listing.title.length > 26 ? listing.title.substr(0, 26) + "..." : listing.title
      });
      socket.emit("watch-listing", { listingId: listing._id });
      socket.on(`change:${listing._id}`, () => updateListing());
    }
    return () => {
      closed = true;
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <LikeButton listing={listing} />,
    });
  }, []);
  const onRefresh = () => {
    updateListing();
  };

  const updateListing = () => {
    axios
      .post(`${getLocalHost()}:3000/retrieve_listings`, {
        filter: {
          _id: listing._id,
        },
      })
      .then((res) => {
        setListing(res.data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  var checkPaymentMethod = async (amount) => {
    setamountOfbid(amount);
    var currentCustomerId = null;
    var DidUserBidBefore = null;

    await axios
      .post(`${getLocalHost()}:3000/getCusId`, {
        id: currentUser._id,
      })
      .then(function (response) {
        currentCustomerId = response.data;
      })
      .catch((err) => {
        console.log("Erorr: ", err);
      });
    await axios
      .post(`${getLocalHost()}:3000/checkUserHisbidForCar`, {
        LisId: listing._id,
        userID: currentUser._id,
      })
      .then(function (response) {
        DidUserBidBefore = response.data;
      })
      .catch((err) => {
        console.log("Erorr: ", err);
      });
    if (DidUserBidBefore === "found") {
      bid(amount);
      // setmodalOpen(false);
      // return false;
    } else {
      if (currentCustomerId === null) {
        setmodalOpen(true);
      } else {
        var tt = "test";

        Alert.alert(
          "Payment Method",
          "You already have a payment method saved. Press change to change the card or press continue to use the same card",
          [
            {
              text: "change",
              onPress: () => setmodalOpen(true),
              style: "cancel",
            },
            { text: "continue", onPress: () => bid(amount) },
          ],
          { cancelable: false }
        );
      }
    }
  };

  function addMinutes(date, minutes = 5) {
    date = new Date(date);
    return new Date(date.getTime() + minutes * 60000);
  }
  function handleSnipe() {
    let updatedTime = addMinutes(listing.creationTime);
    axios
      .post(`${getLocalHost()}:3000/bid_sniped`, {
        listingId: listing._id,
        updatedTime: updatedTime,
      })
      .catch((err) => console.log("Error: ", err.message));
  }

  const bid = async (amount) => {
    if (isSniped) handleSnipe();

    axios
      .post(`${getLocalHost()}:3000/bid`, {
        listingId: listing._id,
        userId: currentUser._id,
        currentPrice: listing.price,
        bidAmount: amount,
      })
      .then(function (response) {
        notify(
          listing?.seller?.id,
          "New bid",
          `You have received a new bid from ${currentUser.username}`
        );

        if (listing.usersWatching?.length > 0) {
          console.log("notify people watching");
          notify(
            listing.usersWatching.map(({ userId }) => userId),
            `${listing.title}`,
            `Someone bid on a listing you are watching`
          );
        }
      })
      .catch((err) => console.log("Erorr: ", err.message));
  };
  const ListHeader = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.backgroundImageContainer}>
          {/* Vehicle Image*/}
          <ImageSlider
            openFullScreen={openFullscreenImages}
            images={listing.images}
          />
          <ListingStatus status={listing.status} />
        </View>
        <DetailsContainer
          listing={listing}
          getTime={(time) => {
            if (time.H <= 0 && time.D <= 0 && time.H <= 0 && time.M < 5)
              setSnipe(true);
            else setSnipe(false);
          }}
        />
        {listing.comments?.length > 1 && (
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: COLORS.Secondary,
              textAlign: "center",
              margin: 10,
            }}
          >
            Comments
          </Text>
        )}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
            marginBottom: 20,
          }}
        >
          <Button
            text="New Comment"
            disabled={currentUser === null}
            style={{ width: 100, height: 30 }}
            textStyle={{ fontSize: 13 }}
            onPress={() => setNewCommentOpen(true)}
          />
        </View>
      </ScrollView>
    );
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          overflow: "hidden",
        }}
      >
        <NewCommentModal
          visible={isNewCommentOpen}
          closeModal={() => setNewCommentOpen(false)}
          listing={listing}
          user={currentUser}
        />
        <ImageView
          images={listing.images.map((element) => {
            return {
              uri: element + "",
            };
          })}
          imageIndex={0}
          visible={fullScreenImagesVisible}
          onRequestClose={() => openFullscreenImages(false)}
        />

        {/* Comment Section */}

        <CommentSection
          listingId={listing._id}
          userId={listing.authorId}
          header={ListHeader}
          extraData={listing}
          onRefresh={onRefresh}
          footer={() => (
            <>
              <View style={{ marginTop: 140 }} />
            </>
          )}
        />
      </SafeAreaView>
      <View
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        <ListingFooter
          listing={listing}
          bidBtnOnPress={checkPaymentMethod}
          hidden={footerHidden}
          btnsDisabled={(currentUser === null || listing.status === "expired" )}
        />
        <PaymentModal
          visible={modalOpen}
          closeModal={() => setmodalOpen(false)}
          bidInfo={[listing._id, listing.price, amountOfbid]}
        />
      </View>
    </>
  );
};

const style = StyleSheet.create({
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
    height: 350,
  },

  header: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerBtn: {
    height: 30,
    width: 30,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  facilityText: { marginLeft: 5, color: COLORS.grey },
});

export default DetailsScreen;
