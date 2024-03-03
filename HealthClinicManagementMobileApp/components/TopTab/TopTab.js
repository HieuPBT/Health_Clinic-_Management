import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../configs/constants';



const TopTab = ({ titlesAndCallbacks }) => {
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);

    const handlePress = (index) => {
        setSelectedButtonIndex(index);
    };
    renderItem = (item, index) => {
        const isSelected = selectedButtonIndex === index;
        return (
            <TouchableOpacity
                style={[styles.button, isSelected && styles.selectedButton]}
                onPress={()=>{item.callback(); handlePress(index)}} key={index}>
                <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {titlesAndCallbacks.map((item, index) => renderItem(item, index))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingVertical: 10,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#d6d6d6',
        borderRadius: 20,
        marginHorizontal: 5,
        color: COLORS.text_color
    },
    selectedButton: {
        backgroundColor: COLORS.green_primary
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    },
});

export default TopTab;
