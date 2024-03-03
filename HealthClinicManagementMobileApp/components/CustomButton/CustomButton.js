// /src/components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../configs/constants';
import Styles from './Styles';
import Icon from 'react-native-vector-icons/Ionicons'

const CustomButton = ({ title, onPress, color, width, height, textColor, fsize, style, disabled = false, icon }) => {
  const buttonStyle = {
    backgroundColor: disabled? '#999': color || COLORS.green_primary,
    width: width || '100%',
    height: height || 45,
  };

  const titleStyle = {
    color: textColor || 'white',
    fontSize: fsize || 16
  };

  return (
    <TouchableOpacity style={[Styles.button, buttonStyle, style]} onPress={onPress} disabled={disabled}>
      <Text style={[Styles.buttonText, titleStyle]}>{title}</Text>
      <Text style={[Styles.buttonText, titleStyle]}>
        <Icon name={icon} size={22}/>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

});

export default CustomButton;
