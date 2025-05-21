// Import necessary libraries and components
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { moderateScale } from '../../utilities/Scales';
import { widthPercentage } from '../../utilities/constants';

// Create the InfoCard component
const InfoCard = ({ title, number, percentage, isPositive }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.number}>{number}</Text>
      <View style={styles.percentageContainer}>
        <Icon
          name={isPositive ? 'arrow-up' : 'arrow-down'}
          size={10}
          color={isPositive ? 'green' : 'red'}
        />
        <Text style={[styles.percentage, { color: isPositive ? 'green' : 'red' }]}>
          {isPositive ? '+' : '-'}{Math.abs(percentage)}%
        </Text>
      </View>
    </View>
  );
};

// Define default styles for the InfoCard component
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 7.5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
    paddingHorizontal:12,
   width:widthPercentage(40)
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginBottom: 5,
    color:"#202020"
  },
  number: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    marginLeft: 5,
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
});

export default InfoCard;
