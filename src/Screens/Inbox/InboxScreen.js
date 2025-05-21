import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {

  FacebookNewMessage,
  InboxMessages,
  InstagramNewMessage,
  LogoutUser,
} from '../../Services/Methods';
import { useIsFocused } from '@react-navigation/native';
import VisitorSkeleton from '../../components/VisitorSkeleton';
import InboxMessageList from '../../components/inboxMessageList';
import {
  assignUserMessage,
  moveMessageToAssignList,
  removeLoginData,
  removeUserFromLists,
  setStoreAassignUnreadCount,
  setStoreAssignMessageList,
  setStoreSolvedMessageList,
  setStoreUnassignMessageList,
  setStoreUnassignUnreadCount,
  setUnreadCount,
  updateAssignMessageList,
  updateAssignUnreadCount,
  updateUnassignMessageList,
  updateUnassignUnreadCount,
} from '../../Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSocket from '../../Services/useSocket';
import { useLogout } from '../../Services/useLogout';
export default function InboxScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('Unassign');
  const [assignMessageList, setAssignMessageList] = useState([]);
  const [unassignMessageList, setUnassignMessageList] = useState([]);
  const [whatsappMessageList, setWhatsappMessageList] = useState([]);

  const [IsLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [messageLoading, setMessageLoading] = useState(false);
  const [Refreshing, setRefreshing] = useState(false);
  const [unassignUnreadCount, setUnassignUnreadCount] = useState(0);
  const [assignUnreadCount, setAssignUnreadCount] = useState(0);
  const [whatsappUnreadCount, setWhatsappUnreadCount] = useState(0);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [showUpArrow, setShowUpArrow] = useState(false);
  const flatListRef = useRef(null);
  const PUSHER_DATA = useSelector(state => state.auth.pusherData);
  const gradientColors = ['#9C31FD', '#56B6E9'];
  const dispatch = useDispatch();
  const {handleLogout,isLoggingOut} = useLogout();

  const isFocused = useIsFocused();
  const { socket, onEvent } = useSocket();
  const { width, height } = Dimensions.get('window');
  const { user: reduxUser, } = useSelector(state => state.auth);
  const permissions = useSelector((state) => state.auth.permissions);

  // WIDGET SELECTORS START
  let combineUnassginMessageList = [];
  let combineAssginMessageList = [];
  let combineSolvedMessageList = [];

  const unassignMessageListSelector = useSelector(
    state => state.auth.unAssignMessageList,
  );
  const assignMessageListSelector = useSelector(
    state => state.auth.assignMessageList,
   
  );
  const solvedMessageListSelector = useSelector(
    state => state.auth.solvedMessageList,
  );

  combineUnassginMessageList = unassignMessageListSelector;
  combineAssginMessageList = assignMessageListSelector;
  combineSolvedMessageList = solvedMessageListSelector;

  const unassginUnreadCount = useSelector(state => state.auth.unassignUnreadCount);
  const assginUnreadCount = useSelector(state => state.auth.assignUnreadCount);

  // WIDGET SELECTORS END 



  useEffect(() => {
    setInitialLoading(false);
    GetUnassignInboxMessages();
    GetAssignInboxMessages();
    GetSolvedInboxMessages();
  
  }, [isFocused]);





  // SOCKET EVENTS
  useEffect(() => {
    if (!socket){
      console.log("SOCKET - NOT - CONNECTED - IN - INBOX - SCREEN.");
      return;
    }
      
     
    const handleUserMessage = data => {
      fetchSelectedOption();
      
      console.log("SOCKET EVENT ====>", data);

      const isAssigned = assignMessageList.some(
        message => message.session === data.session
      );

      if (isAssigned) {
        console.log("ASSIGNED WIDGET ====>");
        dispatch(updateAssignMessageList(data));
        dispatch(updateAssignUnreadCount());

      } else {

        const unassignMessageIndex = unassignMessageList.findIndex(
          message => message.session === data.session
        );

        if (unassignMessageIndex > -1) {
          if (data.optId == reduxUser.id) {
            console.log("MOVE TO ASSIGNED WIDGET ====>");
            dispatch(moveMessageToAssignList({ session: data.session, data }));
          } else if (data.optId == 0 || data.ses_status == 0) {
            console.log(" UN-ASSIGNED WIDGET ====>");
            dispatch(updateUnassignMessageList(data));
            dispatch(updateUnassignUnreadCount());
          }
          else if (data.optId !== 0 && data.optId !== reduxUser.id) {
            console.log("NOT FOR US WIDGET ====>");
            // it will ot save in any list , beacuse optid is not same 
          }
        }
        //  else if (data.optId == 0 || data.ses_status == 0) {
        //   console.log("NEW UN-ASSIGNED WIDGET ====>");
        //   dispatch(updateUnassignMessageList(data));
        //   dispatch(updateUnassignUnreadCount());
        // }
      }
    };
    // const handleAssignMessage = data => {
    //   console.log("ASSIGN - DATA ==>", JSON.stringify(data, null, 4));

    //   if (data.operatorid === reduxUser.id) {
    //     // Move user to assigned list
    //     dispatch(assignUserMessage(data));
    //   } else if (data.operatorid !== reduxUser.id) {
    //     // Remove user from both lists if operatorid doesn't match
    //     console.log("Removing dispatch ")
    //     dispatch(removeUserFromLists(data));
    //   }
    // };  
    if (permissions?.widget !== false || reduxUser?.mainuser === 1) {
    onEvent('userMessageToClient', handleUserMessage);
    }
    
    // Clean up socket listeners on unmount
    return () => {
      socket.off('userMessageToClient', handleUserMessage);
    };
  }, [socket, onEvent]);

  // PUSHER EVENTS
  useEffect(() => {
    if (PUSHER_DATA && PUSHER_DATA.data) {
      let newMessage;
      let platform;
      console.log("PUSHER_DATA ===>", JSON.stringify(PUSHER_DATA));
      if (typeof PUSHER_DATA.data === 'string') {
        newMessage = JSON.parse(PUSHER_DATA.data);
        platform = newMessage.message.platform;
      } else {
        newMessage = PUSHER_DATA.data.message;

        platform = newMessage.platform;
      }

      const currentTime = new Date().toISOString();


      if (platform === 'whatsapp' &&
        (permissions?.whatsapp !== false || reduxUser?.mainuser === 1)
      ) {
        console.log("WHATAPPPP - MESSAGE ====>");
        const from = newMessage.messages[0]?.from;
        const to = newMessage.metadata.display_phone_number;
        const operatorId = newMessage.operatorId;

        const isSenderInList = (list) =>
          list.some((msg) => (msg.sender_id === from || msg.from_id === from) && (msg.recipient_id === to) && String(operatorId) === String(reduxUser.id));

        const isSenderInUnassignList = (list) =>
          list.some((msg) => (msg.sender_id === from || msg.from_id === from) && (msg.recipient_id === to) && (operatorId === undefined || operatorId === "0"));

        if (isSenderInList(combineAssginMessageList)) {
          dispatch(updateAssignMessageList(newMessage));
          dispatch(updateAssignUnreadCount());
        } else if (String(operatorId) === String(reduxUser.id)) {
          console.log("ASSIGNEDDDDDDDDDDD-NEW");
          dispatch(updateAssignMessageList(newMessage));
          dispatch(updateAssignUnreadCount());
        }
        else if (isSenderInUnassignList(combineUnassginMessageList)) {
          console.log("UN - ASSIGNEDDDDDDDDDDD");
          dispatch(updateUnassignMessageList(newMessage));
          dispatch(updateUnassignUnreadCount());
        } else if (operatorId === undefined || operatorId === "0" || operatorId === null) {
          console.log("UN - ASSIGNEDDDDDDDDDDD-NEW");
          dispatch(updateUnassignMessageList(newMessage));
          dispatch(updateUnassignUnreadCount());
        }
      }



      else if (platform === 'instagram' &&
        (permissions?.instagram !== false || reduxUser?.mainuser === 1)
      ) {
        console.log("INSTAGRAM - MESSAGE ====>");
        const { sender_id } = newMessage.message;
        const { operatorId } = newMessage.message;

        const isSenderInList = (list) =>
          list.some((msg) => (msg.sender_id === sender_id || msg.from_id === sender_id) && String(operatorId) === String(reduxUser.id));
        const isSenderInUnassignList = (list) =>
          list.some((msg) => (msg.sender_id === sender_id || msg.from_id === sender_id) && (operatorId === undefined || operatorId === "0"));

        // Check if the sender is in the assigned list
        if (isSenderInList(combineAssginMessageList)) {
          console.log("ASSIGNEDDDDDDDDDDD");
          dispatch(updateAssignMessageList(newMessage));
          dispatch(updateAssignUnreadCount());
        }
        else if (String(operatorId) === String(reduxUser.id)) {
          console.log("ASSIGNEDDDDDDDDDDD-NEW");

          const GetInstagramNewInboxMessages = async () => {

            try {
              const response = await InstagramNewMessage(sender_id);
              console.log("RESPONSE ===>", JSON.stringify(response?.data, null, 4));
              const userName = response?.data?.data?.from_name;
              const accessToken = response?.data?.data?.access_token;
              const page_id = response?.data?.data?.page_id;
              const page_name = response?.data?.data?.page_name;
              // console.log("NEW USER NAME =====>",userName);
              // console.log("NEW USER ACCESS TOKEN =====>",accessToken);
              // console.log("NEW USER PAGE ID =====>",page_id);

              // console.log("NEW USER new Message =====>",newMessage);

              // if (response?.data?.status === "200"){
              const modifiedNewMessage = { ...newMessage, extraName: userName, token: accessToken, page_id: page_id, page_name: page_name };
              dispatch(updateAssignMessageList(modifiedNewMessage));
              dispatch(updateAssignUnreadCount());
              // }

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
        else if (isSenderInUnassignList(combineUnassginMessageList)) {
          console.log("UN-ASSIGNEDDDDDDDDDDD");
          dispatch(updateUnassignMessageList(newMessage));
          dispatch(updateUnassignUnreadCount());
        }
        else if (operatorId === undefined || operatorId === "0" || operatorId === null) {
          console.log("UN-ASSIGNEDDDDDDDDDDD-NEW");

          const GetInstagramNewInboxMessages = async () => {

            try {
              const response = await InstagramNewMessage(sender_id);
              console.log("RESPONSE ===>", JSON.stringify(response?.data, null, 4));
              const userName = response?.data?.data?.from_name;
              const accessToken = response?.data?.data?.access_token;
              const page_id = response?.data?.data?.page_id;
              const page_name = response?.data?.data?.page_name;

              // if (response?.data?.status === "200"){
              const modifiedNewMessage = { ...newMessage, extraName: userName, token: accessToken, page_id: page_id, page_name: page_name };
              dispatch(updateUnassignMessageList(modifiedNewMessage));
              dispatch(updateUnassignUnreadCount());
              // }

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
      }


      // Handle Facebook messages
      else if (
        (platform === 'facebook' || platform === 'FB Messenger') &&
        (permissions?.facebook !== false || reduxUser?.mainuser === 1)
      ) {
        console.log("FACEBOOK - MESSAGE ====>");
        const { sender_id } = newMessage.message;
        const { operatorId } = newMessage.message;

        const isSenderInList = (list) =>
          list.some((msg) => (msg.sender_id === sender_id || msg.from_id === sender_id) && String(operatorId) === String(reduxUser.id));
        const isSenderInUnassignList = (list) =>
          list.some((msg) => (msg.sender_id === sender_id || msg.from_id === sender_id) && (operatorId === undefined || operatorId === "0"));

        // Check if the sender is in the assigned list
        if (isSenderInList(combineAssginMessageList)) {

          dispatch(updateAssignMessageList(newMessage));
          dispatch(updateAssignUnreadCount());
        }
        else if (String(operatorId) === String(reduxUser.id)) {

          const GetFacebookNewInboxMessages = async () => {
            try {
              const response = await FacebookNewMessage(sender_id);
              console.log("RESPONSE ===>", JSON.stringify(response?.data, null, 4));

              const userName = response?.data?.data?.from_name;
              const accessToken = response?.data?.data?.access_token;
              const page_id = response?.data?.data?.page_id;
              const page_name = response?.data?.data?.page_name;

              const modifiedNewMessage = { ...newMessage, extraName: userName, token: accessToken, page_id: page_id, page_name: page_name };
              dispatch(updateAssignMessageList(modifiedNewMessage));
              dispatch(updateAssignUnreadCount());

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
        else if (isSenderInUnassignList(combineUnassginMessageList)) {
          dispatch(updateUnassignMessageList(newMessage));
          dispatch(updateUnassignUnreadCount());
        }
        else if (operatorId === undefined || operatorId === "0" || operatorId === null) {

          const GetFacebookNewInboxMessages = async () => {
            try {
              const response = await FacebookNewMessage(sender_id);

              const userName = response?.data?.data?.from_name;
              const accessToken = response?.data?.data?.access_token;
              const page_id = response?.data?.data?.page_id;
              const page_name = response?.data?.data?.page_name;

              const modifiedNewMessage = { ...newMessage, extraName: userName, token: accessToken, page_id: page_id, page_name: page_name };
              dispatch(updateUnassignMessageList(modifiedNewMessage));
              dispatch(updateUnassignUnreadCount());

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
      } else {
        console.log("facebook message denied  ====>");
      }
    }
  }, [PUSHER_DATA]);


  const fetchMessages = async () => {
    try {
      setIsLoading(true);

      // Fetch messages based on selected option
      if (selectedFilter === 'Unassign') {
        await GetUnassignInboxMessages();
      }
      if (selectedFilter === 'Solved') {
        await GetSolvedInboxMessages();

      }
      if (selectedFilter === 'My Open') {
        await GetAssignInboxMessages();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false); // Ensure loading is set to false after fetching
    }
  };
  useEffect(() => {
    // Trigger fetchMessages when the component is focused
    if (isFocused) {
      fetchMessages();
    }
  }, [selectedFilter]);

  useEffect(() => {
   
    fetchSelectedOption();
  }, []);
  
  const fetchSelectedOption = async () => {
    
    try {
      const savedOption = await AsyncStorage.getItem('selectedFilter');
      if (savedOption) {
        setSelectedFilter(savedOption);
      }
    } catch (error) {
      console.error(
        'Failed to load selected option from AsyncStorage:',
        error,
      );
    }
  };



  const handleOptionChange = async option => {
    setSelectedFilter(option);
    try {
      await AsyncStorage.setItem('selectedFilter', option);
    } catch (error) {
      console.error('Failed to save selected option to AsyncStorage:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const fetchMessages = async () => {
      try {
        await Promise.all([
          selectedFilter === 'Unassign' ? GetUnassignInboxMessages() : null,
          selectedFilter === 'Solved' ? GetSolvedInboxMessages() : null,
          selectedFilter === 'My Open' ? GetAssignInboxMessages() : null,
        ]);
        setRefreshing(false);
      } catch (error) {
        console.error('Error refreshing messages:', error);
      } finally {
        setRefreshing(false);
      }
    };
    fetchMessages();
  }, []);

  //  APIs START
  const GetUnassignInboxMessages = async () => {
    setMessageLoading(true);
    try {
      const response = await InboxMessages(0);  
      if (response?.status === 401) {
        return; // Exit if unauthorized
      }

      const messages = response?.data?.data || [];
      dispatch(setStoreUnassignMessageList(response?.data?.data || []));
      setInitialLoading(false);

      // Sum counts for unassigned messages
      const unassignTotalCount = messages.reduce((total, message) => {
        return total + Number(message.unRead || message.unreadcount || message.count || 0);
      }, 0);
      setUnassignMessageList(messages);
      dispatch(setStoreUnassignUnreadCount(unassignTotalCount));
      setUnassignUnreadCount(unassignTotalCount);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('TOKEN EXPIRED !');
      } else {
        console.log(error);
      }
    } finally {
      setMessageLoading(false);
      setInitialLoading(false);
    }
  };
  const GetAssignInboxMessages = async () => {
    setMessageLoading(true);
    try {
      const response = await InboxMessages(1);
      //console.log("response>>>",response)
      if (response?.status === 401) {
        console.log('TOKEN EXPIRED !');
        return; // Exit if unauthorized
      }
      const messages = response?.data?.data || [];

        //console.log("response?.data?.data ===>",response?.data?.data);
      dispatch(setStoreAssignMessageList(response?.data?.data || []));
      // Sum counts for assigned messages
      const assignTotalCount = messages.reduce((total, message) => {
        return total + Number(message.unRead || message.unreadcount || message.count || 0); // Sum unread or unreadcount
      }, 0);
      dispatch(setStoreAassignUnreadCount(assignTotalCount));


      setAssignMessageList(messages);
      setAssignUnreadCount(assignTotalCount); // Set the total count for assigned messages
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('TOKEN EXPIRED !');
      } else {
        console.log(error);
      }
    } finally {
      setMessageLoading(false);
    }
  };

  const GetSolvedInboxMessages = async () => {
    setMessageLoading(true);
    try {
      const response = await InboxMessages(2);
      if (response?.status === 401) {
        console.log('TOKEN EXPIRED !');
        handleLogout();
      }

      const messages = response?.data?.data || [];
      dispatch(setStoreSolvedMessageList(response?.data?.data || []));
      // Sum counts for WhatsApp
      const whatsappTotalCount = messages.reduce((total, message) => {
        return total + Number(message.unRead || message.unreadcount || message.count || 0); // Ensure count is a number
      }, 0);

      setWhatsappMessageList(messages);
      setWhatsappUnreadCount(whatsappTotalCount); // Set the calculated total count here
    } catch (error) {
      console.error('Error fetching  messages:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  //  APIs  END

  // UI COMPONENTS START

  const renderMessage = useCallback(({ item }) => {
    return <InboxMessageList navigation={navigation} item={item} f={0} />;
  }, []);
  const assignRenderMessage = useCallback(({ item }) => {
    //console.log("SOCIAL - ITEM ==>", JSON.stringify(item[0], null, 4));
    
    return <InboxMessageList navigation={navigation} item={item} f={1} />;
  }, []);
  const solvedRenderMessage = useCallback(({ item }) => {
    return <InboxMessageList navigation={navigation} item={item} f={2} />;
  }, []);

  const renderLoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="blue" />
      <Text style={{ color: 'grey' }}>{"Logging out..."}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        flexDirection: 'row',
      }}>
      <Text>Oops! No new chat</Text>
      {(IsLoading || initialLoading) === true && (
        <ActivityIndicator size={20} color={'grey'} style={{ marginLeft: 10 }} />
      )}
    </View>
  );
  const renderMessageList = (messageList, renderMessage) => {
    
    const filterMessages = (list) => {
      let filteredList = list;
      if (permissions?.widget === false) {
        filteredList = filteredList.filter((message) => message.platform !== "Live Chat");
      }
      if (permissions?.whatsapp === false) {
        filteredList = filteredList.filter((message) => message.platform !== "whatsapp");
      }
      if (permissions?.facebook === false || reduxUser?.mainuser === 1) {
        filteredList = filteredList.filter((message) => message.platform !== "facebook");
      }
      if (permissions?.instagram === false) {
        filteredList = filteredList.filter((message) => message.platform !== ("Instagram" || "instagram"));
      }
      return filteredList;
    };

    // Filter messages before passing them to FlatList
    const filteredMessageList = filterMessages(messageList);
    return (
      <FlatList
        ref={flatListRef}
        data={filteredMessageList}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
        refreshing={Refreshing}
        onRefresh={onRefresh}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={true}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    );
  };


  const renderContent = (messageList, renderMessage) => {
    if (initialLoading) {
      return <VisitorSkeleton />;
    }
    if (messageList && messageList.length !== 0) {
      return renderMessageList(messageList, renderMessage);
    }
    return renderEmptyState();
  };
  const renderFilterButton = filterName => {
    const platformCounts = {
      Unassign: unassginUnreadCount,
      'My Open': assginUnreadCount,
      Solved: whatsappUnreadCount,
    };

    return (
      <TouchableOpacity
        key={`${filterName}`}
        onPress={() => handleOptionChange(filterName)}
        style={styles.filterButtonWrapper}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={
            selectedFilter === filterName
              ? ['#9C31FD', '#56B6E9']
              : ['#FFFFFF', '#FFFFFF']
          }
          style={[
            styles.filterButton,
            { width: 100 }
            , selectedFilter === filterName && styles.selectedFilterButton,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === filterName
                ? styles.selectedFilterText
                : styles.inactiveFilterText,
            ]}>
            {filterName} ({platformCounts[filterName]}){' '}
            {/* Display the count */}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // UI COMPONENTS END

  // RED DOT FUNCTION
  const updateTotalUnreadCount = messages => {
    const newUnreadCount = messages.reduce(
      (sum, message) => sum + message.unreadcount || message.count,
      0,
    );

    // Only update Redux if the unread count has changed
    if (newUnreadCount !== totalUnreadCount) {
      setTotalUnreadCount(newUnreadCount); // Update local state
      dispatch(setUnreadCount({ unreadCount: newUnreadCount })); // Update Redux store
    }
  };

  // Function to scroll to the top of the list
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // Show or hide the upArrow based on scroll position
    if (scrollY > 50 && !showUpArrow) {
      setShowUpArrow(true); // Show arrow when scrolling down
    } else if (scrollY <= 50 && showUpArrow) {
      setShowUpArrow(false); // Hide arrow when near the top
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };
//console.log("isFocused",isFocused)
  return (
    <SafeAreaView style={styles.container}>
      {isLoggingOut ? (
        renderLoadingOverlay()
      ) : (<>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10 }}>
              <Text style={styles.mainHeading}>Live Conversation</Text>
            </View>
            {/* {(IsLoading || initialLoading) === true ? (
              <ActivityIndicator
                size={20}
                color={'grey'}
                style={{marginRight: 20, marginTop: 10}}
              />
            ) : (
              ''
            )} */}
          </View>
          <View style={styles.ContentContainer}>
            {/* HORIZONTAL SCROLL CHATS OPTIONS */}

            <View style={styles.filterContainer}>
              {[
                'Unassign',
                'My Open',
                'Solved',
              ].map(filter => renderFilterButton(filter))}
            </View>

            {/* CHATS LIST */}
            <View >
              {selectedFilter === 'Unassign' &&
                renderContent(combineUnassginMessageList, renderMessage)}
              {selectedFilter === 'Solved' &&
                renderContent(combineSolvedMessageList, solvedRenderMessage)}
              {selectedFilter === 'My Open' &&
                renderContent(combineAssginMessageList, assignRenderMessage)}
            </View>
          </View>
        </View>
        {showUpArrow && (
          <TouchableOpacity
            style={[styles.upArrow, { top: height * 0.8 }]}
            onPress={scrollToTop}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.radioButtonSelected,
                { height: 25, width: 25, borderRadius: 12.5 },
              ]}>
              <Icon name="arrow-up" size={25} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </>
      )}
    </SafeAreaView>
  );
}
