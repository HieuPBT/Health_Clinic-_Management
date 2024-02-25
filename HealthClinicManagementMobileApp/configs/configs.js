import { BaseToast } from "react-native-toast-message";

export const COLORS = {
    green_primary: '#6ec420',
    dark_green: '#2ca291',
    text_color: '#333333',
    light_green: '#90EE90',
    cherry_red: '#b30000',
    green: '#4caf50'
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
    { id: 0, time: '08:30' },
    { id: 1, time: '09:00' },
    { id: 2, time: '09:30' },
    { id: 3, time: '10:00' },
    { id: 4, time: '10:30' },
];

export const afternoonSlots = [
    { id: 5, time: '14:00' },
    { id: 6, time: '14:30' },
    { id: 7, time: '15:00' },
    { id: 8, time: '15:30' },
    { id: 9, time: '16:00' },
];

export const slots = [
    ...morningSlots,
    ...afternoonSlots
]

export const departments = [
    { id: 1, maKhoa: 'OTORHINOLARYNGOLOGY', name: 'TAI MŨI HỌNG', nameDisplay: 'Tai mũi họng' },
    { id: 2, maKhoa: 'OBSTETRICS_GYNECOLOGY', name: 'PHỤ SẢN', nameDisplay: 'Phụ sản' },
    { id: 3, maKhoa: 'DERMATOLOGY', name: 'DA LIỄU', nameDisplay: 'Da liễu' },
    { id: 4, maKhoa: 'PLASTIC_SURGERY', name: 'THẨM MỸ', nameDisplay: 'Thẩm mỹ' },
    { id: 5, maKhoa: 'ORTHOPEDICS', name: 'XƯƠNG KHỚP', nameDisplay: 'Xương khớp' },
    { id: 6, maKhoa: 'OPHTHALMOLOGY', name: 'MẮT', nameDisplay: 'Mắt' },
    { id: 7, maKhoa: 'DENTISTRY', name: 'RĂNG HÀM MẶT', nameDisplay: 'Răng hàm mặt' },
    { id: 8, maKhoa: 'PSYCHIATRY', name: 'TÂM THẦN', nameDisplay: 'Tâm thần' },
    { id: 9, maKhoa: 'TRADITIONAL_MEDICINE', name: 'Y HỌC CỔ TRUYỀN', nameDisplay: 'Y học cổ truyền' },
    { id: 10, maKhoa: 'ENDOCRINOLOGY', name: 'NGOẠI TIẾT', nameDisplay: 'Ngoại tiết' },
];


export const departmentsDictionary = {
    'COSMETIC':'Thẩm mỹ',
    'DERMATOLOGY': 'Da liễu',
};

export const client_id = 'CpgDASZR5IqmLoUL4wejuL38ms2XVvnHJQF6y6Ee';
export const client_secret = 'TlRL74V1RzSpvRut2bIgRM7oTEaECIqb0TNzgLsmu7nrj7eQvq8w3LgRyi19suIJ6HRiedqsKlIPLudbVnJ5KmKn9HS3U24RnOEn0jAwwItAagczvdeNIBmLZMlU8OGC';
