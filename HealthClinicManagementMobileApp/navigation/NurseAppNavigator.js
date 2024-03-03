import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ConfirmAppointmentScreen from '../NurseScreens/ConfirmAppointmentScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import InvoiceScreen from '../NurseScreens/InvoiceScreen';
import CustomTabButton from '../components/CustomBarButton/CustomBarButton';
import ArticleList from '../components/ArticleList/ArticleList';
import PaymentScreen from '../NurseScreens/PaymentScreen';
import MomoQRCode from '../components/MomoQRCode/MomoQRCode';
import ZaloPayQRCode from '../components/ZaloPayQRCode/ZaloPayQRCode';
import UserProfileNavigator from './UserProfileNavigator';



const Tab = createBottomTabNavigator();

const NurseAppNavigator = () => {
	return (
		<Tab.Navigator >
			<Tab.Screen name="Trang Chủ" component={HomeScreen} options={{
				tabBarIcon: ({ color, size }) => (
					<Icon name="home" color={color} size={size} />
				),
			}} />
			<Tab.Screen name="Xác nhận lịch hẹn" component={ConfirmAppointmentScreen} options={{
				tabBarIcon: ({ color, size }) => (
					<Icon name="calendar" color={color} size={size} />
				),
				tabBarButton: CustomTabButton
			}} />
			<Tab.Screen name="Xuất hóa đơn" component={InvoiceScreen} options={{
				tabBarIcon: ({ color, size }) => (
					<Icon name="receipt" color={color} size={size} />
				),
				tabBarButton: CustomTabButton
			}} />
			<Tab.Screen name="Thanh toán" component={PaymentScreen} options={{
				tabBarItemStyle: {
					display: 'none'
				}
			}} />
			<Tab.Screen name="Thanh toán Momo" component={MomoQRCode} options={{
				tabBarItemStyle: {
					display: 'none'
				}
			}} />
			<Tab.Screen name="Thanh toán ZaloPay" component={ZaloPayQRCode} options={{
				tabBarItemStyle: {
					display: 'none'
				}
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

export default NurseAppNavigator;
