import axios from "axios";

const host = 'https://hieupbt.pythonanywhere.com'

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
    'available_times': (date, department) => `/api/appointment_available_time/?date=${date}&department=${department}`,

    'prescriptions': '/api/prescription/',
    'invoice': id => `/api/prescription/${id}/invoice/`,
    'medical_history': email => `/api/prescription/patient_prescription/?email=${email}`,
    'medical_history_date_filter': (email, start_date, end_date) => `/api/prescription/patient_prescription/?email=${email}&start_date=${start_date}&end_date=${end_date}`,
    'today_prescription': `/api/prescription/today_prescription/`,

    'create_momo': '/api/momo/create/',
    'query_momo': '/api/momo/query/',

    'create_zalopay': '/api/zalopay/create/',
    'query_zalopay': '/api/zalopay/query/'
}

export const authApi = (accessToken) => axios.create({
    baseURL: host,
    headers: {
        "Authorization": `Bearer ${accessToken}`
    }
})

export default axios.create(
    {
        baseURL: host,
    }
)
