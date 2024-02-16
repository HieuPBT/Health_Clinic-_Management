import React, { useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';
import Context from '../Context';
import formatDate from '../utils/FormatDateFromYMD';
import API, { endpoints } from '../configs/API';

const fakeData = {
  email: "anekngiuenhat@gmail.com",
  name: "Nguyễn Xuân Lộc",
  phoneNumber: "0362655091",
  dateOfBirth: "24/02/2024",
  gender: "Nam",
  avatarSource: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FHealthClinicManagementMobileApp-bd031218-4e1b-4143-a9dc-0fc70f83ab32/ImagePicker/2b0800f9-c5a2-4d95-8a4e-6530be46b1d9.jpeg",
  healthInsurance: "8434848464",
  address: "Gia Lai"
}

const renderItem = () => {
  return (
    <>

    </>
  )
}

const UserProfileScreen = ({preview = false, userId, userData }) => {
  const { setAuthenticated, accessToken, setUserData } = useContext(Context);
  console.log(userData);
  useEffect(()=>{
    console.log(accessToken)
    loadUser = async()=>{
      const res = await API.get(endpoints['current_user'], {
        headers: {
          'Authorization': 'bearer ' + accessToken
        }
      });

      setUserData(res.data);
    }
    if(!preview)
      loadUser();
  },[accessToken])
  try {
  } catch(ex){
    console.error(ex);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Thông tin người dùng</Text>
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          {userData && <Image source={{ uri: userData.avatar }} style={styles.avatar} />}
          {!userData && <Text style={styles.avatarPlaceholder}>No Avatar</Text>}
        </View>
        <Text style={styles.name}>{userData.full_name}</Text>

        <View style={styles.wrapper}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.value}>{userData.phone_number}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Địa chỉ email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Ngày sinh:</Text>
          <Text style={styles.value}>{userData.date_of_birth}</Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.label}>Giới tính:</Text>
          <Text style={styles.value}>{userData.gender}</Text>
        </View>
        {userData.patient?<View style={styles.wrapper}>
          <Text style={styles.label}>Số bảo hiểm y tế:</Text>
          <Text style={styles.value}>{userData.patient.health_insurance}</Text>
        </View>:null}
        <View style={styles.wrapper}>
          <Text style={styles.label}>Địa chỉ:</Text>
          <Text style={styles.value}>{userData.address}</Text>
        </View>
      </View>
      {!preview ? <CustomButton title="Đăng xuất" style={{}} onPress={() => { setAuthenticated(false) }} /> : null}
    </View>
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
