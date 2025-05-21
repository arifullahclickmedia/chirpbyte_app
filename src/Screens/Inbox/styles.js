import { Platform, StyleSheet } from "react-native";
import colors from "../../Theme/colors";
import { moderateScale } from "../../utilities/Scales";
import { heightPercentage, widthPercentage } from "../../utilities/constants";

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:colors.white
    },
    mainHeading:{
      color:"black",
      fontSize:18,
      fontWeight:"bold"
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    tabsContainer: {
      flexDirection: 'row',
      padding: 10,
    },
    gradientStyle: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 20,
    },
    tab: {
      borderRadius: 20,
      marginHorizontal:2,
      alignItems: 'center',
    },
    inactiveTab: {
      borderWidth: 1,
      borderColor:"#F1F1F1",
      backgroundColor: colors.white,
    },
    tabText: {
      color: '#000',
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Platform.OS =="android"?0: 10,
      backgroundColor: '#F1F1F1',
      paddingLeft:10,
      borderRadius: 20,
      margin: 10,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      height:40
    },
    messagesList: {
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E1E1E1',
      gap:4,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    avatarText: {
      color: '#FFFFFF',
      // fontSize: 20,
      fontWeight: 'bold',
      textAlign:"center",
      marginTop:5
    },
    messageContent: {
      flex: 1,
    },
    name: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    message: {
      fontSize: 12,
      color: '#7D7D7D',
    },
    messageInfo: {
      alignItems: 'flex-end',
    },
    badge: {
      backgroundColor: '#FF0000',
      color: '#FFFFFF',
      borderRadius:8,
      width:16,
      height:16
    },
    badgeText:{
fontSize:12,
color: '#FFFFFF',
textAlign:'center'
    },
    time: {
      fontSize: 12,
      color: '#7D7D7D',
  
    },
    department:{
      backgroundColor:"grey",
    color:"#FFFFFF",
   padding:10, 
    },
    para: {
        justifyContent:'center',
        alignItems:'center',
        // flex:1,
        paddingHorizontal:16,
      },
      bottomSheetContent:{
        padding:32,
        gap:8
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
      gradientBox: {
        padding: 4,
        borderRadius: 12,
      },
      radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#DCDCDC',
        justifyContent: 'center',
        alignItems: 'center',
      },
      radioButtonSelected: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'transparent', 
      },
      contentWrapper: {
        padding: 8,
        paddingVertical:4,
      },
      HeaderText: {
        color: 'black',
        fontWeight: '500',
        fontSize: 22,
      },
      avatar: {
        width: 32,   
        height: 32,
        borderRadius: 16, 
      },
      greenCircle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'green',
        width: 10,
        height: 10,
        borderRadius: 5, 
      },upArrow: {
        position: 'absolute',
        // bottom: 20,
        right: 20,
        zIndex: 5,  
      },
      viewAllText:{
        textAlign:"center",
        paddingVertical: 2,
        color: colors.grey,
        fontWeight: 'bold',
      },
      container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding:4
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent:"space-between"
      },
      headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
      },
      visitorsList: {
        paddingHorizontal: 10,
        paddingTop: 10,
      },
      visitorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
      },
      visitorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      visitorDetails: {
        marginLeft: 10,
      },
      visitorCountry: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      visitorTime: {
        fontSize: 12,
        color: '#7D7D7D',
      },
      visitorIP: {
        fontSize: 12,
        color: '#7D7D7D',
      },
      pingButton: {
        backgroundColor: '#E5E5E5',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
      },
      pingButtonText: {
        color: '#404B52',
        fontWeight: 'bold',
      },
     FlagImage: {
      width:40,
      height:40,
      borderRadius:60
    },
    skeletonContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      // alignItems: 'center',
      flexDirection:"row",
      gap:20,
      padding:20,
      marginVertical:20
    },
    skeletonLine: {
      width: 80,
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
    },
    skeletonCircle: {
      width: 50,
      height: 50,
      backgroundColor: '#e0e0e0',
      borderRadius: 25,
    },
    loadingOverlay:{
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    },
    selectedTab: {
      textDecorationLine: 'underline',
      fontWeight: 'bold',
      color: 'blue', 
    },
    // container: {
    //   flex: 1,
    // },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
    },
    filterButtonWrapper: {
      marginHorizontal: 5,
    },
    filterButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: '#E5E9EF',
    },
    selectedFilterText: {
      color: '#FFFFFF',
    },
    inactiveFilterText: {
      color: '#404B52',
    },
    selectedFilterButton: {
      elevation: 5,
    },
    filterButtonText: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    upArrow: {
      position: 'absolute',
      // bottom: 20,
      right: 20,
      zIndex: 5,  
    }, 
    radioButtonSelected: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'transparent', 
    },ContentContainer: {
      marginTop: -30,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: colors.white,
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 10,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
    },
    filterButtonWrapper: {
      marginHorizontal: 5,
    },
    filterButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: '#E5E9EF',
    },
    selectedFilterText: {
      color: '#FFFFFF',
    },
    inactiveFilterText: {
      color: '#404B52',
    },
    selectedFilterButton: {
      elevation: 5,
    },
    filterButtonText: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
      position: 'relative',
    },
    initials: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize:20,
    }, HeadingTxt: {
      fontSize: moderateScale(20),
      fontWeight: '700',
      marginHorizontal: 20,
      marginTop:10
    },
    gradient: {
      width: widthPercentage(100),
      height:heightPercentage(35),
      marginTop: 10,
      alignSelf: 'center',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 35,
      paddingBottom: '10%',
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    gradientView: {
      width: '80%',
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    StartTxt: {
      marginBottom: 7.5,
      fontWeight: '900',
      color: colors.white,
    },
    ContentContainer: {
      
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      backgroundColor: colors.white,
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 10,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
      gap:2,
    },
    filterButtonWrapper: {
      marginHorizontal: 5,
    },
    filterButton: {
      paddingVertical: 10,
      paddingHorizontal: 2,
      borderRadius: 20,
      borderWidth: 0.5,
      borderColor: '#E5E9EF',
    },
    selectedFilterText: {
      color: '#FFFFFF',
    },
    inactiveFilterText: {
      color: '#404B52',
    },
    selectedFilterButton: {
      elevation: 5,
    },
    filterButtonText: {
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize:12,
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
      position: 'relative',
    },
    initials: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize:20,
    },
    socialIcon: {
      position: 'absolute',
      bottom: 2,
      right: 2,
    },
    messageContent: {
      flex: 1,
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    name: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    unreadBadge: {
      backgroundColor: '#FF3D00',
      borderRadius: 60,
      width: 15,
      height: 15,
      position: 'absolute',
      top: 10,
      right: 0,
    },
    unreadText: {
      color: '#FFFFFF',
      fontSize: 12,
      textAlign: 'center',
    },
    message: {
      fontSize:12,
      color: '#7D7D7D',
    },
    time: {
      color: '#7D7D7D',
      fontSize: 12,
    },
    viewAllButton: {
      alignItems: 'center',
      paddingVertical: 0,
    },
    viewAllText: {
      color: colors.grey,
      fontWeight: 'bold',
    },
    visitorsList: {
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    visitorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5E5',
    },
    visitorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    visitorDetails: {
      marginLeft: 10,
    },
    visitorCountry: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    visitorTime: {
      fontSize: 12,
      color: '#7D7D7D',
    },
    visitorIP: {
      fontSize: 12,
      color: '#7D7D7D',
    },
    pingButton: {
      backgroundColor: '#E5E5E5',
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 5,
    },
    pingButtonText: {
      color: '#404B52',
      fontWeight: 'bold',
    },
    WebSiteListTitle:{
      fontWeight:"800",
      fontSize:moderateScale(16),
      marginTop:20
    },
    FlagImage: {
      width:40,
      height:40,
      borderRadius:60
    },
    badge: {
      backgroundColor: '#FF0000',
      color: '#FFFFFF',
      borderRadius:8,
      width:16,
      height:16
    },
    badgeText:{
  fontSize:12,
  color: '#FFFFFF',
  textAlign:'center'
    },
    time: {
      fontSize: 12,
      color: '#7D7D7D',
    },
    loadingOverlay:{
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    }
  });