// Import necessary components and libraries from React and React Native
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

// Import the LinearGradient component from the 'react-native-linear-gradient' library
import LinearGradient from 'react-native-linear-gradient';

// Import colors from the 'colors' module (assuming it contains color definitions)
import colors from '../Theme/colors';

// Define a functional component called 'Button' with various props
export default function Button({
  onPress,
  Title,
  BtnStyles,
  BtnTextStyles,
  loading,
}) {
  return (
    // LinearGradient component for the button background with custom styles
    <LinearGradient
      colors={['#9C31FD', '#56B6E9']} // Define the gradient colors
      start={{ x: 0, y: 0 }} // Define the starting point of the gradient
      end={{ x: 1, y: 0 }} // Define the ending point of the gradient
      style={[styles.btn, BtnStyles]}
    >
      {/* TouchableOpacity component for the button with custom styles */}
      <TouchableOpacity  onPress={onPress}>
        {/* Show the loading indicator if loading is true */}
        {loading ? (
          <ActivityIndicator color={colors.white} size={20} />
        ) : (
          // Text component to display the button title with custom styles
          <Text style={[styles.btnTxt, BtnTextStyles]}>{Title}</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

// StyleSheet to define the styles for the components
const styles = StyleSheet.create({
  btn: {
    width: '80%', // Set the width of the button to 80% of its parent container
    elevation: 2, // Add elevation for a visual effect
    paddingVertical: 10, // Add vertical padding inside the button
    marginVertical: 10, // Add vertical margin around the button
    borderRadius: 5, // Set the border radius to create rounded corners
  },
  touchable: {
    flex: 1, // Ensure the TouchableOpacity fills the LinearGradient
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    borderRadius: 5, // Match the border radius of the LinearGradient
  },
  btnTxt: {
    color: colors.white, // Set the text color of the button from the 'colors' module
    fontSize: 16, // Set the font size of the button text
    fontWeight: '600', // Set the font weight of the button text to bold
    textAlign: 'center', // Align the button text to the center horizontally
  },
});
