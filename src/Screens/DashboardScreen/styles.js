import { StyleSheet } from 'react-native';
import colors from '../../Theme/colors';
import { moderateScale } from '../../utilities/Scales';
import { heightPercentage, widthPercentage } from '../../utilities/constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  HeadingTxt: {
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
    marginTop: -30,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 0,
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
    marginTop:20,
    marginLeft:20,
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
