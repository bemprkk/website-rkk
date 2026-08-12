import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { DataTable } from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import ImageInput from '../components/ImageInput';
import { Save, Edit } from 'lucide-react';
import type { TeamMember, AlumniItem } from '../../types';

import { useSearchParams } from 'react-router-dom';

const AdminProfil: React.FC = () => {
  const { content, updateContent } = useContent();
  const [searchParams] = useSearchParams();
  
  // Initialize from URL or default to 'tim'
  const urlTab = searchParams.get('tab') as 'tim' | 'alumni' | 'sejarah' | 'misi' | 'akreditasi';
  const [activeTab, setActiveTab] = useState<'tim' | 'alumni' | 'sejarah' | 'misi' | 'akreditasi'>(urlTab || 'tim');

  // Sync state when URL changes (from sidebar clicks)
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const [isSaving, setIsSaving] = useState(false);

  // --- TAB 1: Kepengurusan (Tim) ---
  const [teamList, setTeamList] = useState<TeamMember[]>(content.images.team || []);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamItem, setEditingTeamItem] = useState<TeamMember | null>(null);
  const [teamFormData, setTeamFormData] = useState<Partial<TeamMember>>({});

  // --- TAB 2: Alumni ---
  const [alumniList, setAlumniList] = useState<AlumniItem[]>(content.alumni || []);
  const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);
  const [editingAlumniItem, setEditingAlumniItem] = useState<AlumniItem | null>(null);
  const [alumniFormData, setAlumniFormData] = useState<Partial<AlumniItem>>({});

  // --- TAB 3: Sejarah ---
  const [historyID, setHistoryID] = useState(content.translations.ID.history || { subtitle: '', title: '', titleGradient: '', p1: '', p2: '', timeline: [] });
  const [historyEN, setHistoryEN] = useState(content.translations.EN.history || { subtitle: '', title: '', titleGradient: '', p1: '', p2: '', timeline: [] });
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [editingTimelineIdx, setEditingTimelineIdx] = useState<number | null>(null);
  const [timelineForm, setTimelineForm] = useState({ year: '', titleID: '', titleEN: '', descID: '', descEN: '' });

  // --- TAB 4: Visi & Misi (About) ---
  const [aboutID, setAboutID] = useState(content.translations.ID.about || { subtitle: '', title: '', titleGradient: '', desc: '', reliability: '', reliabilityVal: '', features: [] });
  const [aboutEN, setAboutEN] = useState(content.translations.EN.about || { subtitle: '', title: '', titleGradient: '', desc: '', reliability: '', reliabilityVal: '', features: [] });
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeatureIdx, setEditingFeatureIdx] = useState<number | null>(null);
  const [featureForm, setFeatureForm] = useState({ titleID: '', titleEN: '', descID: '', descEN: '' });

  // --- TAB 5: Akreditasi ---
  const [accredID, setAccredID] = useState(content.translations.ID.accreditation || { subtitle: '', title: '', titleGradient: '', desc: '', statusLabel: '', statusVal: '', skLabel: '', skVal: '', expLabel: '', expVal: '' });
  const [accredEN, setAccredEN] = useState(content.translations.EN.accreditation || { subtitle: '', title: '', titleGradient: '', desc: '', statusLabel: '', statusVal: '', skLabel: '', skVal: '', expLabel: '', expVal: '' });
  const [accredImage, setAccredImage] = useState(content.images.accreditationImage || '');

  // --- GLOBAL SAVE HANDLER ---
  const handleSave = () => {
    setIsSaving(true);
    updateContent((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        team: teamList,
        accreditationImage: accredImage
      },
      alumni: alumniList,
      translations: {
        ...prev.translations,
        ID: {
          ...prev.translations.ID,
          history: historyID,
          about: aboutID,
          accreditation: accredID
        },
        EN: {
          ...prev.translations.EN,
          history: historyEN,
          about: aboutEN,
          accreditation: accredEN
        }
      }
    }));
    setTimeout(() => {
      setIsSaving(false);
      alert('Perubahan Profil berhasil disimpan!');
    }, 500);
  };

  // --- HANDLERS: TAB 1 (Team) ---
  const handleOpenTeamModal = (item?: TeamMember) => {
    if (item) {
      setEditingTeamItem(item);
      setTeamFormData(item);
    } else {
      setEditingTeamItem(null);
      setTeamFormData({
        id: `tm-${Date.now()}`,
        name: '',
        roleID: '',
        roleEN: '',
        image: '',
        year: new Date().getFullYear().toString(),
        socials: { linkedin: '', instagram: '' }
      });
    }
    setIsTeamModalOpen(true);
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingTeamItem) {
      updatedList = teamList.map(item => item.id === editingTeamItem.id ? teamFormData as TeamMember : item);
    } else {
      updatedList = [teamFormData as TeamMember, ...teamList];
    }
    setTeamList(updatedList);
    setIsTeamModalOpen(false);
  };

  const handleDeleteTeam = (item: TeamMember) => {
    setTeamList(teamList.filter(t => t.id !== item.id));
  };

  // --- HANDLERS: TAB 2 (Alumni) ---
  const handleOpenAlumniModal = (item?: AlumniItem) => {
    if (item) {
      setEditingAlumniItem(item);
      setAlumniFormData(item);
    } else {
      setEditingAlumniItem(null);
      setAlumniFormData({
        id: `al-${Date.now()}`,
        name: '',
        tahun: new Date().getFullYear().toString(),
        kuliah: '',
        kerja: '',
        foto: ''
      });
    }
    setIsAlumniModalOpen(true);
  };

  const handleAlumniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingAlumniItem) {
      updatedList = alumniList.map(item => item.id === editingAlumniItem.id ? alumniFormData as AlumniItem : item);
    } else {
      updatedList = [alumniFormData as AlumniItem, ...alumniList];
    }
    setAlumniList(updatedList);
    setIsAlumniModalOpen(false);
  };

  const handleDeleteAlumni = (item: AlumniItem) => {
    setAlumniList(alumniList.filter(a => a.id !== item.id));
  };

  // --- HANDLERS: TAB 3 (Timeline Sejarah) ---
  const handleOpenTimelineModal = (index?: number) => {
    if (index !== undefined) {
      setEditingTimelineIdx(index);
      setTimelineForm({
        year: historyID.timeline[index]?.year || '',
        titleID: historyID.timeline[index]?.title || '',
        titleEN: historyEN.timeline[index]?.title || '',
        descID: historyID.timeline[index]?.desc || '',
        descEN: historyEN.timeline[index]?.desc || ''
      });
    } else {
      setEditingTimelineIdx(null);
      setTimelineForm({ year: '', titleID: '', titleEN: '', descID: '', descEN: '' });
    }
    setIsTimelineModalOpen(true);
  };

  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timelineID = [...(historyID.timeline || [])];
    const timelineEN = [...(historyEN.timeline || [])];

    const newItemID = { year: timelineForm.year, title: timelineForm.titleID, desc: timelineForm.descID };
    const newItemEN = { year: timelineForm.year, title: timelineForm.titleEN, desc: timelineForm.descEN };

    if (editingTimelineIdx !== null) {
      timelineID[editingTimelineIdx] = newItemID;
      timelineEN[editingTimelineIdx] = newItemEN;
    } else {
      timelineID.push(newItemID);
      timelineEN.push(newItemEN);
    }

    setHistoryID({ ...historyID, timeline: timelineID });
    setHistoryEN({ ...historyEN, timeline: timelineEN });
    setIsTimelineModalOpen(false);
  };

  const handleDeleteTimeline = (index: number) => {
    const timelineID = historyID.timeline.filter((_, idx) => idx !== index);
    const timelineEN = historyEN.timeline.filter((_, idx) => idx !== index);
    setHistoryID({ ...historyID, timeline: timelineID });
    setHistoryEN({ ...historyEN, timeline: timelineEN });
  };

  // --- HANDLERS: TAB 4 (Features Visi Misi) ---
  const handleOpenFeatureModal = (index: number) => {
    setEditingFeatureIdx(index);
    setFeatureForm({
      titleID: aboutID.features[index]?.title || '',
      titleEN: aboutEN.features[index]?.title || '',
      descID: aboutID.features[index]?.desc || '',
      descEN: aboutEN.features[index]?.desc || ''
    });
    setIsFeatureModalOpen(true);
  };

  const handleFeatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFeatureIdx !== null) {
      const featID = [...aboutID.features];
      const featEN = [...aboutEN.features];
      featID[editingFeatureIdx] = { title: featureForm.titleID, desc: featureForm.descID };
      featEN[editingFeatureIdx] = { title: featureForm.titleEN, desc: featureForm.descEN };
      setAboutID({ ...aboutID, features: featID });
      setAboutEN({ ...aboutEN, features: featEN });
    }
    setIsFeatureModalOpen(false);
  };

  return (
    <div>
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>Pengaturan Profil</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f97316', color: 'var(--admin-text-main)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, opacity: isSaving ? 0.7 : 1 }}
        >
          <Save size={18} />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* TAB CONTENT: KEPENGURUSAN */}
      {activeTab === 'tim' && (
        <DataTable 
          data={teamList}
          columns={[
            { key: 'image', label: 'Foto', render: (item) => <img src={item.image || 'https://i.pravatar.cc/150'} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> },
            { key: 'name', label: 'Nama Lengkap' },
            { key: 'roleID', label: 'Jabatan (ID)' },
            { key: 'year', label: 'Periode' },
          ]}
          onAdd={() => handleOpenTeamModal()}
          onEdit={handleOpenTeamModal}
          onDelete={handleDeleteTeam}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Anggota"
        />
      )}

      {/* TAB 2: ALUMNI */}
      {activeTab === 'alumni' && (
        <DataTable 
          data={alumniList}
          columns={[
            { key: 'foto', label: 'Foto', render: (item) => <img src={item.foto || 'https://i.pravatar.cc/150'} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> },
            { key: 'name', label: 'Nama' },
            { key: 'tahun', label: 'Tahun Lulus' },
            { key: 'kuliah', label: 'Kuliah Lanjutan' },
            { key: 'kerja', label: 'Pekerjaan' },
          ]}
          onAdd={() => handleOpenAlumniModal()}
          onEdit={handleOpenAlumniModal}
          onDelete={handleDeleteAlumni}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Alumni"
        />
      )}

      {/* TAB 3: SEJARAH */}
      {activeTab === 'sejarah' && (
        <div className="admin-grid-auto">
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Teks Sejarah</h2>
            <div className="admin-grid-auto">
              <div>
                <h3 style={{ color: '#f97316', fontSize: '1.1rem', marginBottom: '1rem' }}>🇮🇩 Bahasa Indonesia</h3>
                <div className="admin-input-group">
                  <label>Sub-judul</label>
                  <input type="text" value={historyID.subtitle} onChange={e => setHistoryID({...historyID, subtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Putih</label>
                  <input type="text" value={historyID.title} onChange={e => setHistoryID({...historyID, title: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Gradasi</label>
                  <input type="text" value={historyID.titleGradient} onChange={e => setHistoryID({...historyID, titleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Paragraf 1</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={historyID.p1} onChange={e => setHistoryID({...historyID, p1: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Paragraf 2</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={historyID.p2} onChange={e => setHistoryID({...historyID, p2: e.target.value})} />
                </div>
              </div>
              <div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '1rem' }}>🇬🇧 English</h3>
                <div className="admin-input-group">
                  <label>Subtitle</label>
                  <input type="text" value={historyEN.subtitle} onChange={e => setHistoryEN({...historyEN, subtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>White Title</label>
                  <input type="text" value={historyEN.title} onChange={e => setHistoryEN({...historyEN, title: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Gradient Title</label>
                  <input type="text" value={historyEN.titleGradient} onChange={e => setHistoryEN({...historyEN, titleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Paragraph 1</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={historyEN.p1} onChange={e => setHistoryEN({...historyEN, p1: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Paragraph 2</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={historyEN.p2} onChange={e => setHistoryEN({...historyEN, p2: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Table */}
          <DataTable 
            data={(historyID.timeline || []).map((t, idx) => ({ id: idx.toString(), year: t.year, title: t.title, desc: t.desc, index: idx }))}
            columns={[
              { key: 'year', label: 'Tahun' },
              { key: 'title', label: 'Judul (ID)' },
              { key: 'desc', label: 'Deskripsi (ID)', render: (item) => item.desc.substring(0, 80) + '...' }
            ]}
            onAdd={() => handleOpenTimelineModal()}
            onEdit={(item: any) => handleOpenTimelineModal(item.index)}
            onDelete={(item: any) => handleDeleteTimeline(item.index)}
            keyExtractor={(item) => item.id}
            addLabel="Tambah Item Timeline"
          />
        </div>
      )}

      {/* TAB 4: VISI MISI / TENTANG */}
      {activeTab === 'misi' && (
        <div className="admin-grid-auto">
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Visi & Misi (Tentang Kami)</h2>
            <div className="admin-grid-auto">
              <div>
                <h3 style={{ color: '#f97316', fontSize: '1.1rem', marginBottom: '1rem' }}>🇮🇩 Bahasa Indonesia</h3>
                <div className="admin-input-group">
                  <label>Sub-judul</label>
                  <input type="text" value={aboutID.subtitle} onChange={e => setAboutID({...aboutID, subtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Putih</label>
                  <input type="text" value={aboutID.title} onChange={e => setAboutID({...aboutID, title: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Gradasi</label>
                  <input type="text" value={aboutID.titleGradient} onChange={e => setAboutID({...aboutID, titleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Deskripsi Singkat</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={aboutID.desc} onChange={e => setAboutID({...aboutID, desc: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Teks Keaktifan Anggota</label>
                  <input type="text" value={aboutID.reliability} onChange={e => setAboutID({...aboutID, reliability: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Nilai Keaktifan (%)</label>
                  <input type="text" value={aboutID.reliabilityVal} onChange={e => setAboutID({...aboutID, reliabilityVal: e.target.value})} />
                </div>
              </div>
              <div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '1rem' }}>🇬🇧 English</h3>
                <div className="admin-input-group">
                  <label>Subtitle</label>
                  <input type="text" value={aboutEN.subtitle} onChange={e => setAboutEN({...aboutEN, subtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>White Title</label>
                  <input type="text" value={aboutEN.title} onChange={e => setAboutEN({...aboutEN, title: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Gradient Title</label>
                  <input type="text" value={aboutEN.titleGradient} onChange={e => setAboutEN({...aboutEN, titleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Short Description</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={aboutEN.desc} onChange={e => setAboutEN({...aboutEN, desc: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Member Activity Text</label>
                  <input type="text" value={aboutEN.reliability} onChange={e => setAboutEN({...aboutEN, reliability: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Activity Value (%)</label>
                  <input type="text" value={aboutEN.reliabilityVal} onChange={e => setAboutEN({...aboutEN, reliabilityVal: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Features / Pilar Utama */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>3 Fitur / Pilar Utama</h2>
            <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
              {(aboutID.features || []).map((feat: any, idx: number) => (
                <div key={idx} style={{ background: 'var(--admin-input-bg)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--admin-card-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem', color: '#f97316', fontSize: '1.1rem' }}>Pilar {idx+1}: {feat.title} / {aboutEN.features[idx]?.title}</h3>
                    <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>{feat.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleOpenFeatureModal(idx)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    <Edit size={14} /> Edit Pilar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AKREDITASI */}
      {activeTab === 'akreditasi' && (
        <div className="admin-grid-auto">
          {/* Certificate Image Upload */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Sertifikat Akreditasi</h2>
            <div style={{ maxWidth: '400px' }}>
              <ImageInput label="Foto Sertifikat Akreditasi" value={accredImage} onChange={setAccredImage} />
            </div>
          </div>

          {/* Texts Section */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Detail Akreditasi</h2>
            <div className="admin-grid-auto">
              <div>
                <h3 style={{ color: '#f97316', fontSize: '1.1rem', marginBottom: '1rem' }}>🇮🇩 Bahasa Indonesia</h3>
                <div className="admin-input-group">
                  <label>Sub-judul</label>
                  <input type="text" value={accredID.subtitle} onChange={e => setAccredID({...accredID, subtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Putih</label>
                  <input type="text" value={accredID.title} onChange={e => setAccredID({...accredID, title: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Gradasi</label>
                  <input type="text" value={accredID.titleGradient} onChange={e => setAccredID({...accredID, titleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Deskripsi Akreditasi</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={accredID.desc} onChange={e => setAccredID({...accredID, desc: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Label Peringkat (misal: "Peringkat Akreditasi")</label>
                  <input type="text" value={accredID.statusLabel} onChange={e => setAccredID({...accredID, statusLabel: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Peringkat (misal: "Unggul (A)")</label>
                  <input type="text" value={accredID.statusVal} onChange={e => setAccredID({...accredID, statusVal: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Label Nomor SK</label>
                  <input type="text" value={accredID.skLabel} onChange={e => setAccredID({...accredID, skLabel: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Nomor SK</label>
                  <input type="text" value={accredID.skVal} onChange={e => setAccredID({...accredID, skVal: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Label Masa Berlaku</label>
                  <input type="text" value={accredID.expLabel} onChange={e => setAccredID({...accredID, expLabel: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Masa Berlaku</label>
                  <input type="text" value={accredID.expVal} onChange={e => setAccredID({...accredID, expVal: e.target.value})} />
                </div>
              </div>
              <div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '1rem' }}>🇬🇧 English</h3>
                <div className="admin-input-group">
                  <label>Subtitle</label>
                  <input type="text" value={accredEN.subtitle} onChange={e => setAccredEN({...accredEN, subtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>White Title</label>
                  <input type="text" value={accredEN.title} onChange={e => setAccredEN({...accredEN, title: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Gradient Title</label>
                  <input type="text" value={accredEN.titleGradient} onChange={e => setAccredEN({...accredEN, titleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Accreditation Description</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={accredEN.desc} onChange={e => setAccredEN({...accredEN, desc: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Rank Label</label>
                  <input type="text" value={accredEN.statusLabel} onChange={e => setAccredEN({...accredEN, statusLabel: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Rank (e.g. "Excellent (A)")</label>
                  <input type="text" value={accredEN.statusVal} onChange={e => setAccredEN({...accredEN, statusVal: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>SK Number Label</label>
                  <input type="text" value={accredEN.skLabel} onChange={e => setAccredEN({...accredEN, skLabel: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>SK Number</label>
                  <input type="text" value={accredEN.skVal} onChange={e => setAccredEN({...accredEN, skVal: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Expiry Label</label>
                  <input type="text" value={accredEN.expLabel} onChange={e => setAccredEN({...accredEN, expLabel: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Expiry Date</label>
                  <input type="text" value={accredEN.expVal} onChange={e => setAccredEN({...accredEN, expVal: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH/EDIT TIM --- */}
      <ModalForm
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onSubmit={handleTeamSubmit}
        title={editingTeamItem ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}
      >
        <ImageInput 
          label="Foto Profil"
          value={teamFormData.image}
          onChange={(base64) => setTeamFormData({ ...teamFormData, image: base64 })}
        />
        <div className="admin-input-group">
          <label>Nama Lengkap</label>
          <input type="text" required value={teamFormData.name || ''} onChange={e => setTeamFormData({...teamFormData, name: e.target.value})} />
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Jabatan (ID)</label>
            <input type="text" required value={teamFormData.roleID || ''} onChange={e => setTeamFormData({...teamFormData, roleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Jabatan (EN)</label>
            <input type="text" required value={teamFormData.roleEN || ''} onChange={e => setTeamFormData({...teamFormData, roleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-input-group">
          <label>Tahun / Periode</label>
          <input type="text" required placeholder="Contoh: 2025" value={teamFormData.year || ''} onChange={e => setTeamFormData({...teamFormData, year: e.target.value})} />
        </div>
        <h4 style={{ margin: '1rem 0 0.5rem', color: 'var(--admin-text-muted)' }}>Sosial Media (Opsional)</h4>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Instagram URL</label>
            <input type="text" value={teamFormData.socials?.instagram || ''} onChange={e => setTeamFormData({...teamFormData, socials: { ...teamFormData.socials, instagram: e.target.value }})} />
          </div>
          <div className="admin-input-group">
            <label>LinkedIn URL</label>
            <input type="text" value={teamFormData.socials?.linkedin || ''} onChange={e => setTeamFormData({...teamFormData, socials: { ...teamFormData.socials, linkedin: e.target.value }})} />
          </div>
        </div>
      </ModalForm>

      {/* --- MODAL TAMBAH/EDIT ALUMNI --- */}
      <ModalForm
        isOpen={isAlumniModalOpen}
        onClose={() => setIsAlumniModalOpen(false)}
        onSubmit={handleAlumniSubmit}
        title={editingAlumniItem ? 'Edit Alumni' : 'Tambah Alumni'}
      >
        <ImageInput 
          label="Foto Profil (Opsional)"
          value={alumniFormData.foto}
          onChange={(base64) => setAlumniFormData({ ...alumniFormData, foto: base64 })}
        />
        <div className="admin-input-group">
          <label>Nama Lengkap</label>
          <input type="text" required value={alumniFormData.name || ''} onChange={e => setAlumniFormData({...alumniFormData, name: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Tahun Kelulusan</label>
          <input type="text" required placeholder="Contoh: 2024" value={alumniFormData.tahun || ''} onChange={e => setAlumniFormData({...alumniFormData, tahun: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Pendidikan Lanjutan (Universitas)</label>
          <input type="text" required placeholder="Contoh: Universitas Indonesia" value={alumniFormData.kuliah || ''} onChange={e => setAlumniFormData({...alumniFormData, kuliah: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Pekerjaan Saat Ini (Perusahaan)</label>
          <input type="text" required placeholder="Contoh: PT Pertamina - HSE Officer" value={alumniFormData.kerja || ''} onChange={e => setAlumniFormData({...alumniFormData, kerja: e.target.value})} />
        </div>
      </ModalForm>

      {/* --- MODAL TIMELINE ITEM --- */}
      <ModalForm
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        onSubmit={handleTimelineSubmit}
        title={editingTimelineIdx !== null ? 'Edit Item Timeline Sejarah' : 'Tambah Item Timeline Sejarah'}
      >
        <div className="admin-input-group">
          <label>Tahun</label>
          <input type="text" required placeholder="Contoh: 2025" value={timelineForm.year} onChange={e => setTimelineForm({...timelineForm, year: e.target.value})} />
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Kejadian (ID)</label>
            <input type="text" required value={timelineForm.titleID} onChange={e => setTimelineForm({...timelineForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Kejadian (EN)</label>
            <input type="text" required value={timelineForm.titleEN} onChange={e => setTimelineForm({...timelineForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-input-group">
          <label>Keterangan / Deskripsi (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={timelineForm.descID} onChange={e => setTimelineForm({...timelineForm, descID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Keterangan / Deskripsi (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={timelineForm.descEN} onChange={e => setTimelineForm({...timelineForm, descEN: e.target.value})} />
        </div>
      </ModalForm>

      {/* --- MODAL EDIT PILAR VISI MISI --- */}
      <ModalForm
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        onSubmit={handleFeatureSubmit}
        title="Edit Pilar Visi Misi"
      >
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Pilar (ID)</label>
            <input type="text" required value={featureForm.titleID} onChange={e => setFeatureForm({...featureForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Pilar (EN)</label>
            <input type="text" required value={featureForm.titleEN} onChange={e => setFeatureForm({...featureForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-input-group">
          <label>Deskripsi (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={featureForm.descID} onChange={e => setFeatureForm({...featureForm, descID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Deskripsi (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={featureForm.descEN} onChange={e => setFeatureForm({...featureForm, descEN: e.target.value})} />
        </div>
      </ModalForm>
    </div>
  );
};

export default AdminProfil;
