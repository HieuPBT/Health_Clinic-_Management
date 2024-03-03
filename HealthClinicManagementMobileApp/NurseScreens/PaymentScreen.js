import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, LogBox } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import API, { authApi, endpoints } from '../configs/API';
import Context from '../Context';
import showSuccessToast from '../utils/ShowSuccessToast';
import showFailedToast from '../utils/ShowFailedToast';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const PaymentScreen = ({ route, navigation }) => {
  const { accessToken } = useContext(Context);
  const { prescriptionId, isHasMedicineList, appointmentId, onSuccess } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [medicalFee, setMedicalFee] = useState(0);
  const [prescriptionFee, setPrescriptionFee] = useState(0);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  useEffect(() => {
    setMedicalFee('');
    setPrescriptionFee('');
    setSelectedPaymentMethod('');
  }, [route.params])

  const handlePayment = async () => {
    if (!isHasMedicineList) {
      setPrescriptionFee(0);
    }

    try {
      const res = await API.post(endpoints['invoice'](prescriptionId), {
        'prescription_fee': parseFloat(prescriptionFee),
        'appointment_fee': parseFloat(medicalFee),
        'payment_method': selectedPaymentMethod,
      }, {
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })

      if (res.status == 201) {
        onSuccess();
        showSuccessToast('Xuất hóa đơn thành công!');
        navigation.navigate('Xuất hóa đơn');
      }
    } catch (err) {
      showFailedToast('Có lỗi xảy ra!');
      console.log(err)
    }
  };

  const handleOnlinePayment = async () => {
    const amount = (prescriptionFee ? parseFloat(prescriptionFee) : 0) + parseFloat(medicalFee);
    switch (selectedPaymentMethod) {
      case "MOMO":
        try {
          const res = await authApi(accessToken).post(endpoints['create_momo'], {
            total: amount.toString(),
          })
          const { orderId, partnerCode, qrCodeUrl, requestId } = res.data;
          navigation.navigate('Thanh toán Momo', {
            'qrCodeUrl': qrCodeUrl,
            'appointmentId': appointmentId,
            'amount': amount,
            'partnerCode': partnerCode,
            'orderId': orderId,
            'requestId': requestId,
            'onSuccess': handlePayment
          });
        } catch (err) {
          console.log(err)
        }
        break;
      case "ZALO_PAY":
        try {
          const res = await authApi(accessToken).post(endpoints['create_zalopay'], {
            amount: amount.toString(),
          })
          console.log(res.data)
          const { apptransid, qrcode } = res.data;
          navigation.navigate('Thanh toán ZaloPay', {
            'appointmentId': appointmentId,
            'amount': amount,
            'apptransid': apptransid,
            'qrcode': qrcode,
            'onSuccess': handlePayment
          });
        } catch (err) {
          console.log(err)
        }
        break;
      default:
        break;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.paymentMethodContainer}>
        <Text style={styles.title}>Chọn Phương Thức Thanh Toán:</Text>
        <TouchableOpacity style={[styles.paymentMethodButton, selectedPaymentMethod === 'TRỰC TIẾP' && styles.selectedMethod]} onPress={() => handlePaymentMethodSelect('TRỰC TIẾP')}>
          <Text style={styles.paymentMethodButtonText}>Trực tiếp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.paymentMethodButton, selectedPaymentMethod === 'MOMO' && styles.selectedMethod]} onPress={() => handlePaymentMethodSelect('MOMO')}>
          <Text style={styles.paymentMethodButtonText}>MoMo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.paymentMethodButton, selectedPaymentMethod === 'ZALO_PAY' && styles.selectedMethod]} onPress={() => handlePaymentMethodSelect('ZALO_PAY')}>
          <Text style={styles.paymentMethodButtonText}>ZaloPay</Text>
        </TouchableOpacity>
      </View>
      {selectedPaymentMethod !== '' && (
        <View style={styles.paymentDetailsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Chi Phí Khám Bệnh"
            value={medicalFee ? medicalFee.toString() : null}
            onChangeText={value => {
              if (!isNaN(value)) {
                setMedicalFee(parseFloat(value));
              }
            }}
            keyboardType="numeric"
          />
          {isHasMedicineList ? (
            <TextInput
              style={styles.input}
              placeholder="Chi Phí Ra Toa"
              value={prescriptionFee.toString()}
              onChangeText={value => {
                if (!isNaN(value)) {
                  setPrescriptionFee(parseFloat(value));
                }
              }}
              keyboardType="numeric"
            />
          ) : null}
          {selectedPaymentMethod == 'TRỰC TIẾP' ?
            <CustomButton title="Xác nhận đã thu tiền" onPress={handlePayment} /> :
            <CustomButton title={"Tạo mã QR thanh toán "} onPress={handleOnlinePayment} />}
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

    paddingVertical: 20,
    paddingHorizontal: 20,
    // marginBottom: 15,
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
  title: {
    fontSize: 18,
    marginBottom: 10
  },
  selectedMethod: {
    backgroundColor: 'lightblue',
  }
});

export default PaymentScreen;
