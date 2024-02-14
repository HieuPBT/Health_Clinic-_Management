import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { COLORS } from '../../configs/configs';

const GenderInput = ({ value, onChange }) => {
  const [selectedGender, setSelectedGender] = useState(value);

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    onChange(gender);
  };

  return (
    <View style={styles.container}>
      <Icon name='transgender' size={24}/>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, selectedGender === 'Nam' && styles.selectedButton]}
          onPress={() => handleGenderChange('Nam')}>
          <Text style={styles.buttonText}>Nam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedGender === 'Nữ' && styles.selectedButton]}
          onPress={() => handleGenderChange('Nữ')}>
          <Text style={styles.buttonText}>Nữ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedGender === 'Khác' && styles.selectedButton]}
          onPress={() => handleGenderChange('Khác')}>
          <Text style={styles.buttonText}>Khác </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  label: {
    marginRight: 10,
    fontSize: 18
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 10
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: COLORS.dark_green,
  },
  buttonText: {
    color: COLORS.text_color,
  },
});

export default GenderInput;
