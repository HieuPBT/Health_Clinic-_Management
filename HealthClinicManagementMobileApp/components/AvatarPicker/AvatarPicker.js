import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native-elements';

const AvatarPicker = ({ title, setAvatarSource, onValueChange, value, avtSize }) => {
    const [avatar, setAvatar] = useState(value);

    const st = {
        avatarContainer: {
            width: avtSize || 300,
            height: avtSize || 300,
            borderRadius: 150,
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarImage: {
            width: avtSize || 300,
            height: avtSize || 300,
            borderRadius: 150,
        },
    }
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            if (setAvatarSource)
                setAvatarSource(result.assets[0].uri)
            if (onValueChange)
                onValueChange(result.assets[0].uri)
            setAvatar(result.assets[0].uri);
        }
        else {
            console.log('canceled');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                <View style={[st.avatarContainer]}>
                    {avatar ? (
                        <Image source={{ uri: avatar }} style={st.avatarImage} />
                    ) : (
                        <Text>{title}</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AvatarPicker;
