import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Search, Filter, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

interface Alumni {
  id: string;
  name: string;
  tahun: string;
  kuliah: string;
  kerja: string;
  foto?: string;
}

const AlumniPage: React.FC = () => {
  const { t } = useLanguage();
  const { content } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  
  const staticAlumni: Alumni[] = content.alumni || [];
  const [selectedYear, setSelectedYear] = useState('Semua');
  const alumniYearRef = useHorizontalScroll<HTMLDivElement>();

  const years = useMemo(() => {
    const uniqueYears = [...new Set(staticAlumni.map((a: Alumni) => a.tahun))].sort((a: string, b: string) => Number(b) - Number(a));
    return ['Semua', ...uniqueYears];
  }, [staticAlumni]);

  const filtered = useMemo(() => {
    return staticAlumni.filter((a: Alumni) => {
      const matchYear = selectedYear === 'Semua' || a.tahun === selectedYear;
      const matchSearch = !searchTerm || a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.kuliah.toLowerCase().includes(searchTerm.toLowerCase()) || a.kerja.toLowerCase().includes(searchTerm.toLowerCase());
      return matchYear && matchSearch;
    });
  }, [searchTerm, selectedYear, staticAlumni]);

  return (
    <section className="alumni-section">
      <div className="container">
        <motion.div className="section-header-block" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-badge-pill">{t.alumni.subtitle}</span>
          <h2 className="section-title-main">
            {t.alumni.title} <span className="text-gradient-elegant">{t.alumni.titleGradient}</span>
          </h2>
          <p className="section-desc-main">{t.alumni.desc}</p>
        </motion.div>

        {/* Stats */}
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

        {/* Search & Filter */}
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
            {years.map((y: string) => (
              <button key={y} className={`year-filter-btn ${selectedYear === y ? 'active' : ''}`} onClick={() => setSelectedYear(y)}>{y}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div className="alumni-grid" layout>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div className="alumni-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>Tidak ada alumni yang cocok dengan pencarian.</p>
              </motion.div>
            ) : (
              filtered.map((a: Alumni, i: number) => (
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
    </section>
  );
};

export default AlumniPage;
