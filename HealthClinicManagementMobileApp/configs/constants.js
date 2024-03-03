import { BaseToast } from "react-native-toast-message";

export const COLORS = {
    green_primary: '#6ec420',
    dark_green: '#2ca291',
    text_color: '#333333',
    light_green: '#90EE90',
    cherry_red: '#b30000',
    green: '#4caf50',
    momo: '#af206f',
    zalo: '#0068ff'
};

export const toastConfig = {
    success: ({ text1, ...rest }) => (
        <BaseToast
            {...rest}
            contentContainerStyle={{ paddingHorizontal: 30 }}
            text1Style={{
                fontSize: 15,
                fontWeight: 'semibold'
            }}
            text1="Thành công"
            leftBorderColor="green"
        />
    )
};

export const morningSlots = [
    { id: 0, time: '07:00' },
    { id: 1, time: '07:30' },
    { id: 2, time: '08:00' },
    { id: 3, time: '08:30' },
    { id: 4, time: '09:00' },
    { id: 5, time: '09:30' },
    { id: 6, time: '10:00' },
    { id: 7, time: '10:30' },
    { id: 8, time: '11:00' },
    { id: 9, time: '11:30' }
];

export const afternoonSlots = [
    { id: 10, time: '13:00' },
    { id: 11, time: '13:30' },
    { id: 12, time: '14:00' },
    { id: 13, time: '14:30' },
    { id: 14, time: '15:00' },
    { id: 15, time: '15:30' },
    { id: 16, time: '16:00' },
    { id: 17, time: '16:30' },
    { id: 18, time: '17:00' },
    { id: 19, time: '17:30' }
];


export const slots = [
    ...morningSlots,
    ...afternoonSlots
]

export const departments = [
    { id: 0, maKhoa: 'OTORHINOLARYNGOLOGY', name: 'TAI MŨI HỌNG', nameDisplay: 'Tai mũi họng' },
    { id: 1, maKhoa: 'DERMATOLOGY', name: 'DA LIỄU', nameDisplay: 'Da liễu' },
    { id: 2, maKhoa: 'PLASTIC_SURGERY', name: 'THẨM MỸ', nameDisplay: 'Thẩm mỹ' },
    { id: 3, maKhoa: 'OPHTHALMOLOGY', name: 'MẮT', nameDisplay: 'Mắt' },
    { id: 4, maKhoa: 'DENTISTRY', name: 'RĂNG HÀM MẶT', nameDisplay: 'Răng hàm mặt' },
];


export const departmentsDictionary = {
    'COSMETIC':'Thẩm mỹ',
    'DERMATOLOGY': 'Da liễu',
};

export const client_id = 'CpgDASZR5IqmLoUL4wejuL38ms2XVvnHJQF6y6Ee';
export const client_secret = 'TlRL74V1RzSpvRut2bIgRM7oTEaECIqb0TNzgLsmu7nrj7eQvq8w3LgRyi19suIJ6HRiedqsKlIPLudbVnJ5KmKn9HS3U24RnOEn0jAwwItAagczvdeNIBmLZMlU8OGC';
