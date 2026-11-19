import api from '../api/axios';
import { IS_DEMO_MODE } from '../config/appMode';
import type { PendudukItem, CreatePendudukInput } from './types';
import { loadStoredData, saveStoredData } from './mockStorage';

const STORAGE_KEY = 'geoportal_data_kependudukan';

export const initialKependudukanData: PendudukItem[] = [
  { id: 1, wilayah: 'Kota Banda Aceh', kecamatan: 'Kuta Alam', total_penduduk: 43250, laki_laki: 21800, perempuan: 21450, luas_km2: 10.05, kepadatan: 4303, tahun: 2024 },
  { id: 2, wilayah: 'Kota Banda Aceh', kecamatan: 'Baiturrahman', total_penduduk: 32100, laki_laki: 16200, perempuan: 15900, luas_km2: 4.54, kepadatan: 7070, tahun: 2024 },
  { id: 3, wilayah: 'Kota Banda Aceh', kecamatan: 'Syiah Kuala', total_penduduk: 37400, laki_laki: 18900, perempuan: 18500, luas_km2: 14.24, kepadatan: 2626, tahun: 2024 },
  { id: 4, wilayah: 'Kab. Aceh Besar', kecamatan: 'Darul Imarah', total_penduduk: 55200, laki_laki: 27800, perempuan: 27400, luas_km2: 24.35, kepadatan: 2266, tahun: 2024 },
  { id: 5, wilayah: 'Kab. Aceh Besar', kecamatan: 'Ingin Jaya', total_penduduk: 38900, laki_laki: 19500, perempuan: 19400, luas_km2: 48.00, kepadatan: 810, tahun: 2024 },
  { id: 6, wilayah: 'Kab. Pidie', kecamatan: 'Kota Sigli', total_penduduk: 21500, laki_laki: 10700, perempuan: 10800, luas_km2: 5.15, kepadatan: 4174, tahun: 2024 },
  { id: 7, wilayah: 'Kab. Pidie', kecamatan: 'Mutiara', total_penduduk: 31200, laki_laki: 15400, perempuan: 15800, luas_km2: 27.50, kepadatan: 1134, tahun: 2024 },
  { id: 8, wilayah: 'Kab. Aceh Utara', kecamatan: 'Lhoksukon', total_penduduk: 49800, laki_laki: 24900, perempuan: 24900, luas_km2: 243.00, kepadatan: 205, tahun: 2024 },
  { id: 9, wilayah: 'Kab. Aceh Tengah', kecamatan: 'Lut Tawar', total_penduduk: 19800, laki_laki: 9950, perempuan: 9850, luas_km2: 83.20, kepadatan: 238, tahun: 2024 },
  { id: 10, wilayah: 'Kota Lhokseumawe', kecamatan: 'Banda Sakti', total_penduduk: 78500, laki_laki: 39100, perempuan: 39400, luas_km2: 11.24, kepadatan: 6984, tahun: 2024 },
];

export const kependudukanService = {
  async getAll(): Promise<PendudukItem[]> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/kependudukan/populations');
        const items = response.data?.data ?? response.data;
        if (Array.isArray(items) && items.length > 0) {
          saveStoredData(STORAGE_KEY, items);
          return items;
        }
      } catch (err) {
        console.warn('API kependudukan offline, beralih ke cache data Aceh:', err);
      }
    }
    return loadStoredData<PendudukItem>(STORAGE_KEY, initialKependudukanData);
  },

  async getById(id: number): Promise<PendudukItem | null> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get(`/kependudukan/populations/${id}`);
        return (response.data?.data ?? response.data) as PendudukItem;
      } catch (err) {
        console.warn(`API getById(${id}) gagal:`, err);
      }
    }
    const current = loadStoredData<PendudukItem>(STORAGE_KEY, initialKependudukanData);
    return current.find((item) => item.id === id) || null;
  },

  async create(input: CreatePendudukInput): Promise<PendudukItem> {
    const total = (input.laki_laki || 0) + (input.perempuan || 0);
    const luas = input.luas_km2 > 0 ? input.luas_km2 : 1;
    const kepadatan = Math.round(total / luas);

    const payload: PendudukItem = {
      id: Date.now(),
      ...input,
      total_penduduk: total,
      kepadatan,
    };

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.post('/kependudukan/populations', payload);
        const created = (response.data?.data ?? response.data) as PendudukItem;
        if (created?.id) {
          const list = loadStoredData<PendudukItem>(STORAGE_KEY, initialKependudukanData);
          saveStoredData(STORAGE_KEY, [created, ...list]);
          return created;
        }
      } catch (err) {
        console.warn('Gagal POST API kependudukan, fallback ke penyimpanan lokal:', err);
      }
    }

    const list = loadStoredData<PendudukItem>(STORAGE_KEY, initialKependudukanData);
    const updatedList = [payload, ...list];
    saveStoredData(STORAGE_KEY, updatedList);
    return payload;
  },

  async update(id: number, input: Partial<PendudukItem>): Promise<PendudukItem> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.put(`/kependudukan/populations/${id}`, input);
        const updated = (response.data?.data ?? response.data) as PendudukItem;
        if (updated?.id) {
          const list = loadStoredData<PendudukItem>(STORAGE_KEY, initialKependudukanData);
          saveStoredData(
            STORAGE_KEY,
            list.map((item) => (item.id === id ? { ...item, ...updated } : item))
          );
          return updated;
        }
      } catch (err) {
        console.warn(`Gagal PUT API kependudukan/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<PendudukItem>(STORAGE_KEY, initialKependudukanData);
    let updatedItem: PendudukItem | null = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        const total = (input.laki_laki ?? item.laki_laki) + (input.perempuan ?? item.perempuan);
        const luas = (input.luas_km2 ?? item.luas_km2) > 0 ? (input.luas_km2 ?? item.luas_km2) : 1;
        const kepadatan = Math.round(total / luas);

        updatedItem = {
          ...item,
          ...input,
          total_penduduk: total,
          kepadatan,
        };
        return updatedItem;
      }
      return item;
    });

    saveStoredData(STORAGE_KEY, updatedList);
    if (!updatedItem) throw new Error('Data kependudukan tidak ditemukan.');
    return updatedItem;
  },

  async delete(id: number): Promise<boolean> {
    if (!IS_DEMO_MODE) {
      try {
        await api.delete(`/kependudukan/populations/${id}`);
      } catch (err) {
        console.warn(`Gagal DELETE API kependudukan/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<PendudukItem>(STORAGE_KEY, initialKependudukanData);
    saveStoredData(
      STORAGE_KEY,
      list.filter((item) => item.id !== id)
    );
    return true;
  },
};
