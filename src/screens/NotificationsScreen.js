import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import getLocalHost from "../services/getLocalHost";
import { authContext } from "../services/contexts/AuthProvider";
//components
import Notification from "../components/Notification";
import { COLORS } from "../Styles/StyleSheet";

const NotificationsScreen = (props) => {
  const [notifcations, setNotifications] = useState(null);
  const { currentUser } = useContext(authContext);
  const getNotifications = () => {
    axios
      .post(`${getLocalHost()}:3000/retrieve_notifications_for_user`, {
        userId: currentUser._id,
      })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((e) => {
        console.log(e);
      });

    return notifcations;
  };
  useEffect(() => {
    getNotifications();
  }, [useIsFocused()]);

  if (!notifcations) {
    return (
      <View style={{ marginTop: 10 }}>
        <ActivityIndicator size="small" color={COLORS.Secondary} />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <FlatList
          data={notifcations}
          ListFooterComponent={() => <></>}
          ListFooterComponentStyle={{ marginBottom: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Notification
              title={item.title}
              body={item.body}
              time={item._id.toString().substring(0, 8)}
            />
          )}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({});

export default NotificationsScreen;
