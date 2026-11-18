import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { TableSkeleton } from './LoadingSkeleton';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

function getFieldValue<T extends object>(
  item: T,
  key: string
): unknown {
  return (item as Record<string, unknown>)[key];
}

export default function DataTable<T extends object>({
  data,
  columns,
  isLoading = false,
  searchPlaceholder = 'Cari data...',
  pageSize = 5,
  onView,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // 1. Filter data berdasarkan pencarian
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const value = getFieldValue(item, col.key);
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, columns]);

  // 2. Sorting data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = getFieldValue(a, sortConfig.key);
      const bVal = getFieldValue(b, sortConfig.key);

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortConfig.direction === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [filteredData, sortConfig]);

  // 3. Pagination calculation
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handler toggle sort
  const handleSort = (key: string) => {
    setCurrentPage(1);
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const hasActions = Boolean(onView || onEdit || onDelete);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Bar: Search Input */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 w-full sm:w-auto text-right">
          Total: <span className="font-semibold text-slate-700">{filteredData.length}</span> data
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 ${col.sortable ? 'cursor-pointer select-none hover:bg-slate-100 transition-colors' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 hover:text-slate-600" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="py-3.5 px-4 text-center w-36">Aksi</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {isLoading ? (
              <TableSkeleton
                rows={pageSize}
                columns={columns.length}
                hasActions={hasActions}
              />
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 2 : 1)}
                  className="py-6 text-center"
                >
                  <EmptyState
                    isSearchEmpty={Boolean(searchQuery.trim())}
                    searchQuery={searchQuery}
                    onResetSearch={() => setSearchQuery('')}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const rowNumber = (currentPage - 1) * pageSize + index + 1;
                const rowKey = String(getFieldValue(item, 'id') ?? index);
                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-center text-xs text-slate-500 font-medium">
                      {rowNumber}
                    </td>
                    {columns.map((col) => {
                      const val = getFieldValue(item, col.key);
                      const displayVal = val === null || val === undefined ? '—' : String(val);
                      return (
                        <td key={col.key} className="py-3.5 px-4">
                          {col.render ? col.render(item) : displayVal}
                        </td>
                      );
                    })}
                    {hasActions && (
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {onView && (
                            <button
                              type="button"
                              onClick={() => onView(item)}
                              title="Lihat Detail"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(item)}
                              title="Edit Data"
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(item)}
                              title="Hapus Data"
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > 0 && (
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <div className="text-xs text-slate-500">
            Menampilkan{' '}
            <span className="font-semibold text-slate-700">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            sampai{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-slate-700">
              {sortedData.length}
            </span>{' '}
            data
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 text-xs font-medium text-slate-700">
              Hal {currentPage} dari {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
