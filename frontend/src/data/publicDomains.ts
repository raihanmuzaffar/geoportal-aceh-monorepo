export type DomainStatus = 'available' | 'partial' | 'unavailable';

export type DomainDetail = {
  label: string;
  value: string;
  featured?: boolean;
};

export type PublicDomain = {
  slug: string;
  name: string;
  status: DomainStatus;
  statusLabel: string;
  summary: string;
  dataLabel: string;
  modelLabel: string;
  datasets: string[];
  sourceNote: string;
  limitation?: string;
  details?: DomainDetail[];
  href: string;
};

export const publicDomains: PublicDomain[] = [
  {
    slug: 'kependudukan',
    name: 'Kependudukan',
    status: 'available',
    statusLabel: 'Hasil clustering tersimpan',
    summary:
      'K-Means membagi 23 kabupaten/kota dari data 2024 ke dalam 3 cluster. Hasil ini berasal dari eksperimen awal, bukan prediksi langsung.',
    dataLabel: 'Hasil clustering 2024',
    modelLabel: 'K-Means, 3 cluster',
    datasets: ['Hasil clustering kependudukan 2024', 'Metadata model K-Means'],
    sourceNote:
      'Sumber: hasil clustering kependudukan 2024 dan metadata model K-Means.',
    limitation:
      'Laju pertumbuhan penduduk pada dataset belum diverifikasi terhadap sumber resmi. Tabel hasil per kabupaten/kota belum ditampilkan pada halaman ini.',
    details: [
      { label: 'Model', value: 'K-Means', featured: true },
      { label: 'Wilayah', value: '23 kabupaten/kota', featured: true },
      { label: 'Cluster', value: '3', featured: true },
      { label: 'Silhouette', value: '0.3366', featured: true },
      { label: 'Random state', value: '42' },
      { label: 'Tahun data', value: '2024' },
    ],
    href: '/analitik/kependudukan',
  },
  {
    slug: 'kesehatan',
    name: 'Kesehatan',
    status: 'partial',
    statusLabel: 'Data mentah tersedia, model belum tersedia',
    summary:
      'Dataset jumlah rumah sakit dan jumlah tenaga kesehatan tersedia. Model analisis belum dilatih.',
    dataLabel: 'Data mentah',
    modelLabel: 'Belum tersedia',
    datasets: ['Jumlah rumah sakit', 'Jumlah tenaga kesehatan'],
    sourceNote: 'Sumber: dataset mentah kesehatan pada repositori layanan analitik.',
    limitation:
      'Model belum tersedia. Halaman ini akan menampilkan analisis setelah model dilatih.',
    href: '/analitik/kesehatan',
  },
  {
    slug: 'pendidikan',
    name: 'Pendidikan',
    status: 'partial',
    statusLabel: 'Data mentah tersedia, model belum tersedia',
    summary:
      'Dataset jumlah sekolah dan jumlah anak usia SD yang putus atau tidak sekolah di desa tersedia. Model analisis belum dilatih.',
    dataLabel: 'Data mentah',
    modelLabel: 'Belum tersedia',
    datasets: [
      'Jumlah sekolah',
      'Jumlah anak usia SD yang putus atau tidak sekolah di desa',
    ],
    sourceNote:
      'Sumber: dataset mentah pendidikan pada repositori layanan analitik.',
    limitation:
      'Model belum tersedia. Halaman ini akan menampilkan analisis setelah model dilatih.',
    href: '/analitik/pendidikan',
  },
  {
    slug: 'pertanian',
    name: 'Pertanian',
    status: 'partial',
    statusLabel: 'Data mentah tersedia, model belum tersedia',
    summary: 'Dataset produksi padi tersedia. Model analisis belum dilatih.',
    dataLabel: 'Data mentah',
    modelLabel: 'Belum tersedia',
    datasets: ['Produksi padi'],
    sourceNote: 'Sumber: dataset mentah pertanian pada repositori layanan analitik.',
    limitation:
      'Model belum tersedia. Halaman ini akan menampilkan analisis setelah model dilatih.',
    href: '/analitik/pertanian',
  },
  {
    slug: 'kebencanaan',
    name: 'Kebencanaan',
    status: 'unavailable',
    statusLabel: 'Data dan model belum tersedia',
    summary:
      'Belum ada dataset kebencanaan dan model analisis. Tidak ada peta zona rawan, skor, atau prediksi yang ditampilkan.',
    dataLabel: 'Belum tersedia',
    modelLabel: 'Belum tersedia',
    datasets: [],
    sourceNote: 'Tidak ada dataset kebencanaan pada repositori saat ini.',
    limitation:
      'Halaman ini tidak menampilkan peta zona rawan, skor, atau prediksi sampai dataset tersedia.',
    href: '/analitik/kebencanaan',
  },
];

export function getPublicDomain(slug: string) {
  return publicDomains.find((domain) => domain.slug === slug);
}
