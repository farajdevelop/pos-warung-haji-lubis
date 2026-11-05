# PRD — Product Requirements Document
## POS Web Warung Klontong Haji Lubis

**Versi:** 1.0  
**Status:** Disetujui sebagai acuan proyek  
**Produk:** Sistem informasi Point of Sale berbasis web  
**Frontend:** React + Vite  
**Mode pengembangan:** Prototype dengan data dummy  
**Metode:** Prototype / iteratif dengan gerbang persetujuan per fase

## 1. Ringkasan produk
Aplikasi web untuk membantu Warung Klontong Haji Lubis memantau penjualan, melakukan transaksi kasir, mengelola katalog barang dan stok, melihat laporan, serta memvisualisasikan alur notifikasi WhatsApp. Proyek pada tahap ini berfokus pada pengalaman front-end. Seluruh data berasal dari dataset lokal/dummy; tidak ada backend atau integrasi eksternal nyata.

## 2. Tujuan
- Menyediakan antarmuka kasir yang cepat dipahami dan efisien untuk transaksi warung.
- Memberikan ringkasan penjualan, transaksi, estimasi laba kotor, dan stok menipis.
- Menyediakan alur UI untuk produk, stok, laporan, WhatsApp Gateway, dan pengguna.
- Menunjukkan prototipe modern, responsif, dan konsisten untuk evaluasi pemilik/pengguna.
- Mempertahankan struktur kode yang sederhana, modular, dan hemat token saat dieksekusi coding assistant.

## 3. Pengguna dan peran
### 3.1 Pemilik/Admin
Dapat melihat semua modul, ringkasan dan laporan, mengelola barang/stok/pengguna, mengatur simulasi notifikasi, serta membatalkan transaksi dalam prototipe.

### 3.2 Kasir
Fokus pada halaman POS, pencarian produk, keranjang, pembayaran simulasi, dan melihat hasil transaksi yang disimulasikan. Modul sensitif seperti pembatalan transaksi, manajemen pengguna, pengaturan, dan laporan tertentu dapat dibatasi melalui UI.

**Catatan keamanan:** role dan pembatasan pada prototipe hanya simulasi front-end, bukan kontrol keamanan produksi.

## 4. Ruang lingkup
### 4.1 Termasuk
- Dashboard Admin.
- Transaksi Penjualan (POS).
- Manajemen Produk dan Barang.
- Manajemen Stok Barang.
- Laporan Penjualan.
- Integrasi WhatsApp Gateway sebagai simulasi UI.
- Manajemen Pengguna dan Hak Akses sebagai simulasi UI.
- Navigasi, pencarian/filter front-end, modal/form, toast/feedback, empty state, validasi dasar di sisi klien, dan responsivitas.
- Dataset dummy lokal terpusat untuk seluruh modul.

### 4.2 Tidak termasuk
- Backend, server, database, API, ORM, atau migrasi.
- Autentikasi/otorisasi nyata dan penyimpanan kredensial.
- WhatsApp API/provider, pengiriman pesan sungguhan, webhook, atau status delivery aktual.
- Payment gateway, pembayaran online, integrasi printer fisik, atau perangkat POS khusus.
- Deployment produksi, domain, hosting, analytics nyata, dan pengumpulan data pribadi.
- Klaim keamanan produksi atau persistensi data antar perangkat.

## 5. Kebutuhan fungsional

### 5.1 Dashboard Admin
Wajib:
- Kartu ringkasan total penjualan harian.
- Total transaksi hari ini.
- Ringkasan pendapatan dan estimasi laba kotor.
- Daftar/peringatan stok barang menipis.
- Grafik penjualan berdasarkan periode (minimal 7 hari; sediakan pilihan periode yang relevan jika masuk desain).
- Aktivitas/transaksi terbaru.
- Seluruh nilai harus berasal dari data dummy yang konsisten.

Kriteria penerimaan:
- Angka kartu, grafik, dan daftar menggunakan satu sumber data dummy.
- Periode yang dipilih memperbarui visualisasi secara lokal bila kontrol tersebut ditampilkan.
- Ada penanda jelas “Data demo” atau “Data simulasi”.

### 5.2 Transaksi Penjualan (Point of Sale)
Wajib:
- Pencarian produk berdasarkan nama atau kode/barcode.
- Memilih produk dan mengatur kuantitas.
- Keranjang belanja dengan subtotal per item.
- Perhitungan subtotal dan total otomatis.
- Input nominal pembayaran dan hitung kembalian otomatis.
- Validasi nominal pembayaran tidak kurang dari total sebelum transaksi disimpan.
- Penyimpanan transaksi ke state/data lokal selama sesi prototipe.
- Stok dummy berkurang setelah transaksi simulasi berhasil.
- Pembatalan transaksi hanya terlihat/tersedia untuk role yang berhak; konfirmasi sebelum tindakan.

Kriteria penerimaan:
- Produk dapat dicari dan ditambahkan; kuantitas dapat diubah/dihapus.
- Total berubah ketika isi keranjang atau kuantitas berubah.
- Tombol pembayaran memberi feedback sukses hanya jika nominal mencukupi.
- Tindakan pembatalan memiliki dialog konfirmasi dan alasan pada UI bila sesuai.
- Tidak ada klaim bahwa transaksi tersimpan permanen.

### 5.3 Manajemen Produk dan Barang
Wajib:
- CRUD front-end: tambah, lihat, edit, dan hapus produk.
- Kode produk/barcode, nama, kategori.
- Harga modal dan harga jual.
- Stok, satuan (pcs, botol, renteng, dus, kg, liter, dan lainnya sesuai dummy).
- Foto produk opsional; gunakan placeholder jika tidak ada gambar.
- Pencarian dan filter berdasarkan nama/kode/kategori/status stok.
- Validasi input dasar dan konfirmasi sebelum menghapus.

