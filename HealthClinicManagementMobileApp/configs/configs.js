import { BaseToast } from "react-native-toast-message";

export const COLORS = {
    green_primary: '#6ec420',
    dark_green: '#2ca291',
    text_color: '#333333',
    light_green: '#90EE90'
};

export const toastConfig = {
    success: ({ text1, ...rest }) => (
        <BaseToast
            {...rest}
            contentContainerStyle={{ paddingHorizontal: 30 }}
            text1Style={{
                fontSize: 15,
                fontWeight: 'semibold'
            }}
            text1="Thành công"
            leftBorderColor="green"
        />
    )
};
