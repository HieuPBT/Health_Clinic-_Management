import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS, departmentsDictionary } from '../configs/configs';
import UserProfileScreen from '../screens/UserProfileScreen';
import API, { endpoints } from '../configs/API';
import Context from '../Context';
import { morningSlots, afternoonSlots } from '../configs/configs';
import formatDate from '../utils/FormatDateFromYMD';
import showSuccessToast from '../utils/ShowSuccessToast';
import showFailedToast from '../utils/ShowFailedToast';

const slots = [...morningSlots, ...afternoonSlots];

const ConfirmAppointmentScreen = () => {
    const { accessToken } = useContext(Context);
    console.log(accessToken)

    const [appointments, setAppointments] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

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

    const confirmAppointment = async (id) => {
        try {
            const res = await API.patch(endpoints['appointment'](id),
            {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })

            if(res.status === 200){
                showSuccessToast(`Xác nhận thành công lịch hẹn ${id}!`);
                setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
            }
        } catch (err){
            console.log(err);
            if(res.status === 500){
                showFailedToast('Xác nhận thất bại!');
            }
        }
    };


    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    const loadAppointments = async () => {
        setLoading(true);
        try {

            const response = await API.get(`${endpoints['appointments']}?page=${page}`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            console.log(response.data.results)
            setAppointments([...appointments, ...response.data.results]);
            setPage(page + 1);
        } catch (error) {
            console.log('Error fetching:', error);
            if (error.response.status === 404) {
                setPage(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setAppointments([]);
        loadAppointments();
    }, [accessToken]);

    // Hàm để hiển thị activity indicator khi đang tải dữ liệu
    const renderFooter = () => {
        return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Modal
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
                        <UserProfileScreen preview={true} />
                        <CustomButton title={"Thoát"} onPress={toggleModal} style={{}} />
                    </View>
                </View>
            </Modal>
            <View style={styles.row}>
                <Text style={styles.itemText}>Bệnh nhân: </Text>
                <TouchableOpacity onPress={() => { toggleModal() }}>
                    <Text style={styles.viewProfileBtn}>
                        {item.patientID}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.itemText}> - {departmentsDictionary[item.department]}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Ngày: {formatDate(item.booking_date)}</Text>
                <Text style={styles.itemText}> - Giờ: {slots[item.booking_time].time}</Text>
            </View>
            <CustomButton title="Xác nhận" onPress={() => confirmAppointment(item.id)} />
        </View>
    );

    return (
        <View style={styles.container}>
            {appointments != []?<FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 20 }}
                onEndReached={() => { if (page != null) loadAppointments() }}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
            />:<ActivityIndicator/>}
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

export default ConfirmAppointmentScreen;
