# AGENTS.md — Kontrak Eksekusi Proyek
## POS Web Warung Klontong Haji Lubis

Dokumen ini adalah kontrak wajib bagi coding agent, developer, dan assistant yang mengubah repository.

## 1. Authority dan urutan prioritas
1. Instruksi eksplisit terbaru dari pengguna.
2. `PRD.md` untuk kebutuhan dan scope.
3. `UI-GUIDELINE.md` untuk tampilan dan interaksi.
4. `IMPLEMENTATION_PLAN.md` untuk urutan fase dan gerbang.
5. Struktur dan konvensi repository yang sudah ada.
Jika terdapat konflik, jangan menebak keputusan produk yang besar; jelaskan konflik dan minta keputusan pengguna.

## 2. Kontrak fase
- Kerjakan hanya fase yang secara eksplisit disetujui pengguna.
- Persetujuan menyelesaikan SOT bukan persetujuan otomatis untuk melewati seluruh gerbang implementasi.
- Di akhir setiap fase, berhenti dan berikan laporan. Jangan memulai fase selanjutnya sebelum persetujuan eksplisit.
- Jangan melakukan pekerjaan di luar PRD atau menambah fitur baru karena dianggap menarik.
- Jangan mengubah tujuan proyek atau stack tanpa persetujuan.
- Jangan mengklaim pekerjaan selesai jika belum dilakukan atau belum diuji.

## 3. Stack dan batas teknis
- Front-end: React + Vite.
- Bahasa: JavaScript/JSX dan CSS mengikuti pola repository yang ada.
- Data: dummy lokal saja.
- Gunakan dependency yang sudah ada terlebih dahulu.
- Jangan menambahkan backend, server API, database, auth nyata, provider WhatsApp, payment gateway, atau integrasi eksternal.
- Jangan mengirim data dummy atau data pengguna ke layanan luar.
- Jangan menambahkan file `.env` berisi secrets; jangan pernah meminta token/API key.
- Jangan memasukkan data pribadi nyata. Semua nomor telepon, nama pelanggan, dan aktivitas harus dummy.

## 4. Coding practices
- Inspeksi repository sebelum melakukan perubahan; jangan menimpa pekerjaan yang sudah ada tanpa memahami fungsinya.
- Buat perubahan terarah, modular, dan sekecil yang layak.
- Gunakan komponen reusable bila membantu; hindari abstraksi yang tidak perlu.
- Pisahkan fixture/data dari presentasi.
- Hindari duplikasi perhitungan harga, total, stok, dan laba.
- Pastikan perhitungan uang menggunakan angka integer rupiah, bukan floating-point untuk nominal mata uang.
- Validasi input di sisi klien; jangan menganggap validasi klien sebagai keamanan produksi.
- Jangan meninggalkan tombol yang tampak aktif tetapi tidak bekerja. Jika belum didukung, tandai sebagai belum tersedia atau nonaktifkan.
- Jangan menambahkan dependensi hanya untuk tugas sederhana yang dapat dilakukan dengan API/browser yang sudah ada.
- Gunakan elemen semantik, label form, aria-label untuk icon button, focus-visible, dan dukungan reduced-motion.
- Hormati gaya kode repository yang ada.

## 5. Aturan domain
- Transaksi hanya berhasil jika keranjang valid, kuantitas masuk akal, dan uang bayar mencukupi.
- Stok berkurang hanya setelah transaksi simulasi berhasil.
- Stok tidak boleh negatif pada alur transaksi normal.
- Pembatalan transaksi memerlukan role demo yang berhak, konfirmasi, dan catatan UI.
- Estimasi laba kotor = penjualan dikurangi harga modal item yang terjual; jangan menyebut laba bersih.
- Semua status WhatsApp bersifat simulasi, bukan status provider.
- Role Pemilik/Admin dan Kasir hanya simulasi front-end.
- Data dapat reset saat refresh kecuali localStorage telah disetujui dan diterapkan.

## 6. UX dan desain
- Ikuti UI-GUIDELINE.md: brand merah/biru/putih, navy untuk struktur, layout modern SaaS yang bersih.
- Bahasa antarmuka Bahasa Indonesia.
- Selalu sediakan indikator “Data simulasi/Mode demo”.
- Hindari dekorasi berlebihan dan utamakan alur kasir.
- Semua menu yang dijanjikan harus membuka halaman atau status yang jelas.
- Form memiliki validasi dan feedback; destructive action memakai konfirmasi.
- Uji responsive behavior untuk desktop, tablet, dan ponsel.

## 7. Verifikasi wajib
Setelah perubahan bermakna:
- Jalankan `npm run build` jika lingkungan memungkinkan.
- Jalankan lint/test script jika tersedia.
- Jika tool/browser testing tersedia, uji alur utama.
- Jika verifikasi tidak dapat dijalankan, nyatakan secara spesifik; jangan menulis “semua test lolos”.
- Laporkan error yang diketahui, bukan menyembunyikannya.

## 8. Output pada akhir setiap fase
Berikan ringkasan singkat:
- Perubahan dan file utama.
- Cara menjalankan.
- Pengujian yang benar-benar dilakukan beserta hasilnya.
- Acceptance criteria yang belum terpenuhi.
- Batasan prototipe.
- Minta persetujuan eksplisit untuk fase berikutnya.

## 9. Definition of done
Satu fase hanya selesai jika deliverable fase tersebut tersedia, acceptance criteria fase diperiksa, keterbatasan dilaporkan, dan pengguna mendapat ringkasan. Pekerjaan yang belum diverifikasi tidak boleh disebut lolos.

## 10. Hal yang dilarang
- Backend/API/database atau integrasi WhatsApp nyata tanpa persetujuan scope baru.
- Mengubah stack tanpa persetujuan.
- Menambahkan fitur di luar SOT.
- Menyatakan data dummy sebagai data real.
- Mengklaim pengiriman pesan, login, keamanan, penyimpanan permanen, ekspor, atau build sukses tanpa bukti.
- Melanjutkan fase berikutnya secara otomatis.
