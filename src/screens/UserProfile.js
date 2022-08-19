import { useRoute } from "@react-navigation/native";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from "react-native";
import Button from "../components/Button";
import { authContext } from "../services/contexts/AuthProvider";
import { COLORS } from "../Styles/StyleSheet";
import Listing from "../components/Listing";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notifications_init from "../services/notifications_init";

import getLocalHost from "../services/getLocalHost";

export default function UserProfile(props) {
    const route = useRoute();
    const [isRefreshing, setRefreshing] = useState(false);
    const [listings, setMyListings] = useState([]);
    let c = useContext(authContext);

    const username1 = route.params.name;

    // console.log("this is user id")
    // console.log(route.params.userId);

    const getMyListings = async () => {
      try {
        axios
          .post(`${getLocalHost()}:3000/retrieve_listings`, {
            count: 100,
            filter: {
              "seller.id": currentUser._id,
            },
          })
          .then((res) => {
            setMyListings(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log(e);
      }
    };
  

      useEffect(async () => {
        //get listings when the app starts
        getMyListings();
    
        //request notification permission
        await notifications_init();
        if (currentUser) {
          const push_token = await AsyncStorage.getItem("@push_token");
          if (push_token && currentUser?.pushToken === undefined) {
            try {
              await axios.post(`${getLocalHost()}:3000/store_notification_token`, {
                userId: currentUser._id,
                pushToken: push_token,
              });
            } catch (e) {
              console.log(e);
            }
          }
        }
      }, []);

      const handlePress = (auction) => {
        props.navigation.navigate("auctionDetails", { listing: auction });
      };


    return( <View
          style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
        >
          
            {/* <ScrollView
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
            > */}
              <View style={styles.container}>
                <View>
                <View style={styles.profileImageBorder}>
                  <Image
                  source={{uri: route.params.pfpUri}}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.username}>@{route.params.name}</Text>
                <Text style={styles.username}>{listings.length} Listings</Text>
                </View>
    
                
                
            
               
               <View style={styles.footer}>
                <FlatList
                showsVerticalScrollIndicator={false}
                data={listings}
                numColumns={2}
                refreshing={false}
                onRefresh={() => {
                setRefreshing(true);
                getMyListings();
                }}
                renderItem={({ item }) => {
                return (
                <Listing
                    key={item._id}
                    images={item.images[0]}
                    title={item.title}
                    creationTime={item.creationTime}
                    time={item.creationTime}
                    duration={item.duration}
                    price={item.price}
                    onClick={() => handlePress(item)}
              />
            
              
            );

          }} 

       
         />
         </View>
     
                
              </View>
            
          
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      width: "95%",
      height: 1000,
      marginTop: 25,
      borderRadius: 5,
      backgroundColor: COLORS.white,
      alignSelf: "center",
      elevation: 10,
      shadowOpacity: 0.2,
      shadowColor: "#000",
      shadowRadius: 3,
      shadowOffset: {
        height: 1,
      },
      marginBottom: 30,
      flex: 1
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 50,
      
    },
    profileImageBorder: {
      width: 87,
      height: 87,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.white,
  
      alignSelf: "center",
      marginVertical: 15,
      elevation: 10,
      shadowOpacity: 0.5,
      shadowColor: "#000",
      shadowRadius: 3,
      shadowOffset: {
        height: 1,
      },
    },
    username: {
      alignSelf: "center",
      fontWeight: "bold",
      textTransform: "capitalize",
      marginBottom: 20,
    },

    footer: {
      flex: 3
    },
    btns: {
      borderRadius: 0,
      height: 40,
      width: "100%",
    },
    btnsText: {
      fontSize: 14,
    },
  });
  

