import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS } from '../configs/configs';

const InvoiceScreen = ({navigation}) => {
    const [appointments, setAppointments] = useState([
        { id: 1, department: 'Nội khoa', date: '15/02/2024', time: '8h30 - 10h', patientID: 'BN01' },
        { id: 2, department: 'Răng hàm mặt', date: '17/02/2024', time: '10h - 11h30', patientID: 'BN01' },
        { id: 3, department: 'Nội khoa', date: '15/02/2024', time: '8h30 - 10h', patientID: 'BN01' },
        { id: 4, department: 'Răng hàm mặt', date: '17/02/2024', time: '10h - 11h30', patientID: 'BN01' },
        { id: 5, department: 'Nội khoa', date: '15/02/2024', time: '8h30 - 10h', patientID: 'BN01' },
        { id: 6, department: 'Răng hàm mặt', date: '17/02/2024', time: '10h - 11h30', patientID: 'BN01' },
    ]);

    const invoice = (id) => {
        setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                <Text style={styles.itemText}>Bệnh nhân: </Text>
                <TouchableOpacity onPress={() => { }}>
                    <Text style={styles.viewProfileBtn}>
                        {item.patientID}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.itemText}> - {item.department}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Ngày: {item.date}</Text>
                <Text style={styles.itemText}> - Giờ: {item.time}</Text>
            </View>
            <CustomButton title="Xuất hóa đơn" onPress={() => navigation.navigate('Thanh toán')} />
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
        borderWidth: 1.5,
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

export default InvoiceScreen;
