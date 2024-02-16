import axios from "axios";

export const endpoints = {
    'login': '/o/token/',
    'user': '/api/user/',
    'current_user': '/api/current_user/',
    'medicine': '/api/medicine/',
}

export default axios.create(
    {
        baseURL: 'https://hieupbt.pythonanywhere.com',
    }
)
