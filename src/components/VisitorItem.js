import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../Screens/WebSiteVisitors/styles';
import useSocket from '../Services/useSocket';
import { useDispatch, useSelector } from 'react-redux';
import { removePingPressed } from '../Redux/authSlice';
import moment from 'moment';
import { Icons } from '../utilities/Images';
import { useNavigation } from '@react-navigation/native';

export default function VisitorItem({ item, dashboard, history, isDetail }) {
  // console.log("Ping Data ==>",JSON.stringify(item,null,4));
  const pindData = useSelector(state => state)
  const navigation = useNavigation();
  // Only select the required state properties
  // const { pingPressed, sesionData } = useSelector(state => state.auth);

  const dispatch = useDispatch()
  const {socket} = useSocket();
  const [isPressed, setIsPressed] = useState(false);
  const [liveTime, setLiveTime] = useState("00:00:00");
  const timeDiffRef = useRef(null);

  useEffect(() => {
    // console.log('ping Data ========>',pindData?.auth?.sesionData)
    if (pindData?.auth?.pingPressed) {
      handlePingNotify(pindData?.auth?.sesionData)
    }
  }, [pindData])

  // useEffect(() => {
  //   if (pingPressed) {
  //     handlePingNotify(sesionData);
  //   }
  // }, [pingPressed, sesionData]);



  useEffect(() => {
    if (!item?.latest_time) return;

    // Initialize time difference in seconds (assuming latest_time is a Unix timestamp)
    timeDiffRef.current = Math.floor(Date.now() / 1000) - Math.floor(item.latest_time);

    const calculateLiveTime = () => {
      // Increment time difference
      timeDiffRef.current += 1;

      // Prevent negative time difference
      if (timeDiffRef.current < 0) {
        setLiveTime("00:00:00");
        return;
      }

      // Calculate hours, minutes, and seconds
      const hours = String(Math.floor((timeDiffRef.current % 86400) / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((timeDiffRef.current % 3600) / 60)).padStart(2, "0");
      const seconds = String(timeDiffRef.current % 60).padStart(2, "0");

      setLiveTime(`${hours}:${minutes}:${seconds}`);
    };

    calculateLiveTime();

    const interval = setInterval(calculateLiveTime, 1000);

    return () => clearInterval(interval);
  }, [item?.latest_time]);

  useEffect(() => {
    const cleanupCustomEvent = socket.on('pingToClient', data => {
      // console.log('Custom event data:', data);
    });
    return () => {
      // cleanupCustomEvent();
    };
  }, [socket.on]);


  const handlePing = (item) => {
    setIsPressed(true);
    const sessionData = { session: item?.session };
    console.log('Sending ping:', sessionData);

    // Show an alert
    Alert.alert("Ping Sent", `Session: ${sessionData.session}`);

    socket.emit('pingToSever', sessionData);
    setTimeout(() => {
      setIsPressed(false);
    }, 300);

  };

  const handleInfoPress = () => {
    navigation.navigate('WebsiteVisitorDetailScreen', {ip: item?.ip})
  }

  const handlePingNotify = (item) => {
    // console.log('Item',item)
    const sessionData = {
      session: item.sessionId,
    };
    // console.log('handlePingNotify:', sessionData);

    socket.emit('pingToSever', sessionData);

    setTimeout(() => {
      dispatch(removePingPressed())
    }, 2000);
  };
  const truncateString = (str, maxLength = 30) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  };
  function formatDateTime(dateTime) {
    if (!dateTime) return ""; // Handle null or undefined values

    let formattedDate;

    if (typeof dateTime === "number") {
        // Handle Unix timestamp (seconds-based)
        formattedDate = moment.unix(dateTime).format("DD MMM, YYYY hh:mm:ss A");
    } else if (typeof dateTime === "string") {
        // Handle "YYYY-MM-DD HH:MM:SS" format
        formattedDate = moment(dateTime, "YYYY-MM-DD HH:mm:ss").format("DD MMM, YYYY hh:mm:ss A");
    } else {
        return ""; // Invalid format
    }

    return formattedDate;
}

  return (
    <View style={styles.visitorContainer}>
      <View style={styles.visitorInfo}>
        <Image source={{ uri: `https://flagcdn.com/w80/${item?.countrycode||item?.countryCode}.png` }} style={styles.FlagImage} />
        <View style={styles.visitorDetails}>
          <Text style={styles.visitorCountry}>{item?.country||item?.Country}</Text>
          <Text style={[styles.visitorCountry, { width: 250 }]}>{item?.city}</Text>
          {dashboard ? "" : <Text style={styles.visitorTime}>Referer: {truncateString(item?.referrer||item?.website)}</Text>}
          <Text style={styles.visitorTime}>IP: {truncateString(item?.ip)}</Text>
          {dashboard ? "" : <Text style={styles.visitorIP}>First Visit: {formatDateTime(item.first_visit||item?.latest_time)}</Text>}
          {dashboard ? "" : history === true ? "" : <Text style={styles.visitorIP}>Live Time: {liveTime}</Text>}
          {history === true && <Text style={styles.visitorIP}>Last Activity: {formatDateTime(item?.last_activity)}</Text>}

        </View>
      </View>
      {/* {history === true && <View style={styles.pingButton}><Text style={styles.pingButtonText}>{item?.hits}</Text></View>} */}
      {history === true ? "" :
        <TouchableOpacity style={[styles.pingButton, isPressed && styles.pingButtonPressed]} onPress={() => handlePing(item)}>
          <Text style={styles.pingButtonText}>Ping</Text>
        </TouchableOpacity>
      }
      {!isDetail &&
        <TouchableOpacity style={styles.infoBtn} onPress={handleInfoPress}>
          <Image source={Icons.Info} style={styles.info}/>
        </TouchableOpacity> 
      }
    </View>
  );
}
