import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import API, { endpoints } from '../configs/API';
import Context from '../Context';
import formatDate from '../utils/FormatDateFromYMD';
import CustomButton from '../components/CustomButton/CustomButton';

const MedicalHistoryScreen = ({ patientID, isChanged, navigation }) => {
    const { accessToken } = useContext(Context);
    const [medicalHistories, setMedicalHistories] = useState([]);
    console.log(patientID)
    const loadPrescription = async () => {
        try {
            const response = await API.get(endpoints['medical_history'](patientID), {
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            });
            if (response.status == 200) {
                setMedicalHistories(response.data.results);
            }
        } catch (err) {
            console.log(err);
        }

    }
    useEffect(() => {
        loadPrescription()
    }, [patientID])

    const handleRecordPress = (record) => {
        navigation.navigate('ViewMedicalHistoryDetails', { MedicalHistoryData: record, patientID: patientID});
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lịch sử khám</Text>
            {medicalHistories.map((record, index) => (
                <TouchableOpacity
                    style={styles.recordContainer}
                    key={index}
                    onPress={() => handleRecordPress(record)}>
                    <Text style={styles.recordDate}>{formatDate(record.created_date)}</Text>
                    <Text style={styles.recordDiagnosis}>Triệu chứng: {record.description}</Text>
                    <Text style={styles.recordDiagnosis}>Kết luận: {record.conclusion}</Text>
                </TouchableOpacity>
            ))}
            <CustomButton title={"Làm mới"} onPress={loadPrescription} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
