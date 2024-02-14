import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppointmentContext from '../Context';
import CustomButton from '../../../components/CustomButton/CustomButton';

const AppointmentTimePickerScreen = ({ isEditing = false }) => {
    const [selectedTime, setSelectedTime] = useState('');
    const { setStep, setShift } = useContext(AppointmentContext);

    // Danh sách các khung giờ cho buổi sáng và buổi chiều
    const morningSlots = [
        { id: 1, time: '7:00   -   8:30', disabled: true },
        { id: 2, time: '8:30  -  10:00' },
        { id: 3, time: '10:00 - 11:30' },
    ];

    const afternoonSlots = [
        { id: 4, time: '13:00 - 14:30' },
        { id: 5, time: '14:30 - 16:00' },
        { id: 6, time: '16:00 - 17:30' },
    ];

    // Xử lý sự kiện khi chọn khung giờ
    const handleSelectTime = (time) => {
        setSelectedTime(time);
        console.log(time);
        // Thực hiện các hành động khác tại đây (ví dụ: gửi dữ liệu đến server)
    };
    const handleConfirmTime = () => {
        setShift(selectedTime);
        setStep(4);
        console.log(selectedTime)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chọn khung giờ</Text>

            <Text style={styles.sectionTitle}>Buổi sáng:</Text>
            {morningSlots.map(slot => (
                <TouchableOpacity
                    key={slot.id}
                    style={[styles.timeSlot, slot.time === selectedTime ? styles.selected : slot.disabled ? styles.disabled : null]}
                    onPress={() => handleSelectTime(slot.time)}
                    disabled={slot.disabled}>
                    <Text>{slot.time}</Text>
                </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Buổi chiều:</Text>
            {afternoonSlots.map(slot => (
                <TouchableOpacity
                    key={slot.id}
                    style={[styles.timeSlot, slot.time === selectedTime ? styles.selected : slot.disabled ? styles.disabled : null]}
                    onPress={() => handleSelectTime(slot.time)}
                    disabled={slot.disabled}
                >
                    <Text>{slot.time}</Text>
                </TouchableOpacity>
            ))}

            {isEditing ? <CustomButton title="Sửa xong" disabled={!selectedTime} onPress={() => { handleConfirmTime() }} /> : <CustomButton title="Tiếp" onPress={() => {
                handleConfirmTime();
            }} disabled={!selectedTime} />}
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    timeSlot: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    selected: {
        backgroundColor: 'lightblue',
    },
    disabled: {
        backgroundColor: '#ccc',
    },
});

export default AppointmentTimePickerScreen;
;
