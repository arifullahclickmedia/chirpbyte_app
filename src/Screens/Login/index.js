import { View, Text, SafeAreaView, Alert, Image, Animated, Easing } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import { ErrorMessage, strings } from '../../utilities/Strings';
import Input from '../../components/Input';
import Button from '../../components/Button';
import GradientCheckbox from '../../components/CheckBox';
import { widthPercentage } from '../../utilities/constants';
import { FCMTokenAPI, LoginRequest } from '../../Services/Methods';
import { useDispatch } from 'react-redux';
import { setLoginData } from '../../Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showErrorMsg } from '../../components/Messages';
import Toast from 'react-native-toast-message';
import { postRequest } from '../../Services';
import messaging from '@react-native-firebase/messaging';

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState('');
  const [EmailError, setEmailError] = useState('');
  const [Password, setPassword] = useState('');
  const [PasswordError, setPasswordError] = useState('');
  const [checked, setChecked] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);

  const logoPosition = new Animated.Value(-200);
  const contentOpacity = new Animated.Value(0);

  const validateForm = () => {
    let email_error = null;
    let password_error = null;
    if (!Email) {
      email_error = ErrorMessage.EmailRequired;
    }
    if (!Password) {
      password_error = ErrorMessage.PasswordRequired;
    }
    setEmailError(email_error);
    setPasswordError(password_error);
    if (!email_error && !password_error) {
      setEmailError('');
      setPasswordError('');
      return true;
    }
    return false;
  };

  useEffect(() => {

    Animated.sequence([
      Animated.timing(logoPosition, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();


    const checkLoginStatus = async () => {
      try {
        const storedData = await AsyncStorage.getItem('loginData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          dispatch(setLoginData({
            user: parsedData.user,
            token: parsedData.token,
            IsSignedIn: true
          }));
          navigation.replace('home'); // Navigate to home if logged in
        }
      } catch (error) {
        Alert.alert(error);
        console.error('Error checking login status:', error);
      }
    };
    checkLoginStatus();
  }, [dispatch, navigation]);

  const handleSubmit = () => {
    const isValid = validateForm();
    console.log("isValid ==>", isValid);
    if (!isValid) {
      return;
    } else {
      LoginUser();
    }
  };

  const LoginUser = async () => {
    setIsLoading(true);
    let payload = {
      email: Email,
      password: Password,
    };
    try {
      const response = await LoginRequest(payload);
      //console.log("Login Response ==>",JSON.stringify(response,null,4));
      setIsLoading(false);
      if (response.status == 201) {
        Alert.alert(response?.data?.message + " " + "Check email and password ");
      } else if (response?.status == 200) {
        // console.log("Login Response ==>",JSON.stringify(response?.data,null,4));
        if (checked) {
          try {
            const loginData = JSON.stringify({
              user: response.data.user,
              token: response.data.token,
            });
            await AsyncStorage.setItem('loginData', loginData);
            console.log("loginData ==>", JSON.stringify(loginData, null, 4));
          } catch (error) {
            console.error('Error saving login data:', error);
          }
        }
        dispatch(setLoginData({
          user: response.data.user,
          token: response.data.token,
          status: response.data.status,
          permissions: response.data.permissions,
          IsSignedIn: checked
        }));
        // navigation.replace('home');
        const firebaseToken = await messaging().getToken();
        let payload = {
          device_token: firebaseToken
        }
        const storeToken = await FCMTokenAPI(payload);
        //console.log("storeTokenResponse", storeToken);
        if (storeToken.status === 200) {
          console.log("Token stored successfully:", storeToken);
          navigation.replace('home');
        } else {
          Alert.alert("Failed to store device token");
        }
      } else {
        //console.log("ErrorMessage", ErrorMessage);
        Alert.alert(ErrorMessage.WentWrong);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      //console.log("Error", JSON.stringify(error.response, null, 2));
      setIsLoading(false);
      Alert.alert(errorMessage)
    }

  };

  return (
    <SafeAreaView style={styles.Container}>
      <Animated.Image
        source={require('../../assets/Image/LogoGradient.png')}
        style={[
          {
            width: 100,
            height: 100,
            resizeMode: 'contain',
            transform: [{ translateY: logoPosition }],
          },
        ]}
      />
      <Animated.View style={{ opacity: contentOpacity, alignItems: "center" }}>
        <Text style={styles.LoginHeadingTxt}>{strings.Login}</Text>
        <Text style={styles.HeadingDecTxt}>{strings.Welcomeback}</Text>
        <View>
          <Text style={styles.InputHeading}>{strings.EmailAddress}</Text>
          <Input
            placeholder={''}
            secureTextEntry={false}
            onchange={value => {
              setEmail(value);
              setEmailError('');
            }}
            value={Email}
            errorMessage={EmailError}
            disabled={IsLoading}
          />
        </View>
        <View>
          <Text style={styles.InputHeading}>{strings.Password}</Text>
          <Input
            placeholder={''}
            rightIcon={true}
            onchange={value => {
              setPassword(value);
              setPasswordError('');
            }}
            value={Password}
            errorMessage={PasswordError}
            disabled={IsLoading}
          />
        </View>
        <View style={{ width: widthPercentage(90) }}>
          <GradientCheckbox
            title={strings.KeepSignIn}
            checked={checked}
            onChange={setChecked}
          />
        </View>
        <View style={{ width: widthPercentage(90), alignItems: "center" }}>
          <Button Title={'Login'} loading={IsLoading} onPress={() => handleSubmit()} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
