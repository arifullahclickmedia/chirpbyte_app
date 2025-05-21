import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function InboxHeader({ Assign, showAvatar = true, showDropdown = true, ShowSearch = true, onDropdownPress }) {
  // Determine visibility based on `Assign` value
  const shouldShowAvatar = Assign !== 'Unassigned';
  const shouldShowDropdown = Assign !== 'Unassigned';
  const shouldShowSearch = Assign === 'Unassigned' && ShowSearch;

  return (
    <View style={styles.contentWrapper}>
      <SafeAreaView />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Icon name="arrow-left" size={20} color="#000" />
          <Text style={styles.HeaderText}>{Assign}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
          {shouldShowSearch && <Icon name="magnify" size={20} color="#000" />}
          {shouldShowAvatar && (
            <View style={{ position: 'relative' }}>
              <Image source={require('../assets/Image/ProfileAvatar.jpeg')} style={styles.avatar} />
              <View style={styles.greenCircle} />
            </View>
          )}
          {shouldShowDropdown && (
            <TouchableOpacity onPress={onDropdownPress}>
              <Icon name="chevron-down" size={20} color="#A8A8A8" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    padding: 16,
  },
  HeaderText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 22,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16, 
  },
  greenCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'green',
    width: 10,
    height: 10,
    borderRadius: 5, 
    borderColor: 'green',
    borderWidth: 2, 
  },
});
