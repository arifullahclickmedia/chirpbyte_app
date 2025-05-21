import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../Theme/colors';

const IndicatorTiles = ({ numberOfTiles, activeIndex }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: numberOfTiles }, (_, index) => (
        <View
          key={index}
          style={[
            styles.tile,
            index === activeIndex ? styles.activeTile : styles.disabledTile,
            index !== 0 ? styles.tileMargin : null,
          ]}
        >
          {index === activeIndex && <Text style={styles.tileText}>{index + 1}</Text>}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tile: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTile: {
    width: 30,
    height: 4,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  disabledTile: {
    width: 7.5,
    height: 7.5,
    borderRadius: 5,
    backgroundColor: colors.light_grey,
  },
  tileText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tileMargin: {
    marginLeft: 5, // Adjust this value as needed
  },
});

export default IndicatorTiles;
