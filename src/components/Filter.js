import React, {Component} from "react";
import {View, StyleSheet, Text, TextInput, Button, Alert, Keyboard, TouchableWithoutFeedback, Pressable, TouchableOpacity, ScrollView} from "react-native";
import { COLORS } from "../Styles/StyleSheet";
import { FontAwesome } from '@expo/vector-icons';
export default class Filter extends Component {

    state = {
        make: "",
        model: "",
        year: "",
        status:"approved",
    }

    getValues () {
        // console.log(this.state.make);
        // console.log(this.state.model);
        // console.log(this.state.year);
    }

    getExpired(){
        console.log()
    }


    render() {


        return (

                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                <View style={styles.container}>


                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>



                        <TextInput
                            placeholder="Make"
                            autoCapitalize="characters"
                            autoCorrect={false}
                            style={styles.input}
                            onChangeText={(text) => this.setState({ make: text })} />

                        <TextInput
                            placeholder="Model"
                            autoCapitalize="characters"
                            autoCorrect={false}
                            style={styles.input}
                            onChangeText={(text) => this.setState({ model: text })} />

                        <TextInput
                            placeholder="Year"
                            keyboardType="number-pad"
                            autoCorrect={false}
                            style={styles.input}
                            onChangeText={(text) => this.setState({ year: text })} />

                        <TouchableOpacity onPress={() => this.setState({ status: "approved" })} title='active' style={styles.statusbtn}>
                            <Text style={styles.btnText}> {"Active"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setState({ status: "expired" })} title='expired' style={styles.statusbtn}>
                            <Text style={styles.btnText}> {"Expired"}</Text>
                        </TouchableOpacity>

                    </ScrollView>

                    <TouchableOpacity onPress={() => this.props.searchEntry2(this.state.make, this.state.model, this.state.year, this.state.status)} title='submit' style={styles.filterbtn}>
                            {/* <Text style={styles.submitBtnText}> {"Submit"}</Text> */}
                            <FontAwesome name="filter" size={20} color="black" style={styles.filterIcon} />
                    </TouchableOpacity>

                </View>

                </TouchableWithoutFeedback>

        );
    }
}

const styles = StyleSheet.create({
    container:{
      flexDirection: "row",
      marginLeft:8,
      marginRight:5,
      justifyContent: "space-evenly",
    },

    input: {
        height: 30,
        margin: 5,
		width:85,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderColor: "#ccc",
        borderWidth: 1,
        fontSize: 16,
      },

      statusbtn:{
        marginTop:5,
        width: 55,
        height: 30,
        borderWidth:1,
        borderColor: "darkgray",
        borderRadius: 15,
        textAlignVertical: "center",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        marginRight:10,
        marginLeft: 6,
      },

      filterbtn: {
        marginTop:5,
        width: 55,
        height: 30,
        backgroundColor: "white",
        borderRadius: 15,
        borderColor:COLORS.Secondary,
        borderWidth:1,
        textAlignVertical: "center",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        marginLeft:4,
      },

      btnText: {
        color: "darkgray",
        fontSize: 12,
        textAlign: "center",
        fontWeight: "normal",
      },

      submitBtnText: {
        color: "white",
        fontSize: 12,
        textAlign: "center",
        fontWeight: "normal",
      },

      filterIcon:{
        marginTop:3,
      }
  });
