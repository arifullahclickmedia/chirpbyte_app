import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const WebsiteVisitorDetailCard = ({item}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `https://flagcdn.com/w80/${
            item?.countrycode || item?.countryCode
          }.png`,
        }}
        style={styles.img}
      />
      <View style={styles.visitorDetails}>
        <Text style={styles.visitorCountry}>
          {item?.country || item?.Country}
        </Text>
        <Text style={styles.text}>
          Website: {item?.referrer || item?.website}
        </Text>
        <Text style={styles.text}>Navigated: {item?.crossurl}</Text>
        <Text style={styles.text}>Hits: {item?.hits}</Text>
        <Text style={styles.text}>IP: {item?.ip}</Text>
        <Text style={styles.text}>Date: {item?.tDate}</Text>
        <Text style={styles.text}>First Visit: {item?.fTime}</Text>
        <Text style={styles.text}>Last Activity: {item?.tTime}</Text>
        <Text style={styles.text}>Time Spent: {item?.tdiff}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 5,
    flex: 1,
  },
  visitorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  visitorDetails: {
    marginLeft: 10,
    flex: 1,
  },
  img: {
    width: 24,
    height: 24,
    borderRadius: 60,
  },
  visitorCountry: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    color: '#7D7D7D',
  },
});

export default WebsiteVisitorDetailCard;
