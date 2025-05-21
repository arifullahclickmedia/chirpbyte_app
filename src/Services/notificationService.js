import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigate } from './rootNavigation'; // Adjust the path as needed
import { setPingPressed } from '../Redux/authSlice';
import store from '../Redux/store';
import { Vibration } from 'react-native';
// 

// Helper function to navigate to chat screen with dynamic session ID
const handleOpenChat = (data) => {
  console.log('Open Chat button pressed with sessionId:', JSON.stringify(data, null, 4));
  navigate('ChatScreen', { data });
  console.log('Navigated to ChatScreen!', JSON.stringify(data, null, 4));
};

// Function to register notification categories for iOS
const registerNotificationCategoriesChatAction = async () => {
  await notifee.setNotificationCategories([
    {
      id: 'chat_category',
      actions: [
        {
          id: 'open-chat',
          title: 'Open Chat',
          foreground: true,
        },
      ],
    },
  ]);
};
const registerNotificationCategoriesPingAction = async () => {
  await notifee.setNotificationCategories([
    {
      id: 'ping_category',
      actions: [
        {
          id: 'ping_action',
          title: 'Ping',
          foreground: true,
        },
      ],
    },
    {
      id: 'chat_category',
      actions: [
        {
          id: 'open-chat',
          title: 'Open Chat',
          foreground: true,
        },
      ],
    },
  ]);
};

// Setup notification handlers for foreground and background events
export const setupNotificationHandlers = (emitEvent) => {


  notifee.onForegroundEvent(({ type, detail }) => {
    triggerVibration();
    const data = detail.notification.data;
    const sessionId = detail.notification.data.sessionId; // Extract session ID
    if (type === EventType.ACTION_PRESS) {
      if (detail.pressAction.id === 'open-chat') {
        handleOpenChat(data);
      } else if (detail.pressAction.id === 'ping_action') {
        // console.log('storeSession',JSON.stringify(store.getState(),null,4));
        // console.log('Name:', store.getState().auth.user.name);

        store.dispatch(setPingPressed(data))
      }
    }

  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    triggerVibration();
    const data = detail.notification.data;
    const sessionId = detail.notification.data.sessionId; // Extract session ID
    if (type === EventType.ACTION_PRESS) {
      if (detail.pressAction.id === 'open-chat') {
        handleOpenChat(data);
      } else if (detail.pressAction.id === 'ping_action') {
        console.log('storeSession', JSON.stringify(store.getState(), null, 4));
        store.dispatch(setPingPressed(data))
      }
    }
  });
  // Register notification categories for iOS
  registerNotificationCategoriesPingAction()
};
// Function to play sound
// const playNotificationSound = () => {
//   const sound = new Sound('notification_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
//     if (error) {
//       console.log('Failed to load the sound', error);
//       return;
//     }
//     sound.play((success) => {
//       if (success) {
//         console.log('Sound played successfully');
//       } else {
//         console.log('Sound playback failed');
//       }
//     });
//   });
// };

// Function to trigger vibration
const triggerVibration = () => {
  Vibration.vibrate([500, 500, 500]); // Vibrate for 500ms, pause for 500ms, vibrate for 500ms
};

// Function to display notifications
// export const displayNotification = async (title, body, data) => {
//   console.log('displayNotification-Calling', );
//   Vibration.vibrate([500, 500, 500]);
//   try {
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       sound: 'default',
//       vibration: true,
//       importance: AndroidImportance.HIGH,
//       vibrationPattern: [300, 500],
//     });

//     await notifee.displayNotification({
//       title,
//       body,
//       data: {
//         data
//       },
//       android: {
//         // Reference the name created (Optional, defaults to 'ic_launcher')
//         smallIcon: 'icon_notification_blue',
//         // Local image
//         largeIcon: require('../assets/Icons/largeIcon_blue.png'),
//         // largeIcon: require('../assets/Icons/largeIcon_white.png'),
//         sound: 'default', 
//         vibration: true, 
//         channelId,
//         actions: [
//           {
//             title: 'Open Chat',
//             pressAction: {
//               id: 'open-chat',
//               launchActivity: 'default',
//             },
//           },
//         ],
//       },
//       ios: {
//         //  categoryId: 'chat_category', /// chat message and ping button in enable with this id 
//         categoryId: 'chat_category',
//         sound: 'default',
//         foregroundPresentationOptions: {
//           badge: true,
//           sound: true,
//           banner: true,
//           list: true,
//         },
//         actions: [
//           {
//             title: 'Open Chat',
//             id: 'open-chat',
//             foreground: true,
//           },
          
//         ],
//       },
//     });

   
//   } catch (error) {
//     console.error('Error displaying notification:', error);
//   }
// };
export const displayNotification = async (title, body, data) => {
  console.log('displayNotification-Calling');

  // React Native Vibration Trigger (Foreground Only)
  Vibration.vibrate([500, 500, 500]);

  try {
    // Create notification channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [300, 500], // Define your vibration pattern here
    });

    // Display the notification
    await notifee.displayNotification({
      title,
      body,
      data: {
        data
      },
      android: {
        smallIcon: 'icon_notification_blue',
        largeIcon: require('../assets/Icons/largeIcon_blue.png'),
        sound: 'default', 
        vibrationPattern: [300, 500], 
        channelId,
        actions: [
          {
            title: 'Open Chat',
            pressAction: {
              id: 'open-chat',
              launchActivity: 'default',
            },
          },
        ],
      },
      ios: {
        categoryId: 'chat_category',
        sound: 'default',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
        actions: [
          {
            title: 'Open Chat',
            id: 'open-chat',
            foreground: true,
          },
        ],
      },
    });

  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};

// Function to display ping notifications
export const displayPingNotification = async (title, body, sessionId) => {
  Vibration.vibrate([500, 500, 500]);
  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      vibration: true,
      vibrationPattern: [500, 500, 500],
    });

    await notifee.displayNotification({
      title,
      body,
      data: {
        sessionId,  // Ensure session ID is passed as part of notification data
      },
      android: {
        // Reference the name created (Optional, defaults to 'ic_launcher')
        smallIcon: 'icon_notification_blue',
        // Local image
        largeIcon: require('../assets/Image/logoWhite.png'),
        channelId,
        actions: [
          {
            title: 'Ping',
            pressAction: {
              id: 'ping_action',
            },
          },
        ],

        // Additional Android-specific options
      },
      ios: {
        // categoryId: 'chat_category'
        categoryId: 'ping_category',
        actions: [
          {
            title: 'Ping',
            id: 'ping_action',
            foreground: true,
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};

// Function to display notifications
export const displaySocialNotification = async (title, body, data) => {
  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      vibration: true,
    });

    await notifee.displayNotification({
      title,
      body,
      data: {
        data,
      },
      android: {
        smallIcon: 'icon_notification_blue',
        largeIcon: require('../assets/Icons/largeIcon_blue.png'),
        channelId,
    pressAction: {
      id: 'default',
    },
       
      },
      ios: {
        categoryId: 'chat_category',
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
    });
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};
export const displayTransferNotification = async (platform, userName, phoneNumber, message, data) => {
  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      vibration: true,
    });

    // Construct the title and body with the desired format
    const title = `${platform}`;
    const body = `Send:${userName} - Rec:${phoneNumber}\n${message}`;

    await notifee.displayNotification({
      title,
      body,
      data: {
        data,
      },
      android: {
        smallIcon: 'icon_notification_blue',
        largeIcon: require('../assets/Icons/largeIcon_blue.png'),
        channelId,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        categoryId: 'chat_category',
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
      },
    });
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};

