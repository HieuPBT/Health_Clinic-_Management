import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import API, { endpoints } from '../configs/API';
import Context from '../Context';
import formatDate from '../utils/FormatDateFromYMD';

const MedicalHistoryScreen = ({ patientID }) => {
    const {accessToken} = useContext(Context);
    // Giả sử dữ liệu lịch sử bệnh án của người dùng
    // const medicalHistory = [
    //     { date: '10/12/2023', diagnosis: 'Cảm', prescription: 'Nghỉ ngơi và uống nhiều nước' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     { date: '05/01/2024', diagnosis: 'Common cold', prescription: 'Over-the-counter cold medication' },
    //     // Thêm các mục lịch sử bệnh án khác ở đây
    // ];
    const [medicalHistories, setMedicalHistories] = useState([]);
    console.log(patientID)
    useEffect(()=>{
        loadPrescription = async()=>{
            try{
                const response = await API.get(`${endpoints['prescriptions']}?patient=${patientID}`, {
                    headers: {
                        Authorization: 'Bearer ' + accessToken
                    }
                });
                if (response.status == 200){
                    setMedicalHistories(response.data.results);
                }
                console.log(response.data.results)
            } catch(err){
                console.log(err);
            }

        }
        loadPrescription()
    },[patientID])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lịch sử khám</Text>
            {medicalHistories.map((record, index) => (
                <TouchableOpacity style={styles.recordContainer} key={index}>
                    <Text style={styles.recordDate}>{formatDate(record.created_date)}</Text>
                    <Text style={styles.recordDiagnosis}>Triệu chứng: {record.description}</Text>
                    <Text style={styles.recordDiagnosis}>Kết luận: {record.conclusion}</Text>
                </TouchableOpacity>
            ))}
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
