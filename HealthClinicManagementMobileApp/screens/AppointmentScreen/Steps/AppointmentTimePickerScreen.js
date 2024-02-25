import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppointmentContext from '../Context';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { COLORS, afternoonSlots, morningSlots } from '../../../configs/configs';

const AppointmentTimePickerScreen = ({ isEditing = false }) => {
    const [selectedTime, setSelectedTime] = useState('');
    const { setStep, setShift } = useContext(AppointmentContext);

    const handleSelectTime = (time) => {
        setSelectedTime(time);
    };

    const handleConfirmTime = () => {
        setShift(selectedTime);
        setStep(4);
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>

                <Text style={styles.title}>Chọn khung giờ khám</Text>

                <Text style={styles.sectionTitle}>Buổi sáng:</Text>
                <View style={styles.timeSlotContainer}>
                    {morningSlots.map(slot => (
                        <TouchableOpacity
                            key={slot.id}
                            style={[styles.timeSlot, slot.time === selectedTime.time ? styles.selected : slot.disabled ? styles.disabled : null]}
                            onPress={() => handleSelectTime(slot)}
                            disabled={slot.disabled}>
                            <Text>{slot.time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Buổi chiều:</Text>
                <View style={styles.timeSlotContainer}>
                    {afternoonSlots.map(slot => (
                        <TouchableOpacity
                            key={slot.id}
                            style={[styles.timeSlot, slot.time === selectedTime.time ? styles.selected : slot.disabled ? styles.disabled : null]}
                            onPress={() => handleSelectTime(slot)}
                            disabled={slot.disabled}
                        >
                            <Text>{slot.time}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {isEditing ? <CustomButton title="Sửa xong" disabled={!selectedTime} onPress={handleConfirmTime} /> : <CustomButton title="Tiếp" onPress={handleConfirmTime} disabled={!selectedTime} />}
            <CustomButton title="Trở về" onPress={() => setStep(2)} color={COLORS.dark_green} style={{ marginTop: 10 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomColor: '#aaa',
        borderBottomWidth: 1.5,
        borderStyle: 'dashed'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    timeSlotContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 8,
    },
    timeSlot: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        marginRight: 10,
    },
    selected: {
        backgroundColor: 'lightblue',
    },
    disabled: {
        backgroundColor: '#ccc',
    },
});

export default AppointmentTimePickerScreen;
