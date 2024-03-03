import { useContext } from "react";
import AppointmentDatePicker from "../../../components/AppointmentDatePicker/AppointmentDatePicker";
import AppointmentContext from "../Context";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { View } from "react-native";
import Styles from "../../../styles/Styles";
import { COLORS } from "../../../configs/constants";

const DateSelectionScreen = ({isEditing = false}) => {
    const {setStep, setDate} = useContext(AppointmentContext);
    const handleConfirm = () => {
        setStep(3)
    }
    return (
        <View style={{padding: 20}}>
            <AppointmentDatePicker setDate={setDate} btnTitle={isEditing?"Sửa xong":"Tiếp"} handleConfirm={isEditing?()=>{setStep(4)}:handleConfirm}/>
            <View style={{padding: 10}}>
                <CustomButton title="Trở về" onPress={()=>{setStep(1)}} color={COLORS.dark_green}/>
            </View>
        </View>
    )
}

export default DateSelectionScreen;
