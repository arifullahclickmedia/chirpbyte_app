import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { widthPercentage } from '../utilities/constants';
import colors from '../Theme/colors';

const sounds = [
  'Sound 01',
  'Sound 02',
  'Sound 03',
  'Sound 04',
  'Sound 05',
];

const NotificationSoundBottomSheet = ({ sheetRef }) => {
  const [selectedSound, setSelectedSound] = useState('Sound 02');
  const [filteredSounds, setFilteredSounds] = useState(sounds);

  const renderSoundItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedSound(item)}>
      <View style={styles.soundItem}>
        <Text style={styles.soundText}>{item}</Text>
        {item === selectedSound && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <RBSheet
      ref={sheetRef}
      height={380}
      openDuration={250}
      customStyles={{
        container: styles.bottomSheetContainer
      }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Notifications Sound</Text>
        <FlatList
          data={filteredSounds}
          renderItem={renderSoundItem}
          keyExtractor={(item) => item}
        />
        <TouchableOpacity style={styles.saveButton}>
          <LinearGradient
            colors={['#9C31FD', '#56B6E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 10, borderRadius: 60 }}
          >
            <Text style={styles.SaveBtnTxt}>Save</Text>
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
    fontWeight:"700",
    marginBottom: 16,
    textAlign: 'center',
  },
  soundItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  soundText: {
    fontSize: 14,
    fontWeight:"500"
  },
  checkMark: {
    fontSize: 18,
    color: '#000000',
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 25,
    width: widthPercentage(80),
    alignSelf: "center",
  },
  SaveBtnTxt: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center"
  }
});

export default NotificationSoundBottomSheet;
