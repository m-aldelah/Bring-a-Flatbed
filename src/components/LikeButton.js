import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { authContext } from "../services/contexts/AuthProvider";
import axios from "axios";
import getLocalHost from "../services/getLocalHost";
export default function LikeButton({ listing }) {
  const { currentUser } = useContext(authContext);
  const [saved, setSaved] = useState(false);
  const [outlineIcon, setOutlineIcon] = useState(false);
  const saveToAsyncStorage = async () => {
    let favoritedListings = await AsyncStorage.getItem("@favorites");
    try {
      if (!saved) {
        if (favoritedListings) {
          console.log("not saved...saving");
          favoritedListings = JSON.parse(favoritedListings);
          favoritedListings = [...favoritedListings, listing];
          favoritedListings = JSON.stringify(favoritedListings);
          await AsyncStorage.setItem("@favorites", favoritedListings);
        } else {
          await AsyncStorage.setItem("@favorites", JSON.stringify([listing]));
        }
        saveToTheDatabase();
        setSaved(true);
      } else {
        removeFromDatabase();
        console.log("saved...removing");
        await AsyncStorage.setItem(
          "@favorites",
          JSON.stringify(
            JSON.parse(favoritedListings).filter(
              ({ _id }) => _id !== listing._id
            )
          )
        );

        setSaved(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveToTheDatabase = async () => {
    try {
      const { data: respones } = await axios.post(
        `${getLocalHost()}:3000/watch_listing`,
        {
          listingId: listing._id,
          userId: currentUser._id,
          pushToken: currentUser?.pushToken,
        }
      );
      console.log(respones);
    } catch (e) {
      console.log(e);
    }
  };

  const removeFromDatabase = async () => {
    try {
      const { data: respones } = await axios.post(
        `${getLocalHost()}:3000/unwatch_listing`,
        {
          listingId: listing._id,
          userId: currentUser._id,
        }
      );
      console.log(respones);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(async () => {
    try {
      let favoritedListings = await AsyncStorage.getItem("@favorites");
      if (favoritedListings) {
        let isAlreadySaved = JSON.parse(favoritedListings).map(({ _id }) => {
          if (_id == listing._id) {
            return true;
          } else {
            return false;
          }
        });
        if (isAlreadySaved.some((element) => element === true)) {
          setSaved(true);
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        saveToAsyncStorage();
      }}
    >
      {saved ? (
        <AntDesign style={styles.icon} name="heart" size={22} color="#eb718d" />
      ) : (
        <AntDesign
          style={styles.icon}
          name="hearto"
          size={22}
          color="#eb718d"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    elevation: 10,
  },
});
