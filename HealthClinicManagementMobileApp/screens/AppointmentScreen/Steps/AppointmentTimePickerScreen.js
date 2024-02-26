import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AppointmentContext from '../Context';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { COLORS, afternoonSlots, morningSlots } from '../../../configs/configs';
import Context from '../../../Context';
import API, { endpoints } from '../../../configs/API';

const AppointmentTimePickerScreen = ({ isEditing = false }) => {
    const { accessToken } = useContext(Context);
    const { setStep, setShift, date, department } = useContext(AppointmentContext);
    const [selectedTime, setSelectedTime] = useState('');
    const [enabledSlots, setEnabledSlots] = useState([]);

    const handleSelectTime = (time) => {
        setSelectedTime(time);
    };

    const handleConfirmTime = () => {
        setShift(selectedTime);
        setStep(4);
    };

    const isSlotEnabled = (time) => enabledSlots.includes(time);

    useEffect(() => {
        const loadEnabledSlots = async () => {
            try {
                const res = await API.get(endpoints['available_times'](date, department.name), {
                    headers: {
                        Authorization: 'Bearer ' + accessToken
                    }
                })
                setEnabledSlots(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        loadEnabledSlots();
    }, [accessToken, date, department])
    function addColonAndZeros(str) {
        return str + ":00";
    }
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>

                <Text style={styles.title}>Chọn khung giờ khám</Text>
                <View style={styles.timeSlotType}>
                    <View
                        style={[styles.timeSlot]}
                    >
                        <Text>Có thể chọn</Text>
                    </View>
                    <View
                        style={[styles.timeSlot, styles.selected]}
                    >
                        <Text>Đang chọn</Text>
                    </View>
                    <View
                        style={[styles.timeSlot, styles.disabled]}
                    >
                        <Text>Kín khung giờ</Text>
                    </View>
                </View>
                <Text style={styles.sectionTitle}>Buổi sáng:</Text>
                {enabledSlots.length > 0 ? <>
                    <View style={styles.timeSlotContainer}>
                        {morningSlots.map(slot => (
                            <TouchableOpacity
                                key={slot.id}
                                style={[
                                    styles.timeSlot,
                                    (slot.time === selectedTime.time && isSlotEnabled(addColonAndZeros(slot.time))) ? styles.selected : // Nếu slot đang được chọn và enabled
                                        (!isSlotEnabled(addColonAndZeros(slot.time)) ? styles.disabled : null) // Nếu slot bị disable
                                ]}
                                onPress={() => { (slot.time) && handleSelectTime(slot) }} // Chỉ xử lý onPress nếu slot được enable
                                disabled={!isSlotEnabled(addColonAndZeros(slot.time))} // Disable TouchableOpacity nếu slot bị disable
                            >
                                <Text>{slot.time}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </> : <ActivityIndicator />}

                <Text style={styles.sectionTitle}>Buổi chiều:</Text>

                {enabledSlots.length > 0 ? <>
                    <View style={styles.timeSlotContainer}>
                        {afternoonSlots.map(slot => (
                            <TouchableOpacity
                                key={slot.id}
                                style={[
                                    styles.timeSlot,
                                    (slot.time === selectedTime.time && isSlotEnabled(addColonAndZeros(slot.time))) ? styles.selected : // Nếu slot đang được chọn và enabled
                                        (!isSlotEnabled(addColonAndZeros(slot.time)) ? styles.disabled : null) // Nếu slot bị disable
                                ]}
                                onPress={() => { (slot.time) && handleSelectTime(slot) }} // Chỉ xử lý onPress nếu slot được enable
                                disabled={!isSlotEnabled(addColonAndZeros(slot.time))} // Disable TouchableOpacity nếu slot bị disable
                            >
                                <Text>{slot.time}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </> : <ActivityIndicator />}
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
        justifyContent: 'center',
        padding: 8,
        borderWidth: 1.5,
        borderColor: '#aaa',
        borderStyle: 'dashed',
        borderRadius: 8,
        flex: 0.45,
        paddingVertical: 40
    },
    timeSlotType: {
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
        // marginBottom: 10,
        margin: 5,
    },
    selected: {
        backgroundColor: 'lightblue',
    },
    disabled: {
        backgroundColor: '#ccc',
    },
});


export default AppointmentTimePickerScreen;
