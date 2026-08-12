import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { DataTable } from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import ImageInput from '../components/ImageInput';
import type { GalleryItem, ProkerItem, TrainingItem, SeminarItem, PartnershipItem } from '../../types';
import { Save } from 'lucide-react';

const AdminEvent: React.FC = () => {
  const { content, updateContent } = useContent();
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'galeri' | 'proker' | 'pelatihan' | 'seminar' | 'kerjasama') || 'galeri';
  const [isSaving, setIsSaving] = useState(false);
  
  // --- STATE LISTS ---
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(content.images.gallery || []);
  const [prokerList, setProkerList] = useState<ProkerItem[]>(content.proker || []);
  const [trainingList, setTrainingList] = useState<TrainingItem[]>(content.trainings || []);
  const [seminarList, setSeminarList] = useState<SeminarItem[]>(content.seminars || []);
  const [partnershipList, setPartnershipList] = useState<PartnershipItem[]>(content.partnerships || []);

  // --- MODAL & FORM STATES: GALLERY ---
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({});

  // --- MODAL & FORM STATES: PROKER ---
  const [isProkerModalOpen, setIsProkerModalOpen] = useState(false);
  const [editingProker, setEditingProker] = useState<ProkerItem | null>(null);
  const [prokerForm, setProkerForm] = useState<Partial<ProkerItem>>({});

  // --- MODAL & FORM STATES: PELATIHAN ---
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<TrainingItem | null>(null);
  const [trainingForm, setTrainingForm] = useState<Partial<TrainingItem>>({});

  // --- MODAL & FORM STATES: SEMINAR ---
  const [isSeminarModalOpen, setIsSeminarModalOpen] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<SeminarItem | null>(null);
  const [seminarForm, setSeminarForm] = useState<Partial<SeminarItem>>({});

  // --- MODAL & FORM STATES: KERJASAMA ---
  const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);
  const [editingPartnership, setEditingPartnership] = useState<PartnershipItem | null>(null);
  const [partnershipForm, setPartnershipForm] = useState<Partial<PartnershipItem>>({});

  // --- GLOBAL SAVE ---
  const handleSave = () => {
    setIsSaving(true);
    updateContent((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        gallery: galleryList
      },
      proker: prokerList,
      trainings: trainingList,
      seminars: seminarList,
      partnerships: partnershipList
    }));
    setTimeout(() => {
      setIsSaving(false);
      alert('Perubahan Event, Pelatihan, Seminar & Mitra berhasil disimpan!');
    }, 500);
  };

  // --- HANDLERS: GALLERY ---
  const handleOpenGalleryModal = (item?: GalleryItem) => {
    if (item) {
      setEditingGallery(item);
      setGalleryForm(item);
    } else {
      setEditingGallery(null);
      setGalleryForm({
        id: `gal-${Date.now()}`,
        url: '',
        cat: 'Kegiatan',
        title: '',
        year: new Date().getFullYear().toString(),
      });
    }
    setIsGalleryModalOpen(true);
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingGallery) {
      updatedList = galleryList.map(item => item.id === editingGallery.id ? galleryForm as GalleryItem : item);
    } else {
      updatedList = [galleryForm as GalleryItem, ...galleryList];
    }
    setGalleryList(updatedList);
    setIsGalleryModalOpen(false);
  };

  const handleDeleteGallery = (item: GalleryItem) => {
    setGalleryList(galleryList.filter(t => t.id !== item.id));
  };

  // --- HANDLERS: PROKER ---
  const handleOpenProkerModal = (item?: ProkerItem) => {
    if (item) {
      setEditingProker(item);
      setProkerForm(item);
    } else {
      setEditingProker(null);
      setProkerForm({
        id: `pr-${Date.now()}`,
        namaID: '', namaEN: '', jenisID: 'Kegiatan', jenisEN: 'Event',
        penanggungJawab: '', tanggalMulai: '', tanggalSelesai: '',
        durasi: '', status: 'upcoming', descID: '', descEN: '', foto: ''
      });
    }
    setIsProkerModalOpen(true);
  };

  const handleProkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingProker) {
      updatedList = prokerList.map(item => item.id === editingProker.id ? prokerForm as ProkerItem : item);
    } else {
      updatedList = [prokerForm as ProkerItem, ...prokerList];
    }
    setProkerList(updatedList);
    setIsProkerModalOpen(false);
  };

  const handleDeleteProker = (item: ProkerItem) => {
    setProkerList(prokerList.filter(t => t.id !== item.id));
  };

  // --- HANDLERS: PELATIHAN ---
  const handleOpenTrainingModal = (item?: TrainingItem) => {
    if (item) {
      setEditingTraining(item);
      setTrainingForm(item);
    } else {
      setEditingTraining(null);
      setTrainingForm({
        id: `t-${Date.now()}`,
        titleID: '', titleEN: '', durationID: '', durationEN: '',
        feeID: '', feeEN: '', certID: '', certEN: '', descID: '', descEN: '',
        icon: 'shield', syllabus: [], year: new Date().getFullYear().toString(), status: 'upcoming'
      });
    }
    setIsTrainingModalOpen(true);
  };

  const handleTrainingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingTraining) {
      updatedList = trainingList.map(item => item.id === editingTraining.id ? trainingForm as TrainingItem : item);
    } else {
      updatedList = [trainingForm as TrainingItem, ...trainingList];
    }
    setTrainingList(updatedList);
    setIsTrainingModalOpen(false);
  };

  const handleDeleteTraining = (item: TrainingItem) => {
    setTrainingList(trainingList.filter(t => t.id !== item.id));
  };

  // --- HANDLERS: SEMINAR ---
  const handleOpenSeminarModal = (item?: SeminarItem) => {
    if (item) {
      setEditingSeminar(item);
      setSeminarForm(item);
    } else {
      setEditingSeminar(null);
      setSeminarForm({
        id: `sem-${Date.now()}`,
        titleID: '', titleEN: '', date: '', speaker: '',
        speakerRoleID: '', speakerRoleEN: '', feeID: '', feeEN: '',
        platform: '', status: 'upcoming'
      });
    }
    setIsSeminarModalOpen(true);
  };

  const handleSeminarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingSeminar) {
      updatedList = seminarList.map(item => item.id === editingSeminar.id ? seminarForm as SeminarItem : item);
    } else {
      updatedList = [seminarForm as SeminarItem, ...seminarList];
    }
    setSeminarList(updatedList);
    setIsSeminarModalOpen(false);
  };

  const handleDeleteSeminar = (item: SeminarItem) => {
    setSeminarList(seminarList.filter(s => s.id !== item.id));
  };

  // --- HANDLERS: KERJASAMA ---
  const handleOpenPartnershipModal = (item?: PartnershipItem) => {
    if (item) {
      setEditingPartnership(item);
      setPartnershipForm(item);
    } else {
      setEditingPartnership(null);
      setPartnershipForm({
        id: `part-${Date.now()}`,
        name: '', logoUrl: '', scopeID: '', scopeEN: '',
        descID: '', descEN: '', year: new Date().getFullYear().toString(), status: 'ongoing'
      });
    }
    setIsPartnershipModalOpen(true);
  };

  const handlePartnershipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingPartnership) {
      updatedList = partnershipList.map(item => item.id === editingPartnership.id ? partnershipForm as PartnershipItem : item);
    } else {
      updatedList = [partnershipForm as PartnershipItem, ...partnershipList];
    }
    setPartnershipList(updatedList);
    setIsPartnershipModalOpen(false);
  };

  const handleDeletePartnership = (item: PartnershipItem) => {
    setPartnershipList(partnershipList.filter(p => p.id !== item.id));
  };

  return (
    <div>
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>Pengaturan Event & Kegiatan</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f97316', color: 'var(--admin-text-main)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, opacity: isSaving ? 0.7 : 1 }}
        >
          <Save size={18} />
          {isSaving ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      {/* TAB: GALERI */}
      {activeTab === 'galeri' && (
        <DataTable 
          data={galleryList}
          columns={[
            { key: 'url', label: 'Foto', render: (item) => <img src={item.url} alt={item.title} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> },
            { key: 'title', label: 'Judul Foto' },
            { key: 'cat', label: 'Kategori' },
            { key: 'year', label: 'Tahun' },
          ]}
          onAdd={() => handleOpenGalleryModal()}
          onEdit={handleOpenGalleryModal}
          onDelete={handleDeleteGallery}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Foto Galeri"
        />
      )}

      {/* TAB: PROKER */}
      {activeTab === 'proker' && (
        <DataTable 
          data={prokerList}
          columns={[
            { key: 'namaID', label: 'Nama Program' },
            { key: 'jenisID', label: 'Jenis' },
            { key: 'status', label: 'Status', render: (item) => (
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem', 
                  background: item.status === 'done' ? 'rgba(34, 197, 94, 0.2)' : item.status === 'ongoing' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                  color: item.status === 'done' ? '#4ade80' : item.status === 'ongoing' ? '#60a5fa' : '#fb923c'
                }}>
                  {item.status.toUpperCase()}
                </span>
            )},
            { key: 'tanggalMulai', label: 'Tanggal' },
          ]}
          onAdd={() => handleOpenProkerModal()}
          onEdit={handleOpenProkerModal}
          onDelete={handleDeleteProker}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Program Kerja"
        />
      )}

      {/* TAB: PELATIHAN */}
      {activeTab === 'pelatihan' && (
        <DataTable 
          data={trainingList}
          columns={[
            { key: 'titleID', label: 'Nama Pelatihan' },
            { key: 'durationID', label: 'Durasi' },
            { key: 'feeID', label: 'Biaya' },
            { key: 'year', label: 'Tahun' },
            { key: 'status', label: 'Status', render: (item) => (
                <span style={{ 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem', 
                  background: item.status === 'done' ? 'rgba(34, 197, 94, 0.2)' : item.status === 'ongoing' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                  color: item.status === 'done' ? '#4ade80' : item.status === 'ongoing' ? '#60a5fa' : '#fb923c'
                }}>
                  {item.status.toUpperCase()}
                </span>
            )},
          ]}
          onAdd={() => handleOpenTrainingModal()}
          onEdit={handleOpenTrainingModal}
          onDelete={handleDeleteTraining}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Pelatihan K3"
        />
      )}

      {/* TAB: SEMINAR */}
      {activeTab === 'seminar' && (
        <DataTable 
          data={seminarList}
          columns={[
            { key: 'titleID', label: 'Judul Seminar' },
            { key: 'speaker', label: 'Pembicara' },
            { key: 'date', label: 'Tanggal Pelaksanaan' },
            { key: 'platform', label: 'Tempat / Media' },
          ]}
          onAdd={() => handleOpenSeminarModal()}
          onEdit={handleOpenSeminarModal}
          onDelete={handleDeleteSeminar}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Seminar"
        />
      )}

      {/* TAB: KERJASAMA */}
      {activeTab === 'kerjasama' && (
        <DataTable 
          data={partnershipList}
          columns={[
            { key: 'logoUrl', label: 'Logo', render: (item) => <img src={item.logoUrl} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} /> },
            { key: 'name', label: 'Nama Instansi / Mitra' },
            { key: 'scopeID', label: 'Ruang Lingkup Kerjasama' },
            { key: 'year', label: 'Tahun' },
          ]}
          onAdd={() => handleOpenPartnershipModal()}
          onEdit={handleOpenPartnershipModal}
          onDelete={handleDeletePartnership}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Mitra Kerjasama"
        />
      )}

      {/* MODAL: GALERI */}
      <ModalForm
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        onSubmit={handleGallerySubmit}
        title={editingGallery ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
      >
        <ImageInput 
          label="File Foto"
          value={galleryForm.url}
          onChange={(base64) => setGalleryForm({ ...galleryForm, url: base64 })}
        />
        <div className="admin-input-group">
          <label>Judul Foto / Deskripsi Singkat</label>
          <input type="text" required value={galleryForm.title || ''} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} />
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Kategori</label>
            <select 
              value={galleryForm.cat || 'Kegiatan'} 
              onChange={e => setGalleryForm({...galleryForm, cat: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="Kegiatan">Kegiatan</option>
              <option value="Pelatihan">Pelatihan</option>
              <option value="Seminar">Seminar</option>
              <option value="Kunjungan Industri">Kunjungan Industri</option>
              <option value="Studi Banding">Studi Banding</option>
            </select>
          </div>
          <div className="admin-input-group">
            <label>Tahun</label>
            <input type="text" required value={galleryForm.year || ''} onChange={e => setGalleryForm({...galleryForm, year: e.target.value})} />
          </div>
        </div>
      </ModalForm>

      {/* MODAL: PROKER */}
      <ModalForm
        isOpen={isProkerModalOpen}
        onClose={() => setIsProkerModalOpen(false)}
        onSubmit={handleProkerSubmit}
        title={editingProker ? 'Edit Program Kerja' : 'Tambah Program Kerja'}
      >
        <ImageInput 
          label="Poster / Foto Kegiatan (Opsional)"
          value={prokerForm.foto}
          onChange={(base64) => setProkerForm({ ...prokerForm, foto: base64 })}
        />
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Nama Program (ID)</label>
            <input type="text" required value={prokerForm.namaID || ''} onChange={e => setProkerForm({...prokerForm, namaID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Nama Program (EN)</label>
            <input type="text" required value={prokerForm.namaEN || ''} onChange={e => setProkerForm({...prokerForm, namaEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Jenis Kegiatan (ID)</label>
            <input type="text" required value={prokerForm.jenisID || ''} onChange={e => setProkerForm({...prokerForm, jenisID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Jenis Kegiatan (EN)</label>
            <input type="text" required value={prokerForm.jenisEN || ''} onChange={e => setProkerForm({...prokerForm, jenisEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-auto" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Status</label>
            <select 
              value={prokerForm.status || 'upcoming'} 
              onChange={e => setProkerForm({...prokerForm, status: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="upcoming">Akan Datang</option>
              <option value="ongoing">Sedang Berlangsung</option>
              <option value="done">Selesai</option>
            </select>
          </div>
          <div className="admin-input-group">
            <label>Penanggung Jawab</label>
            <input type="text" required value={prokerForm.penanggungJawab || ''} onChange={e => setProkerForm({...prokerForm, penanggungJawab: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Durasi (misal: 2 hari)</label>
            <input type="text" required value={prokerForm.durasi || ''} onChange={e => setProkerForm({...prokerForm, durasi: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Tanggal Mulai</label>
            <input type="date" required value={prokerForm.tanggalMulai || ''} onChange={e => setProkerForm({...prokerForm, tanggalMulai: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Tanggal Selesai</label>
            <input type="date" required value={prokerForm.tanggalSelesai || ''} onChange={e => setProkerForm({...prokerForm, tanggalSelesai: e.target.value})} />
          </div>
        </div>
        <div className="admin-input-group">
          <label>Deskripsi (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={prokerForm.descID || ''} onChange={e => setProkerForm({...prokerForm, descID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Deskripsi (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={prokerForm.descEN || ''} onChange={e => setProkerForm({...prokerForm, descEN: e.target.value})} />
        </div>
      </ModalForm>

      {/* MODAL: PELATIHAN */}
      <ModalForm
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        onSubmit={handleTrainingSubmit}
        title={editingTraining ? 'Edit Pelatihan K3' : 'Tambah Pelatihan K3'}
      >
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Nama Pelatihan (ID)</label>
            <input type="text" required value={trainingForm.titleID || ''} onChange={e => setTrainingForm({...trainingForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Nama Pelatihan (EN)</label>
            <input type="text" required value={trainingForm.titleEN || ''} onChange={e => setTrainingForm({...trainingForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Durasi (ID) - misal: 2 Hari</label>
            <input type="text" required value={trainingForm.durationID || ''} onChange={e => setTrainingForm({...trainingForm, durationID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Durasi (EN)</label>
            <input type="text" required value={trainingForm.durationEN || ''} onChange={e => setTrainingForm({...trainingForm, durationEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Biaya (ID)</label>
            <input type="text" required value={trainingForm.feeID || ''} onChange={e => setTrainingForm({...trainingForm, feeID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Biaya (EN)</label>
            <input type="text" required value={trainingForm.feeEN || ''} onChange={e => setTrainingForm({...trainingForm, feeEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Sertifikat (ID)</label>
            <input type="text" required value={trainingForm.certID || ''} onChange={e => setTrainingForm({...trainingForm, certID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Sertifikat (EN)</label>
            <input type="text" required value={trainingForm.certEN || ''} onChange={e => setTrainingForm({...trainingForm, certEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-auto" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Ikon / Visual</label>
            <select 
              value={trainingForm.icon || 'shield'} 
              onChange={e => setTrainingForm({...trainingForm, icon: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="shield">Shield (Keamanan/Umum)</option>
              <option value="flame">Flame (Kebakaran)</option>
              <option value="firstaid">Heart/First-Aid (Medis/Kesehatan)</option>
            </select>
          </div>
          <div className="admin-input-group">
            <label>Tahun Pelaksanaan</label>
            <input type="text" required value={trainingForm.year || ''} onChange={e => setTrainingForm({...trainingForm, year: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Status</label>
            <select 
              value={trainingForm.status || 'upcoming'} 
              onChange={e => setTrainingForm({...trainingForm, status: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="upcoming">Akan Datang</option>
              <option value="ongoing">Sedang Berlangsung</option>
              <option value="done">Selesai</option>
            </select>
          </div>
        </div>
        <div className="admin-input-group">
          <label>Materi / Silabus (Satu baris untuk setiap poin silabus)</label>
          <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} placeholder="Contoh:&#10;Teori Api & Kebakaran&#10;Penggunaan APAR&#10;Simulasi Evakuasi" value={(trainingForm.syllabus || []).join('\n')} onChange={e => setTrainingForm({...trainingForm, syllabus: e.target.value.split('\n').filter(Boolean)})} />
        </div>
        <div className="admin-input-group">
          <label>Deskripsi (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={trainingForm.descID || ''} onChange={e => setTrainingForm({...trainingForm, descID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Deskripsi (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={trainingForm.descEN || ''} onChange={e => setTrainingForm({...trainingForm, descEN: e.target.value})} />
        </div>
      </ModalForm>

      {/* MODAL: SEMINAR */}
      <ModalForm
        isOpen={isSeminarModalOpen}
        onClose={() => setIsSeminarModalOpen(false)}
        onSubmit={handleSeminarSubmit}
        title={editingSeminar ? 'Edit Seminar' : 'Tambah Seminar'}
      >
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Seminar (ID)</label>
            <input type="text" required value={seminarForm.titleID || ''} onChange={e => setSeminarForm({...seminarForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Seminar (EN)</label>
            <input type="text" required value={seminarForm.titleEN || ''} onChange={e => setSeminarForm({...seminarForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Tanggal Pelaksanaan</label>
            <input type="date" required value={seminarForm.date || ''} onChange={e => setSeminarForm({...seminarForm, date: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Pembicara / Narasumber</label>
            <input type="text" required value={seminarForm.speaker || ''} onChange={e => setSeminarForm({...seminarForm, speaker: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Pekerjaan/Jabatan Pembicara (ID)</label>
            <input type="text" required value={seminarForm.speakerRoleID || ''} onChange={e => setSeminarForm({...seminarForm, speakerRoleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Pekerjaan/Jabatan Pembicara (EN)</label>
            <input type="text" required value={seminarForm.speakerRoleEN || ''} onChange={e => setSeminarForm({...seminarForm, speakerRoleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Biaya (ID)</label>
            <input type="text" required value={seminarForm.feeID || ''} onChange={e => setSeminarForm({...seminarForm, feeID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Biaya (EN)</label>
            <input type="text" required value={seminarForm.feeEN || ''} onChange={e => setSeminarForm({...seminarForm, feeEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Tempat / Media / Platform</label>
            <input type="text" required placeholder="Contoh: Zoom Webinar / Aula Kampus" value={seminarForm.platform || ''} onChange={e => setSeminarForm({...seminarForm, platform: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Status</label>
            <select 
              value={seminarForm.status || 'upcoming'} 
              onChange={e => setSeminarForm({...seminarForm, status: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="upcoming">Akan Datang</option>
              <option value="ongoing">Sedang Berlangsung</option>
              <option value="done">Selesai</option>
            </select>
          </div>
        </div>
      </ModalForm>

      {/* MODAL: KERJASAMA */}
      <ModalForm
        isOpen={isPartnershipModalOpen}
        onClose={() => setIsPartnershipModalOpen(false)}
        onSubmit={handlePartnershipSubmit}
        title={editingPartnership ? 'Edit Mitra Kerjasama' : 'Tambah Mitra Kerjasama'}
      >
        <ImageInput 
          label="Logo Instansi / Mitra"
          value={partnershipForm.logoUrl}
          onChange={(base64) => setPartnershipForm({ ...partnershipForm, logoUrl: base64 })}
        />
        <div className="admin-input-group">
          <label>Nama Instansi / Perusahaan</label>
          <input type="text" required value={partnershipForm.name || ''} onChange={e => setPartnershipForm({...partnershipForm, name: e.target.value})} />
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Ruang Lingkup Kerjasama (ID)</label>
            <input type="text" required placeholder="Contoh: Sertifikasi pelatihan dasar, dll." value={partnershipForm.scopeID || ''} onChange={e => setPartnershipForm({...partnershipForm, scopeID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Ruang Lingkup Kerjasama (EN)</label>
            <input type="text" required placeholder="Contoh: Basic training certifications, etc." value={partnershipForm.scopeEN || ''} onChange={e => setPartnershipForm({...partnershipForm, scopeEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Tahun Mulai Kerjasama</label>
            <input type="text" required value={partnershipForm.year || ''} onChange={e => setPartnershipForm({...partnershipForm, year: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Status</label>
            <select 
              value={partnershipForm.status || 'ongoing'} 
              onChange={e => setPartnershipForm({...partnershipForm, status: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="upcoming">Rencana Mitra</option>
              <option value="ongoing">Aktif</option>
              <option value="done">Mantan Mitra / Selesai</option>
            </select>
          </div>
        </div>
        <div className="admin-input-group">
          <label>Deskripsi Detail Kerjasama (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={partnershipForm.descID || ''} onChange={e => setPartnershipForm({...partnershipForm, descID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Deskripsi Detail Kerjasama (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={partnershipForm.descEN || ''} onChange={e => setPartnershipForm({...partnershipForm, descEN: e.target.value})} />
        </div>
      </ModalForm>
    </div>
  );
};

export default AdminEvent;
