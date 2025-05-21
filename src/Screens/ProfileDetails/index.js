import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Switch, List } from 'react-native-paper';
import LanguageBottomSheet from '../../components/LanguageBotomSheet';
import ChangePasswordBottomSheet from '../../components/ChangePasswordBottonSheet';
import styles from './styles';

const ProfileDetails = ({navigation}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const sheetRef = useRef(null);
  const changePasswordSheetRef = useRef(null);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const openLanguageSheet = () => {
    sheetRef.current.open();
  };

  const openChangePasswordSheet = () => {
    changePasswordSheetRef.current.open();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text onPress={()=> navigation.goBack()} style={styles.backButton}>{'<'}</Text>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RO</Text>
        </View>
        <Text style={styles.userName}>User Name</Text>
        <Text style={styles.onlineStatus}>● Online</Text>
      </View>
      <View style={styles.listContainer}>
        <List.Section>
          <List.Item
            title="Status"
            right={() => (
              <Switch 
                value={isSwitchOn} 
                onValueChange={onToggleSwitch} 
                color='#9C31FD'
              />
            )}
          />
          <List.Item
            onPress={()=>navigation.navigate("NotificationsScreen")}
         
            title="Notifications"
            right={() => <List.Icon icon="chevron-right" />}
          />
          <List.Item
            onPress={openChangePasswordSheet}
            title="Change password"
            right={() => <List.Icon icon="chevron-right" />}
          />
          <List.Item
            onPress={openLanguageSheet}
            title="Change languages"
            right={() => <List.Icon icon="chevron-right" />}
          />
        </List.Section>
      </View>
      <LanguageBottomSheet sheetRef={sheetRef} />
      <ChangePasswordBottomSheet sheetRef={changePasswordSheetRef} />
    </SafeAreaView>
  );
};



export default ProfileDetails;
