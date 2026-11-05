import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_STOCK_MUTATIONS,
  DEMO_USERS,
  DEMO_WHATSAPP_CONFIG,
  INITIAL_WHATSAPP_LOGS,
  INITIAL_AUDIT_LOGS
} from '../data/dummyData';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [stockMutations, setStockMutations] = useState(INITIAL_STOCK_MUTATIONS);
  const [currentRole, setCurrentRole] = useState('Pemilik/Admin');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // State Pengguna & Hak Akses (Fase 6)
  const [users, setUsers] = useState(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]); // Mulai sebagai Haji Lubis, bisa logout
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // State Simulasi WhatsApp Gateway (Fase 5)
  const [waConfig, setWaConfig] = useState(DEMO_WHATSAPP_CONFIG);
  const [waLogs, setWaLogs] = useState(INITIAL_WHATSAPP_LOGS);

  // Helper untuk menampilkan notifikasi toast
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 3500);
  };

  const closeToast = () => setToast(null);

  // Helper Audit Log Pengguna (Fase 6)
  const addAuditLog = ({ action, details, badgeClass = 'badge-primary' }) => {
    const actorName = currentUser?.name || 'Sistem POS';
    const actorRole = currentUser?.role || currentRole;
    const newLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time: new Date().toISOString(),
      actor: actorName,
      role: actorRole,
      action,
      details,
      badgeClass
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // Aksi Otentikasi & Akun Pengguna (Fase 6)
  const login = (userObj) => {
    setCurrentUser(userObj);
    setCurrentRole(userObj.role);
    const newLog = {
      id: `AUD-${Date.now()}`,
      time: new Date().toISOString(),
      actor: userObj.name,
      role: userObj.role,
      action: 'Login ke Sistem',
      details: `${userObj.name} berhasil masuk sebagai ${userObj.role} (Simulasi Front-End)`,
      badgeClass: 'badge-primary'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    showToast(`Selamat datang, ${userObj.name}! Anda masuk sebagai ${userObj.role}.`, 'success');
  };

  const logout = () => {
    const actorName = currentUser?.name || 'Pengguna';
    const actorRole = currentUser?.role || currentRole;
    const newLog = {
      id: `AUD-${Date.now()}`,
      time: new Date().toISOString(),
      actor: actorName,
      role: actorRole,
      action: 'Logout dari Sistem',
      details: `${actorName} telah keluar dari sesi kerja POS`,
      badgeClass: 'badge-warning'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setCurrentUser(null);
    showToast('Anda telah keluar dari sistem POS.', 'info');
  };

  const addUser = (userData) => {
    const id = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser = {
      ...userData,
      id,
      status: 'Aktif',
      lastLogin: '-'
    };
    setUsers(prev => [...prev, newUser]);
    addAuditLog({
      action: 'Tambah Akun Pengguna',
      details: `Menambahkan akun baru "${newUser.name}" dengan peran ${newUser.role}`,
      badgeClass: 'badge-success'
    });
    showToast(`Akun pengguna "${newUser.name}" berhasil dibuat!`, 'success');
    return newUser;
  };

  const changePassword = ({ currentPassword, newPassword }) => {
    addAuditLog({
      action: 'Ubah Kata Sandi',
      details: `${currentUser?.name} berhasil memperbarui kata sandi akun (simulasi)`,
      badgeClass: 'badge-info'
    });
    showToast('Kata sandi berhasil diperbarui (Simulasi Lokal)!', 'success');
    return true;
  };

  // Aksi CRUD Produk
  const addProduct = (productData) => {
    const id = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    const newProduct = {
      ...productData,
      id,
      costPrice: Math.round(Number(productData.costPrice) || 0),
      sellingPrice: Math.round(Number(productData.sellingPrice) || 0),
      stock: Math.round(Number(productData.stock) || 0),
      minStock: Math.round(Number(productData.minStock) || 5)
    };

    setProducts(prev => [newProduct, ...prev]);

    // Catat mutasi stok awal jika ada stok
    if (newProduct.stock > 0) {
      const mutation = {
        id: `MUT-${Date.now()}`,
        time: new Date().toISOString(),
        productId: id,
        productName: newProduct.name,
        type: 'Stok Awal',
        qty: newProduct.stock,
        finalStock: newProduct.stock,
        actor: currentRole === 'Pemilik/Admin' ? 'Haji Lubis (Pemilik)' : 'Siti Rahma (Kasir)',
        notes: 'Pendaftaran produk baru di sistem'
      };
      setStockMutations(prev => [mutation, ...prev]);
    }

    showToast(`Produk "${newProduct.name}" berhasil ditambahkan!`, 'success');
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    let oldProduct = null;
    let newUpdated = null;

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        oldProduct = p;
        newUpdated = {
          ...p,
          ...updatedFields,
          costPrice: Math.round(Number(updatedFields.costPrice ?? p.costPrice) || 0),
          sellingPrice: Math.round(Number(updatedFields.sellingPrice ?? p.sellingPrice) || 0),
          stock: Math.round(Number(updatedFields.stock ?? p.stock) || 0),
          minStock: Math.round(Number(updatedFields.minStock ?? p.minStock) || 5)
        };
        return newUpdated;
      }
      return p;
    }));

    showToast(`Produk "${newUpdated?.name || id}" berhasil diperbarui!`, 'success');
    return newUpdated;
  };

  const deleteProduct = (id) => {
    const target = products.find(p => p.id === id);
    if (!target) return;

    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Produk "${target.name}" telah dihapus dari katalog!`, 'warning');
  };

  // Aksi Manajemen Stok
  const addStockInbound = ({ productId, qty, notes, source }) => {
    const numericQty = Math.round(Number(qty));
    if (numericQty <= 0) {
      showToast('Jumlah barang masuk harus lebih dari 0', 'danger');
      return false;
    }

    let updatedProduct = null;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const finalStock = p.stock + numericQty;
        updatedProduct = { ...p, stock: finalStock };
        return updatedProduct;
      }
      return p;
    }));

    if (updatedProduct) {
      const mutation = {
        id: `MUT-${Date.now()}`,
        time: new Date().toISOString(),
        productId,
        productName: updatedProduct.name,
        type: 'Barang Masuk',
        qty: numericQty,
        finalStock: updatedProduct.stock,
        actor: currentRole === 'Pemilik/Admin' ? 'Haji Lubis (Pemilik)' : 'Siti Rahma (Kasir)',
        notes: notes ? `${notes} (${source || 'Kulakan'})` : `Barang Masuk dari ${source || 'Kulakan'}`
      };
      setStockMutations(prev => [mutation, ...prev]);
      showToast(`Stok ${updatedProduct.name} bertambah +${numericQty} ${updatedProduct.unit}!`, 'success');

      // Simulasi Notifikasi WhatsApp untuk Barang Masuk (Fase 5)
      if (waConfig.notifyStockInbound) {
        sendSimulatedWaMessage({
          recipientName: waConfig.ownerName || 'Haji Lubis (Pemilik)',
          recipientPhone: waConfig.activeNumber,
          type: 'Barang Masuk',
          summary: `Restok: ${updatedProduct.name} (+${numericQty} ${updatedProduct.unit})`,
          content: `*WARUNG KLONTONG HAJI LUBIS*\n📦 *NOTIFIKASI BARANG MASUK*\n----------------------------------------\nProduk   : ${updatedProduct.name}\nJumlah   : +${numericQty} ${updatedProduct.unit}\nStok Baru: ${updatedProduct.stock} ${updatedProduct.unit}\nSumber   : ${source || 'Kulakan'}\nPencatat : ${currentRole === 'Pemilik/Admin' ? 'Haji Lubis (Pemilik)' : 'Siti Rahma (Kasir)'}\n----------------------------------------\n_Notifikasi otomatis simulasi POS Haji Lubis_`
        });
      }

      return true;
    }

    return false;
  };

  const adjustStockPhysical = ({ productId, finalStock, reason }) => {
    const numericFinal = Math.round(Number(finalStock));
    if (numericFinal < 0) {
      showToast('Stok tidak boleh bernilai negatif', 'danger');
      return false;
    }

    let targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return false;

    const diff = numericFinal - targetProduct.stock;
    if (diff === 0) {
      showToast('Nilai stok fisik sama dengan stok saat ini', 'warning');
      return false;
    }

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: numericFinal };
      }
      return p;
    }));

    const mutation = {
      id: `MUT-${Date.now()}`,
      time: new Date().toISOString(),
      productId,
      productName: targetProduct.name,
      type: 'Penyesuaian Fisik',
      qty: diff,
      finalStock: numericFinal,
      actor: currentRole === 'Pemilik/Admin' ? 'Haji Lubis (Pemilik)' : 'Siti Rahma (Kasir)',
      notes: reason || 'Penyesuaian stok fisik (Stock Opname)'
    };
    setStockMutations(prev => [mutation, ...prev]);
    showToast(`Stok ${targetProduct.name} disesuaikan menjadi ${numericFinal} ${targetProduct.unit}`, 'success');
    return true;
  };

    // Aksi Pengaturan dan Pengiriman Simulasi WhatsApp (Fase 5)
  const updateWaConfig = (newConfig) => {
    setWaConfig(prev => ({ ...prev, ...newConfig }));
    showToast('Pengaturan simulasi WhatsApp berhasil diperbarui!', 'success');
  };

  const sendSimulatedWaMessage = ({
    recipientName,
    recipientPhone,
    type = 'Pemberitahuan',
    summary,
    content,
    status = 'Terkirim'
  }) => {
    const newMsg = {
      id: `WA-MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time: new Date().toISOString(),
      type,
      recipientName: recipientName || waConfig.ownerName || 'Haji Lubis (Pemilik)',
      recipientPhone: recipientPhone || waConfig.activeNumber,
      status,
      summary: summary || `Notifikasi ${type}`,
      content
    };
    setWaLogs(prev => [newMsg, ...prev]);
    return newMsg;
  };

  const clearWaLogs = () => {
    setWaLogs([]);
    showToast('Riwayat pesan simulasi WhatsApp telah dibersihkan', 'warning');
  };

  // Aksi Transaksi Kasir (POS)
  const completeTransaction = ({ items, total, cash, change, customer, paymentMethod = 'Tunai' }) => {
    if (!items || items.length === 0) {
      return { success: false, error: 'Keranjang belanja masih kosong' };
    }

    const numericTotal = Math.round(Number(total));
    const numericCash = Math.round(Number(cash));

    if (numericCash < numericTotal) {
      return { success: false, error: 'Uang pembayaran kurang dari total belanja' };
    }

    // Periksa ketersediaan stok
    for (const item of items) {
      const prod = products.find(p => p.id === item.id);
      if (!prod) {
        return { success: false, error: `Produk "${item.name}" tidak ditemukan` };
      }
      if (prod.stock < item.qty) {
        return {
          success: false,
          error: `Stok "${prod.name}" tidak mencukupi (sisa: ${prod.stock}, diminta: ${item.qty})`
        };
      }
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const trxId = `TRX-${dateStr}-${String(transactions.length + 1).padStart(3, '0')}`;
    const cashierName = currentRole === 'Pemilik/Admin' ? 'Haji Lubis (Pemilik)' : 'Siti Rahma (Kasir)';

    const newTransaction = {
      id: trxId,
      time: now.toISOString(),
      customer: customer || 'Pelanggan Umum',
      cashier: cashierName,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        costPrice: i.costPrice,
        price: i.sellingPrice,
        subtotal: i.qty * i.sellingPrice,
        unit: i.unit
      })),
      total: numericTotal,
      cash: numericCash,
      change: Math.max(0, numericCash - numericTotal),
      paymentMethod,
      status: 'Selesai'
    };

    // Kurangi stok produk secara simultan & periksa peringatan stok menipis
    const newMutations = [];
    const lowStockAlerts = [];

    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const cartItem = items.find(i => i.id === prod.id);
        if (cartItem) {
          const newStock = Math.max(0, prod.stock - cartItem.qty);
          newMutations.push({
            id: `MUT-${Date.now()}-${prod.id}`,
            time: now.toISOString(),
            productId: prod.id,
            productName: prod.name,
            type: 'Penjualan POS',
            qty: -cartItem.qty,
            finalStock: newStock,
            actor: cashierName,
            notes: `Struk ${trxId}`
          });

          // Peringatan jika stok mencapai atau di bawah batas minimum
          if (newStock <= prod.minStock) {
            lowStockAlerts.push({
              code: prod.code,
              name: prod.name,
              stock: newStock,
              minStock: prod.minStock,
              unit: prod.unit
            });
          }

          return { ...prod, stock: newStock };
        }
        return prod;
      });
    });

    setStockMutations(prev => [...newMutations, ...prev]);
    setTransactions(prev => [newTransaction, ...prev]);

    // Simulasi Notifikasi Otomatis WhatsApp ke Pemilik (Fase 5)
    if (waConfig.notifyOwnerOnSale) {
      const itemsListText = items.map(i => `• ${i.qty}x ${i.name} (Rp ${(i.qty * i.sellingPrice).toLocaleString('id-ID')})`).join('\n');
      const waMsgContent = `*WARUNG KLONTONG HAJI LUBIS*\n🔔 *NOTIFIKASI TRANSAKSI BARU*\n----------------------------------------\nNo. Struk : ${trxId}\nWaktu     : ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB\nKasir     : ${cashierName}\nPelanggan : ${customer || 'Pelanggan Umum'}\n\nRincian Belanja:\n${itemsListText}\n\n*Total Belanja : Rp ${numericTotal.toLocaleString('id-ID')}*\nMetode Bayar  : ${paymentMethod}\n----------------------------------------\n_Pesan otomatis simulasi POS Haji Lubis_`;

      sendSimulatedWaMessage({
        recipientName: waConfig.ownerName || 'Haji Lubis (Pemilik)',
        recipientPhone: waConfig.activeNumber,
        type: 'Transaksi POS',
        summary: `Transaksi Baru ${trxId} (${customer || 'Pelanggan Umum'}) - Rp ${numericTotal.toLocaleString('id-ID')}`,
        content: waMsgContent
      });
    }

    // Simulasi Peringatan Stok Menipis ke Pemilik jika ada produk yang menipis (Fase 5)
    if (waConfig.notifyLowStock && lowStockAlerts.length > 0) {
      lowStockAlerts.forEach(alertItem => {
        const stockContent = `*WARUNG KLONTONG HAJI LUBIS*\n⚠️ *PERINGATAN STOK MENIPIS*\n----------------------------------------\nKode Produk : ${alertItem.code}\nNama Produk : ${alertItem.name}\nStok Saat Ini: *${alertItem.stock} ${alertItem.unit}*\nBatas Minimal: ${alertItem.minStock} ${alertItem.unit}\n\nStatus: *Stok Kritis / Perlu Kulakan*\nDisarankan segera menambah persediaan barang ini.\n----------------------------------------\n_Sistem Notifikasi Otomatis POS Haji Lubis_`;

        sendSimulatedWaMessage({
          recipientName: waConfig.ownerName || 'Haji Lubis (Pemilik)',
          recipientPhone: waConfig.activeNumber,
          type: 'Peringatan Stok',
          summary: `Peringatan Stok: ${alertItem.name} tersisa ${alertItem.stock} ${alertItem.unit}`,
          content: stockContent
        });
      });
    }

    showToast(`Transaksi ${trxId} berhasil diselesaikan!`, 'success');
    return { success: true, transaction: newTransaction };
  };

  // Aksi Pembatalan Transaksi (Memerlukan Peran Pemilik/Admin)
  const cancelTransaction = (transactionId, cancelReason) => {
    if (currentRole !== 'Pemilik/Admin') {
      showToast('Akses ditolak: Hanya Pemilik/Admin yang berhak membatalkan transaksi', 'danger');
      return { success: false, error: 'Akses ditolak' };
    }

    const trx = transactions.find(t => t.id === transactionId);
    if (!trx) {
      return { success: false, error: 'Transaksi tidak ditemukan' };
    }

    if (trx.status === 'Dibatalkan') {
      return { success: false, error: 'Transaksi sudah dibatalkan sebelumnya' };
    }

    const now = new Date();
    const actor = 'Haji Lubis (Pemilik)';

    // Update status transaksi
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: 'Dibatalkan',
          cancelReason: cancelReason || 'Dibatalkan oleh Pemilik',
          canceledAt: now.toISOString(),
          canceledBy: actor
        };
      }
      return t;
    }));

    // Kembalikan stok barang yang dibeli
    const restockMutations = [];
    setProducts(prev => prev.map(prod => {
      const item = trx.items.find(i => i.id === prod.id || i.name === prod.name);
      if (item) {
        const restoredStock = prod.stock + item.qty;
        restockMutations.push({
          id: `MUT-${Date.now()}-${prod.id}`,
          time: now.toISOString(),
          productId: prod.id,
          productName: prod.name,
          type: 'Pembatalan Transaksi',
          qty: item.qty,
          finalStock: restoredStock,
          actor,
          notes: `Batal ${transactionId}: ${cancelReason || 'Dibatalkan'}`
        });
        return { ...prod, stock: restoredStock };
      }
      return prod;
    }));

    setStockMutations(prev => [...restockMutations, ...prev]);
    showToast(`Transaksi ${transactionId} berhasil dibatalkan dan stok telah dikembalikan!`, 'warning');
    return { success: true };
  };

  const contextValue = useMemo(() => ({
    products,
    transactions,
    stockMutations,
    currentRole,
    setCurrentRole,
    activeMenu,
    setActiveMenu,
    toast,
    showToast,
    closeToast,
    addProduct,
    updateProduct,
    deleteProduct,
    addStockInbound,
    adjustStockPhysical,
    completeTransaction,
    cancelTransaction,
    waConfig,
    waLogs,
    updateWaConfig,
    sendSimulatedWaMessage,
    clearWaLogs,
    currentUser,
    setCurrentUser,
    users,
    auditLogs,
    login,
    logout,
    addUser,
    changePassword,
    addAuditLog
  }), [
    products,
    transactions,
    stockMutations,
    currentRole,
    activeMenu,
    toast,
    waConfig,
    waLogs,
    currentUser,
    users,
    auditLogs
  ]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
