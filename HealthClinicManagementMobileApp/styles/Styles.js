import { StyleSheet } from "react-native";
import {COLORS } from "../configs/configs"
export default StyleSheet.create({
    textStyle: {
        color: COLORS.text_color,
        fontSize: 16
    },
    logoStyle: {
      height: 130,
      width: 130,
      alignSelf: 'center',
      margin: 10,
      flex: 0.15,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    row_container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      // padding: 10,
    },
});
