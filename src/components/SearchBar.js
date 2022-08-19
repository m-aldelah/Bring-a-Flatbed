import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from '../Styles/StyleSheet';
const SearchBar = ({ test,  term, onTermChange, onTermSubmit }) => {
    // onTermChange = (term) => {
    //     console.log(term.nativeEvent.text);
    // }
    // onTermSubmit = (term)=>{
    //     console.log(term.nativeEvent.text);
    // }
    
    return (
        <View style={styles.SearchBackgroundStyle}>
            <Feather name="search" style={styles.SearchIconStyle} />
            <TextInput
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="Search for Listing"
                style={styles.SearchInputStyle}
                value={term}
                onSubmitEditing={test}
            />
        </View>
    );
};

export default SearchBar;
