import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Dashboard from '../Screens/DashboardScreen';
import colors from '../Theme/colors';
import Profile from '../Screens/Profile';
import WebSiteVisitors from '../Screens/WebSiteVisitors';
import ChatScreen from '../Screens/ChatScreen';
// import InboxScreen from '../Screens/Inbox';
import { Image, Text, View } from 'react-native';
import { Icons } from '../utilities/Images';
import InboxScreen from '../Screens/Inbox/InboxScreen';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
    const unreadCount = useSelector(state => state.auth.unreadCount);
    
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  
                },
            }}>
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarActiveTintColor: colors.black,
                    tabBarInactiveTintColor: "#A2A2A2",
                    tabBarLabelStyle: {
                        marginBottom: 5,
                        fontWeight: '800',
                    },
                    tabBarIcon: ({ focused, size, color }) => (
                       <Image
                       source={ focused ?Icons.DashboardActive:Icons.DashboardInActive}
                       style={{width:25,height:25}}
                        resizeMode='contain'
                       />
                    ),
                }}
            />
                  <Tab.Screen
                name="InboxScreen"
                component={InboxScreen}
                options={{
                    tabBarLabel: 'Inbox',
                    tabBarActiveTintColor: colors.black,
                    tabBarInactiveTintColor: "#A2A2A2",
                    tabBarLabelStyle: {
                        marginBottom: 5,
                        fontWeight: '800',
                    },
                    tabBarIcon: ({ focused, size, color }) => (
                        <View style={{ position: 'relative', width: 25, height: 25 }}>
                            <Image
                                source={focused ? Icons.InboxActive : Icons.InboxInActive}
                                style={{ width: 25, height: 25 }}
                                resizeMode='contain'
                            />
                            {parseInt(unreadCount) > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'red',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        color: 'red',
                                        fontWeight: 'bold',
                                        // fontSize: 12,
                                    }}>
                                        {unreadCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />
              <Tab.Screen
                name="WebSiteVisitors"
                component={WebSiteVisitors}
                options={{
                    tabBarLabel: 'Live Visitors',
                    tabBarActiveTintColor: colors.black,
                    tabBarInactiveTintColor: "#A2A2A2",
                    tabBarLabelStyle: {
                        marginBottom: 5,
                      
                        fontWeight: '800',
                    },
                    tabBarIcon: ({ focused, size, color }) => (
                        <Image
                       source={ focused ?Icons.VisitorActive:Icons.VisitorInActive}
                       style={{width:25,height:25}}
                        resizeMode='contain'
                       />
                    ),
                }}
            />
           <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarActiveTintColor: colors.black,
                    tabBarInactiveTintColor: "#A2A2A2",
                    tabBarLabelStyle: {
                        marginBottom: 5,
                        
                        fontWeight: '800',
                    },
                    tabBarIcon: ({ focused, size, color }) => (
                        <Image
                        source={ focused ?Icons.UsersActive:Icons.UsersInActive}
                        style={{width:25,height:25}}
                        resizeMode='contain'
                        />
                    ),
                }}
            />
           
        </Tab.Navigator>
    );
}
