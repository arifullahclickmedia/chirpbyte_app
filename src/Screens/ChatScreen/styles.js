import { StyleSheet } from "react-native";
import colors from "../../Theme/colors";

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F1F1F1',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
      // backgroundColor: '#9C31FD',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    profilePicText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'#08080A',
    },
    profileStatus: {
      fontSize: 14,
      color: '#08080A',
    },
    greenCircle: {
      // position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: 'green',
      width: 8,
      height: 8,
      borderRadius: 4, 
      borderColor: 'green',
      borderWidth: 1, 
    },
    greyCircle: {
      // position: 'absolute',
      alignSelf: 'flex-end',
      bottom: 0,
      right: 0,
      backgroundColor: 'grey',
      width: 8,
      height: 8,
      borderRadius: 4, 
      borderColor: 'grey',
      borderWidth: 1, 
    },
    purpleCircle: {
      // position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#9C31FD',
      width: 8,
      height: 8,
      borderRadius: 4, 
      borderColor: '#9C31FD',
      borderWidth: 1, 
    },
    headerIcons: {
      flexDirection: 'row',
    },
    iconButton: {
      marginLeft: 10,
      padding:5,
      borderRadius:10
    },
    messagesList: {
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    systemMessageContainer: {
      alignItems: 'center',
      marginVertical: 5,
    },
    systemMessageText: {
      fontSize: 14,
      color: '#7D7D7D',
      backgroundColor:'white',
      paddingHorizontal:10,
      paddingVertical:4,
      borderRadius:10,
    },
    receivedMessageContainer: {
      alignSelf: 'flex-start',
      backgroundColor: '#F0F0F0',
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
      shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  
  elevation: 2,
    },
    receivedMessageText: {
      fontSize: 16,
    },
    sentMessageContainer: {
      alignSelf: 'flex-end',
      padding: 10,
      borderRadius: 10,
      marginVertical: 5,
      backgroundColor: 'white',
      shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  
  elevation: 2,
    },
    sentMessageText: {
      fontSize: 16,
    },
    messageTime: {
      fontSize: 12,
      color: '#7D7D7D',
      textAlign: 'right',
      marginTop: 8
    },
    inputContainer: {
        // flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.white,
      },
      input: {
        // flex: 1,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 15,
      },
      gradientButton: {
        flex:2,
        width: 35,
        height: 35,
        // marginRight:5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        marginTop:5,
      },
      modal: {
        justifyContent: 'flex-end',
        margin: 0,
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
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
        padding:16,
        // gap:8
      },
      closeButtonText:{
      color:'#4B5768',
      textAlign:'center',
      },
      closeButton:{
        backgroundColor:'#E4E7EB',
        paddingVertical:10,
        borderRadius:10,
        marginTop:20,
      },
      option: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 8,
      },
      iconLarge: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 8,
      },
      textContainer: {
        flex: 1,
      },
      optionTitle: {
        color: 'black',
        fontWeight: '500',
        fontSize: 16,
      },
      optionDescription: {
        color: '#606060',
        fontSize: 12,
        marginTop: 4,
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
      },
      modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    alignItems:"center"
      },
      modalButtonBorder: {
        padding: 2, // Padding for the border
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      modalButtonInner: {
        backgroundColor: 'white', // Background color of the button
        borderRadius: 10,
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
      
      },
      textGradient: {
        // Apply gradient to text using flex row
        // flexDirection: 'row',
      },
      modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        // backgroundClip: 'text', // Text will show gradient
        color: 'white', // Makes text transparent so gradient is visible
        padding:8,
  
      },
      modalDeleteButtonInner: {
        borderColor:"red",
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 4,
      borderWidth:1,
      },
  });
  
 
  