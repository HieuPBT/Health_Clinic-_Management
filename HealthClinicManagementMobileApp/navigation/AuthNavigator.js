import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Đăng nhập" component={LoginScreen}/>
      <Stack.Screen name="Đăng ký" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
