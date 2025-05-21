import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import InfoCard from './InfoCards';
import {useDispatch, useSelector} from 'react-redux';
import {ErrorMessage} from '../../utilities/Strings';
import {
  GetVisitors,
  StatebyDays,
  InboxMessages,
  LogoutUser,
  FacebookMessages,
  InstagramMessages,
  WhatsappMessages,
} from '../../Services/Methods';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MessageSkeleton from '../../components/MessageSkeletons';
import VisitorSkeleton from '../../components/VisitorSkeleton';
import InboxMessageList from '../../components/inboxMessageList';
import VisitorItem from '../../components/VisitorItem';
import {
  removeLoginData,
  setStoreAssignDHList,
  setStoreAssignMessageList,
  setStoreFacebookDHList,
  setStoreFacebookMessageList,
  setStoreInstagramDHList,
  setStoreInstagramMessageList,
  setStoreUnassignDHList,
  setStoreUnassignMessageList,
  setStoreWhatsappDHList,
  setStoreWhatsappMessageList,
  setUnreadCount,
} from '../../Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSocket from '../../Services/useSocket';
import { useLogout } from '../../Services/useLogout';
export default function Dashboard({navigation}) {
  // const {user, token, status, isSignInSaved} = useSelector(state => state.auth);
  const [StatesdaysList, setStatesdaysList] = useState(null);
  // const [selectedFilter, setSelectedFilter] = useState('Unassign');
  const [VisitorList, setVisitorList] = useState([]);
  // const [assignMessageList, setAssignMessageList] = useState([]);
  // const [unassignMessageList, setUnassignMessageList] = useState([]);
  // const [instagramMessageList, setInstagramMessageList] = useState([]);
  // const [whatsappMessageList, setWhatsappMessageList] = useState([]);
  // const [facebookMessageList, setFacebookMessageList] = useState([]);

  const [IsLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // const [messageLoading, setMessageLoading] = useState(false);
  const [Refreshing, setRefreshing] = useState(false);
  // const [unassignUnreadCount, setUnassignUnreadCount] = useState(0);
  // const [assignUnreadCount, setAssignUnreadCount] = useState(0);
  // const [facebookUnreadCount, setFacebookUnreadCount] = useState(0);
  // const [instagramUnreadCount, setInstagramUnreadCount] = useState(0);
  // const [whatsappUnreadCount, setWhatsappUnreadCount] = useState(0);
  // const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const permissions = useSelector((state)=>state.auth.permissions);
  // const PUSHER_DATA = useSelector(state => state.auth.pusherData);
  // console.log("PUSHER - DATA  ===>",JSON.stringify(PUSHER_DATA,null,4));
  const dispatch = useDispatch();
  const maxRetries = 3; // Number of retry attempts
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  // const isFocused = useIsFocused();
  const {handleLogout, isLoggingOut} = useLogout();
  // const {socket, onEvent} = useSocket();
  // const {width, height} = Dimensions.get('window');

  // let combineUnassginMessageList = [];
  // let combineAssginMessageList = [];
  // let combineWhatsappList = [];
  // let combineInstagramList = [];
  // let combineFacebookList = [];

  // const unassignMessageListSelector = useSelector(
  //   state => state.auth.unAssignDHList,
  // );
  // const assignMessageListSelector = useSelector(
  //   state => state.auth.assignDHList,
  // );
  // const whatsappMessageListSelector = useSelector(
  //   state => state.auth.whatsappDHList,
  // );
  // const instagramMessageListSelector = useSelector(
  //   state => state.auth.instagramDHList,
  // );
  // const facebookMessageListSelector = useSelector(
  //   state => state.auth.facebookDHList,
  // );


  // combineUnassginMessageList=unassignMessageList;
  // combineAssginMessageList = [
  //   ...assignMessageList,
  //   ...assignMessageListSelector,
  // ];
  // combineWhatsappList = [
  //   ...whatsappMessageList,
  //   ...whatsappMessageListSelector,
  // ];
  // combineWhatsappList = whatsappMessageList,

  // combineInstagramList = [
  //   ...instagramMessageList,
  //   ...instagramMessageListSelector,
  // ];
  // combineFacebookList = [
  //   ...facebookMessageList,
  //   ...facebookMessageListSelector,
  // ];

//   useEffect(() => {
//     combineInstagramList = [...instagramMessageList, ...instagramMessageListSelector];
//     // console.log("first  ===>",combineInstagramList);
// }, [instagramMessageList, instagramMessageListSelector]);

  // SOCKET EVENTS
  // useEffect(() => {
  //   if (!socket) return;

  //   const formatTime = () => {
  //     const now = new Date();
  //     return now.toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: false,
  //     });
  //   };

  //   // Handle incoming user messages
  //   const handleUserMessage = data => {
  //     console.log('User message received:', data);

  //     setUnassignMessageList(prevAssignMessages => {
  //       let updatedAssignMessages;

  //       // Check if the message has a session but no optId (unassigned)
  //       if (data.session && !data.optId) {
  //         const messageIndex = prevAssignMessages.findIndex(
  //           message => message.session === data.session,
  //         );

  //         if (messageIndex > -1) {
  //           // Update existing message if found and move it to the top
  //           const updatedMessage = {
  //             ...prevAssignMessages[messageIndex],
  //             lastmessage: data.message,
  //             mtime: formatTime(),
  //             unreadcount:
  //               (parseInt(prevAssignMessages[messageIndex].unreadcount) || 0) +
  //               1,
  //             email: data.email,
  //           };

  //           // Remove the existing message and re-add it to the top
  //           updatedAssignMessages = [
  //             updatedMessage,
  //             ...prevAssignMessages.filter(
  //               message => message.session !== data.session,
  //             ),
  //           ];
  //         } else {
  //           // Add new message at the top if not found
  //           updatedAssignMessages = [
  //             {
  //               id: Date.now().toString(),
  //               session: data.session,
  //               name: data.name,
  //               lastmessage: data.message,
  //               mtime: formatTime(),
  //               unreadcount: 1,
  //               color: '#bf175e',
  //               email: data.email,
  //               wid:data.wid
  //             },
  //             ...prevAssignMessages,
  //           ];
  //         }
  //         // Sum counts for unassigned messages
  //     const unassignTotalCount = updatedAssignMessages.reduce((total, message) => {
  //       return total + Number(message.unRead || message.unRead || 0); // Sum unread or unreadcount
  //     }, 0);

  //         setUnassignUnreadCount(prevCount => prevCount + 1);
  //         // Update unread count
  //         updateTotalUnreadCount(updatedAssignMessages);
  //         return updatedAssignMessages;
  //       }

  //       // If the message has both session and optId (assigned)
  //       if (data.session && data.optId) {
  //         // Add to setAssignMessageList
  //         setAssignMessageList(prevAssignedMessages => {
  //           const assignedMessageIndex = prevAssignedMessages.findIndex(
  //             message => message.session === data.session,
  //           );

  //           if (assignedMessageIndex > -1) {
  //             // Update existing assigned message
  //             const updatedAssignedMessage = {
  //               ...prevAssignedMessages[assignedMessageIndex],
  //               lastmessage: data.message,
  //               mtime: formatTime(),
  //               unreadcount:
  //                 (parseInt(
  //                   prevAssignedMessages[assignedMessageIndex].unreadcount,
  //                 ) || 0) + 1,
  //               email: data.email,
  //             };

  //             // Remove and re-add to keep it at the top
  //             return [
  //               updatedAssignedMessage,
  //               ...prevAssignedMessages.filter(
  //                 message => message.session !== data.session,
  //               ),
  //             ];
  //           } else {
  //             // Add new assigned message
  //             return [
  //               {
  //                 id: Date.now().toString(),
  //                 session: data.session,
  //                 name: data.name,
  //                 lastmessage: data.message,
  //                 mtime: formatTime(),
  //                 unreadcount: 1,
  //                 color: '#17bf5e', // Color for assigned messages
  //                 email: data.email,
  //               },
  //               ...prevAssignedMessages,
  //             ];
  //           }
  //         });

  //         // Remove from unassigned messages
  //         updatedAssignMessages = prevAssignMessages.filter(
  //           message => message.session !== data.session,
  //         );
  //         setAssignUnreadCount(prevCount => prevCount + 1);
  //         updateTotalUnreadCount(updatedAssignMessages);
  //         return updatedAssignMessages;
  //       }

  //       return prevAssignMessages; // Default return if no condition is met
  //     });
  //   };

  //   // Listen for user messages
  //   onEvent('user_message', handleUserMessage);
  //   return () => {
  //     socket.off('user_message', handleUserMessage);
  //   };
  // }, [socket, onEvent, updateTotalUnreadCount]);

  // useEffect(() => {
  //   if (PUSHER_DATA && PUSHER_DATA.data) {
  //     let newMessage;
  //     let platform;

  //     // Safely parse the data only if it's in string format
  //     if (typeof PUSHER_DATA.data === 'string') {
  //       newMessage = JSON.parse(PUSHER_DATA.data);
  //       // console.log("PUSHER - DATA - FACEBOOK/INSTAGRAM ===>", newMessage);
  //       platform = newMessage.message.platform;
  //     } else {
  //       newMessage = PUSHER_DATA.data.message;
  //       // console.log("PUSHER - DATA - WHATSAPP ===>", newMessage);
  //       platform = newMessage.platform;
  //     }

  //     // Current time for created_time
  //     const currentTime = new Date().toISOString();

  //     // Handle WhatsApp messages
  //     if (platform === 'whatsapp') {
  //       console.log(" NESSAGE Whatsapppppppppppppppppppp")
  //       setWhatsappMessageList(prevMessages => {
  //         const existingIndex = prevMessages.findIndex(
  //           msg => msg.from_phone === newMessage.contacts[0].wa_id,
  //         );

  //         if (existingIndex >= 0) {
    

  //           // Move existing message to the top
  //           const updatedMessages = [...prevMessages];
  //           const existingMessage = updatedMessages.splice(existingIndex, 1)[0]; // Remove existing message
  //           existingMessage.message = newMessage.messages[0].text.body; // Update message text
  //           existingMessage.created_time = new Date(
  //             parseInt(newMessage.messages[0].timestamp, 10) * 1000,
  //           ).toISOString();
  //           existingMessage.count = (
  //             parseInt(existingMessage.count, 10) + 1
  //           ).toString(); // Increment count

  //           // Return updated messages with the existing message moved to the top
  //           return [existingMessage, ...updatedMessages];
  //         } else {


  //           // Create a new message object if it doesn't exist
  //           const newMessageObject = {
  //             from_name: newMessage.contacts[0].profile.name,
  //             from_phone: newMessage.contacts[0].wa_id,
  //             display_phone_number: newMessage.metadata.display_phone_number,
  //             phone_number_id: newMessage.metadata.phone_number_id,
  //             message: newMessage.messages[0].text.body,
  //             count: '1',
  //             created_time: new Date(
  //               parseInt(newMessage.messages[0].timestamp, 10) * 1000,
  //             ).toISOString(),
  //             operatorId: '0',
  //             tag: '',
  //             color: '#7325ff',
  //           };
  //           return [newMessageObject, ...prevMessages];
  //         }
  //       });
  //       setWhatsappUnreadCount(prevCount => prevCount + 1);
  //     }

  //     // Handle Instagram messages
  //     if (platform === 'instagram') {
  //       console.log(" NESSAGE Instagrammmmmm")
  //       setInstagramMessageList(prevMessages => {
  //         // Find if the message already exists by matching sender_id (real-time) with from_id (stored)
  //         const existingIndex = prevMessages.findIndex(
  //           msg => msg.from_id === newMessage.message.sender_id
  //         );
      
  //         if (existingIndex >= 0) {
  //           // Update the existing message and move it to the top
  //           const updatedMessages = [...prevMessages]; // Create a copy of prevMessages
  //           const existingMessage = { ...updatedMessages[existingIndex] }; // Create a copy of the existing message
      
  //           // Update the necessary fields
  //           existingMessage.message = newMessage.message.message; // Update the message text
  //           existingMessage.created_time = new Date(); // Update the created_time
  //           existingMessage.count = (parseInt(existingMessage.count, 10) + 1).toString(); // Increment the count
      
  //           // Remove the old message from its position and place the updated one at the top
  //           updatedMessages.splice(existingIndex, 1); // Remove the existing message from its original position
  //           return [existingMessage, ...updatedMessages]; // Return updated messages with the existing message moved to the top
  //         } else {
  //           // If the message does not exist, create a new message object
  //           const newMessageObject = {
  //             from_name: newMessage.message.from_name || 'Unknown',
  //             from_id: newMessage.message.sender_id, // Use sender_id for new messages
  //             message: newMessage.message.message, // Set the message text
  //             count: '1', // Set the initial count
  //             created_time: new Date(), // Set the current time
  //             operatorId: '0',
  //             tag: '',
  //             color: '#7325ff',
  //           };
  //           return [newMessageObject, ...prevMessages]; // Add the new message to the top
  //         }
  //       });
      
  //       setInstagramUnreadCount(prevCount => prevCount + 1); // Increment the unread count
  //     }
      

  //     // Handle Facebook messages
  //     if (platform === 'facebook' || platform === 'FB Messenger') {
  //       setFacebookMessageList(prevMessages => {
  //         // Find if the message already exists by matching sender_id (real-time) with from_id (stored)
  //         const existingIndex = prevMessages.findIndex(
  //           msg => msg.from_id === newMessage.message.sender_id
  //         );
      
  //         if (existingIndex >= 0) {
  //           // Update the existing message and move it to the top
  //           const updatedMessages = [...prevMessages]; // Create a copy of prevMessages
  //           const existingMessage = { ...updatedMessages[existingIndex] }; // Create a copy of the existing message
      
  //           // Update the necessary fields
  //           existingMessage.message = newMessage.message.message; // Update the message text
  //           existingMessage.created_time = new Date(); // Update the created_time
  //           existingMessage.count = (parseInt(existingMessage.count, 10) + 1).toString(); // Increment the count
      
  //           // Remove the old message from its position and place the updated one at the top
  //           updatedMessages.splice(existingIndex, 1); // Remove the existing message from its original position
  //           return [existingMessage, ...updatedMessages]; // Return updated messages with the existing message moved to the top
  //         } else {
  //           // If the message does not exist, create a new message object
  //           const newMessageObject = {
  //             from_name: newMessage.message?.from_name || 'Unknown',
  //             from_id: newMessage.message?.sender_id, // Use sender_id for new messages
  //             message: newMessage.message?.message, // Set the message text
  //             count: '1', // Set the initial count
  //             created_time: new Date(), // Set the current time
  //             operatorId: '0',
  //             tag: '',
  //             color: '#7325ff',
  //           };
  //           return [newMessageObject, ...prevMessages]; // Add the new message to the top
  //         }
  //       });
      
  //       setFacebookUnreadCount(prevCount => prevCount + 1); // Increment the unread count
  //     }
      

  //   }
  // }, [PUSHER_DATA]);

  // const fetchMessages = async () => {
  //   try {
  //     // console.log("Focus initial LOADDDDDDING =====>", loading);
  //     setIsLoading(true);

  //     // Fetch messages based on selected option
  //     if (selectedFilter === 'Unassign') {
  //       await GetUnassignInboxMessages();
  //     }
  //     if (selectedFilter === 'Whatsapp') {
  //       await GetWhatsappInboxMessages();
  //     }
  //     if (selectedFilter === 'My Open') {
  //       await GetAssignInboxMessages();
  //     }
  //     if (selectedFilter === 'Instagram') {
  //       await GetInstagramInboxMessages();
  //     }
  //     if (selectedFilter === 'Facebook') {
  //       await GetFacebookInboxMessages();
  //     }
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   } finally {
  //     setIsLoading(false); // Ensure loading is set to false after fetching
  //     // console.log("Focus finaly LOADDDDDDING =====>", loading);
  //   }
  // };
  // useEffect(() => {
  //   // Trigger fetchMessages when the component is focused
  //   if (isFocused) {
  //     fetchMessages();
  //   }
  // }, [isFocused, selectedFilter]);

  // useEffect(() => {
  //   const fetchSelectedOption = async () => {
  //     try {
  //       const savedOption = await AsyncStorage.getItem('selectedFilter');
  //       if (savedOption) {
  //         setSelectedFilter(savedOption);
  //       }
  //     } catch (error) {
  //       console.error(
  //         'Failed to load selected option from AsyncStorage:',
  //         error,
  //       );
  //     }
  //   };
  //   fetchSelectedOption();
  // }, []);
  const GetWebSiteVisitorList = async (
    isRefreshing = false,
    retryCount = 0,
  ) => {
    if (permissions?.visitor === false)return;
    if (!isRefreshing) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await GetVisitors({wId: 1});      
      if (response?.status === 401) {
        console.log('TOKEN EXPIRED !');
        return; // Exit if unauthorized
      }

      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setIsLoading(false);
      }

      setVisitorList(response?.data?.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setIsLoading(false);
      }

      if (error.response?.status === 401) {
        console.log('TOKEN EXPIRED !');
      }
      // else if (error.response?.status === 429) {
      //   // Handle rate limiting
      //   if (retryCount < maxRetries) {
      //     console.log("maxRetries ==>",maxRetries);
      //     setTimeout(() => {
      //       GetWebSiteVisitorList(isRefreshing, retryCount + 1);
      //     }, delay);
      //   } else {
      //     Alert.alert('Visitor List : Too many requests. Please try again later.');
      //   }
      // }
       else {
        Alert.alert(errorMessage);
      }
    }finally{
      setRefreshing(false);
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  const GetStatebyDays = async () => {
    if( permissions?.statistic === false)
      return;
    try {
      const response = await StatebyDays();
      if (response?.status === 200) {
        setStatesdaysList(response?.data?.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        Alert.alert(errorMessage);
      }
    }finally{
      setRefreshing(false);
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  const GetAllDataSequentially = async () => {
    try {
      // Fetch data one by one sequentially
      await GetStatebyDays();
      await delay(500); // Delay of 1 second before the next request

      await GetWebSiteVisitorList();
      await delay(500);

      // await fetchMessages();

      setInitialLoading(false); // Data fetch completed
    } catch (error) {
      console.error('Error in fetching data sequentially:', error);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
      GetAllDataSequentially(); // Fetch All data when component mounts
  }, []);

  useFocusEffect(
    useCallback(() => {
      GetStatebyDays();
      GetWebSiteVisitorList();
    }, []),
  );

  const handleOptionChange = async option => {
    setSelectedFilter(option);
    try {
      await AsyncStorage.setItem('selectedFilter', option);
    } catch (error) {
      console.error('Failed to save selected option to AsyncStorage:', error);
    }
  };



  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   const fetchMessages = async () => {
  //     try {
  //       await Promise.all([
  //         selectedFilter === 'Unassign' ? GetUnassignInboxMessages() : null,
  //         selectedFilter === 'Whatsapp' ? GetWhatsappInboxMessages() : null,
  //         selectedFilter === 'My Open' ? GetAssignInboxMessages() : null,
  //         selectedFilter === 'Instagram' ? GetInstagramInboxMessages() : null,
  //         selectedFilter === 'Facebook' ? GetFacebookInboxMessages() : null,
  //       ]);
  //       setRefreshing(false);
  //     } catch (error) {
  //       console.error('Error refreshing messages:', error);
  //     } finally {
  //       setRefreshing(false);
  //     }
  //   };
  //   fetchMessages();
  // }, [selectedFilter]);

  //  APIs START
  // const GetUnassignInboxMessages = async () => {
  //   setMessageLoading(true);
  //   try {
  //     const response = await InboxMessages(0);
  //     if (response?.status === 401) {
  //       console.log('TOKEN EXPIRED !');
  //       return; // Exit if unauthorized
  //     }

  //     const messages = response?.data?.data || [];
  //     // dispatch(setStoreUnassignDHList(messages));

  //     // console.log("UnAssign Messages ==>",JSON.stringify(messages,null,4));
  //     // Sum counts for unassigned messages
  //     const unassignTotalCount = messages.reduce((total, message) => {
  //       return total + Number(message.unRead || message.unreadcount || message.count || 0); // Sum unread or unreadcount
  //     }, 0);
  //     setUnassignMessageList(messages);

  //     setUnassignUnreadCount(unassignTotalCount); // Set the total count for unassigned messages
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       console.log('TOKEN EXPIRED !');
  //     } else {
  //       console.log(error);
  //     }
  //   } finally {
  //     setMessageLoading(false);
  //   }
  // };
  // const GetAssignInboxMessages = async () => {
  //   setMessageLoading(true);
  //   try {
  //     const response = await InboxMessages(1);
  //     if (response?.status === 401) {
  //       console.log('TOKEN EXPIRED !');
  //       return; // Exit if unauthorized
  //     }

  //     const messages = response?.data?.data || [];

  //     dispatch(setStoreAssignDHList(messages));
  //     // Sum counts for assigned messages
  //     const assignTotalCount = messages.reduce((total, message) => {
  //       return total + Number(message.unRead || message.unreadcount || message.count || 0); // Sum unread or unreadcount
  //     }, 0);

  //     setAssignMessageList(messages);
  //     setAssignUnreadCount(assignTotalCount); // Set the total count for assigned messages
  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //       console.log('TOKEN EXPIRED !');
  //     } else {
  //       console.log(error);
  //     }
  //   } finally {
  //     setMessageLoading(false);
  //   }
  // };
  // const GetInstagramInboxMessages = async () => {
  //   setMessageLoading(true);
  //   try {
  //     const response = await InstagramMessages();
  //     if (response?.status === 401) {
  //       console.log('TOKEN EXPIRED !');
  //       handleUnauthorized();
  //     }
  //     // console.log(
  //     //   'INSTAGRAM - LIST ===>',
  //     //   JSON.stringify(response?.data?.data, null, 4),
  //     // );

  //     const messages = response?.data?.data || [];
  //     dispatch(setStoreInstagramDHList(messages));
  //     // console.log("INSTAGRAM -  MESSAGES ===>",JSON.stringify(response?.data?.data,null,4));
  //     // Sum counts for Instagram
  //     const instagramTotalCount = messages.reduce((total, message) => {
  //       return total + Number(message.unRead || message.unreadcount || message.count || 0); // Ensure count is a number
  //     }, 0);

  //     setInstagramMessageList(messages);
  //     setInstagramUnreadCount(instagramTotalCount); // Set the calculated total count here
  //   } catch (error) {
  //     console.error('Error fetching instagram messages:', error);
  //   } finally {
  //     setMessageLoading(false);
  //   }
  // };

  // const GetWhatsappInboxMessages = async () => {
  //   setMessageLoading(true);
  //   try {
  //     const response = await WhatsappMessages();
  //     if (response?.status === 401) {
  //       console.log('TOKEN EXPIRED !');
  //       handleUnauthorized();
  //     }

  //     const messages = response?.data?.data || [];
  //     // dispatch(setStoreWhatsappDHList(messages));
  //     // console.log("WHATSAPP -  MESSAGES ===>",JSON.stringify(response?.data?.data,null,4));

  //     // Sum counts for WhatsApp
  //     const whatsappTotalCount = messages.reduce((total, message) => {
  //       return total + Number(message.unRead || message.unreadcount || message.count || 0); // Ensure count is a number
  //     }, 0);

  //     setWhatsappMessageList(messages);
  //     setWhatsappUnreadCount(whatsappTotalCount); // Set the calculated total count here
  //   } catch (error) {
  //     console.error('Error fetching WhatsApp messages:', error);
  //   } finally {
  //     setMessageLoading(false);
  //   }
  // };

  // const GetFacebookInboxMessages = async () => {
  //   setMessageLoading(true);
  //   try {
  //     const response = await FacebookMessages();
  //     if (response?.status === 401) {
  //       console.log('TOKEN EXPIRED !');
  //       handleUnauthorized();
  //     }

  //     const messages = response?.data?.data || [];
  //     console.log('messages ==>', messages);
  //     dispatch(setStoreFacebookDHList(messages));
  //     console.log("FACEBOOK -  MESSAGES ===>",JSON.stringify(response?.data?.data,null,4));
  //     // Sum counts for Facebook
  //     const facebookTotalCount = messages.reduce((total, message) => {
  //       return total + Number(message.unRead || message.unreadcount || message.count || 0); // Ensure count is a number
  //     }, 0);

  //     setFacebookMessageList(messages);
  //     setFacebookUnreadCount(facebookTotalCount); // Set the calculated total count here
  //   } catch (error) {
  //     console.error('Error fetching Facebook messages:', error);
  //   } finally {
  //     setMessageLoading(false);
  //   }
  // };

  //  APIs  END

  // UI COMPONENTS START
  // const renderVisitor = ({item}) => <VisitorItem item={item} />;
  const renderVisitor = useCallback(({item}) => {
    return <VisitorItem item={item} dashboard={true} />;
  }, []);
  // const renderMessage = useCallback(({item}) => {
  //   return <InboxMessageList navigation={navigation} item={item} f={0}  />;
  // }, []);
  // const assignRenderMessage = useCallback(({item}) => {
  //   return <InboxMessageList navigation={navigation} item={item} f={1} />;
  // }, []);
  // const whatsappRenderMessage = useCallback(({item}) => {
  //   return <InboxMessageList navigation={navigation} item={item} f={1} />;
  // }, []);
  // const instagramRenderMessage = useCallback(({item}) => {
  //   return <InboxMessageList navigation={navigation} item={item} f={1} socailType={'Instagram'}/>;
  // }, []);
  // const facebookRenderMessage = useCallback(({item}) => {
  //   return <InboxMessageList navigation={navigation} item={item} f={1} socailType={'FB Messenger'}/>;
  // }, []);

  const renderLoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="blue" />
      <Text style={{color: 'grey'}}>Logging out...</Text>
    </View>
  );

  // const renderEmptyState = () => (
  //   <View
  //     style={{
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       marginTop: 20,
  //       flexDirection: 'row',
  //     }}>
  //     <Text>Oops! No new chat</Text>
  //     {(IsLoading || initialLoading) === true && (
  //       <ActivityIndicator size={20} color={'grey'} style={{marginLeft: 10}} />
  //     )}
  //   </View>
  // );
  // const renderMessageList = (messageList, renderMessage) => (
  //   <FlatList
  //   data={messageList ? messageList.slice(0, 3) : []}  
  //   renderItem={renderMessage}
  //   keyExtractor={(item, index) => `${item.id}-${index}`}
  //   showsVerticalScrollIndicator={false}
  //   refreshing={Refreshing}
  //   onRefresh={onRefresh}
  //   ListFooterComponent={() => (
  //     <TouchableOpacity
  //       style={styles.viewAllButton}
  //       onPress={() => navigation.navigate('InboxScreen')}>
  //       <Text style={styles.viewAllText}>View all</Text>
  //     </TouchableOpacity>
  //   )}
  // />
  
  // );

  // const renderContent = (messageList, renderMessage) => {
  //   if (initialLoading) {
  //     return <VisitorSkeleton />;
  //   }
  //   if (messageList && messageList.length !== 0) {
  //     return renderMessageList(messageList, renderMessage);
  //   }
  //   return renderEmptyState();
  // };
  // const renderFilterButton = filterName => {
  //   const platformCounts = {
  //     Unassign: unassignUnreadCount,
  //     'My Open': assignUnreadCount,
  //     Whatsapp: whatsappUnreadCount,
  //     Instagram: instagramUnreadCount,
  //     Facebook: facebookUnreadCount,
  //   };

  //   return (
  //     <TouchableOpacity
  //       key={`${filterName}`}
  //       onPress={() => handleOptionChange(filterName)}
  //       style={styles.filterButtonWrapper}>
  //       <LinearGradient
  //         start={{x: 0, y: 0}}
  //         end={{x: 1, y: 0}}
  //         colors={
  //           selectedFilter === filterName
  //             ? ['#9C31FD', '#56B6E9']
  //             : ['#FFFFFF', '#FFFFFF']
  //         }
  //         style={[
  //           styles.filterButton,
  //           selectedFilter === filterName && styles.selectedFilterButton,
  //         ]}>
  //         <Text
  //           style={[
  //             styles.filterButtonText,
  //             selectedFilter === filterName
  //               ? styles.selectedFilterText
  //               : styles.inactiveFilterText,
  //           ]}>
  //           {filterName} ({platformCounts[filterName]}){' '}
  //           {/* Display the count */}
  //         </Text>
  //       </LinearGradient>
  //     </TouchableOpacity>
  //   );
  // };

  // UI COMPONENTS END

  // RED DOT FUNCTION
  // const updateTotalUnreadCount = messages => {
  //   const newUnreadCount = messages.reduce(
  //     (sum, message) => sum + message.unreadcount || message.count,
  //     0,
  //   );

  //   // Only update Redux if the unread count has changed
  //   if (newUnreadCount !== totalUnreadCount) {
  //     setTotalUnreadCount(newUnreadCount); // Update local state
  //     dispatch(setUnreadCount({unreadCount: newUnreadCount})); // Update Redux store
  //   }
  // };
  return (
    <SafeAreaView style={styles.container}>
      {isLoggingOut ? (
        renderLoadingOverlay()
      ) : (
        <View style={{flex:1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.HeadingTxt}>Dashboard</Text>
              {/* <Text style={{alignSelf: 'center', marginTop: 10}}>1.0.22</Text> */}
            </View>
            {(IsLoading || initialLoading) === true ? (
              <ActivityIndicator
                size={20}
                color={'grey'}
                style={{marginRight: 20, marginTop: 10}}
              />
            ) : (
              ''
            )}
          </View>
          <LinearGradient
            colors={['#9C31FD', '#56B6E9']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.gradient]}>
             {
              permissions?.statistic === false ? (
                <View style={{flex:1,justifyContent:"center",alignItems:"center",}}>
                    <Text style={{color:'black'}}>Statistic permission Not Granted!</Text>
                  </View>
              )
             : 
            <View style={{flexDirection: 'row', alignItems: 'center',flexWrap:"wrap",gap:10,alignItems:"center",justifyContent:"center"}}>
              <InfoCard
                title={'Visitors'}
                number={StatesdaysList?.vistorscount}
                percentage={-6.05}
                isPositive={false}
              />
              <InfoCard
                title={'Messages'}
                number={StatesdaysList?.messagescount}
                percentage={6.05}
                isPositive={true}
              />
              <InfoCard
                title={'Chats'}
                number={StatesdaysList?.chatcount}
                percentage={10.5}
                isPositive={true}
              />
              <InfoCard
                title={'PageView'}
                number={StatesdaysList?.pageview}
                percentage={-6.05}
                isPositive={false}
              />
            </View>
            }
          </LinearGradient>
          <View style={styles.ContentContainer}>
            {/* HORIZONTAL SCROLL CHATS OPTIONS */}
            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterContainer}>
                {[
                  'Unassign',
                  'My Open',
                  'Whatsapp',
                  'Instagram',
                  'Facebook',
                ].map(filter => renderFilterButton(filter))}
              </View>
            </ScrollView> */}
            {/* CHATS LIST */}
            {/* <View style={{height: height * 0.31}}>
              {selectedFilter === 'Unassign' &&
                renderContent(combineUnassginMessageList, renderMessage)}
              {selectedFilter === 'Whatsapp' &&
                renderContent(combineWhatsappList, whatsappRenderMessage)}
              {selectedFilter === 'My Open' &&
                renderContent(combineAssginMessageList, assignRenderMessage)}
              {selectedFilter === 'Instagram' &&
                renderContent(combineInstagramList, instagramRenderMessage)}
              {selectedFilter === 'Facebook' &&
                renderContent(combineFacebookList, facebookRenderMessage)}
            </View> */}
            {/*  VISITORS LIST  */}
            <Text style={styles.WebSiteListTitle}>Website Visitors</Text>
            {initialLoading === true ? (
              <VisitorSkeleton />
            ) :permissions?.visitor === false ? (
              <View style={{flex:1,justifyContent:"center",alignItems:"center",}}>
                  <Text style={{color:'black'}}>Visitors permission Not Granted!</Text>
                </View>
            )
            : VisitorList && VisitorList.length === 0 ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text>No visitors to show !</Text>
              </View>
            ) : (
              <FlatList
                data={VisitorList ? VisitorList.slice(0, 3) : []}
                renderItem={renderVisitor}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.visitorsList}
                ListFooterComponent={() => (
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => navigation.navigate('WebSiteVisitors')}>
                    <Text style={styles.viewAllText}>View all</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
