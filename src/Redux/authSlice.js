import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  profileData: {},
  token: null,
  status: null,
  permissions: {
    visitor: false,
    bots: false,
    faqs: false,
    history: false,
    operator: false,
    statistic: false,
    integrations: false,
    widget: false,
    settings: false,
    departments: false,
    responses: false,
    tags: false,
    blacklist: false,
    plan: false,
    facebook: false,
    instagram: false,
    whatsapp: false
  },
  IsSignedIn: false,
  unreadCount: '0',
  pingPressed: false,
  sesionData: null,
  pusherData: null,
  chatMessagesByUser: {},
  chatMessagesByWhatsappUser: {},
  chatMessagesByFacebookUser: {},
  chatMessagesByInstagramUser: {},

  unAssignMessageList: [],
  unassignUnreadCount:0,
  assignUnreadCount:0,
  solvedUnreadCount:0,
  assignMessageList: [],
  solvedMessageList: [],
  whatsappMessageList: [],
  facebookMessageList: [],
  instagramMessageList: [],

  unAssignDHList: [],
  assignDHList: [],
  solvedDHList: [],
  whatsappDHList: [],
  facebookDHList: [],
  instagramDHList: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = action.payload.status;
      state.IsSignedIn = action.payload.IsSignedIn;
    
      // Parse the permissions string into an array
      const userPermissions = action.payload.user.permissions?.split(',');
    
      // Update state.permissions based on the user's permissions
      for (const key in state.permissions) {
        state.permissions[key] = userPermissions?.includes(key);
      }
    },
    updatePermissions: (state, action) => {
      const newPermissions = action.payload.permissions?.split(',') || []; 
      for (const key in state.permissions) {
        state.permissions[key] = newPermissions.includes(key);
      }
    },
    
    setProfileData: (state, action) => {
      state.profileData = action.payload; 
    },
    removeLoginData: (state, action) => {
      state.user = null;
      state.token = null;
      state.status = null;
      state.IsSignedIn = null;

      for (const key in state.permissions) {
        state.permissions[key] = false;
      }
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload.unreadCount;
    },
    setPingPressed: (state, action) => {
      state.pingPressed = true;
      state.sesionData = action.payload;
    },
    removePingPressed: (state, action) => {
      state.pingPressed = false;
      state.sesionData = null;
    },
    setPusher: (state, action) => {
      state.pusherData = action.payload;
    },

    // Web messages
    setStoreChatMessages: (state, action) => {
      const {sessionId, messages, page} = action.payload; // Use sessionId or userId
      const existingMessages = state.chatMessagesByUser[sessionId] || [];
      const messageIds = existingMessages.map(msg => msg.id);
      const uniqueMessages = messages.filter(
        msg => !messageIds.includes(msg.id),
      );
      state.chatMessagesByUser[sessionId] = 
        page === 1 && !!uniqueMessages?.length ?  // concatenate new sent/received msgs at start
          [...uniqueMessages, ...existingMessages] :  
          [...existingMessages, ...uniqueMessages];
    },
    updateChatMessages: (state, action) => {
      console.log("Now in Slice ====>");
      const { sessionId, newMessage } = action.payload;
      const existingMessages = state.chatMessagesByUser[sessionId] || [];
    
      // Check for duplicates
      const isDuplicate = existingMessages.some(msg => msg.id === newMessage.id);
    
      if (!isDuplicate) {
        state.chatMessagesByUser[sessionId] = [...existingMessages, newMessage];
        console.log("New ====>");
      }else if (isDuplicate)
      {
        console.log("Same ====>");
      }
    },
    clearStoreChatMessages: (state, action) => {
      const {sessionId} = action.payload;
      state.chatMessagesByUser[sessionId] = [];
    },

  // Whatsapp messages
    // setStoreWhatsappMessages: (state, action) => {
    //   const {sessionId, messages,receiverId} = action.payload; // Use sessionId or userId
    //   const existingMessages =
    //     state.chatMessagesByWhatsappUser[sessionId] || [];
    //   const messageIds = existingMessages.map(msg => msg.id || msg.msg_id);
    //   const uniqueMessages = messages.filter(
    //     msg => !messageIds.includes(msg.id || msg.msg_id),
    //   );
    //   state.chatMessagesByWhatsappUser[sessionId] = [
    //     ...existingMessages,
    //     ...uniqueMessages,
    //   ];
    // },
    setStoreWhatsappMessages: (state, action) => {
      const {sessionId, messages, receiverId, page} = action.payload; 
      const compositeKey = `${sessionId}_${receiverId}`; 
      const existingMessages =
        state.chatMessagesByWhatsappUser[compositeKey] || [];
      const messageIds = existingMessages.map(msg => msg.id || msg.msg_id);
      const uniqueMessages = messages.filter(
        msg => !messageIds.includes(msg.id || msg.msg_id),
      );
      state.chatMessagesByWhatsappUser[compositeKey] = 
        page === 1 && !!uniqueMessages?.length ?  // concatenate new sent/received msgs at start
          [...uniqueMessages, ...existingMessages] :  
          [...existingMessages, ...uniqueMessages];
    }
