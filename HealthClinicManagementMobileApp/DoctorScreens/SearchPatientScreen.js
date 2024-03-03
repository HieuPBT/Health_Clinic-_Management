import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import CustomDatePicker from '../components/CustomDatePicker/CustomDatePicker';
import CustomInput from '../components/CustomInput/CustomInput';
import getToday from '../utils/getToday';
import showFailedToast from '../utils/ShowFailedToast';
import formatDateToYMD from '../utils/formatDateToYYYYMMDD';

const SearchPatientScreen = ({navigation}) => {
  const [patientEmail, setPatientEmail] = useState('');
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getToday());

  const handleSearch = async () => {
    console.log(startDate, endDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      showFailedToast('Lỗi', 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc')
      return;
    }
    navigation.navigate('MedicalHistoryScreen', {"email": patientEmail, "startDate": startDate, "endDate": endDate})
  };

  return (
    <View style={styles.container}>
      <CustomInput
        style={styles.input}
        placeholder="Nhập email bệnh nhân"
        value={patientEmail}
        onChangeText={text => setPatientEmail(text)}
      />
      <CustomDatePicker onChangeDate={(date)=>{setStartDate(formatDateToYMD(date))}} value={getToday()}/>
      <CustomDatePicker onChangeDate={(date)=>{setEndDate(formatDateToYMD(date))}} value={getToday()}/>
      <CustomButton title="Tìm kiếm" onPress={handleSearch}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  patientItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  patientName: {
    fontSize: 16,
  },
});

export default SearchPatientScreen;
