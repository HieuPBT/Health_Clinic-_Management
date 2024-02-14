import React, { useState } from 'react';

import AppointmentContext from './Context';
import DepartmentSelectionScreen from './Steps/DepartmentSelectionScreen';
import DateSelectionScreen from './Steps/DateSelectionScreen';
import AppointmentTimePickerScreen from './Steps/AppointmentTimePickerScreen';
import AppointmentConfirmationScreen from './Steps/AppointmentConfirmationScreen';
import CustomButton from '../../components/CustomButton/CustomButton';
import { View } from 'react-native';


const AppointmentScreen = () => {
  const [department, setDepartment] = useState('');
  const [date, setDate] = useState('');
  const [shift, setShift] = useState();

  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(1);

  const handleAppointmentConfirm = () => {
    
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
            <View style={{padding: 10}}>
              <CustomButton title="Xác nhận" onPress={handleAppointmentConfirm}/>
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
