import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, LogBox } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS } from '../configs/constants';
import Context from '../Context';
import API, { authApi, endpoints } from '../configs/API';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import formatDate from '../utils/FormatDateFromYMD';
import cutLast3Chars from '../utils/cutLast3Chars';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const InvoiceScreen = ({ navigation }) => {
    const { accessToken } = useContext(Context);
    const [prescriptions, setPrescriptions] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadPrescription = async () => {
        if (page !== null) {
            setLoading(true);
            try {
                const response = await authApi(accessToken).get(`${endpoints['today_prescription']}?page=${page}`);
                if (response.data.next == null) {
                    setPage(null);
                } else {
                    setPage(page + 1);
                }
                setPrescriptions([...prescriptions, ...response.data.results]);
            } catch (error) {
                console.log('Error fetching:', error);
            } finally {
                setLoading(false);
            }
        }
    };
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

    useEffect(() => {
        setPrescriptions([]);
        loadPrescription();
        setPage(1);
    }, [accessToken]);

    const renderFooter = () => {
        return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    };

    const invoice = (id) => {
        setPrescriptions(prevPrescription => prevPrescription.filter(prescription => prescription.id !== id));
    };

    const handleRefresh = () => {
        setPage(1);
        setPrescriptions([]);
        loadPrescription();
    }

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                <Text style={styles.itemText}>Cuộc hẹn: {item.appointment.id}</Text>
                <Text style={styles.itemText}>Khoa: {item.appointment.department}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Bệnh nhân: {item.appointment.patient.id}</Text>
                <Text style={styles.itemText}>{item.appointment.patient.full_name}</Text>
            </View>
            <Text style={styles.itemText}>Email: {item.appointment.patient.email}</Text>
            <View style={styles.row}>
                <Text style={styles.itemText}>Ngày khám: {formatDate(item.appointment.booking_date)}</Text>
                <Text style={styles.itemText}>Giờ khám: {cutLast3Chars(item.appointment.booking_time)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Triệu chứng: {item.description}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Kết luận: {item.conclusion}</Text>
                <Text style={[styles.itemText, { color: COLORS.green }]}> Khám xong</Text>
            </View>
            <CustomButton title="Xuất hóa đơn" onPress={() =>
                navigation.navigate('Thanh toán', {
                    prescriptionId: item.id,
                    isHasMedicineList: item.medicine_list.length > 0,
                    appointmentId: item.appointment.id,
                    onSuccess: () => invoice(item.id)
                })
            } />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={prescriptions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingVertical: 20 }}
                onEndReached={() => { if (page != null) loadPrescription(); }}
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
        justifyContent: 'space-between'
    }
});

export default InvoiceScreen;
