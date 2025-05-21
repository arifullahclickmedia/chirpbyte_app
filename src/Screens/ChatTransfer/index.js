import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import styles from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatAssign, ChatAssignFacebook, ChatAssignInstagram, ChatAssignWhatsapp, OperatorList } from '../../Services/Methods';
import LinearGradient from 'react-native-linear-gradient';
import useSocket from '../../Services/useSocket';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

export default function ChatTransferScreen({ navigation, route }) {
  const { session,operatorName,type,fromPhone,toPhone,mID,pageId,sender_id,recipient_id} = route.params;
  // console.log("DATA ===>",JSON.stringify(route.params,null,4));
  const [chattransfer, setChatTransfer] = useState();
  const [isoperatorList, setIsOperatorList] = useState([]);
  const[selectedoperatorName,setSelectedOperatorName]= useState();
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true); // To track API loading state
  const [selectedOperatorId, setSelectedOperatorId] = useState(null); // Store the selected operator ID
  const {socket, onEvent, emitEvent} = useSocket();
  const {user: reduxUser,} = useSelector(state => state.auth);

  const ChatTransfering = async (session,operatorid) => {
    console.log("ChatTransfering ===>",operatorid, session );
    setLoading(true);  // Show loader
    setSelectedOperatorId(operatorid); 
    try {
      let response;

      if (type === "live") {
        console.log("type-Live",type);
        //console.log("LIVE ===>",session, operatorid);
        response = await ChatAssign(session , operatorid);
        //console.log("Transfer RES",JSON.stringify(response?.data,null,4));
      } else if (type === 'whatsapp') {
        console.log("type-Whatsapp",type);
        const Data ={
          platform:type,
          fromPhone:fromPhone,
          toPhone:toPhone,
          op:operatorid,
        }
        // console.log("PAYLOAD ===>",JSON.stringify(Data,null,4));
        response = await ChatAssignWhatsapp(type, fromPhone, toPhone, operatorid);
        console.log("Transfer RESPONSE Whatsapp ===>",JSON.stringify(response?.data,null,4));
      }  else if (type === 'instagram') {
        console.log("type-instagram",type);
        response = await ChatAssignInstagram(mID,toPhone,pageId,fromPhone,operatorid);
        console.log("Transfer RESPONSE ===>",JSON.stringify(response?.data,null,4));
      }  else if (type === 'facebook') {
        console.log("type-facebook",type);
        const transferData={
         mid: mID,
         toPhone:toPhone,
         pageId:pageId,
         fromPhone:fromPhone,
         operatorid:operatorid
        }
        console.log("transferData ===>",JSON.stringify(transferData,null,4));
        response = await ChatAssignFacebook(mID,toPhone,pageId,fromPhone,operatorid);
        console.log("Transfer RESPONSE ===>",JSON.stringify(response?.data,null,4));
      }



      console.log("RE-ASSIGN-CHAT ==>", JSON.stringify(response?.data, null, 4));
      setChatTransfer(response?.data?.status);
      if (response?.data?.status === "success"|| response?.data === 1) {
        let convid = session;

        switch (type) {
            case "whatsapp":
                convid = sender_id;
                break;
        
            case "instagram":
            case "facebook":
              sender_id
                break;
        
            default:
                convid = session;
        }
        
        let socketNotificationData = {
            "convid": String(type === "instagram" || type === "facebook" 
            ? sender_id 
            : type === "whatsapp"
            ? sender_id
            : session),
            "operatorid": operatorid,
            "assigneeid": reduxUser.id,
            "platform": type,
            recieverId:recipient_id,
            "message": `💬 ${reduxUser?.username} passed the chat to you! !`,
        }
        console.log("socketNotificationData ===>",JSON.stringify(socketNotificationData,null,4));
        socket.emit("notificationsToSever", socketNotificationData);
        // Alert.alert(
        //   "Success",
        //   response?.data?.message,
        //   [{ text: "OK", onPress: () => navigation.navigate('InboxScreen') }]
        // );
        Toast.show({
          type: 'success',    // You can also use 'error' or 'info'
          text1: 'Chat transfered!',
          text2: 'Successfully',
          position: 'bottom',
          visibilityTime: 1500 // Duration in ms
        });
    
      
        setTimeout(() => {
          navigation.navigate('InboxScreen');
        }, 1800);
      } else {
        // Alert.alert(
        //   "Error",
        //   response?.data?.message,
        //   [{ text: "Cancel", onPress: () => {}, style: "cancel" }]
        // );
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An error occurred while transfering the chat',
          position: 'bottom',
          visibilityTime: 1500
        });
      }
    } catch (error) {
      console.log(error);
      // Alert.alert(
      //   "Error",
      //   "An error occurred while transfering the chat.",
      //   [{ text: "Cancel", onPress: () => {}, style: "cancel" }]
      // );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while transfering the chat',
        position: 'bottom',
        visibilityTime: 1500
      });
    } finally {
      setLoading(false);  // Hide loader
      setSelectedOperatorId(null); // Reset the selected operator ID
    }
  };

  const GetOperatorList = async () => {
    try {
      const response = await OperatorList();
      console.log("OPERATOR-LIST ==>", JSON.stringify(response?.data, null, 4));
      setIsOperatorList(response?.data?.data || []); // Ensure it's an array
    } catch (error) {
      console.log(error);
    } finally {
      setListLoading(false); // Hide the list loading state after fetching
    }
  };

  useEffect(() => {
    // console.log("SESSION ==>", JSON.stringify(session, null, 4));
    GetOperatorList();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.profileName}>Chat Transfer</Text>
        <Text></Text>
      </View>

      <View>
        <View style={{ backgroundColor: "white", borderRadius: 10, padding: 16, flexDirection: "row", alignItems: "center", gap: 4, marginTop: 20 }}>
          <View style={{ position: 'relative' }}>
            <Image source={require('../../assets/Image/ProfileAvatar.jpeg')} style={styles.avatar} />
            <View style={styles.greenCircle} />
          </View>
          <Text style={{ textAlign: "center" }}>Transfer this conversation:</Text>
          <Text style={{ textAlign: "center", color: "black", fontWeight: '500' }}>
            {chattransfer === "success" ? operatorName : selectedoperatorName}
          </Text>
        </View>

        {listLoading ? (
          <ActivityIndicator size="large" color="#0000ff" /> 
        ) : (
          <View style={{ marginTop: 20 }}>
            {isoperatorList.map((operator) => (
              <LinearGradient
                key={operator.id}
                colors={['#9C31FD', '#56B6E9']}
                style={{ borderRadius: 10, height: 30, alignItems: "center", marginVertical: 10, justifyContent: "center" }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => {!loading && ChatTransfering(session, operator.id);setSelectedOperatorName(operator.name)}}
                  disabled={loading}
                >
                  {selectedOperatorId === operator.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={{ textAlign: "center", color: "#FFFFFF" }}>{operator.name}</Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
