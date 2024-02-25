import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableHighlight, Text } from 'react-native';
import axios from 'axios'; // Import thư viện Axios
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import ValidateInformation from '../utils/Validate';
import API, { endpoints } from '../configs/API';
import Context from '../Context';
import showSuccessToast from '../utils/ShowSuccessToast';
import showFailedToast from '../utils/ShowFailedToast';

const ChangePasswordScreen = () => {
    const {accessToken} = useContext(Context);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword || newPassword == oldPassword) {
            Alert.alert(
                'Xác nhận hủy lịch hẹn',
                'Bạn có chắc chắn muốn hủy lịch hẹn này?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Xác nhận', onPress: () => cancelAppointment(id) },
                ],
                { cancelable: false }
            );
            return;
        }

        // Gửi yêu cầu đổi mật khẩu đến máy chủ bằng Axios
        try {
            const response = await API.patch(endpoints['update_password'], {
                'old_password': oldPassword,
                'new_password': newPassword,
            }, {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });

            if (response.status === 200) {
                showSuccessToast('Thành công', 'Đổi mật khẩu thành công');
                // Đặt lại các trường nhập về rỗng
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                showFailedToast('Thất bại', 'Đổi mật khẩu thất bại');
            }
        } catch (error) {
            console.log('Error changing password:', error);
            showFailedToast('Thất bại', 'Đổi mật khẩu thất bại');
        }
    };

    const toggleSecureText = ()=>{
        setSecureTextEntry(!secureTextEntry);
    }

    return (
        <View style={styles.container}>
            <CustomInput
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Mật khẩu cũ"
                secureTextEntry={secureTextEntry}
                icon={"key"}
                rightIcon={'eye'}
                rightIconTouchable={true}
                rightIconHoverHandler={toggleSecureText}
                rightIconPressOutHandler={toggleSecureText}
            />
            <CustomInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mật khẩu mới"
                secureTextEntry={secureTextEntry}
                icon={"lock-closed"}
                rightIcon={oldPassword && newPassword && oldPassword == newPassword ? 'alert-circle' : null}
                rightIconColor={'red'}
            />
            <CustomInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry={secureTextEntry}
                icon={"lock-closed"}
                rightIcon={newPassword && confirmPassword && confirmPassword != newPassword ? 'alert-circle' : null}
                rightIconColor={'red'}
            />
            <CustomButton title="Đổi mật khẩu" onPress={handleChangePassword} disabled={!newPassword || !confirmPassword || !oldPassword || !ValidateInformation.validatePassword(newPassword) || newPassword !== confirmPassword || newPassword == oldPassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    helpText: {
      marginLeft: 10,
      color: 'gray',
      fontSize: 12,
    },
});

export default ChangePasswordScreen;
