import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppointmentContext from '../Context';
import formatDate from '../../../utils/FormatDateFromYMD';
import Icon from 'react-native-vector-icons/Ionicons';

const AppointmentConfirmationScreen = () => {
  const { date, shift, department, setStep, setIsEditing } = useContext(AppointmentContext);
  const appointmentInfo = {
    date: formatDate(date),
    time: shift,
    department: department,
  };

  const handleEditDepartment = () => {
    setStep(1);
    setIsEditing(true);
  };

  const handleEditDate = () => {
    setStep(2);
    setIsEditing(true);
  };

  const handleEditTime = () => {
    setStep(3);
    setIsEditing(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận thông tin đặt lịch</Text>

      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleEditDate}>
          <Text style={styles.infoText}>Ngày:     {appointmentInfo.date}</Text>
          <Icon name='pencil' size={24}/>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleEditTime}>
          <Text style={styles.infoText}>Giờ:       {appointmentInfo.time}</Text>
          <Icon name='pencil' size={24}/>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleEditDepartment}>
          <Text style={styles.infoText}>Khoa:    {appointmentInfo.department.name}</Text>
          <Icon name='pencil' size={24}/>
        </TouchableOpacity>
      </View>

      {/* Thêm các thông tin khác tại đây */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    borderStyle: 'dashed'
  },
  infoText: {
    fontSize: 16,
    paddingVertical: 30,
  },
  editLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default AppointmentConfirmationScreen;
