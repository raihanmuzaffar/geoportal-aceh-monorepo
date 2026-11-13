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
    const response = await api.post('/login', { email, password });
    const { access_token, data } = response.data;
    
    localStorage.setItem('token', access_token);
    set({ token: access_token, user: data });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));