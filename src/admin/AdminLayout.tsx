import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, LayoutDashboard, User, Home, Info, Calendar, Settings, RefreshCw, Sun, Moon, Save, FileText, LogOut, Image, Briefcase, Shield, Mic, Handshake
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAdmin } from '../context/AdminContext';
import './admin.css';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false); // Desktop sidebar
  const [currentTime, setCurrentTime] = useState(new Date());

  // Theme & Sync States
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Initialize theme from body class or default dark
  useEffect(() => {
    if (document.body.classList.contains('admin-theme-light')) {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.body.classList.add('admin-theme-light');
    } else {
      document.body.classList.remove('admin-theme-light');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSyncLive = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1000);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuSections: MenuSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      title: 'BERANDA',
      items: [
        { path: '/admin/beranda?tab=hero', icon: Home, label: 'Hero & Tentang' },
        { path: '/admin/beranda?tab=nilai', icon: FileText, label: 'Nilai-Nilai BEM' },
        { path: '/admin/beranda?tab=highlights', icon: LayoutDashboard, label: 'Highlights Program' },
        { path: '/admin/beranda?tab=faq', icon: Info, label: 'FAQ (Tanya Jawab)' },
        { path: '/admin/beranda?tab=cta', icon: LayoutDashboard, label: 'Call to Action' },
      ]
    },
    {
      title: 'PROFIL & TIM',
      items: [
        { path: '/admin/profil?tab=tim', icon: User, label: 'Kepengurusan' },
        { path: '/admin/profil?tab=alumni', icon: User, label: 'Data Alumni' },
        { path: '/admin/profil?tab=sejarah', icon: Info, label: 'Sejarah BEM' },
        { path: '/admin/profil?tab=misi', icon: Info, label: 'Visi & Misi' },
        { path: '/admin/profil?tab=akreditasi', icon: FileText, label: 'Akreditasi' },
      ]
    },
    {
      title: 'EVENT & GALERI',
      items: [
        { path: '/admin/event?tab=galeri', icon: Image, label: 'Galeri Foto' },
        { path: '/admin/event?tab=proker', icon: Briefcase, label: 'Program Kerja' },
        { path: '/admin/event?tab=pelatihan', icon: Shield, label: 'Pelatihan K3' },
        { path: '/admin/event?tab=seminar', icon: Mic, label: 'Seminar' },
        { path: '/admin/event?tab=kerjasama', icon: Handshake, label: 'Kerjasama / Mitra' },
      ]
    },
    {
      title: 'BERITA & PRESTASI',
      items: [
        { path: '/admin/berita?tab=artikel', icon: FileText, label: 'Artikel' },
        { path: '/admin/berita?tab=prestasi', icon: LayoutDashboard, label: 'Rekap Prestasi' },
        { path: '/admin/berita?tab=penghargaan', icon: Info, label: 'Penghargaan' },
        { path: '/admin/berita?tab=pengumuman', icon: Calendar, label: 'Pengumuman' },
      ]
    },
    {
      title: 'PENGATURAN',
      items: [
        { path: '/admin/pengaturan', icon: Settings, label: 'Pengaturan Website' },
      ]
    },
    {
      title: 'LAPORAN',
      items: [
        { path: '/admin/laporan', icon: FileText, label: 'Lihat Laporan' },
      ]
    }
  ];

  const isActive = (itemPath: string) => {
    return location.pathname + location.search === itemPath || (location.pathname === itemPath.split('?')[0] && location.search === '');
  };

  const getActiveMenuTitle = () => {
    for (const section of menuSections) {
      for (const item of section.items) {
        if (isActive(item.path)) {
          return item.label;
        }
      }
    }
    return 'Management Console';
  };

  const activeMenuLabel = getActiveMenuTitle();

  return (
    <div className={`admin-container ${isDesktopCollapsed ? 'desktop-collapsed' : ''}`}>
      {/* Mobile Toggle Button */}
      <button className={`admin-mobile-toggle ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-icon">
              <img src="/logo.png" alt="BEMPRKK" onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span style="font-weight: 700; color: #0b0f19;">BEM</span>';
              }} />
            </div>
            <div className="admin-brand-text">
              <h2>BEMPRKK</h2>
              <span>PANEL</span>
            </div>
          </div>
        </div>

        <div className="admin-sidebar-scroll">
          <nav className="admin-nav">
            {menuSections.map((section, idx) => (
              <div key={idx} className="admin-nav-section-wrapper">
                <div className="admin-nav-section-title">{section.title}</div>
                <ul>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <Link 
                          to={item.path} 
                          className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon size={18} className="admin-nav-icon" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-card-avatar">A</div>
            <div className="admin-user-card-info">
              <span className="admin-user-card-name">Administrator</span>
              <span className="admin-user-card-role">Super Admin</span>
            </div>
            <button onClick={logout} className="admin-user-card-logout" title="Keluar">
              <LogOut size={16} />
            </button>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="admin-preview-btn">
            <LayoutDashboard size={16} style={{ marginRight: '0.5rem' }} /> Preview Site
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`admin-main-wrapper ${isDesktopCollapsed ? 'expanded' : ''}`}>
        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-topbar-close-btn" onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}>
              {isDesktopCollapsed ? <Menu size={18} /> : <X size={18} />}
            </button>
            <div className="admin-topbar-title-wrap">
              <h1 className="admin-topbar-title">{activeMenuLabel} / <span>Editor</span></h1>
              <span className="admin-topbar-time">
                {format(currentTime, 'HH.mm.ss')} &middot; {format(currentTime, 'EEEE, dd MMM yyyy', { locale: id })}
              </span>
            </div>
          </div>
          
          <div className="admin-topbar-right">
            <button className="admin-topbar-icon-btn" onClick={handleRefresh} title="Refresh Data">
              <RefreshCw size={18} />
            </button>
            <button className="admin-topbar-icon-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="admin-topbar-sync-btn" 
              onClick={handleSyncLive}
              disabled={isSyncing}
              style={{
                background: syncSuccess ? '#10b981' : isSyncing ? '#64748b' : 'white',
                color: syncSuccess || isSyncing ? 'white' : 'black',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {isSyncing ? (
                <>
                  <RefreshCw size={16} className="spin-icon" /> <span>Syncing...</span>
                </>
              ) : syncSuccess ? (
                <>
                  <Save size={16} /> <span>Berhasil!</span>
                </>
              ) : (
                <>
                  <Save size={16} /> <span>Sync Live</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="admin-main-content">
          <div className="admin-content-wrapper">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminLayout;
