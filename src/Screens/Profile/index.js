import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {NetworkInfo} from 'react-native-network-info';
import {LogoutUser, ProfileRequest} from '../../Services/Methods';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearAllState, removeLoginData, setProfileData } from '../../Redux/authSlice';
import { persistor } from '../../Redux/store';
import { useIsFocused } from '@react-navigation/native';
import { useLogout } from '../../Services/useLogout';

export default function Profile({navigation}) {
  const [IpAddress, setIpAddress] = useState('');
  const [isProfileData, setIsProfileData] = useState(null);
  const {user, token, status} = useSelector(state => state.auth);
  const [IsLoading, setIsLoading] = useState(false);
  const dispatch=useDispatch();
  const {handleLogout, isLoggingOut} = useLogout();
 
  // Access profile data from Redux
  const ProfileData = useSelector((state) => state.auth.profileData);

  // Fetch profile data on screen focus
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await ProfileRequest();
        if (response?.data?.status === 'success') {
          // Dispatch the profile data to Redux
          dispatch(setProfileData(response.data.data));
        } else {
          console.error('API responded with an unexpected status:', response?.data?.status);
        }
      } catch (error) {
        console.error('Error during Profile Fetching:', error.message || error);
      }
    };
      fetchProfileData();
   
  }, [ dispatch]); // Include dispatch in dependencies

  // Log Profile Data
  // useEffect(() => {
  //   console.log('PROFILE _ DATA ==>', JSON.stringify(ProfileData, null, 4));
  // }, [ProfileData]);

  // useEffect(() => {
  //   // console.log("MY-DATA ==>",JSON.stringify(user,null,4));
  //   NetworkInfo.getIPAddress().then(ipAddress => {
  //     setIpAddress(ipAddress);
  //     // console.log(ipAddress);
  //   });
  // }, []);

  // useEffect(() => {
  //   console.log("User Picture URL: ", user?.picture);
  // }, [user]);
  const baseUrl = 'https://panel.chirpbyte.com/api/';  // Base URL for images
const imageUrl = user?.picture 
  ? `${baseUrl}${user.picture}`  // Combine base URL with the image filename
  : require('../../assets/Image/globe_avatar.jpeg');  // Default avatar if no image
  
  const Logout = async () => {
    setIsLoading(true);
    try {
      const response = await LogoutUser();
      setIsLoading(false);
      if (response?.status == 200) {

        // clearing all states 
        dispatch(clearAllState()); 
       console.log("Clearing all states");

        dispatch(removeLoginData())
      // Clear AsyncStorage completely
      await AsyncStorage.clear();
      console.log("Async Storage Cleared!");

      // Purge persisted Redux state
      // await persistor.purge();
      // console.log("Persistor Storage Cleared!");
      
        await AsyncStorage.removeItem('loginData');
        navigation.navigate("AfterSplash");
      } else {
        Alert.alert(ErrorMessage.WentWrong);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      console.error('Error during logout:', errorMessage);
      if(errorMessage === 'Unauthenticated.'){
        handleLogout();
      }else{
        Alert.alert(errorMessage);
      }
    }
  };
  
  const truncateString = (str, maxLength = 35) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {/* <Text style={styles.initials}>O</Text> */}
          <Image 
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} 
            style={{width: 80, height: 80, borderRadius: 40, resizeMode: "cover"}}
          />
        </View>
        <Text style={styles.userName}>{truncateString(user?.name)}</Text>
        <Text style={styles.userEmail}>{truncateString(user?.email)}</Text>
      </View>
      <View style={styles.iconContainer}>
       {/*  <TouchableOpacity
          onPress={() => navigation.navigate('ProfileDetails')}
          style={[styles.iconButton, {backgroundColor: '#E5E5E5'}]}>
          <Icon name="exchange" size={20} color="#000" />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => Logout()}
          style={[styles.iconButton, {backgroundColor: '#FFD6D7'}]}>
          <Icon name="sign-out" size={20} color="#FF3D00" />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>FullName</Text>
          <Text style={styles.infoValue}>{truncateString(ProfileData?.fullName)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Company</Text>
          <Text style={styles.infoValue}>{truncateString(ProfileData?.company)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Address</Text>
          <Text style={styles.infoValue}>{truncateString(ProfileData?.address)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Category</Text>
          <Text style={styles.infoValue}>{truncateString(ProfileData?.category)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Organization Contact</Text>
          <Text style={styles.infoValue}>{ProfileData?.phoneNo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Company Site</Text>
          <Text style={styles.infoValue}>{ProfileData?.website}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Communication Type</Text>
          <Text style={styles.infoValue}>{ProfileData?.communicationType}</Text>
        </View>
        {/* <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>IP Address</Text>
          <Text style={styles.infoValue}>{truncateString(IpAddress)}</Text>
        </View> */}
      </View>
      {/* <TouchableOpacity style={styles.blockButton}>
        <Text style={styles.blockButtonText}>Block User</Text>
      </TouchableOpacity> */}
      <Loader loading={IsLoading || isLoggingOut} />
    </SafeAreaView>
  );
}
