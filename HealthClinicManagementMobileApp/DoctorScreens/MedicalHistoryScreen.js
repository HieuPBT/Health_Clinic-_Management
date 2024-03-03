import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import API, { authApi, endpoints } from '../configs/API';
import Context from '../Context';
import formatDate from '../utils/FormatDateFromYMD';
import FooterLoading from '../components/FooterLoading/FooterLoading';
import RefreshButton from '../components/RefreshButton/RefreshButton';

const MedicalHistoryScreen = ({ route, navigation }) => {
    const { accessToken, role } = useContext(Context);
    const { email, startDate, endDate } = route.params;
    const [medicalHistories, setMedicalHistories] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);



    const loadPrescription = async () => {
        setLoading(true);
        if (!(startDate && endDate)) {
            try {
                const response = await authApi(accessToken).get(`${endpoints['medical_history'](email)}&page=${page}`);
                if (response.data.next == null) {
                    setPage(null);
                } else {
                    setPage(page + 1);
                }
                setMedicalHistories([...medicalHistories, ...response.data.results]);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        else {
            try {
                const response = await authApi(accessToken).get(`${endpoints['medical_history_date_filter'](email, startDate, endDate)}&page=${page}`);
                console.log(email, startDate, endDate)
                if (response.data.next == null) {
                    setPage(null);
                } else {
                    setPage(page + 1);
                }
                setMedicalHistories([...medicalHistories, ...response.data.results]);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
    };


    useEffect(() => {
        setPage(1);
        setMedicalHistories([]);
        loadPrescription();
    }, [email, route.params]);

    const handleRefresh = () => {
        setPage(1);
        setMedicalHistories([]);
        loadPrescription();
    }

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => <RefreshButton callback={handleRefresh} />,
    //     });
    // }, [navigation]);

    const handleRecordPress = (record) => {
        navigation.navigate('ViewMedicalHistoryDetails', { MedicalHistoryData: record, email: email, navigation: navigation });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.recordContainer}
            onPress={() => handleRecordPress(item)}>
            <Text style={styles.recordDate}>{formatDate(item.created_date)}</Text>
            <Text style={styles.recordDiagnosis}>Triệu chứng: {item.description}</Text>
            <Text style={styles.recordDiagnosis}>Kết luận: {item.conclusion}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={medicalHistories}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={page !== null ? loadPrescription : null}
                onEndReachedThreshold={0.1}
                ListFooterComponent={loading ? () => <FooterLoading /> : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    recordContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    recordDate: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    recordDiagnosis: {
        fontSize: 16,
        marginBottom: 5,
    },
    recordPrescription: {
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '900'
    }
});

export default MedicalHistoryScreen;
