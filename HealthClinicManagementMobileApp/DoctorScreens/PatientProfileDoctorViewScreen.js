import UserProfileScreen from "../screens/UserProfileScreen";
import MedicalHistoryScreen from "./MedicalHistoryScreen";
import CustomButton from "../components/CustomButton/CustomButton";
import { ScrollView, View } from "react-native";


const PatientProfileDoctorViewScreen = ({ route, navigation }) => {
    const { patientID } = route.params;
    return (
        <View>
            <ScrollView>
                <UserProfileScreen preview={true} userID={patientID} />
                <MedicalHistoryScreen patientID={patientID} />
            </ScrollView>
            <CustomButton title={"Thoát"} onPress={() => { navigation.navigate('Ra toa') }} style={{}} />
        </View>
    )
}
export default PatientProfileDoctorViewScreen;
