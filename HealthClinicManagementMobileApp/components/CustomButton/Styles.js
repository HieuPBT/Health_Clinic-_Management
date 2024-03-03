import { StyleSheet } from "react-native";
import { COLORS } from "../../configs/constants";
export default StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
        backgroundColor: 'blue',
        flexDirection: 'row',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },
});
