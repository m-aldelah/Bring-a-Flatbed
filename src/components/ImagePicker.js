import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ImageBrowser } from "expo-image-picker-multiple";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { uploadImages } from "../services/AWS_S3";
const Stack = createNativeStackNavigator();

export default function ImagePicker(props) {
  const [uploading, setUploading] = useState(false);
  const { imagesFor } = props.route.params;
  return (
    <>
      {uploading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <ActivityIndicator size="large" color={"green"} />
        </View>
      ) : (
        <ImageBrowser
          max={imagesFor === "images" ? 15 : 1}
          onChange={(num, onSubmit) => {
            if (num > 0) {
              props.navigation.setOptions({
                title: `Selected ${num} images`,
                headerRight: () => (
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      onSubmit();
                    }}
                  >
                    <Text>Done</Text>
                  </TouchableOpacity>
                ),
              });
            } else {
              props.navigation.setOptions({
                title: `Selected ${num} images`,
                headerRight: null,
              });
            }
          }}
          callback={(callback) => {
            callback.then(async (data) => {
              let imagesList = [];
              try {
                setUploading(true);
                if (data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    let uri = await uploadImages(data[i]);
                    imagesList.push(uri);
                  }
                  if (imagesFor === "images") {
                    props.navigation.navigate("List a vehicle", {
                      images: imagesList,
                    });
                  } else if (imagesFor === "driverLicense") {
                    props.navigation.navigate("List a vehicle", {
                      driverLicense: imagesList,
                    });
                  } else if (imagesFor === "carTitle") {
                    props.navigation.navigate("List a vehicle", {
                      carTitle: imagesList,
                    });
                  }
                }
              } catch (e) {
                console.log("error in image picker component", e);
              }
            });
          }}
        />
      )}
    </>
  );
}
