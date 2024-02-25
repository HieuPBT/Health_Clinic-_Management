import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';

const PaymentScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [medicalFee, setMedicalFee] = useState('');
  const [prescriptionFee, setPrescriptionFee] = useState('');

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePayment = () => {
    // Xử lý thanh toán dựa trên phương thức đã chọn và các chi phí đã nhập
  };

  return (
    <View style={styles.container}>
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.title}>Chọn Phương Thức Thanh Toán:</Text>
        <TouchableOpacity style={styles.paymentMethodButton} onPress={() => handlePaymentMethodSelect('cash')}>
          <Text style={styles.paymentMethodButtonText}>Tiền Mặt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentMethodButton} onPress={() => handlePaymentMethodSelect('momo')}>
          <Text style={styles.paymentMethodButtonText}>MoMo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.paymentMethodButton} onPress={() => handlePaymentMethodSelect('zalopay')}>
          <Text style={styles.paymentMethodButtonText}>ZaloPay</Text>
        </TouchableOpacity>
      </View>
      {selectedPaymentMethod !== '' && (
        <View style={styles.paymentDetailsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Chi Phí Khám Bệnh"
            value={medicalFee}
            onChangeText={setMedicalFee}
            keyboardType="numeric"
          />
          {(
            <TextInput
              style={styles.input}
              placeholder="Chi Phí Ra Toa"
              value={prescriptionFee}
              onChangeText={setPrescriptionFee}
              keyboardType="numeric"
            />
          )}
          <CustomButton title="Thanh Toán" onPress={handlePayment} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentMethodContainer: {
    marginBottom: 20,
  },
  paymentMethodButton: {
    // backgroundColor: '#DDDDDD',

    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    borderStyle: 'dashed',
  },
  paymentMethodButtonText: {
    fontSize: 16,
  },
  paymentDetailsContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  title:{
    fontSize: 18,
    marginBottom: 10
  }
});

export default PaymentScreen;
