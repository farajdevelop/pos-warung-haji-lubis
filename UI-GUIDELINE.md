# UI-GUIDELINE — Haji Lubis POS
## Modern Futuristic SaaS · Red / Blue / White

**Tujuan:** memastikan tampilan konsisten, mudah dipakai saat operasional warung, modern, dan tidak berlebihan.

## 1. Arah visual
- Karakter: modern SaaS, rapi, profesional, ringan, sedikit futuristik.
- Prioritas: kecepatan membaca angka, kemudahan kasir, dan kejelasan status.
- Brand utama: navy/biru untuk struktur dan aksi utama; merah untuk brand emphasis, peringatan, dan aksi destruktif; putih/abu muda untuk permukaan.
- Hindari efek neon berlebihan, glassmorphism yang mengganggu keterbacaan, gradient berat, dan animasi dekoratif.

## 2. Design tokens
### Warna
- `--color-brand-blue: #2563EB` — aksi utama, link, grafik.
- `--color-brand-navy: #172554` — sidebar/header gelap, struktur.
- `--color-brand-red: #E53945` — aksen brand, status kritis, hapus/batal.
- `--color-white: #FFFFFF` — surface.
- `--color-page: #F5F7FB` — latar utama.
- `--color-text: #172033` — teks utama.
- `--color-muted: #778197` — teks sekunder.
- `--color-border: #E7EBF3` — border.
- `--color-success: #168A5F` — berhasil.
- `--color-warning: #C58822` — peringatan.
- `--color-danger: #D93645` — bahaya.
- `--color-info-bg: #EDF3FF` — latar informasi.

Gunakan warna status secara semantik. Merah tidak boleh menjadi satu-satunya penanda error; sertakan label/ikon/teks.

### Tipografi
- Pilihan utama: Manrope untuk heading dan DM Sans untuk body; jika font eksternal tidak tersedia, gunakan system sans-serif.
- Heading dashboard: 24–30 px desktop; heading panel: 14–18 px.
- Body umum: 12–14 px untuk density SaaS; teks penting tidak boleh terlalu kecil.
- Label/metadata: 10–12 px dengan kontras memadai.
- Gunakan format IDR `Rp 1.234.567`, format tanggal Indonesia, dan angka konsisten.

### Spasi, radius, bayangan
- Skala spasi berbasis 4 px: 4, 8, 12, 16, 20, 24, 32, 40.
- Radius kontrol 8–10 px; kartu 12–16 px; avatar berbentuk lingkaran.
- Border halus `1px solid var(--color-border)`.
- Shadow ringan untuk mengangkat kartu; hindari bayangan berat.
- Konsistensi grid dan alignment lebih penting daripada ornamen.

## 3. Kerangka aplikasi
### Sidebar
- Desktop: sidebar tetap di kiri, navy, logo/nama Warung Haji Lubis, switch workspace opsional, kelompok menu, identitas role di bagian bawah.
- Menu: Dashboard, Kasir/POS, Produk & Barang, Manajemen Stok, Laporan Penjualan, WhatsApp Gateway, Pengguna & Akses.
- Menu aktif terlihat jelas dengan latar biru dan aksen merah yang terukur.
- Mobile: sidebar menjadi drawer dengan overlay, tombol buka/tutup dan dukungan keyboard.

### Topbar
- Breadcrumb/judul halaman.
- Status demo yang terlihat.
- Notifikasi hanya sebagai affordance UI jika tidak fungsional.
- Identitas pengguna/role dummy.
- Semua tombol harus berfungsi atau jelas ditampilkan sebagai nonaktif; hindari kontrol dekoratif palsu.

### Konten
- Gunakan batas lebar yang wajar dan ruang putih.
- Dashboard: salam/judul, badge tanggal dummy, banner demo, KPI cards, grafik, stok menipis, aktivitas terbaru.
- Halaman operasional: judul, deskripsi ringkas, aksi utama, filter/search, konten tabel/kartu, pagination bila diperlukan, empty/loading/error states.
- POS: layout berorientasi tugas, pencarian produk mudah ditemukan, keranjang dan total menonjol, pembayaran/kembalian mudah dipahami.

