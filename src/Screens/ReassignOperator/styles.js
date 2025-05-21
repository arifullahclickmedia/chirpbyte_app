import { StyleSheet } from "react-native";
import colors from "../../Theme/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#08080A',
    textAlign:"center"
  },
  headerContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16, 
  },
  greenCircle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'green',
    width: 8,
    height: 8,
    borderRadius: 4, 
    borderColor: 'green',
    borderWidth: 1, 
  },
});
