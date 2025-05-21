import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {GetVisitorDetail} from '../../Services/Methods';
import WebsiteVisitorDetailCard from './components/WebsiteVisitorDetailCard';
import {FooterLoader} from '../../components/FooterLoader';
import EmptyComponent from '../../components/EmptyComponent';

const WebsiteVisitorDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [visitorData, setVisitorData] = useState([]);  

  const ip = route?.params?.ip || '';
  const fetchVisitorDetail = useCallback(async () => {
    setIsLoading(page === 1);
    try {
      const res = await GetVisitorDetail({ip, page});
      setVisitorData(prev => {
        const newData = res?.data?.data?.data || [];
        const existingIds = prev.map(item => item?.id);
        const uniqueNewData = newData.filter(
          item => !existingIds.includes(item?.id),
        );
        return [...prev, ...uniqueNewData];
      });

      setTotalItems(res?.data?.data?.total);
    } catch (error) {
      console.log('VisitorDetail-Error:>>>', error);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [ip, page]);

  useEffect(() => {
    fetchVisitorDetail();
  }, [fetchVisitorDetail]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backArrow}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>{'Website Visitor Detail'}</Text>
      </View>

      <Text style={styles.heading}>{`IP Details For: ${ip}`}</Text>
      <FlatList
        data={visitorData}
        keyExtractor={item => item?.id?.toString()}
        renderItem={({item}) => <WebsiteVisitorDetailCard item={item} />}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (!isFetchingNextPage && visitorData.length < totalItems) {
            setPage(prev => prev + 1);
            setIsFetchingNextPage(true);
          }
        }}
        ListEmptyComponent={()=> <EmptyComponent isLoading={isLoading}/>}
        ListFooterComponent={() => (
          <FooterLoader visible={isFetchingNextPage} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {marginHorizontal: 10, flex: 1},
  row: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    position: 'absolute',
    start: 0,
    padding: 5,
  },
  header: {fontSize: 16, fontWeight: '700'},
  heading: {
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 5,
    marginVertical: 10,
  },
});

export default WebsiteVisitorDetailScreen;
