# SOT & Aplikasi Web POS Warung Klontong Haji Lubis

Aplikasi Web Point of Sale (POS) modern berbasis **React + Vite** untuk Warung Klontong Haji Lubis dengan estetika SaaS modern berpalet warna Navy, Biru, Merah, dan Putih.

---

## 1. Dokumen Acuan (Single Source of Truth)
Proyek ini dikembangkan secara ketat mengacu pada dokumen SOT:
- `PRD.md` — Kebutuhan produk, batasan scope, fitur tiap modul, aturan bisnis, dan kriteria penerimaan.
- `UI-GUIDELINE.md` — Panduan visual (Merah/Biru/Putih/Navy), tipografi Manrope/DM Sans, design tokens, aksesibilitas, dan responsivitas.
- `IMPLEMENTATION_PLAN.md` — Rencana kerja bertahap 7 fase dengan gerbang persetujuan.
- `AGENTS.md` — Kontrak eksekusi wajib bagi pengembang/AI agent.
- `PROMPT_EXECUTION.md` — Panduan prompt eksekusi per fase.

---

## 2. Status Implementasi: Fase 1 s/d 7 Selesai Penuh (100% Siap UTS & Demo)
- [x] **Fase 1 (Penyusunan Kontrak & SOT):** Dokumen PRD, UI-Guideline, Implementation Plan, Agents, dan README.
- [x] **Fase 2 (Fondasi Front-End):** App shell, sidebar, topbar, 7 navigasi, design tokens, responsive baseline.
- [x] **Fase 3 (Modul Operasional Inti):** State Store terpadu (`StoreContext`), POS kasir interaktif, CRUD produk, manajemen stok & mutasi, struk belanja cetak, pembatalan transaksi berotoritas.
- [x] **Fase 4 (Dashboard & Laporan Analitik):** Dashboard eksekutif dengan KPI dinamis, toggle periode grafik (7 Hari vs 4 Minggu/Bulanan), peringkat produk terlaris, filter tanggal laporan penjualan, rekapitulasi kasir, serta ekspor CSV sisi klien.
- [x] **Fase 5 (Simulasi WhatsApp Gateway & Mobile UX):** Modul konfigurasi nomor pemilik, sakelar notifikasi otomatis, simulator & chat preview realistis, riwayat log pesan, struk digital WhatsApp, dan hybrid barcode scanner kamera/webcam.
- [x] **Fase 6 (Pengguna, Role Demo & RBAC Front-End):** Layar Login terpisah dengan 1-klik peran demo dan form manual, pemisahan hak akses menu (WhatsApp Gateway dan Pengguna terkunci untuk Kasir), tombol Logout, formulir tambah kasir baru, ganti kata sandi, dan tabel audit log.
- [x] **Fase 7 (QA, Aksesibilitas, dan Handoff):** Audit build production lolos 0 error, pengujian responsivitas (320px, 375px, 768px, 1024px, 1440px), reduced-motion, focus-visible, pembuatan `.gitignore` dan `vercel.json` untuk deployment Vercel.
- [x] Verifikasi build production (`npm run build`) sukses 100% tanpa error.

---

## 3. Panduan Publikasi ke GitHub & Vercel (Untuk Penilaian UTS)

Agar website POS dapat diakses secara publik melalui link HTTPS oleh dosen dan dapat dibuka langsung lewat kamera HP untuk scan barcode, ikuti 2 langkah mudah berikut:

