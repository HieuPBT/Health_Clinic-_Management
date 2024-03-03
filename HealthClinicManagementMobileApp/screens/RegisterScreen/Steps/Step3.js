import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import Styles from '../../../styles/Styles';
import { Image } from 'react-native-elements';
import Styles1 from '../Styles';
import AvatarPicker from '../../../components/AvatarPicker/AvatarPicker';
import CustomButton from '../../../components/CustomButton/CustomButton';
import MyContext from '../Context';
import { COLORS } from '../../../configs/constants';

const Step3 = () => {
  const { user, setUser, setStep } = useContext(MyContext);
  const setAvatarSource = (avatarSource) => {
    setUser({...user, avatarSource: avatarSource})
  }
  return (
    <View style={Styles.container}>
      <AvatarPicker title="Chọn ảnh đại diện" setAvatarSource={setAvatarSource} value={user.avatarSource} />
      <CustomButton title="Xong" style={Styles1.navBtn} onPress={() => setStep(4)} disabled={!user.avatarSource}/>
      <CustomButton title="Trở về" color={COLORS.dark_green} style={Styles1.navBtn} onPress={() => setStep(2)} />
    </View>
  );
};

export default Step3;
