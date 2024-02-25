import Toast from "react-native-toast-message";
const showSuccessToast = (message, text) => {
    Toast.show({
        type: 'success',
        text1: message,
        text2: text,
        text1Style: {
            fontSize: 18,
        },
        text2Style: {
            fontSize: 16,
        },
        topOffset: 100,

    })
}

export default showSuccessToast;
