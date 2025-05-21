import React, {useState} from 'react';
import {TextInput, StyleSheet, View, Text, Image, Platform} from 'react-native'; // Import Platform component
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../Theme/colors';
import {fontSizes, widthPercentage} from '../utilities/constants';

export default function Input({
  placeholder,
  onchange,
  inputStyle,
  value,
  rightIcon,
  leftIcon,
  iconSource, // Image source for the icon
  errorMessage,
  Container,
  disabled,
  ...rest
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          Container,
        ]}>
        {leftIcon ? (
          <Image
            source={iconSource}
            style={styles.ImageIcon}
            resizeMode="contain"
          /> // Use Image component with iconSource
        ) : null}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.black}
          placeholder={placeholder}
          onChangeText={onchange}
          value={value}
          secureTextEntry={!isPasswordVisible}
          editable={!disabled}
          {...rest}
        />
        {rightIcon ? (
          <Ionicons
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={20}
            style={styles.icon}
            onPress={togglePasswordVisibility}
          />
        ) : null}
      </View>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 2,
    borderWidth: 1,
    paddingVertical: Platform.OS === 'android' ? 0 : 10, // Adjust vertical padding for Android
    borderColor: '#D0D5DD',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,
    width: widthPercentage(90),
  },
  input: {
    flex: 1,
    color: colors.black,
    height: Platform.OS === 'android' ? 40 : 'auto', // Set a consistent height for Android
  },
  ImageIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: colors.white,
    // Add styles as needed for the image
  },
  errorMessage: {
    marginTop: -10,
    marginBottom: 5,
    color: colors.red,
    fontSize: fontSizes.h4,
  },
  icon: {
    color: colors.grey,
  },
});
