import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Handshake, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Programs from '../components/Programs';
import Gallery from '../components/Gallery';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { useContent } from '../context/ContentContext';

const EventPage: React.FC = () => {
  const { lang } = useLanguage();
  const { content } = useContent();

  const staticTrainings = content.trainings || [];
  const staticSeminars = content.seminars || [];
  const staticPartners = content.partnerships || [];
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'proker';

  // Helper: render fee string with parenthetical text below in smaller muted font
  const renderPremiumFee = (feeStr: string) => {
    if (!feeStr) return null;
    const segments = feeStr.split(' / ');
    return (
      <div className="premium-fee-wrapper">
        {segments.map((seg, idx) => {
          const openParen = seg.indexOf('(');
          const closeParen = seg.lastIndexOf(')');
          if (openParen !== -1 && closeParen !== -1 && closeParen > openParen) {
            const mainText = seg.substring(0, openParen).trim();
            const parenText = seg.substring(openParen, closeParen + 1).trim();
            return (
              <div key={idx} className="premium-fee-segment">
                <span>{mainText}</span>
                <span className="premium-fee-paren">{parenText}</span>
              </div>
            );
          }
          return <span key={idx}>{seg}</span>;
        })}
      </div>
    );
  };

  // Dynamic Year Configuration (2024 to current year)
  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  const years: string[] = [];
  for (let y = currentYear; y >= startYear; y--) {
    years.push(y.toString());
  }

  // Status Badge Label configuration
  const statusLabel = {
    done: { text: { ID: 'Telah Selesai', EN: 'Completed' }, cls: 'status-done' },
    ongoing: { text: { ID: 'Sedang Berlangsung', EN: 'Ongoing' }, cls: 'status-ongoing' },
    upcoming: { text: { ID: 'Akan Datang', EN: 'Upcoming' }, cls: 'status-upcoming' },
  };

  // States for Pelatihan (Training)
  const [pelatihanYear, setPelatihanYear] = useState<string>(currentYear.toString());
  const [pelatihanFilter, setPelatihanFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'done'>('all');

  // States for Seminar
  const [seminarYear, setSeminarYear] = useState<string>(currentYear.toString());
  const [seminarFilter, setSeminarFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'done'>('all');

  // States for Kerjasama (Partnerships)
  const [kerjasamaYear, setKerjasamaYear] = useState<string>(currentYear.toString());
  const [kerjasamaFilter, setKerjasamaFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'done'>('all');

  // Coercion & Filtering Logic for Pelatihan
  const isPelatihanPastYear = parseInt(pelatihanYear) < currentYear;
  useEffect(() => {
    if (isPelatihanPastYear && (pelatihanFilter === 'ongoing' || pelatihanFilter === 'upcoming')) {
      setPelatihanFilter('all');
    }
  }, [pelatihanYear, isPelatihanPastYear, pelatihanFilter]);

  const trainingsForSelectedYear = staticTrainings.filter(t => t.year === pelatihanYear);
  const coercedTrainings = trainingsForSelectedYear.map(t => {
    if (isPelatihanPastYear) return { ...t, status: 'done' as const };
    return t;
  });
  const filteredTrainings = pelatihanFilter === 'all'
    ? coercedTrainings
    : coercedTrainings.filter(t => t.status === pelatihanFilter);

  const pelatihanFilters = [
    { id: 'all', ID: 'Semua', EN: 'All' },
    ...(isPelatihanPastYear ? [] : [
      { id: 'ongoing', ID: 'Sedang Berlangsung', EN: 'Ongoing' },
      { id: 'upcoming', ID: 'Akan Datang', EN: 'Upcoming' }
    ]),
    { id: 'done', ID: 'Telah Selesai', EN: 'Completed' },
  ];

  // Coercion & Filtering Logic for Seminar
  const isSeminarPastYear = parseInt(seminarYear) < currentYear;
  useEffect(() => {
    if (isSeminarPastYear && (seminarFilter === 'ongoing' || seminarFilter === 'upcoming')) {
      setSeminarFilter('all');
    }
  }, [seminarYear, isSeminarPastYear, seminarFilter]);

  const seminarsForSelectedYear = staticSeminars.filter(s => s.date.startsWith(seminarYear));
  const coercedSeminars = seminarsForSelectedYear.map(s => {
    if (isSeminarPastYear) return { ...s, status: 'done' as const };
    return s;
  });
  const filteredSeminars = seminarFilter === 'all'
    ? coercedSeminars
    : coercedSeminars.filter(s => s.status === seminarFilter);

  const seminarFilters = [
    { id: 'all', ID: 'Semua', EN: 'All' },
    ...(isSeminarPastYear ? [] : [
      { id: 'ongoing', ID: 'Sedang Berlangsung', EN: 'Ongoing' },
      { id: 'upcoming', ID: 'Akan Datang', EN: 'Upcoming' }
    ]),
    { id: 'done', ID: 'Telah Selesai', EN: 'Completed' },
  ];

  // Coercion & Filtering Logic for Kerjasama
  const isKerjasamaPastYear = parseInt(kerjasamaYear) < currentYear;
  useEffect(() => {
    if (isKerjasamaPastYear && (kerjasamaFilter === 'ongoing' || kerjasamaFilter === 'upcoming')) {
      setKerjasamaFilter('all');
    }
  }, [kerjasamaYear, isKerjasamaPastYear, kerjasamaFilter]);

  const kerjasamaForSelectedYear = staticPartners.filter(p => p.year === kerjasamaYear);
  const coercedKerjasama = kerjasamaForSelectedYear.map(p => {
    if (isKerjasamaPastYear) return { ...p, status: 'done' as const };
    return p;
  });
  const filteredKerjasama = kerjasamaFilter === 'all'
    ? coercedKerjasama
    : coercedKerjasama.filter(p => p.status === kerjasamaFilter);

  const kerjasamaFilters = [
    { id: 'all', ID: 'Semua', EN: 'All' },
    ...(isKerjasamaPastYear ? [] : [
      { id: 'ongoing', ID: 'Sedang Berlangsung', EN: 'Ongoing' },
      { id: 'upcoming', ID: 'Akan Datang', EN: 'Upcoming' }
    ]),
    { id: 'done', ID: 'Telah Selesai', EN: 'Completed' },
  ];

  // Sync scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Horizontal scroll refs for mobile filter rows
  const pelatihanYearRef = useHorizontalScroll<HTMLDivElement>();
  const pelatihanFilterRef = useHorizontalScroll<HTMLDivElement>();
  const seminarYearRef = useHorizontalScroll<HTMLDivElement>();
  const seminarFilterRef = useHorizontalScroll<HTMLDivElement>();
  const kerjasamaYearRef = useHorizontalScroll<HTMLDivElement>();
  const kerjasamaFilterRef = useHorizontalScroll<HTMLDivElement>();

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
              {/* TAB 1: PROGRAM KERJA */}
              {activeTab === 'proker' && (
                <div className="profile-tab-section no-padding-about">
                  <Programs />
                </div>
              )}

              {/* TAB 2: GALERI */}
              {activeTab === 'galeri' && (
                <div className="profile-tab-section no-padding-about">
                  <Gallery />
                </div>
              )}

              {/* TAB 3: PELATIHAN */}
              {activeTab === 'pelatihan' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center" style={{ marginBottom: '2.5rem' }}>
                    <span className="section-badge-pill">
                      {lang === 'EN' ? 'Professional Training' : 'Pelatihan K3'}
                    </span>
                    <h2 className="section-title-main">
                      {lang === 'EN' ? 'Safety' : 'Sertifikasi &'} <span className="text-gradient-elegant">{lang === 'EN' ? 'Certifications' : 'Pelatihan K3'}</span>
                    </h2>
                    <p className="section-desc-main">
                      {lang === 'EN'
                        ? 'Professional competency certification courses to prepare certified occupational health & safety specialists.'
                        : 'Program sertifikasi kompetensi profesional untuk membekali calon ahli keselamatan dan kesehatan kerja.'}
                    </p>
                  </div>

                  <div className="year-filter-row" style={{ marginBottom: '1rem' }} ref={pelatihanYearRef}>
                    {years.map((y) => (
                      <button key={y} className={`year-filter-btn ${pelatihanYear === y ? 'active' : ''}`} onClick={() => setPelatihanYear(y)}>{y}</button>
                    ))}
                  </div>

                  <div className="proker-filter-row" style={{ marginTop: '0.5rem', marginBottom: '2.5rem' }} ref={pelatihanFilterRef}>
                    {pelatihanFilters.map((f) => (
                      <button key={f.id} className={`proker-filter-btn ${pelatihanFilter === f.id ? 'active' : ''}`} onClick={() => setPelatihanFilter(f.id as any)}>
                        {lang === 'EN' ? f.EN : f.ID}
                      </button>
                    ))}
                  </div>

                  {filteredTrainings.length === 0 ? (
                    <div className="alumni-empty glass-panel" style={{ padding: '3rem', borderRadius: '18px', textAlign: 'center', color: 'var(--clr-muted)' }}>
                      <p style={{ fontSize: '1rem', margin: 0 }}>{lang === 'EN' ? 'No safety training found for this filter.' : 'Tidak ada pelatihan K3 untuk filter ini.'}</p>
                    </div>
                  ) : (
                    <div className="training-grid">
                      {filteredTrainings.map((train, idx) => (
                        <motion.div className="proker-card glass-panel training-card" key={train.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -5 }}>
                          <div className="training-card-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <span className="training-duration-pill">{lang === 'EN' ? train.durationEN : train.durationID}</span>
                              <span className={`proker-status-pill ${statusLabel[train.status].cls}`}>{lang === 'EN' ? statusLabel[train.status].text.EN : statusLabel[train.status].text.ID}</span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--clr-muted)', fontWeight: 600 }}>{lang === 'EN' ? 'HSE Certification' : 'Sertifikasi K3'}</span>
                          </div>
                          <div>
                            <h3 className="training-card-title">{lang === 'EN' ? train.titleEN : train.titleID}</h3>
                            <p className="training-card-desc">{lang === 'EN' ? train.descEN : train.descID}</p>
                          </div>
                          <div className="training-syllabus-box">
                            <h4 className="training-syllabus-title">{lang === 'EN' ? 'Syllabus Highlights' : 'Materi Pokok'}</h4>
                            <ul className="training-syllabus-list">
                              {train.syllabus.map((syl, i) => (
                                <li key={i} className="training-syllabus-item"><CheckCircle2 size={12} style={{ color: '#22c55e' }} />{syl}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="training-details-list">
                            <div className="training-detail-row">
                              <span className="training-detail-label">{lang === 'EN' ? 'Certificate:' : 'Sertifikat:'}</span>
                              <span className="training-detail-val">{lang === 'EN' ? train.certEN : train.certID}</span>
                            </div>
                            <div className="training-detail-row">
                              <span className="training-detail-label">{lang === 'EN' ? 'Fee:' : 'Investasi:'}</span>
                              <span className="training-detail-val-accent">{renderPremiumFee(lang === 'EN' ? train.feeEN : train.feeID)}</span>
                            </div>
                          </div>
                          {train.status === 'upcoming' ? (
                            <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="btn-elegant-primary training-register-btn">
                              {lang === 'EN' ? 'Register Training' : 'Daftar Pelatihan'} <ExternalLink size={14} />
                            </a>
                          ) : (
                            <button disabled className="btn-proker-status-disabled training-register-btn" style={{ width: '100%' }}>
                              {lang === 'EN' ? 'Registration Closed' : 'Pendaftaran Ditutup'}
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SEMINAR */}
              {activeTab === 'seminar' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center" style={{ marginBottom: '2.5rem' }}>
                    <span className="section-badge-pill">{lang === 'EN' ? 'Knowledge Sharing' : 'Seminar Keselamatan'}</span>
                    <h2 className="section-title-main">
                      {lang === 'EN' ? 'HSE' : 'Seminar &'} <span className="text-gradient-elegant">{lang === 'EN' ? 'Seminars' : 'Webinar K3'}</span>
                    </h2>
                    <p className="section-desc-main">
                      {lang === 'EN'
                        ? 'Enhance your safety intelligence through national and international webinars led by safety leaders.'
                        : 'Tingkatkan wawasan keselamatan Anda melalui seminar nasional dan internasional bersama pakar industri.'}
                    </p>
                  </div>

                  <div className="year-filter-row" style={{ marginBottom: '1rem' }} ref={seminarYearRef}>
                    {years.map((y) => (
                      <button key={y} className={`year-filter-btn ${seminarYear === y ? 'active' : ''}`} onClick={() => setSeminarYear(y)}>{y}</button>
                    ))}
                  </div>

                  <div className="proker-filter-row" style={{ marginTop: '0.5rem', marginBottom: '2.5rem' }} ref={seminarFilterRef}>
                    {seminarFilters.map((f) => (
                      <button key={f.id} className={`proker-filter-btn ${seminarFilter === f.id ? 'active' : ''}`} onClick={() => setSeminarFilter(f.id as any)}>
                        {lang === 'EN' ? f.EN : f.ID}
                      </button>
                    ))}
                  </div>

                  {filteredSeminars.length === 0 ? (
                    <div className="alumni-empty glass-panel" style={{ padding: '3rem', borderRadius: '18px', textAlign: 'center', color: 'var(--clr-muted)' }}>
                      <p style={{ fontSize: '1rem', margin: 0 }}>{lang === 'EN' ? 'No safety seminars found for this filter.' : 'Tidak ada seminar K3 untuk filter ini.'}</p>
                    </div>
                  ) : (
                    <div className="seminar-list-container">
                      {filteredSeminars.map((sem, idx) => (
                        <motion.div className="glass-panel seminar-card" key={sem.id} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.008 }}>
                          <div className="seminar-date-badge">
                            <span className="seminar-date-month">{new Date(sem.date).toLocaleString(lang === 'EN' ? 'en-US' : 'id-ID', { month: 'short' })}</span>
                            <span className="seminar-date-day">{new Date(sem.date).getDate()}</span>
                            <span className="seminar-date-year">{new Date(sem.date).getFullYear()}</span>
                          </div>
                          <div className="seminar-info-col">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                              <span className={`proker-status-pill ${statusLabel[sem.status].cls}`}>{lang === 'EN' ? statusLabel[sem.status].text.EN : statusLabel[sem.status].text.ID}</span>
                            </div>
                            <h3 className="seminar-title">{lang === 'EN' ? sem.titleEN : sem.titleID}</h3>
                            <div className="seminar-meta">
                              <span>👨‍🏫 <strong>{sem.speaker}</strong> ({lang === 'EN' ? sem.speakerRoleEN : sem.speakerRoleID})</span>
                              <span>📍 {sem.platform}</span>
                            </div>
                          </div>
                          <div className="seminar-action-col">
                            <span className="seminar-fee-label">{lang === 'EN' ? 'Registration Fee:' : 'Biaya Registrasi:'}</span>
                            <span className="seminar-fee-value">{renderPremiumFee(lang === 'EN' ? sem.feeEN : sem.feeID)}</span>
                            {sem.status === 'upcoming' ? (
                              <a href="https://zoom.us" target="_blank" rel="noopener noreferrer" className="btn-proker-join-premium" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', width: 'fit-content' }}>
                                {lang === 'EN' ? 'Join Seminar' : 'Ikuti Seminar'} <ExternalLink size={13} />
                              </a>
                            ) : (
                              <button disabled className="btn-proker-status-disabled" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'not-allowed', width: 'fit-content' }}>
                                {lang === 'EN' ? 'Closed' : 'Ditutup'}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: KERJASAMA */}
              {activeTab === 'kerjasama' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center" style={{ marginBottom: '2.5rem' }}>
                    <span className="section-badge-pill">{lang === 'EN' ? 'Partnership Networks' : 'Jaringan Kemitraan'}</span>
                    <h2 className="section-title-main" style={{ fontSize: '1.6rem' }}>
                      {lang === 'EN' ? 'Our Strategic' : 'Kemitraan Strategis'} <span className="text-gradient-elegant">{lang === 'EN' ? 'Alliances' : 'Kami'}</span>
                    </h2>
                    <p className="section-desc-main" style={{ fontSize: '0.88rem' }}>
                      {lang === 'EN'
                        ? 'BEMPRKK actively collaborates with municipal departments, disaster prevention bodies, and national energy conglomerates to supply high-quality industrial safety exposure.'
                        : 'BEMPRKK aktif membangun sinergi bersama pemadam kebakaran kota, dinas penanggulangan bencana, serta perusahaan energi nasional guna memfasilitasi peningkatan karir profesional mahasiswa.'}
                    </p>
                  </div>

                  <div className="year-filter-row" style={{ marginBottom: '1rem' }} ref={kerjasamaYearRef}>
                    {years.map((y) => (
                      <button key={y} className={`year-filter-btn ${kerjasamaYear === y ? 'active' : ''}`} onClick={() => setKerjasamaYear(y)}>{y}</button>
                    ))}
                  </div>

                  <div className="proker-filter-row" style={{ marginTop: '0.5rem', marginBottom: '2.5rem' }} ref={kerjasamaFilterRef}>
                    {kerjasamaFilters.map((f) => (
                      <button key={f.id} className={`proker-filter-btn ${kerjasamaFilter === f.id ? 'active' : ''}`} onClick={() => setKerjasamaFilter(f.id as any)}>
                        {lang === 'EN' ? f.EN : f.ID}
                      </button>
                    ))}
                  </div>

                  {filteredKerjasama.length === 0 ? (
                    <div className="alumni-empty glass-panel" style={{ padding: '3rem', borderRadius: '18px', textAlign: 'center', color: 'var(--clr-muted)' }}>
                      <p style={{ fontSize: '1rem', margin: 0 }}>{lang === 'EN' ? 'No partnerships found for this filter.' : 'Tidak ada kemitraan untuk filter ini.'}</p>
                    </div>
                  ) : (
                    <div className="partners-list-container">
                      {filteredKerjasama.map((partner, idx) => (
                        <motion.div className="glass-panel partner-card" key={partner.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                          <div className="partner-logo-wrapper">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
                              <Handshake size={36} style={{ color: 'var(--clr-accent)' }} />
                              <span style={{ fontSize: '0.68rem', color: 'var(--clr-muted)', fontWeight: 700, textTransform: 'uppercase' }}>PARTNER</span>
                            </div>
                          </div>
                          <div className="partner-info-col">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                              <span className={`proker-status-pill ${statusLabel[partner.status].cls}`}>{lang === 'EN' ? statusLabel[partner.status].text.EN : statusLabel[partner.status].text.ID}</span>
                            </div>
                            <h3 className="partner-name">{partner.name}</h3>
                            <div>
                              <span className="partner-scope-label">{lang === 'EN' ? 'Scope of Collaboration' : 'Lingkup Kerjasama'}</span>
                              <p className="partner-scope-desc">{lang === 'EN' ? partner.scopeEN : partner.scopeID}</p>
                            </div>
                            <div className="partner-desc-quote">
                              <p className="partner-desc-quote-text">&ldquo;{lang === 'EN' ? partner.descEN : partner.descID}&rdquo;</p>
                            </div>
                          </div>
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
    </div>
  );
};

export default EventPage;