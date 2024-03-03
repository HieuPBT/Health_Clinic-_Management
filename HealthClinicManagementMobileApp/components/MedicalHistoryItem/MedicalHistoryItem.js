import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../CustomButton/CustomButton";
import { useNavigation } from "@react-navigation/native";

const MedicalHistoryItem = ({ route, navigation }) => {

    try {

        var { MedicalHistoryData, email, isFromPreList } = route.params;
        console.log(isFromPreList);
    } catch (e) {
        console.log(e);
    }

    return (
        <View style={styles.prescription}>
            <Text style={styles.prescriptionTitle}>Toa thuốc</Text>
            <Text style={[MedicalHistoryData.description, styles.text]}>Email bệnh nhân: {email}</Text>
            <Text style={styles.text}>Triệu chứng: {MedicalHistoryData.description}</Text>
            <Text style={styles.text}>Ngày kê toa: {MedicalHistoryData.created_date}</Text>
            <Text style={styles.text}>Kết luận: <Text style={styles.conclusion}>{MedicalHistoryData.conclusion}</Text></Text>
            <Text style={styles.text}>Danh mục thuốc uống:</Text>
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
                                <Text style={[{ alignSelf: 'flex-start' }, styles.text]}>{index + 1}. </Text>
                                <Text style={[{ flex: 1, textAlign: 'center' }, styles.text]}>{medicine.medicine.name}</Text>
                            </View>
                            <Text style={[styles.medicineQuantity, styles.text]}>{medicine.quantity}</Text>
                            <Text style={[styles.medicineUnit, styles.text]}>{medicine.medicine.unit}</Text>
                        </View>
                        <View style={styles.medicineDetail}>
                            <Text style={[styles.medicineName, styles.text]}>Ghi chú:</Text>
                            <Text style={[styles.note, styles.text]}>{medicine.note}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            {/* <CustomButton title={"Trở về"} onPress={() => navigation.jumpTo('MedicalHistoryScreen')} /> */}
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
        justifyContent: 'space-between',
        fontSize: 17
    },
    medicineQuantity: {
        flex: 0.2,
        textAlign: 'center',
        fontSize: 17
    },
    medicineUnit: {
        flex: 0.3,
        textAlign: 'center',
        fontSize: 17
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
    },
    text: {
        fontSize: 17
    }
});

export default MedicalHistoryItem;