,
    
    clearStoreWhatsappMessages: (state, action) => {
      const {sessionId} = action.payload;
      state.chatMessagesByWhatsappUser[sessionId] = [];
    },



// Facebook messages
setStoreFacebookMessages: (state, action) => {
  const { sessionId, messages, receiverId, page } = action.payload;
  const compositeKey = `${sessionId}_${receiverId}`; // Composite key
  const existingMessages = state.chatMessagesByFacebookUser[compositeKey] || [];
  const existingMessageIds = existingMessages.map(msg => msg.message_mid);
  const uniqueMessages = messages.filter(
    msg => !existingMessageIds.includes(msg.message_mid),
  );
  state.chatMessagesByFacebookUser[compositeKey] =  
    page === 1 && !!uniqueMessages?.length ?  // concatenate new sent/received msgs at start
      [...uniqueMessages, ...existingMessages] :  
      [...existingMessages, ...uniqueMessages];
},

updateFacebookMessages: (state, action) => {
  const { sessionId, newMessage } = action.payload;
  
  // Get the existing messages for this session
  const existingMessages = state.chatMessagesByFacebookUser[sessionId] || [];
  
  // Check if newMessage is already in the existing messages by message_mid
  const isDuplicate = existingMessages.some(
    msg => msg.message_mid === newMessage.message_mid
  );

  // Only add the new message if it's not a duplicate
  if (!isDuplicate) {
    state.chatMessagesByFacebookUser[sessionId] = [
      ...existingMessages,
      newMessage,
    ];
  }
}
,
 clearStoreFacebookMessages: (state, action) => {
      const {sessionId} = action.payload;
      state.chatMessagesByFacebookUser[sessionId] = [];
    },



  // Instagram messages 
  setStoreInstagramMessages: (state, action) => {
    const { sessionId, messages, receiverId, page } = action.payload;
    const compositeKey = `${sessionId}_${receiverId}`; // Composite key
    const existingMessages = state.chatMessagesByInstagramUser[compositeKey] || [];
    const messageIds = existingMessages.map(msg => msg.id || msg.msg_id);
    const uniqueMessages = messages.filter(
      msg => !messageIds.includes(msg.id || msg.msg_id),
    );
    state.chatMessagesByInstagramUser[compositeKey] =
      page === 1 && !!uniqueMessages?.length ?  // concatenate new sent/received msgs at start
        [...uniqueMessages, ...existingMessages] :  
        [...existingMessages, ...uniqueMessages];
  },
    updateInstagramMessages: (state, action) => {
      const { sessionId, newMessage } = action.payload;
      const existingMessages = state.chatMessagesByInstagramUser[sessionId] || [];
      
      // Check for duplicates
      const isDuplicate = existingMessages.some(msg => msg.id === newMessage.id);
    
      if (!isDuplicate) {
        state.chatMessagesByInstagramUser[sessionId] = [...existingMessages, newMessage];
      }
    },
    clearStoreInstagramMessages: (state, action) => {
      const {sessionId} = action.payload;
      state.chatMessagesByInstagramUser[sessionId] = [];
    },


    // INBOX LISTING STARTS HERE

    // UN-ASSIGN LIST
    setStoreUnassignMessageList: (state, action) => {
      state.unAssignMessageList = action.payload;
    },
    updateUnassignMessageList: (state, action) => {
      const data = action.payload;
      // console.log("payload ===>", data);

    
      const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      };
    
      // Determine the platform (Instagram, WhatsApp, or Web)
      const isInstagram = data.message && data.message.sender_id;
      const isWhatsApp = data.platform === 'whatsapp';
    
      // Extract identifiers and relevant information
      const identifier = isInstagram
        ? data.message.sender_id 
        : isWhatsApp 
          ? data.messages[0]?.from 
          : data.session;
    
      const recipientId = isInstagram
        ? data.message.recipient_id
        : isWhatsApp
          ? data.messages[0]?.recipient_id
          : null;
    // console.log("recipientId =====>",recipientId);
      const messageId = isInstagram
        ? data.message.message_mid
        : isWhatsApp
          ? data.messages[0]?.message_mid
          : null;
    
      const lastMessage = isInstagram 
        ? data.message.message 
        : isWhatsApp 
          ? data.messages[0]?.text?.body 
          : data.message;

          const status = isInstagram
        ? data?.message?.status
        : isWhatsApp
          ? data?.status
          : null;

          const operatorId = isInstagram
          ? data?.message?.operatorId
          : isWhatsApp
            ? data?.operatorId
            : null;
    
      const email = isInstagram || isWhatsApp ? null : data.email;
    
      // WhatsApp-specific fields
      const displayPhoneNumber = isWhatsApp ? data.metadata?.display_phone_number : null;
      const phoneNumberId = isWhatsApp ? data.metadata?.phone_number_id : null;
    
      // Find the message index in unAssignMessageList based on the appropriate identifier
      const messageIndex = state.unAssignMessageList.findIndex(message => 
        isInstagram
          ? message.sender_id === identifier // Instagram identifier check
          : isWhatsApp
            ? message.sender_id === data.messages[0]?.from  &&  message.phone_number_id === phoneNumberId  // WhatsApp identifier check
            : message.session === identifier   // Web identifier check
      );
    
      if (messageIndex > -1) {
        // Update the existing message in unAssignMessageList and move to the top
        const previousUnreadCount = parseInt(state.unAssignMessageList[messageIndex].unreadcount, 10) || 0;
        const previousUnRead = parseInt(state.unAssignMessageList[messageIndex].unRead, 10) || 0;
        
        const updatedMessage = {
          ...state.unAssignMessageList[messageIndex],
          lastmessage: lastMessage,
          mtime: formatTime(),

          unRead: (isWhatsApp || isInstagram) ? previousUnRead + 1 : previousUnRead,
      unreadcount: !(isWhatsApp || isInstagram) ? previousUnreadCount + 1 : previousUnreadCount,
        
          // email: email || state.unAssignMessageList[messageIndex].email, // Preserve email if absent
          // display_phone_number: displayPhoneNumber || state.unAssignMessageList[messageIndex].display_phone_number,
          // phone_number_id: phoneNumberId || state.unAssignMessageList[messageIndex].phone_number_id,
        };
        console.log(`After update: unreadcount = ${updatedMessage.unreadcount}, unRead = ${updatedMessage.unRead}`);
        // Remove the existing message from its current position
        state.unAssignMessageList.splice(messageIndex, 1);
    
        // Prepend the updated message to the top
        state.unAssignMessageList = [updatedMessage, ...state.unAssignMessageList];
    
      } else {
        // Add a new message if not 
        
        const newMessage = {
          id: Date.now().toString(),
          session: identifier, 
          name: isInstagram ? data.extraName : isWhatsApp ? data?.contacts[0]?.profile?.name : data.name,
          lastmessage: lastMessage,
          mtime: formatTime(),
          unreadcount: 1,
          color: isInstagram ? '#0078FF' : isWhatsApp ? '#25D366' : '#bf175e',
          email: email,
          wid: data.wid || null,
          platform: data?.platform || data?.message?.platform || null,
          sender_id: isInstagram || isWhatsApp ? identifier : null, 
          recipient_id: recipientId,
          mid: messageId,
          display_phone_number: displayPhoneNumber, 
          phone_number_id: phoneNumberId,   
          access_token:data.token,  
          page_id:data.page_id,
          page_name:data.page_name,  
          status: status,
          operatorId: operatorId,
          ses_status: status,  
        };
        console.log("newMessage ===>",newMessage);
        // Prepend the new message to the top
        state.unAssignMessageList = [newMessage, ...state.unAssignMessageList];
      }
    },
    
    setStoreUnassignUnreadCount: (state,action) => {
      state.unassignUnreadCount = action.payload;
    },
    updateUnassignUnreadCount: (state) => {
      state.unassignUnreadCount += 1;
      console.log("UNASSIGNED _ COUNT :",state.unassignUnreadCount);
    },
    resetUserUnassignUnreadCount: (state, action) => {
      const { identifier } = action.payload; // identifier can be sender_id or session
      
      // Find the user in unAssignMessageList
      const userIndex = state.unAssignMessageList.findIndex(
        message => message.sender_id === identifier || message.session === identifier
      );
    
      if (userIndex > -1) {
        // Log matched user data for debugging
        // console.log("Matched User in unAssignMessageList:", state.unAssignMessageList[userIndex]);
    
        // Log the unread count before resetting
        const userUnreadCountBefore = state.unAssignMessageList[userIndex].unRead || 0; // Assuming 'unRead' is the correct property
        // console.log("User's Unread Count Before Reset:", userUnreadCountBefore);
    
        // Log total unread count in unAssignMessageList before resetting
        const totalUnreadCountBefore = state.unAssignMessageList.reduce(
          (total, message) => total + (Number(message.unRead) || 0), // Use the correct property
          0
        );
        // console.log("Total Unread Count Before Reset:", totalUnreadCountBefore);
    
        // Set the unread count for the specific user in unAssignMessageList to zero
        state.unAssignMessageList[userIndex].unRead = 0; // Update this line accordingly
    
        // Log the unread count after resetting for the specific user
        // console.log("User's Unread Count After Reset:", state.unAssignMessageList[userIndex].unRead);
    
        // Find the corresponding user in assignMessageList to reset unread count
        const assignUserIndex = state.assignMessageList.findIndex(
          message => message.sender_id === identifier || message.session === identifier
        );
    
        if (assignUserIndex > -1) {
          // Log the unread count before resetting in assignMessageList
          const assignUserUnreadCountBefore = state.assignMessageList[assignUserIndex].unreadcount || 0;
          // console.log("Corresponding User's Unread Count Before Reset in assignMessageList:", assignUserUnreadCountBefore);
    
          // Set the unread count for the corresponding user in assignMessageList to zero
          state.assignMessageList[assignUserIndex].unreadcount = 0; // Assuming 'unreadcount' is the correct property
          
          // Log the unread count after resetting for the corresponding user
          // console.log("Corresponding User's Unread Count After Reset in assignMessageList:", state.assignMessageList[assignUserIndex].unreadcount);
        } else {
          // console.log("No corresponding user found in assignMessageList for identifier:", identifier);
        }
    
        // Log the total unread count in unAssignMessageList after resetting
        const totalUnreadCountAfter = state.unAssignMessageList.reduce(
          (total, message) => total + (Number(message.unRead) || 0), // Use the correct property
          0
        );
        // console.log("Total Unread Count After Reset:", totalUnreadCountAfter);
        
      } else {
        // console.log("User not found in unAssignMessageList with identifier:", identifier);
      }
    },
    
    


    // MOVE TO ASSIGN 
    moveMessageToAssignList: (state, action) => {
      const {session, data} = action.payload;
      const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      };

      // Remove from unassign list
      state.unAssignMessageList = state.unAssignMessageList.filter(
        message => message.session !== session,
      );

      // Add to assign list
      const newMessage = {
        id: Date.now().toString(),
        session: session,
        name: data.name,
        lastmessage: data.message,
        mtime: formatTime(),
        unreadcount: 1,
        color: '#bf175e',
        email: data.email,
      };
      state.assignMessageList = [newMessage, ...state.assignMessageList];
    },

