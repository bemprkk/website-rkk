import { type FC, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { useContent } from '../context/ContentContext';

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
};

const Kepengurusan: FC = () => {
  const { t, lang } = useLanguage();
  const { content } = useContent();
  const [activeYear, setActiveYear] = useState('2025');
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const yearFilterRef = useHorizontalScroll<HTMLDivElement>();

  const years = useMemo(() => {
    const teamYears = (content.images?.team || [])
      .map((m: any) => m.year || '2025')
      .filter(Boolean);
    const unique = [...new Set(teamYears)].sort((a: any, b: any) => Number(b) - Number(a));
    return unique.length > 0 ? unique : ['2025'];
  }, [content.images?.team]);

  const members: any[] = useMemo(() => {
    return (content.images?.team || []).filter((m: any) => (m.year || '2025') === activeYear);
  }, [content.images?.team, activeYear]);

  const total = members.length;

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex(i => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex(i => (i - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  }, [activeIndex]);

  const handleYearChange = (y: string) => {
    setActiveYear(y);
    setActiveIndex(0);
  };

  // Derive the three visible indices
  const prevIdx = total > 0 ? (activeIndex - 1 + total) % total : 0;
  const nextIdx = total > 0 ? (activeIndex + 1) % total : 0;

  const renderSideCard = (member: any, position: 'left' | 'right', onClick: () => void) => (
    <motion.div
      className="ks-side-card"
      onClick={onClick}
      whileHover={{ scale: 0.88, filter: 'brightness(0.85)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, filter: 'brightness(0.62)', scale: 0.84 }}
      transition={{ duration: 0.35 }}
      style={{ cursor: 'pointer' }}
      aria-label={position === 'left' ? 'Anggota sebelumnya' : 'Anggota berikutnya'}
    >
      <div className="ks-card-photo-wrap">
        <img src={member.image} alt={member.name} className="ks-card-photo" />
      </div>
      <div className="ks-side-card-info">
        <span className="ks-side-role">{lang === 'ID' ? member.roleID : member.roleEN}</span>
        <h3 className="ks-side-name">{member.name}</h3>
      </div>
    </motion.div>
  );

  return (
    <section id="team" className="team-section-v2">
      <div className="container">
        <motion.div
          className="section-header-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge-pill">{t.team.subtitle}</span>
          <h2 className="section-title-main">
            {t.team.title} <span className="text-gradient-elegant">{t.team.titleGradient}</span>
          </h2>
          <p className="section-desc-main">{t.team.desc}</p>
        </motion.div>

        {/* Year Filter */}
        <div className="year-filter-row" style={{ marginBottom: '2.5rem' }} ref={yearFilterRef}>
          {(years as string[]).map(y => (
            <button
              key={y}
              className={`year-filter-btn ${activeYear === y ? 'active' : ''}`}
              onClick={() => handleYearChange(y)}
            >
              {t.team.subtitleTeam} {y}
            </button>
          ))}
        </div>

        {total === 0 ? (
          <div className="alumni-empty glass-panel" style={{ padding: '3rem', borderRadius: '18px', textAlign: 'center', color: 'var(--clr-muted)' }}>
            <p style={{ fontSize: '1rem', margin: 0 }}>
              {lang === 'ID' ? 'Belum ada data anggota untuk periode ini.' : 'No members found for this period.'}
            </p>
          </div>
        ) : (
          <>
            {/* 3-Card Spotlight Row */}
            <div className="ks-spotlight-row">
              {/* Left Nav Button */}
              {total > 1 && (
                <button className="ks-nav-btn ks-nav-left" onClick={goPrev} aria-label="Sebelumnya">
                  <ChevronLeft size={22} />
                </button>
              )}

              {/* Left Side Card */}
              {total > 1 && renderSideCard(members[prevIdx], 'left', goPrev)}

              {/* Center Card */}
              <div className="ks-center-slot">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeIndex}
                    className="ks-center-card"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <div className="ks-card-photo-wrap">
                      <img
                        src={members[activeIndex].image}
                        alt={members[activeIndex].name}
                        className="ks-card-photo"
                      />
                      {/* Social Links */}
                      <div className="ks-card-socials">
                        {members[activeIndex].socials?.github && (
                          <a href={members[activeIndex].socials.github} target="_blank" rel="noopener noreferrer" className="team-social-btn">
                            <Github size={16} />
                          </a>
                        )}
                        {members[activeIndex].socials?.linkedin && (
                          <a href={members[activeIndex].socials.linkedin} target="_blank" rel="noopener noreferrer" className="team-social-btn">
                            <Linkedin size={16} />
                          </a>
                        )}
                        {members[activeIndex].socials?.twitter && (
                          <a href={members[activeIndex].socials.twitter} target="_blank" rel="noopener noreferrer" className="team-social-btn">
                            <MessageCircle size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="ks-center-card-info">
                      <span className="ks-center-role-label">
                        {lang === 'ID' ? members[activeIndex].roleID : members[activeIndex].roleEN}
                      </span>
                      <h3 className="ks-center-card-name">{members[activeIndex].name}</h3>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Side Card */}
              {total > 1 && renderSideCard(members[nextIdx], 'right', goNext)}

              {/* Right Nav Button */}
              {total > 1 && (
                <button className="ks-nav-btn ks-nav-right" onClick={goNext} aria-label="Selanjutnya">
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Dot Indicators */}
            {total > 1 && (
              <div className="ks-dots">
                {members.map((_: any, i: number) => (
                  <button
                    key={i}
                    className={`ks-dot ${i === activeIndex ? 'ks-dot-active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Anggota ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Kepengurusan;
