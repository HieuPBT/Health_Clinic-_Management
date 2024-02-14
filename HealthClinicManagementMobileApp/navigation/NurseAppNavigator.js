// navigation/AppNavigator.js
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ConfirmAppointmentScreen from '../NurseScreens/ConfirmAppointmentScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import InvoiceScreen from '../NurseScreens/InvoiceScreen';



const Tab = createBottomTabNavigator();

const NurseAppNavigator = () => {
	return (
		<Tab.Navigator >
			{/* <Tab.Screen name="Trang Chủ" component={HomeScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size} />
        ),
      }} /> */}
			<Tab.Screen name="Xác nhận lịch hẹn" component={ConfirmAppointmentScreen} options={{
				tabBarIcon: ({ color, size }) => (
					<Icon name="calendar" color={color} size={size} />
				),
			}} />
			<Tab.Screen name="Xuất hóa đơn" component={InvoiceScreen} options={{
				tabBarIcon: ({ color, size }) => (
					<Icon name="receipt" color={color} size={size} />
				),
			}} />
			<Tab.Screen name="Tài Khoản" component={UserProfileScreen} options={{
				tabBarIcon: ({ color, size }) => (
					<Icon name="person" color={color} size={size} />
				),
			}} />
		</Tab.Navigator>
	);
};

export default NurseAppNavigator;
