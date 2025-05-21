import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { Icons } from '../utilities/Images';
import { moderateScale } from '../utilities/Scales';
import colors from '../Theme/colors';
import Divider from './Divider';


const ChatHeader = () => {
    return (
        <View>

            <View style={styles.headerContainer}>
                <Text style={styles.iconContainer}>Chat</Text>
                <View style={styles.groupImageContainer}>
                    <Image
                        source={Icons.GroupChatIcons}
                        style={styles.groupImage}
                    />
                </View>
                <View style={styles.rightSpace} />
            </View>
            <Divider />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 15,
    },
    iconContainer: {
        paddingLeft: 10,
        fontSize: moderateScale(20),
        fontWeight: "800",
        color: colors.black
    },
    groupImageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    groupImage: {
        width: 100,
        height: 40,
        borderRadius: 20,
    },
    rightSpace: {
        width: 40, // Ensure there's enough space on the right
    },
});

export default ChatHeader;
