import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import UserProfileScreen from '../screens/UserProfileScreen';
import MedicalHistoryScreen from './MedicalHistoryScreen';
import CustomDatePicker from '../components/CustomDatePicker/CustomDatePicker';
import CustomInput from '../components/CustomInput/CustomInput';

const SearchPatientScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    // Thực hiện tìm kiếm dựa trên searchQuery, ví dụ: gửi yêu cầu tới máy chủ hoặc tìm trong dữ liệu cục bộ
    // Giả sử searchResults là kết quả trả về từ việc tìm kiếm
    const results = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      // Thêm các kết quả khác ở đây
    ];
    setSearchResults(results);
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }

  return (
    <View style={styles.container}>
      <CustomInput
        style={styles.input}
        placeholder="Nhập mã bệnh nhân"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <CustomDatePicker onChangeDate={(date)=>{setStartDate(date)}} placeholder='Nhập ngày '/>
      <CustomDatePicker onChangeDate={(date)=>{setStartDate(date)}}/>
      <CustomButton title="Tìm kiếm" onPress={handleSearch}/>
      <FlatList
        data={searchResults}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <Modal
              visible={isModalVisible}
              onRequestClose={toggleModal}
            >
                <View style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
                  <ScrollView>
                    <UserProfileScreen preview={true} />
                    <MedicalHistoryScreen patientID={item.patientID} />
                  </ScrollView>
                  <CustomButton title={"Thoát"} onPress={toggleModal} style={{}} />
                </View>
            </Modal>
            <TouchableOpacity style={styles.patientItem} onPress={toggleModal}>
              <Text style={styles.patientName}>{item.name}</Text>
            </TouchableOpacity>
          </>
        )}
      />
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
