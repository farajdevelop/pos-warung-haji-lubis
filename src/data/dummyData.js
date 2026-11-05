/**
 * Dataset Dummy Terpusat — POS Warung Klontong Haji Lubis
 * Semua data bersifat simulasi lokal untuk keperluan prototipe.
 */

export const DEMO_INFO = {
  storeName: 'Warung Klontong Haji Lubis',
  storeTagline: 'Sistem POS & Manajemen Warung Modern',
  address: 'Jl. Merdeka No. 45, Tebet, Jakarta Selatan',
  phoneDemo: '0812-9876-5432 (Simulasi)',
  version: '1.2.0-fase4-analitik',
  isDemo: true
};

export const CATEGORIES = [
  'Semua',
  'Sembako',
  'Minuman',
  'Makanan Ringan',
  'Bumbu & Dapur',
  'Perlengkapan Rumah'
];

export const INITIAL_PRODUCTS = [
  {
    id: 'PRD-001',
    code: 'SMB-001',
    barcode: '8992753210011',
    name: 'Beras Rojolele Super 5kg',
    category: 'Sembako',
    costPrice: 65000,
    sellingPrice: 72000,
    stock: 18,
    minStock: 5,
    unit: 'karung'
  },
  {
    id: 'PRD-002',
    code: 'SMB-002',
    barcode: '8998866100223',
    name: 'Minyak Goreng Bimoli 2L',
    category: 'Sembako',
    costPrice: 32000,
    sellingPrice: 36000,
    stock: 8,
    minStock: 5,
    unit: 'pouch'
  },
  {
    id: 'PRD-003',
    code: 'SMB-003',
    barcode: '8993175110034',
    name: 'Gula Pasir Gulaku 1kg',
    category: 'Sembako',
    costPrice: 15500,
    sellingPrice: 17500,
    stock: 4,
    minStock: 6, // Low stock warning!
    unit: 'bungkus'
  },
  {
    id: 'PRD-004',
    code: 'MNM-001',
    barcode: '8886008101053',
    name: 'Aqua Botol 600ml',
    category: 'Minuman',
    costPrice: 2800,
    sellingPrice: 4000,
    stock: 42,
    minStock: 12,
    unit: 'botol'
  },
  {
    id: 'PRD-005',
    code: 'MNM-002',
    barcode: '8996001414012',
    name: 'Teh Botol Sosro Kotak 250ml',
    category: 'Minuman',
    costPrice: 3000,
    sellingPrice: 4500,
    stock: 26,
    minStock: 10,
    unit: 'kotak'
  },
  {
    id: 'PRD-006',
    code: 'MKN-001',
    barcode: '8996001301015',
    name: 'Indomie Goreng Original 85g',
    category: 'Makanan Ringan',
    costPrice: 2750,
    sellingPrice: 3500,
    stock: 75,
    minStock: 20,
    unit: 'bungkus'
  },
  {
    id: 'PRD-007',
    code: 'MKN-002',
    barcode: '8996001301022',
    name: 'Indomie Ayam Bawang 75g',
    category: 'Makanan Ringan',
    costPrice: 2700,
    sellingPrice: 3500,
    stock: 3,
    minStock: 15, // Low stock warning!
    unit: 'bungkus'
  },
  {
    id: 'PRD-008',
    code: 'BMB-001',
    barcode: '8992745110291',
    name: 'Kecap Bango Manis 550ml Refill',
    category: 'Bumbu & Dapur',
    costPrice: 21500,
    sellingPrice: 24500,
    stock: 12,
    minStock: 4,
    unit: 'pouch'
  },
  {
    id: 'PRD-009',
    code: 'BMB-002',
    barcode: '8991002102018',
    name: 'Garam Dapur Beriodium Cap Kapal 250g',
    category: 'Bumbu & Dapur',
    costPrice: 2000,
    sellingPrice: 3000,
    stock: 2,
    minStock: 5, // Low stock warning!
    unit: 'bungkus'
  },
  {
    id: 'PRD-010',
    code: 'PLK-001',
    barcode: '8992772010112',
    name: 'Sabun Cuci Piring Sunlight Jeruk Nipis 750ml',
    category: 'Perlengkapan Rumah',
    costPrice: 14500,
    sellingPrice: 17000,
    stock: 14,
    minStock: 5,
    unit: 'pouch'
  }
];

