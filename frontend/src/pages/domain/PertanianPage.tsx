import { useState, useMemo } from 'react';
import { Plus, Sprout, Tractor, Scale, Map, Leaf } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

export interface PertanianItem {
  id: number;
  komoditas: string;
  jenis_lahan: 'Sawah Irigasi' | 'Perkebunan Rakyat' | 'Tegal / Ladang' | 'Hortikultura';
  wilayah: string;
  luas_ha: number;
  produksi_ton: number;
  produktivitas: number; // Ton/Ha
  musim_tanam: string;
}

const initialPertanianData: PertanianItem[] = [
  { id: 1, komoditas: 'Kopi Arabika Gayo', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Aceh Tengah', luas_ha: 48500, produksi_ton: 36200, produktivitas: 0.75, musim_tanam: 'Sep - Jan' },
  { id: 2, komoditas: 'Kopi Arabika Gayo', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Bener Meriah', luas_ha: 42100, produksi_ton: 32800, produktivitas: 0.78, musim_tanam: 'Sep - Jan' },
  { id: 3, komoditas: 'Padi Sawah', jenis_lahan: 'Sawah Irigasi', wilayah: 'Kab. Aceh Besar', luas_ha: 29400, produksi_ton: 165000, produktivitas: 5.61, musim_tanam: 'Rendengan & Gadu' },
  { id: 4, komoditas: 'Padi Sawah', jenis_lahan: 'Sawah Irigasi', wilayah: 'Kab. Pidie', luas_ha: 26800, produksi_ton: 158000, produktivitas: 5.90, musim_tanam: 'Rendengan & Gadu' },
  { id: 5, komoditas: 'Padi Sawah', jenis_lahan: 'Sawah Irigasi', wilayah: 'Kab. Aceh Utara', luas_ha: 38200, produksi_ton: 210000, produktivitas: 5.50, musim_tanam: 'Oktober - Maret' },
  { id: 6, komoditas: 'Kelapa Sawit', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Aceh Tamiang', luas_ha: 34500, produksi_ton: 517500, produktivitas: 15.00, musim_tanam: 'Tahunan' },
  { id: 7, komoditas: 'Kelapa Sawit', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Nagan Raya', luas_ha: 41200, produksi_ton: 659200, produktivitas: 16.00, musim_tanam: 'Tahunan' },
  { id: 8, komoditas: 'Jagung Hibrida', jenis_lahan: 'Tegal / Ladang', wilayah: 'Kab. Aceh Tenggara', luas_ha: 18900, produksi_ton: 113400, produktivitas: 6.00, musim_tanam: 'April - Juli' },
  { id: 9, komoditas: 'Nilam Aceh', jenis_lahan: 'Hortikultura', wilayah: 'Kab. Aceh Jaya', luas_ha: 2400, produksi_ton: 360, produktivitas: 0.15, musim_tanam: 'Januari - Juni' },
  { id: 10, komoditas: 'Kakao Rakyat', jenis_lahan: 'Perkebunan Rakyat', wilayah: 'Kab. Pidie Jaya', luas_ha: 14600, produksi_ton: 10220, produktivitas: 0.70, musim_tanam: 'Tahunan' },
];

export default function PertanianPage() {
  const [dataList, setDataList] = useState<PertanianItem[]>(initialPertanianData);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PertanianItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Form State
  const [formData, setFormData] = useState({
    komoditas: '',
    jenis_lahan: 'Sawah Irigasi' as PertanianItem['jenis_lahan'],
    wilayah: 'Kab. Aceh Besar',
    luas_ha: 0,
    produksi_ton: 0,
    musim_tanam: 'Musim Rendengan',
  });

  // Metrik Agregasi
  const totalLuasHa = useMemo(() => {
    return dataList.reduce((acc, curr) => acc + curr.luas_ha, 0);
  }, [dataList]);

  const totalProduksiTon = useMemo(() => {
    return dataList.reduce((acc, curr) => acc + curr.produksi_ton, 0);
  }, [dataList]);

  // Kolom Definisi DataTable
  const columns: Column<PertanianItem>[] = [
    { key: 'komoditas', header: 'Komoditas Unggulan', sortable: true },
    {
      key: 'jenis_lahan',
      header: 'Tipologi Lahan',
      sortable: true,
      render: (item) => {
        let badgeStyle = 'bg-slate-100 text-slate-800';
        if (item.jenis_lahan === 'Sawah Irigasi') badgeStyle = 'bg-emerald-100 text-emerald-800';
        else if (item.jenis_lahan === 'Perkebunan Rakyat') badgeStyle = 'bg-amber-100 text-amber-800';
        else if (item.jenis_lahan === 'Hortikultura') badgeStyle = 'bg-purple-100 text-purple-800';

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`}>
            {item.jenis_lahan}
          </span>
        );
      },
    },
    { key: 'wilayah', header: 'Kabupaten/Kota Sentra', sortable: true },
    {
      key: 'luas_ha',
      header: 'Luas Lahan (Ha)',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {item.luas_ha.toLocaleString('id-ID')} Ha
        </span>
      ),
    },
    {
      key: 'produksi_ton',
      header: 'Hasil Panen (Ton)',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-emerald-700">
          {item.produksi_ton.toLocaleString('id-ID')} Ton
        </span>
      ),
    },
    {
      key: 'produktivitas',
      header: 'Produktivitas',
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-700 font-medium font-mono">
          {item.produktivitas.toFixed(2)} Ton/Ha
        </span>
      ),
    },
    { key: 'musim_tanam', header: 'Musim Panen' },
  ];

  // Handler Buka Form Tambah
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      komoditas: '',
      jenis_lahan: 'Sawah Irigasi',
      wilayah: 'Kab. Aceh Besar',
      luas_ha: 1500,
      produksi_ton: 7500,
      musim_tanam: 'Musim Rendengan',
    });
    setIsFormModalOpen(true);
  };

  // Handler Buka Form Edit
  const handleOpenEdit = (item: PertanianItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      komoditas: item.komoditas,
      jenis_lahan: item.jenis_lahan,
      wilayah: item.wilayah,
      luas_ha: item.luas_ha,
      produksi_ton: item.produksi_ton,
      musim_tanam: item.musim_tanam,
    });
    setIsFormModalOpen(true);
  };

  // Handler Simpan Data (Create / Update)
  const handleSubmitForm = () => {
    if (!formData.komoditas.trim()) {
      alert('Nama komoditas wajib diisi!');
      return;
    }

    const luas = Number(formData.luas_ha) || 1;
    const produksi = Number(formData.produksi_ton) || 0;
    const prod = Number((produksi / luas).toFixed(2));

    if (modalMode === 'create') {
      const newItem: PertanianItem = {
        id: Date.now(),
        komoditas: formData.komoditas,
        jenis_lahan: formData.jenis_lahan,
        wilayah: formData.wilayah,
        luas_ha: luas,
        produksi_ton: produksi,
        produktivitas: prod,
        musim_tanam: formData.musim_tanam,
      };
      setDataList([newItem, ...dataList]);
    } else if (selectedItem) {
      setDataList(
        dataList.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                komoditas: formData.komoditas,
                jenis_lahan: formData.jenis_lahan,
                wilayah: formData.wilayah,
                luas_ha: luas,
                produksi_ton: produksi,
                produktivitas: prod,
                musim_tanam: formData.musim_tanam,
              }
            : item
        )
      );
    }
    setIsFormModalOpen(false);
  };

  // Handler Hapus Data
  const handleDeleteConfirm = () => {
    if (selectedItem) {
      setDataList(dataList.filter((item) => item.id !== selectedItem.id));
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Pertanian & Perkebunan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Data statistik luasan lahan, komoditas unggulan, estimasi panen, dan produktivitas wilayah Aceh.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lahan Pertanian</span>
        </button>
      </div>

      {/* Kartu Ringkasan Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Luas Lahan</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalLuasHa.toLocaleString('id-ID')} Ha</h3>
            <p className="text-xs text-slate-400 mt-1">Area Lahan Terpantau</p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <Map className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Produksi Panen</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalProduksiTon.toLocaleString('id-ID')} Ton</h3>
            <p className="text-xs text-slate-400 mt-1">Estimasi Produksi Tahunan</p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Komoditas Terdata</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{dataList.length} Komoditas</h3>
            <p className="text-xs text-slate-400 mt-1">Sentra Produksi Wilayah</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Komoditas Ekspor Utama</p>
            <h3 className="text-xl font-bold text-slate-800 mt-1">Kopi Gayo & Sawit</h3>
            <p className="text-xs text-slate-400 mt-1">Nilai Ekonomi Tinggi</p>
          </div>
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Leaf className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabel Data Reusable */}
      <DataTable
        data={dataList}
        columns={columns}
        searchPlaceholder="Cari komoditas, jenis lahan, atau kabupaten..."
        pageSize={5}
        onView={(item) => {
          setSelectedItem(item);
          setIsDetailModalOpen(true);
        }}
        onEdit={(item) => handleOpenEdit(item)}
        onDelete={(item) => {
          setSelectedItem(item);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* Modal 1: Form Tambah / Edit */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={modalMode === 'create' ? 'Tambah Data Pertanian' : 'Edit Data Pertanian'}
        onConfirm={handleSubmitForm}
        confirmText={modalMode === 'create' ? 'Simpan Lahan' : 'Perbarui Lahan'}
        maxWidth="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Komoditas</label>
            <input
              type="text"
              value={formData.komoditas}
              onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
              placeholder="Contoh: Kopi Arabika Gayo"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tipologi Lahan</label>
            <select
              value={formData.jenis_lahan}
              onChange={(e) => setFormData({ ...formData, jenis_lahan: e.target.value as PertanianItem['jenis_lahan'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Sawah Irigasi">Lahan Sawah Irigasi</option>
              <option value="Perkebunan Rakyat">Perkebunan Rakyat</option>
              <option value="Tegal / Ladang">Tegal / Ladang Kering</option>
              <option value="Hortikultura">Lahan Hortikultura</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kabupaten / Kota Sentra</label>
            <select
              value={formData.wilayah}
              onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="Kab. Aceh Tengah">Kab. Aceh Tengah</option>
              <option value="Kab. Bener Meriah">Kab. Bener Meriah</option>
              <option value="Kab. Aceh Besar">Kab. Aceh Besar</option>
              <option value="Kab. Pidie">Kab. Pidie</option>
              <option value="Kab. Pidie Jaya">Kab. Pidie Jaya</option>
              <option value="Kab. Aceh Utara">Kab. Aceh Utara</option>
              <option value="Kab. Aceh Tamiang">Kab. Aceh Tamiang</option>
              <option value="Kab. Nagan Raya">Kab. Nagan Raya</option>
              <option value="Kab. Aceh Barat">Kab. Aceh Barat</option>
              <option value="Kab. Aceh Jaya">Kab. Aceh Jaya</option>
              <option value="Kab. Aceh Tenggara">Kab. Aceh Tenggara</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Musim Tanam / Panen</label>
            <input
              type="text"
              value={formData.musim_tanam}
              onChange={(e) => setFormData({ ...formData, musim_tanam: e.target.value })}
              placeholder="Contoh: September - Januari"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Luas Lahan (Hektar)</label>
            <input
              type="number"
              value={formData.luas_ha || ''}
              onChange={(e) => setFormData({ ...formData, luas_ha: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Estimasi Produksi (Ton)</label>
            <input
              type="number"
              value={formData.produksi_ton || ''}
              onChange={(e) => setFormData({ ...formData, produksi_ton: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Modal 2: Konfirmasi Hapus Data */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Lahan"
        confirmVariant="danger"
        confirmText="Hapus Sekarang"
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-slate-600">
          Apakah Anda yakin ingin menghapus data lahan komoditas{' '}
          <strong className="text-slate-800">{selectedItem?.komoditas}</strong> di {selectedItem?.wilayah}?
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>

      {/* Modal 3: Detail Pertanian */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Rincian Komoditas & Lahan"
        cancelText="Tutup"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Tractor className="w-8 h-8 text-emerald-600" />
              <div>
                <h4 className="font-bold text-slate-800 text-base">{selectedItem.komoditas}</h4>
                <p className="text-xs text-slate-500">{selectedItem.jenis_lahan} - {selectedItem.wilayah}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Luas Lahan Terdata</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {selectedItem.luas_ha.toLocaleString('id-ID')} Hektar
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Total Produksi Panen</span>
                <span className="text-base font-bold text-emerald-700 font-mono">
                  {selectedItem.produksi_ton.toLocaleString('id-ID')} Ton
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Tingkat Produktivitas</span>
                <span className="text-sm font-semibold text-slate-700 font-mono">
                  {selectedItem.produktivitas.toFixed(2)} Ton / Ha
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Periode Musim Panen</span>
                <span className="text-sm font-medium text-slate-700">
                  {selectedItem.musim_tanam}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
