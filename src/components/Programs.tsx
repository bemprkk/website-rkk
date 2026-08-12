import { type FC, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Flame, ShieldCheck, Users, Handshake, Cpu, Globe, Trophy, Layers, 
  ArrowRight, X, CheckCircle, User, Mail, Phone, BookOpen, Calendar, Camera, Target
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

const getIcon = (title: string, size = 32) => {
  const t = title.toLowerCase();
  if (t.includes('fire') || t.includes('apar')) return <Flame size={size} />;
  if (t.includes('seminar') || t.includes('workshop')) return <Trophy size={size} />;
  if (t.includes('kunjungan') || t.includes('visit')) return <Globe size={size} />;
  if (t.includes('sosial') || t.includes('campaign') || t.includes('bakti')) return <Users size={size} />;
  if (t.includes('kolaborasi')) return <Handshake size={size} />;
  if (t.includes('internal') || t.includes('pelatihan')) return <ShieldCheck size={size} />;
  if (t.includes('riset')) return <Cpu size={size} />;
  if (t.includes('studi') || t.includes('banding')) return <Globe size={size} />;
  return <Layers size={size} />;
};

type Proker = {
  id: string;
  nama: string;
  jenis: string;
  penanggungJawab: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  durasi: string;
  status: 'upcoming' | 'ongoing' | 'done';
  deskripsi?: string;
  foto?: string;
  terbukaUntuk: { ID: string; EN: string };
};


const statusLabel: Record<Proker['status'], { text: { ID: string; EN: string }; cls: string }> = {
  done: { text: { ID: 'Telah Selesai', EN: 'Completed' }, cls: 'status-done' },
  ongoing: { text: { ID: 'Sedang Berlangsung', EN: 'Ongoing' }, cls: 'status-ongoing' },
  upcoming: { text: { ID: 'Akan Datang', EN: 'Upcoming' }, cls: 'status-upcoming' },
};

const Programs: FC = () => {
  const { lang, t } = useLanguage();
  const { content } = useContent();
  const staticProker: Proker[] = useMemo(() => {
    return (content.proker || []).map((p): Proker => ({
      id: p.id,
      nama: lang === 'EN' ? p.namaEN : p.namaID,
      jenis: lang === 'EN' ? p.jenisEN : p.jenisID,
      penanggungJawab: p.penanggungJawab,
      tanggalMulai: p.tanggalMulai,
      tanggalSelesai: p.tanggalSelesai,
      durasi: p.durasi,
      status: p.status,
      deskripsi: lang === 'EN' ? p.descEN : p.descID,
      foto: p.foto,
      terbukaUntuk: {
        ID: 'Semua Mahasiswa',
        EN: 'All Students'
      }
    }));
  }, [content.proker, lang]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ongoing' | 'upcoming' | 'done'>('all');
  const [selectedProker, setSelectedProker] = useState<Proker | null>(null);
  const [selectedDetailProker, setSelectedDetailProker] = useState<Proker | null>(null);
  const [searchParams] = useSearchParams();
  
  // Highlighted program dari parameter url (?highlight=X)
  const highlightId = searchParams.get('highlight');

  // Dynamic Year Configuration
  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  const years: string[] = [];
  for (let y = currentYear; y >= startYear; y--) {
    years.push(y.toString());
  }

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

  // Horizontal scroll refs for mobile filter rows
  const yearFilterRef = useHorizontalScroll<HTMLDivElement>();
  const prokerFilterRef = useHorizontalScroll<HTMLDivElement>();

  // State for join program form
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', nim: '', prodi: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (highlightId) {
      const prog = staticProker.find(p => p.id === highlightId);
      if (prog) {
        const progYear = prog.tanggalMulai.split('-')[0];
        setSelectedYear(progYear);
      }

      // Tunggu render selesai baru scroll
      setTimeout(() => {
        const cardElement = document.getElementById(`proker-card-${highlightId}`);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [highlightId]);

  // Adjust active status filter if moving to a past year
  const isPastYear = parseInt(selectedYear) < currentYear;
  useEffect(() => {
    if (isPastYear && (activeFilter === 'ongoing' || activeFilter === 'upcoming')) {
      setActiveFilter('all');
    }
  }, [selectedYear, isPastYear, activeFilter]);

  const handleCloseModal = () => {
    setSelectedProker(null);
    setIsSubmitted(false);
    setFormData({ name: '', email: '', phone: '', nim: '', prodi: '' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProker) return;

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    // Simpan ke localStorage agar tercatat sebagai peserta program
    const newParticipant = {
      id: Date.now().toString(),
      programId: selectedProker.id,
      programName: selectedProker.nama,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nim: formData.nim,
      prodi: formData.prodi,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('bemprkk_participants') || '[]');
      localStorage.setItem('bemprkk_participants', JSON.stringify([newParticipant, ...existing]));
    } catch (err) {
      console.error('Error saving participant:', err);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    setTimeout(() => {
      handleCloseModal();
    }, 3500);
  };

  // Filter programs for the selected year and coerce status of past years to 'done'
  const programsForSelectedYear = staticProker.filter(p => p.tanggalMulai.startsWith(selectedYear));
  const coercedPrograms = programsForSelectedYear.map(p => {
    if (isPastYear) {
      return { ...p, status: 'done' as const };
    }
    return p;
  });

  const filteredProkers = activeFilter === 'all'
    ? coercedPrograms
    : coercedPrograms.filter(p => p.status === activeFilter);

  // Dynamic filter buttons depending on year
  const filters = [
    { id: 'all', ID: 'Semua', EN: 'All' },
    ...(isPastYear ? [] : [
      { id: 'ongoing', ID: 'Sedang Berlangsung', EN: 'Ongoing' },
      { id: 'upcoming', ID: 'Akan Datang', EN: 'Upcoming' }
    ]),
    { id: 'done', ID: 'Telah Selesai', EN: 'Completed' },
  ];

  return (
    <section id="programs" className="programs-section-v2">
      <div className="container">
        <motion.div
          className="section-header-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge-pill">{t.programs.subtitle}</span>
          <h2 className="section-title-main">
            {t.programs.title} <span className="text-gradient-elegant">{t.programs.titleGradient}</span>
          </h2>
          <p className="section-desc-main">{t.programs.desc}</p>
        </motion.div>

        {/* Year Filter Switcher */}
        <div className="year-filter-row" style={{ marginBottom: '1rem' }} ref={yearFilterRef}>
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

        {/* Filter Switcher */}
        <div className="proker-filter-row" style={{ marginTop: '0.5rem' }} ref={prokerFilterRef}>
          {filters.map((f) => (
            <button
              key={f.id}
              className={`proker-filter-btn ${activeFilter === f.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.id as any)}
            >
              {lang === 'EN' ? f.EN : f.ID}
            </button>
          ))}
        </div>

        <div className="proker-grid">
          {filteredProkers.map((proker, i) => {
            const sl = statusLabel[proker.status];
            const displayStatusText = lang === 'EN' ? sl.text.EN : sl.text.ID;
            const isHighlighted = highlightId === proker.id;

            return (
              <motion.div
                key={proker.id}
                id={`proker-card-${proker.id}`}
                className={`proker-card ${isHighlighted ? 'proker-card-highlighted' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                onClick={() => setSelectedDetailProker(proker)}
              >
                {/* Visual Cover Foto Program */}
                <div className="proker-img-wrap">
                  {proker.foto ? (
                    <img src={proker.foto} alt={proker.nama} className="proker-card-img" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }} />
                  )}
                  <div className="proker-icon-overlay">
                    {getIcon(proker.nama, 16)}
                  </div>
                </div>

                <div className="proker-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%' }}>
                  <div className="proker-top-row">
                    <span className={`proker-status-pill ${sl.cls}`}>{displayStatusText}</span>
                    <span className="proker-jenis">{proker.jenis}</span>
                  </div>
                  <h3 className="proker-title">{proker.nama}</h3>
                  <p className="proker-desc" style={{ flexGrow: 1, marginBottom: '0.75rem' }}>
                    {proker.deskripsi && proker.deskripsi.length > 100 
                      ? `${proker.deskripsi.slice(0, 100)}...` 
                      : proker.deskripsi
                    }
                  </p>
                  
                  <span style={{ fontSize: '0.8rem', color: 'var(--clr-accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.25rem', cursor: 'pointer' }}>
                    {lang === 'EN' ? 'View Details' : 'Lihat Detail Selengkapnya'} →
                  </span>

                  <div className="proker-meta" style={{ marginBottom: '1.25rem' }}>
                    <span>📅 {proker.tanggalMulai}</span>
                    <span>⏱ {proker.durasi}</span>
                  </div>

                  <div className="proker-action-row" style={{ marginTop: 'auto' }}>
                    {proker.status === 'done' ? (
                      <Link 
                        to={`/galeri?program=${encodeURIComponent(proker.nama)}`} 
                        className="btn-proker-gallery"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Camera size={14} />
                        {lang === 'EN' ? 'View Documentation' : 'Lihat Dokumentasi'}
                      </Link>
                    ) : proker.status === 'ongoing' ? (
                      <button
                        disabled
                        className="btn-proker-status-disabled"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lang === 'EN' ? 'Registration Closed' : 'Pendaftaran Ditutup'}
                      </button>
                    ) : (
                      <button
                        className="btn-proker-join-premium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProker(proker);
                        }}
                      >
                        {lang === 'EN' ? 'Join This Program' : 'Ikuti Program Ini'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="program-highlights-cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: '3.5rem' }}
        >
          <Link to="/kontak" className="btn-elegant-primary">
            {lang === 'EN' ? 'Inquire Other Programs' : 'Tanya Program Lainnya'} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>

      {/* Modal Detail Program */}
      <AnimatePresence>
        {selectedDetailProker && (
          <motion.div
            className="reg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedDetailProker(null); }}
          >
            <motion.div
              className="reg-modal"
              style={{ maxWidth: '600px', padding: '0', overflowY: 'auto' }}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <button 
                className="reg-close-btn" 
                onClick={() => setSelectedDetailProker(null)}
                style={{ 
                  zIndex: 10, 
                  background: 'rgba(0,0,0,0.5)', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  top: '12px',
                  right: '12px'
                }}
              >
                <X size={18} />
              </button>

              {/* Cover Foto */}
              <div style={{ width: '100%', height: 'clamp(160px, 25vh, 220px)', position: 'relative', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', overflow: 'hidden' }}>
                <img 
                  src={selectedDetailProker.foto} 
                  alt={selectedDetailProker.nama} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 10%, rgba(0,0,0,0.2) 70%, transparent)' }} />
                <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <span className={`proker-status-pill ${statusLabel[selectedDetailProker.status].cls}`}>
                      {lang === 'EN' ? statusLabel[selectedDetailProker.status].text.EN : statusLabel[selectedDetailProker.status].text.ID}
                    </span>
                    <span className="proker-jenis" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
                      {selectedDetailProker.jenis}
                    </span>
                  </div>
                  <h2 style={{ color: 'white', fontSize: 'clamp(1.15rem, 4vw, 1.45rem)', fontWeight: 800, margin: 0 }}>
                    {selectedDetailProker.nama}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--clr-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>
                    {lang === 'EN' ? 'Description' : 'Deskripsi Kegiatan'}
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: 'var(--clr-text)', lineHeight: 1.6, margin: 0 }}>
                    {selectedDetailProker.deskripsi}
                  </p>
                </div>

                <div style={{ background: 'var(--clr-glass)', border: '1px solid var(--clr-border)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--clr-text)', fontWeight: 700, marginBottom: '0.75rem' }}>
                    {lang === 'EN' ? 'Program Details & Eligibility' : 'Detail Program & Kriteria'}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Calendar size={16} style={{ color: 'var(--clr-accent)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-muted)', fontWeight: 600 }}>{lang === 'EN' ? 'DATE' : 'TANGGAL'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--clr-text)', fontWeight: 600 }}>{selectedDetailProker.tanggalMulai} s/d {selectedDetailProker.tanggalSelesai}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Calendar size={16} style={{ color: 'var(--clr-accent)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-muted)', fontWeight: 600 }}>{lang === 'EN' ? 'DURATION' : 'DURASI'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--clr-text)', fontWeight: 600 }}>{selectedDetailProker.durasi}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <User size={16} style={{ color: 'var(--clr-accent)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-muted)', fontWeight: 600 }}>{lang === 'EN' ? 'PIC' : 'PENANGGUNG JAWAB'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--clr-text)', fontWeight: 600 }}>{selectedDetailProker.penanggungJawab}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <Target size={16} style={{ color: 'var(--clr-accent)', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--clr-muted)', fontWeight: 600 }}>{lang === 'EN' ? 'ELIGIBILITY' : 'TERBUKA UNTUK'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--clr-text)', fontWeight: 600 }}>
                          {lang === 'EN' ? selectedDetailProker.terbukaUntuk.EN : selectedDetailProker.terbukaUntuk.ID}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="proker-modal-actions">
                  <button 
                    onClick={() => setSelectedDetailProker(null)} 
                    className="btn-proker-gallery" 
                    style={{ flex: 1, borderColor: 'var(--clr-border)', color: 'var(--clr-text)' }}
                  >
                    {lang === 'EN' ? 'Close' : 'Tutup'}
                  </button>

                  {selectedDetailProker.status === 'done' ? (
                    <Link 
                      to={`/galeri?program=${encodeURIComponent(selectedDetailProker.nama)}`} 
                      className="btn-proker-gallery"
                      style={{ flex: 1.5 }}
                      onClick={() => setSelectedDetailProker(null)}
                    >
                      <Camera size={14} />
                      {lang === 'EN' ? 'View Documentation' : 'Lihat Dokumentasi'}
                    </Link>
                  ) : selectedDetailProker.status === 'ongoing' ? (
                    <button
                      disabled
                      className="btn-proker-status-disabled"
                      style={{ flex: 1.5 }}
                    >
                      {lang === 'EN' ? 'Registration Closed' : 'Pendaftaran Ditutup'}
                    </button>
                  ) : (
                    <button
                      className="btn-proker-join-premium"
                      style={{ flex: 1.5 }}
                      onClick={() => {
                        setSelectedProker(selectedDetailProker);
                        setSelectedDetailProker(null);
                      }}
                    >
                      {lang === 'EN' ? 'Join This Program' : 'Ikuti Program Ini'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Ikuti Program */}
      <AnimatePresence>
        {selectedProker && (
          <motion.div
            className="reg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          >
            <motion.div
              className="reg-modal"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <button className="reg-close-btn" onClick={handleCloseModal}><X size={20} /></button>

              {isSubmitted ? (
                <div className="reg-success">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <CheckCircle size={64} color="#ff4500" />
                  </motion.div>
                  <h3>{lang === 'EN' ? 'Registration Successful!' : 'Pendaftaran Berhasil!'}</h3>
                  <p style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                    {lang === 'EN' 
                      ? `Thank you! You have successfully registered for "${selectedProker.nama}". Our team will contact you via WhatsApp.`
                      : `Terima kasih! Anda telah terdaftar sebagai peserta untuk program "${selectedProker.nama}". Tim kami akan menghubungi Anda segera melalui WhatsApp.`
                    }
                  </p>
                </div>
              ) : (
                <>
                  <div className="reg-header">
                    <h2 style={{ fontSize: '1.45rem' }}>
                      {lang === 'EN' ? 'Join' : 'Ikuti'} <span className="text-gradient-elegant">{selectedProker.nama}</span>
                    </h2>
                    <p>{lang === 'EN' ? 'Fill out your details to register as a participant.' : 'Isi data diri Anda di bawah ini untuk mendaftar sebagai peserta.'}</p>
                  </div>
                  <form onSubmit={handleFormSubmit} className="reg-form">
                    <div className="reg-field">
                      <label><User size={14} /> {lang === 'EN' ? 'Full Name' : 'Nama Lengkap'}</label>
                      <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder={lang === 'EN' ? 'Enter your full name' : 'Masukkan nama lengkap Anda'} />
                    </div>
                    <div className="reg-field">
                      <label><Mail size={14} /> {lang === 'EN' ? 'Email Address' : 'Alamat Email'}</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="nama@email.com" />
                    </div>
                    <div className="reg-field">
                      <label><Phone size={14} /> {lang === 'EN' ? 'WhatsApp Number' : 'Nomor WhatsApp'}</label>
                      <input required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="08xxxxxxxxxx" />
                    </div>
                    <div className="reg-field">
                      <label><BookOpen size={14} /> NIM</label>
                      <input required value={formData.nim} onChange={e => setFormData(p => ({ ...p, nim: e.target.value }))} placeholder={lang === 'EN' ? 'Student ID Number' : 'Nomor Induk Mahasiswa'} />
                    </div>
                    <div className="reg-field">
                      <label><Users size={14} /> {lang === 'EN' ? 'Study Program' : 'Program Studi'}</label>
                      <input required value={formData.prodi} onChange={e => setFormData(p => ({ ...p, prodi: e.target.value }))} placeholder={lang === 'EN' ? 'e.g. Fire Safety Engineering' : 'Contoh: Rekayasa Keselamatan Kebakaran'} />
                    </div>
                    <div className="reg-field">
                      <label><Calendar size={14} /> {lang === 'EN' ? 'Selected Program' : 'Program yang Diikuti'}</label>
                      <input value={selectedProker.nama} disabled style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(0,0,0,0.08)' }} />
                    </div>
                    <button type="submit" className="btn-hero-primary reg-submit-btn" disabled={isLoading} style={{ marginTop: '0.75rem' }}>
                      {isLoading ? (lang === 'EN' ? 'Registering...' : 'Mendaftar...') : (lang === 'EN' ? 'Join Program' : 'Daftar Sekarang')}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Programs;
