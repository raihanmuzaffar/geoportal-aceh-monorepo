import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import ClusterDistribution from '../../components/analytics/ClusterDistribution';
import ClusterScatter, {
  type ClusterFilterValue,
} from '../../components/analytics/ClusterScatter';
import { clusterMarkers } from '../../components/analytics/clusterPresentation';
import ButtonLink from '../../components/ui/ButtonLink';
import Reveal from '../../components/ui/Reveal';
import StatusTag from '../../components/ui/StatusTag';
import {
  kependudukanCluster2024,
  kependudukanMetadata,
  type KependudukanClusterId,
  type KependudukanClusterRow,
} from '../../data/kependudukan';

type SortKey =
  | 'kode'
  | 'wilayah'
  | 'penduduk'
  | 'kepadatan'
  | 'laju'
  | 'cluster';

type SortDirection = 'asc' | 'desc';

type SortState = {
  key: SortKey;
  direction: SortDirection;
};

const decimalFormat = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const integerFormat = new Intl.NumberFormat('id-ID');

function formatDecimal(value: number) {
  return decimalFormat.format(value);
}

function formatInteger(value: number) {
  return integerFormat.format(value);
}

function sortValue(row: KependudukanClusterRow, key: SortKey) {
  switch (key) {
    case 'kode':
      return Number(row.kode);
    case 'wilayah':
      return row.kabupatenKota;
    case 'penduduk':
      return row.jumlahPenduduk;
    case 'kepadatan':
      return row.kepadatanPerKm2;
    case 'laju':
      return row.lajuPertumbuhan;
    case 'cluster':
      return row.cluster;
  }
}

