import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import ChatScreen from '../Screens/ChatScreen';
import ProfileDetails from '../Screens/ProfileDetails';
import NotificationsScreen from '../Screens/Notification';
import VisitorsDataScreen from '../Screens/VisitorsDataScreen';
import ReassignOperator from '../Screens/ReassignOperator';
import ChatTransferScreen from '../Screens/ChatTransfer';
import WebsiteVisitorDetailScreen from '../Screens/WebSiteVisitors/WebsiteVisitorDetailScreen';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="VisitorsData" component={VisitorsDataScreen} />
      <Stack.Screen name="ReassignOperator" component={ReassignOperator} />  
      <Stack.Screen name="ChatTransferScreen" component={ChatTransferScreen} /> 
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="WebsiteVisitorDetailScreen"
        component={WebsiteVisitorDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
