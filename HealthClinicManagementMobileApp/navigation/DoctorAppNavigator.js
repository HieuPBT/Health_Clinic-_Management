import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Auth from '../components/auth/Auth';
import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen/AppointmentScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import DoctorAllAppointmentScreen from '../DoctorScreens/DoctorAllAppointmentScreen';
import SearchPatientScreen from '../DoctorScreens/SearchPatientScreen';
import CustomTabButton from '../components/CustomBarButton/CustomBarButton';
import PrescriptionScreen from '../DoctorScreens/PrescriptionScreen/PrescriptionScreen';
import PatientProfileDoctorViewScreen from '../DoctorScreens/PatientProfileDoctorViewScreen';



const Tab = createBottomTabNavigator();

const DoctorAppNavigator = () => {
  return (
    <Tab.Navigator >
      <Tab.Screen name="Trang Chủ" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
      <Tab.Screen name='Ra toa' component={DoctorAllAppointmentScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="receipt" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
      <Tab.Screen name="Tra bệnh án" component={SearchPatientScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="documents" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
      <Tab.Screen name="Tài Khoản" component={UserProfileScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
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
    </Tab.Navigator>
  );
};

export default DoctorAppNavigator;
