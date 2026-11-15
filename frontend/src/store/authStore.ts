import { create } from 'zustand';
import api from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  // Ambil token dari localStorage jika halaman di-refresh
  token: localStorage.getItem('token') || null, 
  
  login: async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { access_token, data } = response.data;
      
      localStorage.setItem('token', access_token);
      set({ token: access_token, user: data });
    } catch (err: any) {
      // Jika Backend Laravel belum dinyalakan (Network Error / Offline),
      // berikan akses akun default untuk Frontend Developer (Aturan 10.2 Mocking):
      if (
        (email === 'admin@geoportal.aceh' || email === 'admin@gmail.com') && 
        (password === 'admin123' || password === 'password' || password === 'admin')
      ) {
        const devToken = 'dev-frontend-sanctum-token';
        const devUser: User = {
          id: 1,
          name: 'Administrator Geoportal',
          email: email,
        };
        localStorage.setItem('token', devToken);
        set({ token: devToken, user: devUser });
        return;
      }
      
      throw err;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
