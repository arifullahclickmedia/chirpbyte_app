import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import colors from '../Theme/colors';

const Loader = ({loading}) => {
  return loading ? (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure the loader appears on top of other components
  },
  overlay: {
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 10,
    padding: 20,
  },
});

export default Loader;
