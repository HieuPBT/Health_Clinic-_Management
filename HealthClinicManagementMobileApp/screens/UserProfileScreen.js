import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import Context from '../Context';
import formatDate from '../utils/FormatDateFromYMD';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = ({ preview = false, userId, userDataParam, route }) => {
  const { setAuthenticated, accessToken, userData, role } = useContext(Context);
  const changed = route?.params?.changed;
  const [userDataToRender, setUserDataToRender] = useState(userData || userDataParam);
  useEffect(() => {
    setUserDataToRender(userData);
  }, [userData]);
  useEffect(() => {
    if (!preview) {
      setUserDataToRender(userData);
    } else {
      setUserDataToRender(userDataParam);
    }
  }, [accessToken, userDataParam])


  return (
    <>
      {userDataToRender ? <View style={styles.container}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            {userDataToRender['avatar'] != null ? <Image source={{ uri: userDataToRender['avatar'] }} style={styles.avatar} /> : <Image source={require('../assets/images/default_user_avatar.webp')} style={styles.avatar} />}
            {/* {!userDataToRender && <Text style={styles.avatarPlaceholder}>No Avatar</Text>} */}
          </View>
          <Text style={styles.name}>{userDataToRender['full_name']}</Text>

          <View style={styles.wrapper}>
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.value}>{userDataToRender['phone_number']}</Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.label}>Địa chỉ email:</Text>
            <Text style={styles.value}>{userDataToRender['email']}</Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.label}>Ngày sinh:</Text>
            <Text style={styles.value}>{formatDate(userDataToRender['date_of_birth'])}</Text>
          </View>
          <View style={styles.wrapper}>
            <Text style={styles.label}>Giới tính:</Text>
            <Text style={styles.value}>{userDataToRender['gender'] == 'MALE' ? 'Nam' : userDataToRender['gender'] == 'FEMALE' ? 'Nữ' : 'Khác'}</Text>
          </View>
          {userDataToRender.patient ? <View style={styles.wrapper}>
            <Text style={styles.label}>Số bảo hiểm y tế:</Text>
            <Text style={styles.value}>{userDataToRender.patient.health_insurance}</Text>
          </View> : null}
          <View style={styles.wrapper}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.value}>{userDataToRender['address']}</Text>
          </View>
        </View>
      </View> : <ActivityIndicator />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  wrapper: {
    flexDirection: 'row',
    marginTop: 25,
    flex: 0.175
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    fontWeight: '900'
  },
  profileInfo: {
    marginBottom: 5,
    flex: 1
  },
  label: {
    fontWeight: '900',
    flex: 0.4
  },
  value: {
    marginBottom: 5,
    flex: 0.6
    // borderBottomColor: '#999',
    // borderBottomWidth: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    lineHeight: 150,
    textAlign: 'center',
    backgroundColor: '#ccc',
    borderRadius: 75,
    color: '#666',
  },
  name: {
    alignSelf: 'center',
    fontSize: 21,
    fontWeight: '900',
  }
});

export default UserProfileScreen;
