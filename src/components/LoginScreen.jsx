import React, { useState } from 'react';
import {
  Store,
  ShieldCheck,
  UserCheck,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertTriangle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEMO_INFO } from '../data/dummyData';

export default function LoginScreen() {
  const { users, login, showToast } = useStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'form'
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Quick Login
  const handleQuickLogin = (roleName) => {
    const targetUser = users.find(u => u.role === roleName) || users[0];
    login(targetUser);
  };

  // Handle Form Login
  const handleFormLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim().toLowerCase();
    const matched = users.find(
      u => (u.username && u.username.toLowerCase() === trimmedUser) ||
           u.name.toLowerCase().includes(trimmedUser)
    );

    if (matched) {
      login(matched);
    } else {
      setErrorMsg('Nama pengguna tidak ditemukan. Coba ketik "admin" atau "kasir".');
      showToast('Gagal masuk: Pengguna tidak ditemukan', 'danger');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo-box">
            <Store size={32} className="login-logo-icon" />
          </div>
          <h1 className="login-brand-title">
            <span>Warung Klontong</span>
            <span className="brand-badge-red">Haji Lubis</span>
          </h1>
          <p className="login-brand-tagline">
            Sistem Point of Sale (POS) & Manajemen Warung Modern
          </p>
        </div>

        {/* Demo Warning Banner */}
        <div className="demo-alert-banner login-alert">
          <AlertTriangle size={18} className="alert-icon" />
          <div className="alert-text">
            <strong>Mode Simulasi Front-End (Fase 6):</strong> Halaman login ini adalah demonstrasi antarmuka klien. Tidak ada data sandi nyata atau server autentikasi eksternal. Silakan pilih akun di bawah untuk mencoba pemisahan peran.
          </div>
        </div>

        {/* Login Method Tabs */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            <Sparkles size={16} />
            <span>Pilih Akun Demo (1-Klik)</span>
          </button>
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            <KeyRound size={16} />
            <span>Ketik Username & Sandi</span>
          </button>
        </div>

        {/* METHOD 1: QUICK ROLE CARDS */}
        {activeTab === 'quick' && (
          <div className="quick-roles-container">
            {/* Card 1: Haji Lubis (Pemilik/Admin) */}
            <div className="role-login-card card-owner" onClick={() => handleQuickLogin('Pemilik/Admin')}>
              <div className="role-card-badge">
                <ShieldCheck size={14} />
                <span>Hak Akses Penuh</span>
              </div>

              <div className="role-avatar-row">
                <div className="role-avatar avatar-owner">
                  <span>HL</span>
                </div>
                <div>
                  <h3 className="role-user-name">Haji Lubis</h3>
                  <span className="role-title-tag tag-owner">Pemilik / Admin</span>
                </div>
              </div>

              <ul className="role-privilege-list">
                <li><CheckCircle2 size={13} className="text-success" /> Akses penuh ke seluruh 7 modul warung</li>
                <li><CheckCircle2 size={13} className="text-success" /> Melihat estimasi laba & laporan penjualan</li>
                <li><CheckCircle2 size={13} className="text-success" /> Berhak membatalkan transaksi & kelola stok</li>
                <li><CheckCircle2 size={13} className="text-success" /> Pengaturan WhatsApp Gateway & akun pengguna</li>
              </ul>

              <button
                type="button"
                className="btn btn-primary btn-block role-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickLogin('Pemilik/Admin');
                }}
              >
                <span>Masuk sebagai Pemilik</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 2: Siti Rahma (Kasir) */}
            <div className="role-login-card card-cashier" onClick={() => handleQuickLogin('Kasir')}>
              <div className="role-card-badge badge-cashier">
                <UserCheck size={14} />
                <span>Hak Akses Kasir</span>
              </div>

              <div className="role-avatar-row">
                <div className="role-avatar avatar-cashier">
                  <span>SR</span>
                </div>
                <div>
                  <h3 className="role-user-name">Siti Rahma</h3>
                  <span className="role-title-tag tag-cashier">Kasir Toko</span>
                </div>
              </div>

              <ul className="role-privilege-list">
                <li><CheckCircle2 size={13} className="text-success" /> Fokus transaksi meja kasir (POS) & scan barcode</li>
                <li><CheckCircle2 size={13} className="text-success" /> Katalog produk & input barang masuk (restok)</li>
                <li><span className="text-muted">•</span> <span className="text-muted">Menu WhatsApp Gateway dikunci (Privasi Pemilik)</span></li>
                <li><span className="text-muted">•</span> <span className="text-muted">Menu Pengguna & Pembatalan Transaksi dibatasi</span></li>
              </ul>

              <button
                type="button"
                className="btn btn-secondary btn-block role-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickLogin('Kasir');
                }}
              >
                <span>Masuk sebagai Kasir</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* METHOD 2: MANUAL FORM LOGIN */}
        {activeTab === 'form' && (
          <form onSubmit={handleFormLogin} className="login-form-box">
            <div className="form-group">
              <label className="form-label font-semibold">Nama Pengguna (Username)</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ketik 'admin' atau 'kasir'"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <span className="form-help">Petunjuk demo: gunakan <strong>admin</strong> (Pemilik) atau <strong>kasir</strong> (Kasir)</span>
            </div>

            <div className="form-group">
              <label className="form-label font-semibold">Kata Sandi (Password)</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="form-help">Petunjuk demo: ketik kata sandi apa saja (misal: <strong>admin123</strong>)</span>
            </div>

            {errorMsg && (
              <div className="payment-error-alert mb-4">
                <AlertTriangle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block btn-login-submit">
              <span>Masuk ke Sistem POS</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Login Footer */}
        <div className="login-footer">
          <span>{DEMO_INFO.storeName} • {DEMO_INFO.address}</span>
          <span className="text-muted text-xs block mt-1">
            Versi {DEMO_INFO.version} • Mode Simulasi Lokal (React + Vite)
          </span>
        </div>
      </div>
    </div>
  );
}

