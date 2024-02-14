import { TouchableOpacity } from "react-native";
import { COLORS } from "../../configs/configs";

const CustomTabButton = (props) => (
  <TouchableOpacity
    {...props}
    style={
      props.accessibilityState.selected
        ? [props.style, { borderTopColor: COLORS.green_primary, borderTopWidth: 2 }]
        : props.style
    }
  />
);

export default CustomTabButton;
