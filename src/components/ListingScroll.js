import React, { Component } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import Listing from "../components/Listing";

export default function ListingScroll({ listings, navigation }) {
  const handlePress = (auction) => {
    navigation.navigate("auctionDetails", { listing: auction });
  };

  return (
    <>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={listings}
        renderItem={({ item }) => {
          return (
            <View style={{}}>
              <Listing
                key={item._id}
                images={item.images[0]}
                title={item.title}
                creationTime={item.creationTime}
                duration={item.duration}
                price={item.price}
                state={item.state}
                city={item.city}
                onClick={() => handlePress(item)}
                containerStyle={{ width: 170, elevation: 0 }}
              />
            </View>
          );
        }}
      />
    </>
  );
}
