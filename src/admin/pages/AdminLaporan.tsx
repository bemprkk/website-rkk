import React, { useState, useMemo } from 'react';
import { useContent } from '../../context/ContentContext';
import type { KasTransaksi } from '../../types';
import {
  BarChart2, Users, CheckCircle, Clock, TrendingUp, Award,
  Wallet, FileText, Activity, Printer
} from 'lucide-react';

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const AdminLaporan: React.FC = () => {
  const { content } = useContent();
  const { stats, proker = [], trainings = [], seminars = [], alumni = [] } = content as any;
  const kasTransaksi: KasTransaksi[] = (content as any).kasTransaksi ?? [];
  const [activeTab, setActiveTab] = useState<'proker' | 'keuangan' | 'anggota' | 'kegiatan'>('proker');

  const prokerDone = proker.filter((p: any) => p.status === 'done').length;
  const prokerOngoing = proker.filter((p: any) => p.status === 'ongoing').length;
  const prokerUpcoming = proker.filter((p: any) => p.status === 'upcoming').length;
  const prokerTotal = proker.length;
  const prokerPct = prokerTotal > 0 ? Math.round((prokerDone / prokerTotal) * 100) : 0;

  const totalKegiatan = trainings.length + seminars.length;
  const kegiatanDone = [...trainings, ...seminars].filter((k: any) => k.status === 'done').length;

  // ── FILTER KEUANGAN ────────────────────────────────────────────────────
  const [filterPeriode, setFilterPeriode] = useState<'semua' | 'minggu' | 'bulan' | 'tahun'>('semua');

  const filteredKas = useMemo(() => {
    if (filterPeriode === 'semua') return kasTransaksi;
    const now = new Date();
    return kasTransaksi.filter(t => {
      const d = new Date(t.tanggal);
      if (filterPeriode === 'tahun') return d.getFullYear() === now.getFullYear();
      if (filterPeriode === 'bulan') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      if (filterPeriode === 'minggu') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(now);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return d >= startOfWeek && d <= endOfWeek;
      }
      return true;
    });
  }, [kasTransaksi, filterPeriode]);

  const totalMasuk = useMemo(() => filteredKas.filter(t => t.tipe === 'masuk').reduce((s, t) => s + Number(t.nominal), 0), [filteredKas]);
  const totalKeluar = useMemo(() => filteredKas.filter(t => t.tipe === 'keluar').reduce((s, t) => s + Number(t.nominal), 0), [filteredKas]);
  const saldo = totalMasuk - totalKeluar;

  // Chart data: 7 bulan terakhir
  const chartDataKas = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
      const label = d.toLocaleString('id-ID', { month: 'short' });
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const val = kasTransaksi.filter(t => t.tipe === 'masuk' && t.tanggal?.startsWith(key)).reduce((s, t) => s + Number(t.nominal), 0);
      return { label, value: Math.round(val / 100000) };
    });
  }, [kasTransaksi]);

  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const handlePrint = () => window.print();

  // ── SVG Donut Chart ──────────────────────────────────────────────────
  const DonutChart = ({ pct, color, size = 120 }: { pct: number; color: string; size?: number }) => {
    const r = 40, cx = 50, cy = 50;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - pct / 100);
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="14"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 50 50)" />
        <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="800" fill={color}>{pct}%</text>
      </svg>
    );
  };

  // ── SVG Bar Chart ────────────────────────────────────────────────────
  const BarChart = ({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
      <svg viewBox={`0 0 ${data.length * 60} 160`} style={{ width: '100%', height: '160px' }}>
        {data.map((d, i) => {
          const barH = (d.value / max) * 110;
          const x = i * 60 + 8;
          return (
            <g key={i}>
              <rect x={x} y={140 - barH} width={44} height={barH} rx="6"
                fill={colors[i % colors.length]} fillOpacity="0.85" />
              <text x={x + 22} y={155} textAnchor="middle" fontSize="11" fill="#9ca3af">{d.label}</text>
              <text x={x + 22} y={140 - barH - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={colors[i % colors.length]}>{d.value}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  // ── Progress Bar ──────────────────────────────────────────────────────
  const ProgressBar = ({ label, value, pct, color }: { label: string; value: string | number; pct: number; color: string }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '5px', transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );

  const tabs = [
    { key: 'proker', label: 'Program Kerja', icon: BarChart2 },
    { key: 'keuangan', label: 'Keuangan', icon: Wallet },
    { key: 'anggota', label: 'Anggota', icon: Users },
    { key: 'kegiatan', label: 'Kegiatan', icon: Activity },
  ];

  const prokerByJenis: Record<string, number> = {};
  proker.forEach((p: any) => {
    const j = p.jenisID || 'Lainnya';
    prokerByJenis[j] = (prokerByJenis[j] || 0) + 1;
  });
  const jenisData = Object.entries(prokerByJenis).map(([label, value]) => ({ label, value }));

  return (
    <>
      {/* ── PRINT STYLES ─── injected inline so window.print() sees them */}
      <style>{`
        .print-only { display: none !important; }
        @media print {
          body * { visibility: hidden; }
          #laporan-print-area, #laporan-print-area * { visibility: visible; }
          #laporan-print-area { position: absolute; left: 0; top: 0; width: 100%; background: #fff; color: #111; padding: 0; font-family: 'Inter', sans-serif; }
          #laporan-print-area.print-only { display: block !important; }
          .no-print { display: none !important; }
          .print-page-break { page-break-before: always; }
          @page { margin: 1.5cm; size: A4 portrait; }
        }
      `}</style>

      {/* ── SCREEN: header ─────────────────────────── */}
      <div className="no-print">
        <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>Laporan Kegiatan BEM</h1>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>Per {today} · Semua data bersumber dari sistem admin</p>
          </div>
          <button onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Printer size={18} /> Ekspor / Cetak
          </button>
        </div>

        {/* KPI Summary */}
        <div className="admin-grid-auto" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { icon: Users, label: 'Total Anggota Aktif', value: stats?.members ?? 0, color: '#3b82f6', bg: 'rgba(59,130,246,.12)' },
            { icon: CheckCircle, label: 'Proker Selesai', value: prokerDone, color: '#10b981', bg: 'rgba(16,185,129,.12)' },
            { icon: Clock, label: 'Proker Berjalan', value: prokerOngoing, color: '#f97316', bg: 'rgba(249,115,22,.12)' },
            { icon: FileText, label: 'Total Program Kerja', value: prokerTotal, color: '#8b5cf6', bg: 'rgba(139,92,246,.12)' },
          ].map(c => (
            <div key={c.label} style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: c.bg, color: c.color, padding: '0.75rem', borderRadius: '0.75rem' }}><c.icon size={22} /></div>
              <div>
                <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 0.2rem', fontSize: '0.78rem', fontWeight: 600 }}>{c.label}</p>
                <h3 style={{ color: 'var(--admin-text-main)', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{c.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: activeTab === t.key ? 'none' : '1px solid var(--admin-card-border)', background: activeTab === t.key ? '#f97316' : 'var(--admin-card-bg)', color: activeTab === t.key ? 'white' : 'var(--admin-text-muted)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <t.icon size={16} />{t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: PROKER ──────────────────────────── */}
        {activeTab === 'proker' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
              {/* Donut overview */}
              <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontWeight: 700 }}>Penyelesaian Proker</h3>
                <DonutChart pct={prokerPct} color="#10b981" size={140} />
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                  <span>✓ Selesai: <strong style={{ color: '#10b981' }}>{prokerDone}</strong></span>
                  <span>⟳ Berjalan: <strong style={{ color: '#3b82f6' }}>{prokerOngoing}</strong></span>
                  <span>◷ Akan Datang: <strong style={{ color: '#f97316' }}>{prokerUpcoming}</strong></span>
                </div>
              </div>

              {/* Bar chart by jenis */}
              <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>Proker per Jenis Kegiatan</h3>
                {jenisData.length > 0
                  ? <BarChart data={jenisData} colors={['#10b981', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899']} />
                  : <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center', paddingTop: '2rem' }}>Belum ada data program kerja.</p>}
              </div>
            </div>

            {/* Tabel proker */}
            {proker.length > 0 && (
              <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-card-border)' }}>
                  <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontWeight: 700 }}>Daftar Program Kerja</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--admin-input-bg)', fontSize: '0.78rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {['Nama Program', 'Jenis', 'Penanggung Jawab', 'Durasi', 'Status'].map(h => (
                          <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {proker.map((p: any, i: number) => (
                        <tr key={p.id} style={{ borderTop: '1px solid var(--admin-card-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                          <td style={{ padding: '0.8rem 1.25rem', color: 'var(--admin-text-main)', fontWeight: 600 }}>{p.namaID}</td>
                          <td style={{ padding: '0.8rem 1.25rem', color: 'var(--admin-text-muted)' }}>{p.jenisID}</td>
                          <td style={{ padding: '0.8rem 1.25rem', color: 'var(--admin-text-muted)' }}>{p.penanggungJawab}</td>
                          <td style={{ padding: '0.8rem 1.25rem', color: 'var(--admin-text-muted)' }}>{p.durasi}</td>
                          <td style={{ padding: '0.8rem 1.25rem' }}>
                            <span style={{ padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: p.status === 'done' ? 'rgba(16,185,129,.15)' : p.status === 'ongoing' ? 'rgba(59,130,246,.15)' : 'rgba(249,115,22,.15)', color: p.status === 'done' ? '#10b981' : p.status === 'ongoing' ? '#3b82f6' : '#f97316' }}>
                              {p.status === 'done' ? '✓ Selesai' : p.status === 'ongoing' ? '⟳ Berjalan' : '◷ Akan Datang'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {proker.length === 0 && <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Belum ada data program kerja.</div>}
          </div>
        )}

        {/* ── TAB: KEUANGAN ──────────────────────────── */}
        {activeTab === 'keuangan' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {kasTransaksi.length === 0 ? (
              <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                <Wallet size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <p>Belum ada data kas. Tambahkan transaksi di menu <strong>Kas BEM</strong>.</p>
              </div>
            ) : (
              <>
                <div className="admin-grid-auto" style={{ gap: '1rem' }}>
                  {[
                    { label: 'Total Kas Masuk', value: formatRupiah(totalMasuk), pct: 100, color: '#10b981' },
                    { label: 'Total Kas Keluar', value: formatRupiah(totalKeluar), pct: totalMasuk > 0 ? Math.round((totalKeluar / totalMasuk) * 100) : 0, color: '#ef4444' },
                    { label: 'Saldo Aktif', value: formatRupiah(saldo), pct: totalMasuk > 0 ? Math.round((saldo / totalMasuk) * 100) : 0, color: saldo >= 0 ? '#3b82f6' : '#ef4444' },
                  ].map(k => (
                    <div key={k.label} style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
                      <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 0.4rem', fontSize: '0.8rem' }}>{k.label}</p>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color, marginBottom: '0.75rem' }}>{k.value}</div>
                      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, k.pct))}%`, background: k.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart arus kas */}
                <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>Arus Kas Masuk per Bulan</h3>
                  <BarChart data={chartDataKas} colors={['#10b981']} />
                  <p style={{ textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Nominal dalam ×Rp 100.000</p>
                </div>

                {/* Tabel transaksi */}
                <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontWeight: 700 }}>Riwayat Transaksi</h3>
                    <select 
                      value={filterPeriode}
                      onChange={(e) => setFilterPeriode(e.target.value as any)}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--admin-card-border)', background: 'var(--admin-input-bg)', color: 'var(--admin-text-main)', fontSize: '0.85rem' }}
                    >
                      <option value="semua">Semua Waktu</option>
                      <option value="minggu">Minggu Ini</option>
                      <option value="bulan">Bulan Ini</option>
                      <option value="tahun">Tahun Ini</option>
                    </select>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'var(--admin-input-bg)', fontSize: '0.78rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
                          {['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Nominal'].map(h => <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[...filteredKas].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).map((t, i) => (
                          <tr key={t.id} style={{ borderTop: '1px solid var(--admin-card-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                            <td style={{ padding: '0.8rem 1.25rem', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                              {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '0.8rem 1.25rem', color: 'var(--admin-text-main)' }}>{t.keterangan}</td>
                            <td style={{ padding: '0.8rem 1.25rem' }}>
                              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(139,92,246,.12)', color: '#8b5cf6' }}>{t.kategori}</span>
                            </td>
                            <td style={{ padding: '0.8rem 1.25rem' }}>
                              <span style={{ padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: t.tipe === 'masuk' ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: t.tipe === 'masuk' ? '#10b981' : '#ef4444' }}>
                                {t.tipe === 'masuk' ? '▲ Masuk' : '▼ Keluar'}
                              </span>
                            </td>
                            <td style={{ padding: '0.8rem 1.25rem', fontWeight: 700, color: t.tipe === 'masuk' ? '#10b981' : '#ef4444' }}>
                              {formatRupiah(Number(t.nominal))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── TAB: ANGGOTA ──────────────────────────── */}
        {activeTab === 'anggota' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="admin-grid-auto" style={{ gap: '1rem' }}>
              {[
                { icon: Users, label: 'Anggota Aktif', value: stats?.members ?? 0, color: '#3b82f6', bg: 'rgba(59,130,246,.12)' },
                { icon: TrendingUp, label: 'Tingkat Keaktifan', value: '87%', color: '#10b981', bg: 'rgba(16,185,129,.12)' },
                { icon: Award, label: 'Data Alumni', value: alumni.length, color: '#8b5cf6', bg: 'rgba(139,92,246,.12)' },
                { icon: Activity, label: 'Departemen Aktif', value: 8, color: '#f97316', bg: 'rgba(249,115,22,.12)' },
              ].map(c => (
                <div key={c.label} style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: c.bg, color: c.color, padding: '0.75rem', borderRadius: '0.75rem' }}><c.icon size={22} /></div>
                  <div>
                    <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 0.2rem', fontSize: '0.78rem', fontWeight: 600 }}>{c.label}</p>
                    <h3 style={{ color: 'var(--admin-text-main)', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{c.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
              {/* Bar chart departemen */}
              <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>Anggota per Departemen</h3>
                <BarChart data={[
                  { label: 'K3', value: 32 }, { label: 'Dikri', value: 28 }, { label: 'Humas', value: 22 },
                  { label: 'Wirausaha', value: 18 }, { label: 'Seni', value: 14 }, { label: 'IT', value: 10 },
                ]} colors={['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6']} />
              </div>

              {/* Distribusi progress */}
              <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1.25rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>Tingkat Partisipasi Departemen</h3>
                {[
                  { label: 'K3 & Lingkungan', value: '32 anggota', pct: 85, color: '#3b82f6' },
                  { label: 'Pendidikan & Riset', value: '28 anggota', pct: 72, color: '#10b981' },
                  { label: 'Hubungan Masyarakat', value: '22 anggota', pct: 60, color: '#f97316' },
                  { label: 'Kewirausahaan', value: '18 anggota', pct: 50, color: '#8b5cf6' },
                  { label: 'Seni & Olahraga', value: '14 anggota', pct: 40, color: '#ec4899' },
                ].map(d => <ProgressBar key={d.label} {...d} />)}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: KEGIATAN ──────────────────────────── */}
        {activeTab === 'kegiatan' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="admin-grid-auto" style={{ gap: '1rem' }}>
              {[
                { icon: Activity, label: 'Total Kegiatan', value: totalKegiatan, color: '#f97316', bg: 'rgba(249,115,22,.12)' },
                { icon: CheckCircle, label: 'Kegiatan Selesai', value: kegiatanDone, color: '#10b981', bg: 'rgba(16,185,129,.12)' },
                { icon: FileText, label: 'Pelatihan K3', value: trainings.length, color: '#3b82f6', bg: 'rgba(59,130,246,.12)' },
                { icon: Users, label: 'Seminar', value: seminars.length, color: '#8b5cf6', bg: 'rgba(139,92,246,.12)' },
              ].map(c => (
                <div key={c.label} style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: c.bg, color: c.color, padding: '0.75rem', borderRadius: '0.75rem' }}><c.icon size={22} /></div>
                  <div>
                    <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 0.2rem', fontSize: '0.78rem', fontWeight: 600 }}>{c.label}</p>
                    <h3 style={{ color: 'var(--admin-text-main)', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{c.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Donut kegiatan */}
            <div className="admin-grid-auto" style={{ gap: '1.5rem' }}>
              <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontWeight: 700, alignSelf: 'flex-start' }}>Tingkat Penyelesaian Kegiatan</h3>
                <DonutChart pct={totalKegiatan > 0 ? Math.round((kegiatanDone / totalKegiatan) * 100) : 0} color="#f97316" size={140} />
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                  <span>✓ Selesai: <strong style={{ color: '#10b981' }}>{kegiatanDone}</strong></span>
                  <span>Belum: <strong style={{ color: '#f97316' }}>{totalKegiatan - kegiatanDone}</strong></span>
                </div>
              </div>

              <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem', color: 'var(--admin-text-main)', fontWeight: 700 }}>Distribusi Jenis Kegiatan</h3>
                <BarChart data={[
                  { label: 'Pelatihan', value: trainings.length },
                  { label: 'Seminar', value: seminars.length },
                  { label: 'Proker', value: prokerTotal },
                ]} colors={['#3b82f6', '#8b5cf6', '#10b981']} />
              </div>
            </div>

            {[
              { title: 'Pelatihan K3', data: trainings, cols: [{ key: 'titleID', label: 'Nama' }, { key: 'durationID', label: 'Durasi' }, { key: 'feeID', label: 'Biaya' }, { key: 'year', label: 'Tahun' }, { key: 'status', label: 'Status' }] },
              { title: 'Seminar', data: seminars, cols: [{ key: 'titleID', label: 'Judul' }, { key: 'speaker', label: 'Pembicara' }, { key: 'date', label: 'Tanggal' }, { key: 'platform', label: 'Platform' }, { key: 'status', label: 'Status' }] },
            ].map(sec => sec.data.length > 0 && (
              <div key={sec.title} style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-card-border)' }}>
                  <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontWeight: 700 }}>{sec.title}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--admin-input-bg)', fontSize: '0.78rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
                        {sec.cols.map(c => <th key={c.key} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>{c.label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.data.map((item: any, i: number) => (
                        <tr key={item.id} style={{ borderTop: '1px solid var(--admin-card-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                          {sec.cols.map(c => (
                            <td key={c.key} style={{ padding: '0.8rem 1.25rem', color: c.key === 'status' ? undefined : 'var(--admin-text-main)' }}>
                              {c.key === 'status' ? (
                                <span style={{ padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: item.status === 'done' ? 'rgba(16,185,129,.15)' : item.status === 'ongoing' ? 'rgba(59,130,246,.15)' : 'rgba(249,115,22,.15)', color: item.status === 'done' ? '#10b981' : item.status === 'ongoing' ? '#3b82f6' : '#f97316' }}>
                                  {item.status === 'done' ? '✓ Selesai' : item.status === 'ongoing' ? '⟳ Berjalan' : '◷ Akan Datang'}
                                </span>
                              ) : item[c.key] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {totalKegiatan === 0 && <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Belum ada data kegiatan.</div>}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          PRINT-ONLY AREA — hanya tampil saat Ctrl+P / window.print()
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="laporan-print-area" className="print-only">
        {/* Cover */}
        <div style={{ textAlign: 'center', padding: '3rem 2rem 2rem', borderBottom: '2px solid #10b981' }}>
          <div style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '0.5rem' }}>BADAN EKSEKUTIF MAHASISWA</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111' }}>LAPORAN KEGIATAN BEM PRKK</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Periode {today}</p>
        </div>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', margin: '1.5rem 0' }}>
          {[
            { label: 'Anggota Aktif', value: stats?.members ?? 0, color: '#3b82f6' },
            { label: 'Proker Selesai', value: prokerDone, color: '#10b981' },
            { label: 'Proker Berjalan', value: prokerOngoing, color: '#f97316' },
            { label: 'Total Proker', value: prokerTotal, color: '#8b5cf6' },
          ].map(k => (
            <div key={k.label} style={{ border: `2px solid ${k.color}`, borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Penyelesaian Proker */}
        <div style={{ margin: '1.5rem 0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', borderLeft: '4px solid #10b981', paddingLeft: '0.75rem', marginBottom: '0.75rem' }}>Penyelesaian Program Kerja</h2>
          <div style={{ background: '#f3f4f6', borderRadius: '6px', height: '16px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${prokerPct}%`, background: '#10b981' }} />
          </div>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
            <span>Selesai: <strong style={{ color: '#10b981' }}>{prokerDone} ({prokerPct}%)</strong></span>
            <span>Berjalan: <strong style={{ color: '#3b82f6' }}>{prokerOngoing}</strong></span>
            <span>Akan Datang: <strong style={{ color: '#f97316' }}>{prokerUpcoming}</strong></span>
          </div>
        </div>

        {/* Tabel Proker */}
        {proker.length > 0 && (
          <div style={{ margin: '1.5rem 0' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', borderLeft: '4px solid #3b82f6', paddingLeft: '0.75rem', marginBottom: '0.75rem' }}>Daftar Program Kerja</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  {['No', 'Nama Program', 'Jenis', 'Penanggung Jawab', 'Durasi', 'Status'].map(h => <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: 700 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {proker.map((p: any, i: number) => (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                    <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{i + 1}</td>
                    <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>{p.namaID}</td>
                    <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>{p.jenisID}</td>
                    <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>{p.penanggungJawab}</td>
                    <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>{p.durasi}</td>
                    <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontWeight: 700, color: p.status === 'done' ? '#10b981' : p.status === 'ongoing' ? '#3b82f6' : '#f97316' }}>
                      {p.status === 'done' ? 'Selesai' : p.status === 'ongoing' ? 'Berjalan' : 'Akan Datang'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Kegiatan */}
        <div style={{ margin: '1.5rem 0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', borderLeft: '4px solid #f97316', paddingLeft: '0.75rem', marginBottom: '0.75rem' }}>Rekap Kegiatan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Total Kegiatan', value: totalKegiatan, color: '#f97316' },
              { label: 'Pelatihan K3', value: trainings.length, color: '#3b82f6' },
              { label: 'Seminar', value: seminars.length, color: '#8b5cf6' },
            ].map(k => (
              <div key={k.label} style={{ border: `1px solid ${k.color}40`, borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center', background: `${k.color}08` }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Keuangan */}
        <div style={{ margin: '1.5rem 0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', borderLeft: '4px solid #10b981', paddingLeft: '0.75rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Ringkasan Keuangan
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 400 }}>
              Periode: {filterPeriode === 'minggu' ? 'Minggu Ini' : filterPeriode === 'bulan' ? 'Bulan Ini' : filterPeriode === 'tahun' ? 'Tahun Ini' : 'Semua Waktu'}
            </span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Kas Masuk', value: formatRupiah(totalMasuk), color: '#10b981' },
              { label: 'Kas Keluar', value: formatRupiah(totalKeluar), color: '#ef4444' },
              { label: 'Saldo Aktif', value: formatRupiah(saldo), color: '#3b82f6' },
            ].map(k => (
              <div key={k.label} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: k.color }}>{k.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.2rem' }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Cetak Tabel Keuangan (Print Only) */}
          {filteredKas.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    {['No', 'Tanggal', 'Keterangan', 'Kategori', 'Masuk', 'Keluar'].map(h => <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontWeight: 700 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[...filteredKas].sort((a, b) => a.tanggal.localeCompare(b.tanggal)).map((t, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                      <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{i + 1}</td>
                      <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                      <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>{t.keterangan}</td>
                      <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>{t.kategori}</td>
                      <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb', color: '#10b981', fontWeight: 600 }}>{t.tipe === 'masuk' ? formatRupiah(Number(t.nominal)) : '-'}</td>
                      <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #e5e7eb', color: '#ef4444', fontWeight: 600 }}>{t.tipe === 'keluar' ? formatRupiah(Number(t.nominal)) : '-'}</td>
                    </tr>
                  ))}
                  {/* Row Total */}
                  <tr style={{ background: '#f3f4f6', fontWeight: 700 }}>
                    <td colSpan={4} style={{ padding: '0.75rem', textAlign: 'right', borderTop: '2px solid #e5e7eb' }}>TOTAL KESELURUHAN</td>
                    <td style={{ padding: '0.75rem', color: '#10b981', borderTop: '2px solid #e5e7eb' }}>{formatRupiah(totalMasuk)}</td>
                    <td style={{ padding: '0.75rem', color: '#ef4444', borderTop: '2px solid #e5e7eb' }}>{formatRupiah(totalKeluar)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af' }}>
          <span>Dokumen ini digenerate otomatis oleh Sistem Admin BEM PRKK</span>
          <span>Dicetak pada: {today}</span>
        </div>
      </div>
    </>
  );
};

export default AdminLaporan;
