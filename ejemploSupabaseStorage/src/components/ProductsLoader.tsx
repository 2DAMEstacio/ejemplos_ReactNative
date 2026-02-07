import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export const ProductsLoader = () => (
  <View style={styles.loaderWrap}>
    <Image
      source={require("../../assets/images/search.gif")}
      style={styles.loaderImage}
    />
  </View>
);

const styles = StyleSheet.create({
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loaderImage: {
    width: 140,
    height: 140,
  },
});
