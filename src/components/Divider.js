import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../Theme/colors';
import { widthPercentage } from '../utilities/constants';

export default function Divider() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    height: 1,
    backgroundColor: colors.text_label,
    width: widthPercentage(95),
    alignSelf: 'center'
  },
});
