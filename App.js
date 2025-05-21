import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TextInput, LogBox, AppState, Vibration, AppRegistry, Platform } from 'react-native';
import SplashScreen from './src/Screens/SplashScreen';
import { Provider, useSelector } from 'react-redux';
import AuthStack from './src/navigation/AuthStack';
import HomeStack from './src/navigation/HomeStack';
import store, { persistor } from './src/Redux/store';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { displayFaceBookNotification, displayInstagramNotification, displayNotification, displayPingNotification, displaySocialNotification, displayTransferNotification, displayWhatsappNotification, setupNotificationHandlers } from './src/Services/notificationService';
import useSocket from './src/Services/useSocket';
import { navigationRef } from './src/Services/rootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pusherConnect } from './src/utilities/pusherHelper';
import { Pusher } from '@pusher/pusher-websocket-react-native';
import { assignUserMessage, removeUserFromLists, setAddUserToAssignList, setPusher, updatePermissions } from './src/Redux/authSlice';
import { PersistGate } from 'redux-persist/integration/react';
import { FacebookNewMessage, InstagramNewMessage, WhatsappNewMessage } from './src/Services/Methods';
import Toast from 'react-native-toast-message';
import PushNotification from 'react-native-push-notification';
import { postRequest } from './src/Services';
const Stack = createNativeStackNavigator();

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [VisitorList, setVisitorList] = useState([]);
  const [session, setSession] = useState(null);
  const { socket, onEvent } = useSocket();
  const reduxUser = store.getState().auth.user;
  const permissions = store.getState().auth.permissions;

  const checkLoginStatus = async () => {
    try {
      const storedData = await AsyncStorage.getItem('loginData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.token) {
          setIsSignedIn(true);
        } else {
          setIsSignedIn(false);
        }
      } else {
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };


  useEffect(() => {
    const checkStorage = async () => {
      const checkLoginInterval = setInterval(async () => {
        await checkLoginStatus();
      }, 1000);

      return () => clearInterval(checkLoginInterval);
    };
    checkStorage();
  }, []);

  LogBox.ignoreAllLogs(true);

  if (Text.defaultProps) {
    Text.defaultProps.allowFontScaling = false;
  } else {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }

  if (TextInput.defaultProps) {
    TextInput.defaultProps.allowFontScaling = false;
  } else {
    TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
  }

  useEffect(() => {

    const connectPusher = async () => {
      var pusher = Pusher.getInstance();


      await pusher.init({
        apiKey: '8e67f2f0bc2ab4dd3e1e',
        cluster: 'eu',
        onEvent,
      });

      const channelName = 'socialMessage';
      const myChannel = await pusher.subscribe({
        channelName: channelName,
        onEvent: (event) => {
          const reduxUser1 = store.getState().auth.user;
          const permissions1 = store.getState().auth.permissions;
          let parsedData;

          try {

            if (event?.data && event?.data.includes('platform') && event?.data.includes('whatsapp')) {
              parsedData = JSON.parse(event.data);

              const messageDetails = parsedData.message.messages[0];
              const contactName = parsedData.message.contacts[0].profile.name;
              const phoneNumber = parsedData.message.metadata.display_phone_number;
              const messageText = messageDetails.text.body


              if (permissions1?.whatsapp !== false || reduxUser1?.mainuser === 1) {
                displaySocialNotification(`Whatsapp: ${contactName}`, messageText, parsedData.message.id);
              }

            } else {
              parsedData = event.data;

              const parsedNotificationData = JSON.parse(event.data);
              if (parsedNotificationData.message) {
                console.log("PLATFORM ==>", parsedNotificationData.message.platform);
                if (parsedNotificationData.message.platform === 'instagram') {
                  if (permissions1?.instagram !== false || reduxUser1?.mainuser === 1) {
                    displaySocialNotification(`Instagram`, `${parsedNotificationData.message.message}`, parsedNotificationData);
                  }

                } else if (parsedNotificationData.message.platform === 'facebook') {
                  if (permissions1?.facebook !== false || reduxUser1?.mainuser === 1) {
                    displaySocialNotification(`Facebook`, `${parsedNotificationData.message.message}`, parsedNotificationData);
                  }
                }
              } else {
                console.error("Message property is undefined in parsed data.");
              }
            }

            store.dispatch(
              setPusher({
                ...event,
                data: parsedData,
              })
            );

          } catch (error) {
            console.error("Error processing event data:", error);
          }
        }
      });

      // Connect to Pusher
      await pusher.connect();
      console.log('Connected');

      // Cleanup function
      return async () => {
        console.log('Disconnecting');
        await pusher.unsubscribe({ channelName });
        await pusher.disconnect();
        console.log('Disconnected');
      };
    };

    const cleanup = connectPusher();

    return () => {
      cleanup.then((fn) => fn()).catch((err) => console.log("Cleanup error", err));
    };
  }, []);

  // Firebase notifications setup
  const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    //Vibration.vibrate();
    //console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });


  useEffect(() => {
    if (!isSignedIn) return;

    requestUserPermission();
    GetFirebaseToken()


  }, [isSignedIn]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    //console.log('status:', authStatus);
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Firebase Notification permission granted');
      GetFirebaseToken();
    }
  }

  const GetFirebaseToken = async () => {
    try {
      const firebaseToken = await messaging().getToken();
      console.log("Firebase Token:", firebaseToken);
      //await storeToken(firebaseToken);
    } catch (error) {
      console.error('Error getting Firebase Token:', error);
    }
  };


  // Notifee notifications setup
  useEffect(() => {
    async function requestPermissions() {
      const settings = await notifee.requestPermission();
    }
    requestPermissions();
    setupNotificationHandlers();
  }, []);

  // Notifee notifications setup
  useEffect(() => {
    async function setupNotificationChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        importance: AndroidImportance.HIGH,
        vibrationPattern: [300, 500, 300, 500],
      });
    }
    setupNotificationChannel();
  }, []);

  async function displayNotification(title, body, data) {
    //console.log('Displaying notification:', title, body, data);
    Vibration.vibrate(500);
    await notifee.displayNotification({
      title,
      body,
      data,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [300, 500, 300, 500],
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        sound: 'default',
      },
    });
  }

  useEffect(() => {
    async function requestPermissions() {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= notifee.AuthorizationStatus.ALLOWED) {
        console.log('Notifee Notification permissions granted');
      } else {
        console.log('Notifee Notification permissions denied');

      }
    }
    requestPermissions();
    setupNotificationHandlers();
  }, []);

  

  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  //   Vibration.vibrate([500, 500, 500]);
  //   //handleUserMessage(remoteMessage)
  //  // triggerVibration();
  //   //displayNotification(remoteMessage.notification?.title, remoteMessage.notification?.body, remoteMessage.data);
  // });
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Received background message:', remoteMessage);
  
  //   // Ensure channel exists
  //   await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //     vibration: true, 
  //     sound: 'default',
  //     importance: AndroidImportance.HIGH,
  //   });
  
  //   // Display local notification
  //   await notifee.displayNotification({
  //     title: remoteMessage?.data?.message || 'New Notification',
  //     body: remoteMessage.notification?.body || 'You have a new message',
  //     android: {
  //       channelId: 'default',
  //       smallIcon: 'ic_launcher',
  //       vibrationPattern: [300, 500], 
  //       sound: 'default',
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // });

  const triggerVibration = () => {
    console.log("Vibration Triggered!");
    Vibration.vibrate([500, 500, 500]); // Vibrate for 500ms, pause for 500ms, vibrate for 500ms
  };
  // Socket events for messages
  useEffect(() => {
    console.log("Socket Connected:", socket.connected);

   // if (!socket) return;
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    //   //Vibration.vibrate([500, 500, 500]);
    //   //handleUserMessage(remoteMessage)
    //   triggerVibration();
    //   //displayNotification(remoteMessage.notification?.title, remoteMessage.notification?.body, remoteMessage.data);
    // });
  //   notifee.onBackgroundEvent(async ({ type, detail }) => {
  //     console.log('onBackgroundEvent', JSON.stringify(type, detail));
  //     if (type === EventType.DELIVERED) {  // Instead of ACTION_PRESS
  //       Vibration.vibrate([500, 500, 500]);
  //        // triggerVibration();
  //     }
  // });

    messaging().onMessage(async remoteMessage => {
      console.log('onMessage', JSON.stringify(remoteMessage));
      Vibration.vibrate([500, 500, 500]);
      //handleUserMessage(remoteMessage)
     // triggerVibration();
      //displayNotification(remoteMessage.notification?.title, remoteMessage.notification?.body, remoteMessage.data);
    });

   

    const handleUserMessage = data => {
      console.log('User message arrived:', data);
      //triggerVibration();
     // console.log('User message arrived:', data);
      if (data.optId == 0 || data.optId == reduxUser.id) {
        setChatMessages(prevMessages => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            type: 'received',
            message: data.message,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setSession(data);
         setupNotificationHandlers()
       // displayNotification(data.name, data.message, data);
      }
    };
    const handleAdminMessage = data => {
      console.log('admin message arrived:', data);
      if (data.optId == 0 || data.optId == reduxUser.id) {
        setChatMessages(prevMessages => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            type: 'received',
            message: data.message,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setSession(data);
        // setupNotificationHandlers()
        //displayNotification(data.name, data.message, data);
      }
    };

    const handleVisitorMessage = data => {
      // console.log('Visitor message arrived:', data);
      setVisitorList(prevList => [
        ...prevList,
        {
          id: Date.now().toString(),
          ...data,
        },
      ]);
      setSession(data.session);
      //displayPingNotification('New Visitor Arrived', 'go Grab it!', data.session);
    };
    const handleAssignMessage = data => {
      const message = data.message;
      const platform = data.platform;
      // WHEN A CHAT TRANSFERRED TO YOU
      if ((data.operatorid == reduxUser.id) && (data.assigneeid !== reduxUser.id)) {
        // console.log(" USER MATCHED ====>",data.operatorid);
        // console.log(" OPERATOR MATCHED ====>",reduxUser.id);
        if (data.platform === "insta" || data.platform === "instagram") {
          const GetInstagramNewInboxMessages = async () => {

            try {
              const response = await InstagramNewMessage(data.convid);
              const apiData = response?.data?.data;
              const userName = response?.data?.data?.from_name;
              const phoneNumber = response?.data?.data?.page_name;

              if (response?.data?.status == "200" && permissions?.instagram !== false) {

                displayTransferNotification(platform, userName, phoneNumber, message, apiData);
                const updatedData = { ...apiData, platform }
                store.dispatch(
                  setAddUserToAssignList({
                    ...updatedData
                  })
                );
              }

            } catch (error) {
              if (error.response?.status === 401) {
                console.log('TOKEN EXPIRED !');
              } else {
                console.log(error);
              }
            }
          };
          GetInstagramNewInboxMessages();
        }
        else if (data.platform === "fb" || data.platform === "facebook") {
          const GetFacebookNewInboxMessages = async () => {

            try {
              const response = await FacebookNewMessage(data.convid);
              const apiData = response?.data?.data;
              const userName = response?.data?.data?.from_name;
              const phoneNumber = response?.data?.data?.page_name;

              if (response?.data?.status == "200" && permissions?.facebook !== false) {

                displayTransferNotification(platform, userName, phoneNumber, message, apiData);
                const updatedData = { ...apiData, platform }
                store.dispatch(
                  setAddUserToAssignList({
                    ...updatedData
                  })
                );
              }

            } catch (error) {
              if (error.response?.status === 401) {
                console.log('TOKEN EXPIRED !');
              } else {
                console.log(error);
              }
            }
          };
          GetFacebookNewInboxMessages();
        }
        else if (data.platform === "whatsapp" || data.platform === "Whatsapp") {

          const GetWhatsappNewInboxMessages = async () => {

            try {
              const response = await WhatsappNewMessage(data.convid);
              const apiData = response?.data?.data;
              const userName = response?.data?.data?.from_name;
              const phoneNumber = response?.data?.data?.phone_number;

              // console.log("NEW USER NAME =====>",userName);

              if (response?.data?.status == "200" && permissions?.whatsapp !== false) {

                displayTransferNotification(platform, userName, phoneNumber, message, apiData);
                const updatedData = { ...apiData, platform }
                store.dispatch(
                  setAddUserToAssignList({
                    ...updatedData
                  })
                );
              }

            } catch (error) {
              if (error.response?.status === 401) {
                console.log('TOKEN EXPIRED !');
              } else {
                console.log(error);
              }
            }
          };
          GetWhatsappNewInboxMessages();
        }
        else {
          displaySocialNotification(data.platform, data.message, data);
        }

      }
      else if ((data.operatorid !== reduxUser.id) && (data.assigneeid !== reduxUser.id)) {
        // WHEN SOMEONE ASSIGNED THE CHAT

        // console.log(" USER NOT MATCHED ====>",data.operatorid);
        // console.log(" OPERATOR NOT MATCHED ====>",reduxUser.id);

        console.log("Removing dispatch ")
        store.dispatch(
          removeUserFromLists({
            ...data
          })
        );
      }
      else if ((data.operatorid !== reduxUser.id) && (data.assigneeid == reduxUser.id)) {
        // WHEN I TRANSFER THE CHAT TO SOMEONE
        // console.log(" USER NOT MATCHED ====>",data.operatorid);
        // console.log(" OPERATOR NOT MATCHED ====>",reduxUser.id);

        store.dispatch(
          removeUserFromLists({
            ...data
          })
        );
      }
      else if ((data.assigneeid == reduxUser.id) && (data.operatorid == reduxUser.id)) {
        // WHEN I ASSIGNED A CHAT
        // Move user to assigned list
        store.dispatch(
          assignUserMessage({
            ...data
          })
        );
      }
    };

    socket.on('userMessageToClient', handleUserMessage);
    // socket.on('userMessageToClient',displayNotification);
    socket.on('adminMessageToClient', handleAdminMessage);
   
    // if (permissions?.visitor !== false) {
    onEvent('userConnectedToClient', handleVisitorMessage);
    // }
    const handlePermissions = (data) => {
      console.log("Permissions Data for updations:", JSON.stringify(data, null, 4));
      store.dispatch(updatePermissions({ permissions: data.permissions }));
      console.log("Permissions in State Updated:", permissions);
      Alert.alert("Permissions Updated ! Restart the app for better user.")
    };
    socket.on('notificationsToClient', handleAssignMessage);
    socket.on("permissionsToClient", handlePermissions)
    return () => {
      socket.off('userMessageToClient', handleUserMessage);
      socket.off('adminMessageToClient', handleAdminMessage);
      socket.off('userConnectedToClient', handleVisitorMessage);
      socket.off('notificationsToClient', handleAssignMessage);
      socket.off("permissionsToClient", handlePermissions);
      unsubscribeOnMessage()
    };
  }, [onEvent, socket, isSignedIn]);
  

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="splash"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="splash" component={SplashScreen} />
            <Stack.Screen name="home" component={HomeStack} />
            <Stack.Screen name="AfterSplash" component={AuthStack} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </PersistGate>
    </Provider>
  );
}

export default App;
