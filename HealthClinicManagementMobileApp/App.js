import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';

import isAuthenticated from './utils/AuthUtils';
import Context from './Context';
import NurseAppNavigator from './navigation/NurseAppNavigator';
import DoctorAppNavigator from './navigation/DoctorAppNavigator';
import API, { endpoints } from './configs/API';
import Toast from 'react-native-toast-message';
import { toastConfig } from './configs/configs';


export default function App() {
  useEffect(() => {
    checkingAuth = async () => {
      const authenticated = await isAuthenticated();
    }
    checkingAuth();
  }, []);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(3); //1: bệnh nhân, 2: y tá, 3: bác sỹ
  const [accessToken, setAccesstoken] = useState();
  const [userData, setUserData] = useState({});
  return (
    <NavigationContainer>
      <Context.Provider value={{ authenticated, setAuthenticated, setRole, setAccesstoken, userData, setUserData, accessToken }}>
        {role == 1 && authenticated ? <AppNavigator /> : authenticated && role == 2 ? <NurseAppNavigator /> : authenticated && role == 3 ? <DoctorAppNavigator /> : <AuthNavigator />}
        <Toast />
      </Context.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  t: {
    fontSize: 50,
    color: 'blue',
    fontWeight: 'bold',
  }
});
