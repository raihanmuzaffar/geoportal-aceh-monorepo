import { useState, useMemo } from 'react';
import { Plus, AlertTriangle, Flame, ShieldAlert, Waves, Home } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

export interface BencanaItem {
  id: number;
  jenis_bencana: 'Banjir Luapan' | 'Tanah Longsor' | 'Gempa Bumi' | 'Angin Puting Beliung' | 'Kebakaran Hutan';
  wilayah: string;
  lokasi_detail: string;
  tanggal_kejadian: string;
  tingkat_dampak: 'Tinggi' | 'Sedang' | 'Rendah';
  warga_terdampak: number;
  status_penanganan: 'Tanggap Darurat' | 'Pemulihan' | 'Selesai';
}

const initialBencanaData: BencanaItem[] = [
  { id: 1, jenis_bencana: 'Banjir Luapan', wilayah: 'Kab. Aceh Tenggara', lokasi_detail: 'Kec. Semadam & Bambel', tanggal_kejadian: '2024-10-18', tingkat_dampak: 'Tinggi', warga_terdampak: 1850, status_penanganan: 'Pemulihan' },
  { id: 2, jenis_bencana: 'Tanah Longsor', wilayah: 'Kab. Aceh Tengah', lokasi_detail: 'Jl. Takengon - Isaq Km. 12', tanggal_kejadian: '2024-11-02', tingkat_dampak: 'Tinggi', warga_terdampak: 320, status_penanganan: 'Tanggap Darurat' },
  { id: 3, jenis_bencana: 'Banjir Luapan', wilayah: 'Kab. Aceh Utara', lokasi_detail: 'Kec. Matangkuli & Pirak Timur', tanggal_kejadian: '2024-10-25', tingkat_dampak: 'Tinggi', warga_terdampak: 2450, status_penanganan: 'Pemulihan' },
  { id: 4, jenis_bencana: 'Angin Puting Beliung', wilayah: 'Kota Banda Aceh', lokasi_detail: 'Kec. Ulee Kareng', tanggal_kejadian: '2024-09-14', tingkat_dampak: 'Sedang', warga_terdampak: 65, status_penanganan: 'Selesai' },
  { id: 5, jenis_bencana: 'Gempa Bumi', wilayah: 'Kab. Pidie Jaya', lokasi_detail: 'Kec. Meureudu (M 4.8)', tanggal_kejadian: '2024-08-30', tingkat_dampak: 'Sedang', warga_terdampak: 140, status_penanganan: 'Selesai' },
  { id: 6, jenis_bencana: 'Kebakaran Hutan', wilayah: 'Kab. Aceh Barat', lokasi_detail: 'Kec. Johan Pahlawan (Lahan Gambut)', tanggal_kejadian: '2024-07-22', tingkat_dampak: 'Sedang', warga_terdampak: 80, status_penanganan: 'Selesai' },
  { id: 7, jenis_bencana: 'Tanah Longsor', wilayah: 'Kab. Bener Meriah', lokasi_detail: 'Kec. Pintu Rime Gayo', tanggal_kejadian: '2024-11-08', tingkat_dampak: 'Sedang', warga_terdampak: 95, status_penanganan: 'Tanggap Darurat' },
  { id: 8, jenis_bencana: 'Banjir Luapan', wilayah: 'Kab. Nagan Raya', lokasi_detail: 'Kec. Tripa Makmur', tanggal_kejadian: '2024-10-12', tingkat_dampak: 'Tinggi', warga_terdampak: 1200, status_penanganan: 'Pemulihan' },
  { id: 9, jenis_bencana: 'Angin Puting Beliung', wilayah: 'Kab. Aceh Besar', lokasi_detail: 'Kec. Peukan Bada', tanggal_kejadian: '2024-09-05', tingkat_dampak: 'Rendah', warga_terdampak: 25, status_penanganan: 'Selesai' },
  { id: 10, jenis_bencana: 'Tanah Longsor', wilayah: 'Kab. Aceh Selatan', lokasi_detail: 'Kec. Tapaktuan', tanggal_kejadian: '2024-11-10', tingkat_dampak: 'Sedang', warga_terdampak: 110, status_penanganan: 'Tanggap Darurat' },
];

export default function KebencanaanPage() {
  const [dataList, setDataList] = useState<BencanaItem[]>(initialBencanaData);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BencanaItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

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

  // Handler Simpan Data (Create / Update)
  const handleSubmitForm = () => {
    if (!formData.lokasi_detail.trim()) {
      alert('Lokasi spesifik kejadian wajib diisi!');
      return;
    }

    if (modalMode === 'create') {
      const newItem: BencanaItem = {
        id: Date.now(),
        jenis_bencana: formData.jenis_bencana,
        wilayah: formData.wilayah,
        lokasi_detail: formData.lokasi_detail,
        tanggal_kejadian: formData.tanggal_kejadian,
        tingkat_dampak: formData.tingkat_dampak,
        warga_terdampak: Number(formData.warga_terdampak),
        status_penanganan: formData.status_penanganan,
      };
      setDataList([newItem, ...dataList]);
    } else if (selectedItem) {
      setDataList(
        dataList.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                jenis_bencana: formData.jenis_bencana,
                wilayah: formData.wilayah,
                lokasi_detail: formData.lokasi_detail,
                tanggal_kejadian: formData.tanggal_kejadian,
                tingkat_dampak: formData.tingkat_dampak,
                warga_terdampak: Number(formData.warga_terdampak),
                status_penanganan: formData.status_penanganan,
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
          <h1 className="text-2xl font-bold text-slate-800">Data Kejadian Bencana</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pusat pemantauan log riwayat bencana, zona kerawanan, dan status tanggap darurat Aceh.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Lapor Kejadian Bencana</span>
        </button>
      </div>

      {/* Kartu Ringkasan Metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Kejadian</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalKejadian} Titik</h3>
            <p className="text-xs text-slate-400 mt-1">Laporan Tercatat</p>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Tanggap Darurat</p>
            <h3 className="text-2xl font-bold text-rose-600 mt-1">{totalDarurat} Lokasi</h3>
            <p className="text-xs text-slate-400 mt-1">Butuh Penanganan Segera</p>
          </div>
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Dampak Kritis / Tinggi</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalDampakTinggi} Titik</h3>
            <p className="text-xs text-slate-400 mt-1">Tingkat Kerusakan Berat</p>
          </div>
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Warga Terdampak</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalWarga.toLocaleString('id-ID')} Jiwa</h3>
            <p className="text-xs text-slate-400 mt-1">Mengungsi & Terdampak</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Home className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabel Data Reusable */}
      <DataTable
        data={dataList}
        columns={columns}
        searchPlaceholder="Cari jenis bencana, wilayah, atau lokasi detail..."
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
        title={modalMode === 'create' ? 'Lapor Kejadian Bencana Baru' : 'Edit Laporan Bencana'}
        onConfirm={handleSubmitForm}
        confirmText={modalMode === 'create' ? 'Simpan Laporan' : 'Perbarui Laporan'}
        maxWidth="lg"
      >
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
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Lokasi Detail / Desa / Jalan</label>
            <input
              type="text"
              value={formData.lokasi_detail}
              onChange={(e) => setFormData({ ...formData, lokasi_detail: e.target.value })}
              placeholder="Contoh: Desa Semadam Awal, Km 15"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
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
          </div>
        )}
      </Modal>
    </div>
  );
}
