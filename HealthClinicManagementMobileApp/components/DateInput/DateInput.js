import React, { useState } from 'react';
import { TextInput } from 'react-native';

const DateInput = () => {
  const [date, setDate] = useState('');

  const handleDateChange = (inputDate) => {
    const cleanedDate = inputDate.nativeEvent.text.replace(/[^0-9]/g, '');

    // Validate the length of cleanedDate
    if (cleanedDate.length === 0) {
      setDate(cleanedDate);
      return;
    }

    let formattedDate = '';
    if (cleanedDate.length <= 2) {
      // Validate day
      const day = parseInt(cleanedDate, 10);
      if (day > 0 && day <= 31) {
        formattedDate = cleanedDate;
      }
    } else if (cleanedDate.length <= 4) {
      // Validate month and day
      const month = parseInt(cleanedDate.slice(0, 2), 10);
      const day = parseInt(cleanedDate.slice(2), 10);
      if (month > 0 && month <= 12 && day > 0 && day <= 31) {
        formattedDate = cleanedDate.slice(0, 2) + '/' + cleanedDate.slice(2);
      }
    } else {
      // Validate year, month, and day
      const year = parseInt(cleanedDate.slice(4), 10);
      const month = parseInt(cleanedDate.slice(0, 2), 10);
      const day = parseInt(cleanedDate.slice(2, 4), 10);
      if (
        year >= 1900 &&
        year <= new Date().getFullYear() &&
        month > 0 &&
        month <= 12 &&
        day > 0 &&
        day <= new Date(year, month, 0).getDate()
      ) {
        formattedDate =
          cleanedDate.slice(0, 2) +
          '/' +
          cleanedDate.slice(2, 4) +
          '/' +
          cleanedDate.slice(4);
      }
    }

    setDate(formattedDate);
  };

  return (
    <TextInput
      type="text"
      value={date}
      maxLength={10}
      placeholder="__/__/____"
      onChange={(inputDate) => handleDateChange(inputDate)}
    />
  );
};

export default DateInput;
