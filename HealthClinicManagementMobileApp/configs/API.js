import axios from "axios";

export const endpoints = {
    'login': '/o/token/',
    'user': '/api/user/',
    'profile': '/api/user/profile/',
    'update_profile': '/api/user/update_profile/',
    'update_password': '/api/user/update_password/',
    'forgot_password': '/api/user/forgot_password/',

    'medicine': '/api/medicine/',

    'appointments': '/api/appointment/',
    'appointment': id => `/api/appointment/${id}/`,
    'confirm_appointment': id => `/api/appointment/${id}/confirm/`,
    'cancel_appointment': id => `/api/appointment/${id}/cancel/`,
    'appointment_count': '/api/appointment_count/',
    'my_appointment': '/api/appointment/patient_appointment/',

    'prescriptions': '/api/prescription/',
    'invoice': id => `/api/prescription/${id}/invoice/`,
    'medical_history': patient_id => `api/prescription/patient_prescription/?patient=${patient_id}`,
    'medical_history_date_filter': (patient_id, start_date, end_date) => `api/prescription/patient_prescription/?patient=${patient_id}&start_date=${start_date}&end_date=${end_date}`,
    'today_medical_history': patient_id => `api/prescription/patient_prescription/?patient=${patient_id}`
}

export default axios.create(
    {
        baseURL: 'https://hieupbt.pythonanywhere.com',
    }
)
