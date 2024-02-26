import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../CustomButton/CustomButton";

const MedicalHistoryItem = ({route, navigation}) => {

    try{

        var {MedicalHistoryData, patientID} = route.params;
        console.log(MedicalHistoryData);
    } catch(e){
        console.log(e);
    }

    return (
        <View style={styles.prescription}>
            <Text style={styles.prescriptionTitle}>Toa thuốc - Mã bệnh nhân: {patientID}</Text>
            <Text>Triệu chứng: {MedicalHistoryData.description}</Text>
            <Text>Ngày kê toa: {MedicalHistoryData.created_date}</Text>
            <Text>Kết luận: <Text style={styles.conclusion}>{MedicalHistoryData.conclusion}</Text></Text>
            <Text>Danh mục thuốc uống:</Text>
            <View style={styles.medicineDetail}>
                <Text style={styles.medicineName}>Tên thuốc</Text>
                <Text style={styles.medicineQuantity}>Số lượng</Text>
                <Text style={styles.medicineUnit}>Đơn vị</Text>
            </View>
            <ScrollView style={{ marginTop: 10 }}>
                {MedicalHistoryData.medicine_list.map((medicine, index) => (
                    <View key={index}>
                        <View style={styles.medicineDetail}>
                            <View style={styles.medicineName}>
                                <Text style={{ alignSelf: 'flex-start' }}>{index + 1}. </Text>
                                <Text style={{ flex: 1, textAlign: 'center' }}>{medicine.medicine.name}</Text>
                            </View>
                            <Text style={styles.medicineQuantity}>{medicine.quantity}</Text>
                            <Text style={styles.medicineUnit}>{medicine.unit}</Text>
                        </View>
                        <View style={styles.medicineDetail}>
                            <Text style={styles.medicineName}>Ghi chú:</Text>
                            <Text style={styles.note}>{medicine.note}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <CustomButton title={"Trở về"} onPress={()=>navigation.navigate('Kê toa')}/>
        </View>
    )
}

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
        flex: 1,
        padding: 16,
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

export default MedicalHistoryItem;
