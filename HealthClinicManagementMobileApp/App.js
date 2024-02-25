import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'; // Thêm import ActivityIndicator
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import NurseAppNavigator from './navigation/NurseAppNavigator';
import DoctorAppNavigator from './navigation/DoctorAppNavigator';
import API, { endpoints } from './configs/API';
import Toast from 'react-native-toast-message';
import { client_id, client_secret, toastConfig } from './configs/configs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Context from './Context';

export default function App() {
  const [accessToken, setAccesstoken] = useState();
  const [role, setRole] = useState('PATIENT');
  const [userData, setUserData] = useState({});
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading

  const isAuthenticated = async () => {
    const access_token = await AsyncStorage.getItem('access_token');
    const refresh_token = await AsyncStorage.getItem('refresh_token');
    console.log(access_token, refresh_token);
    try {
      const res = await API.get(endpoints['profile'], {
        headers: {
          'Authorization': 'bearer ' + access_token
        }
      });
      setAccesstoken(access_token);
      setUserData(res.data);
      setRole(res.data.role);
      return true;
    } catch (error) {
      console.log('Error checking authentication:', error);
      if (error.response.status === 401 && refresh_token) {
        return await refreshAccessToken(refresh_token);
      }
      return false;
    }
  };

  const refreshAccessToken = async (refresh_token) => {
    try {
      const formData = new FormData();
      formData.append("grant_type", "refresh_token");
      formData.append("client_id", client_id);
      formData.append("client_secret", client_secret);
      formData.append("refresh_token", refresh_token);
      const res = await API.post(endpoints['login'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const newAccessToken = res.data.access_token;
      const newRefreshToken = res.data.refresh_token;
      await AsyncStorage.setItem('access_token', newAccessToken);
      await AsyncStorage.setItem('refresh_token', newRefreshToken);
      setAccesstoken(newAccessToken);
      return true;
    } catch (error) {
      console.log('Error refresh access token:', error);
      return false;
    }
  };

  useEffect(() => {
    const checkingAuth = async () => {
      const res = await isAuthenticated();
      setAuthenticated(res);
      setLoading(false);
    }
    checkingAuth();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Context.Provider value={{ authenticated, setAuthenticated, setRole, setAccesstoken, userData, setUserData, accessToken, role }}>
        {role === 'PATIENT' && authenticated ? <AppNavigator /> : authenticated && role === 'NURSE' ? <NurseAppNavigator /> : authenticated && role === 'DOCTOR' ? <DoctorAppNavigator /> : <AuthNavigator />}
        <Toast />
      </Context.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});
