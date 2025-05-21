import { StyleSheet } from 'react-native';
import colors from '../../Theme/colors';
import { fontSizes, widthPercentage } from '../../utilities/constants';
import { moderateScale } from '../../utilities/Scales';



export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal:4,
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
        // paddingRight:20,
        
      },
      visitorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex:2,
        
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
        backgroundColor: '#E9EAF1',
        height: 30,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems:'center',
        justifyContent: 'center'

      },
      infoBtn:{
        backgroundColor: '#E9EAF1', 
        paddingHorizontal: 8,
        height: 30, 
        borderRadius: 5,
        alignItems:'center',
        justifyContent: 'center',
        marginLeft: 10
      },
      info:{width: 14, height: 14, tintColor: '#354781'},
      pingButtonText: {
        color: '#404B52',
        fontWeight: 'bold',
        fontSize:12,
      },
      pingButtonPressed: {
        backgroundColor: 'darkblue', 
      },
     FlagImage: {
      width: 24,
      height: 24,
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
      // width:150,s
    },
    filterButton: {
      paddingVertical: 10,
      paddingHorizontal: 40,
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
    },
    sliderButton:{
      paddingHorizontal:12,
      paddingVertical:4,
      backgroundColor:"#E5E4E2",
      elevation:0.5,
      borderRadius:5,
    },
    activeSliderBtn: {backgroundColor: '#9C31FD'},
    activeSliderBtnText: {color: '#ffffff'}
});
