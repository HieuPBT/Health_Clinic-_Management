import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import API, { endpoints } from '../configs/API';
import showSuccessToast from '../utils/ShowSuccessToast';
import ValidateInformation from '../utils/Validate';

const ForgotPasswordScreen = ({navigation}) => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            const res = await API.post(endpoints['forgot_password'], {
                username: email
            })
            if(res.status == 200){
                showSuccessToast('Thành công', 'Mật khẩu mới đã được gửi về email ' + email);
            }
            navigation.navigate('Đăng nhập');
        } catch(error){
            console.log(error);
        }
    };


    return (
        <View style={{ flex: 1, padding: 20 }}>
            <ScrollView>
                <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 20 }}>Mật khẩu mới sẽ được gửi vào email bạn nhập</Text>
                <CustomInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
                    placeholder="Nhập địa chỉ email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
                <CustomButton title="Lấy lại mật khẩu" onPress={handleForgotPassword} disabled={!ValidateInformation.validateEmail(email)}/>
            </ScrollView>
        </View>
    );
};

export default ForgotPasswordScreen;