## 4. Komponen dan aturan perilaku
- **Button:** primary biru; secondary putih dengan border; destructive merah. Beri hover, active, disabled, focus.
- **Input/select:** label eksplisit, placeholder sebagai contoh bukan pengganti label, pesan validasi dekat field.
- **Table:** header jelas, alignment angka ke kanan, row hover halus, responsive dengan overflow atau tampilan kartu.
- **Badge/status:** selalu sertakan teks, bukan warna saja.
- **Modal/dialog:** judul dan aksi jelas; destructive action memerlukan konfirmasi.
- **Toast/feedback:** singkat, tidak menutupi aksi utama; feedback sukses hanya setelah state lokal benar-benar berubah.
- **Empty state:** jelaskan situasi dan aksi berikutnya.
- **Charts:** label periode, tooltip bila relevan, legend yang jelas, dan keterangan bahwa datanya dummy.
- **Search/filter:** perubahan state memperbarui hasil; sediakan reset filter bila filter lebih dari satu.
- **Form:** cegah submit invalid; pertahankan input saat error; konfirmasi sebelum meninggalkan form kotor jika implementasi mendukung.

## 5. Responsivitas
- Desktop ≥ 1200 px: sidebar permanen; KPI 4 kolom; dashboard multi-kolom.
- Tablet 768–1199 px: sidebar dapat dipadatkan/drawer; KPI 2 kolom; panel ditumpuk bila sempit.
- Mobile < 768 px: drawer sidebar; KPI 1–2 kolom sesuai ruang; tabel dapat scroll horizontal atau menjadi cards; aksi penting tetap mudah dijangkau.
- Uji lebar 320 px, 375 px, 768 px, 1024 px, dan 1440 px.
- Hindari horizontal overflow pada seluruh halaman kecuali container tabel yang sengaja dibuat scrollable.

## 6. Aksesibilitas dan motion
- Gunakan elemen HTML semantik dan heading berurutan.
- Semua kontrol interaktif dapat dioperasikan keyboard dan memiliki focus-visible.
- Gunakan `aria-label` untuk tombol ikon tanpa teks.
- Label input terhubung dengan input; modal mengelola fokus secara wajar.
- Perhatikan kontras teks dan status.
- Hormati `prefers-reduced-motion`.
- Jangan gunakan warna saja untuk menyampaikan status.

## 7. Konten dan dummy data
- Bahasa UI: Bahasa Indonesia yang natural dan konsisten.
- Nama produk, pengguna, nomor pesan, transaksi, waktu, dan metrik harus merupakan data contoh.
- Tampilkan banner/label “Mode demo” atau “Data simulasi”.
- Jangan gunakan data pelanggan asli atau nomor WhatsApp pribadi.
- Hindari tanggal statis yang menyesatkan; gunakan label “contoh” atau tanggal yang disediakan fixture.
- Jangan menampilkan status WhatsApp seolah hasil provider nyata.

## 8. Do / Don't
**Do**
- Gunakan hirarki visual jelas, satu aksi utama per area, konsistensi token, status eksplisit, dan feedback yang jujur.
- Prioritaskan POS cepat, input jumlah mudah, total dan kembalian menonjol.
- Gunakan komponen bersama untuk button, input, badge, panel, modal, dan table bila layak.

**Don't**
- Jangan menambah modul di luar PRD.
- Jangan membuat backend atau API.
- Jangan menampilkan tombol yang tidak melakukan apa-apa tanpa menandai/menonaktifkannya.
- Jangan menyebut angka dummy sebagai penjualan aktual.
- Jangan memakai animasi, gradient, atau dekorasi yang menurunkan performa/keterbacaan.
