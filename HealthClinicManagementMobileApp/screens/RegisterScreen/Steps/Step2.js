import React, { useContext, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import Styles from '../../../styles/Styles';
import MyContext from '../Context';
import { Image } from 'react-native-elements';
import Styles1 from '../Styles';
import CustomInput from '../../../components/CustomInput/CustomInput';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { COLORS } from '../../../configs/configs';
import ValidateInformation from '../../../utils/Validate';
const Step2 = ({ }) => {
  const { password, setPassword, password_retype, setPassword_retype, setStep } = useContext(MyContext);
  const [isShowPassword, setIsShowPassword] = useState(false);
  return (
    <View style={Styles.container}>
      <Image style={Styles1.logo} source={require('../../../logo.png')} />

      <CustomInput
        placeholder="Đặt mật khẩu"
        icon="lock-closed"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={!isShowPassword}
        blurHandler={()=>{
          if(!ValidateInformation.validatePassword(password) && password) {
            Alert.alert('Nhập mật khẩu mạnh', 'Mật khẩu phải dài ít nhất 8 ký tự, có ít nhất một số, một chữ cái viết hoa, một chữ cái viết thường, một ký tự đặc biệt')
          }
        }}
        rightIcon={'eye'}
        rightIconTouchable = {true}
        rightIconHoverHandler={()=> {
          setIsShowPassword(true);
        }}
        rightIconPressOutHandler={()=> {
          setIsShowPassword(false);
        }}
      />
      <CustomInput
        placeholder="Nhập lại mật khẩu"
        icon="lock-closed"
        onChangeText={(text) => setPassword_retype(text)}
        value={password_retype}
        blurHandler={()=>{
          if(password != password_retype){
            Alert.alert('Nhập lại mật khẩu chính xác', 'Vui lòng nhập lại mật khẩu chính xác để chắc chắn rằng bạn nhớ đúng mật khẩu')
          }
        }}
        rightIcon={password != password_retype && password_retype? 'alert-circle':password_retype?'checkmark':null}
        rightIconColor={password != password_retype?'red':'green'}
        secureTextEntry={!isShowPassword}
      />
      <CustomButton title="Tiếp" onPress={() => setStep(3)} style={Styles1.navBtn} disabled={!(ValidateInformation.validatePassword(password) && password && password_retype && password == password_retype)}/>
      <CustomButton title="Trở về" onPress={() => setStep(1)} style={Styles1.navBtn} color={COLORS.dark_green}/>
    </View>
  );
};

export default Step2;
