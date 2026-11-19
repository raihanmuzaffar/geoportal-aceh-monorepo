import { create } from 'zustand';
import api from '../api/axios';
import { IS_DEMO_MODE } from '../config/appMode';

export interface WilayahStat {
  wilayah: string;
  penduduk: number;
  faskes: number;
  sekolah: number;
  bencana: number;
}

export interface DashboardStats {
  totalPenduduk: number | null;
  totalKesehatan: number | null;
  totalPendidikan: number | null;
  totalPertanianHa: number | null;
  totalKebencanaan: number | null;
  totalLayerSpasial: number | null;
  totalPengguna: number;
  distribusiWilayah: WilayahStat[];
}

interface DashboardApiResponse {
  status: string;
  message?: string;
  data?: {
    total_pengguna?: number;
    total_penduduk?: number | null;
    total_faskes?: number | null;
    total_sekolah?: number | null;
    total_pertanian_ha?: number | null;
    total_bencana?: number | null;
    total_layer_spasial?: number | null;
    distribusi_wilayah?: WilayahStat[];
  };
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

const fallbackStats: DashboardStats = {
  totalPenduduk: 5452800,
  totalKesehatan: 1420,
  totalPendidikan: 4325,
  totalPertanianHa: 342150,
  totalKebencanaan: 87,
  totalLayerSpasial: 18,
  totalPengguna: 24,
  distribusiWilayah: [
    { wilayah: 'Kota Banda Aceh', penduduk: 260300, faskes: 112, sekolah: 240, bencana: 6 },
    { wilayah: 'Kab. Aceh Besar', penduduk: 425100, faskes: 154, sekolah: 380, bencana: 14 },
    { wilayah: 'Kab. Pidie', penduduk: 440200, faskes: 138, sekolah: 395, bencana: 11 },
    { wilayah: 'Kab. Aceh Utara', penduduk: 615400, faskes: 178, sekolah: 520, bencana: 21 },
    { wilayah: 'Kab. Aceh Tengah', penduduk: 220500, faskes: 85, sekolah: 210, bencana: 16 },
    { wilayah: 'Kota Lhokseumawe', penduduk: 195200, faskes: 74, sekolah: 175, bencana: 4 },
  ],
};

function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });

    if (IS_DEMO_MODE) {
      set({
        stats: fallbackStats,
        isLoading: false,
        error: null,
      });
      return;
    }

    try {
      const response = await api.get<DashboardApiResponse>(
        '/v1/dashboard',
        { timeout: 10000 }
      );

      const payload = response.data;
      const data = payload?.data;

      if (
        payload?.status !== 'success'
        || !data
        || typeof data.total_pengguna !== 'number'
      ) {
        throw new Error(
          payload?.message || 'Format respons dashboard dari server tidak valid.'
        );
      }

      const stats: DashboardStats = {
        totalPengguna: data.total_pengguna,
        totalPenduduk: nullableNumber(data.total_penduduk),
        totalKesehatan: nullableNumber(data.total_faskes),
        totalPendidikan: nullableNumber(data.total_sekolah),
        totalPertanianHa: nullableNumber(data.total_pertanian_ha),
        totalKebencanaan: nullableNumber(data.total_bencana),
        totalLayerSpasial: nullableNumber(data.total_layer_spasial),
        distribusiWilayah: Array.isArray(data.distribusi_wilayah)
          ? data.distribusi_wilayah
          : [],
      };

      set({
        stats,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      let message = 'Gagal mengambil statistik dashboard dari server.';

      if (error instanceof Error && error.message) {
        message = error.message;
      }

      set({
        stats: null,
        isLoading: false,
        error: message,
      });
    }
  },
}));
