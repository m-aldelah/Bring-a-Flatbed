import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import axios from "axios";
import notify from "../../services/notifications/notify";
import { Feather } from "@expo/vector-icons";
import getLocalHost from "../../services/getLocalHost";
import { COLORS } from "../../Styles/StyleSheet";
import { Platform } from "@unimodules/core";

const NewReplyModal = (props) => {
  const [replyContent, setReplyContent] = useState("");
  const [charCount, setCharCount] = useState(0);

  const submitReply = async (listingId, user, commentId, content) => {
    axios
      .post(`${getLocalHost()}:3000/new_reply`, {
        authorId: user._id,
        listingId,
        content: content,
        commentId: commentId,
        authorUsername: user.username,
        authorprofileImage: user.profileImage,
      })
      .then((res) => {
        props.closeModal();
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
            <View style={styles.charCountContainer}>
              <Text style={styles.charCount}></Text>
            </View>
            <TouchableOpacity
              style={styles.postBtn}
              onPress={() =>
                submitReply(
                  props.listingId,
                  props.user,
                  props.commentId,
                  replyContent
                )
              }
            >
              <Text style={{ color: "#fff", fontSize: 17 }}>Reply</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={styles.textAreaContainer}>
              <TextInput
                autoFocus
                multiline
                onChangeText={(value) => {
                  setReplyContent(value);
                  setCharCount(value.length);
                }}
                maxLength={250}
                style={styles.textArea}
                textAlignVertical="top"
                placeholder="What's up?"
                placeholderTextColor="#ccc"
                scrollEnabled={false}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    height: "70%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 150,
    elevation: 20,
    shadowOpacity: 50,
    shadowColor: COLORS.Secondary,
    shadowRadius: 3,
    shadowOffset: {
      height: 2,
    },
    position: "absolute",
    bottom: 0,
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
    alignItems: "center",
  },
  textAreaContainer: {
    top: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  textArea: {
    fontSize: 17,
    height: "100%",
  },
  charCountContainer: {
    height: 30,
    top: 20,
    marginTop: "auto",
    justifyContent: "space-between",
    alignItems: "center",
  },
  charCount: {
    fontWeight: "900",
    color: COLORS.Secondary,
  },
});
export default NewReplyModal;
