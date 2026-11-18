import { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, GraduationCap, School, BookOpen, Award, Building2, RefreshCw } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { pendidikanService } from '../../services/pendidikanService';
import type { SekolahItem } from '../../services/types';
import { useRBAC } from '../../utils/rbac';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { formatNullableNumber } from '../../utils/formatters';

export type { SekolahItem };

export default function PendidikanPage() {
  const { can } = useRBAC();
  const [dataList, setDataList] = useState<SekolahItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SekolahItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Form State
  const [formData, setFormData] = useState({
    nama_sekolah: '',
    jenjang: 'SMA/MA' as SekolahItem['jenjang'],
    status: 'Negeri' as SekolahItem['status'],
    wilayah: 'Kota Banda Aceh',
    jumlah_siswa: 0,
    jumlah_guru: 0,
    akreditasi: 'A' as SekolahItem['akreditasi'],
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const items = await pendidikanService.getAll();
      setDataList(items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data sekolah';
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Metrik Agregasi
  const totalSiswa = useMemo(() => {
    return dataList.reduce((acc, curr) => acc + curr.jumlah_siswa, 0);
  }, [dataList]);

  const totalGuru = useMemo(() => {
    return dataList.reduce((acc, curr) => acc + curr.jumlah_guru, 0);
  }, [dataList]);

  const totalNegeri = useMemo(() => {
    return dataList.filter((s) => s.status === 'Negeri').length;
  }, [dataList]);

  // Kolom Definisi DataTable
  const columns: Column<SekolahItem>[] = [
    { key: 'nama_sekolah', header: 'Nama Satuan Pendidikan', sortable: true },
    {
      key: 'jenjang',
      header: 'Jenjang',
      sortable: true,
      render: (item) => {
        let badgeStyle = 'bg-blue-100 text-blue-800';
        if (item.jenjang === 'Perguruan Tinggi') badgeStyle = 'bg-indigo-100 text-indigo-800';
        else if (item.jenjang === 'SMK') badgeStyle = 'bg-amber-100 text-amber-800';
        else if (item.jenjang === 'SD/MI') badgeStyle = 'bg-emerald-100 text-emerald-800';

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`}>
            {item.jenjang}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            item.status === 'Negeri'
              ? 'bg-slate-100 text-slate-800 border border-slate-200'
              : 'bg-purple-50 text-purple-700 border border-purple-200'
          }`}
        >
          {item.status}
        </span>
      ),
    },
    { key: 'wilayah', header: 'Kabupaten/Kota', sortable: true },
    {
      key: 'jumlah_siswa',
      header: 'Jumlah Siswa',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {item.jumlah_siswa.toLocaleString('id-ID')}
        </span>
      ),
    },
    {
      key: 'akreditasi',
      header: 'Akreditasi',
      sortable: true,
      render: (item) => (
        <span className="inline-flex items-center gap-1 font-bold text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          <Award className="w-3.5 h-3.5" />
          {item.akreditasi}
        </span>
      ),
    },
  ];

  // Handler Buka Form Tambah
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      nama_sekolah: '',
      jenjang: 'SMA/MA',
      status: 'Negeri',
      wilayah: 'Kota Banda Aceh',
      jumlah_siswa: 500,
      jumlah_guru: 35,
      akreditasi: 'A',
    });
    setIsFormModalOpen(true);
  };

  // Handler Buka Form Edit
  const handleOpenEdit = (item: SekolahItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      nama_sekolah: item.nama_sekolah,
      jenjang: item.jenjang,
      status: item.status,
      wilayah: item.wilayah,
      jumlah_siswa: item.jumlah_siswa,
      jumlah_guru: item.jumlah_guru,
      akreditasi: item.akreditasi,
    });
    setIsFormModalOpen(true);
  };

  // Handler Simpan Data (Create / Update via Service)
  const handleSubmitForm = async () => {
    if (!formData.nama_sekolah.trim()) {
      alert('Nama satuan pendidikan wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const newItem = await pendidikanService.create({
          nama_sekolah: formData.nama_sekolah,
          jenjang: formData.jenjang,
          status: formData.status,
          wilayah: formData.wilayah,
          jumlah_siswa: Number(formData.jumlah_siswa),
          jumlah_guru: Number(formData.jumlah_guru),
          akreditasi: formData.akreditasi,
        });
        setDataList((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
      } else if (selectedItem) {
        const updated = await pendidikanService.update(selectedItem.id, {
          nama_sekolah: formData.nama_sekolah,
          jenjang: formData.jenjang,
          status: formData.status,
          wilayah: formData.wilayah,
          jumlah_siswa: Number(formData.jumlah_siswa),
          jumlah_guru: Number(formData.jumlah_guru),
          akreditasi: formData.akreditasi,
        });
        setDataList((prev) => prev.map((item) => (item.id === selectedItem.id ? updated : item)));
      }
      setIsFormModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan data sekolah';
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
        await pendidikanService.delete(selectedItem.id);
        setDataList((prev) => prev.filter((item) => item.id !== selectedItem.id));
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal menghapus data sekolah';
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
          <h1 className="text-2xl font-bold text-slate-800">Data Pendidikan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Sebaran satuan pendidikan, jenjang sekolah, akreditasi, dan jumlah peserta didik Aceh.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-60 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>Perbarui</span>
          </button>

          {can('create') && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sekolah Baru</span>
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
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Siswa Terdata</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(totalSiswa)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Peserta Didik Aktif</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Tenaga Pendidik</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(totalGuru)}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Guru & Dosen</p>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Sekolah Negeri</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(totalNegeri)} Sekolah
              </h3>
              <p className="text-xs text-slate-400 mt-1">Fasilitas Pemerintah</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <School className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Lembaga</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(dataList.length)} Lembaga
              </h3>
              <p className="text-xs text-slate-400 mt-1">Tercatat di Sistem</p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Tabel Data Reusable */}
      <DataTable
        data={dataList}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Cari nama sekolah, jenjang, atau kabupaten..."
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
        title={modalMode === 'create' ? 'Tambah Satuan Pendidikan' : 'Edit Satuan Pendidikan'}
        onConfirm={handleSubmitForm}
        confirmText={modalMode === 'create' ? 'Simpan Sekolah' : 'Perbarui Sekolah'}
        isLoading={isSubmitting}
        maxWidth="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Satuan Pendidikan</label>
            <input
              type="text"
              value={formData.nama_sekolah}
              onChange={(e) => setFormData({ ...formData, nama_sekolah: e.target.value })}
              placeholder="Contoh: SMAN 2 Banda Aceh"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jenjang Pendidikan</label>
            <select
              value={formData.jenjang}
              onChange={(e) => setFormData({ ...formData, jenjang: e.target.value as SekolahItem['jenjang'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="SD/MI">SD / Madrasah Ibtidaiyah</option>
              <option value="SMP/MTs">SMP / Madrasah Tsanawiyah</option>
              <option value="SMA/MA">SMA / Madrasah Aliyah</option>
              <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
              <option value="Perguruan Tinggi">Perguruan Tinggi / Universitas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status Kepemilikan</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as SekolahItem['status'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Negeri">Negeri (Pemerintah)</option>
              <option value="Swasta">Swasta / Yayasan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kabupaten / Kota</label>
            <select
              value={formData.wilayah}
              onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">Predikat Akreditasi</label>
            <select
              value={formData.akreditasi}
              onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value as SekolahItem['akreditasi'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="A">Akreditasi A (Unggul)</option>
              <option value="B">Akreditasi B (Baik)</option>
              <option value="C">Akreditasi C (Cukup)</option>
              <option value="Belum Terakreditasi">Belum Terakreditasi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Siswa</label>
            <input
              type="number"
              value={formData.jumlah_siswa || ''}
              onChange={(e) => setFormData({ ...formData, jumlah_siswa: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Guru / Pendidik</label>
            <input
              type="number"
              value={formData.jumlah_guru || ''}
              onChange={(e) => setFormData({ ...formData, jumlah_guru: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Modal 2: Konfirmasi Hapus Data */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Sekolah"
        confirmVariant="danger"
        confirmText="Hapus Sekarang"
        isLoading={isSubmitting}
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-slate-600">
          Apakah Anda yakin ingin menghapus data sekolah{' '}
          <strong className="text-slate-800">{selectedItem?.nama_sekolah}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>

      {/* Modal 3: Detail Sekolah */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Rincian Satuan Pendidikan"
        cancelText="Tutup"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <School className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-bold text-slate-800 text-base">{selectedItem.nama_sekolah}</h4>
                <p className="text-xs text-slate-500">{selectedItem.jenjang} ({selectedItem.status}) - {selectedItem.wilayah}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Total Peserta Didik</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {selectedItem.jumlah_siswa.toLocaleString('id-ID')} Siswa
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Total Tenaga Pendidik</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {selectedItem.jumlah_guru} Guru
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Rasio Siswa per Guru</span>
                <span className="text-sm font-semibold text-slate-700 font-mono">
                  1 : {Math.round(selectedItem.jumlah_siswa / (selectedItem.jumlah_guru || 1))}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Status Akreditasi</span>
                <span className="text-sm font-bold text-amber-600">
                  Peringkat {selectedItem.akreditasi}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
