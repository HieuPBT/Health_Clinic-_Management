import UserProfileScreen from "../screens/UserProfileScreen";
import MedicalHistoryScreen from "./MedicalHistoryScreen";
import CustomButton from "../components/CustomButton/CustomButton";
import { ScrollView, View } from "react-native";


const PatientProfileDoctorViewScreen = ({ route, navigation }) => {
    const { patientID, userData } = route.params;

    return (
        <View>
            <ScrollView>
                <UserProfileScreen preview={true} userID={patientID} userDataParam={userData} />
                <MedicalHistoryScreen patientID={patientID} />
            </ScrollView>
            <View style={{padding: 10}} >
                <CustomButton title={"Thoát"} onPress={() => { navigation.navigate('Kê toa') }}/>
            </View>
        </View>
    )
}
export default PatientProfileDoctorViewScreen;
