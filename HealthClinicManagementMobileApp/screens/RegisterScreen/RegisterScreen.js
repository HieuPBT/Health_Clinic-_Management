import React, { useContext, useState } from 'react';
import { Button } from 'react-native-elements';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import MyContext from './Context';
import CustomButton from '../../components/CustomButton/CustomButton';
import { COLORS } from '../../configs/constants';
import { Image, View } from 'react-native';
import Styles1 from './Styles';
import Styles from '../../styles/Styles';
import UserProfileScreen from '../UserProfileScreen';
import API, { endpoints } from '../../configs/API';
import Context from '../../Context';
import showSuccessToast from '../../utils/ShowSuccessToast';
import showFailedToast from '../../utils/ShowFailedToast';


const RegisterScreen = ({ navigation }) => {
  const [user, setUser] = useState(
    {
      email: '',
      password: '',
      full_name: '',
      phone_number: '',
      date_of_birth: '',
      gender: 'Nam',
      avatarSource: null,
      healthInsurance: '',
      address: ''
    }
  );

  const createAccount = async () => {
    const formData = new FormData();

    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        if (key === 'gender') {
          formData.append('gender', user[key] === 'Nam' ? 'MALE' : user[key] === 'Nữ' ? 'FEMALE' : 'OTHER');
        } else if (key === 'avatarSource') {
          formData.append('avatar', {
            uri: user[key],
            type: 'image/jpeg',
            name: 'avatar.jpg',
          });
        } else if (key === 'healthInsurance') {
          formData.append('patient.health_insurance', user[key]);
        } else {
          formData.append(key, user[key]);
        }
      }
    }

    try {
      const res = await API.post(
        endpoints['user'],
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 201) {
        showSuccessToast('Tạo tài khoản thành công!', 'Vui lòng kiểm tra email để xác thực');
        navigation.navigate('Đăng nhập');
      }
    } catch (ex) {
      if (ex.response.status === 400) {
        showFailedToast('Email này đã được đăng ký');
      } else if (ex.response.status === 500) {
        showFailedToast('Server đang bị lỗi, vui lòng thử lại sau');
      }
      console.log(ex);
    }
  };



  const [step, setStep] = useState(1);
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <MyContext.Provider value={{ user, setUser, setStep }}>
            <Step1 />
          </MyContext.Provider>
        );
      case 2:
        return (
          <MyContext.Provider value={{ user, setUser, setStep }}>
            <Step2 />
          </MyContext.Provider>
        );
      case 3:
        return (
          <MyContext.Provider value={{ user, setUser, setStep }}>
            <Step3 />
          </MyContext.Provider>
        );
      case 4:
        return (
          <>
            <UserProfileScreen userDataParam={{
              email: user.email,
              password: user.password,
              avatar: user.avatarSource,
              full_name: user.full_name,
              gender: user.gender == 'Nam' ? 'MALE' : user.gender == 'Nữ' ? 'FEMALE' : 'OTHER',
              phone_number: user.phone_number,
              date_of_birth: user.date_of_birth,
              address: user.address,
              patient: {
                health_insurance: user.healthInsurance
              },
            }} preview={true} />
            <View style={Styles1.buttonContainer}>
              <CustomButton title="Tạo tài khoản" onPress={() => {
                createAccount();
              }} />
              <CustomButton title="Sửa thông tin" color={COLORS.dark_green} style={Styles1.navBtn} onPress={() => setStep(1)} />
            </View>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <>
      {/* <Image style={Styles.logoStyle} source={require('../../logo.png')} /> */}
      {renderStep()}
    </>
  );
};

export default RegisterScreen;
