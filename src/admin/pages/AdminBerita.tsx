import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { DataTable } from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import ImageInput from '../components/ImageInput';
import type { ArticleItem, AchievementItem, AwardItem, AnnouncementItem } from '../../types';
import { Save } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const AdminBerita: React.FC = () => {
  const { content, updateContent } = useContent();
  const [searchParams] = useSearchParams();
  
  // Initialize from URL or default to 'artikel'
  const urlTab = searchParams.get('tab') as 'artikel' | 'prestasi' | 'penghargaan' | 'pengumuman';
  const [activeTab, setActiveTab] = useState<'artikel' | 'prestasi' | 'penghargaan' | 'pengumuman'>(urlTab || 'artikel');

  // Sync state when URL changes (from sidebar clicks)
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const [isSaving, setIsSaving] = useState(false);
  
  // --- STATE LISTS ---
  const [articles, setArticles] = useState<ArticleItem[]>(content.articles || []);
  const [achievements, setAchievements] = useState<AchievementItem[]>(content.achievements || []);
  const [awards, setAwards] = useState<AwardItem[]>(content.awards || []);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(content.announcements || []);

  // --- MODAL & FORM STATES: ARTICLE ---
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [articleForm, setArticleForm] = useState<Partial<ArticleItem>>({});

  // --- MODAL & FORM STATES: PRESTASI ---
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementItem | null>(null);
  const [achievementForm, setAchievementForm] = useState<Partial<AchievementItem>>({});

  // --- MODAL & FORM STATES: PENGHARGAAN ---
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<AwardItem | null>(null);
  const [awardForm, setAwardForm] = useState<Partial<AwardItem>>({});

  // --- MODAL & FORM STATES: ANNOUNCEMENT ---
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AnnouncementItem | null>(null);
  const [announcementForm, setAnnouncementForm] = useState<Partial<AnnouncementItem>>({});

  // --- GLOBAL SAVE ---
  const handleSave = () => {
    setIsSaving(true);
    updateContent((prev) => ({
      ...prev,
      articles,
      achievements,
      awards,
      announcements
    }));
    setTimeout(() => {
      setIsSaving(false);
      alert('Perubahan Berita, Prestasi, Penghargaan & Pengumuman berhasil disimpan!');
    }, 500);
  };

  // --- HANDLERS: ARTICLE ---
  const handleOpenArticleModal = (item?: ArticleItem) => {
    if (item) {
      setEditingArticle(item);
      setArticleForm(item);
    } else {
      setEditingArticle(null);
      setArticleForm({
        id: `art-${Date.now()}`,
        titleID: '', titleEN: '', author: '', date: new Date().toISOString().split('T')[0],
        readTimeID: '5 Menit Baca', readTimeEN: '5 Min Read',
        categoryID: '', categoryEN: '',
        summaryID: '', summaryEN: '',
        contentID: [], contentEN: [],
        scope: 'national'
      });
    }
    setIsArticleModalOpen(true);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingArticle) {
      updatedList = articles.map(item => item.id === editingArticle.id ? articleForm as ArticleItem : item);
    } else {
      updatedList = [articleForm as ArticleItem, ...articles];
    }
    setArticles(updatedList);
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (item: ArticleItem) => {
    setArticles(articles.filter(t => t.id !== item.id));
  };

  // --- HANDLERS: PRESTASI ---
  const handleOpenAchievementModal = (item?: AchievementItem) => {
    if (item) {
      setEditingAchievement(item);
      setAchievementForm(item);
    } else {
      setEditingAchievement(null);
      setAchievementForm({
        id: `ac-${Date.now()}`,
        titleID: '', titleEN: '', awardee: '', eventID: '', eventEN: '',
        organizer: '', date: new Date().toISOString().split('T')[0],
        rankID: '', rankEN: '', level: 'national', medal: 'gold', imageUrl: ''
      });
    }
    setIsAchievementModalOpen(true);
  };

  const handleAchievementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingAchievement) {
      updatedList = achievements.map(item => item.id === editingAchievement.id ? achievementForm as AchievementItem : item);
    } else {
      updatedList = [achievementForm as AchievementItem, ...achievements];
    }
    setAchievements(updatedList);
    setIsAchievementModalOpen(false);
  };

  const handleDeleteAchievement = (item: AchievementItem) => {
    setAchievements(achievements.filter(a => a.id !== item.id));
  };

  // --- HANDLERS: PENGHARGAAN ---
  const handleOpenAwardModal = (item?: AwardItem) => {
    if (item) {
      setEditingAward(item);
      setAwardForm(item);
    } else {
      setEditingAward(null);
      setAwardForm({
        id: `aw-${Date.now()}`,
        titleID: '', titleEN: '', descID: '', descEN: '',
        year: new Date().getFullYear().toString(), category: 'organization', imageUrl: ''
      });
    }
    setIsAwardModalOpen(true);
  };

  const handleAwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingAward) {
      updatedList = awards.map(item => item.id === editingAward.id ? awardForm as AwardItem : item);
    } else {
      updatedList = [awardForm as AwardItem, ...awards];
    }
    setAwards(updatedList);
    setIsAwardModalOpen(false);
  };

  const handleDeleteAward = (item: AwardItem) => {
    setAwards(awards.filter(a => a.id !== item.id));
  };

  // --- HANDLERS: ANNOUNCEMENT ---
  const handleOpenAnnouncementModal = (item?: AnnouncementItem) => {
    if (item) {
      setEditingAnnouncement(item);
      setAnnouncementForm(item);
    } else {
      setEditingAnnouncement(null);
      setAnnouncementForm({
        id: `ann-${Date.now()}`,
        titleID: '', titleEN: '', date: new Date().toISOString().split('T')[0],
        urgencyID: 'Umum', urgencyEN: 'Normal',
        contentID: '', contentEN: '', category: 'umum', attachmentUrl: ''
      });
    }
    setIsAnnouncementModalOpen(true);
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedList;
    if (editingAnnouncement) {
      updatedList = announcements.map(item => item.id === editingAnnouncement.id ? announcementForm as AnnouncementItem : item);
    } else {
      updatedList = [announcementForm as AnnouncementItem, ...announcements];
    }
    setAnnouncements(updatedList);
    setIsAnnouncementModalOpen(false);
  };

  const handleDeleteAnnouncement = (item: AnnouncementItem) => {
    setAnnouncements(announcements.filter(t => t.id !== item.id));
  };

  return (
    <div>
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>Berita & Publikasi</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f97316', color: 'var(--admin-text-main)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, opacity: isSaving ? 0.7 : 1 }}
        >
          <Save size={18} />
          {isSaving ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      {/* ARTICLES TAB */}
      {activeTab === 'artikel' && (
        <DataTable 
          data={articles}
          columns={[
            { key: 'titleID', label: 'Judul Artikel' },
            { key: 'categoryID', label: 'Kategori' },
            { key: 'date', label: 'Tanggal' },
            { key: 'author', label: 'Penulis' }
          ]}
          onAdd={() => handleOpenArticleModal()}
          onEdit={handleOpenArticleModal}
          onDelete={handleDeleteArticle}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Artikel Baru"
        />
      )}

      {/* PRESTASI TAB */}
      {activeTab === 'prestasi' && (
        <DataTable 
          data={achievements}
          columns={[
            { key: 'imageUrl', label: 'Foto', render: (item) => item.imageUrl ? <img src={item.imageUrl} alt={item.titleID} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> : <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>No Photo</span> },
            { key: 'titleID', label: 'Prestasi' },
            { key: 'awardee', label: 'Penerima' },
            { key: 'rankID', label: 'Peringkat / Juara' },
            { key: 'date', label: 'Tanggal' },
          ]}
          onAdd={() => handleOpenAchievementModal()}
          onEdit={handleOpenAchievementModal}
          onDelete={handleDeleteAchievement}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Prestasi"
        />
      )}

      {/* PENGHARGAAN TAB */}
      {activeTab === 'penghargaan' && (
        <DataTable 
          data={awards}
          columns={[
            { key: 'imageUrl', label: 'Foto', render: (item) => item.imageUrl ? <img src={item.imageUrl} alt={item.titleID} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> : <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>No Photo</span> },
            { key: 'titleID', label: 'Judul Penghargaan' },
            { key: 'category', label: 'Kategori' },
            { key: 'year', label: 'Tahun' },
          ]}
          onAdd={() => handleOpenAwardModal()}
          onEdit={handleOpenAwardModal}
          onDelete={handleDeleteAward}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Penghargaan"
        />
      )}

      {/* ANNOUNCEMENT TAB */}
      {activeTab === 'pengumuman' && (
        <DataTable 
          data={announcements}
          columns={[
            { key: 'titleID', label: 'Judul Pengumuman' },
            { key: 'category', label: 'Kategori' },
            { key: 'urgencyID', label: 'Urgensi' },
            { key: 'date', label: 'Tanggal' }
          ]}
          onAdd={() => handleOpenAnnouncementModal()}
          onEdit={handleOpenAnnouncementModal}
          onDelete={handleDeleteAnnouncement}
          keyExtractor={(item) => item.id}
          addLabel="Tambah Pengumuman Baru"
        />
      )}

      {/* MODAL: ARTICLE */}
      <ModalForm
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSubmit={handleArticleSubmit}
        title={editingArticle ? 'Edit Artikel Berita' : 'Tambah Artikel Berita'}
      >
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Artikel (ID)</label>
            <input type="text" required value={articleForm.titleID || ''} onChange={e => setArticleForm({...articleForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Artikel (EN)</label>
            <input type="text" required value={articleForm.titleEN || ''} onChange={e => setArticleForm({...articleForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Kategori Berita (ID)</label>
            <input type="text" required value={articleForm.categoryID || ''} onChange={e => setArticleForm({...articleForm, categoryID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Kategori Berita (EN)</label>
            <input type="text" required value={articleForm.categoryEN || ''} onChange={e => setArticleForm({...articleForm, categoryEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Penulis</label>
            <input type="text" required value={articleForm.author || ''} onChange={e => setArticleForm({...articleForm, author: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Tanggal Rilis</label>
            <input type="date" required value={articleForm.date || ''} onChange={e => setArticleForm({...articleForm, date: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-auto" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Waktu Baca (ID)</label>
            <input type="text" required value={articleForm.readTimeID || '5 Menit Baca'} onChange={e => setArticleForm({...articleForm, readTimeID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Waktu Baca (EN)</label>
            <input type="text" required value={articleForm.readTimeEN || '5 Min Read'} onChange={e => setArticleForm({...articleForm, readTimeEN: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Tingkatan Skala</label>
            <select 
              value={articleForm.scope || 'national'} 
              onChange={e => setArticleForm({...articleForm, scope: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="national">Nasional</option>
              <option value="international">Internasional</option>
            </select>
          </div>
        </div>
        <div className="admin-input-group">
          <label>Ringkasan Singkat / Summary (ID)</label>
          <textarea rows={2} required style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={articleForm.summaryID || ''} onChange={e => setArticleForm({...articleForm, summaryID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Ringkasan Singkat / Summary (EN)</label>
          <textarea rows={2} required style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={articleForm.summaryEN || ''} onChange={e => setArticleForm({...articleForm, summaryEN: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Isi Artikel (ID) - Pisahkan paragraf dengan Enter dua kali (Double Line Break)</label>
          <textarea rows={5} required style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={(articleForm.contentID || []).join('\n\n')} onChange={e => setArticleForm({...articleForm, contentID: e.target.value.split('\n\n')})} />
        </div>
        <div className="admin-input-group">
          <label>Isi Artikel (EN) - Pisahkan paragraf dengan Enter dua kali</label>
          <textarea rows={5} required style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={(articleForm.contentEN || []).join('\n\n')} onChange={e => setArticleForm({...articleForm, contentEN: e.target.value.split('\n\n')})} />
        </div>
      </ModalForm>

      {/* MODAL: PRESTASI */}
      <ModalForm
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        onSubmit={handleAchievementSubmit}
        title={editingAchievement ? 'Edit Rekap Prestasi' : 'Tambah Rekap Prestasi'}
      >
        <ImageInput 
          label="Dokumentasi Lomba / Piala (Opsional)"
          value={achievementForm.imageUrl}
          onChange={(base64) => setAchievementForm({ ...achievementForm, imageUrl: base64 })}
        />
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Pencapaian (ID)</label>
            <input type="text" required placeholder="Contoh: Juara 1 Firefighting Challenge" value={achievementForm.titleID || ''} onChange={e => setAchievementForm({...achievementForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Pencapaian (EN)</label>
            <input type="text" required value={achievementForm.titleEN || ''} onChange={e => setAchievementForm({...achievementForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-input-group">
          <label>Nama Penerima Penghargaan / Anggota Tim</label>
          <input type="text" required placeholder="Contoh: Faisal, Sari, Budi" value={achievementForm.awardee || ''} onChange={e => setAchievementForm({...achievementForm, awardee: e.target.value})} />
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Nama Event / Kompetisi (ID)</label>
            <input type="text" required value={achievementForm.eventID || ''} onChange={e => setAchievementForm({...achievementForm, eventID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Nama Event / Kompetisi (EN)</label>
            <input type="text" required value={achievementForm.eventEN || ''} onChange={e => setAchievementForm({...achievementForm, eventEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Penyelenggara</label>
            <input type="text" required value={achievementForm.organizer || ''} onChange={e => setAchievementForm({...achievementForm, organizer: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Tanggal Pencapaian</label>
            <input type="date" required value={achievementForm.date || ''} onChange={e => setAchievementForm({...achievementForm, date: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Peringkat (ID) - misal: Juara 1</label>
            <input type="text" required value={achievementForm.rankID || ''} onChange={e => setAchievementForm({...achievementForm, rankID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Peringkat (EN)</label>
            <input type="text" required value={achievementForm.rankEN || ''} onChange={e => setAchievementForm({...achievementForm, rankEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Skala Lomba</label>
            <select 
              value={achievementForm.level || 'national'} 
              onChange={e => setAchievementForm({...achievementForm, level: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="regional">Regional / Provinsi</option>
              <option value="national">Nasional</option>
              <option value="international">Internasional</option>
            </select>
          </div>
          <div className="admin-input-group">
            <label>Tipe Medali / Cap</label>
            <select 
              value={achievementForm.medal || 'gold'} 
              onChange={e => setAchievementForm({...achievementForm, medal: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="gold">Emas / Juara 1</option>
              <option value="silver">Perak / Juara 2</option>
              <option value="bronze">Perunggu / Juara 3</option>
              <option value="special">Favorit / Penghargaan Khusus</option>
              <option value="nomination">Nominasi</option>
            </select>
          </div>
        </div>
      </ModalForm>

      {/* MODAL: PENGHARGAAN */}
      <ModalForm
        isOpen={isAwardModalOpen}
        onClose={() => setIsAwardModalOpen(false)}
        onSubmit={handleAwardSubmit}
        title={editingAward ? 'Edit Penghargaan' : 'Tambah Penghargaan'}
      >
        <ImageInput 
          label="Foto Piagam / Penyerahan (Opsional)"
          value={awardForm.imageUrl}
          onChange={(base64) => setAwardForm({ ...awardForm, imageUrl: base64 })}
        />
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Penghargaan (ID)</label>
            <input type="text" required value={awardForm.titleID || ''} onChange={e => setAwardForm({...awardForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Penghargaan (EN)</label>
            <input type="text" required value={awardForm.titleEN || ''} onChange={e => setAwardForm({...awardForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Tahun Penerimaan</label>
            <input type="text" required placeholder="Contoh: 2025" value={awardForm.year || ''} onChange={e => setAwardForm({...awardForm, year: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Kategori Penerima</label>
            <select 
              value={awardForm.category || 'organization'} 
              onChange={e => setAwardForm({...awardForm, category: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="organization">Organisasi (BEMPRKK)</option>
              <option value="institution">Institusi (Prodi RKK)</option>
              <option value="student">Individu Mahasiswa</option>
            </select>
          </div>
        </div>
        <div className="admin-input-group">
          <label>Deskripsi Singkat Penghargaan (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={awardForm.descID || ''} onChange={e => setAwardForm({...awardForm, descID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Deskripsi Singkat Penghargaan (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={awardForm.descEN || ''} onChange={e => setAwardForm({...awardForm, descEN: e.target.value})} />
        </div>
      </ModalForm>

      {/* MODAL: PENGUMUMAN */}
      <ModalForm
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSubmit={handleAnnouncementSubmit}
        title={editingAnnouncement ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
      >
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Pengumuman (ID)</label>
            <input type="text" required value={announcementForm.titleID || ''} onChange={e => setAnnouncementForm({...announcementForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Pengumuman (EN)</label>
            <input type="text" required value={announcementForm.titleEN || ''} onChange={e => setAnnouncementForm({...announcementForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-auto" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Kategori</label>
            <select 
              value={announcementForm.category || 'umum'} 
              onChange={e => setAnnouncementForm({...announcementForm, category: e.target.value as any})}
              style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
            >
              <option value="umum">Umum</option>
              <option value="academic">Akademik</option>
              <option value="important">Penting / Urgent</option>
              <option value="recruitment">Rekrutmen</option>
            </select>
          </div>
          <div className="admin-input-group">
            <label>Urgensi (ID) - misal: Penting</label>
            <input type="text" required value={announcementForm.urgencyID || ''} onChange={e => setAnnouncementForm({...announcementForm, urgencyID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Urgensi (EN)</label>
            <input type="text" required value={announcementForm.urgencyEN || ''} onChange={e => setAnnouncementForm({...announcementForm, urgencyEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Link Lampiran / attachment (Opsional) - misal: Google Form / PDF</label>
            <input type="text" placeholder="https://..." value={announcementForm.attachmentUrl || ''} onChange={e => setAnnouncementForm({...announcementForm, attachmentUrl: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Tanggal Rilis</label>
            <input type="date" required value={announcementForm.date || ''} onChange={e => setAnnouncementForm({...announcementForm, date: e.target.value})} />
          </div>
        </div>
        <div className="admin-input-group">
          <label>Isi Pengumuman (ID)</label>
          <textarea rows={4} required style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={announcementForm.contentID || ''} onChange={e => setAnnouncementForm({...announcementForm, contentID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Isi Pengumuman (EN)</label>
          <textarea rows={4} required style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={announcementForm.contentEN || ''} onChange={e => setAnnouncementForm({...announcementForm, contentEN: e.target.value})} />
        </div>
      </ModalForm>
    </div>
  );
};

export default AdminBerita;