// 

    assignUserMessage: (state, action) => {
      const { convid, platform, message } = action.payload;
      console.log("convid ===>", convid);
    
      let messageIndex;
    
      // Check in unAssignMessageList based on platform type
      if (platform === "facebook" || platform === "fb" ||
          platform === "instagram" || platform === "insta" ||
          platform === "whatsapp") {
        messageIndex = state.unAssignMessageList.findIndex(msg => msg.sender_id === convid);
      } else {
        messageIndex = state.unAssignMessageList.findIndex(msg => msg.session === convid);
      }
    
      if (messageIndex > -1) {
        console.log("User found in unAssignMessageList. Moving to assignMessageList.");
    
        // Move the matched message from unAssignMessageList to assignMessageList
        const [assignedMessage] = state.unAssignMessageList.splice(messageIndex, 1);
        state.assignMessageList = [{ ...assignedMessage, platform, message }, ...state.assignMessageList];
        console.log("User successfully moved from unAssignMessageList to assignMessageList.");
      } else {
        console.log("User not found in unAssignMessageList. Checking solvedMessageList.");
    
        // Check in solvedMessageList if not found in unAssignMessageList
        if (platform === "facebook" || platform === "fb" ||
            platform === "instagram" || platform === "insta" ||
            platform === "whatsapp") {
          messageIndex = state.solvedMessageList.findIndex(msg => msg.sender_id === convid);
        } else {
          messageIndex = state.solvedMessageList.findIndex(msg => msg.session === convid);
        }
    
        if (messageIndex > -1) {
          console.log("User found in solvedMessageList. Moving to assignMessageList.");
    
          // Move the matched message from solvedMessageList to assignMessageList
          const [assignedMessage] = state.solvedMessageList.splice(messageIndex, 1);
          state.assignMessageList = [{ ...assignedMessage, platform, message }, ...state.assignMessageList];
          console.log("User successfully moved from solvedMessageList to assignMessageList.");
        } else {
          console.log("User not found in solvedMessageList.");
        }
      }
    },
    
    removeUserFromLists: (state, action) => {
      const { convid,platform,recieverId } = action.payload;
      
        if (["facebook", "fb", "instagram", "insta", "whatsapp"].includes(platform)) {
    
    // Remove from unAssignMessageList if both sender and recipient match
    state.unAssignMessageList = state.unAssignMessageList.filter(
      msg => !(msg.sender_id === convid && (msg.recipient_id === recieverId || msg.display_phone_number === recieverId))
    );

    // Remove from assignMessageList if both sender and recipient match
    state.assignMessageList = state.assignMessageList.filter(
      msg => !(msg.sender_id === convid && (msg.recipient_id === recieverId || msg.display_phone_number === recieverId))
    );
  }else{
         // Remove from unAssignMessageList if found
         state.unAssignMessageList = state.unAssignMessageList.filter(
          msg => msg.session !== convid
        );
      
        // Remove from assignMessageList if found
        state.assignMessageList = state.assignMessageList.filter(
          msg => msg.session !== convid
        );
      
        console.log("REMOVING  ====>",convid);
    }
  },
  solveUserMessage: (state, action) => {
    const { convid, platform,} = action.payload;
    console.log("convid ===>", convid);
    console.log("platform ===>", platform);
  
    let messageIndex;
  
    // Check in unAssignMessageList based on the platform
    if (platform === "facebook" || platform === "fb" ||
        platform === "instagram" || platform === "insta" ||
        platform === "whatsapp") {
      messageIndex = state.unAssignMessageList.findIndex(msg => msg.sender_id === convid);
    } else {
      messageIndex = state.unAssignMessageList.findIndex(msg => msg.session === convid);
    }
  
    if (messageIndex > -1) {
      console.log("User found in unAssignMessageList. Moving to solvedMessageList.");
  
      // Move from unAssignMessageList to solvedMessageList
      const [solvedMessage] = state.unAssignMessageList.splice(messageIndex, 1);
      state.solvedMessageList = [
        { ...solvedMessage, platform, },
        ...state.solvedMessageList
      ];
      console.log("User successfully moved from unAssignMessageList to solvedMessageList.");
    } else {
      // Check in assignMessageList if not found in unAssignMessageList
      if (platform === "facebook" || platform === "fb" ||
          platform === "instagram" || platform === "insta" ||
          platform === "whatsapp") {
        messageIndex = state.assignMessageList.findIndex(msg => msg.sender_id === convid);
      } else {
        messageIndex = state.assignMessageList.findIndex(msg => msg.session === convid);
      }
  
      if (messageIndex > -1) {
        console.log("User found in assignMessageList. Moving to solvedMessageList.");
  
        // Move from assignMessageList to solvedMessageList
        const [solvedMessage] = state.assignMessageList.splice(messageIndex, 1);
        state.solvedMessageList = [
          { ...solvedMessage, platform,  },
          ...state.solvedMessageList
        ];
        console.log("User successfully moved from assignMessageList to solvedMessageList.");
      } else {
        console.log("User not found in either list.");
      }
    }
  },
  



    // ASSIGN LIST
    setStoreAssignMessageList: (state, action) => {
      state.assignMessageList = action.payload;
    },
    updateAssignMessageList: (state, action) => {
      const data = action.payload;
      // console.log("payload ===>", data);
      // console.log("Static name value:", data.extraName);
      // console.log("Static name token:", data.token);
      // console.log("Static name page_id:", data.page_id);
      // console.log("Static name page_name:", data.page_name);
    
      const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      };
    
      // Determine the platform (Instagram, WhatsApp, or Web)
      const isInstagram = data.message && data.message.sender_id;
      const isWhatsApp = data.platform === 'whatsapp';
    
      // Extract identifiers and relevant information
      const identifier = isInstagram
        ? data.message.sender_id 
        : isWhatsApp 
          ? data.messages[0]?.from 
          : data.session;
    
      const recipientId = isInstagram
        ? data.message.recipient_id
        : isWhatsApp
          ? data.messages[0]?.recipient_id
          : null;
    // console.log("recipientId =====>",recipientId);
      const messageId = isInstagram
        ? data.message.message_mid
        : isWhatsApp
          ? data.messages[0]?.message_mid
          : null;
    
      const lastMessage = isInstagram 
        ? data.message.message 
        : isWhatsApp 
          ? data.messages[0]?.text?.body 
          : data.message;
    
          const status = isInstagram
          ? data?.message?.status
          : isWhatsApp
            ? data?.status
            : null;
  
            const operatorId = isInstagram
            ? data?.message?.operatorId
            : isWhatsApp
              ? data?.operatorId
              : null;


      const email = isInstagram || isWhatsApp ? null : data.email;
    
      // WhatsApp-specific fields
      const displayPhoneNumber = isWhatsApp ? data.metadata?.display_phone_number : null;
      const phoneNumberId = isWhatsApp ? data.metadata?.phone_number_id : null;
    
      // Find the message index in assignMessageList based on the appropriate identifier
      const messageIndex = state.assignMessageList.findIndex(message => 
        isInstagram
          ? message.sender_id === identifier // Instagram identifier check
          : isWhatsApp
            ? message.sender_id === data.messages[0]?.from  &&  message.phone_number_id === phoneNumberId  // WhatsApp identifier check
            : message.session === identifier   // Web identifier check
      );
    
      if (messageIndex > -1) {
        // Update the existing message in assignMessageList and move to the top
        const previousUnreadCount = parseInt(state.assignMessageList[messageIndex].unreadcount, 10) || 0;
        const previousUnRead = parseInt(state.assignMessageList[messageIndex].unRead, 10) || 0;
        
        const updatedMessage = {
          ...state.assignMessageList[messageIndex],
          lastmessage: lastMessage,
          mtime: formatTime(),

          unRead: (isWhatsApp || isInstagram) ? previousUnRead + 1 : previousUnRead,
      unreadcount: !(isWhatsApp || isInstagram) ? previousUnreadCount + 1 : previousUnreadCount,

          // email: email || state.assignMessageList[messageIndex].email, // Preserve email if absent
          // display_phone_number: displayPhoneNumber || state.assignMessageList[messageIndex].display_phone_number,
          // phone_number_id: phoneNumberId || state.assignMessageList[messageIndex].phone_number_id,
        };
    
        // Remove the existing message from its current position
        state.assignMessageList.splice(messageIndex, 1);
    
        // Prepend the updated message to the top
        state.assignMessageList = [updatedMessage, ...state.assignMessageList];
    
      } else {
        // Add a new message if not 
        
        const newMessage = {
          id: Date.now().toString(),
          session: identifier, 
          name: isInstagram ? data.extraName : isWhatsApp ? data?.contacts[0]?.profile?.name : data.name,
          lastmessage: lastMessage,
          mtime: formatTime(),
          unreadcount: 1,
          color: isInstagram ? '#0078FF' : isWhatsApp ? '#25D366' : '#bf175e',
          email: email,
          wid: data.wid || null,
          platform: data?.platform || data?.message?.platform || null,
          sender_id: isInstagram || isWhatsApp ? identifier : null, 
          recipient_id: recipientId,
          mid: messageId,
          display_phone_number: displayPhoneNumber, 
          phone_number_id: phoneNumberId,   
          access_token:data.token,  
          page_id:data.page_id,
          page_name:data.page_name,
          status: status,
          operatorId: operatorId,
          ses_status: status,    
        };
        console.log("newMessage ===>",newMessage);
        // Prepend the new message to the top
        state.assignMessageList = [newMessage, ...state.assignMessageList];
      }
    },
    
    setStoreAassignUnreadCount: (state,action) => {
      state.assignUnreadCount = action.payload;
    },
    updateAssignUnreadCount: (state) => {
      state.assignUnreadCount += 1;
    },

    resetUserUnreadCount: (state, action) => {
      const { senderId, recipientId } = action.payload;
  
      // Locate the user in assignMessageList based on the identifier (sender_id or session) and recipient
      const userIndex = state.assignMessageList.findIndex(
        message => 
          (message.sender_id === senderId || message.session === senderId) && 
          (message.recipient_id === recipientId || message.phone_number_id === recipientId)
      );
  
      if (userIndex > -1) {
          const matchedUser = state.assignMessageList[userIndex];
          const userUnreadCount = Number(matchedUser.unreadcount || matchedUser.unRead) || 0;
  
          console.log("User's Unread Count Before Reset:", userUnreadCount);
  
          // Update the total unread count by subtracting the specific user's unread count
          state.assignUnreadCount = Math.max(0, state.assignUnreadCount - userUnreadCount);
  
          // Reset the specific user's unread count to zero
          matchedUser.unreadcount = 0;
          matchedUser.unRead = 0;
  
          console.log("Updated Total Unread Count:", state.assignUnreadCount);
      } else {
          console.log("User not found in assignMessageList with identifier:", senderId);
      }
  },


  setAddUserToAssignList: (state, action) => {
    const data = action.payload;
    console.log("TRANSFER USER DATA ===>", data);
    console.log("TRANSFER USER page_name ===>", data.page_name);
    console.log("TRANSFER USER platform ===>", data.platform);
    const formatTime = (timestamp) => {
      const date = new Date(timestamp * 1000); // Convert to milliseconds
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };
    const newMessage = {
      id: data.id || data.msg_id,
      session: data.session,
      name: data.name || data.from_name,
      lastmessage: data.lastMessage || data.message,
      mtime: formatTime(data.msg_date),  // Convert msg_date to "HH:mm" format
      unreadcount: data.unread || data.count,
      color: data.color,
      email: data.email,
      wid: data.wid || null,
      platform: data.platform,  // Using platform directly from updatedData
      sender_id: data.sender_id || data.from_id || data.from_phone,
      recipient_id: data.recipient_id || data.to,
      operatorId: data.operatorId,
      mid: data.messageId,
      display_phone_number: data.display_phone_number,
      phone_number_id: data.phone_number_id,
      access_token: data.token || data.access_token,
      page_id: data.page_id,
      page_name: data.page_name,
      tag: data.tag,
    };
  
    console.log("newMessage ===>", newMessage);
  
    // Prepend the new message to the top of the assignMessageList
    state.assignMessageList = [newMessage, ...state.assignMessageList];
  },
  
  
  
  
    
    
    
    
    
    
    
    
    


    // SOLVED LIST
    setStoreSolvedMessageList: (state, action) => {
      state.solvedMessageList = action.payload;
    },
    updateSolvedMessageList: (state, action) => {
      const data = action.payload;
      const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      };

      const messageIndex = state.solvedMessageList.findIndex(
        message => message.session === data.session,
      );

      if (messageIndex > -1) {
        // Update the existing message in assignMessageList
        state.solvedMessageList[messageIndex] = {
          ...state.solvedMessageList[messageIndex],
          lastmessage: data.message,
          mtime: formatTime(),
          unreadcount:
            (parseInt(state.solvedMessageList[messageIndex].unreadcount, 10) ||
              0) + 1,
          email: data.email,
        };
      } else {
        // Add a new message if not found
        const newMessage = {
          id: Date.now().toString(),
          session: data.session,
          name: data.name,
          lastmessage: data.message,
          mtime: formatTime(),
          unreadcount: 1,
          color: '#bf175e',
          email: data.email,
          wid:data.wid,
        };
        state.solvedMessageList = [newMessage, ...state.solvedMessageList];
      }
    },
    resetUserSolvedUnreadCount: (state, action) => {
      const { identifier } = action.payload; // identifier can be sender_id or session
      
      // Find the user in solvedMessageList
      const userIndex = state.solvedMessageList.findIndex(
        message => message.sender_id === identifier || message.session === identifier
      );
    
      if (userIndex > -1) {
        // Log matched user data for debugging
        console.log("Matched User in solvedMessageList:", state.solvedMessageList[userIndex]);
    
        // Log the unread count before resetting
        const userUnreadCountBefore = state.solvedMessageList[userIndex].unreadcount || 0; // Assuming 'unreadcount' is the correct property
        // console.log("User's Unread Count Before Reset:", userUnreadCountBefore);
    
        // Log total unread count in solvedMessageList before resetting
        const totalUnreadCountBefore = state.solvedMessageList.reduce(
          (total, message) => total + (Number(message.unreadcount || message.unread) || 0), // Use the correct property
          0
        );
        // console.log("Total Unread Count Before Reset:", totalUnreadCountBefore);
    
        // Set the unread count for the specific user in solvedMessageList to zero
        state.solvedMessageList[userIndex].unreadcount = 0;
        state.solvedMessageList[userIndex].unread = 0;
    
        // Log the unread count after resetting for the specific user
        // console.log("User's Unread Count After Reset:", state.solvedMessageList[userIndex].unreadcount);
        // console.log("User's Unread  After Reset:", state.solvedMessageList[userIndex].unread);
    
        // Log total unread count in solvedMessageList after resetting
        const totalUnreadCountAfter = state.solvedMessageList.reduce(
          (total, message) => total + (Number(message.unreadcount || message.unread) || 0), // Use the correct property
          0
        );
        // console.log("Total Unread Count After Reset:", totalUnreadCountAfter);

        
      } else {
        // console.log("User not found in solvedMessageList with identifier:", identifier);
      }
    },
    

