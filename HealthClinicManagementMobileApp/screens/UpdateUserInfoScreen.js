import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import Context from '../Context';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomDatePicker from '../components/CustomDatePicker/CustomDatePicker';
import GenderInput from '../components/GenderInput/GenderInput';
import ValidateInformation from '../utils/Validate';
import Nomalize from '../utils/Nomalize';
import AvatarPicker from '../components/AvatarPicker/AvatarPicker';
import DateInput from '../components/DateInput/DateInput';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import formatDateToYMD from '../utils/formatDateToYYYYMMDD';
import CustomButton from '../components/CustomButton/CustomButton';
import API, { endpoints } from '../configs/API';
import showSuccessToast from '../utils/ShowSuccessToast';

const UpdateUserInfoScreen = ({ navigation }) => {
    const { userData, accessToken, setUserData } = useContext(Context);
    const [userInfo, setUserInfo] = useState(userData);
    const [editedUserInfo, setEditedUserInfo] = useState({});


    const handleInputChange = (field, value) => {
        setEditedUserInfo({
            ...editedUserInfo,
            [field]: value
        });
    };

    const handleUpdateUserInfo = async () => {
        try {
            const formData = new FormData();

            // Thêm các trường thông tin vào formData
            for (const key in editedUserInfo) {
                if (key == 'avatar') {
                    formData.append('avatar', {
                        uri: editedUserInfo[key],
                        type: 'image/jpeg', // Thay đổi type tùy thuộc vào định dạng ảnh
                        name: 'avatar.jpg',
                    });
                } else
                    formData.append(key, editedUserInfo[key]);
            }
            console.log(formData)

            // Gửi yêu cầu cập nhật thông tin
            const res = await API.patch(endpoints['update_profile'], formData, {
                headers: {
                    'Authorization': 'bearer ' + accessToken,
                    'Content-Type': 'multipart/form-data',
                },
            });

            showSuccessToast('Thông báo', 'Thông tin đã được cập nhật thành công.');

            // Cập nhật state userInfo
            setUserInfo({
                ...userInfo,
                ...editedUserInfo
            });

            setUserData({
                ...userInfo,
                ...editedUserInfo
            });

            // Reset editedUserInfo
            setEditedUserInfo({});

            navigation.navigate('Thông tin người dùng', {changed: true});

        } catch (error) {
            console.log(error);
        }
    };


    const compareObjects = (obj1, obj2) => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Nếu số lượng keys khác nhau, hai đối tượng không bằng nhau
        if (keys1.length !== keys2.length) {
            return false;
        }

        // Lặp qua từng key của obj1
        for (let key of keys1) {
            // Nếu obj2 không có key này hoặc giá trị của key này khác nhau giữa obj1 và obj2
            if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
                return false;
            }
        }

        // Nếu đã lặp qua tất cả các key mà không có sự khác biệt, hai đối tượng là giống nhau
        return true;
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <ScrollView style={{ width: '100%', marginTop: 20 }}>
                <AvatarPicker avtSize={150} onValueChange={(value) => {
                    handleInputChange('avatar', value)
                }} value={editedUserInfo.avatar || userInfo.avatar} />
                <CustomInput
                    placeholder="Họ và tên"
                    icon="person"
                    value={editedUserInfo.full_name == undefined ? userInfo.full_name : editedUserInfo.full_name}
                    onChangeText={(text) => handleInputChange('full_name', text)}
                    style={{ marginTop: 10 }}
                    blurHandler={() => {
                        handleInputChange('full_name', Nomalize.nameNormalize(editedUserInfo.full_name))
                    }}
                />
                <CustomInput
                    placeholder="Số điện thoại"
                    icon="call"
                    value={editedUserInfo.phone_number == undefined ? userInfo.phone_number : editedUserInfo.phone_number}
                    onChangeText={(text) => handleInputChange('phone_number', text)}
                    keyboardType={'number-pad'}
                    rightIcon={!ValidateInformation.validatePhoneNumber(editedUserInfo.phone_number) && editedUserInfo.phone_number ? 'alert-circle' : null}
                    rightIconColor='red'
                    blurHandler={() => {
                        if (!ValidateInformation.validatePhoneNumber(editedUserInfo.phone_number) && editedUserInfo.phone_number) {
                            Alert.alert('Thông tin không hợp lệ', 'Số điện thoại không hợp lệ');
                        }
                    }}
                />
                <CustomInput
                    placeholder="Địa chỉ"
                    icon="home"
                    value={editedUserInfo.address == undefined ? userInfo.address : editedUserInfo.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                />
                <CustomInput
                    placeholder="Số bảo hiểm y tế"
                    icon="card"
                    value={editedUserInfo.patient == undefined ?
                        userInfo.patient.health_insurance :
                        editedUserInfo.patient['health_insurance']}
                    onChangeText={(text) => handleInputChange('patient', { "health_insurance": text })}
                    keyboardType={'number-pad'}
                    // blurHandler={() => {
                    //     if (!ValidateInformation.validateInsuranceNumber(editedUserInfo.patient['health_insurance']) && editedUserInfo.patient['health_insurance']) {
                    //         Alert.alert('Thông tin không hợp lệ', 'Số bảo hiểm y tế không hợp lệ');
                    //     }
                    // }}
                    rightIcon={!(editedUserInfo.patient != undefined ? ValidateInformation.validateInsuranceNumber(editedUserInfo.patient["health_insurance"]) : true) ? 'alert-circle' : null}
                    rightIconColor='red'
                />
                <CustomDatePicker onChangeDate={(date) => { handleInputChange('date_of_birth', formatDateToYMD(date)) }}
                    value={editedUserInfo.date_of_birth == undefined ? userInfo.date_of_birth : editedUserInfo.date_of_birth} />
                <GenderInput value={editedUserInfo.gender || userInfo.gender}
                    onChange={(gender) => handleInputChange('gender', gender == 'Nam' ? 'MALE' : gender == 'Nữ' ? 'FEMALE' : 'OTHER')} />
                <CustomButton title="Cập nhật thông tin" onPress={handleUpdateUserInfo}
                    disabled={!(editedUserInfo.full_name != undefined ? editedUserInfo.full_name !== "" : true
                        && editedUserInfo.phone_number != undefined ? ValidateInformation.validatePhoneNumber(editedUserInfo.phone_number) : true
                            && editedUserInfo.patient != undefined ? ValidateInformation.validateInsuranceNumber(editedUserInfo.patient["health_insurance"]) : true)} />
            </ScrollView>
        </View>
    );
};

export default UpdateUserInfoScreen;
