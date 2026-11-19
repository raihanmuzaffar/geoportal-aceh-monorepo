import { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Users, UserCheck, MapPin, Building, TrendingUp, RefreshCw } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { kependudukanService } from '../../services/kependudukanService';
import type { PendudukItem } from '../../services/types';
import { useRBAC } from '../../utils/rbac';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { formatNullableNumber } from '../../utils/formatters';

export type { PendudukItem };

export default function KependudukanPage() {
  const { can } = useRBAC();
  const [dataList, setDataList] = useState<PendudukItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // State Modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PendudukItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Form State
  const [formData, setFormData] = useState({
    wilayah: '',
    kecamatan: '',
    laki_laki: 0,
    perempuan: 0,
    luas_km2: 0,
    tahun: 2024,
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const items = await kependudukanService.getAll();
      setDataList(items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data kependudukan';
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Metrik Agregasi
  const totalPendudukAll = useMemo(() => {
    return dataList.reduce((acc, curr) => acc + curr.total_penduduk, 0);
  }, [dataList]);

  const rataKepadatan = useMemo(() => {
    if (dataList.length === 0) return 0;
    const sum = dataList.reduce((acc, curr) => acc + curr.kepadatan, 0);
    return Math.round(sum / dataList.length);
  }, [dataList]);

  // Kolom Definisi DataTable
  const columns: Column<PendudukItem>[] = [
    { key: 'wilayah', header: 'Kabupaten/Kota', sortable: true },
    { key: 'kecamatan', header: 'Kecamatan', sortable: true },
    {
      key: 'total_penduduk',
      header: 'Total Penduduk',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-slate-900 font-mono">
          {item.total_penduduk.toLocaleString('id-ID')} Jiwa
        </span>
      ),
    },
    {
      key: 'laki_laki',
      header: 'Laki-Laki',
      render: (item) => (
        <span className="text-slate-600 font-mono text-xs">
          {item.laki_laki.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'perempuan',
      header: 'Perempuan',
      render: (item) => (
        <span className="text-slate-600 font-mono text-xs">
          {item.perempuan.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'kepadatan',
      header: 'Kepadatan (/km²)',
      sortable: true,
      render: (item) => {
        const badgeStyle =
          item.kepadatan > 4000
            ? 'bg-rose-100 text-rose-700 font-medium'
            : item.kepadatan > 1000
              ? 'bg-amber-100 text-amber-700 font-medium'
              : 'bg-emerald-100 text-emerald-700 font-medium';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${badgeStyle}`}>
            {item.kepadatan.toLocaleString('id-ID')}
          </span>
        );
      },
    },
    { key: 'tahun', header: 'Tahun', sortable: true },
  ];

  // Handler Buka Form Tambah
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      wilayah: 'Kota Banda Aceh',
      kecamatan: '',
      laki_laki: 0,
      perempuan: 0,
      luas_km2: 10,
      tahun: 2024,
    });
    setIsFormModalOpen(true);
  };

  // Handler Buka Form Edit
  const handleOpenEdit = (item: PendudukItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      wilayah: item.wilayah,
      kecamatan: item.kecamatan,
      laki_laki: item.laki_laki,
      perempuan: item.perempuan,
      luas_km2: item.luas_km2,
      tahun: item.tahun,
    });
    setIsFormModalOpen(true);
  };

  // Handler Simpan Data (Create / Update via Service)
  const handleSubmitForm = async () => {
    if (!formData.kecamatan.trim()) {
      alert('Nama kecamatan wajib diisi!');
      return;
    }

    const luas = Number(formData.luas_km2) || 1;
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const newItem = await kependudukanService.create({
          wilayah: formData.wilayah,
          kecamatan: formData.kecamatan,
          laki_laki: Number(formData.laki_laki),
          perempuan: Number(formData.perempuan),
          luas_km2: luas,
          tahun: Number(formData.tahun),
        });
        setDataList((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
      } else if (selectedItem) {
        const updated = await kependudukanService.update(selectedItem.id, {
          wilayah: formData.wilayah,
          kecamatan: formData.kecamatan,
          laki_laki: Number(formData.laki_laki),
          perempuan: Number(formData.perempuan),
          luas_km2: luas,
          tahun: Number(formData.tahun),
        });
        setDataList((prev) => prev.map((item) => (item.id === selectedItem.id ? updated : item)));
      }
      setIsFormModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan data';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus Data via Service
  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      setIsSubmitting(true);
      try {
        await kependudukanService.delete(selectedItem.id);
        setDataList((prev) => prev.filter((item) => item.id !== selectedItem.id));
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
        alert(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Kependudukan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pengelolaan data demografi, rasio gender, dan kepadatan penduduk wilayah Aceh.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-60 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span>Perbarui</span>
          </button>

          {can('create') && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data Penduduk</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner Standar dengan Retry */}
      {fetchError && (
        <ErrorState
          error={fetchError}
          onRetry={loadData}
          isRetrying={isLoading}
        />
      )}

      {/* Kartu Ringkasan Metrik (Skeleton saat memuat awal) */}
      {isLoading && dataList.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Sampel Penduduk</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(totalPendudukAll)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Jiwa terdata di tabel</p>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Rata-rata Kepadatan</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(rataKepadatan)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Jiwa / km²</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Wilayah Kecamatan</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(dataList.length)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Kecamatan tercatat</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Kategori Kepadatan</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">Tinggi / Sedang</h3>
              <p className="text-xs text-slate-400 mt-1">Kualifikasi Spasial</p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Tabel Data Reusable */}
      <DataTable
        data={dataList}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Cari wilayah atau kecamatan di Aceh..."
        pageSize={5}
        onView={(item) => {
          setSelectedItem(item);
          setIsDetailModalOpen(true);
        }}
        onEdit={can('update') ? (item) => handleOpenEdit(item) : undefined}
        onDelete={can('delete') ? (item) => {
          setSelectedItem(item);
          setIsDeleteModalOpen(true);
        } : undefined}
      />

      {/* Modal 1: Form Tambah / Edit */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={modalMode === 'create' ? 'Tambah Data Kependudukan' : 'Edit Data Kependudukan'}
        onConfirm={handleSubmitForm}
        confirmText={modalMode === 'create' ? 'Simpan Data' : 'Perbarui Data'}
        isLoading={isSubmitting}
        maxWidth="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kabupaten / Kota</label>
            <select
              value={formData.wilayah}
              onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Kota Banda Aceh">Kota Banda Aceh</option>
              <option value="Kab. Aceh Besar">Kab. Aceh Besar</option>
              <option value="Kab. Pidie">Kab. Pidie</option>
              <option value="Kab. Aceh Utara">Kab. Aceh Utara</option>
              <option value="Kab. Aceh Tengah">Kab. Aceh Tengah</option>
              <option value="Kota Lhokseumawe">Kota Lhokseumawe</option>
              <option value="Kota Sabang">Kota Sabang</option>
              <option value="Kab. Aceh Barat">Kab. Aceh Barat</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Kecamatan</label>
            <input
              type="text"
              value={formData.kecamatan}
              onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
              placeholder="Contoh: Lueng Bata"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Laki-Laki (Jiwa)</label>
            <input
              type="number"
              value={formData.laki_laki || ''}
              onChange={(e) => setFormData({ ...formData, laki_laki: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Perempuan (Jiwa)</label>
            <input
              type="number"
              value={formData.perempuan || ''}
              onChange={(e) => setFormData({ ...formData, perempuan: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Luas Wilayah (km²)</label>
            <input
              type="number"
              step="0.01"
              value={formData.luas_km2 || ''}
              onChange={(e) => setFormData({ ...formData, luas_km2: Number(e.target.value) })}
              placeholder="10.5"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tahun Pendataan</label>
            <input
              type="number"
              value={formData.tahun}
              onChange={(e) => setFormData({ ...formData, tahun: Number(e.target.value) })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Modal 2: Konfirmasi Hapus Data */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Data"
        confirmVariant="danger"
        confirmText="Hapus Sekarang"
        isLoading={isSubmitting}
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-slate-600">
          Apakah Anda yakin ingin menghapus data kependudukan untuk{' '}
          <strong className="text-slate-800">
            Kecamatan {selectedItem?.kecamatan}, {selectedItem?.wilayah}
          </strong>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>

      {/* Modal 3: Rincian Detail Wilayah */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Rincian Data Kependudukan"
        cancelText="Tutup"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Building className="w-8 h-8 text-emerald-600" />
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  Kecamatan {selectedItem.kecamatan}
                </h4>
                <p className="text-xs text-slate-500">{selectedItem.wilayah} - Tahun {selectedItem.tahun}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Total Penduduk</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {selectedItem.total_penduduk.toLocaleString('id-ID')} Jiwa
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Kepadatan Spasial</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {selectedItem.kepadatan.toLocaleString('id-ID')} /km²
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Penduduk Laki-Laki</span>
                <span className="text-sm font-semibold text-slate-700 font-mono">
                  {selectedItem.laki_laki.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Penduduk Perempuan</span>
                <span className="text-sm font-semibold text-slate-700 font-mono">
                  {selectedItem.perempuan.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
