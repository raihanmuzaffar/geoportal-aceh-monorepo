import { useId, useMemo } from 'react';
import {
  summarizeClusters,
  type KependudukanClusterId,
  type KependudukanClusterRow,
} from '../../data/kependudukan';
import { clusterMarkers, clusterOrder } from './clusterPresentation';

export type ClusterFilterValue = KependudukanClusterId | 'all';

type ClusterScatterProps = {
  rows: KependudukanClusterRow[];
  activeCluster: ClusterFilterValue;
  onClusterChange: (value: ClusterFilterValue) => void;
};

const numberFormat = new Intl.NumberFormat('id-ID');

const xMin = 20;
const xMax = 6000;
const yMin = 0;
const yMax = 25;

const xTicks = [25, 100, 500, 2500, 6000];
const yTicks = [0, 5, 10, 15, 20, 25];

function xPosition(value: number) {
  return (
    ((Math.log10(value) - Math.log10(xMin)) /
      (Math.log10(xMax) - Math.log10(xMin))) *
    100
  );
}

function yPosition(value: number) {
  return 100 - ((value - yMin) / (yMax - yMin)) * 100;
}

export default function ClusterScatter({
  rows,
  activeCluster,
  onClusterChange,
}: ClusterScatterProps) {
  const captionId = useId();
  const summary = summarizeClusters(rows);
  const counts = new Map(
    summary.map((item) => [item.cluster, item.count] as const),
  );

  const populations = rows.map((row) => row.pendudukRibu);
  const populationMin = populations.length
    ? Math.min(...populations)
    : 0;
  const populationMax = populations.length
    ? Math.max(...populations)
    : 1;
  const populationRange =
    Math.sqrt(populationMax) - Math.sqrt(populationMin) || 1;

  const bandaAceh = rows.find((row) => row.kode === '1171');
  const filteredCount =
    activeCluster === 'all'
      ? rows.length
      : (counts.get(activeCluster) ?? 0);

  const activeLabel = useMemo(() => {
    if (activeCluster === 'all') {
      return `Menampilkan seluruh ${rows.length} wilayah.`;
    }

    return `Menampilkan ${filteredCount} wilayah pada Cluster ${activeCluster}.`;
  }, [activeCluster, filteredCount, rows.length]);

  function pointSize(population: number) {
    const ratio =
      (Math.sqrt(population) - Math.sqrt(populationMin)) /
      populationRange;
    return 10 + ratio * 10;
  }

  function clusterOpacity(cluster: KependudukanClusterId) {
    return activeCluster === 'all' || activeCluster === cluster
      ? 'opacity-100'
      : 'opacity-20';
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">
            Kepadatan, pertumbuhan, dan ukuran penduduk
          </h3>
          <p className="mt-1 text-sm text-ink-2">
            Sumbu mendatar memakai skala log agar wilayah berpenduduk padat
            tetap terbaca.
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter cluster untuk grafik dan tabel"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={activeCluster === 'all'}
            onClick={() => onClusterChange('all')}
            className={`inline-flex min-h-11 items-center gap-2 border px-3 text-sm font-semibold transition-colors duration-200 ease-editorial ${
              activeCluster === 'all'
                ? 'border-forest bg-forest text-paper'
                : 'border-line-strong bg-surface text-ink-2 hover:bg-surface-soft'
            }`}
          >
            Semua
            <span className="tabular-nums">{rows.length}</span>
          </button>

          {clusterOrder.map((cluster) => (
            <button
              key={cluster}
              type="button"
              aria-pressed={activeCluster === cluster}
              onClick={() => onClusterChange(cluster)}
              className={`inline-flex min-h-11 items-center gap-2 border px-3 text-sm font-semibold transition-colors duration-200 ease-editorial ${
                activeCluster === cluster
                  ? 'border-forest bg-forest text-paper'
                  : 'border-line-strong bg-surface text-ink-2 hover:bg-surface-soft'
              }`}
            >
              Cluster {cluster}
              <span className="tabular-nums">
                {counts.get(cluster) ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm text-ink-2" role="status">
        {activeLabel}
      </p>

      <figure className="mt-5">
        <div
          role="img"
          aria-label={`Grafik sebaran ${rows.length} wilayah berdasarkan kepadatan penduduk berskala log dan laju pertumbuhan. Ukuran titik menunjukkan jumlah penduduk. Bentuk penanda: lingkaran untuk Cluster 0, belah ketupat untuk Cluster 1, dan kotak untuk Cluster 2. Data lengkap tersedia pada tabel hasil di bawah.`}
          aria-describedby={captionId}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)]"
        >
          <div className="relative h-[280px] sm:h-[360px]">
            {yTicks.map((tick) => (
              <span
                key={tick}
                className="absolute right-2 -translate-y-1/2 text-xs tabular-nums text-ink-3"
                style={{ top: `${yPosition(tick)}%` }}
              >
                {numberFormat.format(tick)}
              </span>
            ))}
          </div>

          <div className="relative h-[280px] border-b border-l border-line-strong sm:h-[360px]">
            {yTicks.slice(1).map((tick) => (
              <span
                key={`grid-y-${tick}`}
                className="absolute inset-x-0 h-px bg-line"
                style={{ top: `${yPosition(tick)}%` }}
              />
            ))}

            {xTicks.map((tick) => (
              <span
                key={`grid-x-${tick}`}
                className="absolute inset-y-0 w-px bg-line"
                style={{ left: `${xPosition(tick)}%` }}
              />
            ))}

            {rows.map((row) => {
              const marker = clusterMarkers[row.cluster];
              const size = pointSize(row.pendudukRibu);

              return (
                <span
                  key={row.kode}
                  aria-hidden="true"
                  className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-editorial ${clusterOpacity(row.cluster)}`}
                  style={{
                    left: `${xPosition(row.kepadatanPerKm2)}%`,
                    top: `${yPosition(row.lajuPertumbuhan)}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                >
                  <span
                    className={`block h-full w-full border border-paper ${marker.shapeClass}`}
                    style={{ backgroundColor: marker.fill }}
                  />
                </span>
              );
            })}

            {bandaAceh && (
              <span
                aria-hidden="true"
                className={`absolute z-20 -translate-x-full -translate-y-1/2 whitespace-nowrap bg-surface px-1 text-xs font-semibold text-ink-2 transition-opacity duration-200 ease-editorial ${clusterOpacity(bandaAceh.cluster)}`}
                style={{
                  left: `calc(${xPosition(bandaAceh.kepadatanPerKm2)}% - 10px)`,
                  top: `${yPosition(bandaAceh.lajuPertumbuhan)}%`,
                }}
              >
                Kota Banda Aceh
              </span>
            )}
          </div>

          <div />
          <div className="relative h-8">
            {xTicks.map((tick, index) => {
              const isFirst = index === 0;
              const isLast = index === xTicks.length - 1;

              return (
                <span
                  key={`label-x-${tick}`}
                  className={`absolute top-2 text-xs tabular-nums text-ink-3 ${
                    isLast ? 'hidden sm:inline' : ''
                  }`}
                  style={{
                    left: isFirst ? 0 : isLast ? undefined : `${xPosition(tick)}%`,
                    right: isLast ? 0 : undefined,
                    transform:
                      isFirst || isLast ? undefined : 'translateX(-50%)',
                  }}
                >
                  {numberFormat.format(tick)}
                </span>
              );
            })}
          </div>
        </div>

        <figcaption
          id={captionId}
          className="mt-3 text-xs text-ink-3"
        >
          Sumbu tegak: laju pertumbuhan penduduk (nilai dataset, satuan belum
          dipastikan). Ukuran titik: jumlah penduduk. Bentuk penanda: lingkaran
          Cluster 0, belah ketupat Cluster 1, kotak Cluster 2. Sumber: CSV hasil
          clustering kependudukan 2024.
        </figcaption>
      </figure>
    </div>
  );
}
