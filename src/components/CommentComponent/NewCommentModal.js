import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Text,
  Dimensions,
} from "react-native";
import axios from "axios";
import { Feather } from "@expo/vector-icons";
import getLocalHost from "../../services/getLocalHost";
import { COLORS } from "../../Styles/StyleSheet";
import { Platform } from "@unimodules/core";
import notify from "../../services/notifications/notify";

const NewCommentModal = (props) => {
  const [commentContent, setCommentContent] = useState("");

  const submitComment = async (listing, user, content) => {
    axios
      .post(`${getLocalHost()}:3000/new_comment`, {
        authorId: user._id,
        listingId: listing._id,
        content: content,
        authorUsername: user.username,
        authorprofileImage: user.profileImage,
      })
      .then(async (res) => {
        props.closeModal();

        axios
          .post(`${getLocalHost()}:3000/retrieve_listings`, {
            filter: { _id: listing._id },
          })
          .then((res) => {
            const { seller, title } = res.data[0];
            if (seller.username === user.username) return;
            notify(
              seller.id,
              "New Comment",
              `${user.username} commented on ${title}`
            );
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <Modal
        transparent
        visible={props.visible}
        animationType="slide"
        {...props}
      >
        <View style={styles.modal}>
          <View style={styles.btns}>
            <TouchableOpacity style={styles.xBtn} onPress={props.closeModal}>
              <Feather
                name="x"
                color="white"
                size={20}
                style={{ elevation: 50 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.postBtn}
              onPress={() =>
                submitComment(props.listing, props.user, commentContent)
              }
            >
              <Text style={{ color: "#fff", fontSize: 17 }}>Post</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textAreaContainer}>
            <TextInput
              maxLength={250}
              autoFocus
              multiline
              onChangeText={(value) => {
                setCommentContent(value);
              }}
              style={styles.textArea}
              textAlignVertical="top"
              placeholder="What's up?"
              placeholderTextColor="#ccc"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    position: "absolute",
    height: Platform.OS === "ios" ? height - 40 : "100%",
  },
  xBtn: {
    left: 10,
    top: 15,
    width: 30,
    height: 30,
    backgroundColor: COLORS.Secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    elevation: 20,
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
  },
  postBtn: {
    left: -10,
    top: 15,
    width: 70,
    height: 40,
    backgroundColor: COLORS.Secondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    elevation: 20,
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textAreaContainer: {
    top: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  textArea: {
    fontSize: 17,
    height: 500,
  },
});
export default NewCommentModal;
