import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS } from '../configs/configs';
import { Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from './RegisterScreen/RegisterScreen';
import Styles from '../styles/Styles';
import Context from '../Context';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { authenticated, setAuthenticated, setRole } = useContext(Context);
  const handleLogin = () => {
    // Xử lý đăng nhập ở đây
    setAuthenticated(true);
    setRole(email);
    console.log('Login pressed');
  };
  const navigation = useNavigation();
  return (
    <View style={Styles.container}>
      <Image style={Styles.logoStyle} source={require('../logo.png')}/>
      <CustomInput
        placeholder="Email"
        icon="mail"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <CustomInput
        placeholder="Mật khẩu"
        icon="lock-closed"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <View style={[Styles.row_container, styles.loginButton]}>
        <CustomButton title="Đăng nhập" onPress={handleLogin} />
      </View>
      <CustomButton title="Quên mật khẩu?" color="transparent" textColor="#333333"/>
      <View style={styles.OAuth2Style}>
        <Text style={Styles.textStyle}>Hoặc đăng nhập bằng</Text>
        <View style={styles.row_container}>
          <TouchableOpacity>
            <Image source={require('../fb.png')} style={styles.iconOauth2Style}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../gg.png')} style={styles.iconOauth2Style}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={Styles.row_container}>
        <CustomButton title="Tạo tài khoản mới" color={COLORS.dark_green} onPress={()=>{navigation.navigate('Đăng ký')}}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  loginButton: {

  },
  OAuth2Style: {
    flex: 0.6,
    marginTop: 50,
    // backgroundColor: 'red',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  iconOauth2Style: {
    width: 40,
    height: 40,
  }
});

export default LoginScreen;
