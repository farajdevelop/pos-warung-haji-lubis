import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Send,
  BellRing,
  Smartphone,
  Settings,
  Clock,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCheck,
  TrendingUp,
  Boxes,
  Receipt,
  RotateCcw,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatIDR, formatDateID } from '../utils/formatters';

export default function WhatsAppModule({ currentRole }) {
  const {
    waConfig,
    updateWaConfig,
    waLogs,
    sendSimulatedWaMessage,
    clearWaLogs,
    products,
    transactions,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('config'); // 'config' | 'simulator' | 'logs'
  const [copiedId, setCopiedId] = useState(null);

  // Form Config Local State
  const [formConfig, setFormConfig] = useState({
    activeNumber: waConfig.activeNumber || '0812-9876-5432',
    ownerName: waConfig.ownerName || 'Haji Lubis (Pemilik)',
    notifyOwnerOnSale: waConfig.notifyOwnerOnSale ?? true,
    notifyDailySummary: waConfig.notifyDailySummary ?? true,
    notifyLowStock: waConfig.notifyLowStock ?? true,
    notifyStockInbound: waConfig.notifyStockInbound ?? true,
    sendCustomerReceipt: waConfig.sendCustomerReceipt ?? true
  });

  // Simulator Local State
  const [selectedTemplate, setSelectedTemplate] = useState('omzet'); // 'omzet' | 'stok' | 'transaksi' | 'custom'
  const [simRecipient, setSimRecipient] = useState(waConfig.ownerName || 'Haji Lubis (Pemilik)');
  const [simPhone, setSimPhone] = useState(waConfig.activeNumber || '0812-9876-5432');
  const [simCustomText, setSimCustomText] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  // Logs Filter Local State
  const [logSearch, setLogSearch] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('Semua');
  const [selectedLogDetail, setSelectedLogDetail] = useState(null);

  // Handle Save Config
  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!formConfig.activeNumber.trim()) {
      showToast('Nomor WhatsApp pemilik tidak boleh kosong', 'danger');
      return;
    }
    updateWaConfig(formConfig);
  };

  // Generate Message Content based on selected template
  const generatedMessageText = useMemo(() => {
    const today = '2026-10-16';
    const nowTime = '13:10 WIB';

    if (selectedTemplate === 'omzet') {
      // Calculate today's sales and gross profit from transactions
      const todayTrx = transactions.filter(t => t.time.startsWith(today) && t.status !== 'Dibatalkan');
      const todayOmzet = todayTrx.reduce((sum, t) => sum + t.total, 0);
      const todayProfit = todayTrx.reduce((sum, t) => {
        const cost = t.items.reduce((c, i) => c + ((i.costPrice || 0) * i.qty), 0);
        return sum + (t.total - cost);
      }, 0);

      return `*WARUNG KLONTONG HAJI LUBIS*\n📊 *REKAP OMZET & PENJUALAN HARIAN*\nTanggal: 16 Oktober 2026 (Tutup Toko)\n----------------------------------------\nTotal Omzet     : *${formatIDR(todayOmzet)}*\nTotal Transaksi : *${todayTrx.length} Transaksi*\nEstimasi Laba   : *${formatIDR(todayProfit)}*\n\nKasir Bertugas : Siti Rahma & Haji Lubis\nStatus Toko    : Kas Seimbang (Tutup Kasir)\n----------------------------------------\n_Laporan otomatis harian POS Haji Lubis_`;
    }

    if (selectedTemplate === 'stok') {
      const lowStockItems = products.filter(p => p.stock <= p.minStock);
      const itemsList = lowStockItems.length > 0
        ? lowStockItems.map(p => `• ${p.name}: sisa *${p.stock} ${p.unit}* (min: ${p.minStock})`).join('\n')
        : '• Semua persediaan stok saat ini dalam batas aman.';

      return `*WARUNG KLONTONG HAJI LUBIS*\n⚠️ *PERINGATAN STOK MENIPIS*\nWaktu: 16/10/2026 ${nowTime}\n----------------------------------------\nDaftar Produk Kritis:\n${itemsList}\n\n*Rekomendasi:* Segera rencanakan pembelian / kulakan ke distributor.\n----------------------------------------\n_Notifikasi otomatis sistem POS Haji Lubis_`;
    }

    if (selectedTemplate === 'transaksi') {
      const lastTrx = transactions[0];
      if (lastTrx) {
        const itemsText = lastTrx.items.map(i => `• ${i.qty}x ${i.name} (${formatIDR(i.subtotal)})`).join('\n');
        return `*WARUNG KLONTONG HAJI LUBIS*\n🔔 *NOTIFIKASI TRANSAKSI BARU*\n----------------------------------------\nNo. Struk : ${lastTrx.id}\nWaktu     : ${formatDateID(lastTrx.time, true)}\nKasir     : ${lastTrx.cashier}\nPelanggan : ${lastTrx.customer}\n\nRincian Belanja:\n${itemsText}\n\n*Total Belanja : ${formatIDR(lastTrx.total)}*\nMetode Bayar  : ${lastTrx.paymentMethod}\n----------------------------------------\n_Pesan otomatis simulasi POS Haji Lubis_`;
      }
      return `*WARUNG KLONTONG HAJI LUBIS*\n🔔 *NOTIFIKASI TRANSAKSI BARU*\nBelum ada transaksi pada sesi ini.`;
    }

    return simCustomText || `*WARUNG KLONTONG HAJI LUBIS*\nKetik pesan kustom Anda pada kotak input di bawah.`;
  }, [selectedTemplate, simCustomText, transactions, products]);

  // Handle Send Simulated Message from Simulator
  const handleSendSimulatorMessage = () => {
    setIsSimulating(true);

    setTimeout(() => {
      let typeLabel = 'Pesan Kustom';
      if (selectedTemplate === 'omzet') typeLabel = 'Rekap Harian';
      else if (selectedTemplate === 'stok') typeLabel = 'Peringatan Stok';
      else if (selectedTemplate === 'transaksi') typeLabel = 'Transaksi POS';

      sendSimulatedWaMessage({
        recipientName: simRecipient,
        recipientPhone: simPhone,
        type: typeLabel,
        summary: `${typeLabel} dikirim ke ${simRecipient}`,
        content: generatedMessageText,
        status: 'Terkirim'
      });

      setIsSimulating(false);
      showToast(`Pesan simulasi ${typeLabel} berhasil dicatat ke riwayat log!`, 'success');
      setActiveTab('logs');
    }, 700);
  };

  // Quick Action Triggers
  const handleTriggerDailySummary = () => {
    const today = '2026-10-16';
    const todayTrx = transactions.filter(t => t.time.startsWith(today) && t.status !== 'Dibatalkan');
    const todayOmzet = todayTrx.reduce((sum, t) => sum + t.total, 0);
    const todayProfit = todayTrx.reduce((sum, t) => {
      const cost = t.items.reduce((c, i) => c + ((i.costPrice || 0) * i.qty), 0);
      return sum + (t.total - cost);
    }, 0);

    const content = `*WARUNG KLONTONG HAJI LUBIS*\n📊 *REKAP OMZET & PENJUALAN HARIAN*\nTanggal: 16 Oktober 2026 (Tutup Toko)\n----------------------------------------\nTotal Omzet     : *${formatIDR(todayOmzet)}*\nTotal Transaksi : *${todayTrx.length} Transaksi*\nEstimasi Laba   : *${formatIDR(todayProfit)}*\n\nKasir Bertugas : Siti Rahma & Haji Lubis\nStatus Toko    : Kas Seimbang (Tutup Kasir)\n----------------------------------------\n_Laporan otomatis harian POS Haji Lubis_`;

    sendSimulatedWaMessage({
      recipientName: waConfig.ownerName || 'Haji Lubis (Pemilik)',
      recipientPhone: waConfig.activeNumber,
      type: 'Rekap Harian',
      summary: `Rekap Omzet Harian (${formatIDR(todayOmzet)}) ke Pemilik`,
      content
    });

    showToast('Simulasi pengiriman rekap omzet harian ke pemilik berhasil!', 'success');
    setActiveTab('logs');
  };

  const handleTriggerLowStockAlert = () => {
    const lowStockItems = products.filter(p => p.stock <= p.minStock);
    const itemsList = lowStockItems.length > 0
      ? lowStockItems.map(p => `• ${p.name}: sisa *${p.stock} ${p.unit}* (min: ${p.minStock})`).join('\n')
      : '• Semua stok saat ini aman.';

    const content = `*WARUNG KLONTONG HAJI LUBIS*\n⚠️ *PERINGATAN STOK MENIPIS*\nWaktu: 16/10/2026 13:10 WIB\n----------------------------------------\nDaftar Produk Kritis:\n${itemsList}\n\n*Rekomendasi:* Segera rencanakan pembelian / kulakan ke distributor.\n----------------------------------------\n_Notifikasi otomatis sistem POS Haji Lubis_`;

    sendSimulatedWaMessage({
      recipientName: waConfig.ownerName || 'Haji Lubis (Pemilik)',
      recipientPhone: waConfig.activeNumber,
      type: 'Peringatan Stok',
      summary: `Peringatan ${lowStockItems.length} produk stok kritis ke Pemilik`,
      content
    });

    showToast('Simulasi notifikasi stok menipis berhasil dicatat ke log!', 'warning');
    setActiveTab('logs');
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return waLogs.filter(log => {
      const matchType = logTypeFilter === 'Semua' || log.type === logTypeFilter;
      const q = logSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        log.recipientName.toLowerCase().includes(q) ||
        log.recipientPhone.includes(q) ||
        log.summary.toLowerCase().includes(q) ||
        log.content.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [waLogs, logTypeFilter, logSearch]);

  const copyMessage = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Teks pesan disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="module-view">
      {/* Module Header */}
      <div className="module-header-box">
        <div className="module-icon-wrap icon-green">
          <MessageSquare size={24} />
        </div>
        <div>
          <div className="module-phase-tag phase-active">Fase 5 Aktif — Simulasi Front-End</div>
          <h2 className="module-title">Simulasi WhatsApp Gateway Warung</h2>
          <p className="module-desc">
            Visualisasi notifikasi otomatis ke WhatsApp pemilik warung untuk transaksi kasir, rekap omzet tutup toko, peringatan stok menipis, dan pengiriman struk digital pelanggan.
          </p>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div className="demo-alert-banner">
        <AlertTriangle size={18} className="alert-icon" />
        <div className="alert-text">
          <strong>Mode Simulasi Front-End (Tanpa WhatsApp API / Biaya):</strong> Fitur ini murni simulasi lokal pada peramban. Tidak ada biaya pesan, webhook, ataupun nomor ponsel sungguhan yang dihubungi. Semua pesan tercatat pada memori sesi lokal.
        </div>
      </div>

      {/* Quick Status Bar & Actions */}
      <div className="wa-status-card">
        <div className="wa-status-left">
          <div className="wa-status-indicator">
            <span className="wa-pulse-dot"></span>
            <div>
              <span className="wa-status-label">Status Gateway Simulasi:</span>
              <strong className="wa-status-text">Terhubung (Local Mock)</strong>
            </div>
          </div>
          <div className="wa-status-phone">
            <span>Nomor Penerima Pemilik:</span>
            <strong>{waConfig.activeNumber}</strong>
          </div>
        </div>

        <div className="wa-quick-actions">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleTriggerDailySummary}
            title="Simulasikan kirim rekap omzet harian ke WhatsApp pemilik sekarang"
          >
            <TrendingUp size={14} />
            <span>Kirim Rekap Omzet</span>
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={handleTriggerLowStockAlert}
            title="Simulasikan kirim peringatan stok menipis ke WhatsApp pemilik"
          >
            <Boxes size={14} />
            <span>Kirim Alert Stok</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <Settings size={16} />
          <span>Pengaturan Notifikasi</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          <Smartphone size={16} />
          <span>Simulator & Preview Chat</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <Clock size={16} />
          <span>Riwayat Log Pesan</span>
          <span className="tab-badge">{waLogs.length}</span>
        </button>
      </div>

      {/* TAB 1: PENGATURAN NOTIFIKASI */}
      {activeTab === 'config' && (
        <div className="wa-tab-content">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Konfigurasi Nomor Pemilik & Pilihan Otomatis</h3>
                <p className="panel-desc">Atur nomor WhatsApp tujuan dan kejadian apa saja yang memicu notifikasi otomatis</p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="wa-config-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">
                    Nomor WhatsApp Pemilik (Nomor Contoh Dummy) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: 0812-9876-5432"
                    value={formConfig.activeNumber}
                    onChange={(e) => setFormConfig({ ...formConfig, activeNumber: e.target.value })}
                    required
                  />
                  <span className="form-help">Nomor fiktif/dummy yang menerima laporan operasional toko</span>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Nama Pemilik Toko</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formConfig.ownerName}
                    onChange={(e) => setFormConfig({ ...formConfig, ownerName: e.target.value })}
                  />
                  <span className="form-help">Nama pemilik yang tertera pada pesan sambutan</span>
                </div>
              </div>

              <div className="wa-toggles-section">
                <h4 className="wa-section-heading">Notifikasi Otomatis Terhubung ke Sistem:</h4>

                <div className="wa-toggle-grid">
                  <label className="wa-toggle-card">
                    <input
                      type="checkbox"
                      checked={formConfig.notifyOwnerOnSale}
                      onChange={(e) => setFormConfig({ ...formConfig, notifyOwnerOnSale: e.target.checked })}
                    />
                    <div className="wa-toggle-content">
                      <div className="wa-toggle-title">
                        <Receipt size={16} className="text-primary" />
                        <strong>Notifikasi Setiap Transaksi Kasir</strong>
                      </div>
                      <p>Kirim rincian struk belanja dan nominal pembayaran ke WhatsApp pemilik secara instan saat kasir menekan tombol bayar di POS.</p>
                    </div>
                  </label>

                  <label className="wa-toggle-card">
                    <input
                      type="checkbox"
                      checked={formConfig.notifyDailySummary}
                      onChange={(e) => setFormConfig({ ...formConfig, notifyDailySummary: e.target.checked })}
                    />
                    <div className="wa-toggle-content">
                      <div className="wa-toggle-title">
                        <TrendingUp size={16} className="text-success" />
                        <strong>Rekap Omzet & Laba Harian (Tutup Toko)</strong>
                      </div>
                      <p>Kirim rangkuman total pendapatan, estimasi laba kotor, dan total transaksi harian setiap penutupan shift kasir / toko.</p>
                    </div>
                  </label>

                  <label className="wa-toggle-card">
                    <input
                      type="checkbox"
                      checked={formConfig.notifyLowStock}
                      onChange={(e) => setFormConfig({ ...formConfig, notifyLowStock: e.target.checked })}
                    />
                    <div className="wa-toggle-content">
                      <div className="wa-toggle-title">
                        <AlertTriangle size={16} className="text-warning" />
                        <strong>Peringatan Dini Stok Menipis</strong>
                      </div>
                      <p>Kirim pemberitahuan darurat saat stok suatu produk tersisa sama atau di bawah batas minimum (segera kulakan).</p>
                    </div>
                  </label>

                  <label className="wa-toggle-card">
                    <input
                      type="checkbox"
                      checked={formConfig.notifyStockInbound}
                      onChange={(e) => setFormConfig({ ...formConfig, notifyStockInbound: e.target.checked })}
                    />
                    <div className="wa-toggle-content">
                      <div className="wa-toggle-title">
                        <Boxes size={16} className="text-info" />
                        <strong>Notifikasi Barang Masuk / Restok</strong>
                      </div>
                      <p>Kirim catatan saat ada penambahan stok barang kulakan yang dicatat oleh kasir atau staf.</p>
                    </div>
                  </label>

                  <label className="wa-toggle-card">
                    <input
                      type="checkbox"
                      checked={formConfig.sendCustomerReceipt}
                      onChange={(e) => setFormConfig({ ...formConfig, sendCustomerReceipt: e.target.checked })}
                    />
                    <div className="wa-toggle-content">
                      <div className="wa-toggle-title">
                        <MessageSquare size={16} className="text-success" />
                        <strong>Struk Digital Belanja Pelanggan</strong>
                      </div>
                      <p>Aktifkan tombol "Kirim Struk WA" pada popup struk kasir agar pembeli bisa menerima struk belanja digital di WhatsApp mereka.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  <span>Simpan Pengaturan Notifikasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULATOR & PREVIEW CHAT */}
      {activeTab === 'simulator' && (
        <div className="wa-tab-content">
          <div className="wa-simulator-grid">
            {/* Left: Simulator Controls */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Pengirim Pesan Simulasi</h3>
                  <p className="panel-desc">Pilih template notifikasi atau ketik pesan kustom untuk menguji alur gateway</p>
                </div>
              </div>

              <div className="simulator-controls">
                <div className="form-group">
                  <label className="form-label">Pilih Jenis / Template Notifikasi</label>
                  <div className="template-selector-grid">
                    <button
                      type="button"
                      className={`template-pill ${selectedTemplate === 'omzet' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTemplate('omzet');
                        setSimRecipient(waConfig.ownerName || 'Haji Lubis (Pemilik)');
                        setSimPhone(waConfig.activeNumber);
                      }}
                    >
                      <TrendingUp size={14} />
                      <span>Rekap Omzet Harian</span>
                    </button>
                    <button
                      type="button"
                      className={`template-pill ${selectedTemplate === 'stok' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTemplate('stok');
                        setSimRecipient(waConfig.ownerName || 'Haji Lubis (Pemilik)');
                        setSimPhone(waConfig.activeNumber);
                      }}
                    >
                      <Boxes size={14} />
                      <span>Peringatan Stok Menipis</span>
                    </button>
                    <button
                      type="button"
                      className={`template-pill ${selectedTemplate === 'transaksi' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTemplate('transaksi');
                        setSimRecipient(waConfig.ownerName || 'Haji Lubis (Pemilik)');
                        setSimPhone(waConfig.activeNumber);
                      }}
                    >
                      <Receipt size={14} />
                      <span>Transaksi Kasir Terakhir</span>
                    </button>
                    <button
                      type="button"
                      className={`template-pill ${selectedTemplate === 'custom' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTemplate('custom');
                        setSimRecipient('Pak Budi (Pelanggan)');
                        setSimPhone('0813-9999-8888');
                        if (!simCustomText) {
                          setSimCustomText('*WARUNG KLONTONG HAJI LUBIS*\nHalo Kak Budi, pesanan beras 5kg sudah siap diambil ya!');
                        }
                      }}
                    >
                      <MessageSquare size={14} />
                      <span>Pesan Kustom</span>
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Nama Penerima</label>
                    <input
                      type="text"
                      className="form-control"
                      value={simRecipient}
                      onChange={(e) => setSimRecipient(e.target.value)}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Nomor WhatsApp Tujuan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={simPhone}
                      onChange={(e) => setSimPhone(e.target.value)}
                    />
                  </div>
                </div>

                {selectedTemplate === 'custom' && (
                  <div className="form-group">
                    <label className="form-label">Isi Pesan WhatsApp</label>
                    <textarea
                      className="form-control form-textarea"
                      rows={5}
                      value={simCustomText}
                      onChange={(e) => setSimCustomText(e.target.value)}
                      placeholder="Gunakan tanda *tebal* untuk cetak tebal..."
                    />
                  </div>
                )}

                <div className="simulator-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={handleSendSimulatorMessage}
                    disabled={isSimulating}
                  >
                    {isSimulating ? (
                      <>
                        <RotateCcw size={16} className="spin" />
                        <span>Mengirim Pesan Simulasi...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Kirim Pesan Simulasi Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Realistic WhatsApp Mobile Preview Screen */}
            <div className="wa-phone-mockup">
              <div className="phone-notch">
                <span className="phone-speaker"></span>
              </div>

              <div className="phone-screen">
                {/* WhatsApp Chat Header */}
                <div className="wa-chat-header">
                  <div className="wa-avatar-box">
                    <span>HL</span>
                  </div>
                  <div className="wa-chat-user-info">
                    <div className="wa-chat-username">{simRecipient}</div>
                    <div className="wa-chat-status">online • WhatsApp Business</div>
                  </div>
                </div>

                {/* WhatsApp Chat Body */}
                <div className="wa-chat-body">
                  <div className="wa-date-chip">HARI INI</div>

                  <div className="wa-bubble-incoming">
                    <div className="wa-bubble-text">
                      {generatedMessageText.split('\n').map((line, idx) => (
                        <p key={idx} className="wa-text-line">
                          {line || '\u00A0'}
                        </p>
                      ))}
                    </div>
                    <div className="wa-bubble-meta">
                      <span className="wa-time">13:10</span>
                      <CheckCheck size={14} className="wa-check-blue" />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Footer Mock */}
                <div className="wa-chat-footer-mock">
                  <span className="wa-input-mock">Ketik pesan...</span>
                  <div className="wa-send-btn-mock">
                    <Send size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RIWAYAT LOG PESAN SIMULASI */}
      {activeTab === 'logs' && (
        <div className="wa-tab-content">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Riwayat Log Notifikasi WhatsApp</h3>
                <p className="panel-desc">Seluruh pesan yang dipicu otomatis oleh transaksi kasir, stok kritis, rekap omzet, atau pengiriman simulator</p>
              </div>

              {waLogs.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm text-danger"
                  onClick={() => {
                    if (window.confirm('Bersihkan seluruh riwayat log simulasi WhatsApp?')) {
                      clearWaLogs();
                    }
                  }}
                >
                  <Trash2 size={14} />
                  <span>Bersihkan Log</span>
                </button>
              )}
            </div>

            {/* Log Filters */}
            <div className="wa-logs-filter-bar">
              <div className="search-box flex-1">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Cari nama penerima, nomor, atau isi pesan..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                />
              </div>

              <div className="filter-pill-group">
                {['Semua', 'Transaksi POS', 'Peringatan Stok', 'Rekap Harian', 'Struk Digital', 'Barang Masuk'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`period-pill ${logTypeFilter === cat ? 'active' : ''}`}
                    onClick={() => setLogTypeFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Logs Table */}
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Jenis Pesan</th>
                    <th>Penerima & Nomor</th>
                    <th>Ringkasan Pesan</th>
                    <th>Status</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-muted">
                        Tidak ada riwayat pesan simulasi yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className="cursor-pointer" onClick={() => setSelectedLogDetail(log)}>
                        <td className="text-sm text-muted">
                          {formatDateID(log.time, true)}
                        </td>
                        <td>
                          <span className={`wa-type-badge ${
                            log.type === 'Transaksi POS' ? 'type-blue' :
                            log.type === 'Peringatan Stok' ? 'type-red' :
                            log.type === 'Rekap Harian' ? 'type-green' :
                            log.type === 'Struk Digital' ? 'type-purple' : 'type-gray'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td>
                          <div className="recipient-cell">
                            <strong>{log.recipientName}</strong>
                            <span className="text-muted text-xs">{log.recipientPhone}</span>
                          </div>
                        </td>
                        <td className="truncate-text" style={{ maxWidth: '280px' }}>
                          {log.summary}
                        </td>
                        <td>
                          <span className="badge badge-success">
                            <CheckCheck size={12} />
                            <span>{log.status} (Simulasi)</span>
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLogDetail(log);
                            }}
                          >
                            <Eye size={12} />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PESAN WHATSAPP */}
      {selectedLogDetail && (
        <div className="modal-backdrop">
          <div className="modal-content modal-md">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <MessageSquare size={18} className="text-success" />
                <h3 className="modal-title">Detail Pesan WhatsApp Simulasi</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedLogDetail(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="wa-modal-meta-grid">
                <div>
                  <span className="text-xs text-muted">ID Log:</span>
                  <div className="font-semibold">{selectedLogDetail.id}</div>
                </div>
                <div>
                  <span className="text-xs text-muted">Waktu Kirim:</span>
                  <div className="font-semibold">{formatDateID(selectedLogDetail.time, true)}</div>
                </div>
                <div>
                  <span className="text-xs text-muted">Tujuan:</span>
                  <div className="font-semibold">{selectedLogDetail.recipientName} ({selectedLogDetail.recipientPhone})</div>
                </div>
                <div>
                  <span className="text-xs text-muted">Kategori:</span>
                  <div className="font-semibold">{selectedLogDetail.type}</div>
                </div>
              </div>

              <div className="wa-message-preview-container">
                <div className="wa-bubble-preview">
                  <pre className="wa-bubble-pre">
                    {selectedLogDetail.content}
                  </pre>
                  <div className="wa-bubble-footer">
                    <span>{formatDateID(selectedLogDetail.time, true)}</span>
                    <CheckCheck size={14} className="wa-check-blue" />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => copyMessage(selectedLogDetail.content, selectedLogDetail.id)}
              >
                {copiedId === selectedLogDetail.id ? (
                  <>
                    <Check size={14} />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Salin Format Teks</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedLogDetail(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
