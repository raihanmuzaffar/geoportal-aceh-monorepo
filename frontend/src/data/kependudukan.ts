// Sumber: BPS Provinsi Aceh WebAPI, data tahun 2024.
// Dataset ini disinkronkan dari CSV hasil training model BPS 2024.
// Clustering bersifat eksploratif, bukan prediksi atau peringkat wilayah.

export type KependudukanClusterId = 0 | 1 | 2;

export type KependudukanClusterRow = {
  kode: string;
  kabupatenKota: string;
  jumlahPenduduk: number;
  kepadatanPerKm2: number;
  lajuPertumbuhan: number;
  cluster: KependudukanClusterId;
};

export const kependudukanMetadata = {
  algorithm: 'K-Means',
  modelVersion: "2.0.0-bps-2024",
  clusterCount: 3,
  regionCount: 23,
  year: 2024,
  randomState: 42,
  nInit: 50,
  silhouette: 0.401373,
  daviesBouldin: 0.837454,
  calinskiHarabasz: 15.360424,
  meanARI: 1.0,
  features: ["Jumlah penduduk (jiwa)", "Kepadatan penduduk (jiwa/km²)", "Laju pertumbuhan penduduk (%)"],
  source: "Badan Pusat Statistik (BPS) Provinsi Aceh - WebAPI",
  metadataSource: 'ml-service/artifacts/kependudukan/metadata_bps_2024.json',
  dataSource: 'ml-service/data/processed/kependudukan/bps-kependudukan-cluster-2024.csv',
};

export const kependudukanCluster2024: KependudukanClusterRow[] = [
  { kode: "1101", kabupatenKota: "Kabupaten Simeulue", jumlahPenduduk: 98633, kepadatanPerKm2: 48, lajuPertumbuhan: 1.56, cluster: 1 },
  { kode: "1102", kabupatenKota: "Kabupaten Aceh Singkil", jumlahPenduduk: 135684, kepadatanPerKm2: 62, lajuPertumbuhan: 1.81, cluster: 1 },
  { kode: "1103", kabupatenKota: "Kabupaten Aceh Selatan", jumlahPenduduk: 241994, kepadatanPerKm2: 63, lajuPertumbuhan: 1.05, cluster: 0 },
  { kode: "1104", kabupatenKota: "Kabupaten Aceh Tenggara", jumlahPenduduk: 234430, kepadatanPerKm2: 55, lajuPertumbuhan: 1.53, cluster: 0 },
  { kode: "1105", kabupatenKota: "Kabupaten Aceh Timur", jumlahPenduduk: 443638, kepadatanPerKm2: 71, lajuPertumbuhan: 1.26, cluster: 0 },
  { kode: "1106", kabupatenKota: "Kabupaten Aceh Tengah", jumlahPenduduk: 226744, kepadatanPerKm2: 53, lajuPertumbuhan: 1.3, cluster: 0 },
  { kode: "1107", kabupatenKota: "Kabupaten Aceh Barat", jumlahPenduduk: 206822, kepadatanPerKm2: 71, lajuPertumbuhan: 1.0, cluster: 0 },
  { kode: "1108", kabupatenKota: "Kabupaten Aceh Besar", jumlahPenduduk: 428254, kepadatanPerKm2: 144, lajuPertumbuhan: 1.39, cluster: 0 },
  { kode: "1109", kabupatenKota: "Kabupaten Pidie", jumlahPenduduk: 452547, kepadatanPerKm2: 147, lajuPertumbuhan: 1.0, cluster: 0 },
  { kode: "1110", kabupatenKota: "Kabupaten Bireuen", jumlahPenduduk: 459073, kepadatanPerKm2: 241, lajuPertumbuhan: 1.29, cluster: 0 },
  { kode: "1111", kabupatenKota: "Kabupaten Aceh Utara", jumlahPenduduk: 631984, kepadatanPerKm2: 195, lajuPertumbuhan: 1.13, cluster: 0 },
  { kode: "1112", kabupatenKota: "Kabupaten Aceh Barat Daya", jumlahPenduduk: 159187, kepadatanPerKm2: 107, lajuPertumbuhan: 1.4, cluster: 0 },
  { kode: "1113", kabupatenKota: "Kabupaten Gayo Lues", jumlahPenduduk: 106791, kepadatanPerKm2: 19, lajuPertumbuhan: 1.82, cluster: 1 },
  { kode: "1114", kabupatenKota: "Kabupaten Aceh Tamiang", jumlahPenduduk: 309039, kepadatanPerKm2: 158, lajuPertumbuhan: 1.25, cluster: 0 },
  { kode: "1115", kabupatenKota: "Kabupaten Nagan Raya", jumlahPenduduk: 176429, kepadatanPerKm2: 52, lajuPertumbuhan: 1.19, cluster: 0 },
  { kode: "1116", kabupatenKota: "Kabupaten Aceh Jaya", jumlahPenduduk: 99200, kepadatanPerKm2: 26, lajuPertumbuhan: 1.6, cluster: 1 },
  { kode: "1117", kabupatenKota: "Kabupaten Bener Meriah", jumlahPenduduk: 172036, kepadatanPerKm2: 118, lajuPertumbuhan: 1.67, cluster: 1 },
  { kode: "1118", kabupatenKota: "Kabupaten Pidie Jaya", jumlahPenduduk: 166467, kepadatanPerKm2: 155, lajuPertumbuhan: 1.28, cluster: 0 },
  { kode: "1171", kabupatenKota: "Kota Banda Aceh", jumlahPenduduk: 265019, kepadatanPerKm2: 4319, lajuPertumbuhan: 1.16, cluster: 2 },
  { kode: "1172", kabupatenKota: "Kota Sabang", jumlahPenduduk: 43470, kepadatanPerKm2: 284, lajuPertumbuhan: 1.36, cluster: 1 },
  { kode: "1173", kabupatenKota: "Kota Langsa", jumlahPenduduk: 197909, kepadatanPerKm2: 754, lajuPertumbuhan: 1.63, cluster: 2 },
  { kode: "1174", kabupatenKota: "Kota Lhokseumawe", jumlahPenduduk: 200403, kepadatanPerKm2: 1107, lajuPertumbuhan: 1.54, cluster: 2 },
  { kode: "1175", kabupatenKota: "Kota Subulussalam", jumlahPenduduk: 99062, kepadatanPerKm2: 71, lajuPertumbuhan: 2.28, cluster: 1 },
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
