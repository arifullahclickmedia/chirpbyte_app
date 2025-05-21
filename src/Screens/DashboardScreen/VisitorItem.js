import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import io from 'socket.io-client';
import styles from './styles';
import useSocket from '../../Services/useSocket';

export default function VisitorItem({ item }) {

  const {  onEvent ,socket} = useSocket();

  useEffect(() => {
    const cleanupCustomEvent = socket.on('pingToClient', data => {
      console.log('Custom event data:', data);
    });
    return () => {
      cleanupCustomEvent?.();
    };
  }, [onEvent]);

  const handlePing = () => {
    const sessionData = {
      session: item.session,
    };
    console.log('Sending ping:', sessionData);

    socket.emit('pingToSever', sessionData);
  };

  const truncateString = (str, maxLength = 30) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  };
  return (
    <View style={styles.visitorContainer}>
      <View style={styles.visitorInfo}>
        <Image source={{ uri: item?.icon }} style={styles.FlagImage} />
        <View style={styles.visitorDetails}>
          <Text style={styles.visitorCountry}>{item?.country}</Text>
          <Text style={styles.visitorTime}>IP: {truncateString(item?.ip)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.pingButton} onPress={handlePing}>
        <Text style={styles.pingButtonText}>Ping</Text>
      </TouchableOpacity>
    </View>
  );
}
