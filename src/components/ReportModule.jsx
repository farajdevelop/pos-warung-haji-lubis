import React, { useState, useMemo } from 'react';
import {
  FileBarChart,
  Search,
  Clock,
  TrendingUp,
  AlertTriangle,
  Receipt,
  X,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Download,
  Printer,
  Calendar,
  Award,
  Users,
  Filter
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatIDR, formatDateID } from '../utils/formatters';
import { DEMO_INFO } from '../data/dummyData';

export default function ReportModule() {
  const { transactions, cancelTransaction, currentRole, showToast } = useStore();

  const [periodFilter, setPeriodFilter] = useState('7_hari'); // 'hari_ini' | '7_hari' | '30_hari' | 'semua'
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReportTab, setActiveReportTab] = useState('transactions'); // 'transactions' | 'top_products' | 'cashier_recap'

  // Modals State
  const [selectedTrx, setSelectedTrx] = useState(null);
  const [cancelTargetTrx, setCancelTargetTrx] = useState(null);
  const [cancelReason, setCancelReason] = useState('Pelanggan salah membeli barang');

  // Filter transactions by period
  const periodFilteredTransactions = useMemo(() => {
    const referenceDate = new Date('2026-10-16T23:59:59');

    return transactions.filter(t => {
      const trxDate = new Date(t.time);

      if (periodFilter === 'hari_ini') {
        return t.time.startsWith('2026-10-16');
      }

      if (periodFilter === '7_hari') {
        const diffDays = (referenceDate - trxDate) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }

      if (periodFilter === '30_hari') {
        const diffDays = (referenceDate - trxDate) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 30;
      }

      return true; // 'semua'
    });
  }, [transactions, periodFilter]);

  // Apply search query and status filter
  const displayedTransactions = useMemo(() => {
    return periodFilteredTransactions.filter(trx => {
      const matchStatus = statusFilter === 'Semua' || trx.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        trx.id.toLowerCase().includes(q) ||
        trx.customer.toLowerCase().includes(q) ||
        trx.cashier.toLowerCase().includes(q) ||
        trx.items.some(i => i.name.toLowerCase().includes(q));

      return matchStatus && matchSearch;
    });
  }, [periodFilteredTransactions, statusFilter, searchQuery]);

  // Aggregate Metrics based on the period
  const completedTrx = useMemo(() => {
    return periodFilteredTransactions.filter(t => t.status === 'Selesai');
  }, [periodFilteredTransactions]);

  const totalOmzet = useMemo(() => {
    return completedTrx.reduce((sum, t) => sum + t.total, 0);
  }, [completedTrx]);

  const totalProfit = useMemo(() => {
    return completedTrx.reduce((sum, t) => {
      const trxProfit = t.items.reduce((acc, item) => {
        const cost = item.costPrice || (item.price * 0.82);
        return acc + (item.price - cost) * item.qty;
      }, 0);
      return sum + trxProfit;
    }, 0);
  }, [completedTrx]);

  const profitMargin = totalOmzet > 0 ? Math.round((totalProfit / totalOmzet) * 100) : 0;
  const avgPerReceipt = completedTrx.length > 0 ? Math.round(totalOmzet / completedTrx.length) : 0;
  const canceledCount = periodFilteredTransactions.filter(t => t.status === 'Dibatalkan').length;

  // Top Selling Products in selected period
  const topProducts = useMemo(() => {
    const map = {};
    completedTrx.forEach(t => {
      t.items.forEach(item => {
        const key = item.id || item.name;
        if (!map[key]) {
          map[key] = {
            id: key,
            name: item.name,
            qty: 0,
            revenue: 0,
            profit: 0
          };
        }
        const cost = item.costPrice || (item.price * 0.82);
        map[key].qty += item.qty;
        map[key].revenue += (item.price * item.qty);
        map[key].profit += ((item.price - cost) * item.qty);
      });
    });

    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [completedTrx]);

  // Cashier Breakdown Recap
  const cashierRecap = useMemo(() => {
    const map = {};
    completedTrx.forEach(t => {
      const name = t.cashier;
      if (!map[name]) {
        map[name] = { name, count: 0, total: 0 };
      }
      map[name].count += 1;
      map[name].total += t.total;
    });
    return Object.values(map);
  }, [completedTrx]);

  // Export to CSV Functionality (Native Client-Side Export)
  const handleExportCSV = () => {
    const headers = [
      'No. Struk',
      'Waktu',
      'Pelanggan',
      'Kasir',
      'Rincian Barang',
      'Total Belanja (IDR)',
      'Tunai Diterima (IDR)',
      'Kembalian (IDR)',
      'Metode',
      'Status',
      'Keterangan / Batal'
    ];

    const rows = displayedTransactions.map(t => [
      `"${t.id}"`,
      `"${t.time}"`,
      `"${t.customer}"`,
      `"${t.cashier}"`,
      `"${t.items.map(i => `${i.name} (x${i.qty})`).join(', ')}"`,
      t.total,
      t.cash,
      t.change,
      `"${t.paymentMethod}"`,
      `"${t.status}"`,
      `"${t.cancelReason || '-'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Penjualan_Haji_Lubis_${periodFilter}_20261016.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Laporan penjualan berhasil diekspor sebagai file CSV!', 'success');
  };

  // Confirm cancel transaction
  const handleConfirmCancel = () => {
    if (!cancelTargetTrx) return;
    cancelTransaction(cancelTargetTrx.id, cancelReason);
    setCancelTargetTrx(null);
    if (selectedTrx?.id === cancelTargetTrx.id) {
      setSelectedTrx(null);
    }
  };

  return (
    <div className="report-module-view">
      {/* Top Header */}
      <div className="module-top-row">
        <div>
          <h2 className="module-heading">Laporan & Analitik Penjualan Toko</h2>
          <p className="module-sub">
            Pembukuan omzet harian, mingguan, dan bulanan dengan rincian estimasi laba kotor dan ekspor CSV.
          </p>
        </div>

        <div className="module-actions-wrap">
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
            title="Cetak tampilan laporan ini"
          >
            <Printer size={16} />
            <span>Cetak Laporan</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExportCSV}
            title="Unduh laporan dalam format CSV / Excel"
          >
            <Download size={16} />
            <span>Ekspor ke CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Period Selection Bar */}
      <div className="panel filter-panel">
        <div className="filter-grid">
          <div className="filter-select-group">
            <label className="filter-label">Periode Waktu:</label>
            <div className="period-tabs">
              {[
                { id: 'hari_ini', label: 'Hari Ini' },
                { id: '7_hari', label: '7 Hari Terakhir' },
                { id: '30_hari', label: 'Bulan Ini (30 Hari)' },
                { id: 'semua', label: 'Semua Waktu' }
              ].map(p => (
                <button
                  key={p.id}
                  className={`period-pill ${periodFilter === p.id ? 'active' : ''}`}
                  onClick={() => setPeriodFilter(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-search-box ml-auto">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Cari struk, pelanggan, kasir, atau barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="filter-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                &times;
              </button>
            )}
          </div>

          <div className="filter-select-group">
            <label className="filter-label">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="Semua">Semua Status</option>
              <option value="Selesai">Hanya Selesai</option>
              <option value="Dibatalkan">Hanya Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards based on Period */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Omzet Penjualan</span>
            <div className="kpi-icon-wrap icon-blue">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value">{formatIDR(totalOmzet)}</div>
          <div className="kpi-footer">
            <span className="kpi-note">{completedTrx.length} struk berhasil</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Estimasi Laba Kotor</span>
            <div className="kpi-icon-wrap icon-green">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value">{formatIDR(totalProfit)}</div>
          <div className="kpi-footer">
            <span className="kpi-badge-estimasi">Estimasi Laba Kotor</span>
            <span className="kpi-note">Margin ~{profitMargin}%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Rata-rata per Struk</span>
            <div className="kpi-icon-wrap icon-navy">
              <Receipt size={18} />
            </div>
          </div>
          <div className="kpi-value">{formatIDR(avgPerReceipt)}</div>
          <div className="kpi-footer">
            <span className="kpi-note">Nilai rata-rata keranjang</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Transaksi Dibatalkan</span>
            <div className="kpi-icon-wrap icon-red">
              <RotateCcw size={18} />
            </div>
          </div>
          <div className="kpi-value text-red">{canceledCount} Struk</div>
          <div className="kpi-footer">
            <span className="kpi-note">Stok dikembalikan ke toko</span>
          </div>
        </div>
      </div>

      {/* Report Section Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeReportTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('transactions')}
        >
          <Receipt size={16} />
          <span>Daftar Transaksi ({displayedTransactions.length})</span>
        </button>
        <button
          className={`tab-btn ${activeReportTab === 'top_products' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('top_products')}
        >
          <Award size={16} />
          <span>Produk Terlaris ({topProducts.length})</span>
        </button>
        <button
          className={`tab-btn ${activeReportTab === 'cashier_recap' ? 'active' : ''}`}
          onClick={() => setActiveReportTab('cashier_recap')}
        >
          <Users size={16} />
          <span>Rekapitulasi Kasir ({cashierRecap.length})</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR TRANSAKSI */}
      {activeReportTab === 'transactions' && (
        <div className="panel table-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Data Transaksi Kasir</h3>
              <p className="panel-desc">Menampilkan rincian struk belanja pada periode yang dipilih</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>No. Struk</th>
                  <th>Waktu</th>
                  <th>Pelanggan</th>
                  <th>Kasir</th>
                  <th>Rincian Item</th>
                  <th className="text-right">Total Transaksi</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-muted">
                      Tidak ada transaksi pada filter dan periode ini.
                    </td>
                  </tr>
                ) : (
                  displayedTransactions.map(trx => (
                    <tr key={trx.id}>
                      <td><code>{trx.id}</code></td>
                      <td>
                        <div className="time-wrap">
                          <Clock size={12} />
                          <span>{formatDateID(trx.time, true)}</span>
                        </div>
                      </td>
                      <td>{trx.customer}</td>
                      <td><span className="cashier-tag">{trx.cashier}</span></td>
                      <td className="trx-items">
                        {trx.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                      </td>
                      <td className="text-right font-bold text-blue">
                        {formatIDR(trx.total)}
                      </td>
                      <td className="text-center">
                        <span className={`badge ${trx.status === 'Selesai' ? 'badge-success' : 'badge-danger'}`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setSelectedTrx(trx)}
                            title="Buka Struk"
                          >
                            <Receipt size={13} />
                            <span>Detail</span>
                          </button>
                          {trx.status === 'Selesai' && (
                            <button
                              className="btn btn-secondary btn-sm text-red"
                              onClick={() => {
                                if (currentRole !== 'Pemilik/Admin') {
                                  showToast('Akses Ditolak: Hanya Pemilik/Admin yang berhak membatalkan transaksi', 'danger');
                                  return;
                                }
                                setCancelTargetTrx(trx);
                              }}
                              title={currentRole === 'Pemilik/Admin' ? 'Batalkan Transaksi' : 'Khusus Pemilik/Admin'}
                            >
                              <RotateCcw size={13} />
                              <span>Batal</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUK TERLARIS */}
      {activeReportTab === 'top_products' && (
        <div className="panel table-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Analitik Produk Terlaris (Top Selling Products)</h3>
              <p className="panel-desc">Daftar produk yang paling banyak terjual dan kontribusi omzet pada periode ini</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: '50px' }}>Peringkat</th>
                  <th>Nama Produk</th>
                  <th className="text-center">Total Terjual</th>
                  <th className="text-right">Total Kontribusi Omzet</th>
                  <th className="text-right">Estimasi Laba Kotor</th>
                  <th className="text-right">Porsi Omzet</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-muted">
                      Belum ada penjualan pada periode yang dipilih.
                    </td>
                  </tr>
                ) : (
                  topProducts.map((p, idx) => {
                    const share = totalOmzet > 0 ? Math.round((p.revenue / totalOmzet) * 100) : 0;
                    return (
                      <tr key={p.id}>
                        <td className="text-center">
                          <span className={`rank-badge rank-${idx + 1}`}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td><strong>{p.name}</strong></td>
                        <td className="text-center font-bold">{p.qty} pcs</td>
                        <td className="text-right font-bold text-blue">{formatIDR(p.revenue)}</td>
                        <td className="text-right text-success font-medium">+{formatIDR(p.profit)}</td>
                        <td className="text-right font-bold">{share}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REKAPITULASI KASIR */}
      {activeReportTab === 'cashier_recap' && (
        <div className="panel table-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Rekapitulasi Performa Kasir</h3>
              <p className="panel-desc">Total transaksi dan omzet yang dicatat oleh tiap kasir</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Nama Kasir</th>
                  <th className="text-center">Jumlah Transaksi</th>
                  <th className="text-right">Total Omzet Kasir</th>
                  <th className="text-right">Rata-rata per Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {cashierRecap.map(c => (
                  <tr key={c.name}>
                    <td>
                      <span className="cashier-tag" style={{ fontSize: '13px', padding: '4px 8px' }}>
                        {c.name}
                      </span>
                    </td>
                    <td className="text-center font-bold">{c.count} struk</td>
                    <td className="text-right font-bold text-blue">{formatIDR(c.total)}</td>
                    <td className="text-right text-muted">
                      {c.count > 0 ? formatIDR(Math.round(c.total / c.count)) : 'Rp 0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL STRUK MODAL */}
      {selectedTrx && (
        <div className="modal-backdrop">
          <div className="app-modal">
            <div className="modal-header">
              <h3 className="modal-title">Rincian Transaksi {selectedTrx.id}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedTrx(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body p-4">
              <div className="trx-detail-grid">
                <div>Waktu: <strong>{formatDateID(selectedTrx.time, true)}</strong></div>
                <div>Status: <span className={`badge ${selectedTrx.status === 'Selesai' ? 'badge-success' : 'badge-danger'}`}>{selectedTrx.status}</span></div>
                <div>Kasir: <strong>{selectedTrx.cashier}</strong></div>
                <div>Pelanggan: <strong>{selectedTrx.customer}</strong></div>
              </div>

              {selectedTrx.status === 'Dibatalkan' && (
                <div className="canceled-reason-box">
                  <AlertTriangle size={16} className="text-danger" />
                  <div>
                    <strong>Dibatalkan oleh:</strong> {selectedTrx.canceledBy || 'Pemilik'}<br />
                    <strong>Alasan:</strong> {selectedTrx.cancelReason}
                  </div>
                </div>
              )}

              <h4 className="mt-4 mb-2 font-bold">Rincian Barang yang Dibeli:</h4>
              <div className="table-responsive">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Nama Barang</th>
                      <th>Qty</th>
                      <th className="text-right">Harga Satuan</th>
                      <th className="text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTrx.items.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.qty} {item.unit || 'pcs'}</td>
                        <td className="text-right">{formatIDR(item.price)}</td>
                        <td className="text-right font-bold">{formatIDR(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="font-bold text-right">TOTAL:</td>
                      <td className="text-right font-bold text-blue">{formatIDR(selectedTrx.total)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right text-muted">Tunai Diterima:</td>
                      <td className="text-right text-muted">{formatIDR(selectedTrx.cash)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-right text-success font-bold">Kembalian:</td>
                      <td className="text-right text-success font-bold">{formatIDR(selectedTrx.change)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="modal-actions">
              {selectedTrx.status === 'Selesai' && (
                <button
                  type="button"
                  className="btn btn-danger mr-auto"
                  onClick={() => {
                    setCancelTargetTrx(selectedTrx);
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Batalkan Transaksi Ini</span>
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedTrx(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CANCEL MODAL */}
      {cancelTargetTrx && (
        <div className="modal-backdrop">
          <div className="confirm-modal">
            <div className="confirm-icon-box">
              <ShieldAlert size={26} className="text-danger" />
            </div>
            <h3 className="confirm-title">Konfirmasi Pembatalan Transaksi</h3>
            <p className="confirm-desc">
              Anda akan membatalkan transaksi <strong>{cancelTargetTrx.id}</strong> senilai <strong>{formatIDR(cancelTargetTrx.total)}</strong>.
            </p>

            {currentRole !== 'Pemilik/Admin' ? (
              <div className="role-restriction-alert">
                <AlertTriangle size={16} />
                <span>
                  <strong>Akses Dibatasi:</strong> Peran Anda saat ini adalah <strong>{currentRole}</strong>.
                  Sesuai aturan keamanan warung, hanya <strong>Pemilik/Admin</strong> yang berhak membatalkan transaksi.
                  Silakan beralih ke peran Pemilik/Admin di sidebar footer untuk melanjutkan demonstrasi.
                </span>
              </div>
            ) : (
              <div className="form-group text-left my-3">
                <label className="form-label">Alasan Pembatalan Transaksi *</label>
                <input
                  type="text"
                  className="form-input"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Contoh: Barang retur, kesalahan input kasir"
                  required
                />
                <span className="form-help">
                  Stok barang yang dibeli akan otomatis dikembalikan ke gudang toko.
                </span>
              </div>
            )}

            <div className="confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setCancelTargetTrx(null)}
              >
                Tutup
              </button>
              {currentRole === 'Pemilik/Admin' && (
                <button
                  className="btn btn-danger"
                  onClick={handleConfirmCancel}
                >
                  Ya, Batalkan Transaksi & Kembalikan Stok
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
