import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomInput = ({
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  forcusHandle,
  keyboardType,
  editable,
  required,
  blurHandler,
  rightIcon,
  rightIconColor,
  rightIconTouchable = false,
  rightIconHoverHandler,
  rightIconPressOutHandler,
}) => {
  return (
    <Input
      placeholder={placeholder}
      leftIcon={<Icon name={icon} size={24} color="black" />}
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={secureTextEntry}
      onFocus={forcusHandle}
      onPressIn={forcusHandle}
      onBlur={blurHandler}
      keyboardType={keyboardType}
      editable={editable}
      required={required}
      rightIcon={rightIconTouchable ? <TouchableOpacity onPressIn={rightIconHoverHandler} onPressOut={rightIconPressOutHandler}><Icon name={rightIcon} size={24} color={rightIconColor} /></TouchableOpacity> : <Icon name={rightIcon} size={24} color={rightIconColor} />}
    />
  );
};

export default CustomInput;
