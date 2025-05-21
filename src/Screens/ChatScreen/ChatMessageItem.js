import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';

export default function ChatMessageItem({ item, }) {

// console.log("Message ==>",JSON.stringify(item,null,4));  
  // Handle case where message is an array or a string
  const messageText = Array.isArray(item?.message || item?.operatormessage) ? (item?.message || item?.operatormessage).join(' ') : item?.message || item?.operatormessage;
  const displayMessage = messageText != null && messageText.trim() !== '' ? messageText : null;
  
  // Do not render anything if displayMessage is null
  if (!displayMessage) {
    return null; 
  }

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
      return 'Invalid time';
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
      const normalizedTimeString = timeString.replace(/\u202F/g, " "); 
      const [time, ampm] = normalizedTimeString.split(' ');
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes} ${ampm}`;
    }
  
    return 'Invalid time';
  };
  
  // Usage example:
  const formattedTime = item?.time || item?.msg_date ||  item?.created_at ? formatTime(item?.time || item?.msg_date || item?.created_at) : '';
  
  

  // Determine the appropriate style and content based on the class of the message
  if (item?.class === "user") {
    return (
      <View style={{marginVertical:10,}}>
        <View style={styles.receivedMessageContainer}>
          <Text style={styles.receivedMessageText}>{displayMessage}</Text>
          {!!item?.translatedMsg &&
            <Text style={styles.sentMessageText}>{item?.translatedMsg}</Text>
          }
          {/* {item?.time != null && ( */}
            <Text style={styles.messageTime}>{formattedTime}</Text>
          {/* )} */}
        </View>
        <View style={styles.purpleCircle} />
      </View>
    );
  } else if (item?.class === "admin") {
    return (
      <View style={{marginVertical:10}}>
        <View style={[styles.sentMessageContainer, { backgroundColor: "#B2BEB5" }]}>
          <Text style={styles.sentMessageText}>{displayMessage}</Text>
          {!!item?.translatedMsg &&
            <Text style={styles.sentMessageText}>{item?.translatedMsg}</Text>
          }
          <Text style={styles.messageTime}>{formattedTime}</Text>     
        </View>
        <View style={styles.greyCircle} />
      </View>
    );
  } else if (item?.class === "system") {
    return (
      <View style={styles.systemMessageContainer}>
        <Text style={styles.systemMessageText}>{displayMessage}</Text>
      </View>
    );
  } else {
    return null;
  }
}
