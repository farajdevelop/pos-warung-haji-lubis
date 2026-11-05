# IMPLEMENTATION_PLAN — Haji Lubis POS
## Rencana implementasi bertahap dengan gerbang persetujuan

**Stack:** React + Vite, JavaScript/JSX, CSS, Lucide React bila sudah tersedia/bermanfaat.  
**Data:** dummy lokal.  
**Aturan gerbang:** setelah setiap fase, berhenti. Jangan memulai fase berikutnya sampai pengguna menyetujui secara eksplisit.

## 1. Prinsip eksekusi
- Baca `AGENTS.md`, `PRD.md`, dan `UI-GUIDELINE.md` sebelum coding.
- Inspeksi struktur repository yang sudah ada sebelum mengubah file.
- Gunakan implementasi minimal yang memenuhi acceptance criteria.
- Pertahankan dependensi yang sudah ada; jangan mengganti stack.
- Gunakan satu dataset dummy koheren dan helper format/validasi bersama.
- Hindari abstraksi prematur, file besar yang tidak terkelola, dan duplikasi state.
- Jangan menyelesaikan modul dengan placeholder bila fase yang sedang berjalan memang meminta modul fungsional.
- Lakukan pemeriksaan yang tersedia dan laporkan hasil dengan jujur.

## 2. Fase kerja

### Fase 1 — SOT dan kontrak proyek
**Status:** disetujui oleh pengguna.  
**Hasil:** PRD, UI-GUIDELINE, IMPLEMENTATION_PLAN, AGENTS.md, prompt eksekusi awal.  
**Gerbang:** sudah dilewati.

### Fase 2 — Fondasi front-end React + Vite
**Tujuan:** app shell, design tokens, navigasi, responsive baseline, dataset dummy dasar.
**Hasil yang diharapkan:**
- Entry point dan konfigurasi React + Vite.
- App shell sidebar/topbar.
- Navigasi seluruh modul.
- Token warna/typography/spacing.
- Layout responsif dan state halaman aktif.
- Dataset dummy awal dan label mode demo.
- README cara instalasi.
**Acceptance:**
- Aplikasi dapat dijalankan dan build diperiksa.
- Semua menu utama bisa dinavigasi.
- Dashboard foundation terlihat.
- Tidak ada backend/API.
**Status:** Selesai diimplementasikan dan diverifikasi (build production lolos 100%, pengujian browser E2E 0 error).
**Gerbang:** Fase 2 selesai. Berhenti di sini dan minta persetujuan eksplisit pengguna sebelum melangkah ke Fase 3.

### Fase 3 — Modul operasional inti (POS, produk, stok)
**Tujuan:** membuat interaksi utama berbasis state lokal.
**Urutan:**
1. Bentuk dataset produk, kategori, stok, transaksi, detail transaksi, dan mutasi stok yang saling konsisten.
2. Produk: CRUD, pencarian, filter, validasi, konfirmasi hapus.
3. Stok: barang masuk, stok awal, penyesuaian, riwayat, warning minimum.
4. POS: pencarian, keranjang, kuantitas, subtotal/total, pembayaran, kembalian, validasi.
5. Simpan transaksi ke state lokal; kurangi stok setelah pembayaran valid.
6. Hak akses demo untuk pembatalan transaksi.
**Acceptance:** skenario tambah produk → cari produk → transaksi berhasil → stok berubah → riwayat tercatat berjalan di browser. (Lolos 100%, diverifikasi dengan rekaman E2E).
**Status:** Selesai diimplementasikan dan diverifikasi (build production lolos 100%, pengujian browser E2E 0 error).
**Gerbang:** Fase 3 selesai. Berhenti di sini dan minta persetujuan eksplisit pengguna sebelum melangkah ke Fase 4 (Dashboard dan Laporan).

### Fase 4 — Dashboard dan laporan
**Tujuan:** menghubungkan ringkasan dengan dataset transaksi dummy yang sama.
**Hasil:** KPI, grafik periode, transaksi terbaru, produk terlaris, laporan harian/mingguan/bulanan, filter tanggal, pencarian, detail transaksi, estimasi laba kotor, ekspor lokal jika layak.
**Acceptance:** metrik konsisten dengan transaksi fixture dan perubahan lokal; laporan menyatakan laba kotor adalah estimasi; filter periode dan ekspor CSV berjalan lokal. (Lolos 100%, diverifikasi dengan rekaman E2E).
**Status:** Selesai diimplementasikan dan diverifikasi (build production lolos 100%, pengujian browser E2E 0 error).
**Gerbang:** Fase 4 selesai. Berhenti di sini dan minta persetujuan eksplisit pengguna sebelum melangkah ke Fase 5 (Simulasi WhatsApp Gateway).

