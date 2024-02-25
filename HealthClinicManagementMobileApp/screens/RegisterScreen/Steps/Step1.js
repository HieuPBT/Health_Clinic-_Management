import React, { useContext } from 'react';
import { View, Text, Button, Alert, ScrollView } from 'react-native';
import MyContext from '../Context';
import { Image } from 'react-native-elements';
import CustomInput from '../../../components/CustomInput/CustomInput';
import CustomDatePicker from '../../../components/CustomDatePicker/CustomDatePicker';
import formatDate from '../../../utils/FormatDate';
import GenderInput from '../../../components/GenderInput/GenderInput';
import Styles from '../../../styles/Styles';
import Styles1 from '../Styles';
import CustomButton from '../../../components/CustomButton/CustomButton';
import ValidateInformation from '../../../utils/Validate';
import Nomalize from '../../../utils/Nomalize';
import formatDateToYMD from '../../../utils/formatDateToYYYYMMDD';
const Step1 = () => {
    const { name, setName, email, setEmail, phoneNumber, setPhoneNumber, dateOfBirth, setDateOfBirth, gender, setGender, setStep, address, setAddress, healthInsurance, setHealthInsurance } = useContext(MyContext);
    return (
        <View style={Styles.container}>
                <Image style={Styles.logoStyle} source={require('../../../logo.png')} />
            <ScrollView style={{width: '100%'}}>
                <CustomInput
                    placeholder="Họ và tên"
                    icon="person"
                    onChangeText={(text) => setName(text)}
                    value={name}
                    blurHandler={() => {
                        setName(Nomalize.nameNormalize(name));
                    }}
                />
                <CustomInput
                    placeholder="Email"
                    icon="mail"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    keyboardType={'email-address'}
                    blurHandler={() => {
                        if (!ValidateInformation.validateEmail(email) && email) {
                            Alert.alert('Thông tin không hợp lệ', 'Email không hợp lệ');
                        }
                    }}
                    rightIcon={!ValidateInformation.validateEmail(email) && email ? 'alert-circle' : null}
                    rightIconColor='red'
                />
                <CustomInput
                    placeholder="Số điện thoại"
                    icon="call"
                    onChangeText={(text) => setPhoneNumber(text)}
                    value={phoneNumber}
                    keyboardType={'number-pad'}
                    blurHandler={() => {
                        if (!ValidateInformation.validatePhoneNumber(phoneNumber) && phoneNumber) {
                            Alert.alert('Thông tin không hợp lệ', 'Số điện thoại không hợp lệ');
                        }
                    }}
                    rightIcon={!ValidateInformation.validatePhoneNumber(phoneNumber) && phoneNumber ? 'alert-circle' : null}
                    rightIconColor='red'
                />
                <CustomInput
                    placeholder="Địa chỉ"
                    icon="home"
                    onChangeText={(text) => setAddress(text)}
                    value={address}
                />
                <CustomInput
                    placeholder="Số bảo hiểm y tế"
                    icon="card"
                    onChangeText={(text) => setHealthInsurance(text)}
                    value={healthInsurance}
                    keyboardType={'number-pad'}
                    blurHandler={() => {
                        if (!ValidateInformation.validateInsuranceNumber(healthInsurance) && healthInsurance) {
                            Alert.alert('Thông tin không hợp lệ', 'Số bảo hiểm y tế không hợp lệ');
                        }
                    }}
                    rightIcon={!ValidateInformation.validateInsuranceNumber(healthInsurance) && healthInsurance ? 'alert-circle' : null}
                    rightIconColor='red'
                />
                <CustomDatePicker placeholder="Ngày sinh" onChangeDate={(date) => setDateOfBirth(formatDateToYMD(date))} value={dateOfBirth} />
            <GenderInput onChange={(gender) => setGender(gender)} value={gender} />
            </ScrollView>
            <CustomButton title="Tiếp" onPress={() => setStep(2)} disabled={!(name && address && phoneNumber && healthInsurance && dateOfBirth && ValidateInformation.validateInsuranceNumber(healthInsurance) && ValidateInformation.validatePhoneNumber(phoneNumber) && ValidateInformation.validateEmail(email))} />
        </View>
    );
};

export default Step1;
