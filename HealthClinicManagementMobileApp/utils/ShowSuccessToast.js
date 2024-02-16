import Toast from "react-native-toast-message";
const showSuccessToast = (message) => {
    Toast.show({
        type: 'success',
        text1: message,
        text1Style: {
            fontSize: 18,
            padding: 10
        },
        topOffset: 100,

    })
}

export default showSuccessToast;
