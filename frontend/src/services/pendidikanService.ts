import api from '../api/axios';
import { IS_DEMO_MODE } from '../config/appMode';
import type { SekolahItem, CreateSekolahInput } from './types';
import { loadStoredData, saveStoredData } from './mockStorage';

const STORAGE_KEY = 'geoportal_data_pendidikan';

export const initialPendidikanData: SekolahItem[] = [
  { id: 1, nama_sekolah: 'SMAN 1 Banda Aceh', jenjang: 'SMA/MA', status: 'Negeri', wilayah: 'Kota Banda Aceh', jumlah_siswa: 920, jumlah_guru: 65, akreditasi: 'A' },
  { id: 2, nama_sekolah: 'MAN 1 Model Banda Aceh', jenjang: 'SMA/MA', status: 'Negeri', wilayah: 'Kota Banda Aceh', jumlah_siswa: 850, jumlah_guru: 58, akreditasi: 'A' },
  { id: 3, nama_sekolah: 'SMPN 1 Kota Sigli', jenjang: 'SMP/MTs', status: 'Negeri', wilayah: 'Kab. Pidie', jumlah_siswa: 640, jumlah_guru: 42, akreditasi: 'A' },
  { id: 4, nama_sekolah: 'SMKN 1 Lhokseumawe', jenjang: 'SMK', status: 'Negeri', wilayah: 'Kota Lhokseumawe', jumlah_siswa: 1100, jumlah_guru: 78, akreditasi: 'A' },
  { id: 5, nama_sekolah: 'SDN 1 Ingin Jaya', jenjang: 'SD/MI', status: 'Negeri', wilayah: 'Kab. Aceh Besar', jumlah_siswa: 380, jumlah_guru: 24, akreditasi: 'B' },
  { id: 6, nama_sekolah: 'SMAN 1 Takengon', jenjang: 'SMA/MA', status: 'Negeri', wilayah: 'Kab. Aceh Tengah', jumlah_siswa: 720, jumlah_guru: 48, akreditasi: 'A' },
  { id: 7, nama_sekolah: 'SMA Fatih Bilingual School', jenjang: 'SMA/MA', status: 'Swasta', wilayah: 'Kota Banda Aceh', jumlah_siswa: 310, jumlah_guru: 35, akreditasi: 'A' },
  { id: 8, nama_sekolah: 'Universitas Syiah Kuala', jenjang: 'Perguruan Tinggi', status: 'Negeri', wilayah: 'Kota Banda Aceh', jumlah_siswa: 28500, jumlah_guru: 1650, akreditasi: 'A' },
  { id: 9, nama_sekolah: 'Universitas Malikussaleh', jenjang: 'Perguruan Tinggi', status: 'Negeri', wilayah: 'Kab. Aceh Utara', jumlah_siswa: 19800, jumlah_guru: 820, akreditasi: 'B' },
  { id: 10, nama_sekolah: 'SMP IT Al-Fityan School', jenjang: 'SMP/MTs', status: 'Swasta', wilayah: 'Kab. Aceh Besar', jumlah_siswa: 460, jumlah_guru: 38, akreditasi: 'A' },
];

export const pendidikanService = {
  async getAll(): Promise<SekolahItem[]> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/pendidikan/schools');
        const items = response.data?.data ?? response.data;
        if (Array.isArray(items) && items.length > 0) {
          saveStoredData(STORAGE_KEY, items);
          return items;
        }
      } catch (err) {
        console.warn('API pendidikan offline, beralih ke cache sekolah Aceh:', err);
      }
    }
    return loadStoredData<SekolahItem>(STORAGE_KEY, initialPendidikanData);
  },

  async getById(id: number): Promise<SekolahItem | null> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get(`/pendidikan/schools/${id}`);
        return (response.data?.data ?? response.data) as SekolahItem;
      } catch (err) {
        console.warn(`API sekolah getById(${id}) gagal:`, err);
      }
    }
    const current = loadStoredData<SekolahItem>(STORAGE_KEY, initialPendidikanData);
    return current.find((item) => item.id === id) || null;
  },

  async create(input: CreateSekolahInput): Promise<SekolahItem> {
    const payload: SekolahItem = {
      id: Date.now(),
      ...input,
    };

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.post('/pendidikan/schools', payload);
        const created = (response.data?.data ?? response.data) as SekolahItem;
        if (created?.id) {
          const list = loadStoredData<SekolahItem>(STORAGE_KEY, initialPendidikanData);
          saveStoredData(STORAGE_KEY, [created, ...list]);
          return created;
        }
      } catch (err) {
        console.warn('Gagal POST API pendidikan, fallback lokal:', err);
      }
    }

    const list = loadStoredData<SekolahItem>(STORAGE_KEY, initialPendidikanData);
    const updatedList = [payload, ...list];
    saveStoredData(STORAGE_KEY, updatedList);
    return payload;
  },

  async update(id: number, input: Partial<SekolahItem>): Promise<SekolahItem> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.put(`/pendidikan/schools/${id}`, input);
        const updated = (response.data?.data ?? response.data) as SekolahItem;
        if (updated?.id) {
          const list = loadStoredData<SekolahItem>(STORAGE_KEY, initialPendidikanData);
          saveStoredData(
            STORAGE_KEY,
            list.map((item) => (item.id === id ? { ...item, ...updated } : item))
          );
          return updated;
        }
      } catch (err) {
        console.warn(`Gagal PUT API pendidikan/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<SekolahItem>(STORAGE_KEY, initialPendidikanData);
    let updatedItem: SekolahItem | null = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...input };
        return updatedItem;
      }
      return item;
    });

    saveStoredData(STORAGE_KEY, updatedList);
    if (!updatedItem) throw new Error('Data sekolah tidak ditemukan.');
    return updatedItem;
  },

  async delete(id: number): Promise<boolean> {
    if (!IS_DEMO_MODE) {
      try {
        await api.delete(`/pendidikan/schools/${id}`);
      } catch (err) {
        console.warn(`Gagal DELETE API pendidikan/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<SekolahItem>(STORAGE_KEY, initialPendidikanData);
    saveStoredData(
      STORAGE_KEY,
      list.filter((item) => item.id !== id)
    );
    return true;
  },
};
