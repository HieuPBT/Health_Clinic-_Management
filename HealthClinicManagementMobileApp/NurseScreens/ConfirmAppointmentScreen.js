import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS } from '../configs/constants';
import { authApi, endpoints } from '../configs/API';
import Context from '../Context';
import formatDate from '../utils/FormatDateFromYMD';
import showSuccessToast from '../utils/ShowSuccessToast';
import showFailedToast from '../utils/ShowFailedToast';
import cutLast3Chars from '../utils/cutLast3Chars';
import Icon from 'react-native-vector-icons/Ionicons';


const ConfirmAppointmentScreen = ({ navigation }) => {
    const { accessToken } = useContext(Context);

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const confirmAppointment = async (id) => {
        try {
            const res = await authApi(accessToken).patch(
                endpoints['confirm_appointment'](id),
                null
            );

            if (res.status === 200) {
                showSuccessToast(`Xác nhận thành công lịch hẹn ${id}!`);
                setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
            }
        } catch (err) {
            console.log(err);
            if (err.response.status === 500) {
                showFailedToast('Xác nhận thất bại!');
            }
        }
    };

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const response = await authApi(accessToken).get(`${endpoints['appointments']}?page=${page}`);
            if (response.data.next == null) {
                setPage(null);
            } else {
                setPage(page + 1);
            }
            setAppointments([...appointments, ...response.data.results]);
        } catch (error) {
            console.log('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setAppointments([]);
        loadAppointments();
        setPage(1);
    }, [accessToken]);

    const renderFooter = () => {
        return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                <Text style={styles.itemText}>Bệnh nhân: {item.patient.id}</Text>
                <Text style={styles.itemText}> {item.patient.full_name} </Text>
            </View>
            <Text style={styles.itemText}>Email: {item.patient.email}</Text>

            <View style={styles.row}>
                <Text style={styles.itemText}>Ngày: {formatDate(item.booking_date)}</Text>
                <Text style={styles.itemText}>Giờ: {cutLast3Chars(item.booking_time)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Khoa: {(item.department)}</Text>
                <Text style={[styles.itemText, { color: 'red', alignSelf: 'flex-end' }]}>Chờ xác nhận</Text>
            </View>
            <View style={[styles.row, { justifyContent: 'flex-end' }]}>
            </View>
            <CustomButton title="Xác nhận" onPress={() => confirmAppointment(item.id)} />
        </View>
    );
    const handleRefresh = () => {
        setPage(1);
        setAppointments([]);
        loadAppointments();
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleRefresh}>
                    <Text style={{ marginRight: 15 }}>
                        <Icon name={'refresh'} size={28} />
                    </Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 20 }}
                onEndReached={page != null ? loadAppointments : null}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
            />
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
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
        justifyContent: 'space-between',
    }
});

export default ConfirmAppointmentScreen;