// Data penjualan 7 hari terakhir untuk grafik dashboard (simulasi konsisten)
export const SALES_7_DAYS = [
  { day: 'Sab, 10 Okt', sales: 1250000, profit: 245000, count: 42 },
  { day: 'Min, 11 Okt', sales: 1680000, profit: 320000, count: 58 },
  { day: 'Sen, 12 Okt', sales: 940000, profit: 185000, count: 31 },
  { day: 'Sel, 13 Okt', sales: 1120000, profit: 210000, count: 39 },
  { day: 'Rab, 14 Okt', sales: 1350000, profit: 260000, count: 46 },
  { day: 'Kam, 15 Okt', sales: 1420000, profit: 275000, count: 49 },
  { day: 'Hari ini', sales: 875000, profit: 168000, count: 28 }
];

export const SALES_4_WEEKS = [
  { week: 'Minggu 1 (20-26 Sep)', sales: 7850000, profit: 1520000, count: 265 },
  { week: 'Minggu 2 (27 Sep-3 Okt)', sales: 8640000, profit: 1680000, count: 298 },
  { week: 'Minggu 3 (4-10 Okt)', sales: 8920000, profit: 1740000, count: 312 },
  { week: 'Minggu 4 (11-16 Okt)', sales: 7385000, profit: 1418000, count: 251 }
];

