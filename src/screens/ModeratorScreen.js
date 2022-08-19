import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import ListingApprovalBox from "../components/ListingApprovalBox";
import getLocalHost from "../services/getLocalHost";
import axios from "axios";
import Button from "../components/Button";
import { COLORS } from "../Styles/StyleSheet";

const updateStatus = (listingId, newStatus) => {
  axios
    .post(`${getLocalHost()}:3000/update_listing_status`, {
      listingId,
      newStatus,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((e) => {
      console.log(e);
    });
};
const deleteListing = (listingId) => {
  axios
    .post(`${getLocalHost()}:3000/delete_listing`, {
      listingId,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((e) => {
      console.log(e);
    });
};
const ViewListingsTab = (props) => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const navigation = useNavigation();
  const getListings = () => {
    axios
      .post(`${getLocalHost()}:3000/retrieve_listings`, {
        count: 100,
        countSkip: 0,
        filter: {
          status: "pending",
        },
      })
      .then((res) => {
        setListings(res.data);
        setRefreshing(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const viewDetails = (listing) => {
    navigation.navigate("auctionDetails", { listing });
  };
  useEffect(() => {
    getListings();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={listings}
        numColumns={1}
        refreshing={isRefreshing}
        onRefresh={() => {
          setRefreshing(true);
          getListings();
        }}
        renderItem={({ item }) => {
          return (
            <ListingApprovalBox
              imageUri={item.images[0]}
              singleDriversImage={item.driverLicense[0]}
              singleTitleImage={item.carTitle[0]}
              boxTitle={item.title}
              onPress={() => {
                viewDetails(item);
              }}
              onApprove={() => updateStatus(item._id, "approved")}
              onDecline={() => updateStatus(item._id, "declined")}
            />
          );
        }}
      />
    </View>
  );
};
const ViewDeclinedListingsTab = (props) => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [listings, setListings] = useState([]);
  const navigation = useNavigation();
  const getListings = () => {
    axios
      .post(`${getLocalHost()}:3000/retrieve_listings`, {
        count: 100,
        countSkip: 0,
        filter: {
          status: "declined",
        },
      })
      .then((res) => {
        setListings(res.data);
        setRefreshing(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const viewDetails = (listing) => {
    navigation.navigate("auctionDetails", { listing });
  };
  useEffect(() => {
    getListings();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={listings}
        numColumns={1}
        refreshing={isRefreshing}
        onRefresh={() => {
          setRefreshing(true);
          getListings();
        }}
        renderItem={({ item }) => {
          return (
            <ListingApprovalBox
              imageUri={item.images[0]}
              boxTitle={item.title}
              onPress={() => {
                viewDetails(item);
              }}
              declineText="Delete"
              onApprove={() => updateStatus(item._id, "approved")}
              onDecline={() => deleteListing(item._id)}
            />
          );
        }}
      />
    </View>
  );
};
const renderScene = SceneMap({
  pending: ViewListingsTab,
  declined: ViewDeclinedListingsTab,
});

function ModeratorScreen() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "pending", title: "pending" },
    { key: "declined", title: "declined" },
  ]);
  const layout = useWindowDimensions();
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => {
        return (
          <TabBar
            {...props}
            style={{
              backgroundColor: COLORS.Secondary,
            }}
            indicatorStyle={{ backgroundColor: COLORS.white }}
          />
        );
      }}
    />
  );
}

export default ModeratorScreen;
