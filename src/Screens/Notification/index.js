import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../Theme/colors';
import NotificationSoundBottomSheet from '../../components/NotificationSoundBottomSheet';


const NotificationsScreen = () => {
    const navigation = useNavigation();
  const NotificationSoundSheetRef = useRef(null);

    const openChangeNotificationSheet = () => {
        NotificationSoundSheetRef.current.open();
      };
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

    const handleToggleSwitch = () => {
        setIsNotificationsEnabled(!isNotificationsEnabled);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.BackBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Notifications</Text>
            </View>
            <View style={styles.optionContainer}>
                <View style={styles.option}>
                    <Text style={styles.optionText}>Notifications</Text>
                    <Switch
                        value={isNotificationsEnabled}
                        onValueChange={handleToggleSwitch}
                        color={"#9C31FD"}
                    />
                </View>
                <TouchableOpacity style={styles.option} onPress={openChangeNotificationSheet}>
                    <Text style={styles.optionText}>Notifications Sound</Text>
                    <Icon name="chevron-right" size={24} color="#000" />
                </TouchableOpacity>
            </View>
      <NotificationSoundBottomSheet sheetRef={NotificationSoundSheetRef}/>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        padding: 16,
    },
    BackBtn: {
        position: "absolute",
        top: 16,
        left: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
        textAlign: "center"
    },
    optionContainer: {
        marginTop: 16,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
    },
    optionText: {
        fontSize: 16,
    },
});

export default NotificationsScreen;
