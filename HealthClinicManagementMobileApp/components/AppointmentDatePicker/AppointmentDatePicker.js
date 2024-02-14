import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomButton from '../CustomButton/CustomButton';
import { Text } from 'react-native-elements';
import formatDate from '../../utils/FormatDate';

const fullDate = {
    '2024-02-15': { "selected": true, "selectedColor": "#999" },
    '2024-02-14': { "selected": true, "selectedColor": "#999", disabled: true }
}

const AppointmentDatePicker = ({ setDate, btnTitle = "Xác nhận", handleConfirm }) => {
    const [selectedDate, setSelectedDate] = useState({});
    const [dateObj, setDateObj] = useState();
    const [disabledBtn, setDisabledBtn] = useState(true);
    const markedDates = {
        ...selectedDate,
        ...fullDate
    };


    // Xử lý sự kiện khi ngày được chọn
    const handleDayPress = (date) => {
        if (!fullDate[date.dateString]) {
            const selected = selectedDate[date.dateString];
            const updatedDate = { [date.dateString]: { selected: !selected, selectedColor: 'green' } };
            setSelectedDate(updatedDate);
            setDateObj(date.dateString);
            setDisabledBtn(false);
        }
    };

    const handleConfirmLocal = () => {
        console.log('Selected Dates:', selectedDate);
        setDate(dateObj);
        handleConfirm();
        // Thực hiện các hành động khác tại đây (ví dụ: gửi dữ liệu đến server)
    };
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date();
    maxDate.setDate(tomorrow.getDate() + 30);
    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', margin: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: 'green', marginRight: 5 }} />
                    <Text style={{ fontSize: 16 }}>Đang chọn</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#999', marginRight: 5 }} />
                    <Text style={{ fontSize: 16 }}>Kín lịch</Text>
                </View>
            </View>
            <Calendar
                markedDates={markedDates}
                onDayPress={handleDayPress}
                minDate={tomorrow.toString()}
                maxDate={maxDate.toString()}
            />
            <View style={{padding: 10}}>
                <CustomButton title={btnTitle} onPress={handleConfirmLocal} disabled={disabledBtn}/>
            </View>
        </View>
    );
};

export default AppointmentDatePicker;
