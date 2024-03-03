import MedicalHistoryScreen from "./MedicalHistoryScreen";
import { useEffect, useState } from "react";


const PatientProfileDoctorViewScreen = ({ route, navigation }) => {
    const [patientId, setPatientId] = useState();
    useEffect(() => {
        const { patientID } = route.params;
        setPatientId(patientID);
    }, [route.params])


    return (
        <View style={{flex: 1}}>
            <MedicalHistoryScreen patientID={patientId} navigation={navigation} />
        </View>
    )
}
export default PatientProfileDoctorViewScreen;
