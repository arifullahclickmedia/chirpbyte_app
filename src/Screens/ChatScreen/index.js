import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import ChatMessageItem from './ChatMessageItem';
import debounce from 'lodash/debounce';
import {
  ChatAssign,
  ChatSolve,
  ChatTranscripts,
  FacebookChatAssign,
  FacebookChatSolved,
  FacebookChatTranscripts,
  FacebookSendMessage,
  InstagramChatAssign,
  InstagramChatSolved,
  InstagramChatTranscripts,
  LogoutUser,
  WhatsappChatAssign,
  WhatsappChatSolved,
  WhatsappChatTranscripts,
  WhatsappSendMessage,
} from '../../Services/Methods';
import axios from 'axios';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import useSocket from '../../Services/useSocket';
import { removeLoginData, setPusher, setStoreChatMessages, setStoreFacebookMessages, setStoreInstagramMessages, setStoreWhatsappMessages, solveUserMessage, updateChatMessages, updateFacebookMessages, updateInstagramMessages, updateWhatsappMessages } from '../../Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showErrorMsg } from '../../components/Messages';
import { FooterLoader } from '../../components/FooterLoader';
import { useLogout } from '../../Services/useLogout';
const API_URL = 'https://panel.chirpbyte.com/api/insert_db_transcript';
const { width } = Dimensions.get('window');

