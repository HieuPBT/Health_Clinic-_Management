import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS } from '../configs/configs';
import UserProfileScreen from '../screens/UserProfileScreen';
import MedicalHistoryScreen from './MedicalHistoryScreen';
import PrescriptionScreen from './PrescriptionScreen/PrescriptionScreen';

const DoctorAllAppointmentScreen = ({navigation}) => {
    const [appointments, setAppointments] = useState([
        { id: 1, date: '15/02/2024', time: '8h30 - 10h', patientID: 'BN01' },
        { id: 2, date: '17/02/2024', time: '10h - 11h30', patientID: 'BN01' },
        { id: 3, date: '15/02/2024', time: '8h30 - 10h', patientID: 'BN01' },
        { id: 4, date: '17/02/2024', time: '10h - 11h30', patientID: 'BN01' },
        { id: 5, date: '15/02/2024', time: '8h30 - 10h', patientID: 'BN01' },
        { id: 6, date: '17/02/2024', time: '10h - 11h30', patientID: 'BN01' },
    ]);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCancelAppointment = (id) => {
        Alert.alert(
            'Xác nhận hủy lịch hẹn',
            'Bạn có chắc chắn muốn hủy lịch hẹn này?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xác nhận', onPress: () => cancelAppointment(id) },
            ],
            { cancelable: false }
        );
    };

    const prescribing = (id) => {
        setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
    };


    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }


    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                <Text style={styles.itemText}>Bệnh nhân: </Text>
                <TouchableOpacity onPress={() => { navigation.navigate('ViewMedicalHistory', {"patientID": item.patientID}) }}>
                    <Text style={styles.viewProfileBtn}>
                        {item.patientID}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Ngày: {item.date}</Text>
                <Text style={styles.itemText}> - Giờ: {item.time}</Text>
            </View>
            <CustomButton title="Ra toa" onPress={() => navigation.navigate('Prescription', {"patientID": item.patientID})} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    itemContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    viewProfileBtn: {
        fontSize: 16,
        marginBottom: 5,
        textDecorationLine: 'underline',
        color: COLORS.green_primary
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default DoctorAllAppointmentScreen;
