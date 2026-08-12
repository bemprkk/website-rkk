import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, Clock, ArrowRight, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { useContent } from '../context/ContentContext';
import type { ArticleItem } from '../types';

const BeritaPage: React.FC = () => {
  const { lang } = useLanguage();
  const { content } = useContent();

  const staticArticles = content.articles || [];
  const staticAchievements = content.achievements || [];
  const staticAwards = content.awards || [];
  const staticAnnouncements = content.announcements || [];
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'artikel';

  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [selectedAwardPhoto, setSelectedAwardPhoto] = useState<{ url: string; title: string } | null>(null);

  // States for Artikel
  const [articleScope, setArticleScope] = useState<'all' | 'national' | 'international'>('all');

  // States for Rekap Prestasi
  const [prestasiYear, setPrestasiYear] = useState<string>('2026');
  const [prestasiMonth, setPrestasiMonth] = useState<string>('all');

  // States for Penghargaan
  const [awardCategory, setAwardCategory] = useState<'all' | 'institution' | 'organization' | 'student'>('all');
  const [awardYear, setAwardYear] = useState<string>('all');

  // States for Pengumuman
  const [announcementFilter, setAnnouncementFilter] = useState<'all' | 'penting' | 'umum' | 'academic' | 'recruitment'>('all');

  // Horizontal scroll refs
  const artikelFilterRef = useHorizontalScroll<HTMLDivElement>();
  const prestasiYearRef = useHorizontalScroll<HTMLDivElement>();
  const penghargaanYearRef = useHorizontalScroll<HTMLDivElement>();
  const penghargaanCatRef = useHorizontalScroll<HTMLDivElement>();
  const pengumumanFilterRef = useHorizontalScroll<HTMLDivElement>();

  // Sync scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    if (selectedArticle) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedArticle]);

  // Filtering Logic
  const filteredArticles = staticArticles.filter(art => articleScope === 'all' || art.scope === articleScope);

  const filteredAchievements = staticAchievements.filter(ach => {
    const parts = ach.date.split('-');
    const yearMatch = parts[0] === prestasiYear;
    const monthMatch = prestasiMonth === 'all' || parts[1] === prestasiMonth;
    return yearMatch && monthMatch;
  });

  const awardYears = ['all', ...Array.from(new Set(staticAwards.map(aw => aw.year))).sort((a, b) => parseInt(b) - parseInt(a))];
  const filteredAwards = staticAwards.filter(aw => {
    const yearMatch = awardYear === 'all' || aw.year === awardYear;
    const catMatch = awardCategory === 'all' || aw.category === awardCategory;
    return yearMatch && catMatch;
  });

  const getAwardTypeLabel = (category: 'institution' | 'organization' | 'student') => {
    if (category === 'institution') return lang === 'EN' ? 'Institutional Award' : 'Penghargaan Institusi';
    if (category === 'organization') return lang === 'EN' ? 'Organizational Award' : 'Penghargaan Organisasi';
    return lang === 'EN' ? 'Student Award' : 'Penghargaan Mahasiswa';
  };

  const filteredAnnouncements = staticAnnouncements.filter(ann => {
    if (announcementFilter === 'all') return true;
    if (announcementFilter === 'penting') return ann.urgencyID === 'Penting';
    if (announcementFilter === 'umum') return ann.urgencyID === 'Umum';
    if (announcementFilter === 'academic') return ann.category === 'academic';
    if (announcementFilter === 'recruitment') return ann.category === 'recruitment';
    return true;
  });

  const months = [
    { value: 'all', ID: 'Semua Bulan', EN: 'All Months' },
    { value: '01', ID: 'Januari', EN: 'January' },
    { value: '02', ID: 'Februari', EN: 'February' },
    { value: '03', ID: 'Maret', EN: 'March' },
    { value: '04', ID: 'April', EN: 'April' },
    { value: '05', ID: 'Mei', EN: 'May' },
    { value: '06', ID: 'Juni', EN: 'June' },
    { value: '07', ID: 'Juli', EN: 'July' },
    { value: '08', ID: 'Agustus', EN: 'August' },
    { value: '09', ID: 'September', EN: 'September' },
    { value: '10', ID: 'Oktober', EN: 'October' },
    { value: '11', ID: 'November', EN: 'November' },
    { value: '12', ID: 'Desember', EN: 'December' }
  ];

  return (
    <div className="page-wrapper-standalone pt-40" style={{ paddingBottom: '5rem' }}>
      <div className="container">

        {/* Tab Content Area */}
        <div className="profil-content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* TAB 1: ARTIKEL */}
              {activeTab === 'artikel' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center" style={{ marginBottom: '2.5rem' }}>
                    <span className="section-badge-pill">{lang === 'EN' ? 'Prodi RKK Knowledge' : 'Artikel Prodi RKK'}</span>
                    <h2 className="section-title-main">
                      Artikel <span className="text-gradient-elegant">Prodi RKK</span>
                    </h2>
                    <p className="section-desc-main">
                      {lang === 'EN'
                        ? 'Read in-depth articles and safety knowledge from the Fire Safety Engineering Study Program.'
                        : 'Kumpulan artikel dan edukasi keselamatan dari Program Studi Rekayasa Keselamatan Kebakaran.'}
                    </p>
                  </div>

                  <div className="proker-filter-row" style={{ marginTop: '0.5rem', marginBottom: '2.5rem' }} ref={artikelFilterRef}>
                    {[
                      { id: 'all', ID: 'Semua', EN: 'All' },
                      { id: 'national', ID: 'Nasional', EN: 'National' },
                      { id: 'international', ID: 'Internasional', EN: 'International' }
                    ].map((f) => (
                      <button key={f.id} className={`proker-filter-btn ${articleScope === f.id ? 'active' : ''}`} onClick={() => setArticleScope(f.id as any)}>
                        {lang === 'EN' ? f.EN : f.ID}
                      </button>
                    ))}
                  </div>

                  {filteredArticles.length === 0 ? (
                    <div className="alumni-empty glass-panel" style={{ padding: '3rem', borderRadius: '18px', textAlign: 'center', color: 'var(--clr-muted)' }}>
                      <p style={{ fontSize: '1rem', margin: 0 }}>{lang === 'EN' ? 'No articles found for this filter.' : 'Tidak ada artikel untuk filter ini.'}</p>
                    </div>
                  ) : (
                    <div className="news-grid">
                      {filteredArticles.map((art, idx) => (
                        <motion.div className="proker-card glass-panel article-card" key={art.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -6 }} onClick={() => setSelectedArticle(art)}>
                          <div className="article-card-header">
                            <span className="article-card-tag">{lang === 'EN' ? art.categoryEN : art.categoryID}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {lang === 'EN' ? art.readTimeEN : art.readTimeID}</span>
                          </div>
                          <div>
                            <h3 className="article-card-title">{lang === 'EN' ? art.titleEN : art.titleID}</h3>
                            <p className="article-card-summary">{lang === 'EN' ? art.summaryEN : art.summaryID}</p>
                          </div>
                          <div className="article-card-footer">
                            <span>By: {art.author}</span>
                            <span className="article-read-btn">{lang === 'EN' ? 'Read Article' : 'Baca Artikel'} <ChevronRight size={14} /></span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: REKAP PRESTASI */}
              {activeTab === 'prestasi' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center" style={{ marginBottom: '2.5rem' }}>
                    <span className="section-badge-pill">{lang === 'EN' ? 'Outstanding Talents' : 'Rekap Prestasi Mahasiswa'}</span>
                    <h2 className="section-title-main">
                      {lang === 'EN' ? 'Championship' : 'Prestasi'} <span className="text-gradient-elegant">{lang === 'EN' ? 'Laurels' : 'Unggulan'}</span>
                    </h2>
                    <p className="section-desc-main">
                      {lang === 'EN'
                        ? 'Celebrating medals, essay triumphs, and firefighting rescue challenges won by RKK students.'
                        : 'Apresiasi atas torehan medali, karya tulis ilmiah, dan kejuaraan penanggulangan bencana tingkat nasional.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div className="year-filter-row" style={{ margin: 0 }} ref={prestasiYearRef}>
                      {['2026', '2025', '2024'].map((y) => (
                        <button key={y} className={`year-filter-btn ${prestasiYear === y ? 'active' : ''}`} onClick={() => setPrestasiYear(y)}>{y}</button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select className="month-select-premium" value={prestasiMonth} onChange={(e) => setPrestasiMonth(e.target.value)} aria-label="Filter Bulan">
                        {months.map((m) => (
                          <option key={m.value} value={m.value}>{lang === 'EN' ? m.EN : m.ID}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredAchievements.length === 0 ? (
                    <div className="alumni-empty glass-panel" style={{ padding: '3rem', borderRadius: '18px', textAlign: 'center', color: 'var(--clr-muted)' }}>
                      <p style={{ fontSize: '1rem', margin: 0 }}>{lang === 'EN' ? 'No achievements found for this period.' : 'Tidak ada prestasi mahasiswa untuk periode ini.'}</p>
                    </div>
                  ) : (
                    <div className="history-timeline-col" style={{ paddingLeft: '2.5rem', marginTop: '2rem' }}>
                      <div className="timeline-spine"></div>
                      <div className="timeline-items">
                        {filteredAchievements.map((ach, idx) => (
                          <motion.div className="timeline-item glass-panel" key={ach.id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, delay: idx * 0.1 }}>
                            <div className="timeline-badge achievement-badge"><span>🏆</span></div>
                            <div className="timeline-content achievement-timeline-content">
                              <div className="achievement-header">
                                <h4 className="timeline-item-title" style={{ fontSize: '1.15rem', color: 'var(--clr-text)' }}>{lang === 'EN' ? ach.titleEN : ach.titleID}</h4>
                                <span className="achievement-level-tag">
                                  {lang === 'EN'
                                    ? ach.level === 'national' ? 'National' : ach.level === 'international' ? 'International' : 'Regional'
                                    : ach.level === 'national' ? 'Nasional' : ach.level === 'international' ? 'Internasional' : 'Regional'}
                                </span>
                              </div>
                              <div className="achievement-meta">
                                <span>📅 {ach.date}</span>
                                <span>👤 {ach.awardee}</span>
                                <span>🏆 {lang === 'EN' ? 'Event' : 'Lomba'}: {lang === 'EN' ? ach.eventEN : ach.eventID}</span>
                                <span>📍 {ach.organizer}</span>
                              </div>
                              <p className="timeline-item-desc achievement-desc">{(lang === 'EN' ? ach.descEN : ach.descID) || ''}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PENGHARGAAN */}
              {activeTab === 'penghargaan' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center" style={{ marginBottom: '2.5rem' }}>
                    <span className="section-badge-pill">{lang === 'EN' ? 'Organizational Accolades' : 'Piagam Penghargaan BEM'}</span>
                    <h2 className="section-title-main">
                      {lang === 'EN' ? 'Recognition' : 'Penghargaan'}{' '}
                      <span className="text-gradient-elegant">
                        {awardCategory === 'all' ? (lang === 'EN' ? 'All Categories' : 'Semua Kategori')
                          : awardCategory === 'institution' ? (lang === 'EN' ? 'Institutional' : 'Institusi')
                          : awardCategory === 'organization' ? (lang === 'EN' ? 'Organization' : 'Organisasi')
                          : (lang === 'EN' ? 'Student' : 'Mahasiswa')}
                      </span>
                    </h2>
                    <p className="section-desc-main">
                      {lang === 'EN'
                        ? 'Official citations and credentials awarded to BEMPRKK for community dedication.'
                        : 'Sertifikat apresiasi resmi atas kontribusi aktif pengabdian sosial dan mitigasi kebencanaan dari rektorat dan mitra.'}
                    </p>
                  </div>

                  <div className="year-filter-row" style={{ marginBottom: '1rem' }} ref={penghargaanYearRef}>
                    {awardYears.map((y) => (
                      <button key={y} className={`year-filter-btn ${awardYear === y ? 'active' : ''}`} onClick={() => setAwardYear(y)}>
                        {y === 'all' ? (lang === 'EN' ? 'All Years' : 'Semua') : y}
                      </button>
                    ))}
                  </div>

                  <div className="proker-filter-row" style={{ marginTop: '0.5rem', marginBottom: '2.5rem' }} ref={penghargaanCatRef}>
                    {[
                      { id: 'all', ID: 'Semua', EN: 'All' },
                      { id: 'institution', ID: 'Institusi', EN: 'Institution' },
                      { id: 'organization', ID: 'Organisasi', EN: 'Organization' },
                      { id: 'student', ID: 'Mahasiswa', EN: 'Student' }
                    ].map((f) => (
                      <button key={f.id} className={`proker-filter-btn ${awardCategory === f.id ? 'active' : ''}`} onClick={() => setAwardCategory(f.id as any)}>
                        {lang === 'EN' ? f.EN : f.ID}
                      </button>
                    ))}
                  </div>

                  {filteredAwards.length === 0 ? (
                    <div className="alumni-empty glass-panel" style={{ padding: '3rem', borderRadius: '18px', textAlign: 'center', color: 'var(--clr-muted)' }}>
                      <p style={{ fontSize: '1rem', margin: 0 }}>{lang === 'EN' ? 'No awards found for this category.' : 'Tidak ada piagam penghargaan untuk kategori ini.'}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                      {filteredAwards.map((aw, idx) => (
                        <motion.div className="accreditation-info-card glass-panel award-card" key={aw.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                          {aw.imageUrl && (
                            <div className="award-photo-thumb" onClick={() => setSelectedAwardPhoto({ url: aw.imageUrl!, title: lang === 'EN' ? aw.titleEN : aw.titleID })} title={lang === 'EN' ? 'Click to enlarge' : 'Klik untuk perbesar'}>
                              <img src={aw.imageUrl} alt={lang === 'EN' ? aw.titleEN : aw.titleID} className="award-photo-img" />
                              <div className="award-photo-overlay"><span className="award-photo-zoom-icon">🔍</span></div>
                            </div>
                          )}
                          <div className="award-header">
                            <Award size={36} style={{ color: 'var(--clr-accent)', filter: 'drop-shadow(0 0 6px var(--clr-accent))' }} />
                            <div>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--clr-text)' }}>{getAwardTypeLabel(aw.category)}</h3>
                              <span style={{ fontSize: '0.75rem', color: 'var(--clr-muted)' }}>{lang === 'EN' ? 'Year' : 'Tahun'} {aw.year}</span>
                            </div>
                          </div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--clr-text)', margin: 0 }}>{lang === 'EN' ? aw.titleEN : aw.titleID}</h4>
                          <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '0.85rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--clr-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>{lang === 'EN' ? 'OFFICIAL CITATION' : 'KETERANGAN RESMI'}</span>
                            <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-2)', margin: 0, lineHeight: 1.5 }}>{lang === 'EN' ? aw.descEN : aw.descID}</p>
                          </div>
                          <div className="award-verified-badge">
                            <CheckCircle2 size={13} />
                            <span>{lang === 'EN' ? 'Verified Organization' : 'Terverifikasi Kampus'}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PENGUMUMAN */}
              {activeTab === 'pengumuman' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center" style={{ marginBottom: '2.5rem' }}>
                    <span className="section-badge-pill">{lang === 'EN' ? 'Official Notices' : 'Papan Pengumuman Resmi'}</span>
                    <h2 className="section-title-main">
                      {lang === 'EN' ? 'Important' : 'Pengumuman'} <span className="text-gradient-elegant">{lang === 'EN' ? 'Announcements' : 'Terkini'}</span>
                    </h2>
                    <p className="section-desc-main">
                      {lang === 'EN'
                        ? 'Latest recruitment cycles, licensing registrations, and humanitarian response callouts.'
                        : 'Informasi open recruitment, pendaftaran sertifikasi eksternal, dan aksi kemanusiaan BEMPRKK.'}
                    </p>
                  </div>

                  <div className="proker-filter-row" style={{ marginTop: '0.5rem', marginBottom: '2.5rem' }} ref={pengumumanFilterRef}>
                    {[
                      { id: 'all', ID: 'Semua', EN: 'All' },
                      { id: 'penting', ID: 'Penting', EN: 'Important' },
                      { id: 'umum', ID: 'Umum', EN: 'General' },
                      { id: 'academic', ID: 'Akademik', EN: 'Academic' },
                      { id: 'recruitment', ID: 'Rekrutmen', EN: 'Recruitment' }
                    ].map((f) => (
                      <button key={f.id} className={`proker-filter-btn ${announcementFilter === f.id ? 'active' : ''}`} onClick={() => setAnnouncementFilter(f.id as any)}>
                        {lang === 'EN' ? f.EN : f.ID}
                      </button>
                    ))}
                  </div>

                  {filteredAnnouncements.length === 0 ? (
                    <div className="alumni-empty glass-panel" style={{ padding: '3rem', borderRadius: '18px', textAlign: 'center', color: 'var(--clr-muted)' }}>
                      <p style={{ fontSize: '1rem', margin: 0 }}>{lang === 'EN' ? 'No announcements found for this category.' : 'Tidak ada pengumuman untuk kategori ini.'}</p>
                    </div>
                  ) : (
                    <div className="announcement-list-container">
                      {filteredAnnouncements.map((ann, idx) => (
                        <motion.div className={`glass-panel announcement-card ${ann.urgencyID === 'Penting' ? 'ann-urgent' : 'ann-normal'}`} key={ann.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                          <div className="announcement-header">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--clr-muted)', fontWeight: 600 }}><Calendar size={13} /> {ann.date}</span>
                            <span style={{ padding: '2px 8px', fontSize: '0.68rem', fontWeight: 800, borderRadius: '10px', background: ann.urgencyID === 'Penting' ? 'rgba(255, 69, 0, 0.12)' : 'rgba(255,255,255,0.05)', color: ann.urgencyID === 'Penting' ? 'var(--clr-accent)' : 'var(--clr-muted)' }}>
                              {lang === 'EN' ? ann.urgencyEN : ann.urgencyID}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clr-text)', margin: '0 0 0.5rem 0' }}>{lang === 'EN' ? ann.titleEN : ann.titleID}</h3>
                          <p style={{ fontSize: '0.88rem', color: 'var(--clr-text-2)', lineHeight: 1.5, margin: '0 0 1rem 0' }}>{lang === 'EN' ? ann.contentEN : ann.contentID}</p>
                          {ann.attachmentUrl && (
                            <a href={ann.attachmentUrl} target="_blank" rel="noopener noreferrer" className="btn-glass-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                              {lang === 'EN' ? 'View Attachment / Form' : 'Lihat Lampiran / Form'} <ArrowRight size={13} />
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* AWARD PHOTO LIGHTBOX */}
      <AnimatePresence>
        {selectedAwardPhoto && (
          <motion.div className="reg-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAwardPhoto(null)} style={{ zIndex: 99999, cursor: 'zoom-out' }}>
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'relative', maxWidth: '860px', width: '90vw', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
              <button className="reg-close-btn" onClick={() => setSelectedAwardPhoto(null)} style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--clr-text)' }}><X size={18} /></button>
              <img src={selectedAwardPhoto.url} alt={selectedAwardPhoto.title} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '18px', display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--clr-text-2)', fontWeight: 600 }}>{selectedAwardPhoto.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div className="reg-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedArticle(null); }} style={{ zIndex: 99999 }}>
            <motion.div className="reg-modal" style={{ maxWidth: '720px', padding: '2rem', overflowY: 'auto' }} initial={{ opacity: 0, y: 60, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
              <button className="reg-close-btn" onClick={() => setSelectedArticle(null)} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--clr-text)' }}><X size={18} /></button>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--clr-muted)', marginBottom: '0.75rem', alignItems: 'center' }}>
                <span style={{ padding: '2px 8px', borderRadius: '12px', background: 'rgba(255, 69, 0, 0.1)', color: 'var(--clr-accent)', fontWeight: 700 }}>{lang === 'EN' ? selectedArticle.categoryEN : selectedArticle.categoryID}</span>
                <span>📅 {selectedArticle.date}</span>
                <span>👤 By: {selectedArticle.author}</span>
                <span>⏱ {lang === 'EN' ? selectedArticle.readTimeEN : selectedArticle.readTimeID}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.65rem)', fontWeight: 900, color: 'var(--clr-text)', margin: '0 0 1.5rem 0', lineHeight: 1.35 }}>{lang === 'EN' ? selectedArticle.titleEN : selectedArticle.titleID}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: 'var(--clr-text-2)', fontSize: '0.94rem', lineHeight: 1.7, borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem' }}>
                {(lang === 'EN' ? selectedArticle.contentEN : selectedArticle.contentID).map((paragraph, i) => (
                  <p key={i} style={{ margin: 0 }}>{paragraph}</p>
                ))}
              </div>
              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedArticle(null)} className="btn-nav-cta" style={{ padding: '0.6rem 1.5rem', cursor: 'pointer' }}>{lang === 'EN' ? 'Close Article' : 'Tutup Artikel'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BeritaPage;