import React, { useContext, useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import Context from '../Context';
import CustomInput from '../components/CustomInput/CustomInput';
import CustomDatePicker from '../components/CustomDatePicker/CustomDatePicker';
import GenderInput from '../components/GenderInput/GenderInput';
import ValidateInformation from '../utils/Validate';
import Normalize from '../utils/Normalize';
import AvatarPicker from '../components/AvatarPicker/AvatarPicker';
import formatDateToYMD from '../utils/formatDateToYYYYMMDD';
import CustomButton from '../components/CustomButton/CustomButton';
import { authApi, endpoints } from '../configs/API';
import showSuccessToast from '../utils/ShowSuccessToast';
import showFailedToast from '../utils/ShowFailedToast';

const UpdateUserInfoScreen = ({ navigation }) => {
    const { userData, accessToken, dispatch, role, setRole } = useContext(Context);
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
            for (const key in editedUserInfo) {
                if (key == 'avatar') {
                    formData.append('avatar', {
                        uri: editedUserInfo[key],
                        type: 'image/jpeg',
                        name: 'avatar.jpg',
                    });
                } else if (key == 'patient') {
                    const res = await authApi(accessToken).patch(endpoints['update_profile'], { 'patient': editedUserInfo[key] });
                    dispatch({
                        type: "updateInfo",
                        payload: { ...editedUserInfo }
                    });
                    showSuccessToast('Cập nhật thành công mã bảo hiểm y tế')
                }
                else
                    formData.append(key, editedUserInfo[key]);
            }

            const response = await authApi(accessToken).patch(endpoints['update_profile'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            // console.log(response.data)

            dispatch({
                type: "updateInfo",
                payload: { ...editedUserInfo }
            });
            setRole(role);
            showSuccessToast('Thông báo', 'Thông tin đã được cập nhật thành công.');

            // Cập nhật state userInfo
            setUserInfo({
                ...userInfo,
                ...editedUserInfo
            });


            // Reset editedUserInfo
            setEditedUserInfo({});

            navigation.navigate('Thông tin người dùng');

        } catch (error) {
            showFailedToast('Có lỗi xảy ra!', 'Vui lòng thử lại sau');
            console.log(error);
        } finally {
            navigation.navigate('Thông tin người dùng');
        }
    };

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
                        handleInputChange('full_name', Normalize.nameNormalize(editedUserInfo.full_name))
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
                {userInfo.patient ? <CustomInput
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
                /> : null}
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
