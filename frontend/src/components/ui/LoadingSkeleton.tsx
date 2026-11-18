import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}

/**
 * Komponen Skeleton Dasar dengan animasi shimmer halus
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  rounded = 'rounded-md',
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`}
      style={{
        width,
        height,
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Skeleton khusus kartu metrik ringkasan (mencegah layout shift)
 */
export const CardSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 1,
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 animate-pulse ${className}`}
          aria-hidden="true"
        >
          <div className="flex items-center justify-between">
            <Skeleton width="45%" height="14px" />
            <Skeleton width="32px" height="32px" rounded="rounded-lg" />
          </div>
          <Skeleton width="70%" height="28px" rounded="rounded-md" />
          <Skeleton width="55%" height="12px" />
        </div>
      ))}
    </>
  );
};

/**
 * Skeleton khusus baris tabel data (DataTable)
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  hasActions?: boolean;
}> = ({ rows = 5, columns = 4, hasActions = true }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-slate-100 animate-pulse">
          {/* Kolom Nomor */}
          <td className="py-3.5 px-4 text-center">
            <Skeleton width="18px" height="14px" className="mx-auto" />
          </td>

          {/* Kolom Data */}
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="py-3.5 px-4">
              <Skeleton
                width={cIdx === 0 ? '75%' : cIdx === columns - 1 ? '40%' : '60%'}
                height="16px"
              />
            </td>
          ))}

          {/* Kolom Aksi */}
          {hasActions && (
            <td className="py-3.5 px-4 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Skeleton width="28px" height="28px" rounded="rounded-md" />
                <Skeleton width="28px" height="28px" rounded="rounded-md" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

/**
 * Skeleton daftar item / list
 */
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm animate-pulse flex items-center justify-between"
        >
          <div className="space-y-2 w-3/4">
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="12px" />
          </div>
          <Skeleton width="24px" height="24px" rounded="rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
