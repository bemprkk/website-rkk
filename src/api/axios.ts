import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://website-rkk-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan token otorisasi ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('bemprkk_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani error global (misal token kedaluwarsa)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token tidak valid atau kedaluwarsa
      sessionStorage.removeItem('bemprkk_admin_token');
      sessionStorage.removeItem('bemprkk_admin_auth');
      // Anda bisa mereload halaman untuk memaksa user kembali ke halaman login
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
