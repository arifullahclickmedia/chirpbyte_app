import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F8F8',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    backButton: {
      fontSize: 24,
      color: '#000000',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft: 16,
    },
    profileInfo: {
      alignItems: 'center',
      marginVertical: 32,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#9C31FD',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    userName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
    },
    onlineStatus: {
      color: '#00C853',
      marginTop: 8,
    },
    listContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      margin: 16,
      padding: 8,
    },
  });