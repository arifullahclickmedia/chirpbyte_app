import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddTag, AddTagFacebook, AddTagInstagram, AddTagWhatsapp, GetTag, ReassignChat } from '../../Services/Methods';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

export default function ReassignOperator({ navigation, route }) {
  const { session, departmentName,type,fromPhone,toPhone,mID,pageId} = route.params;
  // console.log("DATA ===>",JSON.stringify(route.params,null,4));
  const [reassign, setReassign] = useState();
  const [isDepartment, setIsDepartment] = useState('');
  const [tagList, setTagList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true); 
  const dispatch =  useDispatch();
  const ChatReassigning = async (session, tagId,) => {
    setLoading(true);  
    try {
      let response; 

   
    if (type === "live") {
      response = await AddTag(session, tagId);
    } else if (type === 'whatsapp') {
      response = await AddTagWhatsapp(type, fromPhone, toPhone, tagId);
      console.log("RESPONSE ===>",JSON.stringify(response?.data,null,4));
    }  else if (type === 'instagram') {
      response = await AddTagInstagram(mID,toPhone,pageId,fromPhone,type,tagId);
      console.log("RESPONSE ===>",JSON.stringify(response?.data,null,4));
    }  else if (type === 'facebook') {
      response = await AddTagFacebook(mID,toPhone,pageId,fromPhone,type,tagId);
      console.log("RESPONSE ===>",JSON.stringify(response?.data,null,4));
    }

      
      setReassign(response?.data?.status);
      setLoading(false);
      console.log("response?.data ==>",response?.data?.status);
      if (response?.data?.status == "success"|| response?.data =='1' ) {
        Toast.show({
          type: 'success',    
          text1: 'Tag added!',
          text2: 'Successfully',
          position: 'bottom',
          visibilityTime: 1000 
        });
    
      
        setTimeout(() => {
          navigation.navigate('InboxScreen');
        }, 1200);
      }
      
    } catch (error) {
      setLoading(false);
      console.log(error?.msg);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while adding the tag.',
        position: 'bottom',
        visibilityTime: 1500
      });
    } finally {
      setLoading(false);  
    }
  };

  const GetDepartmenTags = async () => {
    try {
      const response = await GetTag();
      setTagList(response?.data); // Store fetched tags
      console.log("DEPARTMENTS ==>", JSON.stringify(response?.data, null, 4));
    } catch (error) {
      console.log(error);
    } finally {
      setListLoading(false);  // Hide loader after fetching tags
    }
  };

  useEffect(() => {
    console.log("SESSION ==>", JSON.stringify(session, null, 4));
    GetDepartmenTags(); // Fetch department tags on component mount
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => { reassign === "success" ? navigation.navigate('InboxScreen') : navigation.goBack() }}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.profileName}>Add Tag</Text>
        <Text></Text>
      </View>

      <View>
        <View style={{ backgroundColor: "white", borderRadius: 10, padding: 16, flexDirection: "row", alignItems: "center", gap: 4, marginTop: 20 }}>
          <View style={{ position: 'relative' }}>
            <Image source={require('../../assets/Image/ProfileAvatar.jpeg')} style={styles.avatar} />
            <View style={styles.greenCircle} />
          </View>
          <Text style={{ textAlign: "center" }}>Assigned to this conversation:</Text>
          <Text style={{ textAlign: "center", color: "black", fontWeight: '500' }}>
            {reassign === "success" ? isDepartment : departmentName}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : listLoading ? (  // Show loader while the button list is being fetched
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={{ marginTop: 20 }}>
            {tagList.map((tag) => (
              <LinearGradient
                key={tag.tag_id}
                colors={['#9C31FD', '#56B6E9']}
                style={{ borderRadius: 10, paddingHorizontal: 10, height: 30, alignItems: "center", marginVertical: 10, justifyContent: "center" }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => {!loading && ChatReassigning(session, tag?.tag_id); setIsDepartment(tag?.title)}}
                  disabled={loading}
                >
                  <Text style={{ textAlign: "center", color: "#FFFFFF" }}>{tag?.title}</Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
