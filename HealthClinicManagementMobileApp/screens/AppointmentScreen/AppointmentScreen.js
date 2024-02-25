import React, { useContext, useState } from 'react';

import AppointmentContext from './Context';
import DepartmentSelectionScreen from './Steps/DepartmentSelectionScreen';
import DateSelectionScreen from './Steps/DateSelectionScreen';
import AppointmentTimePickerScreen from './Steps/AppointmentTimePickerScreen';
import AppointmentConfirmationScreen from './Steps/AppointmentConfirmationScreen';
import CustomButton from '../../components/CustomButton/CustomButton';
import { View } from 'react-native';
import API, { endpoints } from '../../configs/API';
import Context from '../../Context';
import showSuccessToast from '../../utils/ShowSuccessToast';
import formatDate from '../../utils/DMYtoYMD';
import showFailedToast from '../../utils/ShowFailedToast';


const AppointmentScreen = ({ navigation }) => {
  const { accessToken } = useContext(Context);
  const [department, setDepartment] = useState('');
  const [date, setDate] = useState('');
  const [shift, setShift] = useState();

  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(1);

  const handleAppointmentConfirm = async () => {
    try {
      const res = await API.post(endpoints['appointments'], {
        "department": department.name,
        "booking_date": (date),
        "booking_time": shift.time
      }, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      })

      if (res.status == 201) {
        showSuccessToast('Đặt lịch thành công!');
        // navigation.navigate('Lịch khám của tôi', { isChanged: true });
      }

      setStep(1);
      setIsEditing(false);
    }
    catch (err) {
      console.log(err);
      if (err.response.status == 500) {
        showFailedToast('Bạn đã đặt lịch này rồi, vui lòng kiểm tra lại!');
      }
    }
  }
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AppointmentContext.Provider value={{ setStep, setDepartment }}>
            <DepartmentSelectionScreen isEditing={isEditing} />
          </AppointmentContext.Provider>
        );
      case 2:
        return (
          <AppointmentContext.Provider value={{ setStep, setDate }}>
            <DateSelectionScreen isEditing={isEditing} />
          </AppointmentContext.Provider>
        );
      case 3:
        return (
          <AppointmentContext.Provider value={{ setStep, setShift }}>
            <AppointmentTimePickerScreen isEditing={isEditing} />
          </AppointmentContext.Provider>
        );
      case 4:
        return (
          <AppointmentContext.Provider value={{ department, date, shift, setStep, setIsEditing }}>
            <AppointmentConfirmationScreen />
            <View style={{ padding: 10 }}>
              <CustomButton title="Xác nhận" onPress={handleAppointmentConfirm} />
            </View>
          </AppointmentContext.Provider>
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

export default AppointmentScreen;
