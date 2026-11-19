// Sumber: ml-service/data/processed/kependudukan/hasil_cluster_kependudukan_2024.csv
// Nilai disalin apa adanya dari CSV. Nama Kabupaten Aceh Barat Daya diperbaiki
// dari salah ketik "Kabupatan" pada CSV sumber.

export type KependudukanClusterId = 0 | 1 | 2;

export type KependudukanClusterRow = {
  kode: string;
  kabupatenKota: string;
  pendudukRibu: number;
  kepadatanPerKm2: number;
  lajuPertumbuhan: number;
  cluster: KependudukanClusterId;
};

export const kependudukanMetadata = {
  algorithm: 'K-Means',
  clusterCount: 3,
  regionCount: 23,
  year: 2024,
  randomState: 42,
  silhouette: 0.3366,
  features: [
    'Jumlah penduduk',
    'Kepadatan penduduk per km2',
    'Laju pertumbuhan penduduk per tahun',
  ],
  source:
    'ml-service/data/processed/kependudukan/hasil_cluster_kependudukan_2024.csv',
  metadataSource:
    'ml-service/artifacts/kependudukan/metadata.json',
};

export const kependudukanCluster2024: KependudukanClusterRow[] = [
  { kode: '1101', kabupatenKota: 'Kabupaten Simeulue', pendudukRibu: 98.6, kepadatanPerKm2: 48, lajuPertumbuhan: 15.6, cluster: 2 },
  { kode: '1102', kabupatenKota: 'Kabupaten Aceh Singkil', pendudukRibu: 135.7, kepadatanPerKm2: 62, lajuPertumbuhan: 18.1, cluster: 2 },
  { kode: '1103', kabupatenKota: 'Kabupaten Aceh Selatan', pendudukRibu: 242.0, kepadatanPerKm2: 63, lajuPertumbuhan: 10.5, cluster: 0 },
  { kode: '1104', kabupatenKota: 'Kabupaten Aceh Tenggara', pendudukRibu: 234.4, kepadatanPerKm2: 55, lajuPertumbuhan: 15.5, cluster: 2 },
  { kode: '1105', kabupatenKota: 'Kabupaten Aceh Timur', pendudukRibu: 443.6, kepadatanPerKm2: 71, lajuPertumbuhan: 12.5, cluster: 0 },
  { kode: '1106', kabupatenKota: 'Kabupaten Aceh Tengah', pendudukRibu: 206.3, kepadatanPerKm2: 53, lajuPertumbuhan: 1.3, cluster: 0 },
  { kode: '1107', kabupatenKota: 'Kabupaten Aceh Barat', pendudukRibu: 206.7, kepadatanPerKm2: 71, lajuPertumbuhan: 1.0, cluster: 0 },
  { kode: '1108', kabupatenKota: 'Kabupaten Aceh Besar', pendudukRibu: 428.3, kepadatanPerKm2: 144, lajuPertumbuhan: 13.9, cluster: 0 },
  { kode: '1109', kabupatenKota: 'Kabupaten Pidie', pendudukRibu: 453.2, kepadatanPerKm2: 147, lajuPertumbuhan: 1.0, cluster: 0 },
  { kode: '1110', kabupatenKota: 'Kabupaten Bireuen', pendudukRibu: 459.1, kepadatanPerKm2: 241, lajuPertumbuhan: 12.9, cluster: 0 },
  { kode: '1111', kabupatenKota: 'Kabupaten Aceh Utara', pendudukRibu: 742.7, kepadatanPerKm2: 195, lajuPertumbuhan: 11.3, cluster: 0 },
  { kode: '1112', kabupatenKota: 'Kabupaten Aceh Barat Daya', pendudukRibu: 159.2, kepadatanPerKm2: 107, lajuPertumbuhan: 1.4, cluster: 0 },
  { kode: '1113', kabupatenKota: 'Kabupaten Gayo Lues', pendudukRibu: 106.6, kepadatanPerKm2: 99, lajuPertumbuhan: 18.2, cluster: 2 },
  { kode: '1114', kabupatenKota: 'Kabupaten Aceh Tamiang', pendudukRibu: 304.0, kepadatanPerKm2: 158, lajuPertumbuhan: 12.5, cluster: 0 },
  { kode: '1115', kabupatenKota: 'Kabupaten Nagan Raya', pendudukRibu: 176.9, kepadatanPerKm2: 52, lajuPertumbuhan: 12.1, cluster: 2 },
  { kode: '1116', kabupatenKota: 'Kabupaten Aceh Jaya', pendudukRibu: 94.7, kepadatanPerKm2: 26, lajuPertumbuhan: 1.6, cluster: 0 },
  { kode: '1117', kabupatenKota: 'Kabupaten Bener Meriah', pendudukRibu: 172.0, kepadatanPerKm2: 118, lajuPertumbuhan: 16.7, cluster: 2 },
  { kode: '1118', kabupatenKota: 'Kabupaten Pidie Jaya', pendudukRibu: 166.5, kepadatanPerKm2: 155, lajuPertumbuhan: 12.8, cluster: 2 },
  { kode: '1171', kabupatenKota: 'Kota Banda Aceh', pendudukRibu: 265.0, kepadatanPerKm2: 4319, lajuPertumbuhan: 11.6, cluster: 1 },
  { kode: '1172', kabupatenKota: 'Kota Sabang', pendudukRibu: 43.5, kepadatanPerKm2: 1454, lajuPertumbuhan: 11.6, cluster: 2 },
  { kode: '1173', kabupatenKota: 'Kota Langsa', pendudukRibu: 198.4, kepadatanPerKm2: 754, lajuPertumbuhan: 16.3, cluster: 2 },
  { kode: '1174', kabupatenKota: 'Kota Lhokseumawe', pendudukRibu: 200.4, kepadatanPerKm2: 1107, lajuPertumbuhan: 22.8, cluster: 2 },
  { kode: '1175', kabupatenKota: 'Kota Subulussalam', pendudukRibu: 100.1, kepadatanPerKm2: 107, lajuPertumbuhan: 22.8, cluster: 2 },
];

export function summarizeClusters(rows: KependudukanClusterRow[]) {
  const counts = new Map<KependudukanClusterId, number>();

  for (const row of rows) {
    counts.set(row.cluster, (counts.get(row.cluster) ?? 0) + 1);
  }

  return ([0, 1, 2] as KependudukanClusterId[]).map((cluster) => ({
    cluster,
    count: counts.get(cluster) ?? 0,
  }));
}
