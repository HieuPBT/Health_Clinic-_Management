import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const AllAppointmentScreen = () => {
    const [appointments, setAppointments] = useState([
        { id: 1, department: 'Phòng khám nội khoa', date: '15/02/2024', time: '8h30 - 10h', confirmed: true },
        { id: 2, department: 'Phòng khám răng hàm mặt', date: '17/02/2024', time: '10h - 11h30', confirmed: false },
        { id: 3, department: 'Phòng khám nội khoa', date: '15/02/2024', time: '8h30 - 10h', confirmed: true },
        { id: 4, department: 'Phòng khám răng hàm mặt', date: '17/02/2024', time: '10h - 11h30', confirmed: false },
        { id: 5, department: 'Phòng khám nội khoa', date: '15/02/2024', time: '8h30 - 10h', confirmed: true },
        { id: 6, department: 'Phòng khám răng hàm mặt', date: '17/02/2024', time: '10h - 11h30', confirmed: false },
    ]);

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

    const cancelAppointment = (id) => {
        setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.department}</Text>
            <Text style={styles.itemText}>Ngày: {item.date}</Text>
            <Text style={styles.itemText}>Giờ: {item.time}</Text>
            <Text style={[styles.itemText, { color: item.confirmed ? 'green' : 'red' }]}>
                {item.confirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}
            </Text>
            <TouchableOpacity onPress={() => handleCancelAppointment(item.id)}>
                <Text style={styles.cancelButton}>Hủy lịch hẹn</Text>
            </TouchableOpacity>
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
    cancelButton: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'right',
        textDecorationLine: 'underline',
    },
});

export default AllAppointmentScreen;
