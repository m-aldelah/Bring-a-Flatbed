import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import { authContext } from "../../services/contexts/AuthProvider";

import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../Styles/StyleSheet";
import axios from "axios";
import getLocalHost from "../../services/getLocalHost";
import { useNavigation, useRoute } from "@react-navigation/native";

const deleteReply = async (listingId, commentId, replyId) => {
  try {
    console.log(listingId, commentId, replyId);
    await axios.post(`${getLocalHost()}:3000/delete_reply`, {
      listingId,
      commentId,
      replyId,
    });
  } catch (e) {
    console.log(e);
  }
};

const openMoreOptions = (listingId, parentComment, replyId) => {
  if (Platform.OS === "android") {
    Alert.alert(
      "Delete Reply",
      "If you press delete, it will be deleted forever",
      [
        {
          text: "Cancel",
          onPress: () => false,
        },
        {
          text: "Delete",
          onPress: () => deleteReply(listingId, parentComment, replyId),
        },
      ]
    );
  } else if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
        } else {
          deleteReply(listingId, parentComment, replyId);
        }
      }
    );
  }
};
function SubComment({
  pfpUri,
  username,
  time,
  body,
  parentComment,
  listingId,
  replyId,
  userId,
}) {
  const navigation = useNavigation();

  const navUserPage = () => {
    navigation.navigate("UserPage", {
      name: username,
      pfpUri: pfpUri,
      userId: userId,
    });
  };

  const { currentUser } = useContext(authContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.profileImage} source={{ uri: pfpUri }} />
        <View>
          <TouchableOpacity onPress={navUserPage}>
            <Text style={styles.username}>{username}</Text>
          </TouchableOpacity>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Feather
          style={styles.moreIcon}
          name="more-vertical"
          size={17}
          onPress={() => {
            if (currentUser.isModerator || currentUser?.username === username) {
              openMoreOptions(listingId, parentComment, replyId);
            } else {
              Alert.alert(
                "These options are available to author of the comment"
              );
            }
          }}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText} numberOfLines={10}>
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light,
    width: "100%",
    padding: 5,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderColor: "#ddd",
    paddingLeft: 20,
    borderColor: "white",
    borderWidth: 5,
    borderRadius: 15,
    backgroundColor: "#ECECEC",
  },
  header: {
    height: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    margin: 7,
    marginLeft: 0,
    paddingBottom: 0,
  },
  username: {
    fontWeight: "bold",
    color: "#69876f",
  },

  moreIcon: {
    color: "#79828f",
    marginLeft: "auto",
  },
  bodyText: { fontSize: 12, fontWeight: "600", marginBottom: 3 },
  time: {
    color: COLORS.InActive,
  },
});
export default SubComment;
