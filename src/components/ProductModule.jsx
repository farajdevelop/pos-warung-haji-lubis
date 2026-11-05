import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  X,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatIDR, getStockStatus } from '../utils/formatters';
import { CATEGORIES } from '../data/dummyData';

export default function ProductModule() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [stockFilter, setStockFilter] = useState('Semua');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    code: '',
    barcode: '',
    name: '',
    category: 'Sembako',
    costPrice: '',
    sellingPrice: '',
    stock: '',
    minStock: '5',
    unit: 'pcs'
  });
  const [formErrors, setFormErrors] = useState({});

  // Reset form
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      code: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      barcode: '',
      name: '',
      category: 'Sembako',
      costPrice: '',
      sellingPrice: '',
      stock: '10',
      minStock: '5',
      unit: 'pcs'
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      barcode: product.barcode || '',
      name: product.name,
      category: product.category,
      costPrice: String(product.costPrice),
      sellingPrice: String(product.sellingPrice),
      stock: String(product.stock),
      minStock: String(product.minStock),
      unit: product.unit
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nama produk wajib diisi';
    if (!formData.code.trim()) errors.code = 'Kode produk wajib diisi';
    
    const cost = Number(formData.costPrice);
    const sell = Number(formData.sellingPrice);
    const stock = Number(formData.stock);
    const minStock = Number(formData.minStock);

    if (isNaN(cost) || cost < 0) errors.costPrice = 'Harga modal harus >= 0';
    if (isNaN(sell) || sell <= 0) errors.sellingPrice = 'Harga jual harus > 0';
    if (!errors.costPrice && !errors.sellingPrice && sell < cost) {
      errors.sellingPrice = 'Harga jual lebih rendah dari harga modal (rugi)';
    }

    if (isNaN(stock) || stock < 0) errors.stock = 'Stok tidak boleh negatif';
    if (isNaN(minStock) || minStock < 0) errors.minStock = 'Batas minimum tidak boleh negatif';
    if (!formData.unit.trim()) errors.unit = 'Satuan wajib diisi (misal: pcs, kg, botol)';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        code: formData.code.trim(),
        barcode: formData.barcode.trim(),
        name: formData.name.trim(),
        category: formData.category,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        stock: Number(formData.stock),
        minStock: Number(formData.minStock),
        unit: formData.unit.trim()
      });
    } else {
      addProduct({
        code: formData.code.trim(),
        barcode: formData.barcode.trim(),
        name: formData.name.trim(),
        category: formData.category,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        stock: Number(formData.stock),
        minStock: Number(formData.minStock),
        unit: formData.unit.trim()
      });
    }

    setIsFormModalOpen(false);
  };

  // Delete product confirmation
  const handleConfirmDelete = () => {
    if (deleteConfirmTarget) {
      deleteProduct(deleteConfirmTarget.id);
      setDeleteConfirmTarget(null);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCat = selectedCategory === 'Semua' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q) ||
        (product.barcode && product.barcode.includes(q));

      const status = getStockStatus(product.stock, product.minStock);
      const matchStock =
        stockFilter === 'Semua' ||
        (stockFilter === 'Aman' && status.status === 'safe') ||
        (stockFilter === 'Menipis' && status.status === 'warning') ||
        (stockFilter === 'Habis' && status.status === 'danger');

      return matchCat && matchSearch && matchStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  return (
    <div className="product-module-view">
      {/* Top Action Header */}
      <div className="module-top-row">
        <div>
          <h2 className="module-heading">Manajemen Produk & Katalog Barang</h2>
          <p className="module-sub">Kelola master data produk, harga modal, harga jual, dan stok awal warung.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleOpenAddModal}
        >
          <Plus size={16} />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="panel filter-panel">
        <div className="filter-grid">
          <div className="filter-search-box">
            <Search size={16} className="text-muted" />
            <input
              type="text"
              placeholder="Cari nama, kode, atau barcode..."
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
            <label className="filter-label">Kategori:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <label className="filter-label">Status Stok:</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="filter-select"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aman">Stok Aman</option>
              <option value="Menipis">Stok Menipis</option>
              <option value="Habis">Stok Habis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="panel table-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Daftar Katalog Produk ({filteredProducts.length} Produk)</h3>
            <p className="panel-desc">Perubahan data produk tersimpan otomatis di state sesi</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="app-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Barcode</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th className="text-right">Harga Modal</th>
                <th className="text-right">Harga Jual</th>
                <th className="text-right">Estimasi Margin</th>
                <th>Stok Riil</th>
                <th>Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-muted">
                    Tidak ada produk yang cocok dengan pencarian dan filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => {
                  const status = getStockStatus(prod.stock, prod.minStock);
                  const margin = prod.sellingPrice - prod.costPrice;

                  return (
                    <tr key={prod.id}>
                      <td><code>{prod.code}</code></td>
                      <td><span className="barcode-tag">{prod.barcode || '-'}</span></td>
                      <td><strong>{prod.name}</strong></td>
                      <td><span className="category-pill">{prod.category}</span></td>
                      <td className="text-right text-muted">{formatIDR(prod.costPrice)}</td>
                      <td className="text-right font-bold text-blue">{formatIDR(prod.sellingPrice)}</td>
                      <td className="text-right text-success font-medium">+{formatIDR(margin)}</td>
                      <td>
                        <span className="font-bold">{prod.stock}</span> {prod.unit}
                      </td>
                      <td>
                        <span className={`badge ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="table-actions">
                          <button
                            className="btn-icon text-blue"
                            onClick={() => handleOpenEditModal(prod)}
                            title="Edit Produk"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="btn-icon text-red"
                            onClick={() => setDeleteConfirmTarget(prod)}
                            title="Hapus Produk"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM TAMBAH / EDIT PRODUK */}
      {isFormModalOpen && (
        <div className="modal-backdrop">
          <div className="app-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'Edit Data Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsFormModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Kode Produk *</label>
                  <input
                    type="text"
                    className={`form-input ${formErrors.code ? 'has-error' : ''}`}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Contoh: SMB-004"
                  />
                  {formErrors.code && <span className="field-error">{formErrors.code}</span>}
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Nomor Barcode (Opsional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="Contoh: 899123456789"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nama Produk *</label>
                <input
                  type="text"
                  className={`form-input ${formErrors.name ? 'has-error' : ''}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Telur Ayam Negeri 1kg"
                />
                {formErrors.name && <span className="field-error">{formErrors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Kategori *</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Satuan Kemasan *</label>
                  <input
                    type="text"
                    className={`form-input ${formErrors.unit ? 'has-error' : ''}`}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="pcs, botol, kg, pouch"
                  />
                  {formErrors.unit && <span className="field-error">{formErrors.unit}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Harga Modal (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    className={`form-input ${formErrors.costPrice ? 'has-error' : ''}`}
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="0"
                  />
                  {formErrors.costPrice && <span className="field-error">{formErrors.costPrice}</span>}
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    className={`form-input ${formErrors.sellingPrice ? 'has-error' : ''}`}
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="0"
                  />
                  {formErrors.sellingPrice && <span className="field-error">{formErrors.sellingPrice}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label">Stok Awal *</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-input ${formErrors.stock ? 'has-error' : ''}`}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                  {formErrors.stock && <span className="field-error">{formErrors.stock}</span>}
                </div>

                <div className="form-group flex-1">
                  <label className="form-label">Batas Minimum Stok (Warning) *</label>
                  <input
                    type="number"
                    min="1"
                    className={`form-input ${formErrors.minStock ? 'has-error' : ''}`}
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    placeholder="5"
                  />
                  {formErrors.minStock && <span className="field-error">{formErrors.minStock}</span>}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Simpan Perubahan' : 'Tambahkan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS PRODUK */}
      {deleteConfirmTarget && (
        <div className="modal-backdrop">
          <div className="confirm-modal">
            <div className="confirm-icon-box">
              <AlertTriangle size={24} className="text-danger" />
            </div>
            <h3 className="confirm-title">Hapus Produk?</h3>
            <p className="confirm-desc">
              Apakah Anda yakin ingin menghapus produk <strong>"{deleteConfirmTarget.name}"</strong> ({deleteConfirmTarget.code}) dari katalog?
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteConfirmTarget(null)}
              >
                Batal
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Ya, Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
