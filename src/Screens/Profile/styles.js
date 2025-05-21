import { StyleSheet } from 'react-native';
import colors from '../../Theme/colors';
import { fontSizes, widthPercentage } from '../../utilities/constants';
import { moderateScale } from '../../utilities/Scales';



export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
      },
      header: {
        padding: 10,
      },
      avatarContainer: {
        alignItems: 'center',
        marginTop: 20,
      },
      avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#6CD1A3',
        justifyContent: 'center',
        alignItems: 'center',
      },
      initials: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
      },
      userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
      },
      userEmail: {
        color: '#7D7D7D',
        marginTop: 5,
      },
      iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
      },
      iconButton: {
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
      },
      infoContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
      },
      infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
      },
      infoTitle: {
        fontWeight: 'bold',
      },
      infoValue: {
        color: colors.black,
      },
      blockButton: {
        backgroundColor: '#E5E5E5',
        paddingVertical: 15,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
      },
      blockButtonText: {
        color: '#7D7D7D',
        fontWeight: 'bold',
      },
});
