import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Animated,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import BoxWithShadow from "./BoxWithShadow";
import Button from "./Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageViewer from "react-native-image-zoom-viewer";

const ModalPoup = ({ visible, children }) => {
  const [showModal, setShowModal] = React.useState(visible);

  const scaleValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    toggleModal();
  }, [visible]);
  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

/**
 *
 * @param {*} props
 * @props onPress() onApprove(), OnDecline(), imageUri, boxTitle
 */

function viewDriversLicenseAndTitle(driversLicenseImageURI) {
  () => setVisible(true);
}

function ListingApprovalBox({
  onPress,
  onApprove,
  onDecline,
  imageUri,
  boxTitle,
  declineText,
  singleDriversImage,
  singleTitleImage,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [visible, setVisible] = React.useState(false);

  const imagesDR = [{ url: singleDriversImage }, { url: singleTitleImage }];

  return (
    <BoxWithShadow
    width="95%"
    height={140}
    style={isVisible ? styles.visible : styles.hide}
    onPress={onPress}
  >
   
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image style={styles.listingThumbnail} source={{ uri: imageUri }} />
        <Text numberOfLines={3} style={styles.boxTitle}>
          {boxTitle}
        </Text>
      </View>
      <View style={styles.rightContainer}>
      <ModalPoup propagateSwipe={true} visible={visible} transparent={true}>
        <View style={{ height: 500 }}>
                  <View style={{ alignItems: "center" }}>
                    <View style={styles.headerTAC}>
                      <TouchableOpacity onPress={() => setVisible(false)}>
                        <Image
                          source={require("../assets/imgs/X.png")}
                          style={{ height: 20, width: 20, marginTop: 20, marginRight: 10 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                
          
                  <Text style={{alignSelf: "center", fontWeight: "bold", fontSize: 16}}>Drivers License and Car Title Images</Text>
                  
                  <View
                  style={{ 
                    alignContent: "center",
                  alignItems: "center",
                  height: "150%"
                }}
                  
                  >

                  <View 
                  style={{height: "80%", margin: 10, padding: 5, marginBottom: 10, width: "100%",}}
                  >
                    <ImageViewer imageUrls= {imagesDR} enableImageZoom={true} />

                    </View>
                  </View>
                </View>
              </ModalPoup>
      <Button
          text="View Drivers License and Title"
          style={styles.driversLicenseTitleBtn}
          textStyle={styles.btnTextStyle}
          onPress={() => {
            setVisible(true)
          }}
        />
      <Button
          text="Approve"
          style={styles.approveBtn}
          textStyle={styles.btnTextStyle}
          onPress={() => {
            setIsVisible(false);
            onApprove();
          }}
        />
        <Button
          text={declineText ? declineText : "Decline"}
          style={styles.declineBtn}
          textStyle={styles.btnTextStyle}
          onPress={() => {
            setIsVisible(false);
            onDecline();
          }}
        />
        
      </View>
    </View>
  </BoxWithShadow>
);
}
const styles = StyleSheet.create({
visible: {
  display: "flex",
},
hide: {
  display: "none",
},
container: {
  flexDirection: "column",
  height: "90%",
  width: "100%",
  padding: 0,
},
rightContainer: {
  flex: 1,
  flexDirection: "row",
  height: "100%",
  borderTopWidth: 0.5,
  borderTopColor: "grey"
},
leftContainer: {
  flex: 2,
  width: "100%",
  paddingRight: 30,
  height: "100%",
  flexDirection: "row",
},
boxTitle: {
  fontSize: 15,
  flexWrap: "wrap",
  margin: 15
},
listingThumbnail: {
  width: 60,
  height: 60,
  marginRight: 5,
  resizeMode: "cover",
  borderRadius: 5,
  alignSelf: "center",
},
approveBtn: {
  height: 40,
  width: "100%",
  margin: 5,
  marginLeft: 5,
  marginRight: 25,

},
declineBtn: {
  height: 40,
  width: "100%",
  backgroundColor: "red",
  margin: 5,
  marginLeft: 25,
  marginRight: 25
  
},
btnTextStyle: {
  fontSize: 10,
},
driversLicenseTitleBtn: {
  width: "90%",
  height: 40,
  backgroundColor: "dodgerblue",
  margin: 5
},
modalBackGround: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",

},
modalContainer: {
  width: "100%",
  height: "95%",
  backgroundColor: "white",
  paddingHorizontal: 0,
  paddingVertical: 30,
  borderRadius: 20,
  elevation: 20,
},
headerTAC: {
  width: "100%",
  height: 40,
  marginTop: -20,
  alignItems: "flex-end",
  justifyContent: "center",
},
});
export default ListingApprovalBox;