export const INITIAL_TRANSACTIONS = [
  // Hari Ini (16 Okt 2026)
  {
    id: 'TRX-20261016-001',
    time: '2026-10-16T12:45:00',
    customer: 'Pelanggan Umum',
    cashier: 'Siti Rahma (Kasir)',
    items: [
      { id: 'PRD-001', name: 'Beras Rojolele Super 5kg', qty: 1, costPrice: 65000, price: 72000, subtotal: 72000, unit: 'karung' },
      { id: 'PRD-002', name: 'Minyak Goreng Bimoli 2L', qty: 1, costPrice: 32000, price: 36000, subtotal: 36000, unit: 'pouch' }
    ],
    total: 108000,
    cash: 120000,
    change: 12000,
    paymentMethod: 'Tunai',
    status: 'Selesai'
  },
  {
    id: 'TRX-20261016-002',
    time: '2026-10-16T12:15:00',
    customer: 'Ibu Fatimah',
    cashier: 'Siti Rahma (Kasir)',
    items: [
      { id: 'PRD-006', name: 'Indomie Goreng Original 85g', qty: 5, costPrice: 2750, price: 3500, subtotal: 17500, unit: 'bungkus' },
      { id: 'PRD-004', name: 'Aqua Botol 600ml', qty: 2, costPrice: 2800, price: 4000, subtotal: 8000, unit: 'botol' }
    ],
    total: 25500,
    cash: 50000,
    change: 24500,
    paymentMethod: 'Tunai',
    status: 'Selesai'
  },
  {
    id: 'TRX-20261016-003',
    time: '2026-10-16T11:30:00',
    customer: 'Pak Ahmad',
    cashier: 'Haji Lubis (Pemilik)',
    items: [
      { id: 'PRD-008', name: 'Kecap Bango Manis 550ml Refill', qty: 1, costPrice: 21500, price: 24500, subtotal: 24500, unit: 'pouch' },
      { id: 'PRD-010', name: 'Sabun Cuci Piring Sunlight 750ml', qty: 1, costPrice: 14500, price: 17000, subtotal: 17000, unit: 'pouch' }
    ],
    total: 41500,
    cash: 50000,
    change: 8500,
    paymentMethod: 'Tunai',
    status: 'Selesai'
  },
  {
    id: 'TRX-20261016-004',
    time: '2026-10-16T10:05:00',
    customer: 'Pelanggan Umum',
    cashier: 'Siti Rahma (Kasir)',
    items: [
      { id: 'PRD-005', name: 'Teh Botol Sosro Kotak 250ml', qty: 3, costPrice: 3000, price: 4500, subtotal: 13500, unit: 'kotak' }
    ],
    total: 13500,
    cash: 20000,
    change: 6500,
    paymentMethod: 'Tunai',
    status: 'Selesai'
  },

  // Kemarin (15 Okt 2026)
  {
    id: 'TRX-20261015-001',
    time: '2026-10-15T18:20:00',
    customer: 'Ibu Ratna',
    cashier: 'Siti Rahma (Kasir)',
    items: [
      { id: 'PRD-001', name: 'Beras Rojolele Super 5kg', qty: 1, costPrice: 65000, price: 72000, subtotal: 72000, unit: 'karung' },
      { id: 'PRD-003', name: 'Gula Pasir Gulaku 1kg', qty: 2, costPrice: 15500, price: 17500, subtotal: 35000, unit: 'bungkus' }
    ],
    total: 107000,
    cash: 110000,
    change: 3000,
    paymentMethod: 'Tunai',
    status: 'Selesai'
  },
  {
    id: 'TRX-20261015-002',
    time: '2026-10-15T14:10:00',
    customer: 'Bang Joko',
    cashier: 'Haji Lubis (Pemilik)',
    items: [
      { id: 'PRD-006', name: 'Indomie Goreng Original 85g', qty: 10, costPrice: 2750, price: 3500, subtotal: 35000, unit: 'bungkus' },
      { id: 'PRD-007', name: 'Indomie Ayam Bawang 75g', qty: 5, costPrice: 2700, price: 3500, subtotal: 17500, unit: 'bungkus' }
    ],
    total: 52500,
    cash: 100000,
    change: 47500,
    paymentMethod: 'Tunai',
    status: 'Selesai'
  },

  // 14 Okt 2026
  {
    id: 'TRX-20261014-001',
    time: '2026-10-14T16:45:00',
    customer: 'Pak Bambang',
    cashier: 'Siti Rahma (Kasir)',
    items: [
      { id: 'PRD-002', name: 'Minyak Goreng Bimoli 2L', qty: 2, costPrice: 32000, price: 36000, subtotal: 72000, unit: 'pouch' },
      { id: 'PRD-008', name: 'Kecap Bango Manis 550ml Refill', qty: 1, costPrice: 21500, price: 24500, subtotal: 24500, unit: 'pouch' }
    ],
    total: 96500,
    cash: 100000,
    change: 3500,
    paymentMethod: 'Tunai',
    status: 'Selesai'
  },

  // 12 Okt 2026 (Transaksi Dibatalkan)
  {
    id: 'TRX-20261012-003',
    time: '2026-10-12T11:10:00',
    customer: 'Pelanggan Umum',
    cashier: 'Siti Rahma (Kasir)',
    items: [
      { id: 'PRD-001', name: 'Beras Rojolele Super 5kg', qty: 1, costPrice: 65000, price: 72000, subtotal: 72000, unit: 'karung' }
    ],
    total: 72000,
    cash: 100000,
    change: 28000,
    paymentMethod: 'Tunai',
    status: 'Dibatalkan',
    canceledAt: '2026-10-12T11:15:00',
    canceledBy: 'Haji Lubis (Pemilik)',
    cancelReason: 'Uang pembeli ternyata kurang'
  },

  // Awal Bulan (5 Okt 2026)
  {
    id: 'TRX-20261005-001',
    time: '2026-10-05T09:30:00',
    customer: 'Ibu Dewi',
    cashier: 'Haji Lubis (Pemilik)',
    items: [
      { id: 'PRD-001', name: 'Beras Rojolele Super 5kg', qty: 2, costPrice: 65000, price: 72000, subtotal: 144000, unit: 'karung' },
      { id: 'PRD-002', name: 'Minyak Goreng Bimoli 2L', qty: 2, costPrice: 32000, price: 36000, subtotal: 72000, unit: 'pouch' },
      { id: 'PRD-003', name: 'Gula Pasir Gulaku 1kg', qty: 3, costPrice: 15500, price: 17500, subtotal: 52500, unit: 'bungkus' }
    ],
    total: 268500,
    cash: 300000,
    change: 31500,
    paymentMethod: 'Tunai',
    status: 'Selesai'
  }
];

