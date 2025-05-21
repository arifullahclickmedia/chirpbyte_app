import {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {LogoutUser} from './Methods';
import {removeLoginData} from '../Redux/authSlice';
import {useNavigation} from '@react-navigation/native';
import {Alert} from 'react-native';

export const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await LogoutUser();
    } catch (error) {
      console.error('ErrorInLogout:>>>>>>>>>>>>>', error);
    } finally {
      dispatch(removeLoginData());
      await AsyncStorage.removeItem('loginData');
      await AsyncStorage.clear();
      navigation.navigate('AfterSplash');
      setIsLoggingOut(false);
    }
  }, [dispatch, navigation]);

  const handleUnauthorized = () => {
    Alert.alert(
      'Login Expired',
      'Your session has expired. Please log in again.',
      [
        {
          text: 'OK',
          onPress: () => handleLogout(),
        },
      ],
      {cancelable: false},
    );
  };

  return {handleLogout, isLoggingOut, handleUnauthorized};
};
