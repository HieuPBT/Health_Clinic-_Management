import { createDrawerNavigator } from '@react-navigation/drawer';
import InvoiceScreen from '../NurseScreens/InvoiceScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UpdateUserInfoScreen from '../screens/UpdateUserInfoScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import { useContext } from 'react';
import Context from '../Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const UserProfileNavigator = () => {
    const { setAuthenticated } = useContext(Context);
    const handleLogout = async () => {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        setAuthenticated(false);
    }
    const CustomDrawerContent = ({ navigation }) => {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('Thông tin người dùng')}>
                    <Text>Thông tin người dùng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('Cập nhật thông tin cá nhân')}>
                    <Text>Cập nhật thông tin cá nhân</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('Đổi mật khẩu')}>
                    <Text>Đổi mật khẩu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={handleLogout}>
                    <View style={styles.itemText}>
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                        <Text style={[styles.logoutText, {marginLeft: 5}]}>
                            <Icon name={'log-out-outline'} size={17} />
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <Drawer.Navigator drawerContent={CustomDrawerContent}>
            <Drawer.Screen name="Thông tin người dùng" component={UserProfileScreen} />
            <Drawer.Screen name="Đổi mật khẩu" component={ChangePasswordScreen} />
            {/* <Drawer.Screen name="Đăng xuất" component={UserProfileScreen} /> */}
            <Drawer.Screen name="Cập nhật thông tin cá nhân" component={UpdateUserInfoScreen} />
        </Drawer.Navigator>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 30
    },
    drawerItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 15,
    },
    itemText: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    logoutText: {
        color: 'red'
    }
});

export default UserProfileNavigator;
