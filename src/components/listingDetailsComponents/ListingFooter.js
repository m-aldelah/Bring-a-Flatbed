import React, { useState }from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../Styles/StyleSheet";
import DialogInput from 'react-native-dialog-input';

function ListingFooter({
  navigation,
  listing,
  bidBtnOnPress,
  hidden,
  btnsDisabled,
}) {

  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState(0)
  const [bidText, setBidText] = useState("Bid Amount")

  const showDialog = () => {
    setVisible(true);
  };

  function formatMoney(
    amount,
    decimalCount = 0,
    decimal = ".",
    thousands = ","
  ) {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        "$" +
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    } catch (e) {
      console.log(e);
    }
  }

  function handleBidText(inputText)
  {
    let bid = inputText.replace(/[^\d.-]/g, '');

    setBidText(formatMoney(bid))
  }

  function validateInput(inputText)
  {
    if(!/^[0-9,/$]*$/.test(inputText))
    {
      Alert.alert('Invalid Input', 'Please enter a valid input')
      return -99
    }

    let bid = inputText.replace(/[^\d.-]/g, '');

    if(bid % 100 != 0)
    {
      Alert.alert('Invalid Multiple', 'Please enter a valid multiple of 100. E.g. $100 or $25,200.')
      return -99
    }

    if(bid <= listing.price)
    {
      Alert.alert('Bid is too low', 'Please enter a bid higher than the current bid.')
      return -99
    }

    if(bid >= 1000000)
    {
      Alert.alert('Bid is too high', 'Please enter a reasonable bid.')
      return -99
    }

    return bid
  }

  const handleBid = (inputText) => {

    let bid = validateInput(inputText)
    
    if(bid == -99)
      return false

    setAmount(bid)
    setVisible(false);
    return true
  };

  return (
    <View style={[style.footer, hidden ? { display: "none" } : null]}>
      {/* Current Bid */}
      <View>
        <Text
          style={{
            color: COLORS.Secondary,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          ${listing.price}
        </Text>

        <Text style={{ fontSize: 12, color: COLORS.grey, fontWeight: "bold" }}>
          Current Bid
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        {/* Bid Amount button, calls DialogInput on press*/}
        <TouchableOpacity
          style={[
            style.BidBtn,
            { marginRight: 10 },
            btnsDisabled ? { backgroundColor: COLORS.InActive } : {},
          ]}
          disabled={btnsDisabled}
          onPress={showDialog}
        >
          <Text style={{ color: COLORS.white, fontSize: 14 }}>{bidText}</Text>
        </TouchableOpacity>

          {/* Sets the bid amount and validates it */}
        <DialogInput isDialogVisible={visible}
          title={"Enter Bid Amount"}
          message={"Only multiples of 100 are accepted"}
          hintInput ={"e.g xxx,x00"}
          submitInput={ (inputText) => { handleBid(inputText) ? handleBidText(inputText) : {} }}
          closeDialog={ () => {setVisible(false) }}>
        </DialogInput>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            style.BidBtn,
            btnsDisabled || amount === 0 ? { backgroundColor: COLORS.InActive } : {},
          ]}
          disabled={btnsDisabled || amount === 0 ? true : false}
          onPress={() => bidBtnOnPress(amount)}
        >
          <Text style={{ color: COLORS.white, fontSize: 14 }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  footer: {
    height: 70,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 5,
    marginHorizontal: 7,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowColor: "#000",
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
    },
  },

  BidBtn: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.Secondary,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
});
export default ListingFooter;
