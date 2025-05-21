// EmptyListComponent.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { fontSizes } from '../utilities/constants';
import colors from '../Theme/colors';
import { Images } from '../utilities/Images';


const EmptyList = ({ text }) => {
  return (
    <View style={styles.emptyContainer}>
      {/* <Image source={Images?.ListEmptyImage} resizeMode='contain' style={styles.Image} /> */}
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
};

export default EmptyList;
const styles = StyleSheet.create({
  Image: {
    width: 100,
    height: 100,
    alignSelf: "center"
  },
  emptyContainer: {
    flex: 1

  },
  emptyText: {
    fontSize: fontSizes.h3,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginTop: 10
  }
});