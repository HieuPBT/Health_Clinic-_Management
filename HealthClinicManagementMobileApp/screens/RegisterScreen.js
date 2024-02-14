import React, { useState } from 'react';
import { Image } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import Styles from '../styles/Styles';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_retype, setPassword_retype] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState();
  const [gender, setGender] = useState(0); //0: nam, 1: nữ, 2: khác

  const handleRegister = () => {
    // Xử lý đăng ký ở đây (gọi API, lưu thông tin đăng ký, etc.)
    console.log('Register pressed');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Gender:', gender);
    console.log('phone:', phoneNumber);
    console.log('birthday:', dateOfBirth);
    console.log('name:', name);
  };

  return (
    <View style={Styles.container}>
      <Image style={Styles.logoStyle} source={require('../logo.png')}/>
      <CustomInput
        placeholder="Họ và tên"
        icon="person"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <CustomInput
        placeholder="Email"
        icon="mail"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <CustomInput
        placeholder="Số điện thoại"
        icon="call"
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
      />
      <CustomInput
        placeholder="Mật khẩu"
        icon="lock-closed"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <CustomInput
        placeholder="Nhập lại mật khẩu"
        icon="lock-closed"
        onChangeText={(text) => setPassword_retype(text)}
        value={password_retype}
        secureTextEntry
      />
      <View style={Styles.row_container}>
        <CustomButton title="Đăng ký" onPress={handleRegister} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }
});

export default RegisterScreen;
