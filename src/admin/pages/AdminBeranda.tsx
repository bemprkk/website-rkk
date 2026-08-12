import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import ImageInput from '../components/ImageInput';
import { Save, Edit } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import ModalForm from '../components/ModalForm';

import { useSearchParams } from 'react-router-dom';

const AdminBeranda: React.FC = () => {
  const { content, updateContent } = useContent();
  const [searchParams] = useSearchParams();
  
  // Initialize from URL or default to 'hero'
  const urlTab = searchParams.get('tab') as 'hero' | 'nilai' | 'highlights' | 'faq' | 'cta';
  const [activeTab, setActiveTab] = useState<'hero' | 'nilai' | 'highlights' | 'faq' | 'cta'>(urlTab || 'hero');

  // Sync state when URL changes (from sidebar clicks)
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  const [isSaving, setIsSaving] = useState(false);

  // --- TAB 1: Hero & Tentang Kami ---
  const [heroImg, setHeroImg] = useState(content.images.hero);
  const [aboutImg, setAboutImg] = useState(content.images.about);
  
  const [heroID, setHeroID] = useState(content.translations.ID.hero);
  const [heroEN, setHeroEN] = useState(content.translations.EN.hero);



  const [mengenalID, setMengenalID] = useState(content.translations.ID.home);
  const [mengenalEN, setMengenalEN] = useState(content.translations.EN.home);

  // --- TAB 2: Nilai BEM ---
  const [valuesID, setValuesID] = useState(content.translations.ID.home.values || []);
  const [valuesEN, setValuesEN] = useState(content.translations.EN.home.values || []);
  const [editingValueIdx, setEditingValueIdx] = useState<number | null>(null);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [valueForm, setValueForm] = useState({ titleID: '', titleEN: '', descID: '', descEN: '' });

  // --- TAB 3: Highlights ---
  const [highlightsID, setHighlightsID] = useState(content.translations.ID.home.highlights || []);
  const [highlightsEN, setHighlightsEN] = useState(content.translations.EN.home.highlights || []);
  const [editingHighlightIdx, setEditingHighlightIdx] = useState<number | null>(null);
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [highlightForm, setHighlightForm] = useState({ titleID: '', titleEN: '', descID: '', descEN: '' });

  // --- TAB 4: FAQ ---
  const [faqID, setFaqID] = useState(content.translations.ID.home.faqItems || []);
  const [faqEN, setFaqEN] = useState(content.translations.EN.home.faqItems || []);
  const [editingFaqIdx, setEditingFaqIdx] = useState<number | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({ qID: '', qEN: '', aID: '', aEN: '' });

  // --- TAB 5: CTA ---
  const [ctaID, setCtaID] = useState({
    title: content.translations.ID.home.ctaTitle || '',
    gradient: content.translations.ID.home.ctaTitleGradient || '',
    desc: content.translations.ID.home.ctaDesc || '',
    btn: content.translations.ID.home.ctaBtn || ''
  });
  const [ctaEN, setCtaEN] = useState({
    title: content.translations.EN.home.ctaTitle || '',
    gradient: content.translations.EN.home.ctaTitleGradient || '',
    desc: content.translations.EN.home.ctaDesc || '',
    btn: content.translations.EN.home.ctaBtn || ''
  });

  // --- GLOBAL SAVE HANDLER ---
  const handleSave = () => {
    setIsSaving(true);
    updateContent((prev) => {
      const newIDHome = {
        ...prev.translations.ID.home,
        mengenalSubtitle: mengenalID.mengenalSubtitle,
        mengenalTitle: mengenalID.mengenalTitle,
        mengenalTitleGradient: mengenalID.mengenalTitleGradient,
        mengenalDesc: mengenalID.mengenalDesc,
        mengenalDesc2: mengenalID.mengenalDesc2,
        mengenalBadge: mengenalID.mengenalBadge,
        values: valuesID,
        highlights: highlightsID,
        faqItems: faqID,
        ctaTitle: ctaID.title,
        ctaTitleGradient: ctaID.gradient,
        ctaDesc: ctaID.desc,
        ctaBtn: ctaID.btn,
      };

      const newENHome = {
        ...prev.translations.EN.home,
        mengenalSubtitle: mengenalEN.mengenalSubtitle,
        mengenalTitle: mengenalEN.mengenalTitle,
        mengenalTitleGradient: mengenalEN.mengenalTitleGradient,
        mengenalDesc: mengenalEN.mengenalDesc,
        mengenalDesc2: mengenalEN.mengenalDesc2,
        mengenalBadge: mengenalEN.mengenalBadge,
        values: valuesEN,
        highlights: highlightsEN,
        faqItems: faqEN,
        ctaTitle: ctaEN.title,
        ctaTitleGradient: ctaEN.gradient,
        ctaDesc: ctaEN.desc,
        ctaBtn: ctaEN.btn,
      };

      return {
        ...prev,
        images: {
          ...prev.images,
          hero: heroImg,
          about: aboutImg,
        },
        translations: {
          ...prev.translations,
          ID: {
            ...prev.translations.ID,
            hero: heroID,
            about: prev.translations.ID.about,
            home: newIDHome,
          },
          EN: {
            ...prev.translations.EN,
            hero: heroEN,
            about: prev.translations.EN.about,
            home: newENHome,
          }
        }
      };
    });
    setTimeout(() => {
      setIsSaving(false);
      alert('Perubahan Beranda berhasil disimpan!');
    }, 500);
  };

  // --- HANDLERS: TAB 2 - Nilai BEM ---
  const handleOpenValueModal = (index: number) => {
    setEditingValueIdx(index);
    setValueForm({
      titleID: valuesID[index]?.title || '',
      titleEN: valuesEN[index]?.title || '',
      descID: valuesID[index]?.desc || '',
      descEN: valuesEN[index]?.desc || ''
    });
    setIsValueModalOpen(true);
  };

  const handleValueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingValueIdx !== null) {
      const updatedID = [...valuesID];
      const updatedEN = [...valuesEN];
      updatedID[editingValueIdx] = { title: valueForm.titleID, desc: valueForm.descID };
      updatedEN[editingValueIdx] = { title: valueForm.titleEN, desc: valueForm.descEN };
      setValuesID(updatedID);
      setValuesEN(updatedEN);
    }
    setIsValueModalOpen(false);
  };

  // --- HANDLERS: TAB 3 - Highlights ---
  const handleOpenHighlightModal = (index: number) => {
    setEditingHighlightIdx(index);
    setHighlightForm({
      titleID: highlightsID[index]?.title || '',
      titleEN: highlightsEN[index]?.title || '',
      descID: highlightsID[index]?.desc || '',
      descEN: highlightsEN[index]?.desc || ''
    });
    setIsHighlightModalOpen(true);
  };

  const handleHighlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHighlightIdx !== null) {
      const updatedID = [...highlightsID];
      const updatedEN = [...highlightsEN];
      updatedID[editingHighlightIdx] = { title: highlightForm.titleID, desc: highlightForm.descID };
      updatedEN[editingHighlightIdx] = { title: highlightForm.titleEN, desc: highlightForm.descEN };
      setHighlightsID(updatedID);
      setHighlightsEN(updatedEN);
    }
    setIsHighlightModalOpen(false);
  };

  // --- HANDLERS: TAB 4 - FAQ ---
  const handleOpenFaqModal = (index?: number) => {
    if (index !== undefined) {
      setEditingFaqIdx(index);
      setFaqForm({
        qID: faqID[index]?.q || '',
        qEN: faqEN[index]?.q || '',
        aID: faqID[index]?.a || '',
        aEN: faqEN[index]?.a || ''
      });
    } else {
      setEditingFaqIdx(null);
      setFaqForm({ qID: '', qEN: '', aID: '', aEN: '' });
    }
    setIsFaqModalOpen(true);
  };

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaqIdx !== null) {
      const updatedID = [...faqID];
      const updatedEN = [...faqEN];
      updatedID[editingFaqIdx] = { q: faqForm.qID, a: faqForm.aID };
      updatedEN[editingFaqIdx] = { q: faqForm.qEN, a: faqForm.aEN };
      setFaqID(updatedID);
      setFaqEN(updatedEN);
    } else {
      setFaqID([...faqID, { q: faqForm.qID, a: faqForm.aID }]);
      setFaqEN([...faqEN, { q: faqForm.qEN, a: faqForm.aEN }]);
    }
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (index: number) => {
    const updatedID = faqID.filter((_, idx) => idx !== index);
    const updatedEN = faqEN.filter((_, idx) => idx !== index);
    setFaqID(updatedID);
    setFaqEN(updatedEN);
  };

  return (
    <div>
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>Pengaturan Beranda</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f97316', color: 'var(--admin-text-main)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, opacity: isSaving ? 0.7 : 1 }}
        >
          <Save size={18} />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {/* TAB CONTENT: HERO & TENTANG */}
      {activeTab === 'hero' && (
        <div className="admin-grid-auto">
          {/* Images Section */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Gambar / Visual</h2>
            <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
              <ImageInput label="Gambar Hero" value={heroImg} onChange={setHeroImg} />
              <ImageInput label="Gambar Tentang Kami" value={aboutImg} onChange={setAboutImg} />
            </div>
          </div>

          {/* Hero Content Section */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Teks Hero (Bagian Atas)</h2>
            <div className="admin-grid-auto">
              <div>
                <h3 style={{ color: '#f97316', fontSize: '1.1rem', marginBottom: '1rem' }}>🇮🇩 Bahasa Indonesia</h3>
                <div className="admin-input-group">
                  <label>Badge / Label Atas</label>
                  <input type="text" value={heroID.badge} onChange={e => setHeroID({...heroID, badge: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Baris 1</label>
                  <input type="text" value={heroID.title1} onChange={e => setHeroID({...heroID, title1: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Baris 2 (Gradasi)</label>
                  <input type="text" value={heroID.titleGradient} onChange={e => setHeroID({...heroID, titleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Deskripsi Singkat</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={heroID.desc} onChange={e => setHeroID({...heroID, desc: e.target.value})} />
                </div>
              </div>
              <div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '1rem' }}>🇬🇧 English</h3>
                <div className="admin-input-group">
                  <label>Top Badge / Label</label>
                  <input type="text" value={heroEN.badge} onChange={e => setHeroEN({...heroEN, badge: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Title Line 1</label>
                  <input type="text" value={heroEN.title1} onChange={e => setHeroEN({...heroEN, title1: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Title Line 2 (Gradient)</label>
                  <input type="text" value={heroEN.titleGradient} onChange={e => setHeroEN({...heroEN, titleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Short Description</label>
                  <textarea rows={4} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={heroEN.desc} onChange={e => setHeroEN({...heroEN, desc: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Mengenal Kami Section */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Mengenal Kami</h2>
            <div className="admin-grid-auto">
              <div>
                <h3 style={{ color: '#f97316', fontSize: '1.1rem', marginBottom: '1rem' }}>🇮🇩 Bahasa Indonesia</h3>
                <div className="admin-input-group">
                  <label>Sub-judul</label>
                  <input type="text" value={mengenalID.mengenalSubtitle || ''} onChange={e => setMengenalID({...mengenalID, mengenalSubtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Putih</label>
                  <input type="text" value={mengenalID.mengenalTitle || ''} onChange={e => setMengenalID({...mengenalID, mengenalTitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Gradasi</label>
                  <input type="text" value={mengenalID.mengenalTitleGradient || ''} onChange={e => setMengenalID({...mengenalID, mengenalTitleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Deskripsi Singkat</label>
                  <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={mengenalID.mengenalDesc || ''} onChange={e => setMengenalID({...mengenalID, mengenalDesc: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Deskripsi Detail (Paragraf 2)</label>
                  <textarea rows={5} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={mengenalID.mengenalDesc2 || ''} onChange={e => setMengenalID({...mengenalID, mengenalDesc2: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Badge Gambar (misal: "BEM Terbaik")</label>
                  <input type="text" value={mengenalID.mengenalBadge || ''} onChange={e => setMengenalID({...mengenalID, mengenalBadge: e.target.value})} />
                </div>
              </div>
              <div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '1rem' }}>🇬🇧 English</h3>
                <div className="admin-input-group">
                  <label>Subtitle</label>
                  <input type="text" value={mengenalEN.mengenalSubtitle || ''} onChange={e => setMengenalEN({...mengenalEN, mengenalSubtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>White Title</label>
                  <input type="text" value={mengenalEN.mengenalTitle || ''} onChange={e => setMengenalEN({...mengenalEN, mengenalTitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Gradient Title</label>
                  <input type="text" value={mengenalEN.mengenalTitleGradient || ''} onChange={e => setMengenalEN({...mengenalEN, mengenalTitleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Short Description</label>
                  <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={mengenalEN.mengenalDesc || ''} onChange={e => setMengenalEN({...mengenalEN, mengenalDesc: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Detailed Description (Paragraph 2)</label>
                  <textarea rows={5} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={mengenalEN.mengenalDesc2 || ''} onChange={e => setMengenalEN({...mengenalEN, mengenalDesc2: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Image Badge (e.g. "Best Student Body")</label>
                  <input type="text" value={mengenalEN.mengenalBadge || ''} onChange={e => setMengenalEN({...mengenalEN, mengenalBadge: e.target.value})} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: NILAI-NILAI BEM */}
      {activeTab === 'nilai' && (
        <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Nilai-Nilai Utama BEMPRKK</h2>
          <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
            {valuesID.map((val: any, idx: number) => (
              <div key={idx} style={{ background: 'var(--admin-input-bg)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--admin-card-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', color: '#f97316', fontSize: '1.1rem' }}>{val.title} / {valuesEN[idx]?.title}</h3>
                  <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>{val.desc}</p>
                </div>
                <button 
                  onClick={() => handleOpenValueModal(idx)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  <Edit size={14} /> Edit Nilai
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HIGHLIGHTS */}
      {activeTab === 'highlights' && (
        <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Highlights Program Kerja</h2>
          
          <div className="admin-grid-auto" style={{ marginBottom: '2rem' }}>
            <div className="admin-input-group">
              <label>Sub-judul Kategori (ID)</label>
              <input type="text" value={mengenalID.programSubtitle || ''} onChange={e => setMengenalID({...mengenalID, programSubtitle: e.target.value})} />
            </div>
            <div className="admin-input-group">
              <label>Sub-judul Kategori (EN)</label>
              <input type="text" value={mengenalEN.programSubtitle || ''} onChange={e => setMengenalEN({...mengenalEN, programSubtitle: e.target.value})} />
            </div>
          </div>

          <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
            {highlightsID.map((hl: any, idx: number) => (
              <div key={idx} style={{ background: 'var(--admin-input-bg)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--admin-card-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', color: '#f97316', fontSize: '1.1rem' }}>{hl.title} / {highlightsEN[idx]?.title}</h3>
                  <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>{hl.desc}</p>
                </div>
                <button 
                  onClick={() => handleOpenHighlightModal(idx)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.5rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  <Edit size={14} /> Edit Highlight
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FAQ */}
      {activeTab === 'faq' && (
        <div className="admin-grid-auto">
          {/* FAQ Texts */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Header FAQ</h2>
            <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
              <div>
                <h3 style={{ color: '#f97316', fontSize: '1.1rem', marginBottom: '1rem' }}>🇮🇩 Bahasa Indonesia</h3>
                <div className="admin-input-group">
                  <label>Sub-judul FAQ</label>
                  <input type="text" value={mengenalID.faqSubtitle || ''} onChange={e => setMengenalID({...mengenalID, faqSubtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Putih</label>
                  <input type="text" value={mengenalID.faqTitle || ''} onChange={e => setMengenalID({...mengenalID, faqTitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Judul Gradasi</label>
                  <input type="text" value={mengenalID.faqTitleGradient || ''} onChange={e => setMengenalID({...mengenalID, faqTitleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>Deskripsi FAQ</label>
                  <input type="text" value={mengenalID.faqDesc || ''} onChange={e => setMengenalID({...mengenalID, faqDesc: e.target.value})} />
                </div>
              </div>
              <div>
                <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '1rem' }}>🇬🇧 English</h3>
                <div className="admin-input-group">
                  <label>FAQ Subtitle</label>
                  <input type="text" value={mengenalEN.faqSubtitle || ''} onChange={e => setMengenalEN({...mengenalEN, faqSubtitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>FAQ White Title</label>
                  <input type="text" value={mengenalEN.faqTitle || ''} onChange={e => setMengenalEN({...mengenalEN, faqTitle: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>FAQ Gradient Title</label>
                  <input type="text" value={mengenalEN.faqTitleGradient || ''} onChange={e => setMengenalEN({...mengenalEN, faqTitleGradient: e.target.value})} />
                </div>
                <div className="admin-input-group">
                  <label>FAQ Description</label>
                  <input type="text" value={mengenalEN.faqDesc || ''} onChange={e => setMengenalEN({...mengenalEN, faqDesc: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Items Table */}
          <DataTable 
            data={faqID.map((item: any, idx: number) => ({ id: idx.toString(), q: item.q, a: item.a, index: idx }))}
            columns={[
              { key: 'q', label: 'Pertanyaan (ID)' },
              { key: 'a', label: 'Jawaban (ID)', render: (item: any) => item.a.substring(0, 80) + (item.a.length > 80 ? '...' : '') }
            ]}
            onAdd={() => handleOpenFaqModal()}
            onEdit={(item: any) => handleOpenFaqModal(item.index)}
            onDelete={(item: any) => handleDeleteFaq(item.index)}
            keyExtractor={(item: any) => item.id}
            addLabel="Tambah FAQ"
          />
        </div>
      )}

      {/* TAB CONTENT: CALL TO ACTION */}
      {activeTab === 'cta' && (
        <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Pengaturan Call to Action (CTA) Gabung</h2>
          <div className="admin-grid-auto">
            <div>
              <h3 style={{ color: '#f97316', fontSize: '1.1rem', marginBottom: '1rem' }}>🇮🇩 Bahasa Indonesia</h3>
              <div className="admin-input-group">
                <label>Judul Putih</label>
                <input type="text" value={ctaID.title} onChange={e => setCtaID({...ctaID, title: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Judul Gradasi</label>
                <input type="text" value={ctaID.gradient} onChange={e => setCtaID({...ctaID, gradient: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Deskripsi / Ajakan</label>
                <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={ctaID.desc} onChange={e => setCtaID({...ctaID, desc: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Teks Tombol</label>
                <input type="text" value={ctaID.btn} onChange={e => setCtaID({...ctaID, btn: e.target.value})} />
              </div>
            </div>
            <div>
              <h3 style={{ color: '#3b82f6', fontSize: '1.1rem', marginBottom: '1rem' }}>🇬🇧 English</h3>
              <div className="admin-input-group">
                <label>White Title</label>
                <input type="text" value={ctaEN.title} onChange={e => setCtaEN({...ctaEN, title: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Gradient Title</label>
                <input type="text" value={ctaEN.gradient} onChange={e => setCtaEN({...ctaEN, gradient: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Description / Invitation</label>
                <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} value={ctaEN.desc} onChange={e => setCtaEN({...ctaEN, desc: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Button Text</label>
                <input type="text" value={ctaEN.btn} onChange={e => setCtaEN({...ctaEN, btn: e.target.value})} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT VALUE --- */}
      <ModalForm
        isOpen={isValueModalOpen}
        onClose={() => setIsValueModalOpen(false)}
        onSubmit={handleValueSubmit}
        title="Edit Nilai Utama"
      >
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Nilai (ID)</label>
            <input type="text" required value={valueForm.titleID} onChange={e => setValueForm({...valueForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Nilai (EN)</label>
            <input type="text" required value={valueForm.titleEN} onChange={e => setValueForm({...valueForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-input-group">
          <label>Penjelasan (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={valueForm.descID} onChange={e => setValueForm({...valueForm, descID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Penjelasan (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={valueForm.descEN} onChange={e => setValueForm({...valueForm, descEN: e.target.value})} />
        </div>
      </ModalForm>

      {/* --- MODAL EDIT HIGHLIGHT --- */}
      <ModalForm
        isOpen={isHighlightModalOpen}
        onClose={() => setIsHighlightModalOpen(false)}
        onSubmit={handleHighlightSubmit}
        title="Edit Highlight Program"
      >
        <div className="admin-grid-2" style={{ gap: '1rem' }}>
          <div className="admin-input-group">
            <label>Judul Program (ID)</label>
            <input type="text" required value={highlightForm.titleID} onChange={e => setHighlightForm({...highlightForm, titleID: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Judul Program (EN)</label>
            <input type="text" required value={highlightForm.titleEN} onChange={e => setHighlightForm({...highlightForm, titleEN: e.target.value})} />
          </div>
        </div>
        <div className="admin-input-group">
          <label>Penjelasan (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={highlightForm.descID} onChange={e => setHighlightForm({...highlightForm, descID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Penjelasan (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={highlightForm.descEN} onChange={e => setHighlightForm({...highlightForm, descEN: e.target.value})} />
        </div>
      </ModalForm>

      {/* --- MODAL EDIT/TAMBAH FAQ --- */}
      <ModalForm
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        onSubmit={handleFaqSubmit}
        title={editingFaqIdx !== null ? 'Edit FAQ' : 'Tambah FAQ'}
      >
        <div className="admin-input-group">
          <label>Pertanyaan (ID)</label>
          <input type="text" required value={faqForm.qID} onChange={e => setFaqForm({...faqForm, qID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Pertanyaan (EN)</label>
          <input type="text" required value={faqForm.qEN} onChange={e => setFaqForm({...faqForm, qEN: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Jawaban (ID)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={faqForm.aID} onChange={e => setFaqForm({...faqForm, aID: e.target.value})} />
        </div>
        <div className="admin-input-group">
          <label>Jawaban (EN)</label>
          <textarea rows={3} style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }} required value={faqForm.aEN} onChange={e => setFaqForm({...faqForm, aEN: e.target.value})} />
        </div>
      </ModalForm>
    </div>
  );
};

export default AdminBeranda;
