import api from '../api/axios';
import { IS_DEMO_MODE } from '../config/appMode';
import type { BencanaItem, CreateBencanaInput } from './types';
import { loadStoredData, saveStoredData } from './mockStorage';

const STORAGE_KEY = 'geoportal_data_kebencanaan';

export const initialBencanaData: BencanaItem[] = [
  { id: 1, jenis_bencana: 'Banjir Luapan', wilayah: 'Kab. Aceh Tenggara', lokasi_detail: 'Kec. Semadam & Bambel', tanggal_kejadian: '2024-10-18', tingkat_dampak: 'Tinggi', warga_terdampak: 1850, status_penanganan: 'Pemulihan' },
  { id: 2, jenis_bencana: 'Tanah Longsor', wilayah: 'Kab. Aceh Tengah', lokasi_detail: 'Jl. Takengon - Isaq Km. 12', tanggal_kejadian: '2024-11-02', tingkat_dampak: 'Tinggi', warga_terdampak: 320, status_penanganan: 'Tanggap Darurat' },
  { id: 3, jenis_bencana: 'Banjir Luapan', wilayah: 'Kab. Aceh Utara', lokasi_detail: 'Kec. Matangkuli & Pirak Timur', tanggal_kejadian: '2024-10-25', tingkat_dampak: 'Tinggi', warga_terdampak: 2450, status_penanganan: 'Pemulihan' },
  { id: 4, jenis_bencana: 'Angin Puting Beliung', wilayah: 'Kota Banda Aceh', lokasi_detail: 'Kec. Ulee Kareng', tanggal_kejadian: '2024-09-14', tingkat_dampak: 'Sedang', warga_terdampak: 65, status_penanganan: 'Selesai' },
  { id: 5, jenis_bencana: 'Gempa Bumi', wilayah: 'Kab. Pidie Jaya', lokasi_detail: 'Kec. Meureudu (M 4.8)', tanggal_kejadian: '2024-08-30', tingkat_dampak: 'Sedang', warga_terdampak: 140, status_penanganan: 'Selesai' },
  { id: 6, jenis_bencana: 'Kebakaran Hutan', wilayah: 'Kab. Aceh Barat', lokasi_detail: 'Kec. Johan Pahlawan (Lahan Gambut)', tanggal_kejadian: '2024-07-22', tingkat_dampak: 'Sedang', warga_terdampak: 80, status_penanganan: 'Selesai' },
  { id: 7, jenis_bencana: 'Tanah Longsor', wilayah: 'Kab. Bener Meriah', lokasi_detail: 'Kec. Pintu Rime Gayo', tanggal_kejadian: '2024-11-08', tingkat_dampak: 'Sedang', warga_terdampak: 95, status_penanganan: 'Tanggap Darurat' },
  { id: 8, jenis_bencana: 'Banjir Luapan', wilayah: 'Kab. Nagan Raya', lokasi_detail: 'Kec. Tripa Makmur', tanggal_kejadian: '2024-10-12', tingkat_dampak: 'Tinggi', warga_terdampak: 1200, status_penanganan: 'Pemulihan' },
  { id: 9, jenis_bencana: 'Angin Puting Beliung', wilayah: 'Kab. Aceh Besar', lokasi_detail: 'Kec. Peukan Bada', tanggal_kejadian: '2024-09-05', tingkat_dampak: 'Rendah', warga_terdampak: 25, status_penanganan: 'Selesai' },
  { id: 10, jenis_bencana: 'Tanah Longsor', wilayah: 'Kab. Aceh Selatan', lokasi_detail: 'Kec. Tapaktuan', tanggal_kejadian: '2024-11-10', tingkat_dampak: 'Sedang', warga_terdampak: 110, status_penanganan: 'Tanggap Darurat' },
];

export const kebencanaanService = {
  async getAll(): Promise<BencanaItem[]> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/kebencanaan/incidents');
        const items = response.data?.data ?? response.data;
        if (Array.isArray(items) && items.length > 0) {
          saveStoredData(STORAGE_KEY, items);
          return items;
        }
      } catch (err) {
        console.warn('API kebencanaan offline, beralih ke cache data bencana Aceh:', err);
      }
    }
    return loadStoredData<BencanaItem>(STORAGE_KEY, initialBencanaData);
  },

  async getById(id: number): Promise<BencanaItem | null> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get(`/kebencanaan/incidents/${id}`);
        return (response.data?.data ?? response.data) as BencanaItem;
      } catch (err) {
        console.warn(`API bencana getById(${id}) gagal:`, err);
      }
    }
    const current = loadStoredData<BencanaItem>(STORAGE_KEY, initialBencanaData);
    return current.find((item) => item.id === id) || null;
  },

  async create(input: CreateBencanaInput): Promise<BencanaItem> {
    const payload: BencanaItem = {
      id: Date.now(),
      ...input,
    };

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.post('/kebencanaan/incidents', payload);
        const created = (response.data?.data ?? response.data) as BencanaItem;
        if (created?.id) {
          const list = loadStoredData<BencanaItem>(STORAGE_KEY, initialBencanaData);
          saveStoredData(STORAGE_KEY, [created, ...list]);
          return created;
        }
      } catch (err) {
        console.warn('Gagal POST API kebencanaan, fallback lokal:', err);
      }
    }

    const list = loadStoredData<BencanaItem>(STORAGE_KEY, initialBencanaData);
    const updatedList = [payload, ...list];
    saveStoredData(STORAGE_KEY, updatedList);
    return payload;
  },

  async update(id: number, input: Partial<BencanaItem>): Promise<BencanaItem> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.put(`/kebencanaan/incidents/${id}`, input);
        const updated = (response.data?.data ?? response.data) as BencanaItem;
        if (updated?.id) {
          const list = loadStoredData<BencanaItem>(STORAGE_KEY, initialBencanaData);
          saveStoredData(
            STORAGE_KEY,
            list.map((item) => (item.id === id ? { ...item, ...updated } : item))
          );
          return updated;
        }
      } catch (err) {
        console.warn(`Gagal PUT API kebencanaan/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<BencanaItem>(STORAGE_KEY, initialBencanaData);
    let updatedItem: BencanaItem | null = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...input };
        return updatedItem;
      }
      return item;
    });

    saveStoredData(STORAGE_KEY, updatedList);
    if (!updatedItem) throw new Error('Data kebencanaan tidak ditemukan.');
    return updatedItem;
  },

  async delete(id: number): Promise<boolean> {
    if (!IS_DEMO_MODE) {
      try {
        await api.delete(`/kebencanaan/incidents/${id}`);
      } catch (err) {
        console.warn(`Gagal DELETE API kebencanaan/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<BencanaItem>(STORAGE_KEY, initialBencanaData);
    saveStoredData(
      STORAGE_KEY,
      list.filter((item) => item.id !== id)
    );
    return true;
  },
};
