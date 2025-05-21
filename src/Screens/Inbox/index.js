import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Avatar, Badge } from 'react-native-paper';
import colors from "../../Theme/colors";
import styles from './styles';
import { InboxMessages } from '../../Services/Methods';

const getRandomColor = () => {
  const colors = ['#F48FB1', '#CE93D8', '#FFAB91', '#81D4FA', '#A5D6A7', '#FFCDD2', '#B39DDB'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const InboxScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('All Messages');
  const [searchText, setSearchText] = useState('');
  const [inboxMessage, setInboxMessage] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [Refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    GetInboxMessages();
  }, []);
  
  const GetInboxMessages = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await InboxMessages(); // Call your API function
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setIsLoading(false);
      }
      if (response?.status === 200) {
        setInboxMessage(response?.data?.data); // Set the inbox messages from API response
        // console.log("DATA ==>", JSON.stringify(response?.data?.data, null, 4));
      } else {
        setInboxMessage([]);
        Alert.alert("Error", "Failed to fetch messages.");
      }
    } catch (error) {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setIsLoading(false);
      }
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const filterMessages = () => {
    let filteredMessages = inboxMessage; // Use inboxMessage from API

    if (activeTab !== 'All Messages') {
      filteredMessages = filteredMessages.filter(message => message.platform === activeTab);
    }

    if (searchText) {
      filteredMessages = filteredMessages.filter(message =>
        message.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filteredMessages;
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ChatScreen")} style={styles.messageContainer}>
      <View style={[styles.avatar, { backgroundColor: getRandomColor() }]}>
        <Text style={styles.avatarText}>{item?.name?.charAt(0) || ''}</Text>
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.lastmessage}</Text>
      </View>
      <View style={styles.messageInfo}>
        {!item.isRead && <Badge style={styles.badge}>1</Badge>}
        <Text style={styles.time}>{item.mtime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, activeTab !== 'All Messages' && styles.inactiveTab]} onPress={() => setActiveTab('All Messages')}>
          <LinearGradient
            style={styles.gradientStyle}
            colors={activeTab === 'All Messages' ? ['#9C31FD', '#56B6E9'] : ['#FFFFFF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.tabText, activeTab === 'All Messages' && styles.activeTabText]}>
              All Messages (10)
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab !== 'Ola Chat' && styles.inactiveTab]} onPress={() => setActiveTab('Ola Chat')}>
          <LinearGradient
            style={styles.gradientStyle}
            colors={activeTab === 'Ola Chat' ? ['#9C31FD', '#56B6E9'] : ['#FFFFFF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.tabText, activeTab === 'Ola Chat' && styles.activeTabText]}>
              Ola Chat (5)
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab !== 'Instagram' && styles.inactiveTab]} onPress={() => setActiveTab('Instagram')}>
          <LinearGradient
            style={styles.gradientStyle}
            colors={activeTab === 'Instagram' ? ['#9C31FD', '#56B6E9'] : ['#FFFFFF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.tabText, activeTab === 'Instagram' && styles.activeTabText]}>
              Instagram
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#B0B0B0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={"#B0B0B0"}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filterMessages()}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()} // Ensure keyExtractor returns a string
        contentContainerStyle={styles.messagesList}
      />
    </SafeAreaView>
  );
};

export default InboxScreen;
