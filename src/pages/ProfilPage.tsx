import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, CheckCircle, ZoomIn, X, Users, GraduationCap, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import About from '../components/About';
import Kepengurusan from '../components/Kepengurusan';

interface Alumni {
  id: string;
  name: string;
  tahun: string;
  kuliah: string;
  kerja: string;
  foto?: string;
}

const staticAlumni: Alumni[] = [
  { id: '1', name: 'Ahmad Fauzi', tahun: '2022', kuliah: 'Universitas Indonesia', kerja: 'PT Pertamina — HSE Officer', foto: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Dina Marlina', tahun: '2022', kuliah: 'Institut Teknologi Bandung', kerja: 'BPBD DKI Jakarta — Staf K3', foto: 'https://i.pravatar.cc/150?img=44' },
  { id: '3', name: 'Ricky Santoso', tahun: '2023', kuliah: 'Universitas Gadjah Mada', kerja: 'PT Chevron — Fire Safety Engineer', foto: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Putri Handayani', tahun: '2023', kuliah: 'Universitas Airlangga', kerja: 'RS Cipto Mangunkusumo — K3RS', foto: 'https://i.pravatar.cc/150?img=47' },
  { id: '5', name: 'Budi Setiawan', tahun: '2023', kuliah: 'Universitas Brawijaya', kerja: 'PT Freeport Indonesia — Safety Inspector', foto: 'https://i.pravatar.cc/150?img=5' },
  { id: '6', name: 'Anisa Rahmat', tahun: '2024', kuliah: 'Universitas Diponegoro', kerja: 'Dinas Pemadam Kebakaran — Investigator', foto: 'https://i.pravatar.cc/150?img=45' },
  { id: '7', name: 'Hendra Gunawan', tahun: '2024', kuliah: 'Universitas Hasanuddin', kerja: 'PT PLN — HSE Supervisor', foto: 'https://i.pravatar.cc/150?img=7' },
  { id: '8', name: 'Sari Dewi', tahun: '2024', kuliah: 'Institut Teknologi Sepuluh Nopember', kerja: 'PT Shell Indonesia — Process Safety', foto: 'https://i.pravatar.cc/150?img=46' },
];

const ProfilPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'sejarah';

  const alumniYearRef = useHorizontalScroll<HTMLDivElement>();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumniYear, setSelectedAlumniYear] = useState('Semua');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const alumniYears = useMemo(() => {
    const uniqueYears = [...new Set(staticAlumni.map(a => a.tahun))].sort((a, b) => Number(b) - Number(a));
    return ['Semua', ...uniqueYears];
  }, []);

  const filteredAlumni = useMemo(() => {
    return staticAlumni.filter(a => {
      const matchYear = selectedAlumniYear === 'Semua' || a.tahun === selectedAlumniYear;
      const matchSearch = !searchTerm ||
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.kuliah.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.kerja.toLowerCase().includes(searchTerm.toLowerCase());
      return matchYear && matchSearch;
    });
  }, [searchTerm, selectedAlumniYear]);

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
              {/* SEJARAH */}
              {activeTab === 'sejarah' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center">
                    <span className="section-badge-pill">{t.history.subtitle}</span>
                    <h2 className="section-title-main">
                      {t.history.title} <span className="text-gradient-elegant">{t.history.titleGradient}</span>
                    </h2>
                  </div>

                  <div className="history-grid">
                    <div className="history-text-col glass-panel">
                      <p className="history-p highlight">{t.history.p1}</p>
                      <p className="history-p">{t.history.p2}</p>
                    </div>

                    <div className="history-timeline-col">
                      <div className="timeline-spine"></div>
                      <div className="timeline-items">
                        {t.history.timeline.map((item: any, idx: number) => (
                          <motion.div
                            className="timeline-item glass-panel"
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                          >
                            <div className="timeline-badge">
                              <span>{item.year}</span>
                            </div>
                            <div className="timeline-content">
                              <h4 className="timeline-item-title">{item.title}</h4>
                              <p className="timeline-item-desc">{item.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VISI MISI */}
              {activeTab === 'misi' && (
                <div className="profile-tab-section no-padding-about">
                  <About />
                </div>
              )}

              {/* KEPENGURUSAN */}
              {activeTab === 'tim' && (
                <div className="profile-tab-section">
                  <Kepengurusan />
                </div>
              )}

              {/* ALUMNI */}
              {activeTab === 'alumni' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center">
                    <span className="section-badge-pill">{t.alumni.subtitle}</span>
                    <h2 className="section-title-main">
                      {t.alumni.title} <span className="text-gradient-elegant">{t.alumni.titleGradient}</span>
                    </h2>
                    <p className="section-desc-main">{t.alumni.desc}</p>
                  </div>

                  <div className="alumni-stats-row">
                    <div className="alumni-stat-card glass-panel">
                      <Users size={24} />
                      <span className="alumni-stat-num">{staticAlumni.length}+</span>
                      <span className="alumni-stat-label">Total Alumni</span>
                    </div>
                    <div className="alumni-stat-card glass-panel">
                      <GraduationCap size={24} />
                      <span className="alumni-stat-num">8+</span>
                      <span className="alumni-stat-label">Universitas</span>
                    </div>
                    <div className="alumni-stat-card glass-panel">
                      <Briefcase size={24} />
                      <span className="alumni-stat-num">6+</span>
                      <span className="alumni-stat-label">Perusahaan</span>
                    </div>
                  </div>

                  <div className="alumni-controls">
                    <div className="alumni-search-wrap">
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Cari nama, kampus, atau perusahaan..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="alumni-search-input"
                      />
                    </div>
                    <div className="alumni-year-filter" ref={alumniYearRef}>
                      <Filter size={16} />
                      {alumniYears.map(y => (
                        <button
                          key={y}
                          className={`year-filter-btn ${selectedAlumniYear === y ? 'active' : ''}`}
                          onClick={() => setSelectedAlumniYear(y)}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.div className="alumni-grid" layout>
                    <AnimatePresence>
                      {filteredAlumni.length === 0 ? (
                        <motion.div className="alumni-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <p>Tidak ada alumni yang cocok dengan pencarian.</p>
                        </motion.div>
                      ) : (
                        filteredAlumni.map((a, i) => (
                          <motion.div
                            key={a.id}
                            className="alumni-card glass-panel"
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <div className="alumni-card-img">
                              <img src={a.foto || `https://i.pravatar.cc/150?img=${i + 1}`} alt={a.name} />
                              <span className="alumni-year-badge">{a.tahun}</span>
                            </div>
                            <div className="alumni-card-info">
                              <h3>{a.name}</h3>
                              <p className="alumni-kuliah"><GraduationCap size={13} /> {a.kuliah}</p>
                              <p className="alumni-kerja"><Briefcase size={13} /> {a.kerja}</p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}

              {/* AKREDITASI */}
              {activeTab === 'akreditasi' && (
                <div className="profile-tab-section">
                  <div className="section-header-block text-center">
                    <span className="section-badge-pill">{t.accreditation.subtitle}</span>
                    <h2 className="section-title-main">
                      {t.accreditation.title} <span className="text-gradient-elegant">{t.accreditation.titleGradient}</span>
                    </h2>
                    <p className="section-desc-main">{t.accreditation.desc}</p>
                  </div>

                  <div className="accreditation-layout">
                    <div className="accreditation-info-card glass-panel">
                      <div className="accred-info-header">
                        <Award size={36} className="accred-icon-sparkle" />
                        <h3>Status Resmi</h3>
                      </div>
                      <div className="accred-info-details">
                        <div className="accred-detail-item">
                          <span className="accred-label">{t.accreditation.statusLabel}</span>
                          <span className="accred-value highlight">{t.accreditation.statusVal}</span>
                        </div>
                        <div className="accred-detail-item">
                          <span className="accred-label">{t.accreditation.skLabel}</span>
                          <span className="accred-value">{t.accreditation.skVal}</span>
                        </div>
                        <div className="accred-detail-item">
                          <span className="accred-label">{t.accreditation.expLabel}</span>
                          <span className="accred-value">{t.accreditation.expVal}</span>
                        </div>
                      </div>
                      <div className="accred-stamp-box">
                        <CheckCircle size={16} />
                        <span>Terakreditasi BAN-PT Nasional</span>
                      </div>
                    </div>

                    <div
                      className="accreditation-image-card glass-panel"
                      onClick={() => setIsLightboxOpen(true)}
                    >
                      <div className="cert-image-wrapper">
                        <img src="/accreditation.png" alt="Sertifikat Akreditasi RKK" className="cert-img" />
                        <div className="cert-hover-overlay">
                          <ZoomIn size={32} />
                          <span>Klik untuk Memperbesar</span>
                        </div>
                      </div>
                      <div className="cert-footer">
                        <span>Sertifikat Akreditasi BAN-PT Rekayasa Keselamatan Kebakaran</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Accreditation Image Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
              <X size={24} />
            </button>
            <motion.img
              src="/accreditation.png"
              alt="Sertifikat Akreditasi Full"
              className="lightbox-img"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
            />
            <div className="lightbox-caption">
              Sertifikat Akreditasi BAN-PT Rekayasa Keselamatan Kebakaran (Masa Berlaku hingga 2030)
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilPage;