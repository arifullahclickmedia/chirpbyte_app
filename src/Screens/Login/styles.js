import { StyleSheet } from 'react-native';
import colors from '../../Theme/colors';
import { fontSizes, widthPercentage } from '../../utilities/constants';
import { moderateScale } from '../../utilities/Scales';

export default StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: colors.white,
   justifyContent:"center",
   alignItems:"center"
    },
    LoginHeadingTxt:{
      fontSize:moderateScale(20),
      fontWeight:"700"  
    },
    HeadingDecTxt:{
        marginTop:5,
        color:colors.text_secondary,
        marginBottom:20

    },
    InputHeading:{
        fontSize:moderateScale(14),
        fontWeight:"700",
        color:colors.black,
        marginBottom:7.5,
    }

});
