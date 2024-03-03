import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS, client_id, client_secret } from '../configs/constants';
import { CheckBox, Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import RegisterScreen from './RegisterScreen/RegisterScreen';
import Styles from '../styles/Styles';
import Context from '../Context';
import API, { authApi, endpoints } from '../configs/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showFailedToast from '../utils/ShowFailedToast';
import showSuccessToast from '../utils/ShowSuccessToast';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isKeepLogin, setIsKeepLogin] = useState(true);
  const [textSecure, setTextSecure] = useState(true);

  const { authenticated, setAuthenticated, setRole, setAccesstoken, userData, dispatch } = useContext(Context);
  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("password", password);
      formData.append("username", email);
      formData.append("client_id", client_id);
      formData.append("client_secret", client_secret);
      const res = await API.post(endpoints['login'],
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setAuthenticated(true);
      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;
      setAccesstoken(accessToken);
      await AsyncStorage.setItem('access_token', accessToken);
      if (isKeepLogin)
        await AsyncStorage.setItem('refresh_token', refreshToken);

      showSuccessToast('Đăng nhập thành công');
      loadUser = async () => {
        const res = await authApi(accessToken).get(endpoints['profile']);
        dispatch({
          type: "login",
          payload: { ...res.data }
        })
        setRole(res.data.role);
      }
      loadUser();
    } catch (ex) {
      console.info(ex);
      if (ex.response.status === 400) {
        showFailedToast('Sai tài khoản hoặc mật khẩu', 'Hoặc tài khoản chưa được kích hoạt');
      } else if (ex.response.status == 401) {
        showFailedToast('Email chưa được xác thực', 'Vui lòng kiểm tra email để xác thực');
      } else {
        showFailedToast('Server đang bảo trì', 'Vui lòng đăng nhập lại sau');
      }
    }
  };
  return (
    <View style={Styles.container}>
      <Image style={Styles.logoStyle} source={require('../logo.png')} />
      <CustomInput
        placeholder="Email"
        icon="mail"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType={'email-address'}
      />
      <CustomInput
        placeholder="Mật khẩu"
        icon="lock-closed"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={textSecure}
        rightIcon={"eye"}
        rightIconTouchable={true}
        rightIconHoverHandler={() => { setTextSecure(false) }}
        rightIconPressOutHandler={() => { setTextSecure(true) }}
      />
      <View style={styles.row_container}>
        <TouchableOpacity onPress={() => { navigation.navigate('Quên mật khẩu') }}>
          <Text>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            <CheckBox checked={isKeepLogin} onPress={() => { setIsKeepLogin(!isKeepLogin) }} />
          </View>
          <Text>Duy trì đăng nhập</Text>
        </View>
      </View>
      <View style={[Styles.row_container, styles.loginButton]}>
        <CustomButton title="Đăng nhập" onPress={handleLogin} disabled={password ? false : true} />
      </View>
      <View style={styles.OAuth2Style}>
        <Text style={Styles.textStyle}>Hoặc đăng nhập bằng</Text>
        <View style={styles.row_container}>
          <TouchableOpacity>
            <Image source={require('../fb.png')} style={styles.iconOauth2Style} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../gg.png')} style={styles.iconOauth2Style} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={Styles.row_container}>
        <CustomButton title="Tạo tài khoản mới" color={COLORS.dark_green} onPress={() => { navigation.navigate('Đăng ký') }} />
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
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
  },
  checkbox: {
    width: 50,
    height: 50,
    // position: 'absolute'
  }
});

export default LoginScreen;
