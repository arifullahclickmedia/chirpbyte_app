import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, Alert, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import styles from './styles';
import VisitorItem from '../../components/VisitorItem';
import { GetVisitors, LogoutUser, onlineVisitors } from '../../Services/Methods';
import { ErrorMessage } from '../../utilities/Strings';
import VisitorSkeleton from '../../components/VisitorSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { removeLoginData } from '../../Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FooterLoader } from '../../components/FooterLoader';
import { useLogout } from '../../Services/useLogout';

export default function WebSiteVisitors({ navigation }) {
  const [VisitorList, setVisitorList] = useState([]);
  const [VisitorHistoryList, setVisitorHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [Refreshing, setRefreshing] = useState(false);
  const [showUpArrow, setShowUpArrow] = useState(false);
  const [selectedTab, setSelectedTab] = useState('visitors'); 
  const [selectedId,setSelectedId] = useState('1')
  const [page, setPage] = useState(1);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const { height } = Dimensions.get('window');
  const flatListRef = useRef(null);
  const gradientColors = ['#9C31FD', '#56B6E9'];
const isFocused = useIsFocused();
const permissions = useSelector((state)=>state.auth.permissions);
const maxRetries = 3; 
const delay = 2000;
const {handleLogout, isLoggingOut} = useLogout();

const fetchVisitors = useCallback(async (retryCount = 0) => {
  if ( permissions?.visitor === false)
    return ;
  try {
    setIsLoading(true);
    const response = await GetVisitors({wId: selectedId});    
    if (response?.status === 200) {
      setVisitorList(response?.data?.data);   
    } else {
      setVisitorList([]);
      Alert.alert(ErrorMessage.WentWrong);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      handleLogout();
    } else {
      Alert.alert(ErrorMessage.WentWrong);
    }
    // if (error.response?.status === 429 && retryCount < maxRetries) {
    //   setTimeout(() => fetchVisitors(retryCount + 1), delay);
    // } else if (error.response?.status === 429) {
    //   Alert.alert('Visitor List: Too many requests. Please try again later.');
    // } else {
    //   Alert.alert(ErrorMessage.WentWrong);
    // }
  } finally {
    setIsLoading(false)
  }
}, [selectedId]);

const fetchVisitorHistory = useCallback(async (retryCount = 0) => {
  if (permissions?.history === false)
    return;
  try {
    setIsLoading(true);
    const response = await onlineVisitors({tab: selectedId, page});
    if (response?.status === 200) {
      setVisitorHistoryList(prev=>[...prev, ...response?.data?.visitors?.data]);
      setTotalItems(response?.data?.visitors?.total)
      setIsFetchingNextPage(false)
    } else {
      setVisitorHistoryList([]);
      Alert.alert(ErrorMessage.WentWrong);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      handleLogout();
    } else {
      Alert.alert(ErrorMessage.WentWrong);
    }
    // if (error.response?.status === 429 && retryCount < maxRetries) {
    //   setTimeout(() => fetchVisitorHistory(retryCount + 1), delay);
    // } else if (error.response?.status === 429) {
    //   Alert.alert('Visitor History: Too many requests. Please try again later.');
    // } else {
    //   Alert.alert(ErrorMessage.WentWrong);
    // }
  } finally {
    setIsFetchingNextPage(false);
    setIsLoading(false);
  }
}, [selectedId, page]);

useEffect(() => {
  const initialFetch = async () => {
    setIsInitialLoading(true);
    await fetchVisitors();
    await fetchVisitorHistory();
    setIsInitialLoading(false);

  };
  initialFetch();
}, []);


useEffect(() => {
  if (selectedTab === 'visitors') {
    fetchVisitors();
  } else {
    fetchVisitorHistory();
  }
}, [selectedTab, fetchVisitors, fetchVisitorHistory]);



//   const fetchVisitors = async (isRefreshing = false) => {
//     if (isRefreshing) {
//       setRefreshing(true);
//     } else {
//       setIsLoading(true);
//     }
//     try {
//       const response = await GetVisitors();
//       if (response?.status === 200) {
//         setVisitorList(response?.data?.data);
//       } else {
//         setVisitorList([]);
//         Alert.alert(ErrorMessage.WentWrong);
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         handleUnauthorized();
//       } else {
//         console.log(error);
//       }
//     } finally {
//       if (isRefreshing) {
//         setRefreshing(false);
//       } else {
//         setIsLoading(false);
//       }
//     }
//   };

//   const fetchVisitorHistory = async (isRefreshing = false) => {
//     if (isRefreshing) {
//       setRefreshing(true);
//     } else {
//       setIsLoading(true);
//     }
//     try {
//       const response = await onlineVisitors();
//       if (response?.status === 200) {
//         setVisitorHistoryList(response?.data?.data);
//       } else {
//         setVisitorHistoryList([]);
//         Alert.alert(ErrorMessage.WentWrong);
//       }
//     }catch (error) {
//       if (error.response?.status === 401) {
//         handleUnauthorized();
//       } else {
//         console.log(error);
//       }
//     } finally {
//       if (isRefreshing) {
//         setRefreshing(false);
//       } else {
//         setIsLoading(false);
//       }
//     }
//   };

//   const onRefresh = () => {
// if (selectedTab === 'visitors') {
//       fetchVisitors(true);
//     } else {
//       fetchVisitorHistory(true);
//     }
//   };

  const renderVisitor = ({ item }) => <VisitorItem item={item} />;
  const renderVisitorHistory = ({ item }) => <VisitorItem item={item} history={true} />;
  
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

  const renderFooter = ()=> {
    return <FooterLoader visible={isFetchingNextPage}/>
  }

  return (

    <SafeAreaView style={styles.container}>
      {/* Tab Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
      <TouchableOpacity
             onPress={() => setSelectedTab('visitors')}
              style={styles.filterButtonWrapper}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={
                  selectedTab === 'visitors'
                    ? ['#9C31FD', '#56B6E9']
                    : ['#FFFFFF', '#FFFFFF']
                }
                style={[
                  styles.filterButton,
                  selectedTab === 'visitors' && styles.selectedFilterButton,
                ]}>
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedTab === 'visitors'
                      ? styles.selectedFilterText
                      : styles.inactiveFilterText,
                  ]}>
                Live Visitors
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={() => setSelectedTab('history')}
              style={styles.filterButtonWrapper}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={
                  selectedTab === 'history'
                    ? ['#9C31FD', '#56B6E9']
                    : ['#FFFFFF', '#FFFFFF']
                }
                style={[
                  styles.filterButton,
                  selectedTab === 'history' && styles.selectedFilterButton,
                ]}>
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedTab === 'history'
                      ? styles.selectedFilterText
                      : styles.inactiveFilterText,
                  ]}>
                 Visitor History
                </Text>
              </LinearGradient>
            </TouchableOpacity>
      </View>
      <View>
      <ScrollView horizontal={true} contentContainerStyle={{gap:4,paddingHorizontal:10,paddingTop:10,paddingBottom:5}}>
            <TouchableOpacity style={[styles.sliderButton, selectedId==='1'&& styles.activeSliderBtn]} 
            onPress={()=>{
              setSelectedId('1')
              setVisitorHistoryList([]);
              }} >
            <Text style={[selectedId==='1'&& styles.activeSliderBtnText]}>Click Media Lab Inc.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.sliderButton, selectedId==='12'&& styles.activeSliderBtn]} 
            onPress={()=>{
              setSelectedId('12')
              setVisitorHistoryList([]);
              }}>
            <Text style={[selectedId==='12'&& styles.activeSliderBtnText]}>ChirpByte</Text>
            </TouchableOpacity>
          </ScrollView>
      </View>
 {/* {IsLoading && <ActivityIndicator size={20} color={'grey'} style={{ marginRight: 20 }} />} */}

      {/* Display the selected list */}
      {isInitialLoading||(isLoading && !VisitorHistoryList?.length) ? (
        <View >
          <VisitorSkeleton />
        </View>
      )
      :isLoggingOut ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="blue" />
          <Text style={{color:"grey"}}>Logging out...</Text>
        </View>
      ): permissions?.visitor === false && selectedTab === 'visitors' ? (
        <View style={{flex:1,justifyContent:"center",alignItems:"center",}}>
            <Text style={{color:'black'}}>Permission Not Granted!</Text>
          </View>
      ):permissions?.history === false && selectedTab === 'history' ? (
        <View style={{flex:1,justifyContent:"center",alignItems:"center",}}>
            <Text style={{color:'black'}}>Permission Not Granted!</Text>
          </View>
      )
       : selectedTab === 'visitors' && VisitorList.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>No visitors to show!</Text>
        </View>
      ) : selectedTab === 'visitors' ? (
        <FlatList
          ref={flatListRef}
          data={VisitorList}
          renderItem={renderVisitor}
          keyExtractor={(item, index) => `${item.id}-${index}`} 
          contentContainerStyle={styles.visitorsList}
          refreshing={Refreshing}
          // onRefresh={onRefresh}
          onScroll={handleScroll} // Track scroll event
          scrollEventThrottle={32}
        />
      )
      : selectedTab === 'history' && VisitorHistoryList?.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>No visitors history to show!</Text>
        </View>
      ) : (          
        <FlatList
          ref={flatListRef}
          data={VisitorHistoryList}
          renderItem={renderVisitorHistory}
          keyExtractor={(item, index) => `${item.id}-${index}`} 
          contentContainerStyle={styles.visitorsList}
          refreshing={Refreshing}
          // onRefresh={onRefresh}
          onScroll={handleScroll} // Track scroll event
          scrollEventThrottle={16}
          onEndReachedThreshold={0.1}
          onEndReached={()=>{
            if(!isFetchingNextPage && VisitorHistoryList.length<totalItems){
              setPage(prev=> prev+1);
              setIsFetchingNextPage(true);
            }
          }}
          ListFooterComponent={renderFooter}
        />
      )}
      {showUpArrow && (
              <TouchableOpacity
                style={[styles.upArrow, {top: height * 0.8}]}
                onPress={scrollToTop}>
                <LinearGradient
                  colors={gradientColors}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[
                    styles.radioButtonSelected,
                    {height: 25, width: 25, borderRadius: 12.5},
                  ]}>
                  <Icon name="arrow-up" size={25} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            )}
    </SafeAreaView>
          

  );

}
