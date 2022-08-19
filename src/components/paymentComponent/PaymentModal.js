import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../Styles/StyleSheet";
import Payment from "./payment";
export default function PaymentModal(props) {

  const test = () => {
    console.log("yooyyo");
    props.closeModal();
  }
  return (
    <SafeAreaView>
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
          </View>
          <View style={styles.paymentContainer}>
            <Payment bidInfoFromPayent={props.bidInfo} onPremFromPayment={(val) => {

          console.log(val);
              props.closeModal(val);
            }}/>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    height: "80%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    position: "absolute",
    elevation: 20,
    shadowOpacity: 0.2,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
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

  btns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  paymentContainer: {
    height: "100%",
    width: "100%",
  },
});
