import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, FlatList, Dimensions, Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient'; 
import { ViewPage } from '../../Services/Methods';

export default function VisitorsDataScreen({navigation,route}) {
  const {user,data,notifySession}=route.params;
  // console.log("VISITORS-DATA-session ==>",JSON.stringify(user,null,4));
  const [selectedTab, setSelectedTab] = useState('Profile');
  const [viewPageList,setViewPageList] = useState([]);
  const [viewPageLoading,setViewPageLoading] = useState(false);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '20%'], []);
  const { width, height } = Dimensions.get('window');

useEffect(()=>{
  fetchChatTranscripts();
},[selectedTab])

  const fetchChatTranscripts = async () => {
    setViewPageLoading(true);
    try {
      const response = await ViewPage(user?.session || notifySession);
      setViewPageList(response.data);
      // console.log("VIEW-PAGE-DATA ==>",response.data);
      setViewPageLoading(false);
      // flatListRef.current?.scrollToEnd({animated: true});
    } catch (error) {
      // console.log(error);
    }finally{
      setViewPageLoading(false);
    }
  };
  // {item?.Date || "--"}/{item?.Time || "--"}
  const renderItem = ({ item }) => (
    <View style={{ backgroundColor: "white", borderRadius: 10, padding: 16, gap: 8, flexDirection: "row", justifyContent: "space-between",marginVertical:5 }}>
      <View style={{ justifyContent: "space-between" }}>
        <Text style={{ color: "black", fontWeight: "500", fontSize: 16 }}>{truncateString(item?.crossurl || "--")}</Text>
        <Text>{item?.Date || "--"}</Text>
        <Text>{item?.Time || "--"}</Text>
      </View>
      <TouchableOpacity onPress={() => handleUrlPress(item.crossurl)}>
        <Image source={require('../../assets/Icons/refresh.png')} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    </View>
  );

  const handleUrlPress = (url) => {
    // Handle crossurl click, maybe open in a WebView or use Linking
    // const url = 'https://clickmedialab.com'; 
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    console.log('URL clicked: ', url);
  };
  const truncateString = (str, maxLength = 50) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  };
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  
  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  const gradientColors = ['#9C31FD', '#56B6E9']; 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <SafeAreaView>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: "flex-start" }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={{ color: 'black', fontSize: 18, fontWeight: '500',marginLeft:100 }}>Visitor's Data</Text>
              {/* <TouchableOpacity onPress={handlePresentModalPress}>
                <Icon name="dots-vertical" size={20} color="#000" />
              </TouchableOpacity> */}
            </View>

            <View style={{ justifyContent: "center", flexDirection: 'column', alignItems: "center", marginTop: 30 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20,backgroundColor:user?.color || "purple", justifyContent: "center", }}>
                <Text style={{ textAlign: 'center',fontSize:18,color:"white" }}>{user?.name ? user.name.charAt(0) : data?.data?.name ? data.data.name.charAt(0): user?.from_name ? user.from_name.charAt(0) : ""}</Text>
              </View>
              <Text style={{ color: "black", fontWeight: "500" }}>{user?.email || data?.data?.email || user?.from_phone|| "No email"}</Text>
              <Text>{user?.country}-{user?.city}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity
                style={{ flex: 1, alignItems: 'center', paddingBottom: 8 }}
                onPress={() => setSelectedTab('Profile')}
              >
                <LinearGradient
                  colors={selectedTab === 'Profile' ? gradientColors : ['transparent', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 2,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                  }}
                />
                <Text style={{ color: selectedTab === 'Profile' ? 'black' : 'gray' }}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1, alignItems: 'center', paddingBottom: 8 }}
                onPress={() => setSelectedTab('ViewedPages')}
              >
                <LinearGradient
                  colors={selectedTab === 'ViewedPages' ? gradientColors : ['transparent', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 2,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                  }}
                />
                <Text style={{ color: selectedTab === 'ViewedPages' ? 'black' : 'gray' }}>Viewed pages</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              {selectedTab === 'Profile' ? (
                <View style={{ gap: 40 }}>
                  <View style={{ backgroundColor: "white", borderRadius: 10, padding: 16, gap: 8 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "black", fontWeight: "500", fontSize: 16 }}>Email</Text>
                      <Text>{user?.email|| data?.data?.email ||"no Email"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "black", fontWeight: "500", fontSize: 16 }}>Country</Text>
                      <Text>{user?.country ||"no Country"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "black", fontWeight: "500", fontSize: 16 }}>City</Text>
                      <Text>{user?.city ||"no City"}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: "black", fontWeight: "500", fontSize: 16 }}>IP</Text>
                      <Text>{user?.ip ||"no IP"}</Text>
                    </View>
                  </View>

                  <View style={{ gap: 15 }}>
                    <Text style={{ color: "black", fontWeight: "500", fontSize: 16 }}>Reassign operator</Text>
                    <View style={{ backgroundColor: "white", borderRadius: 10, padding: 16, flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <View style={{ position: 'relative' }}>
                        <Image source={require('../../assets/Image/ProfileAvatar.jpeg')} style={styles.avatar} />
                        <View style={styles.greenCircle} />
                      </View>
                      <Text style={{ textAlign: "center" }}>Assigned to this conversation:</Text>
                      <Text style={{ textAlign: "center", color: "black", fontWeight: '500' }}>You</Text>
                    </View>
                  </View>
                </View>
              ) : (
               
                <View style={{height:height*0.65}}>
                {viewPageList.length === 0? <View style={{ backgroundColor: "white", borderRadius: 10, padding: 16, gap: 8, flexDirection: "row", justifyContent: "space-between",marginVertical:5 }}>
      <Text>No history found</Text>
    </View>:""}
                <FlatList
      data={viewPageList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      refreshing={viewPageLoading}
      onRefresh={fetchChatTranscripts}
      ListEmptyComponent={()=>{
        <View style={{ backgroundColor: "white", borderRadius: 10, padding: 16, gap: 8, flexDirection: "row", justifyContent: "space-between",marginVertical:5 }}>
      <Text>no History found</Text>
    </View>
      }}
    />
                </View>
              )}
            </View>
          </View>

          {/* Bottom Sheet Component */}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            // onChange={handleSheetChanges}
          >
            <BottomSheetView>
              <View style={styles.bottomSheetContent}>
                <Text style={{ color: "black", fontWeight: "500", fontSize: 18, textAlign: "center" }}>Visitor’s actions</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleCloseModalPress}>
                  <Text style={styles.closeButtonText}>Ban Visitor</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16, 
  },
  greenCircle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'green',
    width: 8,
    height: 8,
    borderRadius: 4, 
    borderColor: 'green',
    borderWidth: 1, 
  },
  cancelButton: {
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: 'grey',
    fontSize: 18,
  },
  bottomSheetContent:{
    padding: 16,
    gap: 8
  },
  closeButtonText:{
    color: '#E02323',
    textAlign: 'center',
    fontWeight: "500",
    fontSize: 16
  },
  closeButton:{
    backgroundColor: '#E023231A',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  }
});