// Clearing all STATES
    clearAllState: (state) => {
      Object.assign(state, initialState); // Reset state to initial values
    },



    // WHATSAPP LIST
    setStoreWhatsappMessageList: (state, action) => {
      state.whatsappMessageList = action.payload;
    },
    updateWhatsappMessageList: (state, action) => {
      const newMessage = action.payload.message;
      const existingIndex = state.whatsappMessageList.findIndex(
        msg => msg.from_id === newMessage.sender_id,
      );

      if (existingIndex >= 0) {
        // If the message already exists, update it and move it to the top
        const updatedMessages = [...state.whatsappMessageList];
        const existingMessage = {...updatedMessages[existingIndex]};

        // Update message text and other relevant fields
        existingMessage.message = newMessage.message;
        existingMessage.created_time = new Date().toISOString();
        existingMessage.count = (
          parseInt(existingMessage.count, 10) + 1
        ).toString();

        // Move the updated message to the top
        updatedMessages.splice(existingIndex, 1);
        state.whatsappMessageList = [existingMessage, ...updatedMessages];
      } else {
        // If the message is new, create a new entry and add it to the top
        const newMessageObject = {
          from_name: newMessage.from_name || 'Unknown',
          from_id: newMessage.sender_id,
          message: newMessage.message,
          count: '1', // Initialize the count
          created_time: new Date().toISOString(), // Set current time
        };
        state.whatsappMessageList = [
          newMessageObject,
          ...state.whatsappMessageList,
        ];
      }
    },


    // FACEBOOK LIST
    setStoreFacebookMessageList: (state, action) => {
      state.facebookMessageList = action.payload;
    },
    updateFacebookMessageList: (state, action) => {
      const newMessage = action.payload.message;
      const existingIndex = state.facebookMessageList.findIndex(
        msg => msg.from_id === newMessage.sender_id,
      );

      if (existingIndex >= 0) {
        // If the message already exists, update it and move it to the top
        const updatedMessages = [...state.facebookMessageList];
        const existingMessage = {...updatedMessages[existingIndex]};

        // Update message text and other relevant fields
        existingMessage.message = newMessage.message;
        existingMessage.created_time = new Date().toISOString();
        existingMessage.count = (
          parseInt(existingMessage.count, 10) + 1
        ).toString();

        // Move the updated message to the top
        updatedMessages.splice(existingIndex, 1);
        state.facebookMessageList = [existingMessage, ...updatedMessages];
      } else {
        // If the message is new, create a new entry and add it to the top
        const newMessageObject = {
          from_name: newMessage.from_name || 'Unknown',
          from_id: newMessage.sender_id,
          message: newMessage.message,
          count: '1', // Initialize the count
          created_time: new Date().toISOString(), // Set current time
        };
        state.facebookMessageList = [
          newMessageObject,
          ...state.facebookMessageList,
        ];
      }
    },


    // INSTAGRAM LIST
    setStoreInstagramMessageList: (state, action) => {
      state.instagramMessageList = action.payload;
    },
    updateInstagramMessageList: (state, action) => {
      const newMessage = action.payload.message;
      const existingIndex = state.instagramMessageList.findIndex(
        msg => msg.from_id === newMessage.sender_id,
      );

      if (existingIndex >= 0) {
        // If the message already exists, update it and move it to the top
        const updatedMessages = [...state.instagramMessageList];
        const existingMessage = {...updatedMessages[existingIndex]};

        // Update message text and other relevant fields
        existingMessage.message = newMessage.message;
        existingMessage.created_time = new Date().toISOString();
        existingMessage.count = (
          parseInt(existingMessage.count, 10) + 1
        ).toString();

        // Move the updated message to the top
        updatedMessages.splice(existingIndex, 1);
        state.instagramMessageList = [existingMessage, ...updatedMessages];
      } else {
        // If the message is new, create a new entry and add it to the top
        const newMessageObject = {
          from_name: newMessage.from_name || 'Unknown',
          from_id: newMessage.sender_id,
          message: newMessage.message,
          count: '1', // Initialize the count
          created_time: new Date().toISOString(), // Set current time
        };
        state.instagramMessageList = [
          newMessageObject,
          ...state.instagramMessageList,
        ];
      }
    },
  },
});

