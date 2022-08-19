import React, { useState, useContext } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  CardField,
  useStripe,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import Button from "../Button";
import { CreditCardInput } from "react-native-credit-card-input";
import getLocalHost from "../../services/getLocalHost";
import { authContext } from "../../services/contexts/AuthProvider";
import axios from "axios";

const fetchPaymentIntentClientSecret = async () => {
  const response = await fetch(`${getLocalHost()}:3000/create-payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currency: "usd",
    }),
  });
  const { clientSecret } = await response.json();

  return clientSecret;
};

export default function PaymentComponent(props) {
  const { confirmPayment, loading } = useConfirmPayment();
  const [cardInfo, setCardInfo] = React.useState(null);
  const { currentUser } = useContext(authContext);

  const [isPaymentCompleted, setIsPaymentCompleted] = React.useState(false);

  const onPay = async () => {
    setIsPaymentCompleted(true);

    await axios
      .post(`${getLocalHost()}:3000/payment`, {
        number: cardInfo.number,
        cvs: cardInfo.cvc,
        expiry: cardInfo.expiry,
        userId: currentUser._id,
      })
      .then(function (response) {
        if(response.data !=="Error"){
          setIsPaymentCompleted(true);
          callBid(props.bidInfoFromPayent[0], props.bidInfoFromPayent[1], props.bidInfoFromPayent[2]);
        }
        else{
          //setIsPaymentCompleted(true);
          Alert.alert(
            "Payment Failed",
            "Your card was declined",
            [

               {
                  text: "ok",
                  //onPress: () => getListings(),
                  style: "cancel"
               }
            ],
            { cancelable: false }
         )
        }
      })
      .catch((err) => {
        console.log("Erorr: ", err);
      });
    // };



  };

  const callBid = async (listingId, currentPrice, ttttt) => {
    if (
      listingId != null &&
      currentPrice != null
    ) {
      await bid(listingId, currentPrice, ttttt);
    } else {
      props.onPremFromPayment("test");
    }
  };
  const bid = async (listingId, currentPrice, ttttt) => {
    await axios
      .post(`${getLocalHost()}:3000/bid`, {
        listingId: listingId,
        userId: currentUser._id,
        currentPrice: currentPrice,
        bidAmount: ttttt
      })
      .then(function (response) {
        // notify(currentUser._id, "New bid", "hi");
        props.onPremFromPayment();
      })
      .catch((err) => console.log("Erorr: ", err.message));
  };

  return (
    <View style={styles.mainContainer}>
      <Button
        text="Save"
        style={{
          width: 100,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 150,
        }}
        onPress={onPay}
        // style={styles.btnStyle}
        textStyle={styles.btnTextStyle}
      />
      <CreditCardInput
        // autoFocus
        requiresName
        requiresCVC
        onChange={(value) => setCardInfo(value.values)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {},
  btnContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnStyle: {
    width: 100,
    height: 34,
    marginTop: "100%",
  },
  btnTextStyle: {
    fontSize: 16,
  },
});
