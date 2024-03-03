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
import Normalize from '../../../utils/Normalize';
import formatDateToYMD from '../../../utils/formatDateToYYYYMMDD';
const Step1 = () => {
    const { user, setUser, setStep } = useContext(MyContext);
    return (
        <View style={Styles.container}>
            <Image style={Styles.logoStyle} source={require('../../../logo.png')} />
            <ScrollView style={{ width: '100%' }}>
                <CustomInput
                    placeholder="Họ và tên"
                    icon="person"
                    onChangeText={(text) => setUser({ ...user, full_name: text })}
                    value={user.full_name}
                    blurHandler={() => {
                        setUser({ ...user, full_name: Normalize.nameNormalize(user.full_name) });
                    }}
                />
                <CustomInput
                    placeholder="Email"
                    icon="mail"
                    onChangeText={(text) => setUser({ ...user, email: text })}
                    value={user.email}
                    keyboardType={'email-address'}
                    blurHandler={() => {
                        if (!ValidateInformation.validateEmail(user.email) && user.email != '') {
                            Alert.alert('Thông tin không hợp lệ', 'Email không hợp lệ');
                        }
                    }}
                    rightIcon={!ValidateInformation.validateEmail(user.email) && user.email != '' ? 'alert-circle' : null}
                    rightIconColor='red'
                />
                <CustomInput
                    placeholder="Số điện thoại"
                    icon="call"
                    onChangeText={(text) => setUser({ ...user, phone_number: text })}
                    value={user.phone_number}
                    keyboardType={'number-pad'}
                    blurHandler={() => {
                        if (!ValidateInformation.validatePhoneNumber(user.phone_number) && user.phone_number !== '') {
                            Alert.alert('Thông tin không hợp lệ', 'Số điện thoại không hợp lệ');
                        }
                    }}
                    rightIcon={!ValidateInformation.validatePhoneNumber(user.phone_number) && user.phone_number !== '' ? 'alert-circle' : null}
                    rightIconColor='red'
                />
                <CustomInput
                    placeholder="Địa chỉ"
                    icon="home"
                    onChangeText={(text) => setUser({ ...user, address: text })}
                    value={user.address}
                />
                <CustomInput
                    placeholder="Số bảo hiểm y tế"
                    icon="card"
                    onChangeText={(text) => setUser({ ...user, healthInsurance: text })}
                    value={user.healthInsurance}
                    keyboardType={'number-pad'}
                    blurHandler={() => {
                        if (!ValidateInformation.validateInsuranceNumber(user.healthInsurance) && user.healthInsurance !== '') {
                            Alert.alert('Thông tin không hợp lệ', 'Số bảo hiểm y tế không hợp lệ');
                        }
                    }}
                    rightIcon={!ValidateInformation.validateInsuranceNumber(user.healthInsurance) && user.healthInsurance ? 'alert-circle' : null}
                    rightIconColor='red'
                />
                <CustomDatePicker placeholder="Ngày sinh" onChangeDate={(date) => setUser({ ...user, date_of_birth: formatDateToYMD(date) })} value={user.date_of_birth != '' ? user.date_of_birth : '2000-1-1'} />
                <GenderInput onChange={(gender) => setUser({ ...user, gender: gender })} value={user.gender} />
            </ScrollView>
            <CustomButton title="Tiếp" onPress={() => setStep(2)} disabled={!(user.full_name != ''
                && user.address != ''
                && user.phone_number != ''
                && user.healthInsurance != ''
                && user.date_of_birth != ''
                && ValidateInformation.validateInsuranceNumber(user.healthInsurance)
                && ValidateInformation.validatePhoneNumber(user.phone_number)
                && ValidateInformation.validateEmail(user.email))} />
        </View>
    );
};

export default Step1;
