import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import AdminLayout from './AdminLayout.tsx';
import AdminLogin from './AdminLogin.tsx';
import AdminBeranda from './pages/AdminBeranda';
import AdminProfil from './pages/AdminProfil';
import AdminEvent from './pages/AdminEvent';
import AdminBerita from './pages/AdminBerita';
import AdminPengaturan from './pages/AdminPengaturan';
import AdminDashboard from './pages/AdminDashboard';
import AdminLaporan from './pages/AdminLaporan';
import AdminKas from './pages/AdminKas';
import AdminBackup from './pages/AdminBackup';

const AdminApp: React.FC = () => {
  const { isLoggedIn } = useAdmin();

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    );
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/beranda" element={<AdminBeranda />} />
        <Route path="/profil" element={<AdminProfil />} />
        <Route path="/event" element={<AdminEvent />} />
        <Route path="/berita" element={<AdminBerita />} />
        <Route path="/pengaturan" element={<AdminPengaturan />} />
        <Route path="/laporan" element={<AdminLaporan />} />
        <Route path="/kas" element={<AdminKas />} />
        <Route path="/backup" element={<AdminBackup />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