export const INITIAL_STOCK_MUTATIONS = [
  {
    id: 'MUT-001',
    time: '2026-10-16T12:45:00',
    productId: 'PRD-001',
    productName: 'Beras Rojolele Super 5kg',
    type: 'Penjualan POS',
    qty: -1,
    finalStock: 18,
    actor: 'Siti Rahma (Kasir)',
    notes: 'Struk TRX-20261016-001'
  },
  {
    id: 'MUT-002',
    time: '2026-10-16T12:45:00',
    productId: 'PRD-002',
    productName: 'Minyak Goreng Bimoli 2L',
    type: 'Penjualan POS',
    qty: -1,
    finalStock: 8,
    actor: 'Siti Rahma (Kasir)',
    notes: 'Struk TRX-20261016-001'
  },
  {
    id: 'MUT-003',
    time: '2026-10-16T12:15:00',
    productId: 'PRD-006',
    productName: 'Indomie Goreng Original 85g',
    type: 'Penjualan POS',
    qty: -5,
    finalStock: 75,
    actor: 'Siti Rahma (Kasir)',
    notes: 'Struk TRX-20261016-002'
  },
  {
    id: 'MUT-004',
    time: '2026-10-16T09:00:00',
    productId: 'PRD-001',
    productName: 'Beras Rojolele Super 5kg',
    type: 'Barang Masuk',
    qty: 10,
    finalStock: 19,
    actor: 'Haji Lubis (Pemilik)',
    notes: 'Kulakan Agen Beras Cipinang'
  },
  {
    id: 'MUT-005',
    time: '2026-10-16T08:30:00',
    productId: 'PRD-004',
    productName: 'Aqua Botol 600ml',
    type: 'Barang Masuk',
    qty: 24,
    finalStock: 44,
    actor: 'Haji Lubis (Pemilik)',
    notes: 'Pengiriman Distributor Danone'
  },
  {
    id: 'MUT-006',
    time: '2026-10-15T16:00:00',
    productId: 'PRD-007',
    productName: 'Indomie Ayam Bawang 75g',
    type: 'Penyesuaian Fisik',
    qty: -2,
    finalStock: 3,
    actor: 'Haji Lubis (Pemilik)',
    notes: 'Kemasan rusak digigit tikus'
  }
];

export const DEMO_USERS = [
  {
    id: 'USR-001',
    name: 'Haji Lubis',
    username: 'admin',
    role: 'Pemilik/Admin',
    email: 'haji.lubis@warungdemo.id',
    phone: '0812-1111-2222 (Demo)',
    status: 'Aktif',
    lastLogin: '2026-10-16T12:00:00'
  },
  {
    id: 'USR-002',
    name: 'Siti Rahma',
    username: 'kasir',
    role: 'Kasir',
    email: 'siti.kasir@warungdemo.id',
    phone: '0813-3333-4444 (Demo)',
    status: 'Aktif',
    lastLogin: '2026-10-16T08:00:00'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-001',
    time: '2026-10-16T12:45:10',
    actor: 'Siti Rahma',
    role: 'Kasir',
    action: 'Transaksi Kasir POS',
    details: 'Menyelesaikan transaksi TRX-20261016-001 senilai Rp 84.500 (Tunai)',
    badgeClass: 'badge-success'
  },
  {
    id: 'AUD-002',
    time: '2026-10-16T11:30:00',
    actor: 'Haji Lubis',
    role: 'Pemilik/Admin',
    action: 'Transaksi Kasir POS',
    details: 'Menyelesaikan transaksi TRX-20261016-003 senilai Rp 41.500 (Tunai)',
    badgeClass: 'badge-success'
  },
  {
    id: 'AUD-003',
    time: '2026-10-16T09:00:00',
    actor: 'Haji Lubis',
    role: 'Pemilik/Admin',
    action: 'Pencatatan Barang Masuk',
    details: 'Restok Beras Rojolele Super 5kg (+10 karung) dari Agen Beras Cipinang',
    badgeClass: 'badge-info'
  },
  {
    id: 'AUD-004',
    time: '2026-10-16T08:00:00',
    actor: 'Siti Rahma',
    role: 'Kasir',
    action: 'Login ke Sistem',
    details: 'Masuk shift pagi kasir (IP lokal peramban)',
    badgeClass: 'badge-primary'
  },
  {
    id: 'AUD-005',
    time: '2026-10-15T21:05:00',
    actor: 'Haji Lubis',
    role: 'Pemilik/Admin',
    action: 'Tutup Shift Harian',
    details: 'Pemeriksaan laporan omzet harian Rp 159.500 dan estimasi laba',
    badgeClass: 'badge-warning'
  }
];

export const DEMO_WHATSAPP_CONFIG = {
  activeNumber: '0812-9876-5432',
  ownerName: 'Haji Lubis (Pemilik)',
  gatewayStatus: 'Terhubung (Simulasi Lokal)',
  notifyOwnerOnSale: true,
  notifyDailySummary: true,
  notifyLowStock: true,
  notifyStockInbound: true,
  sendCustomerReceipt: true
};