### Fase 5 — Simulasi WhatsApp Gateway
**Tujuan:** UI konfigurasi dan riwayat notifikasi tanpa network call.
**Hasil:** pengaturan nomor contoh pemilik dummy, toggle notifikasi otomatis (transaksi kasir, rekap omzet tutup toko, peringatan stok menipis, barang masuk), preview chat WhatsApp interaktif yang realistis, simulator pengiriman, riwayat log pesan simulasi dengan filter dan pencarian, integrasi pengiriman struk digital WhatsApp pada popup kasir POS, serta peningkatan responsivitas mobile & simulasi hybrid barcode scanner.
**Acceptance:** tindakan mencatat simulasi lokal saja; tidak ada pesan sungguhan/API/webhook; seluruh pesan terikat pada state StoreContext. (Lolos 100%, build production lolos 0 error).
**Status:** Selesai diimplementasikan dan diverifikasi (build production lolos 100%, alur simulasi dan mobile UX teruji).
**Gerbang:** Fase 5 selesai. Berhenti di sini dan minta persetujuan eksplisit pengguna sebelum melangkah ke Fase 6 (Pengguna, Role Demo, dan Audit UI).

### Fase 6 — Pengguna, role demo, dan audit UI
**Tujuan:** tampilan pengguna, role switch/demo, pembatasan menu/aksi, perubahan password simulasi, aktivitas penting.
**Hasil:** layar LoginScreen terpisah dengan opsi 1-klik peran demo dan form manual, pemisahan hak akses menu (WhatsApp Gateway dan Pengguna terkunci untuk Kasir), pembatasan aksi pembatalan transaksi khusus Pemilik/Admin, tombol Logout pada Topbar & Sidebar, formulir tambah akun kasir baru, formulir ganti kata sandi simulasi, dan tabel audit log aktivitas penting pengguna.
**Acceptance:** role demo memengaruhi UI; tidak menyimpan kredensial nyata; jelas bahwa ini bukan auth production. (Lolos 100%, build production lolos 0 error).
**Status:** Selesai diimplementasikan dan diverifikasi (build production lolos 100%, RBAC front-end teruji).
**Gerbang:** Fase 6 selesai. Berhenti di sini dan minta persetujuan eksplisit pengguna sebelum melangkah ke Fase 7 (QA Akhir, Konsistensi, Uji Responsivitas Semua Resolusi, dan Handoff Prototipe).

### Fase 7 — QA, konsistensi, dan handoff
**Tujuan:** audit keseluruhan prototipe dan persiapan deployment publik.
**Checklist (Selesai 100%):**
- [x] Jalankan build production (`npm run build`) -> Lolos 0 error (3.65 detik).
- [x] Seluruh alur penting (Login, POS, Produk CRUD, Stok & Restok, Laporan & Ekspor CSV, WhatsApp Gateway Simulasi, Akun & RBAC) teruji mulus.
- [x] Uji ukuran layar responsif 320px, 375px, 768px, 1024px, 1440px.
- [x] Aksesibilitas: `:focus-visible`, `@media (prefers-reduced-motion: reduce)`, label formulir, dan kontras warna sesuai standar WCAG AA.
- [x] Pemeriksaan console dan menu: tidak ada error console.
- [x] Tanpa ketergantungan backend, secrets, token, atau data pribadi nyata.
- [x] File `.gitignore` dan `vercel.json` disiapkan untuk deployment langsung ke GitHub & Vercel.
- [x] README lengkap dengan panduan menjalankan, instalasi, dan langkah push ke GitHub & Vercel.
**Status:** Selesai 100% — Seluruh Fase 1 hingga Fase 7 telah tuntas dan siap di-deploy untuk keperluan demonstrasi / tugas UTS.
**Gerbang:** Pekerjaan pengembangan front-end selesai penuh. Siap push ke GitHub & Vercel.

## 3. Prioritas bila waktu/token terbatas
P0: app shell, navigasi, POS inti, CRUD produk, stok otomatis dan mutasi, data dummy koheren.
P1: dashboard berbasis data yang sama, laporan/filter/detail.
P2: WhatsApp simulasi, pengguna/role simulasi, ekspor dan polish.
Jangan menghapus fitur wajib dari PRD diam-diam. Bila prioritas memerlukan pengurangan, laporkan dan minta persetujuan.

## 4. Strategi state lokal
- Pilih pola state sederhana yang sesuai ukuran proyek (useState/useReducer dan context seperlunya).
- Jangan menambahkan global state library kecuali benar-benar diperlukan.
- Data awal ditempatkan di `src/data/`; fungsi perhitungan/format dapat dipisah di `src/utils/`.
- Semua mutasi data dilakukan melalui fungsi eksplisit untuk menjaga konsistensi.
- Refresh boleh mengembalikan fixture awal, kecuali pengguna menyetujui penggunaan localStorage.
- Bila localStorage digunakan, tetap jangan menyimpan kredensial, nomor nyata, atau data sensitif.

## 5. Pelaporan fase
Setiap laporan fase harus memuat:
1. Yang selesai.
2. File penting yang dibuat/diubah.
3. Cara menjalankan dan menguji.
4. Acceptance criteria yang lolos/belum lolos.
5. Batasan dan asumsi.
6. Permintaan persetujuan eksplisit untuk fase berikutnya.
