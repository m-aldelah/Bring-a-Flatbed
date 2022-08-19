import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../Styles/StyleSheet";
import Timer from "../Timer";
function DetailsContainer(props) {

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <View style={style.detailsContainer}>
      {/* Vehicle Titles */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: COLORS.Secondary,
            flex: 1,
            flexWrap: 'wrap',
          }}
        >
          {`${capitalize(props.listing.year)} ${capitalize(
            props.listing.make
          )} ${capitalize(props.listing.model)}`}
        </Text>

        {/* Timer */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={style.facilityText}>
            <Timer
              creationTime={props.listing.creationTime}
              textStyle={style.timer}
              getTime={(time)=>props.getTime(time)}
              />
          </Text>
        </View>
      </View>

      {/* Location text */}
      <Text style={{ fontSize: 16, color: COLORS.grey }}>
        {`${capitalize(props.listing.city)}, ${props.listing.state.toUpperCase()}`}
      </Text>
      {/* VIN number text */}
      <View
        style={{
          width: "100%",
          paddingTop: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: COLORS.Secondary,
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          Vin Number
        </Text>

        <Text style={{ color: COLORS.grey }}>{props.listing.VIN.toUpperCase()}</Text>
      </View>

      {/* Description text */}

      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            color: COLORS.Secondary,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Description:
        </Text>
        <Text style={{ color: COLORS.grey }}>{`\t${capitalize(
          props.listing.description
        )}`}</Text>
      </View>

      {/* Features text */}
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            color: COLORS.Secondary,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Features:
        </Text>
        <Text style={{ color: COLORS.grey, marginBottom: 50 }}>{`\t${capitalize(
          props.listing.features
        )}`}</Text>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  BidBtn: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.Secondary,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  facilityText: {
    marginLeft: 5,
    color: COLORS.grey,
    paddingLeft: 30
  },
  timer: {
    color: COLORS.grey,
    marginLeft: 5,
    fontSize: 16,
  },
});
export default DetailsContainer;
