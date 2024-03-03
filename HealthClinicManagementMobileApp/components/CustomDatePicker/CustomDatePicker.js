import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ModalDateTimePicker from 'react-native-modal-datetime-picker';
import Styles from '../../styles/Styles';
import CustomInput from '../CustomInput/CustomInput';
import formatDate from '../../utils/FormatDate';
import formatDate2 from '../../utils/FormatDateFromYMD';



const CustomDatePicker = ({placeholder='Chọn ngày', onChangeDate, value="2000-1-1"}) => {
  const [date, setDate] = useState(formatDate2(value));
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const handleDatePicked = (newDate) => {
    onChangeDate(newDate);
    setDate(formatDate(newDate));
    hideDateTimePicker();
  };

  return (
    <>
      <TouchableOpacity onPress={showDateTimePicker} style={{
        width: '100%',
      }}>
        <CustomInput placeholder={placeholder} icon="calendar" value={date} editable={false}/>
      </TouchableOpacity>
      <ModalDateTimePicker
        isVisible={isDateTimePickerVisible}
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
        date={new Date(value)}
      />
    </>
  );
};



export default CustomDatePicker;
