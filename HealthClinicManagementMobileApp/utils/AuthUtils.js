import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import Context from '../Context';
import API, { endpoints } from '../configs/API';

const isAuthenticated = async () => {
  const { setAccesstoken, setUserData } = useContext(Context);
  try {
    const userToken = await AsyncStorage.getItem('access_token');
    const res = await API.get(endpoints['current_user'], {
      headers: {
        'Authorization': 'bearer ' + userToken
      }
    });
    if (res.status == 200) {
      setAccesstoken(userToken);
      setUserData(res.data);
      setRole(res.data.role);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export default isAuthenticated;