Kriteria penerimaan:
- Form menampilkan field wajib dan pesan validasi.
- Data hasil tambah/edit tampil di tabel/katalog setelah perubahan state lokal.
- Harga modal tidak ditampilkan sebagai harga jual kepada pelanggan di alur kasir.
- Hapus memerlukan konfirmasi.

### 5.4 Manajemen Stok Barang
Wajib:
- Pengurangan stok otomatis setelah transaksi simulasi berhasil.
- Pencatatan barang masuk.
- Pencatatan stok awal.
- Riwayat perubahan stok dengan waktu dummy, jenis perubahan, jumlah, pelaku dummy, dan catatan.
- Peringatan stok minimum.
- Penyesuaian stok berdasarkan stok fisik dengan alasan.
- Laporan barang masuk dan barang keluar.

Kriteria penerimaan:
- Barang masuk menambah stok lokal.
- Penyesuaian mengubah stok lokal dan membuat catatan riwayat.
- Stok tidak boleh menjadi negatif melalui alur transaksi normal.
- Stok di bawah/sama dengan minimum mendapatkan penanda visual.

### 5.5 Laporan Penjualan
Wajib:
- Laporan harian, mingguan, dan bulanan.
- Detail setiap transaksi.
- Ringkasan omzet/pendapatan dan jumlah transaksi.
- Estimasi laba kotor berdasarkan harga modal dummy.
- Produk terlaris.
- Filter tanggal dan pencarian transaksi.
- Ekspor laporan ke PDF atau Excel dalam konteks front-end. Jika ekspor file diimplementasikan, gunakan data dummy dan library front-end yang sesuai; jangan membuat layanan server.

Kriteria penerimaan:
- Filter mengubah daftar/ringkasan lokal.
- Detail transaksi dapat dibuka dari tabel.
- Laporan menyebut laba sebagai estimasi laba kotor, bukan laba bersih.
- Aksi ekspor menghasilkan file lokal atau memberi penjelasan jika hanya berupa mock UI; jangan berpura-pura mengekspor.

### 5.6 WhatsApp Gateway — simulasi UI
Wajib:
- Konfigurasi nomor WhatsApp penerima dummy.
- Toggle/pilihan notifikasi transaksi ke pemilik.
- Ringkasan omzet harian.
- Peringatan stok menipis.
- Struk digital kepada pelanggan jika nomor tersedia.
- Notifikasi pencatatan barang masuk.
- Riwayat pesan dengan waktu, penerima tersamarkan/dummy, jenis pesan, dan status simulasi.

Kriteria penerimaan:
- Semua pengiriman diberi label “Simulasi” dan tidak memanggil API eksternal.
- Status seperti “Terkirim”, “Menunggu”, atau “Gagal” adalah status dummy.
- Nomor ditampilkan sebagai data contoh; jangan memasukkan nomor pribadi nyata.

### 5.7 Manajemen Pengguna dan Hak Akses — simulasi UI
Wajib:
- Tampilan login/logout sebagai demonstrasi jika diperlukan oleh alur prototipe.
- Daftar dan form akun pengguna dummy.
- Role Pemilik/Admin dan Kasir.
- Pembatasan tampilan menu/aksi sesuai role yang sedang dipilih di demo.
- Form perubahan kata sandi simulasi tanpa menyimpan kata sandi nyata.
- Riwayat aktivitas penting pengguna.

Kriteria penerimaan:
- Perubahan role demo mengubah menu/aksi yang tampak.
- Tidak meminta atau menyimpan kredensial nyata.
- Ada label bahwa autentikasi dan otorisasi hanya simulasi.

## 6. Kebutuhan nonfungsional
- React + Vite, JavaScript/JSX, CSS modular atau satu stylesheet terstruktur sesuai pola proyek.
- Responsif untuk desktop, tablet, dan ponsel.
- Aksesibilitas dasar: label form, navigasi keyboard, fokus terlihat, kontras yang layak, teks alternatif, dan reduced-motion.
- Antarmuka berbahasa Indonesia dengan format mata uang IDR.
- Komponen dan data dipisahkan secara wajar.
- Tidak menambah dependency tanpa kebutuhan jelas.
- Tidak menggunakan secrets, token, nomor pribadi, atau data nyata.
- Hindari duplikasi data; gunakan satu sumber data dummy untuk metrik dan operasi lokal.
- Tidak ada error console yang diketahui pada alur utama setelah build/test dilakukan.

## 7. Prinsip data dummy
- Simpan fixture di folder seperti `src/data/` atau pola yang sudah ada.
- Tandai data sebagai dummy di UI dan README.
- Interaksi boleh memperbarui state lokal selama sesi.
- Refresh halaman boleh mengembalikan data awal; jangan menyatakan persistensi permanen.
- Jangan mengirim data keluar perangkat atau membuat network request untuk data bisnis.
- Dataset harus koheren: harga, stok, transaksi, total, dan laba harus masuk akal satu sama lain.

## 8. Definisi selesai
Sebuah modul dinyatakan selesai jika:
1. Fitur sesuai scope tampil dan dapat dicoba pada browser.
2. State, validasi, pencarian, filter, dan feedback yang dijanjikan berfungsi lokal.
3. Layout responsif dan aksesibilitas dasar diperhatikan.
4. Tidak ada backend/integrasi nyata yang dibuat.
5. `npm run build` berhasil, atau kegagalan dijelaskan dengan tepat.
6. Hasil diringkas dengan file utama, cara menguji, batasan, dan gerbang persetujuan berikutnya.
