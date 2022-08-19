import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import Listing from "../components/Listing";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import axios from "axios";
import { authContext } from "../services/contexts/AuthProvider";

import Button from "../components/Button";

import { useIsFocused } from "@react-navigation/native";

//dev imports
import getLocalHost from "../services/getLocalHost";

import AsyncStorage from "@react-native-async-storage/async-storage";
import notifications_init from "../services/notifications_init";

var makeListAv = null;
var modelListAv = null;
var descListAv = null;
var yearListAv = null;
var searchEntry = null;
var searchEntry2 = null;
var filterMake = null;
var filterModel = null;
var filterYear = null;
var filterStatus = null;

const HomeScreen = (props) => {
  const { currentUser } = useContext(authContext);
  const [isRefreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  let c = useContext(authContext);

  const getListings = async () => {
    //get approved first
    const { data: approvedListings } = await axios.post(
      `${getLocalHost()}:3000/retrieve_listings`,
      {
        filter: {
          status: "approved",
        },
      }
    );
    //get expired listing
    const { data: expiredListings } = await axios.post(
      `${getLocalHost()}:3000/retrieve_listings`,
      {
        filter: {
          status: "expired",
        },
      }
    );
    setListings([...approvedListings, ...expiredListings]);
    setRefreshing(false);
  };

  const getAvailableInventory = () => {
    axios
      .post(`${getLocalHost()}:3000/retrieve_MMY_Lists`)
      .then((res) => {
        makeListAv = res.data.makeList;
        modelListAv = res.data.madeList;
        descListAv = res.data.descList;
        yearListAv = res.data.yearList;
        getRequestedSearch();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getRequestedFilter = async () => {
    axios
      .post(`${getLocalHost()}:3000/retrieve_listings`, {
        count: 100,
        countSkip: 0,
        filter: {
          status: filterStatus,

          year: { $regex: filterYear, $options: "i" },
          make: { $regex: filterMake, $options: "i" },
          model: { $regex: filterModel, $options: "i" },
        },
      })
      .then((res) => {
        if (res.data.length === 0) {
          Alert.alert(
            "No results",
            "Try searching for a car model, make or year",
            [
              {
                text: "ok",
                onPress: () => getListings(),
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
          setRefreshing(true);
          getListings();
        } else {
          setListings(res.data);
          setRefreshing(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getRequestedSearch = async () => {
    var searchMAKE = "";
    var searchMODEL = "";
    var searchYEAR = "";
    var searchDESC = "";
    var searchFEAT = "";
    var findModel = "";

    const searchTerm = searchEntry;
    for (let i = 0; i < makeListAv.length; i++) {
      makeListAv[i] = makeListAv[i].toLowerCase().replace(/\s+/g, "");
    }
    for (let i = 0; i < modelListAv.length; i++) {
      modelListAv[i] = modelListAv[i].toLowerCase();
    }
    for (let i = 0; i < descListAv.length; i++) {
      descListAv[i] = descListAv[i].toLowerCase();
    }
    for (let item = 0; item < modelListAv.length; item++) {
      if (
        searchTerm.toLowerCase().includes(modelListAv[item]) ||
        searchTerm.toLowerCase() === modelListAv[item]
      ) {
        findModel = modelListAv[item];
      }
    }
    const arraySearchTerms = searchTerm.split(" ");
    for (let index = 0; index < arraySearchTerms.length; index++) {
      const findMake = await makeListAv.includes(
        arraySearchTerms[index].toLowerCase()
      );

      const findDESC = "";
      var findYear = false;

      if (
        !isNaN(arraySearchTerms[index]) &&
        arraySearchTerms[index].length === 4
      ) {
        findYear = true;
      }

      if (findMake) {
        searchMAKE = arraySearchTerms[index];
      } else if (findYear) {
        searchYEAR = arraySearchTerms[index];
      } else if (findModel !== "") {
        searchMODEL = findModel;
      } else {
        searchDESC = arraySearchTerms[index];
      }
    }

    if (searchEntry === "") {
      setRefreshing(true);
      getListings();
    } else {
      axios
        .post(`${getLocalHost()}:3000/retrieve_listings`, {
          count: 100,
          countSkip: 0,
          filter: {
            $or: [{ status: "approved" }, { status: "expired" }],

            year: { $regex: searchYEAR, $options: "i" },
            make: { $regex: searchMAKE, $options: "i" },
            model: { $regex: searchMODEL, $options: "i" },
            features: { $regex: searchDESC, $options: "i" },
          },
        })
        .then((res) => {
          if (res.data.length === 0) {
            Alert.alert(
              "No results",
              "Try searching for a car model, make or year",
              [
                {
                  text: "ok",
                  onPress: () => getListings(),
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
            setRefreshing(true);
            getListings();
          } else {
            setListings(res.data);
            setRefreshing(false);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(async () => {
    //get listings when the app starts
    getListings();
  }, [useIsFocused()]);

  useEffect(async () => {
    //request notification permission
    await notifications_init();
    if (currentUser) {
      const push_token = await AsyncStorage.getItem("@push_token");
      if (
        push_token &&
        (currentUser?.pushToken === undefined ||
          currentUser?.pushToken === push_token)
      ) {
        try {
          await axios.post(`${getLocalHost()}:3000/store_notification_token`, {
            userId: currentUser._id,
            pushToken: push_token,
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, []);

  const handlePress = (auction) => {
    props.navigation.navigate("auctionDetails", { listing: auction });
  };

  if (listings.length === 0) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setRefreshing(true);
              getListings();
            }}
          />
        }
      >
        <SearchBar />
      </ScrollView>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SearchBar
          test={(val) => {
            (searchEntry = val.nativeEvent.text), getAvailableInventory();
          }}
        />
        <Filter
          searchEntry2={(make, made, year, status) => {
            filterMake = make;
            filterModel = made;
            (filterYear = year), (filterStatus = status), getRequestedFilter();
          }}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listings}
          style={{ width: "100%" }}
          numColumns={2}
          refreshing={isRefreshing}
          onRefresh={() => {
            setRefreshing(true);
            getListings();
          }}
          renderItem={({ item }) => {
            return (
              <Listing
                key={item._id}
                images={item.images[0]}
                title={item.title}
                creationTime={item.creationTime}
                duration={item.duration}
                price={item.price}
                state={item.state}
                status={item.status}
                city={item.city}
                onClick={() => handlePress(item)}
              />
            );
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({});

export default HomeScreen;
