import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
//import Image from 'react-native-scalable-image';
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../Styles/StyleSheet";
import Timer from "../components/Timer";

/**
 *
 * @Prop onClick
 * @Prop time
 * @Prop images
 * @Prop title
 * @Prop price
 * @returns
 */

const Listing = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [endTime, setEndTime] = useState();
  useEffect(() => {
    const date = new Date(props.time);
    date.setDate(date.getDate() + 7);
    setEndTime(date.toLocaleDateString());
  }, []);
  return (
    <View style={[styles.listingContainer, props.containerStyle]}>
      <TouchableOpacity onPress={props.onClick}>
        <Image
          style={[styles.listingImage, loaded ? styles.showImage : null]}
          source={{ uri: props.images }}
          onLoadEnd={() => setLoaded(true)}
        />
        {props.status === "expired" && (
          <View style={styles.expiredOverlay}>
            <Text style={styles.expiredText}>Expired</Text>
          </View>
        )}
        <View
          style={[
            [
              {
                height: 200,
                justifyContent: "center",
                alignContent: "center",
                position: "absolute",
                left: "50%",
              },
              loaded ? { display: "none" } : null,
            ],
          ]}
        >
          <ActivityIndicator
            style={loaded ? { display: "none" } : null}
            size="small"
            color={COLORS.primary}
          />
        </View>

        <View style={styles.listingInfoBox}>
          <Text numberOfLines={1} style={styles.listingTitle}>
            {props.title}
          </Text>
          <View style={styles.listingPrice}>
            {/* <Timer creationTime={props.creationTime} textStyle={styles.timer} /> */}

            {/* <Text style={{ color: "white", fontSize: 12 }}>Exp: {endTime}</Text> */}
            <Text style={{ color: "white" }}>${props.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  listingContainer: {
    marginBottom: 3,
    width: "47%",
    margin: 5,
    borderWidth: 0,
    elevation: 10,
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
  },
  listingInfoBox: {
    backgroundColor: COLORS.Secondary,
    height: 55,
    paddingHorizontal: 6,
    paddingTop: 3,

    width: "100%",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  listingImage: {
    flex: 1,
    width: null,
    height: 200,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    resizeMode: "cover",
    transform: [{ scale: 0 }],
  },
  showImage: {
    transform: [{ scale: 1 }],
  },
  listingTitle: {
    color: "white",
    fontSize: 18,
    display: "flex",
    fontSize: 15,
    marginTop: 6,
    fontWeight: "bold",
    alignSelf: "center",
    elevation: 16,
    shadowOpacity: 0.6,
    shadowColor: "#555",
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
  },
  listingPrice: {
    color: "white",
    fontSize: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    fontWeight: "bold",
    width: "100%",
    flex: 1,
    bottom: 5,
  },
  timer: {
    color: "white",
    fontSize: 14,
  },
  expiredOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    opacity: 0.7,
    bottom: 10,
  },
  expiredText: {
    fontSize: 18,
    fontWeight: "900",
  },
});
export default Listing;
