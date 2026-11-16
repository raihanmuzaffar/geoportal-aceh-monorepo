import { getPublicDomain } from './publicDomains';

export type ServiceCategory = 'peta' | 'analitik' | 'katalog';
export type ServiceAvailability = 'available' | 'partial' | 'unavailable';

export type PublicService = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  categoryLabel: string;
  availability: ServiceAvailability;
  availabilityLabel: string;
  href: string;
  keywords: string[];
  featured?: boolean;
};

const categoryLabels: Record<ServiceCategory, string> = {
  peta: 'Peta Geospasial',
  analitik: 'Analitik Sektoral',
  katalog: 'Katalog Data',
};

export const serviceCategories: {
  id: ServiceCategory | 'semua';
  label: string;
}[] = [
  { id: 'semua', label: 'Semua Layanan' },
  { id: 'peta', label: 'Peta Geospasial' },
  { id: 'analitik', label: 'Analitik Sektoral' },
  { id: 'katalog', label: 'Katalog Data' },
];

function analyticsService(
  slug: string,
  description: string,
  keywords: string[],
): PublicService {
  const domain = getPublicDomain(slug);

  return {
    id: `analitik-${slug}`,
    name: domain?.name ?? slug,
    description,
    category: 'analitik',
    categoryLabel: categoryLabels.analitik,
    availability: domain?.status ?? 'unavailable',
    availabilityLabel: domain?.statusLabel ?? 'Data dan model belum tersedia',
    href: domain?.href ?? `/analitik/${slug}`,
    keywords,
  };
}

export const publicServices: PublicService[] = [
  {
    id: 'webgis',
    name: 'WebGIS Aceh',
    description:
      'Peta interaktif untuk membaca peta dasar Provinsi Aceh, mengganti peta dasar, dan menelusuri wilayah. Lapisan data resmi ditambahkan setelah tersedia.',
    category: 'peta',
    categoryLabel: categoryLabels.peta,
    availability: 'partial',
    availabilityLabel: 'Peta dasar tersedia, layer resmi belum tersedia',
    href: '/webgis',
    keywords: ['peta', 'webgis', 'leaflet', 'openstreetmap', 'esri', 'basemap'],
    featured: true,
  },
  analyticsService(
    'kependudukan',
    'Hasil clustering kependudukan 2024 untuk 23 kabupaten/kota, lengkap dengan tabel dan metadata model.',
    ['penduduk', 'cluster', 'kmeans', 'demografi', 'kepadatan'],
  ),
  analyticsService(
    'kesehatan',
    'Ketersediaan data rumah sakit dan tenaga kesehatan. Model analisis belum dilatih.',
    ['rumah sakit', 'tenaga kesehatan', 'faskes', 'klinik'],
  ),
  analyticsService(
    'pendidikan',
    'Ketersediaan data jumlah sekolah dan anak usia SD yang putus atau tidak sekolah. Model belum dilatih.',
    ['sekolah', 'putus sekolah', 'siswa', 'pendidikan'],
  ),
  analyticsService(
    'pertanian',
    'Ketersediaan data produksi padi per kabupaten/kota. Model analisis belum dilatih.',
    ['padi', 'produksi', 'lahan', 'pertanian'],
  ),
  analyticsService(
    'kebencanaan',
    'Belum ada dataset dan model kebencanaan yang dapat ditampilkan.',
    ['bencana', 'risiko', 'banjir', 'longsor'],
  ),
  {
    id: 'katalog-data',
    name: 'Katalog Data Geospasial',
    description:
      'Temukan dataset geospasial beserta metadata, sumber, periode, dan status ketersediaannya.',
    category: 'katalog',
    categoryLabel: categoryLabels.katalog,
    availability: 'partial',
    availabilityLabel: 'Antarmuka tersedia, dataset menunggu verifikasi',
    href: '/data',
    keywords: ['katalog', 'dataset', 'metadata', 'unduh', 'data'],
  },
];
