import { type FC, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { Link, useSearchParams } from 'react-router-dom';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

const categories = ['Semua', 'Pelatihan', 'Seminar', 'Kunjungan Industri', 'Studi Banding', 'Kegiatan'];

const programMapping: Record<string, string> = {
  'Fire Safety Training 2025': '1',
  'Seminar K3 Nasional 2025': '2',
  'Kunjungan Industri Kilang Minyak': '3',
  'Safety Awareness Campus Campaign': '4',
  'Workshop Rescue & First Aid': '5',
  'Bakti Sosial Keselamatan': '6',
  'Studi Banding Sistem Proteksi Kebakaran': '7',
  'Simulasi Evakuasi Kebakaran Gedung 2026': '8',
  'Workshop Rescue & First Aid 2026': '9',
  'Riset Proteksi Bahaya Kebakaran Kampus': '10',
  'Pelatihan Penggunaan APAR 2024': '11',
  'Safety Campaign 2024': '12',
};

const Gallery: FC = () => {
  const { lang, t } = useLanguage();
  const { content } = useContent();
  const images = content.images.gallery;
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchParams, setSearchParams] = useSearchParams();
  const yearFilterRef = useHorizontalScroll<HTMLDivElement>();
  const catFilterRef = useHorizontalScroll<HTMLDivElement>();

  // Dynamic Year Configuration
  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  const years: string[] = [];
  for (let y = currentYear; y >= startYear; y--) {
    years.push(y.toString());
  }

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

  // Ambil parameter program dari URL jika ada
  const programQuery = searchParams.get('program');

  useEffect(() => {
    if (selectedImage) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedImage]);

  // Set the year filter if there is a programQuery matching an image's title or category
  useEffect(() => {
    if (programQuery) {
      const matchedImg = images.find(img => 
        img.title.toLowerCase().includes(programQuery.toLowerCase()) || 
        img.cat.toLowerCase().includes(programQuery.toLowerCase())
      );
      const matchedYear = matchedImg?.year || '2025';
      setSelectedYear(matchedYear);
    }
  }, [programQuery, images]);

  // Filter based on selected year AND (programQuery or category activeFilter)
  const filtered = images.filter(img => {
    const imgYear = img.year || '2025';
    const matchYear = imgYear === selectedYear;
    if (!matchYear) return false;

    if (programQuery) {
      return (
        img.title.toLowerCase().includes(programQuery.toLowerCase()) || 
        img.cat.toLowerCase().includes(programQuery.toLowerCase())
      );
    } else {
      return activeFilter === 'Semua' || img.cat === activeFilter;
    }
  });

  const currentIndex = filtered.findIndex(img => img === selectedImage);

  const prev = () => {
    if (currentIndex > 0) setSelectedImage(filtered[currentIndex - 1]);
  };
  const next = () => {
    if (currentIndex < filtered.length - 1) setSelectedImage(filtered[currentIndex + 1]);
  };

  const handleClearProgramFilter = () => {
    // Preserve existing params (e.g., 'tab') and only remove 'program'
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('program');
    setSearchParams(newParams);
    setActiveFilter('Semua');
  };

  return (
    <section id="gallery" className="gallery-section-v2">
      <div className="container">
        <motion.div
          className="section-header-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge-pill">{t.gallery.subtitle}</span>
          <h2 className="section-title-main">
            {t.gallery.title} <span className="text-gradient-elegant">{t.gallery.titleGradient}</span>
          </h2>
          <p className="section-desc-main">{t.gallery.desc}</p>
        </motion.div>

        {/* Year Filter Switcher */}
        <div className="year-filter-row" style={{ marginBottom: '1.5rem' }} ref={yearFilterRef}>
          {years.map((y) => (
            <button
              key={y}
              className={`year-filter-btn ${selectedYear === y ? 'active' : ''}`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Info filter aktif dari Program */}
        {programQuery ? (
          <div 
            className="gallery-active-query-badge" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'var(--clr-glass)', 
              border: '1px solid var(--clr-border)', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '30px', 
              width: 'fit-content', 
              margin: '0 auto 2.5rem', 
              fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          >
            <span>
              {lang === 'EN' ? 'Showing documentation for: ' : 'Menampilkan dokumentasi untuk: '}
              <strong>{programQuery}</strong>
            </span>
            <button 
              onClick={handleClearProgramFilter} 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--clr-accent)', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center',
                padding: '2px',
                borderRadius: '50%'
              }}
              title={lang === 'EN' ? 'Reset filter' : 'Reset filter'}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="gallery-filter-row" ref={catFilterRef} style={{ marginTop: '0.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`gallery-filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <motion.div className="gallery-grid-v2" layout>
          <AnimatePresence>
            {filtered.map((img, i) => (
              <motion.div
                key={img.url}
                className="gallery-item-v2"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img.url} alt={img.title} loading="lazy" />
                <div className="gallery-item-overlay">
                  <Maximize2 size={20} />
                  <span>{img.title}</span>
                </div>
                <span className="gallery-item-cat">{img.cat}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--clr-muted)' }}>
            <p>{lang === 'EN' ? 'No documentation photos found for this filter.' : 'Tidak ada foto dokumentasi ditemukan untuk filter ini.'}</p>
            {programQuery && (
              <button onClick={handleClearProgramFilter} className="btn-elegant-primary" style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                {lang === 'EN' ? 'Show All Photos' : 'Tampilkan Semua Foto'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && createPortal(
        <motion.div
          className="gallery-lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <button className="lightbox-close" onClick={() => setSelectedImage(null)}><X size={24} /></button>
          <button className="lightbox-prev" onClick={e => { e.stopPropagation(); prev(); }} disabled={currentIndex === 0}><ChevronLeft size={32} /></button>
          
          <div className="lightbox-content" onClick={e => e.stopPropagation()} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.img
              key={selectedImage.url}
              src={selectedImage.url}
              alt={selectedImage.title}
              className="lightbox-img"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
            />
            
            <div className="lightbox-caption" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%', textAlign: 'center', padding: '15px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{selectedImage.title}</span>
              {programMapping[selectedImage.title] && (
                <Link
                  to={`/program?highlight=${programMapping[selectedImage.title]}`}
                  className="lightbox-program-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    background: 'var(--clr-accent)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    marginTop: '4px',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <LinkIcon size={12} />
                  {lang === 'EN' ? 'View Related Work Program' : 'Lihat Program Kerja Terkait'}
                </Link>
              )}
            </div>
          </div>

          <button className="lightbox-next" onClick={e => { e.stopPropagation(); next(); }} disabled={currentIndex === filtered.length - 1}><ChevronRight size={32} /></button>
        </motion.div>,
        document.body
      )}
    </section>
  );
};

export default Gallery;
