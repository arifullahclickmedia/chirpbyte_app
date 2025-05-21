

// Import 'Dimensions' from React Native to get screen dimensions
import { Dimensions } from 'react-native';

// Get the screen width and height using 'Dimensions' module
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Function to calculate the width based on a percentage of the screen width
export const widthPercentage = percentage => (screenWidth * percentage) / 100;

// Function to calculate the height based on a percentage of the screen height
export const heightPercentage = percentage => (screenHeight * percentage) / 100;

// Object to define various font sizes
export const fontSizes = {
  h1: 24, // Font size for heading 1
  h2: 20, // Font size for heading 2
  h3: 15, // Font size for heading 3
  h4: 12, // Font size for heading 4
  h5: 10, // Font size for heading 5
};

// Regular expression to validate email format
export const EmailRegExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
export const phoneNumberPattern = /^\+92\d{10}$/;
// Define a regular expression pattern for the desired phone number format

export const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// URLs for settings screen

// greetingUtils.js
export const getGreeting = () => {
  const currentTime = new Date();
  const hour = currentTime.getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export const messages = [
  { id: '2', name: 'Robert Fox', message: 'Thanks for the help', time: '08:19', unread: false, platform: 'Instagram' },
  { id: '3', name: 'Jacob Jones', message: 'Are you there?', time: '08:19', unread: true, platform: 'Ola Chat' },
  { id: '4', name: 'Guy Hawkins', message: 'I need support', time: '08:19', unread: false, platform: '' },
];


export const visitors = [
  { id: '1', country: 'United States', flag: 'US', time: '02hr:16min', ip: '61.139.82.146' },
  { id: '2', country: 'China', flag: 'CN', time: '02hr:16min', ip: '4.151.89.136' },
  { id: '3', country: 'UK', flag: 'GB', time: '02hr:16min', ip: '226.6.172.110' },
  { id: '4', country: 'Turkey', flag: 'TR', time: '02hr:16min', ip: '113.2.183.254' },
  { id: '5', country: 'Russia', flag: 'RU', time: '02hr:16min', ip: '19.10.17.89' },
  { id: '6', country: 'Singapore', flag: 'SG', time: '02hr:16min', ip: '254.250.241.113' },
  { id: '7', country: 'UAE', flag: 'AE', time: '02hr:16min', ip: '154.214.144.116' },
  { id: '8', country: 'Korea', flag: 'KR', time: '02hr:16min', ip: '206.96.186.211' },
  { id: '9', country: 'Australia', flag: 'AU', time: '02hr:16min', ip: '226.253.139.27' },
  { id: '10', country: 'India', flag: 'IN', time: '02hr:16min', ip: '196.69.80.124' },
  { id: '11', country: 'Germany', flag: 'DE', time: '02hr:16min', ip: '186.186.166.98' },
];

export const ChatMessages = [
  { id: '1', sender: 'Agent', text: 'Agent has joined the chat', type: 'system' },
  { id: '2', sender: 'Robert Fox', text: 'Hello, how are you? Let\'s go on vacation, I have exciting vacation plans!', time: '08:12', type: 'received' },
  { id: '3', sender: 'Me', text: 'I\'m good, let\'s go on vacation, what\'s the plan?', time: '08:12', type: 'sent' },
  { id: '4', sender: 'System', text: 'Chat transferred to sales department', type: 'system' },
  { id: '5', sender: 'System', text: 'Alex from sales department has joined the chat', type: 'system' },
  { id: '6', sender: 'Alex', text: 'What do you think??', time: '08:12', type: 'received' },
  { id: '7', sender: 'Me', text: 'Wow! Awesome! 😍😍', time: '08:12', type: 'sent' },
  { id: '8', sender: 'System', text: 'Chat has been ended', type: 'system' },
];

export const InBoxMessages = [
  { id: '2', name: 'Robert Fox', message: 'Thanks for the help', time: '08:19', platform: 'Instagram', isRead: true },
  { id: '3', name: 'Jacob Jones', message: 'Are you there?', time: '08:19', platform: 'Ola Chat', isRead: false },
  { id: '4', name: 'Jerome Bell', message: 'Hello!', time: '08:19', platform: 'Instagram', isRead: true },
  { id: '5', name: 'Guy Hawkins', message: 'I need support', time: '08:19', platform: 'Instagram', isRead: false },
  { id: '6', name: 'Courtney Henry', message: 'OK', time: '08:19', platform: 'Facebook', isRead: true },
  { id: '7', name: 'Brandon', message: 'Thanks for helping', time: '08:19', platform: 'Ola Chat', isRead: false },
];