const ChatScreen = ({ navigation, route }) => {
  const { user, f, data, type } = route.params;
  //console.log("type>>>>", type)


  const notifyOptId = data?.data?.optId;
  const notifySession = data?.data?.session;
  const isFocused = useIsFocused()
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkAsSolvedModalVisible, setIsMarkAsSolvedModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [facebookChatMessages, setFacebookChatMessages] = useState([]);
  const [whatsappChatMessages, setWhatsappChatMessages] = useState([]);
  const [instagramChatMessages, setInstagramChatMessages] = useState([]);
  const [isJoin, setIsJoin] = useState('');
  const [chatSolved, setChatSolved] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [userTypingData, setUserTypingData] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSolvedLoading, setChatSolvedLoading] = useState(false);
  const [chatAssginedLoading, setChatAssginedLoading] = useState(false);
  const [ses_status, setSes_status] = useState('');
  const [operator, setOperator] = useState('');
  const [page, setPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(false);
  const isFetchingFirstPage = chatLoading && page === 1;

  const { user: reduxUser, } = useSelector(state => state.auth);
  const flatListRef = useRef();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { socket, onEvent, emitEvent } = useSocket();
  //console.log("socket.connected==", socket.connected)
  const PUSHER_DATA = useSelector((state) => state.auth.pusherData);
  // const storeChatMessages = useSelector(state => state.auth.chatMessages);
  const { handleLogout, isLoggingOut } = useLogout();

  const storeChatMessages = type === "whatsapp"
    ? useSelector(state =>
      state?.auth?.chatMessagesByWhatsappUser?.[
      `${user?.from_phone || user?.sender_id}_${user?.display_phone_number || user?.recipient_id}`
      ] || []
    )
    : type === "facebook"
      ? useSelector(state =>
        state?.auth?.chatMessagesByFacebookUser?.[
        `${user?.from_id || user?.sender_id}_${user?.page_id || user?.recipient_id}`
        ] || []
      )
      : type === "instagram"
        ? useSelector(state =>
          state?.auth?.chatMessagesByInstagramUser?.[
          `${user?.from_id || user?.sender_id}_${user?.page_id || user?.recipient_id}`
          ] || []
        )
        : type === "live" ?
          useSelector(state => state?.auth?.chatMessagesByUser?.[user?.session] || []) : ""
  let combinedMessages;
  if (type === 'live') {
    combinedMessages = [...chatMessages, ...storeChatMessages]
  } else if (type === 'facebook') {
    combinedMessages = [...facebookChatMessages, ...storeChatMessages]
  }
  else if (type === 'instagram') {
    combinedMessages = [...instagramChatMessages, ...storeChatMessages]
  }
  else if (type === 'whatsapp') {
    console.log("whatsappChatMessages==", whatsappChatMessages)

    combinedMessages = [...whatsappChatMessages, ...storeChatMessages]
  }
  // else{
  //    combinedMessages = storeChatMessages;
  // }
  // console.log("Message List ==>",JSON.stringify(combinedMessages,null,4));  


  useEffect(() => {
    // Ensure the PUSHER_DATA exists before processing
    if (PUSHER_DATA && PUSHER_DATA.data) {
      //console.log("PUSHER - DATA ===>", PUSHER_DATA.data);

      let parsedData;

      // Safely parse the data only if it's in string format
      if (typeof PUSHER_DATA.data === 'string') {
        parsedData = JSON.parse(PUSHER_DATA.data);
        console.log("PUSHER - DATA  FACEBOOK/INSTAGRAM ===>", parsedData);
      } else {
        parsedData = PUSHER_DATA.data;
        console.log("PUSHER - DATA  WHATSAPP ===>", parsedData);
      }

      const platform = parsedData.message.platform;

      // Map route type to corresponding platform
      const platformMapping = {
        facebook: ['facebook', 'fb'],
        instagram: ['instagram', 'insta'],
        whatsapp: ['whatsapp'],
      };

      const isPlatformMatched =
        type && platformMapping[type.toLowerCase()]?.includes(platform.toLowerCase());


      if (isPlatformMatched) {
        // Handle WhatsApp specific structure
        if (platform.toLowerCase() === 'whatsapp') {
         //console.log("parsedData ===>", parsedData);
          const from = parsedData.message.messages[0].from;
          const to = parsedData.message.metadata.display_phone_number;

          if ((user.from_phone || user.sender_id === from) && user?.recipient_id == to) {
            const newMessage = {
              id: `${parsedData.message.id}-${parsedData.message.messages[0].timestamp}`,
              message_mid: parsedData.message.messages[0].id,
              type: 'received',
              class: 'user',
              message: parsedData.message.messages[0].text.body,
              time: new Date(parseInt(parsedData.message.messages[0].timestamp, 10) * 1000).toLocaleTimeString(),
            };
            // dispatch(updateWhatsappMessages({ 
            //   sessionId: user?.from_phone || user?.sender_id, 
            //   newMessage 
            // }));
            setWhatsappChatMessages((prevMessages) => [newMessage, ...prevMessages]);
            // flatListRef.current?.scrollToEnd({ animated: true });
          }
        }
        // Handle Instagram and Facebook structure
        else if (platform.toLowerCase() === 'facebook') {
          const senderId = parsedData.message.sender_id;

          // Check if sender ID or recipient ID matches user phone
          if (user.from_id || user.sender_id === senderId) {
            const newMessage = {
              id: `${parsedData.message.message_mid}-${parsedData.message.time}`,
              message_mid: parsedData.message.id,
              type: 'received',
              class: 'user',
              message_mid: parsedData.message.message_mid,
              message: parsedData.message.message,  // The message content
              time: new Date(parseInt(parsedData.message.time, 10)).toLocaleTimeString(),
            };
            // dispatch(updateFacebookMessages({ 
            //   sessionId: user?.from_id || user?.sender_id, 
            //   newMessage 
            // }));
            setFacebookChatMessages((prevMessages) => [newMessage, ...prevMessages]);
            // flatListRef.current?.scrollToEnd({ animated: true });
          }
        }
        else if (platform.toLowerCase() === 'instagram') {
          const senderId = parsedData.message.sender_id;

          // Check if sender ID or recipient ID matches user phone
          if (user.from_id || user.sender_id === senderId) {
            const newMessage = {
              id: `${parsedData.message.message_mid}-${parsedData.message.time}`,
              type: 'received',
              class: 'user',
              message_mid: parsedData.message.message_mid,
              message: parsedData.message.message,  // The message content
              time: new Date(parseInt(parsedData.message.time, 10)).toLocaleTimeString(),
            };
            // dispatch(updateInstagramMessages({ 
            //   sessionId: user?.from_id || user?.sender_id, 
            //   newMessage 
            // }));
            setInstagramChatMessages((prevMessages) => [newMessage, ...prevMessages]);
            // flatListRef.current?.scrollToEnd({ animated: true });
          }
        }
      }
    }
  }, [PUSHER_DATA,]);
  const handleUserMessage = data => {

    console.log("handleUserMessage ==>", data);
    if ((data?.optId == reduxUser?.id || data?.operatorid == reduxUser?.id) || (data?.optId === 0)) {
      console.log('User message received1:', data);
      setChatMessages(prevMessages => [
        {
          id: Date.now().toString(),
          type: 'received',
          class: "user",
          message: data.message,
          time: new Date().toLocaleTimeString(),
        },
        ...prevMessages,
      ]);
      const newMessage = {
        id: Date.now().toString(),
        type: 'received',
        class: "user",
        message: data.message,
        time: new Date().toLocaleTimeString(),
      };
      fetchChatTranscripts();
      // dispatch(updateChatMessages({ 
      //   sessionId: user?.session, 
      //   newMessage 
      // }));
     // flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    console.log("useEffect-Calling");
    if (!socket) {
      console.log("SOCKET - NOT - CONNECTED - IN - CHATSCREEN - SCREEN.");
      return;
    }

    

    const handleAdminMessage = data => {

      if ((data?.optId == reduxUser?.id || data?.operatorid == reduxUser?.id) && data?.operatorname === "bot") {
        console.log('Admin message received handleAdminMessage1:', data);
        setChatMessages(prevMessages => [
          {
            id: Date.now().toString(),
            type: 'sent',
            class: "admin",
            message: data.operatormessage,
            time: new Date().toLocaleTimeString(),
          },
          ...prevMessages,
        ]);

        const newMessage = {
          id: Date.now().toString(),
          type: 'received',
          class: 'admin',
          message: data.operatormessage,
          time: new Date().toLocaleTimeString(),
        };

        // Use the update function for Admin messages
        // dispatch(updateChatMessages({ 
        //   sessionId: user?.session, 
        //   newMessage 
        // }));
        // flatListRef.current?.scrollToEnd({ animated: true });
      }
    };
    // const handleAssignMessage = data => {
    //   console.log("ASSIGN - DATA ==>",JSON.stringify(data,null,4));
    // }
    socket.on('userMessageToClient', handleUserMessage);
    socket.on('adminMessageToClient', handleAdminMessage);
    // onEvent('notifications', handleAssignMessage);

    return () => {
      socket.off('userMessageToClient', handleUserMessage);
      socket.off('adminMessageToClient', handleAdminMessage);
      // socket.off('notifications', handleAssignMessage);
    };
  }, [onEvent, socket]);

  useEffect(() => {
    if (facebookChatMessages.length > 0) {
      // Clear chatMessages after rendering to avoid duplicates
      setFacebookChatMessages([]);
    } else if (instagramChatMessages.length > 0) {
      setInstagramChatMessages([]);
    }
    else if (whatsappChatMessages.length > 0) {
      setWhatsappChatMessages([]);
    } else if (chatMessages.length > 0) {
      setChatMessages([]);
    }
  }, [storeChatMessages]);

  useEffect(() => {
    // console.log("DATA ==>",JSON.stringify(data,null,4));
    // && operator != reduxUser?.id
    if (((user?.ses_status == '0' || undefined) && data?.data?.optId === undefined) || ((user?.ses_status == '0' || undefined) && data?.data?.optId === undefined) || (data?.data?.optId === undefined && (ses_status == '0' || undefined))) {
      setIsJoin(false);
    } else if ((user?.ses_status == '1' && data?.data?.optId === undefined) || (user?.ses_status == '1' && data?.data?.optId !== undefined) || (data?.data?.optId === undefined && ses_status == '1')) {
      setIsJoin(true);
    } else if (user?.ses_status == '2' || ses_status == '2') {
      setChatSolved(true);
    }

  }, [f, data]);
  useEffect(() => {
    // console.log("USER ===>",JSON.stringify(user,null,4));
    // console.log("OPERATOR ===>",JSON.stringify(reduxUser,null,4));
    fetchChatTranscripts();
    
    // console.log("Combined Messages ===>", JSON.stringify(combinedMessages,null,4));
  }, [page]);

  // useEffect(() => {
  //   if (isAtBottom) {
  //     flatListRef.current?.scrollToEnd({animated: true});
  //   }
  // }, [chatMessages, isAtBottom]);

  const formatDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 0); // Add 5 hours

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  // console.log("first ===>",user?.session)
  const msgTime = formatDateTime();

  const ChatAssigning = async () => {
    // console.log("TYPE ====>",type);
    setChatAssginedLoading(true);
    let response;
    try {
      if (type === "whatsapp") {
        console.log("WHATSAPPPPPPPPP");
        response = await WhatsappChatAssign(user?.msg_id || user?.id, user?.display_phone_number || user?.recipient_id, user?.from_phone || user?.sender_id, reduxUser?.id);
      } else if (type === "facebook") {
        console.log("FACEBOOKKKKKKKKKK");
        response = await FacebookChatAssign(user?.id, user?.to || user?.recipient_id, user?.page_id, user?.from_id || user?.sender_id, reduxUser?.id);
      } else if (type === "instagram") {
        console.log("INSTAGRAMMMMMMMMMM");
        response = await InstagramChatAssign(user?.id, user?.to || user?.recipient_id, user?.page_id, user?.from_id || user?.sender_id, reduxUser?.id);

      } else {

        console.log("LIVEEEEEEE", user?.session);
        console.log("LIVEEEEEEE", reduxUser?.id);
        response = await ChatAssign(user?.session || notifySession, reduxUser?.id || notifyOptId);
      }
      console.log('CHATS-ASSIGN ==>', JSON.stringify(response?.data, null, 4));
      if (response?.data?.status === 'success' || response?.data === 1) {
        setIsJoin(true);
        setChatSolved(false);
        setSes_status('1');
        console.log('CHAT IS ASSIGNED  SUCCESSFULLY    ==>');
        let convid = user?.session;

        switch (type) {
          case "whatsapp":
            convid = user?.sender_id;
            break;

          case "instagram":
          case "facebook":
            user?.sender_id
            break;

          default:
            convid = user?.session;
        }

        let socketNotificationData = {
          "convid": String(type === "instagram" || type === "facebook"
            ? user?.sender_id
            : type === "whatsapp"
              ? user?.sender_id
              : user?.session),
          "operatorid": reduxUser.id,
          "assigneeid": reduxUser.id,
          "recieverId": user?.recipient_id,
          "platform": type,
          "message": `${reduxUser?.username} has JOIN the chat!`,
        }

        socket.emit("notificationsToSever", socketNotificationData);

      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        console.log(error);
      }
    } finally {
      setChatAssginedLoading(false);
    }
  };

  const ChatSolved = async () => {
    setChatSolvedLoading(true);
    let response;
    try {
      if (type === "live") {
        console.log("LIVEEEEEEE");
        response = await ChatSolve(user?.session || notifySession);
      } else if (type === "whatsapp") {
        console.log("WHATSAPPPPPPPPP");
        response = await WhatsappChatSolved(user?.msg_id || user?.id, user?.display_phone_number || user?.recipient_id, user?.from_phone || user?.sender_id);
      } else if (type === "facebook") {
        console.log("FACEBOOKKKKKKKKKK");
        response = await FacebookChatSolved(user?.mid || user?.id, user?.to || user?.recipient_id, user?.page_id || user?.recipient_id, user?.from_id || user?.sender_id);
      } else if (type === "instagram") {
        console.log("INSTAGRAMMMMMMMMMM");
        response = await InstagramChatSolved(user?.mid || user?.id, user?.to || user?.recipient_id, user?.page_id || user?.recipient_id, user?.from_id || user?.sender_id);
      }

      console.log(
        'CHAT-SOLVED RESPONSE ==>',
        JSON.stringify(response?.data, null, 4),
      );

      if (response?.data?.status === 'success' || response?.data === 1) {
        setChatSolved(true);
        setIsMarkAsSolvedModalVisible(false);
        // navigation.goBack();
        const solvedData = {
          "convid": user?.sender_id || user?.session,
          "operatorid": reduxUser?.id,
          "platform": type,
        }
        dispatch(solveUserMessage(solvedData))
        handleCloseModalPress();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setChatSolvedLoading(false);
    }
  };


  const handleMarkAsSolvedPress = async () => {
    setIsMarkAsSolvedModalVisible(true);
  };

  const addMessageIfNotExists = (newMessage) => {
    const exists = chatMessages.some(
      (message) => message.id === newMessage.id
    );
    if (!exists) {
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };


  const fetchChatTranscripts = async () => {
    console.log("FETCH-TRANSCRIPT-DATA ==>", user);

    setChatLoading(true);
    try {
      const response =
        type === "whatsapp"
          ? await WhatsappChatTranscripts(user?.display_phone_number || user?.recipient_id, user?.from_phone || user?.sender_id, user?.color, page)
          : type === "facebook"
            ? await FacebookChatTranscripts(user?.mid || user?.id, user?.to || user?.recipient_id, user?.page_id || user?.recipient_id, user?.from_id || user?.sender_id, page)
            : type === "instagram"
              ? await InstagramChatTranscripts(user?.mid || user?.id, user?.to || user?.recipient_id, user?.page_id || user?.recipient_id, user?.from_id || user?.sender_id, page)
              : type === "live"
                ? await ChatTranscripts(user?.session || notifySession, page)
                : "";
      setSes_status(response?.data?.ses_status);

      setOperator(response?.data?.op);

      const newMessages = response?.data?.data || [];
      // console.log("newMessagesList==>",JSON.stringify(newMessages,null,4)); 
      setTotalItems(newMessages?.total)
      if (type === 'whatsapp') {
        dispatch(setStoreWhatsappMessages({ receiverId: user?.display_phone_number || user?.recipient_id, sessionId: user?.from_phone || user?.sender_id, messages: newMessages?.data, page }));
      } else if (type === "facebook") {
        dispatch(setStoreFacebookMessages({ receiverId: user?.page_id || user?.recipient_id, sessionId: user?.from_id || user?.sender_id, messages: newMessages?.data, page }));
      } else if (type === "instagram") {
        dispatch(setStoreInstagramMessages({ receiverId: user?.page_id || user?.recipient_id, sessionId: user?.from_id || user?.sender_id, messages: newMessages?.data, page }));
      }
      else {
        dispatch(setStoreChatMessages({ sessionId: user?.session, messages: newMessages?.data, page }));
      }
      // console.log("FETCH-TRANSCRIPT-DATA ==>",JSON.stringify(response?.data?.data,null,4));
      // console.log("FETCH-TRANSCRIPT-DATA ==>",JSON.stringify(response?.data?.ses_status,null,4));
      if (response?.data?.ses_status === "1") {
        setIsJoin(true);
        setChatSolved(false);
      }
      setChatLoading(false);
      // flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
        console.log(error);
        showErrorMsg(errorMessage)
        setChatLoading(false);
      }
    } finally {
      setChatLoading(false);
      setIsFetchingNextPage(false)
    }
  };

  const renderFooter = () => {
    return <FooterLoader visible={isFetchingNextPage} />
  }

  const handleFaceBookSendMessage = async () => {
    console.log("Test");
    setChatLoading(true);


    const newMessage = {
      id: Date.now(),
      sender_id: user?.from_id,
      recipient_id: user?.to,
      message: message,
      class: "admin",
      msg_date: Math.floor(Date.now() / 1000),
    };

    // console.log("NEW - MESSAGE ===>",JSON.stringify(newMessage,null,4));


    const platform = "fb";
    //   const request_body ={
    //     from:user?.from_id || user?.sender_id,
    //     token:user?.access_token,
    //     message:message,
    //     platform:platform
    // }
    // console.log("request_body ===>",JSON.stringify(request_body,null,4));
    try {

      const sendingMessage = {
        sender_id: user?.from_id || user?.sender_id,
        token: user?.access_token,
        recipient_id: user?.page_id || user?.recipient_id,
        message: message,
        platform: platform
      }
      console.log("request_body ===>", JSON.stringify(sendingMessage, null, 4));

      const response = await FacebookSendMessage(
        user?.from_id || user?.sender_id,
        user?.access_token,
        user?.page_id || user?.recipient_id,
        message,
        platform
      );


      console.log("Message - Response ===>", JSON.stringify(response.data, null, 4));

      if (response?.data?.status == "200") {
        // dispatch(updateFacebookMessages({ 
        //   sessionId: user?.from_id || user?.sender_id, 
        //   newMessage 
        // }));

        setChatLoading(false);
        setMessage('');
        setFacebookChatMessages(prevMessages => [newMessage, ...prevMessages]);
      } else {

        Alert.alert(response.data?.msg);
      }


      return response.data;
    } catch (error) {
      console.log("FacebookMessage-ERROR===>", error);
      // Optionally handle error (e.g., remove the message, show retry)
    } finally {
      setChatLoading(false);
      setMessage('');
      // flatListRef.current?.scrollToEnd({ animated: true });
    }
  };
  const handleInstagramSendMessage = async () => {

    setChatLoading(true);

    // Construct the message locally
    const newMessage = {
      id: Date.now(),  // Temporary ID, can replace with response ID later
      sender_id: user?.from_id,
      recipient_id: user?.to,
      message: message,  // This is the message text you're sending
      class: "admin",  // You can adjust this depending on the user/admin
      msg_date: Math.floor(Date.now() / 1000),
    };


    console.log("NEW - MESSAGE ===>", JSON.stringify(newMessage, null, 4));
    // Optimistically update the chatMessages state


    const platform = "insta";

    try {
      const request_body = {
        from: user?.from_id || user?.sender_id,
        token: user?.access_token,
        recipient: user?.page_id || user?.recipient_id,
        message: message,
        platform: platform
      }
      console.log("request_body ===>", JSON.stringify(request_body, null, 4));
      const response = await FacebookSendMessage(
        user?.from_id || user?.sender_id,
        user?.access_token,
        user?.page_id || user?.recipient_id,
        message,
        platform
      );

      console.log("Message - Response ===>", JSON.stringify(response.data, null, 4));

      if (response?.data?.status == "200") {
        // dispatch(updateInstagramMessages({ 
        //   sessionId: user?.from_id || user?.sender_id, 
        //   newMessage 
        // }));

        setChatLoading(false);
        setMessage('');
        setInstagramChatMessages(prevMessages => [newMessage, ...prevMessages]);
        // setInstagramChatMessages(prevMessages => {
        //   const updatedMessages = [newMessage, ...prevMessages];
        //   return [...updatedMessages];
        // });
        // flatListRef.current.scrollToOffset({ animated: true });
      } else {

        Alert.alert(response.data?.msg);
      }

      return response.data;
    } catch (error) {
      console.log("InstagramMessage-ERROR===>", error);
      // Optionally handle error (e.g., remove the message, show retry)
    } finally {
      setChatLoading(false);
      setMessage('');
      // flatListRef.current?.scrollToEnd({ animated: true });
    }
  };
  // useEffect(() => {
  //   if (whatsappChatMessages.length > 0) {
  //     flatListRef.current?.scrollToEnd({ animated: true });
  //   }
  // }, [whatsappChatMessages]);
  const handleWhatsappSendMessage = async () => {
    console.log("Test");
    //console.log("handle Send Message ===> Calling", whatsappChatMessages);
    setChatLoading(true);

    // Construct the message locally
    const newMessage = {
      id: Date.now(),  // Temporary ID, can replace with response ID later
      sender_id: user?.display_phone_number,
      recipient_id: user?.from_phone,
      message: message,  // This is the message text you're sending
      class: "admin",  // You can adjust this depending on the user/admin
      msg_date: Math.floor(Date.now() / 1000),
    };
    console.log("NEW - MESSAGE ===>", JSON.stringify(newMessage, null, 4));
    // Optimistically update the chatMessages state



    try {
      const response = await WhatsappSendMessage(
        user?.from_phone || user?.sender_id,
        user?.display_phone_number || user?.recipient_id,
        user?.phone_number_id,
        message,
      );

      console.log("MessageWhatsapp - Response ===>", JSON.stringify(response.data, null, 4));

      if (response?.data?.status == "200") {
        // dispatch(updateWhatsappMessages({ 
        //   sessionId: user?.from_phone || user?.sender_id, 
        //   newMessage 
        // }));
        setWhatsappChatMessages(prevMessages => {
          const updatedMessages = [newMessage, ...prevMessages];
          return [...updatedMessages];
        });

        setChatLoading(false);
        setMessage('');
        // setWhatsappChatMessages(prevMessages => [newMessage, ...prevMessages]);
         flatListRef.current.scrollToOffset({ animated: true });
      } else {
        Alert.alert(response.data?.msg.error.message);
      }

      return response.data;
    } catch (error) {
      console.log("WhatsAppMessage-ERROR===>", error);
    } finally {
      setChatLoading(false);
      setMessage('');

    }
  };
  const handleSend = async () => {
    //console.log("handleSend>>",message )
    if (message.trim() === '') {
      inputRef.current.focus();
      return;
    }

    let data = {
      session: user?.session || notifySession,
      operatorid: reduxUser?.id || notifyOptId,
      operatormessage: message,
      operatorname: reduxUser?.username,
    };


    if (!socket) {
      console.log('Socket is not connected');
      return;
    }

    socket.emit('adminMessageToSever', data);
    console.log('MESSAGE ==>', JSON.stringify(data, null, 4));
    setChatMessages(prevMessages => [
      {
        id: Date.now().toString(),
        type: 'sent',
        class: "admin",
        message: message,
        time: msgTime,
      },
      ...prevMessages,
    ]);
    const newMessage = {
      id: Date.now().toString(),
      type: 'received',
      class: 'admin',
      message: data.Operatormessage,
      time: new Date().toLocaleTimeString(),
    };

    // Use the update function for Admin messages
    // dispatch(updateChatMessages({ 
    //   sessionId: user?.session, 
    //   newMessage 
    // }));
    // flatListRef.current?.scrollToEnd({ animated: true });
  };


  const DbTranscript = async () => {
    const transcript_obj = {
      name: reduxUser?.username,
      message: message,
      user: user?.userid,
      operatorid: reduxUser?.id || notifyOptId,
      session: user?.session || notifySession,
      time: msgTime,
      sentstatus: '1',
      class: 'admin',
      type: 'text',
    };
    console.log('DATA-BASE ==>', JSON.stringify(transcript_obj, null, 4));
    try {
      const response = await axios.post(API_URL, transcript_obj, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Error in DbTranscript:',
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  };

  const handleTyping = text => {
    setMessage(text);
    const typingData = {
      session: user?.session || notifySession,
      operatorname: reduxUser?.username,
      // message: text
    };
    if (!socket) return;
    socket?.emit('typingToSever', typingData);
  };
  const handleCofirmation = async () => {
    let data = {
      session: user?.session || notifySession,
      operatorid: reduxUser?.id || notifyOptId,
      operatormessage: reduxUser?.username + ' has joined the chat',
      operatorname: reduxUser?.username,
    };

    socket.emit('adminMessageToSever', data);
    setChatMessages(prevMessages => [
      {
        id: Date.now().toString(),
        type: 'sent',
        class: "system",
        message: reduxUser?.username + ' has joined the chat',
        time: msgTime,
      },
      ...prevMessages,
    ]);
    const newMessage = {
      id: Date.now().toString(),
      type: 'sent',
      class: "system",
      message: reduxUser?.username + ' has joined the chat',
      time: msgTime,
    }
    // dispatch(updateChatMessages({ 
    //   sessionId: user?.session, 
    //   newMessage 
    // }));
  };

  const handleScroll = event => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottomNow =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setIsAtBottom(isAtBottomNow);
  };

  const renderMessage = ({ item }) => (
    //console.log("item<?>>>>",JSON.stringify(item) ),
     <ChatMessageItem item={item} messengerName={user?.name} />
  );
  const handleModalClose = () => setIsMarkAsSolvedModalVisible(false);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['20%', '50%'], []);

  const handlePresentModalPress = useCallback(
    () => {
      Keyboard.dismiss();
      bottomSheetModalRef.current?.present()
    },
    [],
  );
  const handleCloseModalPress = useCallback(() => {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current.close();
    }
  }, []);

  const handleSheetChanges = useCallback(
    index => console.log('handleSheetChanges', index),
    [],
  );
  const words = (user?.name || data?.data?.name || user?.from_name || user?.sender_name || "no Name").split(" ");

  const abbreviation = words.length > 1
    ? (words[0][0] + words[1][0])
    : words[0].substring(0, 1)
  const truncateString = (str, maxLength = 20) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  };
  //console.log("whatsappChatMessages>>", whatsappChatMessages)
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => { setChatMessages(''); navigation.goBack() }}
                style={{ justifyContent: 'center', marginRight: 10 }}>
                <Icon name="arrow-left" size={20} color="#000" />
              </TouchableOpacity>
              <View style={styles.profileContainer}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: user?.color || "purple",
                    justifyContent: 'center',
                    marginRight: 5,
                  }}>
                  <Text style={{ textAlign: 'center', fontSize: 18, color: "white" }}>
                    {abbreviation}
                  </Text>
                </View>
                <View>
                  <Text style={styles.profileName}>
                    {user?.name || data?.data?.name || user?.from_name || user?.sender_name || "no Name"}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 2,
                    }}>
                    <View style={styles.greenCircle} />
                    <Text style={styles.profileStatus}>
                      {truncateString(user?.email || data?.data?.email || user?.from_phone || user?.to_name || user?.sender_id)}
                    </Text>
                    <Text style={{ marginLeft: 10 }}>{type}</Text>
                  </View>
                </View>
              </View>
            </View>
            {isFetchingFirstPage ? <ActivityIndicator size={20} color={'grey'} /> : ""}
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={[styles.iconButton]}
                onPress={handlePresentModalPress}>
                <Icon
                  name="dots-vertical"
                  size={20}
                  color="#000"
                  style={{ alignSelf: 'center' }}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={{position:"absolute",top:50,left:20,backgroundColor:"grey",}}><Text style={{color:"white",}}>Social chats functionalities are in developement phase</Text></View> */}
          </View>

          {/* <FlatList
            ref={flatListRef}
            data={combinedMessages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            onScroll={handleScroll} // Add this
            onContentSizeChange={() => {
              if (isAtBottom) {
                flatListRef.current?.scrollToEnd({animated: true}); // Only auto-scroll if user is at bottom
              }
            }}
          /> */}
          <FlatList
            ref={flatListRef}
            data={combinedMessages} //?.reverse()
            inverted
            renderItem={renderMessage}
            ListFooterComponent={renderFooter}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            onScroll={handleScroll} // Add this
            onLayout={() => {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }}
            // onContentSizeChange={(contentWidth, contentHeight) => {
            //   // Ensure it stays at the "top" (bottom of the reversed list)
            //   if (isAtBottom) {
            //   flatListRef.current?.scrollToOffset({offset: 0, animated: true});
            //   }
            // }}
            onEndReached={() => {
              if (!isFetchingNextPage && combinedMessages?.length < totalItems) {
                setPage(prev => prev + 1);
                setIsFetchingNextPage(true)
              }
            }}
            onEndReachedThreshold={0.1}
          />
          {userTyping && (
            <View
              style={[styles.receivedMessageContainer, { marginVertical: 0 }]}>
              <Text style={[styles.receivedMessageText, { fontSize: 40 }]}>
                {userTypingData}...
              </Text>
              <View style={styles.purpleCircle} />
            </View>
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : ''}
          // style={{ flex: 1 }}
          >
            <View style={styles.inputContainer}>
              {/* && data?.data?.optId !== undefined */}
              {!isJoin && !chatSolved ? (
                <View style={{ gap: 10, flexDirection: 'column', flex: 1 }}>

                  {chatLoading ? <Text style={{ textAlign: 'center' }}>
                    Fetching your chat, hang tight...
                  </Text>
                    : <Text style={{ textAlign: 'center' }}>
                      This conversation is not assigned to you.
                    </Text>}
                  <LinearGradient
                    colors={['#9C31FD', '#56B6E9']}
                    style={{ borderRadius: 10, overflow: 'hidden' }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <TouchableOpacity
                      onPress={async () => {
                        setIsLoading(true);
                        try {

                          await ChatAssigning();
                          await handleCofirmation();
                          // await DbConfirmationTranscript();


                          // flatListRef.current?.scrollToEnd({animated: true});
                        } catch (error) {
                          console.error('Error in handleSend:', error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        alignItems: 'center',
                      }}>
                      {chatAssginedLoading || chatLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={{ color: 'white' }}>Join</Text>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              ) : isJoin && !chatSolved ? (

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    style={[styles.input, { width: width * 0.82 }]}
                    placeholder="Type your message..."
                    value={message}
                    onChangeText={handleTyping}
                  />
                  <LinearGradient
                    colors={['#9C31FD', '#56B6E9']}
                    style={[styles.gradientButton, {}]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <TouchableOpacity
                      disabled={message === '' || message === null}
                      onPress={async () => {
                        setIsLoading(true);
                        try {
                          {
                            type === "live" ? await handleSend() : type === "facebook" ? await handleFaceBookSendMessage() : type === "instagram" ? await handleInstagramSendMessage() : type === "whatsapp" ? await handleWhatsappSendMessage() : await handleSend()

                          }
                          // await DbTranscript();
                          // Clear message input
                          {
                            type === "live" ?
                              setMessage('') : ""
                          }
                          // flatListRef.current?.scrollToEnd({animated: true});
                        } catch (error) {
                          console.error('Error in handleSend:', error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}>
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Icon
                          name="send"
                          size={15}
                          color="#FFFFFF"
                          style={{ transform: [{ rotate: '-30deg' }] }}
                        />
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              ) : chatSolved ? (
                <View style={{ gap: 10, flexDirection: 'column', flex: 1 }}>
                  <Text style={{ textAlign: 'center' }}>
                    The Chat is Solved !
                  </Text>
                  <LinearGradient
                    colors={['#9C31FD', '#56B6E9']}
                    style={{ borderRadius: 10, overflow: 'hidden' }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <TouchableOpacity
                      onPress={async () => {
                        setIsLoading(true);
                        try {
                          // await handleCofirmation();
                          await ChatAssigning();
                          // await DbConfirmationTranscript();

                          // flatListRef.current?.scrollToEnd({animated: true});
                        } catch (error) {
                          console.error('Error in handleSend:', error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        alignItems: 'center',
                      }}>
                      {chatAssginedLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={{ color: 'white' }}>Start Conversation Again</Text>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              )
                : null}
            </View>
          </KeyboardAvoidingView>

          {/* RESOLVED --------MODAL*/}
          <Modal
            transparent={true}
            visible={isMarkAsSolvedModalVisible}
            animationType="fade"
            onRequestClose={handleModalClose}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Are you sure you want mark conversation as solved
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={handleModalClose}>
                    <Text style={[styles.modalButtonText, { color: 'grey' }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      await ChatSolved();
                    }}
                    style={styles.modalButton}>
                    <View style={styles.modalButtonInner}>
                      <LinearGradient
                        colors={['#9C31FD', '#56B6E9']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.textGradient}>
                        {
                          chatSolvedLoading ? <ActivityIndicator size={24} color={'white'} style={{ padding: 10 }} />
                            : <Text
                              style={[
                                styles.modalButtonText,
                                { paddingHorizontal: 20 },
                              ]}>
                              Yes
                            </Text>
                        }

                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          {/* Bottom Sheet Component */}
          <BottomSheetModal
            enablePanDownToClose={true}
            dismissOnOverlayPress={true}  // Allows dismiss on outside touch
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}>
            <BottomSheetView>
              <View style={styles.bottomSheetContent}>
                {/* Visitor Details */}
                {type === "facebook" || type === "instagram" || type === "whatsapp" ? "" :
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => {
                      handleCloseModalPress(); navigation.navigate('VisitorsData', { user, data, notifySession })
                    }}>
                    <Image
                      source={require('../../assets/Icons/visitor.png')}
                      style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                      <Text style={styles.optionTitle}>Visitor details</Text>
                      <Text style={styles.optionDescription}>
                        Check the data you gathered about the visitor, like tags,
                        visited pages, notes, and other details.
                      </Text>
                    </View>
                  </TouchableOpacity>
                }

                {/* Mark Conversation as Solved */}
                <TouchableOpacity
                  style={[styles.option, {}]}
                  onPress={chatSolved ? null : handleMarkAsSolvedPress}>
                  <Image
                    source={require('../../assets/Icons/mark.png')}
                    style={[styles.icon, {}]}
                  />
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.optionTitle,
                        { color: chatSolved ? 'grey' : 'black' },
                      ]}>
                      Mark conversation as solved
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        { color: chatSolved ? 'grey' : '#606060' },
                      ]}>
                      Closes the conversation for all the assigned operators.
                      The customer won't be notified.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Reassign Operator */}

                {
                  (type === "facebook" || type === "instagram") ?
                    <TouchableOpacity
                      style={styles.option}
                      onPress={
                        chatSolved
                          ? null
                          : () => {
                            handleCloseModalPress();
                            navigation.navigate('ReassignOperator',

                              type === "facebook" || "instagram" ?
                                {
                                  type: type,
                                  departmentName: user?.department_name || user?.tag_name,
                                  fromPhone: user?.from_id || user?.sender_id,
                                  toPhone: user?.to || user?.recipient_id,

                                  mID: user?.mid || user?.id,
                                  pageId: user?.page_id || user?.recipient_id,


                                } :
                                {
                                  type: type,
                                  session: user?.session || notifySession,
                                  departmentName: user?.department_name || user?.tag_name,
                                  fromPhone: user?.display_phone_number || user?.recipient_id,
                                  toPhone: user?.from_phone || user?.sender_id,

                                }


                            )
                          }
                      }>
                      <Image
                        source={require('../../assets/Icons/user.png')}
                        style={styles.iconLarge}
                      />
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            { color: chatSolved ? 'grey' : 'black' },
                          ]}>
                          Add Tag
                        </Text>
                        <Text
                          style={[
                            styles.optionDescription,
                            { color: chatSolved ? 'grey' : '#606060' },
                          ]}>
                          Transfer this conversation to another department.
                        </Text>
                      </View>
                    </TouchableOpacity> : ""
                }

                {
                  (type === "whatsapp" || type === "live") ?
                    <TouchableOpacity
                      style={styles.option}
                      onPress={
                        chatSolved
                          ? null
                          : () => {
                            handleCloseModalPress();
                            navigation.navigate('ReassignOperator',

                              {
                                type: type,
                                session: user?.session || notifySession,
                                departmentName: user?.department_name || user?.tag_name,
                                fromPhone: user?.display_phone_number || user?.recipient_id,
                                toPhone: user?.from_phone || user?.sender_id,

                              }


                            )
                          }
                      }>
                      <Image
                        source={require('../../assets/Icons/user.png')}
                        style={styles.iconLarge}
                      />
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            { color: chatSolved ? 'grey' : 'black' },
                          ]}>
                          Add Tag
                        </Text>
                        <Text
                          style={[
                            styles.optionDescription,
                            { color: chatSolved ? 'grey' : '#606060' },
                          ]}>
                          Transfer this conversation to another department.
                        </Text>
                      </View>
                    </TouchableOpacity> : ""

                }
                {/* Reassign Operator END */}

                {/* Chat Transfer */}
                {
                  (type === "whatsapp" || type === "live") ?
                    <TouchableOpacity
                      style={styles.option}
                      onPress={
                        chatSolved
                          ? null
                          : () => {
                            handleCloseModalPress();
                            navigation.navigate('ChatTransferScreen', {
                              type: type,

                              session: user?.session || notifySession,
                              operatorName: reduxUser?.username,
                              fromPhone: user?.display_phone_number || user?.recipient_id,
                              toPhone: user?.from_phone || user?.sender_id,
                              sender_id: user?.sender_id,
                              recipient_id: user?.recipient_id,
                            })
                          }
                      }>

                      <Image
                        source={require('../../assets/Icons/user.png')}
                        style={styles.iconLarge}
                      />
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            { color: chatSolved ? 'grey' : 'black' },
                          ]}>
                          Chat Transfer
                        </Text>
                        <Text
                          style={[
                            styles.optionDescription,
                            { color: chatSolved ? 'grey' : '#606060' },
                          ]}>
                          Transfer this conversation to another admin.
                        </Text>
                      </View>
                    </TouchableOpacity> : ""}


                {
                  (type === "facebook" || type === "instagram") ?
                    <TouchableOpacity
                      style={styles.option}
                      onPress={
                        chatSolved
                          ? null
                          : () => {
                            handleCloseModalPress();
                            navigation.navigate('ChatTransferScreen',

                              type === "facebook" || "instagram" ?
                                {
                                  type: type,
                                  operatorName: reduxUser?.username,
                                  fromPhone: user?.from_id || user?.sender_id,
                                  toPhone: user?.to || user?.recipient_id,
                                  sender_id: user?.sender_id,
                                  recipient_id: user?.recipient_id,
                                  mID: user?.mid || user?.id,
                                  pageId: user?.page_id || user?.recipient_id,


                                } :
                                {
                                  type: type,
                                  session: user?.session || notifySession,
                                  departmentName: user?.department_name || user?.tag_name,
                                  fromPhone: user?.display_phone_number || user?.recipient_id,
                                  toPhone: user?.from_phone || user?.sender_id,
                                  sender_id: user?.sender_id,
                                  recipient_id: user?.recipient_id,
                                }


                            )
                          }
                      }>
                      <Image
                        source={require('../../assets/Icons/user.png')}
                        style={styles.iconLarge}
                      />
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            { color: chatSolved ? 'grey' : 'black' },
                          ]}>
                          Chat Transfer
                        </Text>
                        <Text
                          style={[
                            styles.optionDescription,
                            { color: chatSolved ? 'grey' : '#606060' },
                          ]}>
                          Transfer this conversation to another admin.
                        </Text>
                      </View>
                    </TouchableOpacity> : ""
                }

                {/* Chat Transfer  END */}

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseModalPress}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ChatScreen;
