import {View, Text, SafeAreaView, Image} from 'react-native';
import React, {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { Images } from '../../utilities/Images';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLoginData } from '../../Redux/authSlice';

export default function SplashSccreen({navigation}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedData = await AsyncStorage.getItem('loginData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          dispatch(setLoginData({
            user: parsedData.user,
            token: parsedData.token,
            IsSignedIn: true,
          }));
          navigation.replace('home'); // Navigate to home if logged in
        } else {
          navigation.replace('AfterSplash'); // Navigate to login if not logged in
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigation.replace('AfterSplash'); // Fallback to login if error
      }
    };

    checkLoginStatus();
  }, [dispatch, navigation]);
  return (
    <SafeAreaView style={styles.contianer}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{flex: 1,justifyContent:"center",alignItems:"center"}}
        colors={['#9C31FD', '#56B6E9']}>
        {/* <Text style={{color:"white"}}>Version 1.0.22 - DragonFly</Text> */}
        <Image
        source={Images.AppLogo}
        style={{width:200,height:200}}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}
