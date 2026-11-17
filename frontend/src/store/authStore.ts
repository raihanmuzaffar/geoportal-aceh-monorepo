import { create } from 'zustand';
import api from '../api/axios';
import { IS_DEMO_MODE } from '../config/appMode';

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isInitializing: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const DEMO_SESSION_KEY = 'geoportal-demo-session';

// Mencegah request pemulihan sesi ganda pada React StrictMode.
let initializationPromise: Promise<void> | null = null;

function clearLocalSession() {
  localStorage.removeItem('token');
  localStorage.removeItem(DEMO_SESSION_KEY);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isInitializing: true,

  initialize: () => {
    if (initializationPromise) {
      return initializationPromise;
    }

    initializationPromise = (async () => {
      if (IS_DEMO_MODE) {
        // Sesi demo dipisahkan dari token Sanctum.
        localStorage.removeItem('token');

        try {
          const raw = localStorage.getItem(DEMO_SESSION_KEY);

          const session = raw
            ? JSON.parse(raw) as {
                user?: User;
                token?: string;
              }
            : null;

          if (
            session?.user?.id &&
            session.user.email &&
            session.token
          ) {
            set({
              user: session.user,
              token: session.token,
              isInitializing: false,
            });
            return;
          }
        } catch {
          localStorage.removeItem(DEMO_SESSION_KEY);
        }

        set({
          user: null,
          token: null,
          isInitializing: false,
        });
        return;
      }

      const token = localStorage.getItem('token');

      if (!token) {
        set({
          user: null,
          token: null,
          isInitializing: false,
        });
        return;
      }

      try {
        const response = await api.get('/v1/auth/user');

        // Backend saat ini mengembalikan model user secara langsung.
        // Bentuk envelope juga didukung untuk kompatibilitas.
        const user = (response.data?.data ?? response.data) as User;

        if (
          !user ||
          typeof user.id !== 'number' ||
          !user.email
        ) {
          throw new Error('Respons profil pengguna tidak valid.');
        }

        set({
          user,
          token,
          isInitializing: false,
        });
      } catch {
        clearLocalSession();

        set({
          user: null,
          token: null,
          isInitializing: false,
        });
      }
    })();

    return initializationPromise;
  },

  login: async (email, password) => {
    if (IS_DEMO_MODE) {
      if (!email.trim() || !password) {
        throw new Error('Email dan password wajib diisi.');
      }

      // Login lokal hanya untuk demonstrasi UI.
      // Tidak memberikan role administrator.
      const demoUser: User = {
        id: 1,
        name: email.split('@')[0] || 'Pengguna Demo',
        email,
        role: 'user',
      };

      const demoToken = `demo-session-${Date.now()}`;

      localStorage.removeItem('token');

      localStorage.setItem(
        DEMO_SESSION_KEY,
        JSON.stringify({
          user: demoUser,
          token: demoToken,
        }),
      );

      set({
        user: demoUser,
        token: demoToken,
        isInitializing: false,
      });

      return;
    }

    const response = await api.post('/v1/auth/login', {
      email,
      password,
    });

    const accessToken = response.data?.access_token;
    const user = response.data?.data as User | undefined;

    if (
      typeof accessToken !== 'string' ||
      !accessToken ||
      !user?.id ||
      !user.email
    ) {
      throw new Error('Respons login dari server tidak lengkap.');
    }

    localStorage.setItem('token', accessToken);
    localStorage.removeItem(DEMO_SESSION_KEY);

    set({
      token: accessToken,
      user,
      isInitializing: false,
    });
  },

  logout: async () => {
    const token = get().token;

    if (IS_DEMO_MODE) {
      clearLocalSession();

      set({
        user: null,
        token: null,
        isInitializing: false,
      });

      return;
    }

    try {
      if (token) {
        await api.post('/v1/auth/logout');
      }
    } finally {
      // Sesi browser tetap dibersihkan jika server tidak terjangkau.
      clearLocalSession();

      set({
        user: null,
        token: null,
        isInitializing: false,
      });
    }
  },
}));
