import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import CustomButton from '../../../components/CustomButton/CustomButton';


const SelectionScreen = ({data, title}) => {
  const [selectedItem, setSelectedItem] = useState();

  const handleItemSelect = (Item) => {
    setSelectedItem(Item);
  };
  const handleConfirmationSelect = () => {
    setStep(2);
    setItem(selectedItem);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.ItemItem} onPress={() => handleItemSelect(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Text style={styles.selectedItem}>
        {selectedItem ? selectedItem.name : 'Chưa chọn'}
      </Text>
      <CustomButton title="Tiếp" disabled={!selectedItem} onPress={handleConfirmationSelect}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ItemItem: {
    paddingVertical: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    borderStyle: 'dashed'
  },
  selectedItem: {
    marginVertical: 20,
    fontSize: 20,
  },
});

export default SelectionScreen;
