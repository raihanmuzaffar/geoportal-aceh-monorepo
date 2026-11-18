/**
 * Standard API and Domain Service Types
 * Geoportal Aceh Frontend Architecture
 */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ==========================================
// 1. Kependudukan Domain
// ==========================================
export interface PendudukItem {
  id: number;
  wilayah: string;
  kecamatan: string;
  total_penduduk: number;
  laki_laki: number;
  perempuan: number;
  luas_km2: number;
  kepadatan: number; // jiwa/km2
  tahun: number;
}

export type CreatePendudukInput = Omit<PendudukItem, 'id' | 'kepadatan' | 'total_penduduk'> & {
  total_penduduk?: number;
  kepadatan?: number;
};

// ==========================================
// 2. Kesehatan Domain
// ==========================================
export interface FaskesItem {
  id: number;
  nama_faskes: string;
  jenis: 'Rumah Sakit' | 'Puskesmas' | 'Klinik Pratama' | 'RSIA';
  wilayah: string;
  alamat: string;
  kapasitas_bed: number;
  jumlah_dokter: number;
  status: 'Aktif' | 'Renovasi' | 'Siaga';
  kontak: string;
}

export type CreateFaskesInput = Omit<FaskesItem, 'id'>;

// ==========================================
// 3. Pendidikan Domain
// ==========================================
export interface SekolahItem {
  id: number;
  nama_sekolah: string;
  jenjang: 'SD/MI' | 'SMP/MTs' | 'SMA/MA' | 'SMK' | 'Perguruan Tinggi';
  status: 'Negeri' | 'Swasta';
  wilayah: string;
  jumlah_siswa: number;
  jumlah_guru: number;
  akreditasi: 'A' | 'B' | 'C' | 'Belum Terakreditasi';
}

export type CreateSekolahInput = Omit<SekolahItem, 'id'>;

// ==========================================
// 4. Pertanian Domain
// ==========================================
export interface PertanianItem {
  id: number;
  komoditas: string;
  jenis_lahan: 'Sawah Irigasi' | 'Perkebunan Rakyat' | 'Tegal / Ladang' | 'Hortikultura';
  wilayah: string;
  luas_ha: number;
  produksi_ton: number;
  produktivitas: number; // Ton/Ha
  musim_tanam: string;
}

export type CreatePertanianInput = Omit<PertanianItem, 'id' | 'produktivitas'> & {
  produktivitas?: number;
};

// ==========================================
// 5. Kebencanaan Domain
// ==========================================
export interface BencanaItem {
  id: number;
  jenis_bencana: 'Banjir Luapan' | 'Tanah Longsor' | 'Gempa Bumi' | 'Angin Puting Beliung' | 'Kebakaran Hutan';
  wilayah: string;
  lokasi_detail: string;
  tanggal_kejadian: string;
  tingkat_dampak: 'Tinggi' | 'Sedang' | 'Rendah';
  warga_terdampak: number;
  status_penanganan: 'Tanggap Darurat' | 'Pemulihan' | 'Selesai';
}

export type CreateBencanaInput = Omit<BencanaItem, 'id'>;
