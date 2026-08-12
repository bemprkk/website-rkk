# BEMPRKK — Website Resmi

**Badan Eksekutif Mahasiswa Prodi Rekayasa Keselamatan Kebakaran**

Website ini dibangun menggunakan React + TypeScript + Vite, dengan desain modern dan animasi framer-motion. **Tidak menggunakan database** — semua konten bersifat statis dan dapat diedit langsung di kode.

## 🚀 Cara Menjalankan

```bash
# Install dependensi
npm install

# Jalankan development server
npm run dev

# Build untuk produksi
npm run build

# Preview hasil build
npm run preview
```

## 📁 Struktur Proyek

```
src/
├── components/         # Komponen UI
│   ├── Branding/       # Logo BEMPRKK (SVG)
│   ├── About.tsx       # Halaman Misi
│   ├── Contact.tsx     # Halaman Kontak
│   ├── Gallery.tsx     # Galeri kegiatan
│   ├── Kepengurusan.tsx# Halaman Tim
│   ├── Navbar.tsx      # Navigasi
│   ├── Footer.tsx      # Footer
│   ├── Programs.tsx    # Program kerja
│   ├── HackerPreloader.tsx # Loading screen
│   └── RegistrationForm.tsx
├── context/            # React Context (tanpa database)
├── data/
│   └── staticContent.ts # 🔧 EDIT INI untuk ubah konten
├── pages/              # Halaman-halaman website
├── translations/
│   └── index.ts        # 🔧 EDIT INI untuk ubah teks
└── types/              # TypeScript types
```

## ✏️ Cara Edit Konten

### Mengubah teks (nama, deskripsi, FAQ, dll.)
Edit file: `src/translations/index.ts`

### Mengubah foto, anggota tim, galeri, statistik
Edit file: `src/data/staticContent.ts`

### Menambah program kerja
Edit array `staticProker` di `src/components/Programs.tsx`

### Menambah alumni
Edit array `staticAlumni` di `src/pages/AlumniPage.tsx`

## 🎨 Tema
Tema merah-oranye (fire theme) sesuai identitas Rekayasa Keselamatan Kebakaran.
Untuk mengubah warna utama, edit variabel `--clr-accent` di `src/index.css`.

## 🌐 Halaman
- `/` — Beranda
- `/misi` — Visi & Misi
- `/program` — Program Kerja
- `/galeri` — Galeri
- `/tim` — Kepengurusan
- `/kontak` — Kontak
- `/alumni` — Alumni
