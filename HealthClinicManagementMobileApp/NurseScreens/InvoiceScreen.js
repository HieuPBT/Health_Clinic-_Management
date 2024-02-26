import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import { COLORS } from '../configs/configs';
import Context from '../Context';
import API, { endpoints } from '../configs/API';
import { ActivityIndicator } from 'react-native';

const InvoiceScreen = ({navigation}) => {
    const {accessToken} = useContext(Context);
    const [prescriptions, setPrescriptions] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const loadPrescription = async () => {
        if (page !== null) {
            setLoading(true);
            try {
                const response = await API.get(`${endpoints['my_appointment']}?page=${page}`, {
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                });
                setPrescriptions([...prescriptions, ...response.data.results]);
                console.log(prescriptions)
                setPage(page + 1);
            } catch (error) {
                console.log('Error fetching:', error);
                if (error.response.status === 404) {
                    setPage(null);
                }
            } finally {
                setLoading(false);
            }
        }
    };


    useEffect(() => {
        setPrescriptions([]);
        loadPrescription();
        setPage(1);
    }, [accessToken]);

    // Hàm để hiển thị activity indicator khi đang tải dữ liệu
    const renderFooter = () => {
        return loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    };

    const invoice = (id) => {
        setPrescriptions(prevPrescription => prevPrescription.filter(prescription => prescription.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                <Text style={styles.itemText}>Cuộc hẹn: {item.appointment}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Triệu chứng: {item.description}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.itemText}>Kết luận: {item.conclusion}</Text>
            </View>
            <CustomButton title="Xuất hóa đơn" onPress={() => navigation.navigate('Thanh toán')} />
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
