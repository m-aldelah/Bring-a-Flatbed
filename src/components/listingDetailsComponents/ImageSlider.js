import React from "react";
import { View, StyleSheet } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../../Styles/StyleSheet";

function ImageSlider(props) {
  return (
    <View style={style.backgroundImage}>
      <SliderBox
        images={props.images}
        sliderBoxHeight={350}
        resizeMode="cover"
        imageLoadingColor={COLORS.Secondary}
        paginationBoxStyle={{ bottom: 13 }}
        onCurrentImagePressed={() => props.openFullScreen(true)}
      />
    </View>
  );
}
const style = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default ImageSlider;
