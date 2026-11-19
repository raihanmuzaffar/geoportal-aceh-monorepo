import axios from 'axios';
import { IS_DEMO_MODE } from '../config/appMode';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Token demo tidak boleh dikirim ke backend.
  if (!IS_DEMO_MODE) {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tangani respons 403 Forbidden dengan pesan yang jelas
    if (error.response?.status === 403) {
      const serverMessage = error.response?.data?.message;
      const formattedMessage = serverMessage || 'Anda tidak memiliki hak akses untuk melakukan tindakan ini (403 Forbidden).';
      if (error.response?.data) {
        error.response.data.message = formattedMessage;
      }
      console.warn('[RBAC 403]', formattedMessage);
    }

    // Tangani 401 Unauthorized (Sesi kedaluwarsa)
    if (error.response?.status === 401) {
      if (!IS_DEMO_MODE) {
        localStorage.removeItem('token');
      }
      console.warn('[Auth 401] Sesi login telah berakhir.');
    }

    return Promise.reject(error);
  }
);

export default api;
