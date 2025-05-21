import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { widthPercentage } from '../utilities/constants';
import colors from '../Theme/colors';

const languages = [
  'English (Australia)',
  'English (Canada)',
  'English (India)',
  'English (Ireland)',
  'English (New Zealand)',
  'English (Singapore)',
  'English (South Africa)',
  'English (US)',
  'Deutsch',
  'Italiano',
  'Nederlands',
];

const LanguageBottomSheet = ({ sheetRef }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [filteredLanguages, setFilteredLanguages] = useState(languages);

  const renderLanguageItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedLanguage(item)}>
      <View style={styles.languageItem}>
        <Text style={styles.languageText}>{item}</Text>
        {item === selectedLanguage && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );

  const handleSearch = (text) => {
    const filtered = languages.filter(language =>
      language.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLanguages(filtered);
  };

  return (
    <RBSheet
      ref={sheetRef}
      height={450}
      openDuration={250}
      customStyles={{
        container: styles.bottomSheetContainer
      }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Select Language</Text>
        <View style={styles.searchContainer}>
          <EvilIcons name="search" size={24} color="black" style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            onChangeText={handleSearch}
          />
        </View>
        <FlatList
          data={filteredLanguages}
          renderItem={renderLanguageItem}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  languageText: {
    fontSize: 14,
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

export default LanguageBottomSheet;
