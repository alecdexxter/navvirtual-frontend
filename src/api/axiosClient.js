import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8082/api',
});

// Interceptor: agrega el token JWT a cada request automáticamente
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor: si el token expiró (401), desloguea y manda a login
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;