import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedSky from './components/ParticleField';
import RegistrationForm from './components/RegistrationForm';
import BerandaPage from './pages/BerandaPage';
import ProfilPage from './pages/ProfilPage';
import EventPage from './pages/EventPage';
import BeritaPage from './pages/BeritaPage';
import KontakPage from './pages/KontakPage';
import { ContentProvider } from './context/ContentContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { FirePreloader } from './components/FirePreloader';
import AdminApp from './admin/AdminApp';
import './pages/pages.css';

const AppInner = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const location = useLocation();
  
  const isAdminDomain = window.location.hostname.includes('admin');
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Catat pengunjung hanya jika bukan di mode admin
    if (!isAdminDomain && !isAdminPath) {
      import('./api/axios').then(({ default: api }) => {
        api.post('/content/visit').catch(() => {});
      });
    }
  }, [isAdminDomain, isAdminPath]);

  // Redirect root to /admin if accessing via dedicated admin domain
  if (isAdminDomain && location.pathname === '/') {
    return <Navigate to="/admin" replace />;
  }

  if (isAdminDomain || isAdminPath) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-wrapper">
      <AnimatedSky />
      <Navbar onJoinClick={() => setIsFormOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<BerandaPage onJoinClick={() => setIsFormOpen(true)} />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/misi" element={<Navigate to="/profil?tab=misi" replace />} />
          <Route path="/tim" element={<Navigate to="/profil?tab=tim" replace />} />
          <Route path="/alumni" element={<Navigate to="/profil?tab=alumni" replace />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/program" element={<Navigate to="/event?tab=proker" replace />} />
          <Route path="/galeri" element={<Navigate to="/event?tab=galeri" replace />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/kontak" element={<KontakPage />} />
        </Routes>
      </main>
      <Footer onJoinClick={() => setIsFormOpen(true)} />
      <RegistrationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

const AppWithPreloader = () => {
  const [ready, setReady] = useState(false);
  if (!ready) {
    return <FirePreloader onComplete={() => setReady(true)} />;
  }
  return (
    <Router>
      <AppInner />
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <LanguageProvider>
          <AdminProvider>
            <AppWithPreloader />
          </AdminProvider>
        </LanguageProvider>
      </ContentProvider>
    </ThemeProvider>
  );
}

export default App;
