import UserProfileScreen from "../screens/UserProfileScreen";
import MedicalHistoryScreen from "./MedicalHistoryScreen";
import CustomButton from "../components/CustomButton/CustomButton";
import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";


const PatientProfileDoctorViewScreen = ({ route, navigation }) => {
    const [patientId, setPatientId] = useState();
    const [userInfo, setUserInfo] = useState(route.params.userData);
    useEffect(() => {
        const { patientID, userData } = route.params;
        setPatientId(patientID);
        setUserInfo(userData);
    }, [route.params])


    return (
        <View>
            <ScrollView>
                <UserProfileScreen preview={true} userID={patientId} userDataParam={userInfo} />
                <MedicalHistoryScreen patientID={patientId} navigation={navigation}/>
            </ScrollView>
            <View style={{ padding: 10 }} >
                <CustomButton title={"Thoát"} onPress={() => { navigation.navigate('Kê toa') }} />
            </View>
        </View>
    )
}
export default PatientProfileDoctorViewScreen;
