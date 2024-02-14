import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import CustomButton from '../../../components/CustomButton/CustomButton';
import AppointmentContext from '../Context';

const departments = [
  { id: 1, name: 'Phòng khám nội khoa' },
  { id: 2, name: 'Phòng khám ngoại khoa' },
  { id: 3, name: 'Phòng khám da liễu' },
  { id: 4, name: 'Phòng khám nội khoa' },
  { id: 5, name: 'Phòng khám ngoại khoa' },
  { id: 6, name: 'Phòng khám da liễu' },
  { id: 7, name: 'Phòng khám nội khoa' },
  { id: 8, name: 'Phòng khám ngoại khoa' },
  { id: 9, name: 'Phòng khám da liễu' },
  { id: 10, name: 'Phòng khám nội khoa' },
  { id: 11, name: 'Phòng khám ngoại khoa' },
  { id: 12, name: 'Phòng khám da liễu' },
];

const DepartmentSelectionScreen = ({ isEditing = false }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const { setStep, setDepartment } = useContext(AppointmentContext);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
  };
  const handleConfirmationSelect = () => {
    if (!isEditing)
      setStep(2);
    setDepartment(selectedDepartment);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.departmentItem} onPress={() => handleDepartmentSelect(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn khoa</Text>
      <FlatList
        data={departments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.selectedDepartment}>
        {selectedDepartment ? selectedDepartment.name : 'Chưa chọn'}
      </Text>
      {isEditing ? <CustomButton title="Sửa xong" disabled={!selectedDepartment} onPress={() => { setStep(4); handleConfirmationSelect() }} /> : <CustomButton title="Tiếp" disabled={!selectedDepartment} onPress={handleConfirmationSelect} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  departmentItem: {
    paddingVertical: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    borderStyle: 'dashed'
  },
  selectedDepartment: {
    marginVertical: 20,
    fontSize: 18,
  },
});

export default DepartmentSelectionScreen;
