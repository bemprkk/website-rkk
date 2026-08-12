import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import api from '../../api/axios';
import { Save, RefreshCw, Trash2, Database, AlertTriangle, Clock } from 'lucide-react';

interface BackupItem {
  _id: string;
  namaBackup: string;
  tanggal: string;
}

const AdminBackup: React.FC = () => {
  const { resetToDefault } = useContent();
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newBackupName, setNewBackupName] = useState('');

  const fetchBackups = async () => {
    try {
      const res = await api.get('/backup');
      setBackups(res.data);
    } catch (err) {
      console.error('Failed to fetch backups', err);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBackupName.trim()) return;
    setIsLoading(true);
    try {
      await api.post('/backup', { namaBackup: newBackupName });
      setNewBackupName('');
      fetchBackups();
      alert('Backup berhasil dibuat!');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin me-restore data dari backup "${name}"? Data live saat ini akan ditimpa.`)) return;
    setIsLoading(true);
    try {
      await api.post(`/backup/restore/${id}`);
      alert('Data berhasil di-restore! Halaman akan dimuat ulang.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Gagal restore backup');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus snapshot backup ini permanen?')) return;
    try {
      await api.delete(`/backup/${id}`);
      fetchBackups();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus backup');
    }
  };

  const handleReset = async () => {
    if (!window.confirm('PERINGATAN KERAS! Tindakan ini akan MENGHAPUS SEMUA DATA LIVE (Tampilan Mode User akan kembali ke default). Pastikan Anda sudah membuat Backup. Lanjutkan?')) return;
    setIsLoading(true);
    try {
      await resetToDefault();
      alert('Data live berhasil dikosongkan/direset ke default. Halaman akan dimuat ulang.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Gagal mereset data');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>Backup & Storage</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>Kelola snapshot data database dan bersihkan mode live</p>
        </div>
      </div>

      <div className="admin-grid-2">
        {/* Kolom Kiri: Buat Backup & Reset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1rem', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={20} color="#10b981" /> Buat Snapshot Baru
            </h2>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Simpan kondisi data (semua teks, gambar, kas, proker, dll) saat ini ke dalam database secara aman.
            </p>
            <form onSubmit={handleCreateBackup} style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              <input 
                type="text" 
                placeholder="Misal: Sebelum Update Pengurus 2026"
                value={newBackupName}
                onChange={e => setNewBackupName(e.target.value)}
                required
                style={{ padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, opacity: isLoading ? 0.7 : 1 }}
              >
                <Database size={18} /> Simpan Snapshot ke Database
              </button>
            </form>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} /> Reset Data Live (Mode User)
            </h2>
            <p style={{ color: 'var(--admin-text-main)', fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>
              Menghapus seluruh data yang sedang aktif dan mengembalikannya ke tampilan dasar (default/kosong). 
              <br/><br/>
              <b>Disarankan:</b> Buatlah snapshot backup di atas terlebih dahulu agar data yang dihapus masih bisa di-restore kembali nanti!
            </p>
            <button 
              onClick={handleReset}
              disabled={isLoading}
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 700, opacity: isLoading ? 0.7 : 1 }}
            >
              <RefreshCw size={18} /> Kosongkan Data Live
            </button>
          </div>

        </div>

        {/* Kolom Kanan: Daftar Backup */}
        <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--admin-card-border)' }}>
          <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1rem', color: 'var(--admin-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="#3b82f6" /> Riwayat Snapshot
          </h2>
          
          {backups.length === 0 ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <Database size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>Belum ada data backup di database.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {backups.map(b => (
                <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.75rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem', color: 'var(--admin-text-main)', fontSize: '1rem' }}>{b.namaBackup}</h3>
                    <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      {new Date(b.tanggal).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleRestore(b._id, b.namaBackup)}
                      disabled={isLoading}
                      title="Restore Data Ini"
                      style={{ background: 'rgba(59,130,246,.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,.2)', borderRadius: '0.375rem', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      Restore
                    </button>
                    <button 
                      onClick={() => handleDelete(b._id)}
                      disabled={isLoading}
                      title="Hapus Backup"
                      style={{ background: 'rgba(239,68,68,.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,.2)', borderRadius: '0.375rem', padding: '0.5rem', cursor: 'pointer', display: 'flex' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBackup;
