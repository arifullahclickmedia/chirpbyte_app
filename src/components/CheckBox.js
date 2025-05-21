import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Using MaterialIcons as an example
import colors from '../Theme/colors';

const GradientCheckbox = ({ title, gradientColors = ['#9C31FD', '#56B6E9'], checked, onChange }) => {
  return (
    <TouchableOpacity onPress={() => onChange(!checked)} style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBox}
      >
        <View style={styles.iconContainer}>
          {checked && <Icon name="check" size={20} color="#fff" />}
        </View>
      </LinearGradient>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  gradientBox: {
    width: 25,
    height: 25,
    borderRadius: 5,
    justifyContent: 'center',
  
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.text_secondary,
  },
});

export default GradientCheckbox;