function ClusterBadge({ cluster }: { cluster: KependudukanClusterId }) {
  const marker = clusterMarkers[cluster];

  return (
    <span className="inline-flex items-center gap-2 border border-line-strong px-2 py-0.5 text-xs font-semibold text-ink-2">
      <span
        aria-hidden="true"
        className={`block h-2 w-2 ${marker.shapeClass}`}
        style={{ backgroundColor: marker.fill }}
      />
      Cluster {cluster}
    </span>
  );
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
  align = 'left',
}: {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  align?: 'left' | 'right';
}) {
  const active = sort.key === sortKey;
  const SortIcon = active
    ? sort.direction === 'asc'
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <th
      scope="col"
      aria-sort={
        active
          ? sort.direction === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      className="border-b border-line p-0 font-semibold text-ink-2"
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex min-h-11 w-full items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors duration-150 ease-editorial hover:text-ink ${
          align === 'right' ? 'justify-end text-right' : 'text-left'
        }`}
      >
        {label}
        <SortIcon
          aria-hidden="true"
          size={14}
          strokeWidth={1.75}
          className={active ? 'text-forest' : 'text-ink-3'}
        />
      </button>
    </th>
  );
}

export default function AnalyticsKependudukanPage() {
  const [activeCluster, setActiveCluster] =
    useState<ClusterFilterValue>('all');
  const [sort, setSort] = useState<SortState>({
    key: 'kode',
    direction: 'asc',
  });

  const filteredRows = useMemo(
    () =>
      activeCluster === 'all'
        ? kependudukanCluster2024
        : kependudukanCluster2024.filter(
            (row) => row.cluster === activeCluster,
          ),
    [activeCluster],
  );

  const sortedRows = useMemo(() => {
    const multiplier = sort.direction === 'asc' ? 1 : -1;

    return [...filteredRows].sort((a, b) => {
      const aValue = sortValue(a, sort.key);
      const bValue = sortValue(b, sort.key);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue, 'id') * multiplier;
      }

      return (Number(aValue) - Number(bValue)) * multiplier;
    });
  }, [filteredRows, sort]);

  function handleSort(key: SortKey) {
    setSort((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      return {
        key,
        direction: key === 'wilayah' ? 'asc' : 'desc',
      };
    });
  }

  const filterStatus =
    activeCluster === 'all'
      ? `Menampilkan seluruh ${kependudukanCluster2024.length} wilayah.`
      : `Filter Cluster ${activeCluster}: ${filteredRows.length} dari ${kependudukanCluster2024.length} wilayah. Grafik dan tabel memakai filter yang sama.`;

  return (
    <article>
      <div className="container-content py-12 md:py-16 lg:py-24">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-2">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                to="/"
                className="underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                to="/analitik"
                className="underline-offset-4 transition-colors duration-200 ease-editorial hover:underline"
              >
                Analitik
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              Kependudukan
            </li>
          </ol>
        </nav>

        <header className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-ink-2">
              Analitik kependudukan
            </p>
            <h1 className="mt-3 text-3xl text-ink md:text-4xl">
              Hasil clustering kependudukan 2024
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <StatusTag status="available">
                Hasil clustering tersimpan 2024
              </StatusTag>
              <span className="text-sm text-ink-3">
                Data 2024, 23 kabupaten/kota
              </span>
            </div>
            <p className="mt-5 max-w-prose text-lg text-ink-2">
              K-Means membagi 23 kabupaten/kota ke dalam 3 cluster berdasarkan
              jumlah penduduk (jiwa), kepadatan (jiwa/km²), dan laju pertumbuhan (%). Grafik dan tabel
              di bawah memakai CSV hasil clustering yang tersimpan, bukan
              pemanggilan model langsung.
            </p>
          </div>

          <aside
            aria-labelledby="model-summary-heading"
            className="lg:col-span-5"
          >
            <h2
              id="model-summary-heading"
              className="text-sm font-semibold text-ink-2"
            >
              Ringkasan model
            </h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5">
              <div>
                <dt className="text-xs text-ink-3">Model</dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {kependudukanMetadata.algorithm}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Jumlah cluster</dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {kependudukanMetadata.clusterCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Wilayah</dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {kependudukanMetadata.regionCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Silhouette</dt>
                <dd
                  data-numeric
                  className="mt-1 text-base font-semibold text-ink"
                >
                  {kependudukanMetadata.silhouette.toFixed(4)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Tahun data</dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {kependudukanMetadata.year}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-3">Random state</dt>
                <dd className="mt-1 text-base font-semibold text-ink">
                  {kependudukanMetadata.randomState}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink-3">
              Fitur: {kependudukanMetadata.features.join(', ')}.
            </p>
          </aside>
        </header>

        <div className="mt-8 max-w-prose border-l-2 border-earth pl-4">
          <p className="text-sm font-semibold text-ink">Batas hasil</p>
          <p className="mt-2 text-sm text-ink-2">
            Hasil ini merupakan eksperimen clustering eksploratif, bukan
            prediksi langsung. Label cluster merupakan keluaran algoritma
            K-Means, bukan peringkat wilayah atau ukuran kesejahteraan.
            Data bersumber dari BPS Provinsi Aceh WebAPI tahun 2024.
          </p>
        </div>
      </div>

      <section
        aria-labelledby="komposisi-heading"
        className="border-y border-line bg-surface-soft"
      >
        <div className="container-content py-12 md:py-16">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <h2 id="komposisi-heading" className="text-2xl text-ink">
                Komposisi cluster
              </h2>
              <p className="mt-4 text-base text-ink-2">
                Cluster 0 berisi 13 wilayah, Cluster 1 berisi 7 wilayah, dan
                Cluster 2 berisi 3 wilayah. Komposisi ini mengikuti hasil
                clustering dari dataset BPS tahun 2024.
              </p>
              <p className="mt-4 text-xs text-ink-3">
                Angka 0, 1, dan 2 adalah label keluaran model, bukan peringkat.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ClusterDistribution rows={kependudukanCluster2024} />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        aria-labelledby="sebaran-heading"
        className="container-content py-12 md:py-16 lg:py-24"
      >
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="max-w-prose">
              <p className="text-sm font-semibold text-ink-2">Sebaran wilayah</p>
              <h2
                id="sebaran-heading"
                className="mt-3 text-2xl text-ink md:text-3xl"
              >
                Tiga fitur dalam satu pandangan
              </h2>
              <p className="mt-4 text-base text-ink-2">
                Setiap titik adalah satu kabupaten/kota. Posisi mendatar
                menunjukkan kepadatan, posisi tegak menunjukkan laju
                pertumbuhan, dan ukuran titik menunjukkan jumlah penduduk.
              </p>
            </div>

            <div className="mt-6 border border-line bg-surface p-4 md:p-6">
              <ClusterScatter
                rows={kependudukanCluster2024}
                activeCluster={activeCluster}
                onClusterChange={setActiveCluster}
              />
            </div>
          </div>

          <aside aria-labelledby="baca-grafik-heading" className="lg:col-span-4">
            <h2 id="baca-grafik-heading" className="text-xl text-ink">
              Membaca grafik
            </h2>
            <ul className="mt-4 space-y-3 border-y border-line py-5 text-sm text-ink-2">
              <li>
                Warna dan bentuk penanda membedakan cluster. Teks pada legenda
                dan tabel tetap menjadi rujukan utama.
              </li>
              <li>
                Skala log pada sumbu mendatar merentangkan jarak antarnilai
                rendah dan merapatkan nilai tinggi agar pola wilayah tetap
                terbaca.
              </li>
              <li>
                Ukuran titik mengikuti jumlah penduduk, bukan kepadatan atau
                skor model.
              </li>
            </ul>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-ink">
                Kepadatan tertinggi
              </h3>
              <p className="mt-2 text-sm text-ink-2">
                Kota Banda Aceh memiliki kepadatan 4.319 jiwa/km² dan laju
                pertumbuhan 1,16%. Bersama Kota Langsa dan Kota Lhokseumawe,
                Banda Aceh termasuk Cluster 2.
              </p>
            </div>

            <div className="mt-6 border-l-2 border-line-strong pl-4">
              <p className="text-sm text-ink-2">
                Peta cluster tidak ditampilkan karena geometri batas
                administrasi resmi belum tersedia. Tabel di bawah memuat seluruh
                nilai wilayah.
              </p>
            </div>
          </aside>
        </Reveal>
      </section>

      <section
        aria-labelledby="tabel-heading"
        className="border-y border-line bg-surface-soft"
      >
        <div className="container-content py-12 md:py-16 lg:py-24">
          <Reveal>
            <div className="max-w-prose">
              <h2 id="tabel-heading" className="text-2xl text-ink md:text-3xl">
                Hasil per kabupaten/kota
              </h2>
              <p className="mt-4 text-base text-ink-2">
                Klik judul kolom untuk mengurutkan. Filter cluster dari grafik
                di atas juga berlaku pada tabel ini.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-2" role="status">
                {filterStatus}
              </p>
              {activeCluster !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveCluster('all')}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center border border-line-strong bg-surface px-4 text-sm font-semibold text-forest transition-colors duration-200 ease-editorial hover:bg-forest-soft"
                >
                  Tampilkan semua cluster
                </button>
              )}
            </div>

            <div className="mt-6 hidden border-y border-line md:block">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Hasil clustering kependudukan 2024 untuk kabupaten/kota di
                  Aceh. Tabel dapat diurutkan berdasarkan kolom.
                </caption>
                <thead className="bg-surface-soft">
                  <tr>
                    <SortHeader
                      label="Kabupaten/kota"
                      sortKey="wilayah"
                      sort={sort}
                      onSort={handleSort}
                    />
                    <SortHeader
                      label="Penduduk (jiwa)"
                      sortKey="penduduk"
                      sort={sort}
                      onSort={handleSort}
                      align="right"
                    />
                    <SortHeader
                      label="Kepadatan (jiwa/km2)"
                      sortKey="kepadatan"
                      sort={sort}
                      onSort={handleSort}
                      align="right"
                    />
                    <SortHeader
                      label="Laju pertumbuhan (%)"
                      sortKey="laju"
                      sort={sort}
                      onSort={handleSort}
                      align="right"
                    />
                    <SortHeader
                      label="Cluster"
                      sortKey="cluster"
                      sort={sort}
                      onSort={handleSort}
                    />
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row) => (
                    <tr
                      key={row.kode}
                      className="border-b border-line transition-colors duration-150 ease-editorial hover:bg-paper"
                    >
                      <th
                        scope="row"
                        className="px-3 py-3 font-semibold text-ink"
                      >
                        {row.kabupatenKota}
                      </th>
                      <td
                        data-numeric
                        className="px-3 py-3 text-right tabular-nums text-ink-2"
                      >
                        {formatInteger(row.jumlahPenduduk)}
                      </td>
                      <td
                        data-numeric
                        className="px-3 py-3 text-right tabular-nums text-ink-2"
                      >
                        {formatInteger(row.kepadatanPerKm2)}
                      </td>
                      <td
                        data-numeric
                        className="px-3 py-3 text-right tabular-nums text-ink-2"
                      >
                        {formatDecimal(row.lajuPertumbuhan)}
                      </td>
                      <td className="px-3 py-3">
                        <ClusterBadge cluster={row.cluster} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-6 divide-y divide-line border-y border-line md:hidden">
              {sortedRows.map((row) => (
                <li key={row.kode} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold text-ink">
                      {row.kabupatenKota}
                    </h3>
                    <ClusterBadge cluster={row.cluster} />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="text-xs text-ink-3">
                        Penduduk (jiwa)
                      </dt>
                      <dd
                        data-numeric
                        className="text-sm tabular-nums text-ink-2"
                      >
                        {formatInteger(row.jumlahPenduduk)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-3">
                        Kepadatan (jiwa/km2)
                      </dt>
                      <dd
                        data-numeric
                        className="text-sm tabular-nums text-ink-2"
                      >
                        {formatInteger(row.kepadatanPerKm2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-3">
                        Laju pertumbuhan (%)
                      </dt>
                      <dd
                        data-numeric
                        className="text-sm tabular-nums text-ink-2"
                      >
                        {formatDecimal(row.lajuPertumbuhan)}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            <p className="mt-4 break-words text-xs text-ink-3">
              Sumber data: {kependudukanMetadata.source}. Dataset: BPS 2024.
              Metadata model: {kependudukanMetadata.metadataSource}.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-content py-10 md:py-12">
        <div className="grid gap-6 border-t border-line pt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-sm font-semibold text-ink">Catatan sumber</h2>
            <p className="mt-3 max-w-prose text-sm text-ink-2">
              Hasil clustering dihitung dari {kependudukanMetadata.regionCount}
              kabupaten/kota pada tahun {kependudukanMetadata.year}.
              Jumlah penduduk menggunakan satuan jiwa, kepadatan jiwa/km²,
              dan laju pertumbuhan persen.
            </p>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <ButtonLink to="/analitik" variant="secondary">
              Kembali ke analitik
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
