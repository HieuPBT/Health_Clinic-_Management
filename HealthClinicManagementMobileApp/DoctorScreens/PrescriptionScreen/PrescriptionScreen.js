import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../components/CustomInput/CustomInput';

const PrescriptionScreen = () => {
    const [symptom, setSymptom] = useState('');
    const [conclusion, setConclusion] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dose, setDose] = useState('');
    const [quantity, setQuantity] = useState('');
    const [instructions, setInstructions] = useState('');

    // Function to add medicine to the prescription
    const addMedicine = (medicine) => {
        setMedicines([...medicines, { medicine: medicine.name, quantity: quantity, note: instructions, unit: medicine.unit}]);
        // Clear input fields after adding medicine
        setDose('');
        setQuantity('');
        setInstructions('');
    };

    // Dummy data for medicines
    const medicineData = [
        { id: '1', name: 'Medicine 1', unit: 'Viên' },
        { id: '2', name: 'Medicine 3', unit: 'Viên' },
        { id: '3', name: 'Medicine 4', unit: 'Viên' },
        { id: '4', name: 'Medicine 5', unit: 'Viên' },
        { id: '5', name: 'Medicine 6', unit: 'Viên' },
        { id: '6', name: 'Medicine 7', unit: 'Viên' },
        { id: '7', name: 'Medicine 8', unit: 'Viên' },
        // Add more medicines here
    ];

    // Function to render each medicine item
    const renderMedicineItem = ({ item }) => (
        <TouchableOpacity style={styles.medicineItem} onPress={() => addMedicine(item)}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );
    const removeMedicine = (index) => {
        const updatedMedicines = [...medicines];
        updatedMedicines.splice(index, 1);
        setMedicines(updatedMedicines);
    };

    return (
        <View style={styles.container}>
            {/* Input fields for symptom and conclusion */}
            <CustomInput placeholder={"Triệu chứng"} onChangeText={(value) => { setSymptom(value) }} value={symptom} />
            <CustomInput placeholder={"Kết luận"} onChangeText={(value) => { setConclusion(value) }} value={conclusion} />

            {/* Search input for medicines */}
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm thuốc"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />

            <TextInput
                style={styles.smallInput}
                placeholder="Số lượng"
                value={quantity}
                onChangeText={(text) => setQuantity(text)}
            />
            <TextInput
                style={styles.smallInput}
                placeholder="Ghi chú"
                value={instructions}
                onChangeText={(text) => setInstructions(text)}
            />

            {/* FlatList to display medicines */}
            <FlatList
                data={medicineData.filter(medicine => medicine.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={renderMedicineItem}
                keyExtractor={item => item.id}
            />

            {/* Display the prescription */}
            <View style={styles.prescription}>
                <Text style={styles.prescriptionTitle}>Toa thuốc</Text>
                <Text>Triệu chứng: {symptom}</Text>
                <Text>Kết luận: {conclusion}</Text>
                <Text>Danh mục thuốc uống:</Text>
                <View style={styles.medicineDetail}>
                    <Text style={styles.medicineName}>Tên thuốc</Text>
                    <Text style={styles.medicineQuantity}>Số lượng</Text>
                    <Text style={styles.medicineUnit}>Đơn vị</Text>
                    <Text style={styles.button}></Text>
                </View>
                <ScrollView style={{ marginTop: 10 }}>
                    {medicines.map((medicine, index) => (
                        <>
                            <View key={index} style={styles.medicineDetail}>
                                <Text style={styles.medicineName}>{index + 1}. {medicine.medicine}</Text>
                                <Text style={styles.medicineQuantity}>{medicine.quantity}</Text>
                                <Text style={styles.medicineUnit}>{medicine.unit}</Text>
                                <TouchableOpacity onPress={() => removeMedicine(index)} style={styles.button}>
                                    <Icon name='close' size={20} color={'red'} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.note}>{medicine.note}</Text>
                        </>
                    ))}
                </ScrollView>
            </View>
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
        maxHeight: 500
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
        padding: 5,
        marginLeft: 10,
        width: 100,
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
    },
    button: {
        flex: 0.1
    }
});

export default PrescriptionScreen;
