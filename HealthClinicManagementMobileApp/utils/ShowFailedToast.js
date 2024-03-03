import Toast from "react-native-toast-message";


const showFailedToast = (message, text) => {
    Toast.show({
        type: 'error',
        text1: message,
        text2: text,
        text1Style: {
            fontSize: 16,
            // padding: 10
        },
        text2Style: {
            fontSize: 16,
            // padding: 10
        },
        topOffset: 100,
        containerStyle: {
            padding: 10
        }
    })
}

export default showFailedToast;
