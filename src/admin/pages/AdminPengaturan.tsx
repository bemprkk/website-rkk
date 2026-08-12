import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAdmin } from '../../context/AdminContext';
import { Save, Download, Upload, Lock } from 'lucide-react';

const AdminPengaturan: React.FC = () => {
  const { content, updateContent, resetToDefault } = useContent();
  const { changePassword } = useAdmin();
  const [isSaving, setIsSaving] = useState(false);

  // Stats State
  const [stats, setStats] = useState(content.stats);
  
  // Contact State
  const [contact, setContact] = useState(content.contact || {
    lokasi: '', jamAktif: '', email: '', instagram: '', instagramUrl: '', mapsUrl: ''
  });

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContent((prev) => ({
        ...prev,
        stats,
        contact,
      }));
      alert('Pengaturan berhasil disimpan!');
    } catch (e) {
      alert('Gagal menyimpan pengaturan ke server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 5) {
      setPassMsg('Password baru minimal 5 karakter!');
      return;
    }
    const success = await changePassword(oldPassword, newPassword);
    if (success) {
      setPassMsg('✅ Password berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
    } else {
      setPassMsg('❌ Password lama salah atau server gagal memproses!');
    }
    setTimeout(() => setPassMsg(''), 3000);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `backup_bemprkk_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        if (window.confirm('Yakin ingin menimpa seluruh data dengan file backup ini?')) {
          updateContent(obj);
          alert('Data berhasil di-restore!');
          window.location.reload();
        }
      } catch (err) {
        alert('File backup tidak valid!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>Pengaturan Website</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f97316', color: 'var(--admin-text-main)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, opacity: isSaving ? 0.7 : 1 }}
        >
          <Save size={18} />
          {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>

      <div className="admin-grid-2">
        
        {/* Kolom Kiri */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section: Kontak & Lokasi */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Informasi Kontak</h2>
            
            <div className="admin-input-group">
              <label>Lokasi Sekretariat</label>
              <input type="text" value={contact.lokasi || ''} onChange={e => setContact({...contact, lokasi: e.target.value})} />
            </div>
            <div className="admin-input-group">
              <label>Jam Aktif</label>
              <input type="text" value={contact.jamAktif || ''} onChange={e => setContact({...contact, jamAktif: e.target.value})} />
            </div>
            <div className="admin-input-group">
              <label>Email Utama</label>
              <input type="email" value={contact.email || ''} onChange={e => setContact({...contact, email: e.target.value})} />
            </div>
            <div className="admin-grid-2" style={{ gap: '1rem' }}>
              <div className="admin-input-group">
                <label>Instagram Handle</label>
                <input type="text" value={contact.instagram || ''} onChange={e => setContact({...contact, instagram: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Instagram URL</label>
                <input type="url" value={contact.instagramUrl || ''} onChange={e => setContact({...contact, instagramUrl: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section: Keamanan */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} /> Keamanan Akun
            </h2>
            
            <form onSubmit={handlePasswordChange}>
              <div className="admin-input-group">
                <label>Password Lama</label>
                <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
              </div>
              <div className="admin-input-group">
                <label>Password Baru</label>
                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              {passMsg && <p style={{ color: passMsg.includes('✅') ? '#4ade80' : '#ef4444', fontSize: '0.9rem', marginBottom: '1rem' }}>{passMsg}</p>}
              <button type="submit" style={{ background: '#3b82f6', color: 'var(--admin-text-main)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>Update Password</button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section: Statistik */}
          <div style={{ background: 'var(--admin-card-bg)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--admin-card-border)' }}>
            <h2 style={{ fontSize: '1.25rem', marginTop: 0, marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid #4b5563', paddingBottom: '0.5rem' }}>Angka Statistik</h2>
            
            <div className="admin-grid-2" style={{ gap: '1rem' }}>
              <div className="admin-input-group">
                <label>Anggota Aktif</label>
                <input type="text" value={stats.members || ''} onChange={e => setStats({...stats, members: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Program Kerja</label>
                <input type="text" value={stats.projects || ''} onChange={e => setStats({...stats, projects: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Pengurus (Board)</label>
                <input type="text" value={stats.board || ''} onChange={e => setStats({...stats, board: e.target.value})} />
              </div>
              <div className="admin-input-group">
                <label>Alumni</label>
                <input type="text" value={stats.alumni || ''} onChange={e => setStats({...stats, alumni: e.target.value})} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPengaturan;
