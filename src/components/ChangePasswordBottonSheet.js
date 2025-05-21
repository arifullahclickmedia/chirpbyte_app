import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import { widthPercentage } from '../utilities/constants';
import colors from '../Theme/colors';

const ChangePasswordBottomSheet = ({ sheetRef }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <RBSheet
      ref={sheetRef}
      height={400}
      openDuration={250}
      customStyles={{
        container: styles.bottomSheetContainer,
      }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Change password</Text>
        <Text style={styles.inputHeading}>Old Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />
        <Text style={styles.inputHeading}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <Text style={styles.inputHeading}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.changePasswordButton}>
          <LinearGradient
            colors={['#9C31FD', '#56B6E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 10, borderRadius: 60 }}
          >
            <Text style={styles.changePasswordButtonText}>Change Password</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  changePasswordButton: {
    marginTop: 16,
    borderRadius: 25,
    width: widthPercentage(80),
    alignSelf: "center",
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center"
  },
  inputHeading:{
    marginBottom:10,
    fontSize:14,
    color:colors.black,
    fontWeight:"600"
  }
});

export default ChangePasswordBottomSheet;
