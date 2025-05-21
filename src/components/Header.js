import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { Icons } from '../utilities/Images'
import { fontSizes } from '../utilities/constants'
import colors from '../Theme/colors'
import Divider from './Divider'
export default function Header({ title, navigation }) {
    return (
        <View style={styles.HeaderContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.BackArrowBtn}>
                <MaterialIcons name="chevron-left" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={{ justifyContent: "center" }}>
                <Text style={styles.HeaderTitle}>{title}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    HeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 5,
        marginTop: 10
    },
    HerderRightIconsImg: {
        width: 20,
        height: 20
    },
    HeaderTitle: {
        fontSize: fontSizes.h2,
        color: colors.primary,
        fontWeight: "700"
    },
    BackArrowBtn: {
        backgroundColor: colors.primary,
        borderRadius: 5
    }

})