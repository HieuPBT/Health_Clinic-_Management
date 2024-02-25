import React, { useContext, useState } from 'react';
import { Button } from 'react-native-elements';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import MyContext from './Context';
import CustomButton from '../../components/CustomButton/CustomButton';
import { COLORS } from '../../configs/configs';
import { Image, View } from 'react-native';
import Styles1 from './Styles';
import Styles from '../../styles/Styles';
import UserProfileScreen from '../UserProfileScreen';
import API, { endpoints } from '../../configs/API';
import Context from '../../Context';
import showSuccessToast from '../../utils/ShowSuccessToast';
import showFailedToast from '../../utils/ShowFailedToast';


const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_retype, setPassword_retype] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState();
  const [gender, setGender] = useState("Nam"); //0: nam, 1: nữ, 2: khác
  const [avatarSource, setAvatarSource] = useState(null);
  const [healthInsurance, setHealthInsurance] = useState('');
  const [address, setAddress] = useState('');

  const { setIsAuthenticated, setRole } = useContext(Context);

  const logInformation = () => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Retyped Password:", password_retype);
    console.log("Name:", name);
    console.log("Phone Number:", phoneNumber);
    console.log("Date of Birth:", dateOfBirth);
    console.log("Gender:", gender);
    console.log("Avatar Source:", avatarSource);
    console.log("Health Insurance:", healthInsurance);
    console.log("Address:", address);
  };

  const createAccount = async () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('full_name', name);
    formData.append('phone_number', phoneNumber);
    formData.append('date_of_birth', dateOfBirth);
    formData.append('gender', gender == 'Nam' ? 'MALE' : gender == 'Nữ' ? 'FEMALE' : 'OTHER');
    formData.append('avatar', {
      uri: avatarSource,
      type: 'image/jpeg', // Thay đổi type tùy thuộc vào định dạng ảnh
      name: 'avatar.jpg',
    });
    formData.append('patient.health_insurance', healthInsurance);
    formData.append('address', address);

    // Gửi dữ liệu lên server
    try {
      const res = await API.post(endpoints['user'],
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (res.status == 201) {
        showSuccessToast('Tạo tài khoản thành công!', 'Vui lòng kiểm tra email để xác thực');
        navigation.navigate('Đăng nhập');
      }
    } catch (ex) {
      if (ex.response.status == 400) {
        showFailedToast('Email này đã được đăng ký');
      } else if (ex.response.status == 500) {
        showFailedToast('Server đang bị lỗi, vui lòng thử lại sau');
      }
      console.log(ex);
    }

  }


  const [step, setStep] = useState(1);
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <MyContext.Provider value={{ name, setName, email, setEmail, phoneNumber, setPhoneNumber, dateOfBirth, setDateOfBirth, gender, setGender, address, setAddress, healthInsurance, setHealthInsurance, setStep }}>
            <Step1 />
          </MyContext.Provider>
        );
      case 2:
        return (
          <MyContext.Provider value={{ password, setPassword, password_retype, setPassword_retype, setStep }}>
            <Step2 />
          </MyContext.Provider>
        );
      case 3:
        return (
          <MyContext.Provider value={{ avatarSource, setAvatarSource, setStep, logInformation }}>
            <Step3 />
          </MyContext.Provider>
        );
      case 4:
        return (
          <>
            <UserProfileScreen userDataParam={{
              email: email,
              password: password,
              avatar: avatarSource,
              full_name: name,
              gender: gender == 'Nam' ? 'MALE' : gender == 'Nữ' ? 'FEMALE' : 'OTHER',
              phone_number: phoneNumber,
              date_of_birth: dateOfBirth,
              address: address,
              patient: {
                health_insurance: healthInsurance
              },
            }} preview={true} />
            <View style={Styles1.buttonContainer}>
              <CustomButton title="Tạo tài khoản" onPress={() => {
                createAccount();
                logInformation();
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
