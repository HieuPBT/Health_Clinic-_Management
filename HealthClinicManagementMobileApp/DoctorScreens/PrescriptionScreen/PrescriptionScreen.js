import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton/CustomButton';
import Context from '../../Context';
import API, { endpoints } from '../../configs/API';
import showSuccessToast from '../../utils/ShowSuccessToast';
import showFailedToast from '../../utils/ShowFailedToast';

const { height } = Dimensions.get('window');

const PrescriptionScreen = ({ route, navigation }) => {
    const { accessToken } = useContext(Context);

    const [symptom, setSymptom] = useState('');
    const [conclusion, setConclusion] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [medicinesToPost, setMedicinesToPost] = useState([]);
    const [medicinesToRender, setMedicinesToRender] = useState([]);
    const [quantity, setQuantity] = useState(null);
    const [instructions, setInstructions] = useState('');
    const [medicineInfoInputVisible, setMedicinesInfoInputVisible] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState();
    const [medicineData, setMedicineData] = useState([]);
    const [isPrescriptionSuccess, setPrescriptionSuccess] = useState(false);

    const { patientID, appointment, onSuccess } = route.params;

    // Function to add medicine to the prescription
    const addMedicine = (medicine) => {
        if (!medicinesToRender.some(item => item.medicine === medicine.name)) {
            setMedicinesToPost([...medicinesToPost, { medicine: medicine.id, quantity: quantity, note: instructions }]);
            setMedicinesToRender([...medicinesToRender, { medicine: medicine.name, quantity: quantity, unit: medicine.unit, note: instructions }])
            // Clear input fields after adding medicine
        }
        setQuantity(null);
        setInstructions('');
    };

    const searchMedicine = async (text) => {
        try {
            const res = await API.get(endpoints['medicine'] + '?name=' + text, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
            setMedicineData(res.data.results);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearchQueryChange = (text) => {
        setSearchQuery(text);
        if (text !== '') {
            searchMedicine(text);
        }
    };

    const renderMedicineItem = ({ item }) => (
        <TouchableOpacity style={styles.medicineItem} onPress={() => { setMedicinesInfoInputVisible(true); setSelectedMedicine(item) }} key={item.id}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );
    const removeMedicine = (index) => {
        let updatedMedicines = [...medicinesToPost];
        updatedMedicines.splice(index, 1);
        setMedicinesToPost(updatedMedicines);

        updatedMedicines = [...medicinesToRender];
        updatedMedicines.splice(index, 1);
        setMedicinesToRender(updatedMedicines);
    };

    const prescribing = async () => {
        const data = {
            "appointment": appointment,
            "description": symptom,
            "conclusion": conclusion,
            "medicine_list": medicinesToPost
        }
        try {
            const res = await API.post(endpoints['prescriptions'], data, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })

            if (res.status === 201) {
                showSuccessToast(`Kê toa thành công! Lịch hẹn ${appointment}`);
                navigation.navigate('Kê toa')
                onSuccess();
            }
        } catch (err) {
            console.log(err);
            showFailedToast('Kê toa thất bại');
            setPrescriptionSuccess(false); // Cập nhật biến isPrescriptionSuccess khi kê toa thất bại
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ height: height * 0.4 }}>
                <TextInput style={styles.searchInput} placeholder={"Triệu chứng"} onChangeText={(value) => { setSymptom(value) }} value={symptom} />
                <TextInput style={styles.searchInput} placeholder={"Kết luận"} onChangeText={(value) => { setConclusion(value) }} value={conclusion} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm thuốc"
                    value={searchQuery}
                    onChangeText={(text) => handleSearchQueryChange(text)}
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
            </View>
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
                    {medicinesToRender.map((medicine, index) => (
                        <View key={index}>
                            <View style={styles.medicineDetail}>
                                <View style={styles.medicineName}>
                                    <Text style={{ alignSelf: 'flex-start' }}>{index + 1}. </Text>
                                    <Text style={{ flex: 1, textAlign: 'center' }}>{medicine.medicine}</Text>
                                </View>
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
            <CustomButton title={"Kê toa"} onPress={prescribing} style={{ marginTop: 10 }} disabled={symptom && conclusion && medicinesToPost ? false : true} />
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
        // marginTop: 20,
        maxHeight: 300
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
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
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
