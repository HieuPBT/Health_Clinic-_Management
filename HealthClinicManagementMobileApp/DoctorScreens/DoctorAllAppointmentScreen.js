import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS } from '../configs/constants';
import Context from '../Context';
import API, { authApi, endpoints } from '../configs/API';
import { LogBox } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import formatDate from '../utils/FormatDateFromYMD';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const DoctorAllAppointmentScreen = ({ navigation, route }) => {
    const { accessToken } = useContext(Context);

    const [appointments, setAppointments] = useState([]);


    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

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


    const loadAppointments = async () => {
        setLoading(true);
        try {
            if (page !== null) {
                const response = await authApi(accessToken).get(`${endpoints['appointments']}?page=${page}`);
                if (response.data.next == null) {
                    setPage(null);
                } else {
                    setPage(page + 1);
                }
                setAppointments([...appointments, ...response.data.results]);
            }
        } catch (error) {
            console.log('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (accessToken) {
            setAppointments([]);
            setPage(1);
            loadAppointments();
        }
    }, [accessToken]);

    const renderFooter = () => {
        return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    };

    const prescribing = (id) => {
        setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
    };




    const renderItem = ({ item }) => {
        try {
            return (
                <View style={styles.itemContainer}>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Bệnh nhân: </Text>
                        <TouchableOpacity onPress={() => { navigation.navigate('MedicalHistoryScreen', { "email": item.patient.email }) }}>
                            <Text style={styles.viewProfileBtn}>
                                {item.patient.full_name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.itemText}>Mã bệnh nhân: {item.patient.id}</Text>
                    <Text style={styles.itemText}>Email bệnh nhân: {item.patient.email}</Text>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Ngày: {formatDate(item.booking_date)}</Text>
                        <Text style={styles.itemText}> - Giờ: {item.booking_time.slice(0, -3)}</Text>
                    </View>
                    <CustomButton title="Kê toa" onPress={() => {
                        navigation.navigate('Prescription', { "patientID": item.patient.id, 'appointment': item.id, onSuccess: () => { prescribing(item.id) } });
                    }} />
                </View>)
        } catch (err) {
            console.log(err);
        }
    }

    const handleRefresh = () => {
        setPage(1);
        setAppointments([]);
        loadAppointments();
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
        paddingVertical: 10,
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
