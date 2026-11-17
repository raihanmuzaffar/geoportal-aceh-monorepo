import { useState, useMemo } from 'react';
import { Plus, HeartPulse, Hospital, Stethoscope, Bed, Phone, ShieldCheck } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';

export interface FaskesItem {
  id: number;
  nama_faskes: string;
  jenis: 'Rumah Sakit' | 'Puskesmas' | 'Klinik Pratama' | 'RSIA';
  wilayah: string;
  alamat: string;
  kapasitas_bed: number;
  jumlah_dokter: number;
  status: 'Aktif' | 'Renovasi' | 'Siaga';
  kontak: string;
}

const initialFaskesData: FaskesItem[] = [
  { id: 1, nama_faskes: 'RSUD dr. Zainoel Abidin', jenis: 'Rumah Sakit', wilayah: 'Kota Banda Aceh', alamat: 'Jl. Tgk Daud Beureueh No. 108', kapasitas_bed: 720, jumlah_dokter: 145, status: 'Aktif', kontak: '0651-34565' },
  { id: 2, nama_faskes: 'RSUD Meuraxa', jenis: 'Rumah Sakit', wilayah: 'Kota Banda Aceh', alamat: 'Jl. Soekarno-Hatta, Mibo', kapasitas_bed: 240, jumlah_dokter: 58, status: 'Aktif', kontak: '0651-44123' },
  { id: 3, nama_faskes: 'RSUD Tgk Chik Ditiro', jenis: 'Rumah Sakit', wilayah: 'Kab. Pidie', alamat: 'Jl. Prof. A. Majid Ibrahim, Sigli', kapasitas_bed: 310, jumlah_dokter: 62, status: 'Aktif', kontak: '0653-21345' },
  { id: 4, nama_faskes: 'RSUD Cut Meutia', jenis: 'Rumah Sakit', wilayah: 'Kab. Aceh Utara', alamat: 'Jl. Banda Aceh-Medan Km. 280', kapasitas_bed: 350, jumlah_dokter: 70, status: 'Aktif', kontak: '0645-46331' },
  { id: 5, nama_faskes: 'RSUD Datu Beru', jenis: 'Rumah Sakit', wilayah: 'Kab. Aceh Tengah', alamat: 'Jl. Qurata Aini No. 153, Takengon', kapasitas_bed: 280, jumlah_dokter: 45, status: 'Aktif', kontak: '0643-21214' },
  { id: 6, nama_faskes: 'Puskesmas Kuta Alam', jenis: 'Puskesmas', wilayah: 'Kota Banda Aceh', alamat: 'Jl. T. Panglima Polem', kapasitas_bed: 15, jumlah_dokter: 8, status: 'Aktif', kontak: '0651-22991' },
  { id: 7, nama_faskes: 'Puskesmas Baiturrahman', jenis: 'Puskesmas', wilayah: 'Kota Banda Aceh', alamat: 'Jl. Teuku Umar No. 45', kapasitas_bed: 10, jumlah_dokter: 6, status: 'Aktif', kontak: '0651-31002' },
  { id: 8, nama_faskes: 'Puskesmas Ingin Jaya', jenis: 'Puskesmas', wilayah: 'Kab. Aceh Besar', alamat: 'Jl. Lambaro-Blang Bintang', kapasitas_bed: 20, jumlah_dokter: 7, status: 'Aktif', kontak: '0651-75512' },
  { id: 9, nama_faskes: 'RSIA Banda Aceh', jenis: 'RSIA', wilayah: 'Kota Banda Aceh', alamat: 'Jl. Prof. A. Majid Ibrahim I', kapasitas_bed: 160, jumlah_dokter: 32, status: 'Aktif', kontak: '0651-21287' },
  { id: 10, nama_faskes: 'Klinik Pratama Sehat Bersama', jenis: 'Klinik Pratama', wilayah: 'Kota Lhokseumawe', alamat: 'Jl. Merdeka No. 88', kapasitas_bed: 8, jumlah_dokter: 4, status: 'Aktif', kontak: '0645-41221' },
];

