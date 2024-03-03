import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import DoctorAllAppointmentScreen from '../DoctorScreens/DoctorAllAppointmentScreen';
import SearchPatientScreen from '../DoctorScreens/SearchPatientScreen';
import CustomTabButton from '../components/CustomBarButton/CustomBarButton';
import PrescriptionScreen from '../DoctorScreens/PrescriptionScreen/PrescriptionScreen';
import PatientProfileDoctorViewScreen from '../DoctorScreens/PatientProfileDoctorViewScreen';
import ArticleList from '../components/ArticleList/ArticleList';
import MedicalHistoryItem from '../components/MedicalHistoryItem/MedicalHistoryItem';
import MedicalHistoryScreen from '../DoctorScreens/MedicalHistoryScreen';
import UserProfileNavigator from './UserProfileNavigator';



const Tab = createBottomTabNavigator();

const DoctorAppNavigator = () => {
  return (
    <Tab.Navigator >
      <Tab.Screen name="Trang chủ" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
      <Tab.Screen name='Kê toa' component={DoctorAllAppointmentScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="receipt" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
      <Tab.Screen name="Tra bệnh án" component={SearchPatientScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="search" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
      <Tab.Screen name="Prescription" component={PrescriptionScreen} options={{
        tabBarItemStyle: {
          display: 'none'
        },
        title: 'Kê toa',

      }} />
      <Tab.Screen name="ViewMedicalHistory" component={PatientProfileDoctorViewScreen} options={{
        tabBarItemStyle: {
          display: 'none'
        },
        title: 'Lịch sử bệnh án'
      }} />

      <Tab.Screen name="ViewMedicalHistoryDetails" component={MedicalHistoryItem} options={{
        tabBarItemStyle: {
          display: 'none'
        },
        title: 'Chi tiết lịch sử'
      }} />


      <Tab.Screen name="MedicalHistoryScreen" component={MedicalHistoryScreen} options={{
        tabBarItemStyle: {
          display: 'none'
        },
        title: 'Lịch sử khám'
      }} />

      <Tab.Screen name="Tin tức" component={ArticleList} options={{
        tabBarItemStyle: {
          display: 'none'
        }
      }} />
      <Tab.Screen name="Tài khoản" component={UserProfileNavigator} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton,
        headerShown: false
      }} />
    </Tab.Navigator>
  );
};

export default DoctorAppNavigator;
