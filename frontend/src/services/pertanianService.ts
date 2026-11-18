import api from '../api/axios';
import { IS_DEMO_MODE } from '../config/appMode';
import type { PertanianItem, CreatePertanianInput } from './types';
import { loadStoredData, saveStoredData } from './mockStorage';

const STORAGE_KEY = 'geoportal_data_pertanian';

export const initialPertanianData: PertanianItem[] = [
  { id: 1, komoditas: 'Kopi Arabika Gayo', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Aceh Tengah', luas_ha: 48500, produksi_ton: 36200, produktivitas: 0.75, musim_tanam: 'Sep - Jan' },
  { id: 2, komoditas: 'Kopi Arabika Gayo', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Bener Meriah', luas_ha: 42100, produksi_ton: 32800, produktivitas: 0.78, musim_tanam: 'Sep - Jan' },
  { id: 3, komoditas: 'Padi Sawah', jenis_lahan: 'Sawah Irigasi', wilayah: 'Kab. Aceh Besar', luas_ha: 29400, produksi_ton: 165000, produktivitas: 5.61, musim_tanam: 'Rendengan & Gadu' },
  { id: 4, komoditas: 'Padi Sawah', jenis_lahan: 'Sawah Irigasi', wilayah: 'Kab. Pidie', luas_ha: 26800, produksi_ton: 158000, produktivitas: 5.90, musim_tanam: 'Rendengan & Gadu' },
  { id: 5, komoditas: 'Padi Sawah', jenis_lahan: 'Sawah Irigasi', wilayah: 'Kab. Aceh Utara', luas_ha: 38200, produksi_ton: 210000, produktivitas: 5.50, musim_tanam: 'Oktober - Maret' },
  { id: 6, komoditas: 'Kelapa Sawit', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Aceh Tamiang', luas_ha: 34500, produksi_ton: 517500, produktivitas: 15.00, musim_tanam: 'Tahunan' },
  { id: 7, komoditas: 'Kelapa Sawit', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Nagan Raya', luas_ha: 41200, produksi_ton: 659200, produktivitas: 16.00, musim_tanam: 'Tahunan' },
  { id: 8, komoditas: 'Jagung Hibrida', jenis_lahan: 'Tegal / Ladang', wilayah: 'Kab. Aceh Tenggara', luas_ha: 18900, produksi_ton: 113400, produktivitas: 6.00, musim_tanam: 'April - Juli' },
  { id: 9, komoditas: 'Nilam Aceh', jenis_lahan: 'Hortikultura', wilayah: 'Kab. Aceh Jaya', luas_ha: 2400, produksi_ton: 360, produktivitas: 0.15, musim_tanam: 'Januari - Juni' },
  { id: 10, komoditas: 'Kakao Rakyat', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Pidie Jaya', luas_ha: 14600, produksi_ton: 10220, produktivitas: 0.70, musim_tanam: 'Tahunan' },
];

export const pertanianService = {
  async getAll(): Promise<PertanianItem[]> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/pertanian/lands');
        const items = response.data?.data ?? response.data;
        if (Array.isArray(items) && items.length > 0) {
          saveStoredData(STORAGE_KEY, items);
          return items;
        }
      } catch (err) {
        console.warn('API pertanian offline, beralih ke cache data pertanian Aceh:', err);
      }
    }
    return loadStoredData<PertanianItem>(STORAGE_KEY, initialPertanianData);
  },

  async getById(id: number): Promise<PertanianItem | null> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get(`/pertanian/lands/${id}`);
        return (response.data?.data ?? response.data) as PertanianItem;
      } catch (err) {
        console.warn(`API lahan pertanian getById(${id}) gagal:`, err);
      }
    }
    const current = loadStoredData<PertanianItem>(STORAGE_KEY, initialPertanianData);
    return current.find((item) => item.id === id) || null;
  },

  async create(input: CreatePertanianInput): Promise<PertanianItem> {
    const luas = input.luas_ha > 0 ? input.luas_ha : 1;
    const produktivitas =
      input.produktivitas !== undefined
        ? input.produktivitas
        : Number(((input.produksi_ton || 0) / luas).toFixed(2));

    const payload: PertanianItem = {
      id: Date.now(),
      ...input,
      produktivitas,
    };

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.post('/pertanian/lands', payload);
        const created = (response.data?.data ?? response.data) as PertanianItem;
        if (created?.id) {
          const list = loadStoredData<PertanianItem>(STORAGE_KEY, initialPertanianData);
          saveStoredData(STORAGE_KEY, [created, ...list]);
          return created;
        }
      } catch (err) {
        console.warn('Gagal POST API pertanian, fallback lokal:', err);
      }
    }

    const list = loadStoredData<PertanianItem>(STORAGE_KEY, initialPertanianData);
    const updatedList = [payload, ...list];
    saveStoredData(STORAGE_KEY, updatedList);
    return payload;
  },

  async update(id: number, input: Partial<PertanianItem>): Promise<PertanianItem> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.put(`/pertanian/lands/${id}`, input);
        const updated = (response.data?.data ?? response.data) as PertanianItem;
        if (updated?.id) {
          const list = loadStoredData<PertanianItem>(STORAGE_KEY, initialPertanianData);
          saveStoredData(
            STORAGE_KEY,
            list.map((item) => (item.id === id ? { ...item, ...updated } : item))
          );
          return updated;
        }
      } catch (err) {
        console.warn(`Gagal PUT API pertanian/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<PertanianItem>(STORAGE_KEY, initialPertanianData);
    let updatedItem: PertanianItem | null = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        const luas = (input.luas_ha ?? item.luas_ha) > 0 ? (input.luas_ha ?? item.luas_ha) : 1;
        const prod = input.produksi_ton ?? item.produksi_ton;
        const produktivitas = Number((prod / luas).toFixed(2));

        updatedItem = {
          ...item,
          ...input,
          produktivitas: input.produktivitas ?? produktivitas,
        };
        return updatedItem;
      }
      return item;
    });

    saveStoredData(STORAGE_KEY, updatedList);
    if (!updatedItem) throw new Error('Data pertanian tidak ditemukan.');
    return updatedItem;
  },

  async delete(id: number): Promise<boolean> {
    if (!IS_DEMO_MODE) {
      try {
        await api.delete(`/pertanian/lands/${id}`);
      } catch (err) {
        console.warn(`Gagal DELETE API pertanian/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<PertanianItem>(STORAGE_KEY, initialPertanianData);
    saveStoredData(
      STORAGE_KEY,
      list.filter((item) => item.id !== id)
    );
    return true;
  },
};
