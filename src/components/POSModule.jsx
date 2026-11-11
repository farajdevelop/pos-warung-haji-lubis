import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Receipt,
  Printer,
  RotateCcw,
  AlertCircle,
  Tag,
  User,
  ArrowRight,
  ScanBarcode,
  Camera,
  CameraOff,
  SwitchCamera,
  MessageSquare,
  Send,
  Check,
  ChevronLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatIDR, formatDateID, getStockStatus } from '../utils/formatters';
import { CATEGORIES, DEMO_INFO } from '../data/dummyData';

export default function POSModule() {
  const { products, completeTransaction, currentRole, sendSimulatedWaMessage, waConfig, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Pelanggan Umum');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [lastReceipt, setLastReceipt] = useState(null);

  // Mobile View Switcher ('catalog' | 'cart')
  const [mobileView, setMobileView] = useState('catalog');

  // Hybrid Barcode Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannerStatus, setScannerStatus] = useState('Siap memindai barcode');
  const [cameraFacing, setCameraFacing] = useState('Belakang (Utama)');
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const lastScannedTimeRef = useRef(0);

  // Receipt WhatsApp Simulation State
  const [waCustomerPhone, setWaCustomerPhone] = useState('0856-7890-1234');
  const [waReceiptSent, setWaReceiptSent] = useState(false);

  // Real Camera Lifecycle Effect
  useEffect(() => {
    if (!isScannerOpen) {
      return;
    }

    let activeStream = null;
    let detectInterval = null;

    const startCamera = async () => {
      try {
        setIsCameraLoading(true);
        setCameraError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Akses kamera tidak didukung peramban atau protokol bukan HTTPS');
        }

        const constraints = {
          video: {
            facingMode: cameraFacing.includes('Belakang') ? { ideal: 'environment' } : 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (e) {
            // play caught
          }
        }

        setIsCameraLoading(false);
        setScannerStatus('Kamera aktif • Arahkan barcode ke kotak pemindai');

        // Otomatis Deteksi Barcode jika peramban mendukung BarcodeDetector API (Chrome/Edge/Android)
        if ('BarcodeDetector' in window) {
          try {
            const detector = new window.BarcodeDetector({
              formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'qr_code']
            });

            detectInterval = setInterval(async () => {
              if (videoRef.current && videoRef.current.readyState === 4) {
                try {
                  const detected = await detector.detect(videoRef.current);
                  if (detected && detected.length > 0) {
                    const now = Date.now();
                    if (now - lastScannedTimeRef.current > 2000) {
                      lastScannedTimeRef.current = now;
                      const rawCode = detected[0].rawValue;
                      if (rawCode) {
                        handleScanBarcode(rawCode);
                      }
                    }
                  }
                } catch (detErr) {
                  // ignore frame error
                }
              }
            }, 300);
          } catch (initErr) {
            console.warn('BarcodeDetector not available:', initErr);
          }
        }
      } catch (err) {
        console.warn('Camera error:', err);
        setIsCameraLoading(false);
        setCameraError('Kamera tidak aktif / izin belum diberikan. Silakan gunakan tombol simulasi barcode di bawah atau izinkan kamera di browser.');
        setScannerStatus('Kamera tidak aktif • Silakan gunakan tombol sampel barcode di bawah');
      }
    };

    startCamera();

    return () => {
      if (detectInterval) clearInterval(detectInterval);
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isScannerOpen, cameraFacing]);

  // Web Audio API Synthesizer Beep Feedback
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCat = selectedCategory === 'Semua' || product.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q) ||
        (product.barcode && product.barcode.includes(q));
      return matchCat && matchSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart totals
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty * item.sellingPrice, 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }, [cart]);

  const numericCash = Math.round(Number(paymentAmount) || 0);
  const changeAmount = Math.max(0, numericCash - totalAmount);
  const isCashSufficient = numericCash >= totalAmount && totalAmount > 0;

  // Add to cart
  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;

    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          return prevCart;
        }
        return prevCart.map(i =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  // Handle Barcode Scan (via camera simulation or manual input)
  const handleScanBarcode = (barcodeToScan) => {
    const code = (barcodeToScan || manualBarcode).trim();
    if (!code) return;

    const matchedProduct = products.find(
      p => (p.barcode && p.barcode === code) || p.code.toLowerCase() === code.toLowerCase()
    );

    if (matchedProduct) {
      if (matchedProduct.stock <= 0) {
        setScannerStatus(`⚠️ Produk "${matchedProduct.name}" stok habis!`);
        showToast(`Stok "${matchedProduct.name}" habis!`, 'danger');
        return;
      }

      playBeep();
      handleAddToCart(matchedProduct);
      setScannerStatus(`✓ Berhasil scan: ${matchedProduct.name} (+1 di keranjang)`);
      showToast(`Scan Barcode: ${matchedProduct.name} masuk keranjang!`, 'success');
      setManualBarcode('');
    } else {
      setScannerStatus(`❌ Barcode "${code}" tidak ditemukan pada katalog produk!`);
      showToast(`Barcode "${code}" belum terdaftar!`, 'danger');
    }
  };

  // Modify quantity
  const handleUpdateQty = (productId, delta) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.id === productId) {
            const prod = products.find(p => p.id === productId);
            const newQty = item.qty + delta;
            if (newQty <= 0) return null;
            if (prod && newQty > prod.stock) return item;
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(i => i.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setPaymentAmount('');
    setPaymentError('');
  };

  // Quick Pay helper
  const handleQuickPay = (nominal) => {
    setPaymentAmount(String(nominal));
    setPaymentError('');
  };

  // Submit transaction
  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setPaymentError('Keranjang belanja masih kosong!');
      return;
    }

    if (numericCash < totalAmount) {
      setPaymentError(`Uang bayar kurang ${formatIDR(totalAmount - numericCash)}`);
      return;
    }

    const result = completeTransaction({
      items: cart,
      total: totalAmount,
      cash: numericCash,
      change: changeAmount,
      customer: customerName.trim() || 'Pelanggan Umum',
      paymentMethod: 'Tunai'
    });

    if (result.success) {
      setLastReceipt(result.transaction);
      setWaReceiptSent(false);
      setCart([]);
      setPaymentAmount('');
      setPaymentError('');
      setMobileView('catalog'); // reset mobile view
    } else {
      setPaymentError(result.error);
    }
  };

  // Send Receipt to Customer via WhatsApp Simulation
  const handleSendWaReceipt = () => {
    if (!lastReceipt) return;
    if (!waCustomerPhone.trim()) {
      showToast('Nomor WhatsApp pelanggan tidak boleh kosong', 'danger');
      return;
    }

    const itemsText = lastReceipt.items.map(i => `• ${i.qty}x ${i.name} (${formatIDR(i.subtotal)})`).join('\n');
    const waContent = `*WARUNG KLONTONG HAJI LUBIS*\n🧾 *STRUK BELANJA DIGITAL*\nJl. Raya Penggilingan No. 42, Cakung\nTelp: ${DEMO_INFO.phoneDemo}\n----------------------------------------\nNo. Struk : ${lastReceipt.id}\nTanggal   : ${formatDateID(lastReceipt.time, true)}\nKasir     : ${lastReceipt.cashier}\nPelanggan : ${lastReceipt.customer}\n\nRincian Belanja:\n${itemsText}\n\n*TOTAL BELANJA : ${formatIDR(lastReceipt.total)}*\nBayar (Tunai) : ${formatIDR(lastReceipt.cash)}\n*Kembalian     : ${formatIDR(lastReceipt.change)}*\n----------------------------------------\nTerima kasih telah berbelanja di Warung Klontong Haji Lubis! Simpan struk digital ini sebagai bukti belanja Anda yang sah.`;

    sendSimulatedWaMessage({
      recipientName: lastReceipt.customer,
      recipientPhone: waCustomerPhone,
      type: 'Struk Digital',
      summary: `Struk Digital ${lastReceipt.id} (${formatIDR(lastReceipt.total)}) ke ${lastReceipt.customer}`,
      content: waContent
    });

    setWaReceiptSent(true);
    showToast(`Struk berhasil dikirim ke WhatsApp ${waCustomerPhone} (Simulasi)!`, 'success');
  };

  return (
    <div className="pos-wrapper">
      {/* Mobile Screen Segment Navigation */}
      <div className="pos-mobile-nav">
        <button
          type="button"
          className={`pos-nav-pill ${mobileView === 'catalog' ? 'active' : ''}`}
          onClick={() => setMobileView('catalog')}
        >
          <span>🛍️ Katalog ({filteredProducts.length})</span>
        </button>
        <button
          type="button"
          className={`pos-nav-pill ${mobileView === 'cart' ? 'active' : ''}`}
          onClick={() => setMobileView('cart')}
        >
          <span>🛒 Keranjang ({totalItemsCount})</span>
          {totalAmount > 0 && <span className="pos-nav-amount">{formatIDR(totalAmount)}</span>}
        </button>
      </div>

      <div className={`pos-layout mobile-${mobileView}`}>
        {/* LEFT: Product Catalog & Search */}
        <div className={`pos-catalog-section ${mobileView === 'cart' ? 'hide-on-mobile' : ''}`}>
          {/* Top Filter & Search Bar with Hybrid Barcode Button */}
          <div className="pos-search-bar-wrap">
            <div className="pos-search-input-box">
              <Search size={18} className="pos-search-icon" />
              <input
                type="text"
                className="pos-search-input"
                placeholder="Cari nama produk, kode, atau scan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="pos-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  &times;
                </button>
              )}

              {/* Hybrid Barcode Trigger Button */}
              <button
                type="button"
                className="btn-barcode-scan"
                onClick={() => setIsScannerOpen(true)}
                title="Buka Kamera / Barcode Scanner Hybrid"
              >
                <ScanBarcode size={17} />
                <span className="barcode-btn-label">Scan Barcode</span>
              </button>
            </div>

            <div className="category-pills-scroll">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="pos-products-grid">
            {filteredProducts.length === 0 ? (
              <div className="pos-empty-catalog">
                <AlertCircle size={36} className="text-muted" />
                <p>Tidak ada produk yang sesuai dengan pencarian atau filter "{selectedCategory}".</p>
              </div>
            ) : (
              filteredProducts.map(product => {
                const status = getStockStatus(product.stock, product.minStock);
                const inCartItem = cart.find(i => i.id === product.id);
                const isOutOfStock = product.stock <= 0;
                const isMaxInCart = inCartItem && inCartItem.qty >= product.stock;

                return (
                  <div
                    key={product.id}
                    className={`pos-product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
                    onClick={() => !isOutOfStock && !isMaxInCart && handleAddToCart(product)}
                  >
                    <div className="prod-card-top">
                      <span className="prod-code">{product.code}</span>
                      <span className={`badge ${status.badgeClass}`}>
                        {status.label} ({product.stock} {product.unit})
                      </span>
                    </div>

                    <h4 className="prod-name">{product.name}</h4>
                    <span className="prod-category">{product.category}</span>

                    <div className="prod-card-bottom">
                      <span className="prod-price">{formatIDR(product.sellingPrice)}</span>
                      <button
                        type="button"
                        className={`prod-add-btn ${isOutOfStock || isMaxInCart ? 'disabled' : ''}`}
                        disabled={isOutOfStock || isMaxInCart}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        title={isOutOfStock ? 'Stok Habis' : isMaxInCart ? 'Maksimal Stok di Keranjang' : 'Tambah ke Keranjang'}
                      >
                        {isOutOfStock ? 'Habis' : isMaxInCart ? 'Maks' : <Plus size={16} />}
                      </button>
                    </div>

                    {inCartItem && (
                      <div className="in-cart-indicator">
                        {inCartItem.qty} di keranjang
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Dynamic Cart & Checkout */}
        <div className={`pos-cart-section ${mobileView === 'catalog' ? 'hide-on-mobile' : ''}`}>
          {/* Mobile Back to Catalog Button */}
          <div className="cart-mobile-back-row">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setMobileView('catalog')}
            >
              <ChevronLeft size={16} />
              <span>Kembali ke Katalog Produk</span>
            </button>
          </div>

          <div className="cart-header">
            <div className="cart-title-row">
              <div className="cart-title-wrap">
                <ShoppingCart size={20} className="text-blue" />
                <h3 className="cart-title">Keranjang Kasir</h3>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  className="cart-clear-btn"
                  onClick={handleClearCart}
                  title="Kosongkan Keranjang"
                >
                  <Trash2 size={14} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="customer-input-wrap">
              <User size={14} className="text-muted" />
              <input
                type="text"
                className="customer-input"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Pelanggan (opsional)"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="cart-items-container">
            {cart.length === 0 ? (
              <div className="cart-empty-state">
                <ShoppingCart size={40} className="empty-cart-icon" />
                <p className="empty-title">Keranjang Masih Kosong</p>
                <p className="empty-sub">Pilih produk dari katalog atau scan barcode untuk memulai transaksi.</p>
              </div>
            ) : (
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-unit-price">
                        {formatIDR(item.sellingPrice)} / {item.unit}
                      </span>
                    </div>

                    <div className="cart-item-actions">
                      <div className="qty-counter">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-value">{item.qty}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          aria-label="Tambah kuantitas"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="cart-item-subtotal">
                        {formatIDR(item.qty * item.sellingPrice)}
                      </span>

                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => handleRemoveFromCart(item.id)}
                        title="Hapus dari keranjang"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary & Payment Form */}
          <div className="cart-footer">
            <div className="cart-summary-box">
              <div className="summary-row">
                <span className="text-muted">Total Jumlah Barang:</span>
                <span className="font-semibold">{totalItemsCount} pcs</span>
              </div>
              <div className="summary-row total-row">
                <span className="total-label">Total Belanja:</span>
                <span className="total-value">{formatIDR(totalAmount)}</span>
              </div>
            </div>

            {/* Payment Input Form */}
            <form onSubmit={handleCheckout} className="payment-form">
              <div className="form-group">
                <label className="form-label font-semibold">Uang Pembayaran (Tunai)</label>
                <div className="cash-input-wrap">
                  <span className="cash-currency-prefix">Rp</span>
                  <input
                    type="number"
                    className="cash-input"
                    placeholder="0"
                    min="0"
                    step="500"
                    value={paymentAmount}
                    onChange={(e) => {
                      setPaymentAmount(e.target.value);
                      setPaymentError('');
                    }}
                  />
                </div>
              </div>

              {/* Quick Nominal Buttons */}
              <div className="quick-pay-buttons">
                <button
                  type="button"
                  className="quick-pay-btn"
                  onClick={() => handleQuickPay(totalAmount)}
                  disabled={totalAmount === 0}
                >
                  Uang Pas
                </button>
                {[10000, 20000, 50000, 100000].map(nominal => (
                  <button
                    key={nominal}
                    type="button"
                    className="quick-pay-btn"
                    onClick={() => handleQuickPay(nominal)}
                  >
                    {nominal / 1000}rb
                  </button>
                ))}
              </div>

              {/* Change Calculation Box */}
              {numericCash > 0 && totalAmount > 0 && (
                <div className={`change-calc-box ${isCashSufficient ? 'sufficient' : 'insufficient'}`}>
                  {isCashSufficient ? (
                    <div className="change-row">
                      <span>Kembalian Kasir:</span>
                      <strong className="change-value">{formatIDR(changeAmount)}</strong>
                    </div>
                  ) : (
                    <div className="change-row text-danger">
                      <span>Uang Kurang:</span>
                      <strong>{formatIDR(totalAmount - numericCash)}</strong>
                    </div>
                  )}
                </div>
              )}

              {paymentError && (
                <div className="payment-error-alert">
                  <AlertCircle size={14} />
                  <span>{paymentError}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-checkout"
                disabled={cart.length === 0 || !isCashSufficient}
              >
                <span>Selesaikan Transaksi (Bayar)</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Bottom Cart Pill on Mobile when in Catalog View */}
      {mobileView === 'catalog' && cart.length > 0 && (
        <div className="pos-mobile-floating-bar" onClick={() => setMobileView('cart')}>
          <div className="floating-cart-info">
            <div className="floating-cart-badge">
              <ShoppingCart size={16} />
              <span>{totalItemsCount} Item</span>
            </div>
            <strong className="floating-cart-total">{formatIDR(totalAmount)}</strong>
          </div>
          <button type="button" className="btn btn-warning btn-sm floating-cart-btn">
            <span>Buka Keranjang</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* HYBRID BARCODE SCANNER MODAL */}
      {isScannerOpen && (
        <div className="modal-backdrop">
          <div className="modal-content modal-md barcode-modal">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <ScanBarcode size={20} className="text-primary" />
                <h3 className="modal-title">Hybrid Barcode Scanner</h3>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm text-danger"
                onClick={() => setIsScannerOpen(false)}
                title="Batal memindai barcode"
              >
                &times; <span>Batal / Tutup</span>
              </button>
            </div>

            <div className="modal-body">
              {/* Live Camera Viewport */}
              <div className="camera-viewfinder-box">
                <div className="camera-video-container">
                  {/* Live Video Feed */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`scanner-live-video ${cameraError || isCameraLoading ? 'hidden' : ''}`}
                  />

                  {/* Loading State Overlay */}
                  {isCameraLoading && (
                    <div className="camera-state-overlay">
                      <RotateCcw className="spin text-blue mb-2" size={24} />
                      <span>Menghubungkan ke kamera peramban...</span>
                    </div>
                  )}

                  {/* Error / Permission State Overlay */}
                  {cameraError && !isCameraLoading && (
                    <div className="camera-state-overlay error">
                      <CameraOff size={30} className="text-warning mb-2" />
                      <span className="font-semibold">{cameraError}</span>
                      <span className="text-xs text-muted mt-1 px-4">
                        (Jika kamera laptop/HP tidak aktif, gunakan tombol sampel barcode di bawah)
                      </span>
                    </div>
                  )}

                  {/* Glowing Laser Scan Line Animation */}
                  <div className="scanner-laser-line"></div>

                  {/* Viewfinder Target Reticle Frame */}
                  <div className="scanner-reticle-box">
                    <span className="reticle-corner top-left"></span>
                    <span className="reticle-corner top-right"></span>
                    <span className="reticle-corner bottom-left"></span>
                    <span className="reticle-corner bottom-right"></span>
                  </div>

                  <div className="camera-overlay-info">
                    <Camera size={14} />
                    <span>Arahkan kamera ke barcode produk</span>
                  </div>
                </div>

                <div className="camera-controls-bar">
                  <div className="camera-mode-badge">
                    <span>Kamera: <strong>{cameraFacing}</strong></span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={() => {
                        setCameraFacing(prev => prev.includes('Belakang') ? 'Depan (Selfie)' : 'Belakang (Utama)');
                        showToast('Mengganti sumber kamera...', 'info');
                      }}
                    >
                      <SwitchCamera size={13} />
                      <span>Ganti Kamera</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      onClick={() => setIsScannerOpen(false)}
                    >
                      <span>Batal Scan</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="scanner-status-banner">
                <span>{scannerStatus}</span>
              </div>

              {/* Quick Sample Barcodes (Simulasi Scan Produk Pabrik) */}
              <div className="scanner-quick-test-section">
                <label className="form-label text-xs font-semibold">
                  Uji Coba Cepat Barcode Produk (Simulasi Kamera Membaca Barcode):
                </label>
                <div className="quick-barcodes-grid">
                  <button
                    type="button"
                    className="quick-barcode-pill"
                    onClick={() => handleScanBarcode('8999999999999')}
                  >
                    <span>🍜 Indomie Goreng (8999999999999)</span>
                  </button>
                  <button
                    type="button"
                    className="quick-barcode-pill"
                    onClick={() => handleScanBarcode('8992753211111')}
                  >
                    <span>🍬 Gulaku 1kg (8992753211111)</span>
                  </button>
                  <button
                    type="button"
                    className="quick-barcode-pill"
                    onClick={() => handleScanBarcode('8998866200222')}
                  >
                    <span>💧 Aqua 600ml (8998866200222)</span>
                  </button>
                  <button
                    type="button"
                    className="quick-barcode-pill"
                    onClick={() => handleScanBarcode('8991001100011')}
                  >
                    <span>🍳 Bimoli 2L (8991001100011)</span>
                  </button>
                  <button
                    type="button"
                    className="quick-barcode-pill"
                    onClick={() => handleScanBarcode('8992888320011')}
                  >
                    <span>🧴 Sunlight 750ml (8992888320011)</span>
                  </button>
                </div>
              </div>

              {/* Manual Input Fallback */}
              <div className="scanner-manual-fallback">
                <label className="form-label text-xs font-semibold">
                  Atau Input Manual Barcode / Kode Produk (Tanpa Kamera):
                </label>
                <div className="manual-barcode-input-row">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ketik angka barcode atau kode misal: PRD-001..."
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleScanBarcode();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleScanBarcode()}
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <span className="text-xs text-muted">
                Ditenagai library front-end JS (html5-qrcode ready) • 100% Client-side
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsScannerOpen(false)}
              >
                Batal & Tutup Scanner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL DIALOG WITH DIGITAL WHATSAPP STRUK */}
      {lastReceipt && (
        <div className="modal-backdrop">
          <div className="receipt-modal">
            <div className="receipt-modal-header">
              <div className="receipt-badge-success">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="receipt-modal-title">Transaksi Berhasil Diselesaikan!</h3>
              <p className="receipt-modal-subtitle">Struk telah tercatat di memori lokal & stok telah dikurangi</p>
            </div>

            <div className="receipt-paper">
              <div className="receipt-store-header">
                <h4 className="receipt-store-name">{DEMO_INFO.storeName}</h4>
                <p>{DEMO_INFO.address}</p>
                <p>Telp: {DEMO_INFO.phoneDemo}</p>
              </div>

              <div className="receipt-divider-dash"></div>

              <div className="receipt-meta-grid">
                <div>No: <strong>{lastReceipt.id}</strong></div>
                <div>Waktu: {formatDateID(lastReceipt.time, true)}</div>
                <div>Kasir: {lastReceipt.cashier}</div>
                <div>Pelanggan: {lastReceipt.customer}</div>
              </div>

              <div className="receipt-divider-dash"></div>

              <div className="receipt-items-list">
                {lastReceipt.items.map((item, idx) => (
                  <div key={idx} className="receipt-item-row">
                    <div className="r-item-name">
                      {item.name}
                      <span className="r-item-detail">
                        {item.qty} x {formatIDR(item.price)}
                      </span>
                    </div>
                    <div className="r-item-subtotal">{formatIDR(item.subtotal)}</div>
                  </div>
                ))}
              </div>

              <div className="receipt-divider-dash"></div>

              <div className="receipt-totals-box">
                <div className="r-total-row bold">
                  <span>TOTAL:</span>
                  <span>{formatIDR(lastReceipt.total)}</span>
                </div>
                <div className="r-total-row">
                  <span>BAYAR (Tunai):</span>
                  <span>{formatIDR(lastReceipt.cash)}</span>
                </div>
                <div className="r-total-row text-success bold">
                  <span>KEMBALIAN:</span>
                  <span>{formatIDR(lastReceipt.change)}</span>
                </div>
              </div>

              <div className="receipt-divider-dash"></div>
              <p className="receipt-thankyou">-- TERIMA KASIH ATAS KUNJUNGAN ANDA --</p>
              <p className="receipt-demo-note">(Struk Simulasi Front-End)</p>
            </div>

            {/* WA Digital Receipt Simulation Section */}
            {waConfig.sendCustomerReceipt && (
              <div className="receipt-wa-share-card">
                <div className="wa-share-header">
                  <MessageSquare size={16} className="text-success" />
                  <strong>Kirim Struk Digital ke WhatsApp Pelanggan (Simulasi)</strong>
                </div>

                <div className="wa-share-input-row">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Nomor WA Pelanggan (08xx-xxxx-xxxx)"
                    value={waCustomerPhone}
                    onChange={(e) => setWaCustomerPhone(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={handleSendWaReceipt}
                    disabled={waReceiptSent}
                  >
                    {waReceiptSent ? (
                      <>
                        <Check size={14} />
                        <span>Terkirim ke Log WA!</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Kirim Struk WA</span>
                      </>
                    )}
                  </button>
                </div>
                {waReceiptSent && (
                  <span className="text-xs text-success font-semibold mt-1 block">
                    ✓ Struk tersimpan di tab Riwayat WhatsApp Gateway
                  </span>
                )}
              </div>
            )}

            <div className="receipt-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.print()}
                title="Cetak struk via dialog cetak browser"
              >
                <Printer size={16} />
                <span>Cetak Struk (Simulasi)</span>
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setLastReceipt(null)}
              >
                <Plus size={16} />
                <span>Transaksi Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
