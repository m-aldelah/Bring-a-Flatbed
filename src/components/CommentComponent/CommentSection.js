import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  RefreshControl,
  extraData,
} from "react-native";

import axios from "axios";
import Comment from "./Comment";
import NewCommentModal from "./NewCommentModal";
import getLocalHost from "../../services/getLocalHost";
import { useIsFocused } from "@react-navigation/native";

function CommentSection({
  listingId,
  numToRender = null,
  header = <></>,
  footer = <></>,
  openReply,
  onRefresh,
  userId,
}) {
  const [comments, setComments] = useState();
  const [isRefreshing, setRefreshing] = useState(false);
  let focuesd = useIsFocused();

  useEffect(() => {
    let isActive = true;
    try {
      const getComments = (listingId) => {
        axios
          .post(`${getLocalHost()}:3000/retrieve_comments`, {
            listingId: listingId,
          })
          .then((res) => {
            if (isActive) {
              setComments(res.data);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      };
      getComments(listingId);
    } catch (e) {
      console.log(e);
    }

    return () => {
      isActive = false;
    };
  }, [comments]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <View>
          <FlatList
            listKey="comment"
            ListHeaderComponent={header}
            ListFooterComponent={footer}
            data={comments}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => {
              return (
                <Comment
                  pfpUri={item.authorprofileImage}
                  username={item.authorUsername}
                  listingId={listingId}
                  commentId={item._id}
                  time={item.time}
                  body={item.content}
                  replies={item.replies ? item.replies : null}
                  openReply={openReply}
                  userId={item.authorId}
                />
              );
            }}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
export default CommentSection;