export default function KesehatanPage() {
  const [dataList, setDataList] = useState<FaskesItem[]>(initialFaskesData);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FaskesItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Form State
  const [formData, setFormData] = useState({
    nama_faskes: '',
    jenis: 'Rumah Sakit' as FaskesItem['jenis'],
    wilayah: 'Kota Banda Aceh',
    alamat: '',
    kapasitas_bed: 0,
    jumlah_dokter: 0,
    status: 'Aktif' as FaskesItem['status'],
    kontak: '',
  });

  // Metrik Agregasi
  const totalBeds = useMemo(() => {
    return dataList.reduce((acc, curr) => acc + curr.kapasitas_bed, 0);
  }, [dataList]);

  const totalDokter = useMemo(() => {
    return dataList.reduce((acc, curr) => acc + curr.jumlah_dokter, 0);
  }, [dataList]);

  const totalRS = useMemo(() => {
    return dataList.filter((f) => f.jenis === 'Rumah Sakit' || f.jenis === 'RSIA').length;
  }, [dataList]);

  const totalPuskesmas = useMemo(() => {
    return dataList.filter((f) => f.jenis === 'Puskesmas').length;
  }, [dataList]);

  // Kolom Definisi DataTable
  const columns: Column<FaskesItem>[] = [
    { key: 'nama_faskes', header: 'Nama Fasilitas', sortable: true },
    {
      key: 'jenis',
      header: 'Tipe / Jenis',
      sortable: true,
      render: (item) => {
        const badgeColor =
          item.jenis === 'Rumah Sakit'
            ? 'bg-rose-100 text-rose-700 font-semibold'
            : item.jenis === 'Puskesmas'
              ? 'bg-emerald-100 text-emerald-700 font-semibold'
              : item.jenis === 'RSIA'
                ? 'bg-purple-100 text-purple-700 font-semibold'
                : 'bg-blue-100 text-blue-700 font-semibold';

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${badgeColor}`}>
            {item.jenis}
          </span>
        );
      },
    },
    { key: 'wilayah', header: 'Kabupaten/Kota', sortable: true },
    {
      key: 'kapasitas_bed',
      header: 'Kapasitas Bed',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {item.kapasitas_bed} Unit
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status Operasi',
      render: (item) => (
        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {item.status}
        </span>
      ),
    },
    {
      key: 'kontak',
      header: 'Kontak Darurat',
      render: (item) => (
        <span className="text-slate-600 text-xs font-mono">
          {item.kontak || '-'}
        </span>
      ),
    },
  ];

  // Handler Buka Form Tambah
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      nama_faskes: '',
      jenis: 'Rumah Sakit',
      wilayah: 'Kota Banda Aceh',
      alamat: '',
      kapasitas_bed: 50,
      jumlah_dokter: 10,
      status: 'Aktif',
      kontak: '',
    });
    setIsFormModalOpen(true);
  };

  // Handler Buka Form Edit
  const handleOpenEdit = (item: FaskesItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      nama_faskes: item.nama_faskes,
      jenis: item.jenis,
      wilayah: item.wilayah,
      alamat: item.alamat,
      kapasitas_bed: item.kapasitas_bed,
      jumlah_dokter: item.jumlah_dokter,
      status: item.status,
      kontak: item.kontak,
    });
    setIsFormModalOpen(true);
  };

  // Handler Simpan Data (Create / Update)
  const handleSubmitForm = () => {
    if (!formData.nama_faskes.trim()) {
      alert('Nama fasilitas kesehatan wajib diisi!');
      return;
    }

    if (modalMode === 'create') {
      const newItem: FaskesItem = {
        id: Date.now(),
        nama_faskes: formData.nama_faskes,
        jenis: formData.jenis,
        wilayah: formData.wilayah,
        alamat: formData.alamat,
        kapasitas_bed: Number(formData.kapasitas_bed),
        jumlah_dokter: Number(formData.jumlah_dokter),
        status: formData.status,
        kontak: formData.kontak,
      };
      setDataList([newItem, ...dataList]);
    } else if (selectedItem) {
      setDataList(
        dataList.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                nama_faskes: formData.nama_faskes,
                jenis: formData.jenis,
                wilayah: formData.wilayah,
                alamat: formData.alamat,
                kapasitas_bed: Number(formData.kapasitas_bed),
                jumlah_dokter: Number(formData.jumlah_dokter),
                status: formData.status,
                kontak: formData.kontak,
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
          <h1 className="text-2xl font-bold text-slate-800">Fasilitas Kesehatan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Data rumah sakit, puskesmas, kapasitas ruang rawat, dan nakes di Provinsi Aceh.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Faskes Baru</span>
        </button>
      </div>

      {/* Kartu Ringkasan Metrik Faskes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Rumah Sakit Terdata</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalRS} RS / RSIA</h3>
            <p className="text-xs text-slate-400 mt-1">Rujukan Tingkat Lanjut</p>
          </div>
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
            <Hospital className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Puskesmas Wilayah</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalPuskesmas} Unit</h3>
            <p className="text-xs text-slate-400 mt-1">Faskes Tingkat Pertama</p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <HeartPulse className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Tempat Tidur</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalBeds.toLocaleString('id-ID')} Bed</h3>
            <p className="text-xs text-slate-400 mt-1">Kapasitas Rawat Inap</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Bed className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Tenaga Medis (Dokter)</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalDokter} Dokter</h3>
            <p className="text-xs text-slate-400 mt-1">Spesialis & Umum</p>
          </div>
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabel Data Reusable */}
      <DataTable
        data={dataList}
        columns={columns}
        searchPlaceholder="Cari nama rumah sakit, puskesmas, atau daerah..."
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
        title={modalMode === 'create' ? 'Tambah Fasilitas Kesehatan' : 'Edit Fasilitas Kesehatan'}
        onConfirm={handleSubmitForm}
        confirmText={modalMode === 'create' ? 'Simpan Faskes' : 'Perbarui Faskes'}
        maxWidth="lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Fasilitas Kesehatan</label>
            <input
              type="text"
              value={formData.nama_faskes}
              onChange={(e) => setFormData({ ...formData, nama_faskes: e.target.value })}
              placeholder="Contoh: RSUD dr. Zainoel Abidin"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jenis / Tipe Faskes</label>
            <select
              value={formData.jenis}
              onChange={(e) => setFormData({ ...formData, jenis: e.target.value as FaskesItem['jenis'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="Rumah Sakit">Rumah Sakit (RSU)</option>
              <option value="RSIA">RS Ibu & Anak (RSIA)</option>
              <option value="Puskesmas">Puskesmas</option>
              <option value="Klinik Pratama">Klinik Pratama</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kabupaten / Kota</label>
            <select
              value={formData.wilayah}
              onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
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

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Lengkap</label>
            <input
              type="text"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              placeholder="Jl. Tgk Daud Beureueh No. 108"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kapasitas Tempat Tidur (Bed)</label>
            <input
              type="number"
              value={formData.kapasitas_bed || ''}
              onChange={(e) => setFormData({ ...formData, kapasitas_bed: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Dokter</label>
            <input
              type="number"
              value={formData.jumlah_dokter || ''}
              onChange={(e) => setFormData({ ...formData, jumlah_dokter: Number(e.target.value) })}
              placeholder="0"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status Operasi</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as FaskesItem['status'] })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="Aktif">Aktif Beroperasi</option>
              <option value="Renovasi">Dalam Renovasi</option>
              <option value="Siaga">Siaga Bencana</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Kontak Darurat / Call Center</label>
            <input
              type="text"
              value={formData.kontak}
              onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
              placeholder="0651-34565"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Modal 2: Konfirmasi Hapus Data */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus Fasilitas"
        confirmVariant="danger"
        confirmText="Hapus Sekarang"
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-slate-600">
          Apakah Anda yakin ingin menghapus data fasilitas kesehatan{' '}
          <strong className="text-slate-800">{selectedItem?.nama_faskes}</strong> ({selectedItem?.wilayah})?
          Data yang dihapus tidak dapat dipulihkan.
        </p>
      </Modal>

      {/* Modal 3: Detail Fasilitas Kesehatan */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Profil Fasilitas Kesehatan"
        cancelText="Tutup"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Hospital className="w-8 h-8 text-rose-600" />
              <div>
                <h4 className="font-bold text-slate-800 text-base">{selectedItem.nama_faskes}</h4>
                <p className="text-xs text-slate-500">{selectedItem.jenis} - {selectedItem.wilayah}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Alamat: <strong>{selectedItem.alamat}</strong></span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Kontak: <strong>{selectedItem.kontak || '-'}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Kapasitas Kamar / Bed</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {selectedItem.kapasitas_bed} Tempat Tidur
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1">Tenaga Medis</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {selectedItem.jumlah_dokter} Dokter Aktif
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
