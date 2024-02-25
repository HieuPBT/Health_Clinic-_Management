import React, { useContext, useEffect, useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import CustomButton from '../CustomButton/CustomButton';
import { Text } from 'react-native-elements';
import formatDate from '../../utils/FormatDate';
import Context from '../../Context';
import API, { endpoints } from '../../configs/API';

// const fullDate = {
//     '2024-02-15': { "selected": true, "selectedColor": "#999", disabled: true },
//     '2024-02-14': { "selected": true, "selectedColor": "#999", disabled: true }
// }
const axios = require('axios');






const AppointmentDatePicker = ({ setDate, btnTitle = "Xác nhận", handleConfirm }) => {
    const [selectedDate, setSelectedDate] = useState({});
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [fullDate, setFullDate] = useState(null);
    const markedDates = {
        ...selectedDate,
        ...fullDate
    };
    const { accessToken } = useContext(Context);

    convertToFullDateArray = (inputArray) => {
        const fullDate = {};
        inputArray.forEach(item => {
            if (item.count > 3)
                fullDate[item.date] = {
                    "selected": true, // Dùng true nếu muốn chọn ngày
                    "selectedColor": "#999", // Màu khi ngày được chọn
                    "disabled": true
                };
        });
        return fullDate;
    }
    useEffect(() => {
        loadCountFullDate = async () => {
            try {
                const res = await API.get(endpoints['appointment_count']);
                setFullDate(convertToFullDateArray(res.data));
            } catch (e) {
                console.log(e);
            }
        }
        loadCountFullDate();
    }, [accessToken]);


    // Xử lý sự kiện khi ngày được chọn
    const handleDayPress = (date) => {
        if (!fullDate[date.dateString]) {
            const selected = selectedDate[date.dateString];
            const updatedDate = { [date.dateString]: { selected: !selected, selectedColor: 'green' } };
            setSelectedDate(updatedDate);
            setDate(date.dateString);
            setDisabledBtn(false);
        }
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
            {fullDate != null ? <Calendar
                markedDates={markedDates}
                onDayPress={handleDayPress}
                minDate={tomorrow.toString()}
                maxDate={maxDate.toString()}
            /> : <ActivityIndicator />}
            <View style={{ padding: 10 }}>
                <CustomButton title={btnTitle} onPress={handleConfirm} disabled={disabledBtn} />
            </View>
        </View>
    );
};

export default AppointmentDatePicker;
