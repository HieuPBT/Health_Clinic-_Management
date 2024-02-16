import Toast from "react-native-toast-message";


const showFailedToast = (message) => {
    Toast.show({
        type: 'error',
        text1: message
    })
}

export default showFailedToast;
