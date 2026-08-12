import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
} as const;

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
} as const;

const About: FC = () => {
  const { t } = useLanguage();
  const { content } = useContent();

  return (
    <section id="about" className="premium-about-elegant" style={{ paddingBottom: '6rem' }}>
      <div className="container">
        <div className="about-grid-elegant">
          <motion.div
            className="about-visual-elegant"
            initial={{ opacity: 0, x: -80, rotate: -3 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="main-img-wrapper-elegant">
              <img src={content.images.about} alt="BEMPRKK" className="main-img" />
              <div className="img-glass-overlay"></div>
            </div>
            <motion.div
              className="elegant-floating-card mini-version"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="stats-icon-elegant"><Flame size={20} /></div>
              <div className="stats-info-elegant">
                <span className="stats-num-elegant">{t.about.reliabilityVal}%</span>
                <span className="stats-txt-elegant">{t.about.reliability}</span>
              </div>
            </motion.div>
          </motion.div>

          <div className="about-content-elegant">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
              <motion.span variants={fadeUp} className="subtitle-elegant">{t.about.subtitle}</motion.span>
              <motion.h2 variants={fadeUp} className="section-title-elegant stacked-title-v2">
                <span className="title-main-block">{t.about.title}</span>
                <span className="text-gradient-elegant title-gradient-block">{t.about.titleGradient}</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="p-elegant">{t.about.desc}</motion.p>

              <motion.div variants={fadeUp} className="features-stack-elegant">
                {t.about.features.map((feature: any, index: number) => (
                  <motion.div
                    className="feature-item-elegant"
                    key={index}
                    whileHover={{ x: 10, transition: { duration: 0.3 } }}
                  >
                    <div className="feature-icon-box-elegant">
                      {index === 0 ? <Flame size={24} /> : index === 1 ? <ShieldCheck size={24} /> : <Users size={24} />}
                    </div>
                    <div className="feature-text-elegant">
                      <h4>{feature.title}</h4>
                      <p>{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link to="/program" className="btn-elegant-primary inline-btn">
                  {t.nav.programs} <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
