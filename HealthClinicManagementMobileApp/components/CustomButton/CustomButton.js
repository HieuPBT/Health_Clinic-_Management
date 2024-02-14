// /src/components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../configs/configs';
import Styles from './Styles';

const CustomButton = ({ title, onPress, color, width, height, textColor, fsize, style, disabled = false }) => {
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

});

export default CustomButton;