export const {
  setLoginData,
  updatePermissions,
  setProfileData,
  removeLoginData,
  setUnreadCount,
  setPingPressed,
  removePingPressed,
  setPusher,
  setStoreChatMessages,
  updateChatMessages,
  clearStoreChatMessages,
  setStoreWhatsappMessages,
  updateWhatsappMessages,
  clearStoreWhatsappMessages,
  setStoreFacebookMessages,
  updateFacebookMessages,
  clearStoreFacebookMessages,
  setStoreInstagramMessages,
  updateInstagramMessages,
  clearStoreInstagramMessages,
  setStoreAssignMessageList,
  updateAssignMessageList,
  setStoreAassignUnreadCount,
  updateAssignUnreadCount,
  setStoreUnassignMessageList,
  updateUnassignMessageList,
  setStoreUnassignUnreadCount,
  updateUnassignUnreadCount,
  moveMessageToAssignList,
  setStoreSolvedMessageList,
  updateSolvedMessageList,
  setStoreFacebookMessageList,
  updateFacebookMessageList,
  setStoreInstagramMessageList,
  updateInstagramMessageList,
  setStoreWhatsappMessageList,
  updateWhatsappMessageList,
  combinedMessageList,

  resetUserUnreadCount,
  recalculateTotalUnreadCount,

  resetUserUnassignUnreadCount,
  recalculateTotalUnassignUnreadCount,

  resetUserSolvedUnreadCount,
  recalculateTotalSolvedUnreadCount,

  assignUserMessage,
  removeUserFromLists,
  solveUserMessage,
  setAddUserToAssignList,

  setStoreAssignDHList,
  setStoreFacebookDHList,
  setStoreInstagramDHList,
  setStoreWhatsappDHList,
  setStoreUnassignDHList,
  clearAllState,
} = authSlice.actions;

export default authSlice.reducer;
