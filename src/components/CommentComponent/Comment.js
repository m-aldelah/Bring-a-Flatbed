import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ActionSheetIOS,
  Alert,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import SubComment from "./SubComment";
import NewReplyModal from "./NewReplyModal";
import CommentButton from "./CommentButton";
import Button from "../Button";
import { authContext } from "../../services/contexts/AuthProvider";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import getLocalHost from "../../services/getLocalHost";
import { COLORS } from "../../Styles/StyleSheet";
const deleteComment = async (listingId, commentId) => {
  try {
    await axios.post(`${getLocalHost()}:3000/delete_comment`, {
      listingId,
      commentId,
    });
  } catch (e) {
    console.log(e);
  }
};

const openMoreOptions = (listingId, commentId) => {
  if (Platform.OS === "android") {
    Alert.alert(
      "Delete Comment",
      "If you press delete, it will be deleted forever",
      [
        {
          text: "Cancel",
          onPress: () => false,
        },
        {
          text: "Delete",
          onPress: () => deleteComment(listingId, commentId),
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
          deleteComment(listingId, commentId);
        }
      }
    );
  }
};

function Comment({
  pfpUri,
  username,
  time,
  body,
  replies = [],
  listingId,
  commentId,
  userId,
}) {
  const [repliesHidden, setRepliesHidden] = useState(true);
  const [isNewReplyOpen, setNewReplyOpen] = useState(false);
  const { currentUser } = useContext(authContext);

  const closeModal = () => {
    setNewReplyOpen(false);
  };

  const navigation = useNavigation();

  const navUserPage = () => {
    navigation.navigate("UserPage", {
      name: username,
      pfpUri: pfpUri,
      userId: userId,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <NewReplyModal
          visible={isNewReplyOpen}
          closeModal={closeModal}
          listingId={listingId}
          commentId={commentId}
          user={currentUser}
        />
        <View style={styles.header}>
          <Image style={styles.profileImage} source={{ uri: pfpUri }} />

          <View style={{}}>
            <TouchableOpacity onPress={navUserPage}>
              <Text style={styles.username}>{username}</Text>
            </TouchableOpacity>
            <Text>{time}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Feather
              style={styles.moreIcon}
              name="more-vertical"
              size={17}
              onPress={() => {
                if (
                  currentUser.isModerator ||
                  currentUser?.username === username
                ) {
                  openMoreOptions(listingId, commentId);
                } else {
                  Alert.alert(
                    "These options are available to author of the comment"
                  );
                }
              }}
            />
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.bodyText}>{body}</Text>
        </View>
        <View style={styles.footer}>
          <CommentButton
            style={styles.replyButton}
            onPress={() => setNewReplyOpen(true)}
            text="Reply"
          />

          {replies !== null && replies.length > 0 && (
            <CommentButton
              onPress={() => {
                setRepliesHidden(!repliesHidden);
              }}
              style={{ marginLeft: 1, color: "#007AFF", fontSize: 12 }}
              text={`${repliesHidden ? "Show" : "Hide"} Reply`}
            />
          )}
        </View>
      </View>

      <View style={styles.replies}>
        {replies !== null && replies.length > 0 && !repliesHidden && (
          <FlatList
            listKey="replies"
            contentContainerStyle={{ flexGrow: 1 }}
            data={replies}
            keyExtractor={(item, index) => item._id + index}
            renderItem={({ item, index }) => {
              return (
                <SubComment
                  pfpUri={item.authorprofileImage}
                  username={item.authorUsername}
                  time={item.time}
                  body={item.content}
                  parentComment={commentId}
                  listingId={listingId}
                  replyId={item._id}
                  userId={item.authorId}
                />
              );
            }}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: "100%",
    borderColor: "#ccc",
    width: "100%",
    // paddingHorizontal: 10,
    // justifyContent: "space-between",
    flex: 1,
    padding: 10,
    backgroundColor: "#ECECEC",
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: "white",
    borderWidth: 7,
    borderRadius: 15,
    // marginTop: "1%",
  },
  header: {
    height: 40,
    width: "100%",
    flexDirection: "row",
    // paddingVertical: 10,
    // alignItems: "center",
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 35,
    marginRight: 7,
    marginBottom: 7,
    margin: 7,
    marginTop: 3,
  },
  username: { fontWeight: "bold", color: "#69876f", marginTop: 10 },
  moreIcon: {
    color: "#79828f",
    marginLeft: "auto",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  body: {
    // top: -10,
    height: "100%",
    // flex: 1,
    // paddingTop: 10,
    paddingLeft: 40,
    // margin: 7,
    marginTop: 0,
    marginBottom: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    flexShrink: 1,
  },
  bodyText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 1,
  },
  replyForm: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    display: "none",
  },
  replyFormFocused: {
    elevation: 6,
    display: "flex",
  },
  replyTextInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
  },
  replies: {
    flex: 1,
    width: "85%",
    height: "100%",
    alignSelf: "flex-end",
    marginBottom: 2,
  },

  replyButton: {
    fontSize: 12,
    marginLeft: 12,
    color: COLORS.Secondary,
  },
});
export default Comment;
