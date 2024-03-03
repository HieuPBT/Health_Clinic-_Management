// screens/HomeScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, Slider, StyleSheet, Dimensions, TouchableOpacity, Image, Pressable } from 'react-native';
import Context from '../Context';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import ArticleList from '../components/ArticleList/ArticleList';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../configs/constants';
// import Styles from '../styles/Styles';
const HomeScreen = ({ navigation }) => {
  const { setAuthenticated, role } = useContext(Context)
  return (
    <>
      <View style={styles.container}>
        <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop index={2}>
          <Image source={require('../assets/images/dat-lich.png')} style={{ width: width, aspectRatio: 16 / 9 }} />
          <Image source={require('../assets/images/bac-si.png')} style={{ width: width, aspectRatio: 16 / 9 }} />
          <Image source={require('../assets/images/trang-thiet-bi.png')} style={{ width: width, aspectRatio: 16 / 9 }} />
          {
            role == 'PATIENT' ?
              <TouchableOpacity onPress={() => { navigation.navigate('Đặt lịch khám') }} style={{width: width, aspectRatio: 16/9}}>
                <Image source={require('../assets/images/dat-lich-ngay.png')}  style={{ width: '100%', height: '100%', resizeMode: 'cover' }} onPress={() => { navigation.navigate('Đặt Lịch Khám') }} />
              </TouchableOpacity> :
              null
          }
        </SwiperFlatList>
      </View>
      <View style={{ flexDirection: 'row', padding: 16, justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: '900' }}>TIN TỨC MỚI NHẤT</Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('Tin tức') }}>
          <Text style={{ fontSize: 15, color: COLORS.green_primary, fontWeight: '900' }}>XEM TẤT CẢ</Text>
          <Icon name='arrow-forward-outline' size={20} color={COLORS.green_primary} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }} onPress={() => navigation.navigate('Tin tức')}>
        <ArticleList />
      </View>
    </>
  );
};
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { backgroundColor: 'white' },
  child: { width: width, justifyContent: 'center' },
  text: { fontSize: width * 0.5, textAlign: 'center' },
});
export default HomeScreen;
