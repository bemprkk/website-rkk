import React, { useState, useMemo } from 'react';
import { useContent } from '../../context/ContentContext';
import type { KasTransaksi } from '../../types';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Plus, Edit2, Trash2, Search, X, Save, Filter
} from 'lucide-react';

// ── Helper format rupiah ─────────────────────────────────────────────────────
const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const KATEGORI_OPTIONS = [
  'Iuran Anggota', 'Sponsor / Donasi', 'Dana Kemahasiswaan',
  'ATK & Perlengkapan', 'Konsumsi', 'Transportasi', 'Akomodasi',
  'Biaya Event / Kegiatan', 'Pelatihan & Sertifikasi', 'Biaya Administrasi', 'Lainnya',
];

const EMPTY_FORM: Omit<KasTransaksi, 'id'> = {
  tanggal: new Date().toISOString().slice(0, 10),
  keterangan: '',
  tipe: 'masuk',
  nominal: 0,
  kategori: 'Iuran Anggota',
};

// ── SVG Mini Bar Chart ────────────────────────────────────────────────────────
const MiniBarChart: React.FC<{ data: { label: string; masuk: number; keluar: number }[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => Math.max(d.masuk, d.keluar)), 1);
  const W = 60, H = 80, GAP = 4, BAR_W = (W - GAP * 3) / 2;
  return (
    <svg viewBox={`0 0 ${data.length * (W + GAP)} ${H + 30}`} style={{ width: '100%', height: '110px' }}>
      {data.map((d, i) => {
        const x = i * (W + GAP);
        const hMasuk = (d.masuk / max) * H;
        const hKeluar = (d.keluar / max) * H;
        return (
          <g key={i}>
            <rect x={x} y={H - hMasuk} width={BAR_W} height={hMasuk} rx={3} fill="#10b981" fillOpacity={0.85} />
            <rect x={x + BAR_W + 2} y={H - hKeluar} width={BAR_W} height={hKeluar} rx={3} fill="#ef4444" fillOpacity={0.85} />
            <text x={x + W / 2} y={H + 16} textAnchor="middle" fontSize={9} fill="#9ca3af">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const AdminKas: React.FC = () => {
  const { content, updateContent } = useContent();
  const kasTransaksi: KasTransaksi[] = (content as any).kasTransaksi ?? [];

  // ── UI state ─────────────────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<KasTransaksi, 'id'>>(EMPTY_FORM);
  const [filterTipe, setFilterTipe] = useState<'semua' | 'masuk' | 'keluar'>('semua');
  const [searchQ, setSearchQ] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Kalkulasi ringkasan ───────────────────────────────────────────────────
  const totalMasuk = useMemo(() => kasTransaksi.filter(t => t.tipe === 'masuk').reduce((s, t) => s + Number(t.nominal), 0), [kasTransaksi]);
  const totalKeluar = useMemo(() => kasTransaksi.filter(t => t.tipe === 'keluar').reduce((s, t) => s + Number(t.nominal), 0), [kasTransaksi]);
  const saldo = totalMasuk - totalKeluar;

  // ── Chart data: 6 bulan terakhir ─────────────────────────────────────────
  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const bulan = d.toLocaleString('id-ID', { month: 'short' });
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const masuk = kasTransaksi.filter(t => t.tipe === 'masuk' && t.tanggal?.startsWith(key)).reduce((s, t) => s + Number(t.nominal), 0);
      const keluar = kasTransaksi.filter(t => t.tipe === 'keluar' && t.tanggal?.startsWith(key)).reduce((s, t) => s + Number(t.nominal), 0);
      return { label: bulan, masuk, keluar };
    });
  }, [kasTransaksi]);

  // ── Filter & search ───────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return kasTransaksi
      .filter(t => filterTipe === 'semua' || t.tipe === filterTipe)
      .filter(t => !searchQ || t.keterangan.toLowerCase().includes(searchQ.toLowerCase()) || t.kategori.toLowerCase().includes(searchQ.toLowerCase()))
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal)); // terbaru di atas
  }, [kasTransaksi, filterTipe, searchQ]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (t: KasTransaksi) => {
    setEditingId(t.id);
    setForm({ tanggal: t.tanggal, keterangan: t.keterangan, tipe: t.tipe, nominal: t.nominal, kategori: t.kategori });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const current: KasTransaksi[] = (content as any).kasTransaksi ?? [];
      let updated: KasTransaksi[];
      if (editingId) {
        updated = current.map(t => t.id === editingId ? { ...form, id: editingId, nominal: Number(form.nominal) } : t);
      } else {
        const newItem: KasTransaksi = {
          ...form,
          id: Date.now().toString(),
          nominal: Number(form.nominal),
        };
        updated = [...current, newItem];
      }
      await updateContent(prev => ({ ...prev, kasTransaksi: updated }));
      setIsModalOpen(false);
    } catch {
      alert('Gagal menyimpan. Cek koneksi server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const current: KasTransaksi[] = (content as any).kasTransaksi ?? [];
    const updated = current.filter(t => t.id !== id);
    try {
      await updateContent(prev => ({ ...prev, kasTransaksi: updated }));
    } catch {
      alert('Gagal menghapus.');
    }
    setDeleteConfirmId(null);
  };

  // ── Kartu ringkasan ───────────────────────────────────────────────────────
  const summaryCards = [
    { label: 'Total Kas Masuk', value: formatRupiah(totalMasuk), color: '#10b981', bg: 'rgba(16,185,129,.1)', icon: TrendingUp },
    { label: 'Total Kas Keluar', value: formatRupiah(totalKeluar), color: '#ef4444', bg: 'rgba(239,68,68,.1)', icon: TrendingDown },
    { label: 'Saldo Aktif', value: formatRupiah(saldo), color: saldo >= 0 ? '#3b82f6' : '#ef4444', bg: 'rgba(59,130,246,.1)', icon: Wallet },
    { label: 'Jumlah Transaksi', value: kasTransaksi.length.toString(), color: '#8b5cf6', bg: 'rgba(139,92,246,.1)', icon: DollarSign },
  ];

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>Kas BEM PRKK</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>Kelola pemasukan & pengeluaran kas organisasi</p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} /> Tambah Transaksi
        </button>
      </div>

      {/* Summary Cards */}
      <div className="admin-grid-auto" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        {summaryCards.map(c => (
          <div key={c.label} style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: c.bg, color: c.color, padding: '0.75rem', borderRadius: '0.75rem', flexShrink: 0 }}>
              <c.icon size={22} />
            </div>
            <div>
              <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 0.2rem', fontSize: '0.78rem', fontWeight: 600 }}>{c.label}</p>
              <h3 style={{ color: c.color, margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Filter */}
      <div className="admin-grid-auto" style={{ gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'start' }}>
        {/* Chart */}
        <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--admin-text-main)', fontWeight: 700, fontSize: '1rem' }}>Arus Kas 6 Bulan Terakhir</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10b981', display: 'inline-block' }} /> Masuk
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> Keluar
            </span>
          </div>
          {kasTransaksi.length === 0
            ? <p style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem 0', fontSize: '0.875rem' }}>Belum ada transaksi</p>
            : <MiniBarChart data={chartData} />
          }
        </div>

        {/* Breakdown per kategori */}
        <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', color: 'var(--admin-text-main)', fontWeight: 700, fontSize: '1rem' }}>Pengeluaran per Kategori</h3>
          {(() => {
            const byKat: Record<string, number> = {};
            kasTransaksi.filter(t => t.tipe === 'keluar').forEach(t => {
              byKat[t.kategori] = (byKat[t.kategori] || 0) + Number(t.nominal);
            });
            const entries = Object.entries(byKat).sort((a, b) => b[1] - a[1]).slice(0, 5);
            const maxVal = entries[0]?.[1] || 1;
            if (entries.length === 0) return <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>Belum ada pengeluaran</p>;
            return entries.map(([kat, val]) => (
              <div key={kat} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-main)' }}>{kat}</span>
                  <span style={{ fontSize: '0.82rem', color: '#ef4444', fontWeight: 700 }}>{formatRupiah(val)}</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', width: `${(val / maxVal) * 100}%`, background: '#ef4444', borderRadius: '3px' }} />
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div style={{ background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-card-border)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, color: 'var(--admin-text-main)', fontWeight: 700 }}>Riwayat Transaksi</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
              <input
                type="text"
                placeholder="Cari transaksi…"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                style={{ paddingLeft: '2rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)', fontSize: '0.85rem', width: '180px' }}
              />
            </div>
            {/* Filter tipe */}
            {(['semua', 'masuk', 'keluar'] as const).map(f => (
              <button key={f} onClick={() => setFilterTipe(f)}
                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: filterTipe === f ? 'none' : '1px solid var(--admin-card-border)', background: filterTipe === f ? (f === 'masuk' ? '#10b981' : f === 'keluar' ? '#ef4444' : '#f97316') : 'var(--admin-card-bg)', color: filterTipe === f ? 'white' : 'var(--admin-text-muted)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', textTransform: 'capitalize' }}>
                {f === 'semua' ? 'Semua' : f === 'masuk' ? '▲ Masuk' : '▼ Keluar'}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            <Wallet size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ margin: 0 }}>Belum ada transaksi. Klik "Tambah Transaksi" untuk mulai.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--admin-input-bg)', fontSize: '0.78rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Nominal', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} style={{ borderTop: '1px solid var(--admin-card-border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding: '0.8rem 1.25rem', color: 'var(--admin-text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(t.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.8rem 1.25rem', color: 'var(--admin-text-main)', fontWeight: 500, maxWidth: '250px' }}>{t.keterangan}</td>
                    <td style={{ padding: '0.8rem 1.25rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(139,92,246,.12)', color: '#8b5cf6' }}>{t.kategori}</span>
                    </td>
                    <td style={{ padding: '0.8rem 1.25rem' }}>
                      <span style={{ padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700, background: t.tipe === 'masuk' ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.15)', color: t.tipe === 'masuk' ? '#10b981' : '#ef4444' }}>
                        {t.tipe === 'masuk' ? '▲ Masuk' : '▼ Keluar'}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1.25rem', fontWeight: 700, color: t.tipe === 'masuk' ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
                      {formatRupiah(Number(t.nominal))}
                    </td>
                    <td style={{ padding: '0.8rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(t)} title="Edit" style={{ background: 'rgba(59,130,246,.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,.2)', borderRadius: '0.375rem', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(t.id)} title="Hapus" style={{ background: 'rgba(239,68,68,.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,.2)', borderRadius: '0.375rem', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer total */}
        {filtered.length > 0 && (
          <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--admin-card-border)', display: 'flex', gap: '2rem', justifyContent: 'flex-end', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--admin-text-muted)' }}>Menampilkan <strong style={{ color: 'var(--admin-text-main)' }}>{filtered.length}</strong> transaksi</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>Saldo: {formatRupiah(saldo)}</span>
          </div>
        )}
      </div>

      {/* ── MODAL TAMBAH / EDIT ──────────────────────────────────────────── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
          <div style={{ position: 'relative', zIndex: 1, background: 'var(--admin-card-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '1.25rem', fontWeight: 700 }}>
                {editingId ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Tipe */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>Tipe Transaksi</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {(['masuk', 'keluar'] as const).map(tipe => (
                    <button key={tipe} type="button" onClick={() => setForm({ ...form, tipe })}
                      style={{ flex: 1, padding: '0.65rem', borderRadius: '0.5rem', border: form.tipe === tipe ? 'none' : '1px solid var(--admin-card-border)', background: form.tipe === tipe ? (tipe === 'masuk' ? '#10b981' : '#ef4444') : 'var(--admin-input-bg)', color: form.tipe === tipe ? 'white' : 'var(--admin-text-muted)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                      {tipe === 'masuk' ? '▲ Kas Masuk' : '▼ Kas Keluar'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanggal & Nominal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-input-group">
                  <label>Tanggal</label>
                  <input type="date" required value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
                </div>
                <div className="admin-input-group">
                  <label>Nominal (Rp)</label>
                  <input type="number" required min={1} placeholder="0" value={form.nominal || ''} onChange={e => setForm({ ...form, nominal: Number(e.target.value) })} />
                </div>
              </div>

              {/* Keterangan */}
              <div className="admin-input-group">
                <label>Keterangan / Deskripsi</label>
                <input type="text" required placeholder="Misal: Iuran anggota semester ganjil 2025" value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} />
              </div>

              {/* Kategori */}
              <div className="admin-input-group">
                <label>Kategori</label>
                <select value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-main)' }}>
                  {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              {/* Tombol */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', background: 'var(--admin-input-bg)', color: 'var(--admin-text-muted)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
                  Batal
                </button>
                <button type="submit" disabled={isSaving}
                  style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: form.tipe === 'masuk' ? '#10b981' : '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 700, opacity: isSaving ? 0.7 : 1 }}>
                  <Save size={16} />
                  {isSaving ? 'Menyimpan...' : editingId ? 'Update Transaksi' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── KONFIRMASI HAPUS ────────────────────────────────────────────── */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setDeleteConfirmId(null)} />
          <div style={{ position: 'relative', zIndex: 1, background: 'var(--admin-card-bg)', border: '1px solid #ef4444', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
            <Trash2 size={36} style={{ color: '#ef4444', marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--admin-text-main)', margin: '0 0 0.5rem' }}>Hapus Transaksi?</h3>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>Tindakan ini tidak dapat dibatalkan.</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteConfirmId(null)}
                style={{ flex: 1, padding: '0.65rem', background: 'var(--admin-input-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '0.5rem', color: 'var(--admin-text-muted)', cursor: 'pointer', fontWeight: 600 }}>
                Batal
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)}
                style={{ flex: 1, padding: '0.65rem', background: '#ef4444', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKas;
