import React, { useState, useContext, useEffect } from "react";

import { useIsFocused, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import Button from "../components/Button";
import { authContext } from "../services/contexts/AuthProvider";
import { COLORS } from "../Styles/StyleSheet";
import FullScreenLoading from "../components/FullScreenLoading";
import ProfileTextInfo from "../components/ProfileTextInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListingScroll from "../components/ListingScroll";
import axios from "axios";
import getLocalHost from "../services/getLocalHost";

const ProfileScreen = (props) => {
  const { currentUser, logoutCurrentUser, logoutIsLoading } =
    useContext(authContext);
  const [logoutRequested, setLogoutRequested] = useState(false); // state for when the user presses the logout button
  let focused = useIsFocused();
  const [activeBids, setActiveBids] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [watchlist, setWatchList] = useState();
  const getListings = async () => {
    try {
      axios
        .post(`${getLocalHost()}:3000/retrieve_listings`, {
          count: 100,
          filter: {
            "seller.id": currentUser._id,
          },
        })
        .then((res) => {
          setMyListings(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const getMyActiveBids = async () => {
    try {
      const { data } = await axios.post(
        `${getLocalHost()}:3000/get_user_by_id`,
        {
          userId: `${currentUser._id}`,
        }
      );
      axios
        .post(`${getLocalHost()}:3000/retrieve_listings`, {
          count: 100,
          filter: {
            _id: { $in: data.bidHistory.map(({ listingId }) => listingId) },
          },
        })
        .then((res) => {
          console.log(res.data);
          setActiveBids(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const getWatchList = async () => {
    setWatchList(JSON.parse(await AsyncStorage.getItem("@favorites")));
  };
  useEffect(() => {
    if (focused) {
      //get listings when the app starts
      getListings();
      getMyActiveBids();
      getWatchList();
    }
  }, [focused]);
  return (
    <View
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      {logoutIsLoading && logoutRequested ? (
        <FullScreenLoading />
      ) : (
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <View style={styles.container}>
            <View style={styles.profileImageBorder}>
              <Image
                style={styles.profileImage}
                source={{ uri: currentUser.profileImage }}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.username}>@{currentUser.username}</Text>
            <ProfileTextInfo
              title="Name"
              info={currentUser.firstName + " " + currentUser.lastName}
            />
            <ProfileTextInfo title="Email" info={currentUser.email} />
            <ProfileTextInfo
              title="Mobile Number"
              info={currentUser.phoneNumber}
            />
          </View>

          {/* horizontal scrollview */}

          <View
            style={{
              elevation: 10,
              shadowOpacity: 0.2,
              shadowColor: "#000",
              shadowRadius: 3,
              shadowOffset: {
                height: 1,
              },
            }}
          >
            {myListings?.length > 0 && (
              <View
                style={{
                  backgroundColor: "white",
                  paddingTop: 20,
                  width: "95%",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    paddingBottom: 5,
                    marginLeft: 5,
                    color: "#969696",
                  }}
                >
                  Your Listings
                </Text>
                <ListingScroll
                  listings={myListings}
                  navigation={props.navigation}
                />
              </View>
            )}

            {activeBids?.length > 0 && (
              <View
                style={{
                  backgroundColor: "white",
                  paddingTop: 20,
                  width: "95%",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    paddingBottom: 5,
                    marginLeft: 5,
                    color: "#969696",
                    borderTopColor: "grey",
                    borderTopWidth: 0.5,
                  }}
                >
                  Your Bid History
                </Text>
                <ListingScroll
                  listings={activeBids}
                  navigation={props.navigation}
                />
              </View>
            )}

            {watchlist?.length > 0 && (
              <View
                style={{
                  backgroundColor: "white",
                  paddingTop: 20,
                  width: "95%",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    paddingBottom: 5,
                    marginLeft: 5,
                    color: "#969696",
                    borderTopColor: "grey",
                    borderTopWidth: 0.5,
                  }}
                >
                  Your Watchlist
                </Text>
                <ListingScroll
                  listings={watchlist}
                  navigation={props.navigation}
                />
              </View>
            )}
          </View>

          <View style={{ marginTop: 30 }} />
          <Button
            text="Logout"
            style={styles.btns}
            textStyle={styles.btnsText}
            onPress={() => {
              setLogoutRequested(true);
              logoutCurrentUser(props.navigation);
              return true;
            }}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    marginTop: 25,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    alignSelf: "center",
    elevation: 10,
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  profileImageBorder: {
    width: 87,
    height: 87,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,

    alignSelf: "center",
    marginVertical: 15,
    elevation: 10,
    shadowOpacity: 0.5,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
  },
  username: {
    alignSelf: "center",
    fontWeight: "bold",
    textTransform: "capitalize",
    marginBottom: 10,
  },
  btns: {
    borderRadius: 10,
    height: 40,
    width: "30%",
    alignSelf: "center",
    marginBottom: 20,
  },
  btnsText: {
    fontSize: 14,
  },
});

export default ProfileScreen;
