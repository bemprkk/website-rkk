import { type FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Branding/Logo';
import NavbarControls from './NavbarControls';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onJoinClick: () => void;
}

const Navbar: FC<NavbarProps> = ({ onJoinClick }) => {
  const location = useLocation();
  const { t } = useLanguage();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(location.pathname.startsWith('/profil'));
  const [isMobileEventOpen, setIsMobileEventOpen] = useState(location.pathname.startsWith('/event'));
  const [isMobileNewsOpen, setIsMobileNewsOpen] = useState(location.pathname.startsWith('/berita'));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileProfileOpen(location.pathname.startsWith('/profil'));
    setIsMobileEventOpen(location.pathname.startsWith('/event'));
    setIsMobileNewsOpen(location.pathname.startsWith('/berita'));
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  const navLinks = [
    { name: t.nav.home, to: '/' },
    {
      name: t.nav.profile,
      to: '/profil',
      id: 'profile',
      hasDropdown: true,
      subLinks: [
        { name: t.nav.history, to: '/profil?tab=sejarah' },
        { name: t.nav.mission, to: '/profil?tab=misi' },
        { name: t.nav.team, to: '/profil?tab=tim' },
        { name: t.nav.alumni, to: '/profil?tab=alumni' },
        { name: t.nav.accreditation, to: '/profil?tab=akreditasi' },
      ]
    },
    {
      name: t.nav.event,
      to: '/event',
      id: 'event',
      hasDropdown: true,
      subLinks: [
        { name: t.nav.programs, to: '/event?tab=proker' },
        { name: t.nav.gallery, to: '/event?tab=galeri' },
        { name: t.nav.training, to: '/event?tab=pelatihan' },
        { name: t.nav.seminar, to: '/event?tab=seminar' },
        { name: t.nav.collaboration, to: '/event?tab=kerjasama' },
      ]
    },
    {
      name: t.nav.news,
      to: '/berita',
      id: 'news',
      hasDropdown: true,
      subLinks: [
        { name: t.nav.articles, to: '/berita?tab=artikel' },
        { name: t.nav.achievements, to: '/berita?tab=prestasi' },
        { name: t.nav.awards, to: '/berita?tab=penghargaan' },
        { name: t.nav.announcements, to: '/berita?tab=pengumuman' },
      ]
    },
    { name: t.nav.contact,  to: '/kontak' },
  ];

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const isSubActive = (to: string) => {
    const currentPath = location.pathname + location.search;
    if (currentPath === to) return true;
    if (to.includes('tab=sejarah') && location.pathname === '/profil' && !location.search.includes('tab=')) return true;
    if (to.includes('tab=proker') && location.pathname === '/event' && !location.search.includes('tab=')) return true;
    if (to.includes('tab=artikel') && location.pathname === '/berita' && !location.search.includes('tab=')) return true;
    return false;
  };

  return (
    <nav className={`navbar-premium ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div className="container nav-container-premium">
        <div className="logo-premium">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Logo size={40} />
            <span className="logo-text-premium">
              <span className="logo-bemp">BEMP</span><span className="logo-rkk">RKK</span>
            </span>
          </Link>
        </div>

        <div className="nav-desktop">
          <ul className="nav-links-premium">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="nav-link-item-wrapper"
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.id || null)}
                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
              >
                {link.hasDropdown ? (
                  <div className="nav-dropdown-container">
                    <Link
                      to={link.to}
                      className={`nav-link-item nav-dropdown-trigger ${isActive(link.to) ? 'nav-active' : ''}`}
                    >
                      {link.name} <ChevronDown size={14} className="dropdown-arrow-icon" />
                    </Link>
                    <AnimatePresence>
                      {activeDropdown === link.id && (
                        <motion.ul
                          className="nav-desktop-dropdown glass-panel"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                           {link.subLinks.map((sub) => (
                             <li key={sub.name}>
                               <Link 
                                 to={sub.to} 
                                 className={`nav-dropdown-sub-item ${isSubActive(sub.to) ? 'sub-active' : ''}`}
                               >
                                 {sub.name}
                               </Link>
                             </li>
                           ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.to}
                    className={`nav-link-item ${isActive(link.to) ? 'nav-active' : ''}`}
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="nav-actions-premium">
            <NavbarControls />
            <button onClick={onJoinClick} className="btn-nav-cta">Hubungi BEMPRKK</button>
          </div>
        </div>

        <div className="mobile-header-actions">
          <NavbarControls />
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-premium"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ul className="mobile-nav-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.hasDropdown ? (
                    <div className="mobile-dropdown-wrapper">
                      <button
                        className={`mobile-nav-link-parent ${isActive(link.to) ? 'nav-active' : ''}`}
                        onClick={() => {
                          if (link.id === 'profile') setIsMobileProfileOpen(!isMobileProfileOpen);
                          if (link.id === 'event') setIsMobileEventOpen(!isMobileEventOpen);
                          if (link.id === 'news') setIsMobileNewsOpen(!isMobileNewsOpen);
                        }}
                      >
                        <span>{link.name}</span>
                        <ChevronDown size={16} className={`mobile-arrow-icon ${
                          link.id === 'profile' ? (isMobileProfileOpen ? 'rotated' : '') :
                          link.id === 'event' ? (isMobileEventOpen ? 'rotated' : '') :
                          (isMobileNewsOpen ? 'rotated' : '')
                        }`} />
                      </button>
                      <AnimatePresence>
                        {((link.id === 'profile' && isMobileProfileOpen) ||
                          (link.id === 'event' && isMobileEventOpen) ||
                          (link.id === 'news' && isMobileNewsOpen)) && (
                          <motion.ul
                            className="mobile-sub-links"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                             {link.subLinks.map((sub) => (
                               <li key={sub.name}>
                                 <Link
                                   to={sub.to}
                                   className={isSubActive(sub.to) ? 'nav-active' : ''}
                                   style={{ fontWeight: isSubActive(sub.to) ? '700' : 'normal' }}
                                   onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                   {sub.name}
                                 </Link>
                               </li>
                             ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.to}
                      className={isActive(link.to) ? 'nav-active' : ''}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <button
              className="mobile-cta-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onJoinClick();
              }}
            >
              Hubungi BEMPRKK
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
