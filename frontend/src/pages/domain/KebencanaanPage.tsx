import { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, AlertTriangle, Flame, ShieldAlert, Waves, Home, RefreshCw, AlertCircle } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { kebencanaanService } from '../../services/kebencanaanService';
import type { BencanaItem } from '../../services/types';
import { useRBAC } from '../../utils/rbac';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import FormFieldError from '../../components/ui/FormFieldError';
import { extractLaravelValidationErrors, formatNullableNumber, sanitizeErrorMessage } from '../../utils/formatters';

export type { BencanaItem };

export default function KebencanaanPage() {
  const { can } = useRBAC();
  const [dataList, setDataList] = useState<BencanaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BencanaItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formValidationErrors, setFormValidationErrors] = useState<Record<string, string[]>>({});
  const [submitGeneralError, setSubmitGeneralError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    jenis_bencana: 'Banjir Luapan' as BencanaItem['jenis_bencana'],
    wilayah: 'Kab. Aceh Tenggara',
    lokasi_detail: '',
    tanggal_kejadian: new Date().toISOString().split('T')[0],
    tingkat_dampak: 'Tinggi' as BencanaItem['tingkat_dampak'],
    warga_terdampak: 0,
    status_penanganan: 'Tanggap Darurat' as BencanaItem['status_penanganan'],
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const items = await kebencanaanService.getAll();
      setDataList(items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data bencana';
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Metrik Agregasi
  const totalKejadian = dataList.length;

  const totalWarga = useMemo(() => {
    return dataList.reduce((acc, curr) => acc + curr.warga_terdampak, 0);
  }, [dataList]);

  const totalDarurat = useMemo(() => {
    return dataList.filter((b) => b.status_penanganan === 'Tanggap Darurat').length;
  }, [dataList]);

  const totalDampakTinggi = useMemo(() => {
    return dataList.filter((b) => b.tingkat_dampak === 'Tinggi').length;
  }, [dataList]);

  // Kolom Definisi DataTable
  const columns: Column<BencanaItem>[] = [
    {
      key: 'jenis_bencana',
      header: 'Jenis Bencana',
      sortable: true,
      render: (item) => {
        let badgeColor = 'bg-slate-100 text-slate-800';
        if (item.jenis_bencana === 'Banjir Luapan') badgeColor = 'bg-blue-100 text-blue-800';
        else if (item.jenis_bencana === 'Tanah Longsor') badgeColor = 'bg-amber-100 text-amber-800';
        else if (item.jenis_bencana === 'Gempa Bumi') badgeColor = 'bg-purple-100 text-purple-800';
        else if (item.jenis_bencana === 'Kebakaran Hutan') badgeColor = 'bg-rose-100 text-rose-800';

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
            {item.jenis_bencana}
          </span>
        );
      },
    },
    { key: 'wilayah', header: 'Kabupaten/Kota', sortable: true },
    { key: 'lokasi_detail', header: 'Lokasi Spesifik' },
    { key: 'tanggal_kejadian', header: 'Tanggal Kejadian', sortable: true },
    {
      key: 'tingkat_dampak',
      header: 'Tingkat Dampak',
      sortable: true,
      render: (item) => {
        const style =
          item.tingkat_dampak === 'Tinggi'
            ? 'bg-rose-100 text-rose-700 font-bold border-rose-200'
            : item.tingkat_dampak === 'Sedang'
              ? 'bg-amber-100 text-amber-700 font-semibold border-amber-200'
              : 'bg-emerald-100 text-emerald-700 border-emerald-200';

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${style}`}>
            {item.tingkat_dampak}
          </span>
        );
      },
    },
    {
      key: 'warga_terdampak',
      header: 'Warga Terdampak',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {item.warga_terdampak.toLocaleString('id-ID')} Jiwa
        </span>
      ),
    },
    {
      key: 'status_penanganan',
      header: 'Status Tanggap',
      render: (item) => {
        const badge =
          item.status_penanganan === 'Tanggap Darurat'
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : item.status_penanganan === 'Pemulihan'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200';

        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${item.status_penanganan === 'Tanggap Darurat' ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {item.status_penanganan}
          </span>
        );
      },
    },
  ];

  // Handler Buka Form Tambah
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormValidationErrors({});
    setSubmitGeneralError(null);
    setFormData({
      jenis_bencana: 'Banjir Luapan',
      wilayah: 'Kab. Aceh Tenggara',
      lokasi_detail: '',
      tanggal_kejadian: new Date().toISOString().split('T')[0],
      tingkat_dampak: 'Tinggi',
      warga_terdampak: 100,
      status_penanganan: 'Tanggap Darurat',
    });
    setIsFormModalOpen(true);
  };

  // Handler Buka Form Edit
  const handleOpenEdit = (item: BencanaItem) => {
    setModalMode('edit');
    setFormValidationErrors({});
    setSubmitGeneralError(null);
    setSelectedItem(item);
    setFormData({
      jenis_bencana: item.jenis_bencana,
      wilayah: item.wilayah,
      lokasi_detail: item.lokasi_detail,
      tanggal_kejadian: item.tanggal_kejadian,
      tingkat_dampak: item.tingkat_dampak,
      warga_terdampak: item.warga_terdampak,
      status_penanganan: item.status_penanganan,
    });
    setIsFormModalOpen(true);
  };

  // Handler Simpan Data (Create / Update via Service)
  const handleSubmitForm = async () => {
    if (!formData.lokasi_detail.trim()) {
      setFormValidationErrors({
        lokasi_detail: ['Lokasi spesifik kejadian bencana wajib diisi.'],
      });
      return;
    }

    setIsSubmitting(true);
    setFormValidationErrors({});
    setSubmitGeneralError(null);

    try {
      if (modalMode === 'create') {
        const newItem = await kebencanaanService.create({
          jenis_bencana: formData.jenis_bencana,
          wilayah: formData.wilayah,
          lokasi_detail: formData.lokasi_detail,
          tanggal_kejadian: formData.tanggal_kejadian,
          tingkat_dampak: formData.tingkat_dampak,
          warga_terdampak: Number(formData.warga_terdampak),
          status_penanganan: formData.status_penanganan,
        });
        setDataList((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
      } else if (selectedItem) {
        const updated = await kebencanaanService.update(selectedItem.id, {
          jenis_bencana: formData.jenis_bencana,
          wilayah: formData.wilayah,
          lokasi_detail: formData.lokasi_detail,
          tanggal_kejadian: formData.tanggal_kejadian,
          tingkat_dampak: formData.tingkat_dampak,
          warga_terdampak: Number(formData.warga_terdampak),
          status_penanganan: formData.status_penanganan,
        });
        setDataList((prev) => prev.map((item) => (item.id === selectedItem.id ? updated : item)));
      }
      setIsFormModalOpen(false);
    } catch (err: unknown) {
      const valErrors = extractLaravelValidationErrors(err);
      if (Object.keys(valErrors).length > 0) {
        setFormValidationErrors(valErrors);
      } else {
        setSubmitGeneralError(sanitizeErrorMessage(err, 'Gagal menyimpan laporan bencana'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus Data via Service
  const handleDeleteConfirm = async () => {
    if (selectedItem) {
      setIsSubmitting(true);
      try {
        await kebencanaanService.delete(selectedItem.id);
        setDataList((prev) => prev.filter((item) => item.id !== selectedItem.id));
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal menghapus laporan bencana';
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
          <h1 className="text-2xl font-bold text-slate-800">Data Kejadian Bencana</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pusat pemantauan log riwayat bencana, zona kerawanan, dan status tanggap darurat Aceh.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-60 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-600' : 'text-slate-500'}`} />
            <span>Perbarui</span>
          </button>

          {can('create') && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Lapor Kejadian Bencana</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner Standar dengan Tombol Coba Lagi */}
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
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Kejadian</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(totalKejadian)} Titik
              </h3>
              <p className="text-xs text-slate-400 mt-1">Laporan Tercatat</p>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Tanggap Darurat</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">
                {formatNullableNumber(totalDarurat)} Lokasi
              </h3>
              <p className="text-xs text-slate-400 mt-1">Butuh Penanganan Segera</p>
            </div>
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Dampak Kritis / Tinggi</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(totalDampakTinggi)} Titik
              </h3>
              <p className="text-xs text-slate-400 mt-1">Tingkat Kerusakan Berat</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Warga Terdampak</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {formatNullableNumber(totalWarga)} Jiwa
              </h3>
              <p className="text-xs text-slate-400 mt-1">Mengungsi & Terdampak</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Home className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Tabel Data Reusable */}
      <DataTable
        data={dataList}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Cari jenis bencana, wilayah, atau lokasi detail..."
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
        title={modalMode === 'create' ? 'Lapor Kejadian Bencana Baru' : 'Edit Laporan Bencana'}
        onConfirm={handleSubmitForm}
        confirmText={modalMode === 'create' ? 'Simpan Laporan' : 'Perbarui Laporan'}
        isLoading={isSubmitting}
        maxWidth="lg"
      >
        {submitGeneralError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{submitGeneralError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis Bencana</label>
            <select
              value={formData.jenis_bencana}
              onChange={(e) => setFormData({ ...formData, jenis_bencana: e.target.value as BencanaItem['jenis_bencana'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="Banjir Luapan">Banjir Luapan Sungai</option>
              <option value="Tanah Longsor">Tanah Longsor Tebing</option>
              <option value="Gempa Bumi">Gempa Bumi Tektonik</option>
              <option value="Angin Puting Beliung">Angin Puting Beliung</option>
              <option value="Kebakaran Hutan">Kebakaran Hutan & Lahan</option>
            </select>
            <FormFieldError errors={formValidationErrors['jenis_bencana']} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kabupaten / Kota</label>
            <select
              value={formData.wilayah}
              onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="Kab. Aceh Tenggara">Kab. Aceh Tenggara</option>
              <option value="Kab. Aceh Tengah">Kab. Aceh Tengah</option>
              <option value="Kab. Aceh Utara">Kab. Aceh Utara</option>
              <option value="Kab. Bener Meriah">Kab. Bener Meriah</option>
              <option value="Kab. Aceh Barat">Kab. Aceh Barat</option>
              <option value="Kab. Nagan Raya">Kab. Nagan Raya</option>
              <option value="Kab. Pidie">Kab. Pidie</option>
              <option value="Kab. Pidie Jaya">Kab. Pidie Jaya</option>
              <option value="Kab. Aceh Besar">Kab. Aceh Besar</option>
              <option value="Kota Banda Aceh">Kota Banda Aceh</option>
              <option value="Kab. Aceh Selatan">Kab. Aceh Selatan</option>
            </select>
            <FormFieldError errors={formValidationErrors['wilayah']} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi Detail / Desa / Jalan</label>
            <input
              type="text"
              value={formData.lokasi_detail}
              onChange={(e) => setFormData({ ...formData, lokasi_detail: e.target.value })}
              placeholder="Contoh: Desa Semadam Awal, Km 15"
              className={`w-full text-sm border rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none ${formValidationErrors['lokasi_detail'] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'}`}
              required
            />
            <FormFieldError errors={formValidationErrors['lokasi_detail']} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal Kejadian</label>
            <input
              type="date"
              value={formData.tanggal_kejadian}
              onChange={(e) => setFormData({ ...formData, tanggal_kejadian: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tingkat Dampak / Risiko</label>
            <select
              value={formData.tingkat_dampak}
              onChange={(e) => setFormData({ ...formData, tingkat_dampak: e.target.value as BencanaItem['tingkat_dampak'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="Tinggi">Tinggi / Kritis (Evakuasi Warga)</option>
              <option value="Sedang">Sedang (Kerusakan Ringan)</option>
              <option value="Rendah">Rendah (Terkendali)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Perkiraan Warga Terdampak (Jiwa)</label>
            <input
              type="number"
              value={formData.warga_terdampak || ''}
              onChange={(e) => setFormData({ ...formData, warga_terdampak: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status Penanganan</label>
            <select
              value={formData.status_penanganan}
              onChange={(e) => setFormData({ ...formData, status_penanganan: e.target.value as BencanaItem['status_penanganan'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="Tanggap Darurat">Tanggap Darurat (BPBD/SAR)</option>
              <option value="Pemulihan">Pemulihan / Rehabilitasi</option>
              <option value="Selesai">Selesai Ditangani</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal 2: Konfirmasi Hapus Data */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Laporan Bencana"
        confirmVariant="danger"
        confirmText="Hapus Sekarang"
        isLoading={isSubmitting}
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-slate-600">
          Apakah Anda yakin ingin menghapus data laporan kejadian bencana{' '}
          <strong className="text-slate-800">{selectedItem?.jenis_bencana}</strong> di {selectedItem?.wilayah}?
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>

      {/* Modal 3: Detail Kejadian Bencana */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Rincian Laporan Bencana"
        cancelText="Tutup"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Waves className="w-8 h-8 text-orange-600" />
              <div>
                <h4 className="font-bold text-slate-800 text-base">{selectedItem.jenis_bencana}</h4>
                <p className="text-xs text-slate-500">{selectedItem.lokasi_detail}, {selectedItem.wilayah}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Tanggal Terjadi</span>
                <span className="text-sm font-semibold text-slate-800">
                  {selectedItem.tanggal_kejadian}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Tingkat Risiko/Dampak</span>
                <span className={`text-sm font-bold ${selectedItem.tingkat_dampak === 'Tinggi' ? 'text-rose-600' : 'text-amber-600'}`}>
                  Dampak {selectedItem.tingkat_dampak}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Warga Mengungsi/Terdampak</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {selectedItem.warga_terdampak.toLocaleString('id-ID')} Jiwa
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Status Penanganan BPBD</span>
                <span className="text-sm font-medium text-emerald-700">
                  {selectedItem.status_penanganan}
                </span>
              </div>
            </div>

            {/* Aksi Verifikasi Laporan (Khusus Administrator BPBD) */}
            {can('verify') && (
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Otorisasi BPBD:</span>
                <button
                  type="button"
                  onClick={() => {
                    setDataList((prev) =>
                      prev.map((item) =>
                        item.id === selectedItem.id
                          ? { ...item, status_penanganan: 'Selesai' }
                          : item
                      )
                    );
                    setIsDetailModalOpen(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-sm"
                >
                  Verifikasi Penanganan Selesai
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
