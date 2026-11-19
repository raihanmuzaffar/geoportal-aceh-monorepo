import {
  summarizeClusters,
  type KependudukanClusterRow,
} from '../../data/kependudukan';
import { clusterMarkers } from './clusterPresentation';

type ClusterDistributionProps = {
  rows: KependudukanClusterRow[];
  className?: string;
};

const percentFormat = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 1,
});

export default function ClusterDistribution({
  rows,
  className = '',
}: ClusterDistributionProps) {
  const total = rows.length;
  const summary = summarizeClusters(rows);
  const totalLabel = new Intl.NumberFormat('id-ID').format(total);

  if (total === 0) {
    return (
      <p className={`text-sm text-ink-2 ${className}`}>
        Data cluster belum tersedia.
      </p>
    );
  }

  const distributionLabel = summary
    .map(
      (item) =>
        `Cluster ${item.cluster} sebanyak ${item.count} wilayah`,
    )
    .join(', ');

  return (
    <div className={className}>
      <div
        role="img"
        aria-label={`Komposisi ${totalLabel} wilayah: ${distributionLabel}.`}
        className="flex h-3 w-full overflow-hidden border border-line bg-surface"
      >
        {summary.map((item) => {
          const marker = clusterMarkers[item.cluster];
          const percentage = (item.count / total) * 100;

          return (
            <span
              key={item.cluster}
              className="block h-full border-r-2 border-paper last:border-r-0"
              style={{
                width: `${percentage}%`,
                backgroundColor: marker.fill,
              }}
            />
          );
        })}
      </div>

      <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        {summary.map((item) => {
          const marker = clusterMarkers[item.cluster];
          const percentage = (item.count / total) * 100;

          return (
            <li key={item.cluster} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-1.5 block h-2.5 w-2.5 shrink-0 border border-paper ${marker.shapeClass}`}
                style={{ backgroundColor: marker.fill }}
              />
              <div>
                <p className="text-sm font-semibold text-ink">
                  Cluster {item.cluster}
                </p>
                <p className="text-xs text-ink-2">
                  {item.count} wilayah, {percentFormat.format(percentage)}%
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
