import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Auth from '../components/auth/Auth';
import HomeScreen from '../screens/HomeScreen';
import AppointmentScreen from '../screens/AppointmentScreen/AppointmentScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import AllAppointmentScreen from '../screens/AllAppointmentScreen/AllAppointmentScreen';
import CustomTabButton from '../components/CustomBarButton/CustomBarButton';



const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator >
      <Tab.Screen name="Trang Chủ" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton,
      }} />
      <Tab.Screen name="Đặt Lịch Khám" component={AppointmentScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="calendar" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
      <Tab.Screen name="Lịch khám của tôi" component={AllAppointmentScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="list" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
      <Tab.Screen name="Tài Khoản" component={UserProfileScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
        tabBarButton: CustomTabButton
      }} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