### Langkah A: Push Kode ke Akun GitHub Anda
1. Buka [GitHub.com](https://github.com) dan buat repository baru (misal diberi nama: `pos-warung-haji-lubis`). Pilih opsi **Public**.
2. Buka terminal/PowerShell di folder proyek ini (`C:\latihan 2 prog\SOT_POS_Haji_Lubis`), lalu jalankan:
```bash
git init
git add .
git commit -m "feat: complete POS Warung Klontong Haji Lubis (UTS Final)"
git branch -M main
git remote add origin https://github.com/farajdevelop/pos-warung-haji-lubis.git
git push -u origin main
```
*(Ganti nama repo di atas jika Anda memberi nama berbeda di GitHub).*

---

### Langkah B: Hubungkan dan Deploy ke Vercel (Otomatis & Gratis)
1. Buka [Vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda (`farajdevelop`).
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Cari repository `pos-warung-haji-lubis` yang baru Anda buat, lalu klik **"Import"**.
4. Vercel akan otomatis mengenali framework **Vite**:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Klik **"Deploy"**. Dalam ~40 detik, Vercel akan memberikan link domain live gratis bersertifikat SSL/HTTPS, contoh:
   👉 `https://pos-warung-haji-lubis.vercel.app`
6. Salin link tersebut untuk diserahkan ke dosen pada lembar tugas UTS, atau buka langsung di browser HP Anda!

---

## 4. Prasyarat & Cara Menjalankan Lokal

### Kebutuhan Sistem:
- Node.js (v18.0.0 atau lebih baru)
- npm (v9.0.0 atau lebih baru)

### Instalasi Dependensi:
```bash
npm install
```

### Menjalankan Development Server:
```bash
npm run dev
```
Buka browser pada alamat [http://localhost:5173/](http://localhost:5173/).

### Melakukan Build Production:
```bash
npm run build
```
Hasil build akan dihasilkan pada folder `dist/`.

---

## 4. Struktur Folder
```
SOT_POS_Haji_Lubis/
├── dist/                  # Hasil kompilasi build production
├── src/
│   ├── components/        # Komponen UI modular
│   │   ├── Dashboard.jsx  # Tampilan utama Dashboard fondasi
│   │   ├── POSModule.jsx  # Modul Kasir (Direncanakan Fase 3)
│   │   ├── ProductModule.jsx # Modul Produk & Barang (Direncanakan Fase 3)
│   │   ├── ReportModule.jsx  # Modul Laporan (Direncanakan Fase 4)
│   │   ├── Sidebar.jsx    # Navigasi sidebar & alih peran demo
│   │   ├── StockModule.jsx   # Modul Stok & Mutasi (Direncanakan Fase 3)
│   │   ├── Topbar.jsx     # Header aplikasi, breadcrumb & status
│   │   ├── UserModule.jsx # Modul Pengguna & Hak Akses (Direncanakan Fase 6)
│   │   └── WhatsAppModule.jsx # Modul Simulasi WA Gateway (Direncanakan Fase 5)
│   ├── data/
│   │   └── dummyData.js   # Sumber dataset dummy terpusat
│   ├── utils/
│   │   └── formatters.js  # Pemformat mata uang IDR, tanggal, dan status
│   ├── App.jsx            # Shell aplikasi utama & router modul
│   ├── index.css          # Design tokens & stylesheet global
│   └── main.jsx           # Entry point React
├── index.html             # Shell HTML utama
├── package.json           # Dependensi proyek
├── vite.config.js         # Konfigurasi bundler Vite
├── AGENTS.md              # Kontrak eksekusi proyek
├── IMPLEMENTATION_PLAN.md # Roadmap 7 fase
├── PRD.md                 # Product Requirement Document
├── UI-GUIDELINE.md        # Panduan UI/UX
└── README.md              # Panduan proyek & instalasi
```

---

## 5. Batasan Prototipe & Aturan Simulasi
1. **Murni Front-End:** Seluruh data bersifat lokal pada state sesi browser. Tidak ada database SQL/NoSQL, API server, atau penyimpanan permanen backend.
2. **Tanpa Integrasi Eksternal:** WhatsApp Gateway dan alur pembayaran adalah simulasi antarmuka. Tidak ada pesan riil yang dikirim ke nomor HP pelanggan atau pemilik.
3. **Keamanan Simulasi:** Pembagian peran (Pemilik/Admin vs Kasir) adalah simulasi visual front-end, bukan otentikasi produksi.
4. **Data Reset:** Menyegarkan halaman (browser refresh) akan mengembalikan state ke data awal dummy.
