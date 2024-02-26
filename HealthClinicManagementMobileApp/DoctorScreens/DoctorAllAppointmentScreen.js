import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS } from '../configs/configs';
import UserProfileScreen from '../screens/UserProfileScreen';
import MedicalHistoryScreen from './MedicalHistoryScreen';
import PrescriptionScreen from './PrescriptionScreen/PrescriptionScreen';
import Context from '../Context';
import { slots } from '../configs/configs';
import API, { endpoints } from '../configs/API';

const DoctorAllAppointmentScreen = ({ navigation, route }) => {
    const { accessToken } = useContext(Context);

    const [appointments, setAppointments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);


    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);



    const loadAppointments = async () => {
        setLoading(true);
        try {

            const response = await API.get(`${endpoints['appointments']}?page=${page}`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            setAppointments([...appointments, ...response.data.results]);
            setPage(page + 1);
        } catch (error) {
            // console.log('Error fetching:', error);
            if (error.response.status === 404) {
                setPage(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) { // Kiểm tra accessToken có tồn tại trước khi gọi loadAppointments()
            setAppointments([]);
            setPage(1);
            loadAppointments();
        }
    }, [accessToken]);

    // Hàm để hiển thị activity indicator khi đang tải dữ liệu
    const renderFooter = () => {
        return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    };

    const prescribing = (id) => {
        setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
    };



    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }


    const renderItem = ({ item }) => {
        try {
            return (
                <View style={styles.itemContainer}>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Bệnh nhân: </Text>
                        <TouchableOpacity onPress={() => { navigation.navigate('ViewMedicalHistory', { "patientID": item.patient.id, "userData": item.patient }) }}>
                            <Text style={styles.viewProfileBtn}>
                                {item.patient.full_name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Ngày: {item.booking_date}</Text>
                        <Text style={styles.itemText}> - Giờ: {item.booking_time.slice(0, -3)}</Text>
                    </View>
                    <CustomButton title="Kê toa" onPress={() => navigation.navigate('Prescription', { "patientID": item.patient.id, 'appointment': item.id, onSuccess: () => { prescribing(item.id) } })} />
                </View>)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 20 }}
                ListFooterComponent={renderFooter}
                onEndReached={page ? loadAppointments : null}
                onEndReachedThreshold={0.1}
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
