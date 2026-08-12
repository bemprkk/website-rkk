import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, Flame, ShieldCheck, Users, Globe,
  ChevronDown, Trophy, Zap, Star,
  MessageCircle, BookOpen, Rocket
} from 'lucide-react';
import Logo from '../components/Branding/Logo';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { Link } from 'react-router-dom';

interface BerandaPageProps {
  onJoinClick: () => void;
}

const FaqItem: React.FC<{ q: string; a: string; index: number }> = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="faq-item-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <button className="faq-question-btn" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="faq-chevron">
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const getIconForHighlight = (index: number) => {
  switch (index) {
    case 0: return <Flame size={28} />;
    case 1: return <Trophy size={28} />;
    case 2: return <Globe size={28} />;
    case 3: return <ShieldCheck size={28} />;
    default: return <Sparkles size={28} />;
  }
};

const getIconForValue = (index: number) => {
  switch (index) {
    case 0: return <ShieldCheck size={22} />;
    case 1: return <Users size={22} />;
    case 2: return <Zap size={22} />;
    case 3: return <Star size={22} />;
    default: return <Sparkles size={22} />;
  }
};

const BerandaPage: React.FC<BerandaPageProps> = ({ onJoinClick }) => {
  const { t, lang } = useLanguage();
  const { content } = useContent();
  const heroContent = content.translations[lang as 'ID' | 'EN']?.hero || t.hero;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section id="hero" className="hero-section-v3">
        <div className="hero-bg-image-v3">
          <img src={content.images.hero} alt="" />
          <div className="hero-bg-image-overlay"></div>
        </div>
        <div className="hero-bg-gradient-v3"></div>
        <div className="hero-grid-dots"></div>

        <motion.div
          className="container hero-container-v3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-center-v3">
            <motion.div
              className="hero-floating-logo"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo size={80} />
            </motion.div>

            <motion.div
              className="hero-badge-v3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Sparkles size={14} />
              <span>{heroContent.badge}</span>
            </motion.div>

            <motion.h1
              className="hero-title-v3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="title-line-1">{heroContent.title1}</span>
              <span className="title-line-2">
                {(heroContent.titleGradient || '').split(' ')[0]}{' '}
                <span className="title-accent">{(heroContent.titleGradient || '').split(' ').slice(1).join(' ')}</span>
              </span>
            </motion.h1>

            <motion.p
              className="hero-subtitle-v3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {heroContent.desc}
            </motion.p>

            <motion.div
              className="hero-buttons-v3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <button onClick={onJoinClick} className="btn-hero-primary">
                {t.home.ctaBtn} <ArrowRight size={18} />
              </button>
              <Link to="/profil?tab=misi" className="btn-hero-outline">
                {t.hero.btnGhost}
              </Link>
            </motion.div>

            <motion.div
              className="hero-stats-v3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-stat-item">
                <span className="stat-number">{content.stats.members}</span>
                <span className="stat-label">{t.hero.stats.architects}</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat-item">
                <span className="stat-number">{content.stats.projects}</span>
                <span className="stat-label">{t.hero.stats.deployments}</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat-item">
                <span className="stat-number">{content.stats.alumni}</span>
                <span className="stat-label">{t.hero.stats.alliances}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="scroll-indicator-v3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            const nextSection = document.querySelector('.mengenal-kami-section');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          whileHover={{ y: 3 }}
        >
          <span>SCROLL</span>
          <div className="scroll-track">
            <div className="scroll-dot"></div>
          </div>
        </motion.div>
      </section>

      {/* ── MENGENAL KAMI ─────────────────────────────────────────────── */}
      <section className="beranda-section mengenal-kami-section">
        <div className="container">
          <div className="section-header-centered">
            <motion.span className="section-eyebrow" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {t.home.mengenalSubtitle}
            </motion.span>
            <motion.h2 className="section-title-centered" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              {t.home.mengenalTitle} <span className="text-gradient-elegant">{t.home.mengenalTitleGradient}</span>
            </motion.h2>
            <motion.p className="section-desc-centered" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              {t.home.mengenalDesc}
            </motion.p>
          </div>

          <div className="mengenal-grid">
            <motion.div className="mengenal-image-col" initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <div className="mengenal-img-wrapper">
                <img src={content.images.about} alt="BEMPRKK" />
                <div className="mengenal-img-badge">
                  <Trophy size={20} />
                  <span>{t.home.mengenalBadge}</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="mengenal-content-col" initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <div className="mengenal-desc" style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                {t.home.mengenalDesc2}
              </div>

              <div className="mengenal-values-grid">
                {(t?.home?.values || []).map((v: any, i: number) => (
                  <motion.div key={i} className="mengenal-value-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
                    <div className="value-icon">{getIconForValue(i)}</div>
                    <h4>{v.title}</h4>
                    <p>{v.desc}</p>
                  </motion.div>
                ))}
              </div>

              <Link to="/profil?tab=misi" className="btn-elegant-primary inline-btn">
                {t.nav.mission} Lebih Lanjut <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROGRAM HIGHLIGHTS ────────────────────────────────────────── */}
      <section className="beranda-section program-highlights-section">
        <div className="beranda-section-bg"></div>
        <div className="container">
          <div className="section-header-centered">
            <motion.span className="section-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              {t.home.programSubtitle}
            </motion.span>
            <motion.h2 className="section-title-centered" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              {t.home.programTitle} <span className="text-gradient-elegant">{t.home.programTitleGradient}</span>
            </motion.h2>
          </div>

          <div className="program-highlights-grid">
            {(t?.home?.highlights || []).map((p: any, i: number) => (
              <motion.div key={i} className="program-highlight-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                <div className="ph-icon-wrap">{getIconForHighlight(i)}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <Link to="/program" className="ph-link">Lihat Detail <ArrowRight size={14} /></Link>
              </motion.div>
            ))}
          </div>

          <motion.div className="program-highlights-cta" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/program" className="btn-elegant-primary">Lihat Semua Program Kerja <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────── */}
      <section className="stats-strip-section">
        <div className="container">
          <div className="stats-strip-grid">
            {[
              { icon: <Users size={24} />, val: content.stats.members, label: t.hero.stats.architects },
              { icon: <Rocket size={24} />, val: content.stats.projects, label: t.hero.stats.deployments },
              { icon: <BookOpen size={24} />, val: content.stats.training, label: 'Sesi Latihan/Minggu' },
              { icon: <MessageCircle size={24} />, val: content.stats.alumni, label: t.hero.stats.alliances },
            ].map((s, i) => (
              <motion.div key={i} className="stats-strip-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="stats-strip-icon">{s.icon}</div>
                <span className="stats-strip-val">{s.val}</span>
                <span className="stats-strip-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="beranda-section faq-section">
        <div className="container">
          <div className="faq-layout">
            <div className="faq-left">
              <motion.span className="section-eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                {t.home.faqSubtitle}
              </motion.span>
              <motion.h2 className="section-title-left" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                {t.home.faqTitle} <span className="text-gradient-elegant">{t.home.faqTitleGradient}</span>
              </motion.h2>
              <motion.p className="faq-left-desc" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                {t.home.faqDesc}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <Link to="/kontak" className="btn-elegant-primary">Hubungi Kami <ArrowRight size={18} /></Link>
              </motion.div>
            </div>

            <div className="faq-right">
              {(t?.home?.faqItems || []).map((item: any, i: number) => (
                <FaqItem key={i} q={item.q} a={item.a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default BerandaPage;
