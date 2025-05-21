import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentage } from '../utilities/constants';
import { moderateScale } from '../utilities/Scales';
import colors from '../Theme/colors';
import { useDispatch } from 'react-redux';
import { recalculateTotalUnreadCount, resetUserSolvedUnreadCount, resetUserUnassignUnreadCount, resetUserUnreadCount } from '../Redux/authSlice';
import { useIsFocused } from '@react-navigation/native';

const truncateString = (str, maxLength = 30) => {
  if (str && str.length > maxLength) {
    return str.substring(0, maxLength) + '...';
  }
  return str;
};

const formatTime = (timeString) => {
  // Handle Unix timestamps (e.g., "1730307397")
  if (!isNaN(timeString) && Number(timeString) > 1000000000) {
    const date = new Date(Number(timeString) * 1000); // Convert to milliseconds
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
  
    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }

  if (!timeString || typeof timeString !== 'string') {
    return '.. ..';
  }
  
  // Check for ISO format (e.g., "2024-10-17T14:43:39.000000Z")
  if (timeString.includes('T') && timeString.includes('Z')) {
    const date = new Date(timeString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }
  
  // Handle 24-hour time strings (e.g., "18:56:44")
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    const [hours, minutes] = timeString.split(':').map(Number);

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }

  // Handle date and time combined strings (e.g., "2024-10-22 13:43:23")
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timeString)) {
    const [datePart, timePart] = timeString.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }

  // Handle AM/PM time strings (e.g., "02:43 PM")
  if (timeString.includes('AM') || timeString.includes('PM')) {
    const [time, ampm] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes} ${ampm}`;
  }

  return '.. ..';
};

export default function InboxMessageList({ navigation, item, f }) {

  const dispatch = useDispatch();

  //  console.log("SOCIAL - ITEM ==>", JSON.stringify(item, null, 4));

  const words = item?.name || item?.from_name || item?.sender_name ? (item.name || item?.from_name || item?.sender_name).split(" ") : [];
  const abbreviation = words.length > 1
    ? (words[0]?.[0] + words[1]?.[0])
    : words[0]?.substring(0, 1) || "";

    const type = item?.display_phone_number || item?.platform === 'whatsapp'
    ? "whatsapp" 
    : item?.widgetid ||  item?.wid  || item?.platform === 'Live Chat'
    ? "live" 
    : item?.to_name && item?.from_id || item?.platform === 'FB Messenger' || item?.platform === 'facebook'
    ? "facebook" 
    : !item?.to_name && item?.from_id || item?.platform === 'Instagram'   || item?.platform === 'instagram'
    ? "instagram" 
    : "unknown";  

    const handleChatNavigation = (senderId, recipientId) => {
      if (f === 1) {
          dispatch(resetUserUnreadCount({ senderId, recipientId }));
      }
      
  };
 

// console.log("ITEM ==>", JSON.stringify(item, null, 4));
  return (
   
    <TouchableOpacity 
    onPress={() => {
        handleChatNavigation(item?.sender_id || item?.session, item?.recipient_id || item?.phone_number_id);
        navigation.navigate("ChatScreen", { user: item, f: f, type: type });
    }} 
    style={styles.messageContainer}>
     <View style={[styles.avatar, { backgroundColor: item?.color ? item.color : "pink" }]}>

        <Text style={styles.initials}>{abbreviation}</Text>
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item?.name || item?.from_name || item?.sender_name || "Unknown"}</Text>
<Text 
  style={{
    color: item?.display_phone_number || item?.platform === 'whatsapp' 
      ? "green"  
      : item?.widgetid || item?.wid  || item?.platform  ===  'Live Chat'
      ? "brown"  
      : item?.to_name && item?.from_id || item?.platform === 'FB Messenger' || item?.platform === 'facebook' || item?.platform === 'fb'
      ? "blue"   
      : !item?.to_name && item?.from_id || item?.platform === 'Instagram'   || item?.platform === 'instagram' || item?.platform === 'insta'
      ? "pink"    
      : "grey",  
    fontSize: 11
  }}
>
  {item?.display_phone_number || item?.platform === 'whatsapp'
    ? `Whatsapp - ${item?.page_name || item?.display_phone_number || item?.phone_number}` 
    : item?.widgetid || item?.wid  ||  item?.platform  === 'Live Chat'
    ? `Live Chat - ${item?.widgetName || ""}`
    : item?.to_name && item?.from_id || item?.platform === 'FB Messenger' || item?.platform === 'facebook' || item?.platform ==='fb'
    ? `Facebook - ${item?.page_name || ""}` 
    : !item?.to_name && item?.from_id || item?.platform === 'Instagram'   || item?.platform === 'instagram' || item?.platform === 'insta'
    ? `Instagram - ${item?.page_name || ""}` 
    : ""}
</Text> 

        <Text style={styles.message} ellipsizeMode="tail">
          {truncateString(item?.lastmessage || item?.message || item?.last_message || "no message")}
        </Text>
      </View>
      <View style={{ flexDirection: "column", gap: 5, alignItems: 'flex-end' }}>
        <View style={{ flexDirection: "row", gap: 10 }}>

          {(item?.unreadcount > 0 || item?.count > 0 || item?.unRead > 0) && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{(item?.unreadcount || item?.count || item?.unRead).toString()}</Text>
            </View>
          )}
          <Text style={styles.time}> {formatTime(item?.msg_date || item?.mtime)}</Text>
        </View>
       
        {(item?.department_name || item?.tag || item?.tag_name) ? (
//           <Text
//   style={{
//     backgroundColor: 
//       item?.department_name === "Marketing" || item?.tag === "Marketing" || item?.tag_name === "Marketing"  ? "orange"
//       : item?.department_name === "Support" || item?.tag === "Support" || item?.tag_name === "Support"  ? "green"
//       : item?.department_name === "Sales" || item?.tag === "Sales" || item?.tag_name === "Sales"  ? "red"
//       : "transparent",
//     color: "#FFFFFF",
//     padding: 5,
//     borderRadius: 10,
//   }}
// >
<Text
  style={{
    backgroundColor:item?.tag_name != null && item?.color ? item?.color:undefined,
    color: "#FFFFFF",
    padding: 5,
    borderRadius: 10,
  }}
>
            {item?.department_name  || item?.tag_name } 
            

          </Text>
        ) :""}
      </View>
      
    </TouchableOpacity>
  );
}
const styles =  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    HeadingTxt: {
      fontSize: moderateScale(20),
      fontWeight: '700',
      marginHorizontal: 20,
      marginTop:10
    },
    gradient: {
      width: widthPercentage(100),
      marginTop: 10,
      alignSelf: 'center',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: '10%',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    gradientView: {
      width: '80%',
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    StartTxt: {
      marginBottom: 7.5,
      fontWeight: '900',
      color: colors.white,
    },
    ContentContainer: {
      marginTop: -30,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: colors.white,
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 10,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
    },
    filterButtonWrapper: {
      marginHorizontal: 5,
    },
    filterButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: '#E5E9EF',
    },
    selectedFilterText: {
      color: '#FFFFFF',
    },
    inactiveFilterText: {
      color: '#404B52',
    },
    selectedFilterButton: {
      elevation: 5,
    },
    filterButtonText: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
      position: 'relative',
    },
    initials: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize:20,
    },
    socialIcon: {
      position: 'absolute',
      bottom: 2,
      right: 2,
    },
    messageContent: {
      flex: 1,
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    name: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    unreadBadge: {
      backgroundColor: '#FF3D00',
      borderRadius: 60,
      width: 15,
      height: 15,
      position: 'absolute',
      top: 10,
      right: 0,
    },
    unreadText: {
      color: '#FFFFFF',
      fontSize: 12,
      textAlign: 'center',
    },
    message: {
      fontSize:12,
      color: '#7D7D7D',
    },
    time: {
      color: '#7D7D7D',
      fontSize: 12,
    },
    viewAllButton: {
      alignItems: 'center',
      paddingVertical: 10,
    },
    viewAllText: {
      color: colors.grey,
      fontWeight: 'bold',
    },
    visitorsList: {
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    visitorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    visitorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    visitorDetails: {
      marginLeft: 10,
    },
    visitorCountry: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    visitorTime: {
      fontSize: 12,
      color: '#7D7D7D',
    },
    visitorIP: {
      fontSize: 12,
      color: '#7D7D7D',
    },
    pingButton: {
      backgroundColor: '#E5E5E5',
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    pingButtonText: {
      color: '#404B52',
      fontWeight: 'bold',
    },
    WebSiteListTitle:{
      fontWeight:"800",
      fontSize:moderateScale(16),
      marginTop:20
    },
    FlagImage: {
      width:40,
      height:40,
      borderRadius:60
    },
    badge: {
      backgroundColor: '#FF0000',
      color: '#FFFFFF',
      borderRadius:8,
      width:16,
      height:16
    },
    badgeText:{
  fontSize:12,
  color: '#FFFFFF',
  textAlign:'center'
    },
    time: {
      fontSize: 12,
      color: '#7D7D7D',
  
    },
  });