// screens/HomeScreen.js
import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import Context from '../Context';
const HomeScreen = ({ navigation }) => {
  const {setAuthenticated} = useContext(Context)

  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Login Screen"
        onPress={()=>setAuthenticated(false)}
      />
    </View>
  );
};

export default HomeScreen;
