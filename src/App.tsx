import { useState } from 'react';
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
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
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