export const INITIAL_WHATSAPP_LOGS = [
  {
    id: 'WA-MSG-101',
    time: '2026-10-16T12:45:10',
    type: 'Transaksi POS',
    recipientName: 'Haji Lubis (Pemilik)',
    recipientPhone: '0812-9876-5432',
    status: 'Terkirim',
    summary: 'Notifikasi Transaksi Baru TRX-20261016-001 (Rp 84.500)',
    content: `*WARUNG KLONTONG HAJI LUBIS*\n🔔 *NOTIFIKASI TRANSAKSI BARU*\n----------------------------------------\nNo. Struk : TRX-20261016-001\nWaktu     : 16/10/2026 12:45 WIB\nKasir     : Siti Rahma (Kasir)\nPelanggan : Pelanggan Umum\n\nRincian Belanja:\n• 1x Minyak Goreng Bimoli 2L (Rp 38.500)\n• 2x Terigu Segitiga Biru 1kg (Rp 26.000)\n• 1x Kopi Kapal Api Spesial Mix 10x25g (Rp 20.000)\n\n*Total Belanja : Rp 84.500*\nMetode Bayar  : Tunai\n----------------------------------------\n_Pesan otomatis simulasi POS Haji Lubis_`
  },
  {
    id: 'WA-MSG-102',
    time: '2026-10-16T11:32:05',
    type: 'Struk Digital',
    recipientName: 'Pak Ahmad',
    recipientPhone: '0856-7890-1234',
    status: 'Terkirim',
    summary: 'Struk Belanja Digital TRX-20261016-003 (Rp 41.500)',
    content: `*WARUNG KLONTONG HAJI LUBIS*\n🧾 *STRUK BELANJA DIGITAL*\nJl. Raya Penggilingan No. 42, Cakung\nTelp: 0812-9876-5432\n----------------------------------------\nNo: TRX-20261016-003\nTanggal: 16/10/2026 11:30 WIB\nPelanggan: Pak Ahmad\n\n• 1x Kecap Bango Manis 550ml (Rp 24.500)\n• 1x Sabun Cuci Piring Sunlight 750ml (Rp 17.000)\n\n*TOTAL: Rp 41.500*\nBayar: Rp 50.000\n*Kembalian: Rp 8.500*\n----------------------------------------\nTerima kasih telah berbelanja di Warung Haji Lubis! Simpan struk ini sebagai bukti transaksi sah.`
  },
  {
    id: 'WA-MSG-103',
    time: '2026-10-16T10:06:22',
    type: 'Peringatan Stok',
    recipientName: 'Haji Lubis (Pemilik)',
    recipientPhone: '0812-9876-5432',
    status: 'Terkirim',
    summary: 'Peringatan Stok Menipis: Indomie Ayam Bawang 75g sisa 3 bungkus',
    content: `*WARUNG KLONTONG HAJI LUBIS*\n⚠️ *PERINGATAN STOK MENIPIS*\n----------------------------------------\nKode Produk : PRD-007\nNama Produk : Indomie Ayam Bawang 75g\nStok Saat Ini: *3 bungkus*\nBatas Minimal: 5 bungkus\n\nStatus: *Stok Kritis / Menipis*\nDisarankan segera melakukan kulakan / restok ke agen Indofood.\n----------------------------------------\n_Sistem Notifikasi Otomatis POS Haji Lubis_`
  },
  {
    id: 'WA-MSG-104',
    time: '2026-10-15T21:00:00',
    type: 'Rekap Harian',
    recipientName: 'Haji Lubis (Pemilik)',
    recipientPhone: '0812-9876-5432',
    status: 'Terkirim',
    summary: 'Laporan Tutup Toko & Rekap Omzet Harian (15 Okt 2026)',
    content: `*WARUNG KLONTONG HAJI LUBIS*\n📊 *REKAP OMZET & PENJUALAN HARIAN*\nTanggal: 15 Oktober 2026 (Tutup Toko)\n----------------------------------------\nTotal Omzet     : *Rp 159.500*\nTotal Transaksi : *2 Transaksi*\nEstimasi Laba   : *Rp 20.000* (12.5%)\n\nProduk Terlaris Hari Ini:\n1. Indomie Goreng Original (10 bks)\n2. Indomie Ayam Bawang (5 bks)\n3. Gulaku 1kg (2 bks)\n\nKasir Bertugas : Siti Rahma & Haji Lubis\nStatus Toko    : Kas Ditutup (Seimbang)\n----------------------------------------\n_Laporan otomatis harian POS Haji Lubis_`
  }
];
