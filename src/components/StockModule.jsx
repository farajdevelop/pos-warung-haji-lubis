import React, { useState, useMemo } from 'react';
import {
  Boxes,
  PlusCircle,
  Sliders,
  History,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getStockStatus, formatDateID } from '../utils/formatters';

export default function StockModule() {
  const { products, stockMutations, addStockInbound, adjustStockPhysical } = useStore();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [mutationFilter, setMutationFilter] = useState('Semua');

  // Modal State
  const [isInboundModalOpen, setIsInboundModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Inbound Form
  const [inboundForm, setInboundForm] = useState({
    productId: products[0]?.id || '',
    qty: '10',
    source: 'Kulakan Pasar Induk',
    notes: 'Restok mingguan'
  });

  // Adjust Form
  const [adjustForm, setAdjustForm] = useState({
    productId: products[0]?.id || '',
    finalStock: '10',
    reason: 'Stock opname fisik bulanan'
  });

  // Open modals with preselected product
  const handleOpenInbound = (productId = null) => {
    setInboundForm({
      productId: productId || products[0]?.id || '',
      qty: '10',
      source: 'Kulakan Pasar Induk',
      notes: ''
    });
    setIsInboundModalOpen(true);
  };

  const handleOpenAdjust = (product = null) => {
    const target = product || products[0];
    setAdjustForm({
      productId: target?.id || '',
      finalStock: String(target?.stock || 0),
      reason: 'Penyesuaian stok opname fisik'
    });
    setIsAdjustModalOpen(true);
  };

  // Submit Inbound
  const handleSubmitInbound = (e) => {
    e.preventDefault();
    const success = addStockInbound({
      productId: inboundForm.productId,
      qty: inboundForm.qty,
      notes: inboundForm.notes,
      source: inboundForm.source
    });
    if (success) {
      setIsInboundModalOpen(false);
    }
  };

  // Submit Adjust
  const handleSubmitAdjust = (e) => {
    e.preventDefault();
    const success = adjustStockPhysical({
      productId: adjustForm.productId,
      finalStock: adjustForm.finalStock,
      reason: adjustForm.reason
    });
    if (success) {
      setIsAdjustModalOpen(false);
    }
  };

  // Summary counts
  const lowStockCount = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);

  // Filtered inventory
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  // Filtered mutations
  const filteredMutations = useMemo(() => {
    return stockMutations.filter(m => {
      const matchType = mutationFilter === 'Semua' || m.type === mutationFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        m.productName.toLowerCase().includes(q) ||
        m.notes.toLowerCase().includes(q) ||
        m.actor.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [stockMutations, mutationFilter, searchQuery]);

  return (
    <div className="stock-module-view">
      {/* Top Header */}
      <div className="module-top-row">
        <div>
          <h2 className="module-heading">Manajemen Stok & Mutasi Barang</h2>
          <p className="module-sub">
            Pencatatan barang masuk (restok), penyesuaian stok fisik (opname), dan audit trail kartu stok.
          </p>
        </div>
        <div className="module-actions-wrap">
          <button
            className="btn btn-secondary"
            onClick={() => handleOpenAdjust()}
          >
            <Sliders size={16} />
            <span>Penyesuaian Fisik (Opname)</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleOpenInbound()}
          >
            <PlusCircle size={16} />
            <span>+ Barang Masuk (Restok)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Stock */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Macam Produk</span>
            <div className="kpi-icon-wrap icon-navy">
              <Boxes size={18} />
            </div>
          </div>
          <div className="kpi-value">{products.length} SKU</div>
          <div className="kpi-footer">
            <span className="kpi-note">{totalUnits} total unit barang di gudang</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Peringatan Stok Menipis</span>
            <div className="kpi-icon-wrap icon-red">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-value text-red">{lowStockCount} Produk</div>
          <div className="kpi-footer">
            <span className="kpi-note">Menyentuh batas minimum</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Stok Habis (Kosong)</span>
            <div className="kpi-icon-wrap icon-red">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-value text-danger">{outOfStockCount} Produk</div>
          <div className="kpi-footer">
            <span className="kpi-note">Perlu segera restok kulakan</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Total Catatan Mutasi</span>
            <div className="kpi-icon-wrap icon-blue">
              <History size={18} />
            </div>
          </div>
          <div className="kpi-value">{stockMutations.length} Mutasi</div>
          <div className="kpi-footer">
            <span className="kpi-note">Terekam di riwayat sesi ini</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Boxes size={16} />
          <span>Daftar Stok Produk ({products.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={16} />
          <span>Riwayat Mutasi Stok ({stockMutations.length})</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY LIST */}
      {activeTab === 'inventory' && (
        <div className="panel table-panel">
          <div className="panel-header">
            <div className="panel-search-inline">
              <Search size={16} className="text-muted" />
              <input
                type="text"
                placeholder="Cari produk atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Stok Saat Ini</th>
                  <th>Batas Min.</th>
                  <th>Status</th>
                  <th className="text-center">Tindakan Cepat</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(prod => {
                  const status = getStockStatus(prod.stock, prod.minStock);
                  return (
                    <tr key={prod.id}>
                      <td><code>{prod.code}</code></td>
                      <td><strong>{prod.name}</strong></td>
                      <td><span className="category-pill">{prod.category}</span></td>
                      <td>
                        <span className="font-bold text-blue">{prod.stock}</span> {prod.unit}
                      </td>
                      <td>{prod.minStock} {prod.unit}</td>
                      <td>
                        <span className={`badge ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenInbound(prod.id)}
                            title="Tambah Barang Masuk"
                          >
                            <PlusCircle size={13} />
                            <span>Restok</span>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenAdjust(prod)}
                            title="Sesuaikan Stok Fisik"
                          >
                            <Sliders size={13} />
                            <span>Opname</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MUTATION AUDIT TRAIL */}
      {activeTab === 'history' && (
        <div className="panel table-panel">
          <div className="panel-header">
            <div className="panel-search-inline">
              <Search size={16} className="text-muted" />
              <input
                type="text"
                placeholder="Cari catatan, produk, atau pelaku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-select-group">
              <label className="filter-label">Tipe Mutasi:</label>
              <select
                value={mutationFilter}
                onChange={(e) => setMutationFilter(e.target.value)}
                className="filter-select"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="Penjualan POS">Penjualan POS</option>
                <option value="Barang Masuk">Barang Masuk</option>
                <option value="Penyesuaian Fisik">Penyesuaian Fisik</option>
                <option value="Pembatalan Transaksi">Pembatalan Transaksi</option>
                <option value="Stok Awal">Stok Awal</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Produk</th>
                  <th>Tipe Mutasi</th>
                  <th className="text-right">Perubahan Qty</th>
                  <th className="text-right">Stok Akhir</th>
                  <th>Pelaku</th>
                  <th>Catatan / Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {filteredMutations.map(mut => {
                  const isPositive = mut.qty > 0;
                  return (
                    <tr key={mut.id}>
                      <td>
                        <div className="time-wrap">
                          <Clock size={12} />
                          <span>{formatDateID(mut.time, true)}</span>
                        </div>
                      </td>
                      <td><strong>{mut.productName}</strong></td>
                      <td>
                        <span className={`badge ${
                          mut.type === 'Barang Masuk' ? 'badge-success' :
                          mut.type === 'Penjualan POS' ? 'badge-primary' :
                          mut.type === 'Pembatalan Transaksi' ? 'badge-warning' :
                          'badge-neutral'
                        }`}>
                          {mut.type}
                        </span>
                      </td>
                      <td className={`text-right font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                        {isPositive ? `+${mut.qty}` : mut.qty}
                      </td>
                      <td className="text-right font-bold">{mut.finalStock}</td>
                      <td>
                        <span className="cashier-tag">{mut.actor}</span>
                      </td>
                      <td className="text-muted">{mut.notes || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL BARANG MASUK (INBOUND) */}
      {isInboundModalOpen && (
        <div className="modal-backdrop">
          <div className="app-modal">
            <div className="modal-header">
              <h3 className="modal-title">Pencatatan Barang Masuk (Restok)</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsInboundModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitInbound} className="modal-form">
              <div className="form-group">
                <label className="form-label">Pilih Produk *</label>
                <select
                  className="form-input"
                  value={inboundForm.productId}
                  onChange={(e) => setInboundForm({ ...inboundForm, productId: e.target.value })}
                  required
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name} (Stok sekarang: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Jumlah Barang Masuk *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={inboundForm.qty}
                    onChange={(e) => setInboundForm({ ...inboundForm, qty: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Asal Supplier / Kulakan</label>
                  <input
                    type="text"
                    className="form-input"
                    value={inboundForm.source}
                    onChange={(e) => setInboundForm({ ...inboundForm, source: e.target.value })}
                    placeholder="Contoh: Agen Cipinang, Pasar Induk"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Tambahan</label>
                <input
                  type="text"
                  className="form-input"
                  value={inboundForm.notes}
                  onChange={(e) => setInboundForm({ ...inboundForm, notes: e.target.value })}
                  placeholder="Nomor faktur kulakan atau keterangan..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsInboundModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Barang Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PENYESUAIAN STOK FISIK (STOCK OPNAME) */}
      {isAdjustModalOpen && (
        <div className="modal-backdrop">
          <div className="app-modal">
            <div className="modal-header">
              <h3 className="modal-title">Penyesuaian Stok Fisik (Stock Opname)</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsAdjustModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitAdjust} className="modal-form">
              <div className="form-group">
                <label className="form-label">Pilih Produk *</label>
                <select
                  className="form-input"
                  value={adjustForm.productId}
                  onChange={(e) => {
                    const selected = products.find(p => p.id === e.target.value);
                    setAdjustForm({
                      ...adjustForm,
                      productId: e.target.value,
                      finalStock: String(selected?.stock || 0)
                    });
                  }}
                  required
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name} (Stok sistem saat ini: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hasil Perhitungan Stok Fisik Riil *</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={adjustForm.finalStock}
                  onChange={(e) => setAdjustForm({ ...adjustForm, finalStock: e.target.value })}
                  required
                />
                <span className="form-help">
                  Stok sistem akan disesuaikan menjadi angka ini secara otomatis.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Alasan Penyesuaian *</label>
                <input
                  type="text"
                  className="form-input"
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  placeholder="Contoh: Barang kadaluwarsa, kemasan rusak, selisih hitung"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAdjustModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan Penyesuaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
