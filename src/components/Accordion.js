import React, { useState } from "react";
import {
  View,
  LayoutAnimation,
  StyleSheet,
  UIManager,
  Platform,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  
  const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleOpen = () => {
      setIsOpen((value) => !value);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    return (
        <>
          <TouchableOpacity
            onPress={toggleOpen}
            style={styles.heading}
            activeOpacity={0.6}
          >
            {title}
            <Icon
              name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
              size={18}
              color="black"
            />
          </TouchableOpacity>
    
          <View style={[styles.list, !isOpen ? styles.hidden : undefined]}>
            {children}
          </View>
        </>
      );
    };

    export default Accordion;

    const styles = StyleSheet.create({
        
        safeArea: {
          flex: 1,
        },
        heading: {
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 10,
        },
        hidden: {
          height: 0,
        },
        list: {
          overflow: "hidden",
        },
       
       
      });
      

