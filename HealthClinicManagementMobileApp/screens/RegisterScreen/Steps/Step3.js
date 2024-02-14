import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import Styles from '../../../styles/Styles';
import { Image } from 'react-native-elements';
import Styles1 from '../Styles';
import AvatarPicker from '../../../components/AvatarPicker/AvatarPicker';
import CustomButton from '../../../components/CustomButton/CustomButton';
import MyContext from '../Context';
import { COLORS } from '../../../configs/configs';

const Step3 = () => {
  const {avatarSource, setAvatarSource, setStep, logInformation} = useContext(MyContext);
  return (
    <View style={Styles.container}>
      <AvatarPicker title="Chọn ảnh đại diện" setAvatarSource={setAvatarSource} value={avatarSource}/>
      <CustomButton title="Xong" style={Styles1.navBtn} onPress={()=>setStep(4)}/>
      <CustomButton title="Trở về" color={COLORS.dark_green} style={Styles1.navBtn} onPress={()=>setStep(2)}/>
    </View>
  );
};

export default Step3;
