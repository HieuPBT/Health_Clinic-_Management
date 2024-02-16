import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../components/CustomInput/CustomInput';
import CustomButton from '../../components/CustomButton/CustomButton';
import Context from '../../Context';
import axios from 'axios';
import API, { endpoints } from '../../configs/API';

const PrescriptionScreen = ({ route, navigation }) => {
    const { accessToken } = useContext(Context);

    const [symptom, setSymptom] = useState('');
    const [conclusion, setConclusion] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dose, setDose] = useState('');
    const [quantity, setQuantity] = useState('');
    const [instructions, setInstructions] = useState('');
    const [medicineInfoInputVisible, setMedicinesInfoInputVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState();
    const [medicineData, setMedicineData] = useState([]);

    const { patientID } = route.params;
    console.log(patientID);

    // Function to add medicine to the prescription
    const addMedicine = (medicine) => {
        if (!medicines.some(item => item.medicine === medicine.name)) {
            setMedicines([...medicines, { medicine: medicine.name, quantity: quantity, note: instructions, unit: medicine.unit }]);
            // Clear input fields after adding medicine
            setDose('');
        }
        setQuantity('');
        setInstructions('');
    };

    // Dummy data for medicines
    // const medicineData = [
    //     { id: '1', name: 'Medicine 1', unit: 'Viên' },
    //     { id: '2', name: 'Medicine 3', unit: 'Viên' },
    //     { id: '3', name: 'Medicine 4', unit: 'Viên' },
    //     { id: '4', name: 'Medicine 5', unit: 'Viên' },
    //     { id: '5', name: 'Medicine 6', unit: 'Viên' },
    //     { id: '6', name: 'Medicine 7', unit: 'Viên' },
    //     { id: '7', name: 'Medicine 8', unit: 'Viên' },
    //     // Add more medicines here
    // ];
    useEffect(() => {
        const searchMedicine = async () => {
            const res = await API.get(endpoints['medicine'] + '?name=' + searchQuery, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            console.log(res.data);
            setMedicineData(res.data.results);
        }
        if (searchQuery != '')
            searchMedicine();
    }, [searchQuery])

    const renderMedicineItem = ({ item }) => (
        <TouchableOpacity style={styles.medicineItem} onPress={() => { setMedicinesInfoInputVisible(true); setSelectedMedicine(item) }} key={item.id}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );
    const removeMedicine = (index) => {
        const updatedMedicines = [...medicines];
        updatedMedicines.splice(index, 1);
        setMedicines(updatedMedicines);
    };

    const prescribing = () => {
        navigation.navigate('Ra toa')
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.searchInput} placeholder={"Triệu chứng"} onChangeText={(value) => { setSymptom(value) }} value={symptom} />
            <TextInput style={styles.searchInput} placeholder={"Kết luận"} onChangeText={(value) => { setConclusion(value) }} value={conclusion} />
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm thuốc"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}

            />
            {medicineInfoInputVisible && <>
                <Text>{selectedMedicine.name}</Text>
                <View style={styles.medicineDetail}>
                    <View style={styles.medicineQuantity}>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Số lượng"
                            value={quantity}
                            onChangeText={(text) => setQuantity(text)}
                            keyboardType='numeric'
                        />
                    </View>

                    <View style={[styles.note, { paddingHorizontal: 5 }]}>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Ghi chú"
                            value={instructions}
                            onChangeText={(text) => setInstructions(text)}
                        />
                    </View>

                    <View style={{ flex: 0.3 }}>
                        <CustomButton
                            title={"Thêm"}
                            onPress={() => { addMedicine(selectedMedicine); setMedicinesInfoInputVisible(false) }}
                            disabled={quantity ? false : true}
                        />
                    </View>
                </View>
            </>}


            <FlatList
                data={medicineData}
                renderItem={renderMedicineItem}
                keyExtractor={item => item.id}
            />
            <View style={styles.prescription}>
                <Text style={styles.prescriptionTitle}>Toa thuốc - Mã bệnh nhân: {patientID}</Text>
                <Text>Triệu chứng: {symptom}</Text>
                <Text>Kết luận: <Text style={styles.conclusion}>{conclusion}</Text></Text>
                <Text>Danh mục thuốc uống:</Text>
                <View style={styles.medicineDetail}>
                    <Text style={styles.medicineName}>Tên thuốc</Text>
                    <Text style={styles.medicineQuantity}>Số lượng</Text>
                    <Text style={styles.medicineUnit}>Đơn vị</Text>
                    <Text style={styles.button}></Text>
                </View>
                <ScrollView style={{ marginTop: 10 }}>
                    {medicines.map((medicine, index) => (
                        <View key={index}>
                            <View style={styles.medicineDetail}>
                                <Text style={styles.medicineName}>{index + 1}. {medicine.medicine}</Text>
                                <Text style={styles.medicineQuantity}>{medicine.quantity}</Text>
                                <Text style={styles.medicineUnit}>{medicine.unit}</Text>
                                <TouchableOpacity onPress={() => removeMedicine(index)} style={styles.button}>
                                    <Icon name='close' size={20} color={'red'} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.medicineDetail}>
                                <Text style={styles.medicineName}>Ghi chú:</Text>
                                <Text style={styles.note}>{medicine.note}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <CustomButton title={"Ra toa"} onPress={prescribing} style={{ marginTop: 10 }} disabled={symptom && conclusion && medicines ? false : true} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    medicineItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    prescription: {
        marginTop: 20,
        maxHeight: 230
    },
    prescriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    medicineDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    smallInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 7,
        width: '100%',
    },
    medicineName: {
        flex: 0.4,
        textAlign: 'center'
    },
    medicineQuantity: {
        flex: 0.2,
        textAlign: 'center'
    },
    medicineUnit: {
        flex: 0.3,
        textAlign: 'center'
    },
    note: {
        textAlign: 'center',
        fontStyle: 'italic',
        flex: 0.5
    },
    button: {
        flex: 0.1
    },
    conclusion: {
        fontStyle: 'italic',
        fontWeight: '900'
    }
});

export default PrescriptionScreen;
