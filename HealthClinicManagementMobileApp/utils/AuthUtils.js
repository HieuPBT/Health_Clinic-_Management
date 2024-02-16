import AsyncStorage from '@react-native-async-storage/async-storage';

const isAuthenticated = async () => {
  try {
    const userToken = await AsyncStorage.getItem('access_token');
    return !!userToken; // Trả về true nếu userToken tồn tại, ngược lại trả về false
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export default isAuthenticated;
