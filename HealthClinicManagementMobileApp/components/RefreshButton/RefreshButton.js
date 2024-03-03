import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const RefreshButton = ({ callback }) => {
    return (
        <TouchableOpacity onPress={callback}>
            <Text style={{ marginRight: 15 }}>
                <Icon name={'refresh'} size={28} />
            </Text>
        </TouchableOpacity>
    )
}

export default RefreshButton;
