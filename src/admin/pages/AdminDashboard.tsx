import React from 'react';
import { useContent } from '../../context/ContentContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Activity, Wallet, Users, LayoutList } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { content } = useContent();
  const navigate = useNavigate();
  const { stats } = content;

  return (
    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 1. Welcome Banner */}
      <div style={{ 
        background: 'var(--admin-banner-bg)', 
        borderRadius: '1rem', 
        padding: '2.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Abstract shapes for background */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'white' }}>
            Welcome back, Administrator
          </h2>
          <p style={{ color: 'var(--admin-banner-text)', margin: 0, fontSize: '0.95rem' }}>
            Anda memiliki <strong style={{ color: 'white' }}>{stats.projects} program kerja aktif</strong> dan <strong style={{ color: 'white' }}>{stats.members} anggota aktif</strong> bulan ini.
          </p>
        </div>

        <button style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '0.75rem 1.5rem',
          borderRadius: '2rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backdropFilter: 'blur(10px)'
        }}
        onClick={() => navigate('/admin/laporan')}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          Lihat Laporan <ArrowRight size={18} />
        </button>
      </div>

      {/* SUMMARY METRICS ROW */}
      <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
        {/* Metric 1 */}
        <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '1rem', borderRadius: '0.75rem' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>Total Anggota Aktif</p>
            <h3 style={{ color: 'var(--admin-text-main)', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{stats.members}</h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '0.75rem' }}>
            <LayoutList size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>Program Kerja</p>
            <h3 style={{ color: 'var(--admin-text-main)', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{stats.projects}</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '1rem', borderRadius: '0.75rem' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>Kegiatan Bulan Ini</p>
            <h3 style={{ color: 'var(--admin-text-main)', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>8</h3>
          </div>
        </div>
      </div>

      {/* TOP ROW GRIDS */}
      <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
        
        {/* Card 1: Line Chart (Total Uang Kas) */}
        <div style={{ 
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-card-border)', 
          borderRadius: '1rem', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.5rem' }}>Total Uang Kas</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--admin-text-main)', margin: '0 0 0.25rem', letterSpacing: '-0.5px' }}>
                Rp 4.825.000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                <ArrowUpRight size={16} />
                <span>+12.5% dari bulan lalu</span>
              </div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Wallet size={24} />
            </div>
          </div>
          
          {/* Mock SVG Line Chart */}
          <div style={{ flex: 1, position: 'relative', marginTop: '1rem', height: '120px' }}>
            <svg viewBox="0 0 400 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="gradientLine" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q50,90 100,70 T200,60 T300,40 T400,50 L400,100 L0,100 Z" fill="url(#gradientLine)" />
              <path d="M0,80 Q50,90 100,70 T200,60 T300,40 T400,50" fill="none" stroke="#10b981" strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* Card 2: Gauge Chart (Monthly Goal) */}
        <div style={{ 
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-card-border)', 
          borderRadius: '1rem', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)'
        }}>
          {/* Circular Gauge */}
          <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '1.5rem' }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="12" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.72)} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--admin-text-main)' }}>72%</span>
            </div>
          </div>
          
          <h3 style={{ margin: '0 0 0.25rem', color: 'var(--admin-text-main)', fontWeight: 600, fontSize: '1rem' }}>Penyelesaian Program Kerja</h3>
          <p style={{ margin: 0, color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Terlaksana 18 dari 25 Target Proker</p>
        </div>
      </div>

      {/* BOTTOM ROW GRIDS */}
      <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
        
        {/* Card 3: Bar Chart (Partisipasi) */}
        <div style={{ 
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-card-border)', 
          borderRadius: '1rem', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '1rem', fontWeight: 600 }}>Partisipasi Event</h3>
            <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>+8.2%</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '0.25rem' }}>
            1,284
          </div>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>Total partisipan bulan ini</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Mahasiswa
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> Umum
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px', gap: '0.5rem' }}>
            {[40, 60, 50, 80, 50, 75].map((val, idx) => (
              <div key={idx} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px' }}>
                  <div style={{ width: '100%', height: `${val}%`, background: '#10b981', borderRadius: '4px' }} />
                  <div style={{ width: '100%', height: `${val * 0.4}%`, background: '#3b82f6', borderRadius: '4px' }} />
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>{['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum'][idx]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Area Chart (Customers/Anggota) */}
        <div style={{ 
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-card-border)', 
          borderRadius: '1rem', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '1rem', fontWeight: 600 }}>Jangkauan Sosial Media</h3>
            <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>+5.1%</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '0.25rem' }}>
            892
          </div>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>Total pengikut baru</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Instagram
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} /> Tiktok
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', height: '120px' }}>
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.15)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                </linearGradient>
              </defs>
              <path d="M0,90 L60,85 L120,70 L180,65 L240,50 L300,45 L300,100 L0,100 Z" fill="url(#gradientArea)" />
              <path d="M0,90 L60,85 L120,70 L180,65 L240,50 L300,45" fill="none" stroke="#10b981" strokeWidth="2" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#64748b', fontSize: '0.7rem' }}>
              <span>Mei</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Agt</span>
            </div>
          </div>
        </div>

        {/* Card 5: Progress Bars (Conversion Funnel) */}
        <div style={{ 
          background: 'var(--admin-card-bg)',
          border: '1px solid var(--admin-card-border)', 
          borderRadius: '1rem', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '1rem', fontWeight: 600 }}>Statistik Keterlibatan</h3>
            <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>Bulan ini</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--admin-text-main)', marginBottom: '0.25rem' }}>
            6.45%
          </div>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>Rata-rata konversi pendaftar</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Bar 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                <span>Pengunjung Halaman</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>10,000</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: '#047857', borderRadius: '4px' }} />
              </div>
            </div>
            {/* Bar 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                <span>Pendaftar Event (Leads)</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>2,400</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
            </div>
            {/* Bar 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                <span>Peserta Hadir</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>892</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: '#3b82f6', borderRadius: '4px' }} />
              </div>
            </div>
            {/* Bar 4 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>
                <span>Panitia / Relawan Aktif</span>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>645</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', background: '#8b5cf6', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
