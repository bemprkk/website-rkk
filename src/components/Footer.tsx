import { type FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Branding/Logo';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import LegalModal, { LegalType } from './LegalModal';

interface FooterProps {
  onJoinClick?: () => void;
}

const Footer: FC<FooterProps> = ({ onJoinClick }) => {
  const { t, lang } = useLanguage();
  const { content } = useContent();
  const staticPartners = content.partnerships || [];
  const [legalType, setLegalType] = useState<LegalType>(null);

  return (
    <footer id="contact" className="premium-footer">
      <div className="container">
        <motion.div
          className="partnership-section"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="partnership-header">
            <div className="partnership-header-left">
              <span className="partnership-badge">NETWORKING & COLLABORATION</span>
              <h2 className="partnership-title">
                Partner & <span className="partnership-title-highlight">Sponsor</span> Kami
              </h2>
              <p className="partnership-desc">
                {lang === 'EN'
                  ? 'Thank you to the partners who have supported the journey and programs of BEMPRKK.'
                  : 'Terima kasih kepada para mitra yang telah mendukung perjalanan dan program kerja BEMPRKK.'}
              </p>
            </div>
            <div className="partnership-header-right">
              <button onClick={onJoinClick} className="partnership-btn" style={{ cursor: 'pointer' }}>
                {lang === 'EN' ? 'Become Our Partner' : 'Jadilah Partner Kami'} <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="partnership-marquee-container">
            <div className="partnership-marquee-track">
              {/* Render exactly 2 times for seamless loop */}
              {[...staticPartners, ...staticPartners].map((partner, i) => (
                <div className="partnership-marquee-item" key={`${partner.id}-${i}`}>
                  <img src={partner.logoUrl} alt={partner.name} />
                </div>
              ))}
            </div>
          </div>

          <div className="partnership-footer-text">
            {staticPartners.length} {lang === 'EN' ? 'PARTNERS & SPONSORS HAVE JOINED' : 'MITRA & SPONSOR TELAH BERGABUNG'}
          </div>
        </motion.div>

        <div className="footer-grid-premium">
          <div className="footer-brand-premium">
            <div className="logo-premium">
              <Logo size={40} />
              <span className="logo-text-premium">
                <span className="logo-bemp">BEMP</span><span className="logo-rkk">RKK</span>
              </span>
            </div>
            <p className="footer-desc">{t.footer.brandDesc}</p>
            <div className="premium-social-row">
              {t.footer.instagram && (
                <a href={t.footer.instagram} target="_blank" rel="noopener noreferrer" className="s-icon-glass">
                  <Instagram size={18} />
                </a>
              )}
              <a href="mailto:bemprkk@email.ac.id" className="s-icon-glass"><Mail size={18} /></a>
            </div>
          </div>

          <div className="footer-nav-col">
            <h4>{t.footer.col1}</h4>
            <ul>
              <li><Link to="/">{t.nav.home} <ArrowUpRight size={12} /></Link></li>
              <li><Link to="/profil?tab=sejarah">{t.nav.history} <ArrowUpRight size={12} /></Link></li>
              <li><Link to="/profil?tab=misi">{t.nav.mission} <ArrowUpRight size={12} /></Link></li>
              <li><Link to="/profil?tab=tim">{t.nav.team} <ArrowUpRight size={12} /></Link></li>
              <li><Link to="/profil?tab=alumni">{t.nav.alumni} <ArrowUpRight size={12} /></Link></li>
              <li><Link to="/profil?tab=akreditasi">{t.nav.accreditation} <ArrowUpRight size={12} /></Link></li>
              <li><Link to="/event?tab=proker">{t.nav.programs} <ArrowUpRight size={12} /></Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>{t.footer.col2}</h4>
            <ul>
              <li><a href="#">{t.footer.res1}</a></li>
              <li><Link to="/event?tab=galeri">{t.footer.res2}</Link></li>
              <li><a href="#">{t.footer.res3}</a></li>
              <li><Link to="/berita?tab=artikel">{t.footer.res4}</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>{t.footer.col3}</h4>
            <ul style={{ padding: 0, margin: 0 }}>
              <li><a href="mailto:bemprkk@email.ac.id" style={{ cursor: 'pointer' }}>bemprkk@email.ac.id</a></li>
              <li><a style={{ cursor: 'default' }}>Kampus Prodi RKK</a></li>
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <div className="status-badge">
                  <div className="status-dot"></div>
                  <span>{t.footer.status}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-copyright-premium">
          <p>&copy; 2025 BEMPRKK. {t.footer.copyright}</p>
          <div className="copyright-links">
            <button onClick={() => setLegalType('privacy')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <span className="copyright-link-text" style={{ fontSize: '0.8rem', color: 'var(--clr-muted)' }}>{t.footer.privacy}</span>
            </button>
            <button onClick={() => setLegalType('terms')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <span className="copyright-link-text" style={{ fontSize: '0.8rem', color: 'var(--clr-muted)' }}>{t.footer.terms}</span>
            </button>
          </div>
        </div>
      </div>
      
      <LegalModal type={legalType} onClose={() => setLegalType(null)} />
    </footer>
  );
};

export default Footer;
