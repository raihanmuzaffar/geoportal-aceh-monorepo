export type DatasetAvailability = 'available' | 'partial' | 'unavailable';

export type Dataset = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  year: number | null;
  region: string | null;
  format: string | null;
  source: string | null;
  availability: DatasetAvailability;
  availabilityLabel: string;
  spatialReference: string | null;
  updateFrequency: string | null;
  metadataUrl: string | null;
  downloadUrl: string | null;
  keywords: string[];
};

/**
 * Dataset resmi yang sudah terverifikasi dan siap dipublikasikan.
 * Biarkan kosong sampai metadata resmi tersedia. Jangan menambahkan
 * contoh atau dataset rekaan ke katalog publik.
 */
export const datasets: Dataset[] = [];

export const datasetAvailabilityOptions: {
  value: DatasetAvailability | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'Semua status' },
  { value: 'available', label: 'Tersedia' },
  { value: 'partial', label: 'Sebagian tersedia' },
  { value: 'unavailable', label: 'Belum tersedia' },
];

export const datasetMetadataFields: { label: string; description: string }[] = [
  { label: 'Sumber', description: 'Instansi atau berkas asal dataset.' },
  { label: 'Tahun', description: 'Periode data yang dipublikasikan.' },
  { label: 'Cakupan wilayah', description: 'Wilayah administratif yang dicakup.' },
  { label: 'Sistem referensi', description: 'Sistem koordinat dan proyeksi peta.' },
  { label: 'Format', description: 'Format berkas atau layanan yang tersedia.' },
  { label: 'Tautan metadata', description: 'Alamat metadata lengkap dan dokumentasi dataset.' },
  { label: 'Pembaruan', description: 'Frekuensi pembaruan metadata dan data.' },
  { label: 'Ketersediaan', description: 'Status akses terhadap data dan berkas unduhan.' },
  { label: 'Batasan', description: 'Catatan penggunaan dan batas ketelitian data.' },
];

export function getDatasetBySlug(slug: string): Dataset | undefined {
  return datasets.find((dataset) => dataset.slug === slug);
}

export type DatasetFilterOptions = {
  categories: string[];
  years: string[];
  formats: string[];
  regions: string[];
};

export function getDatasetFilterOptions(items: Dataset[]): DatasetFilterOptions {
  const uniqueValues = (values: (string | null | undefined)[]) =>
    Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort(
      (a, b) => a.localeCompare(b, 'id'),
    );

  const years = Array.from(
    new Set(items.map((item) => item.year).filter((year): year is number => year !== null)),
  )
    .sort((a, b) => b - a)
    .map(String);

  return {
    categories: uniqueValues(items.map((item) => item.category)),
    years,
    formats: uniqueValues(items.map((item) => item.format)),
    regions: uniqueValues(items.map((item) => item.region)),
  };
}
