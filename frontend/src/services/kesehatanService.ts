import api from '../api/axios';
import { IS_DEMO_MODE } from '../config/appMode';
import type { FaskesItem, CreateFaskesInput } from './types';
import { loadStoredData, saveStoredData } from './mockStorage';

const STORAGE_KEY = 'geoportal_data_kesehatan';

export const initialKesehatanData: FaskesItem[] = [
  { id: 1, nama_faskes: 'RSUD dr. Zainoel Abidin', jenis: 'Rumah Sakit', wilayah: 'Kota Banda Aceh', alamat: 'Jl. Tgk Daud Beureueh No. 108', kapasitas_bed: 720, jumlah_dokter: 145, status: 'Aktif', kontak: '0651-34565' },
  { id: 2, nama_faskes: 'RSUD Meuraxa', jenis: 'Rumah Sakit', wilayah: 'Kota Banda Aceh', alamat: 'Jl. Soekarno-Hatta, Mibo', kapasitas_bed: 240, jumlah_dokter: 58, status: 'Aktif', kontak: '0651-44123' },
  { id: 3, nama_faskes: 'RSUD Tgk Chik Ditiro', jenis: 'Rumah Sakit', wilayah: 'Kab. Pidie', alamat: 'Jl. Prof. A. Majid Ibrahim, Sigli', kapasitas_bed: 310, jumlah_dokter: 62, status: 'Aktif', kontak: '0653-21345' },
  { id: 4, nama_faskes: 'RSUD Cut Meutia', jenis: 'Rumah Sakit', wilayah: 'Kab. Aceh Utara', alamat: 'Jl. Banda Aceh-Medan Km. 280', kapasitas_bed: 350, jumlah_dokter: 70, status: 'Aktif', kontak: '0645-46331' },
  { id: 5, nama_faskes: 'RSUD Datu Beru', jenis: 'Rumah Sakit', wilayah: 'Kab. Aceh Tengah', alamat: 'Jl. Qurata Aini No. 153, Takengon', kapasitas_bed: 280, jumlah_dokter: 45, status: 'Aktif', kontak: '0643-21214' },
  { id: 6, nama_faskes: 'Puskesmas Kuta Alam', jenis: 'Puskesmas', wilayah: 'Kota Banda Aceh', alamat: 'Jl. T. Panglima Polem', kapasitas_bed: 15, jumlah_dokter: 8, status: 'Aktif', kontak: '0651-22991' },
  { id: 7, nama_faskes: 'Puskesmas Baiturrahman', jenis: 'Puskesmas', wilayah: 'Kota Banda Aceh', alamat: 'Jl. Teuku Umar No. 45', kapasitas_bed: 10, jumlah_dokter: 6, status: 'Aktif', kontak: '0651-31002' },
  { id: 8, nama_faskes: 'Puskesmas Ingin Jaya', jenis: 'Puskesmas', wilayah: 'Kab. Aceh Besar', alamat: 'Jl. Lambaro-Blang Bintang', kapasitas_bed: 20, jumlah_dokter: 7, status: 'Aktif', kontak: '0651-75512' },
  { id: 9, nama_faskes: 'RSIA Banda Aceh', jenis: 'RSIA', wilayah: 'Kota Banda Aceh', alamat: 'Jl. Prof. A. Majid Ibrahim I', kapasitas_bed: 160, jumlah_dokter: 32, status: 'Aktif', kontak: '0651-21287' },
  { id: 10, nama_faskes: 'Klinik Pratama Sehat Bersama', jenis: 'Klinik Pratama', wilayah: 'Kota Lhokseumawe', alamat: 'Jl. Merdeka No. 88', kapasitas_bed: 8, jumlah_dokter: 4, status: 'Aktif', kontak: '0645-41221' },
];

export const kesehatanService = {
  async getAll(): Promise<FaskesItem[]> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get('/kesehatan/facilities');
        const items = response.data?.data ?? response.data;
        if (Array.isArray(items) && items.length > 0) {
          saveStoredData(STORAGE_KEY, items);
          return items;
        }
      } catch (err) {
        console.warn('API kesehatan offline, beralih ke cache faskes Aceh:', err);
      }
    }
    return loadStoredData<FaskesItem>(STORAGE_KEY, initialKesehatanData);
  },

  async getById(id: number): Promise<FaskesItem | null> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.get(`/kesehatan/facilities/${id}`);
        return (response.data?.data ?? response.data) as FaskesItem;
      } catch (err) {
        console.warn(`API faskes getById(${id}) gagal:`, err);
      }
    }
    const current = loadStoredData<FaskesItem>(STORAGE_KEY, initialKesehatanData);
    return current.find((item) => item.id === id) || null;
  },

  async create(input: CreateFaskesInput): Promise<FaskesItem> {
    const payload: FaskesItem = {
      id: Date.now(),
      ...input,
    };

    if (!IS_DEMO_MODE) {
      try {
        const response = await api.post('/kesehatan/facilities', payload);
        const created = (response.data?.data ?? response.data) as FaskesItem;
        if (created?.id) {
          const list = loadStoredData<FaskesItem>(STORAGE_KEY, initialKesehatanData);
          saveStoredData(STORAGE_KEY, [created, ...list]);
          return created;
        }
      } catch (err) {
        console.warn('Gagal POST API kesehatan, fallback lokal:', err);
      }
    }

    const list = loadStoredData<FaskesItem>(STORAGE_KEY, initialKesehatanData);
    const updatedList = [payload, ...list];
    saveStoredData(STORAGE_KEY, updatedList);
    return payload;
  },

  async update(id: number, input: Partial<FaskesItem>): Promise<FaskesItem> {
    if (!IS_DEMO_MODE) {
      try {
        const response = await api.put(`/kesehatan/facilities/${id}`, input);
        const updated = (response.data?.data ?? response.data) as FaskesItem;
        if (updated?.id) {
          const list = loadStoredData<FaskesItem>(STORAGE_KEY, initialKesehatanData);
          saveStoredData(
            STORAGE_KEY,
            list.map((item) => (item.id === id ? { ...item, ...updated } : item))
          );
          return updated;
        }
      } catch (err) {
        console.warn(`Gagal PUT API kesehatan/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<FaskesItem>(STORAGE_KEY, initialKesehatanData);
    let updatedItem: FaskesItem | null = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...input };
        return updatedItem;
      }
      return item;
    });

    saveStoredData(STORAGE_KEY, updatedList);
    if (!updatedItem) throw new Error('Data fasilitas kesehatan tidak ditemukan.');
    return updatedItem;
  },

  async delete(id: number): Promise<boolean> {
    if (!IS_DEMO_MODE) {
      try {
        await api.delete(`/kesehatan/facilities/${id}`);
      } catch (err) {
        console.warn(`Gagal DELETE API kesehatan/${id}, fallback lokal:`, err);
      }
    }

    const list = loadStoredData<FaskesItem>(STORAGE_KEY, initialKesehatanData);
    saveStoredData(
      STORAGE_KEY,
      list.filter((item) => item.id !== id)
    );
    return true;
  },
};
