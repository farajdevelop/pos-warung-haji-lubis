import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  FileBarChart,
  MessageSquare,
  Users,
  Store,
  X,
  ShieldCheck,
  UserCheck,
  Lock,
  LogOut
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pos', label: 'Kasir / POS', icon: ShoppingCart },
  { id: 'products', label: 'Produk & Barang', icon: Package },
  { id: 'stock', label: 'Manajemen Stok', icon: Boxes },
  { id: 'reports', label: 'Laporan Penjualan', icon: FileBarChart },
  { id: 'whatsapp', label: 'WhatsApp Gateway', icon: MessageSquare },
  { id: 'users', label: 'Pengguna & Akses', icon: Users },
];

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  isOpen,
  setIsOpen,
  currentRole,
  setCurrentRole
}) {
  const { currentUser, logout, showToast, users, login } = useStore();

  const handleMenuClick = (id) => {
    // Role restriction check for Kasir
    if (currentRole === 'Kasir' && (id === 'whatsapp' || id === 'users')) {
      showToast(`Akses Dibatasi: Menu ${id === 'whatsapp' ? 'WhatsApp Gateway' : 'Pengguna & Akses'} hanya untuk Pemilik/Admin`, 'danger');
      return;
    }

    setActiveMenu(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const toggleRole = () => {
    const nextRole = currentRole === 'Pemilik/Admin' ? 'Kasir' : 'Pemilik/Admin';
    const nextUser = users.find(u => u.role === nextRole) || { name: nextRole, role: nextRole };
    login(nextUser);
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi kasir? Anda akan kembali ke layar login.')) {
      logout();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <Store className="brand-icon" size={22} />
          </div>
          <div className="brand-info">
            <div className="brand-name">
              <span>Haji Lubis</span>
              <span className="brand-badge-red">POS</span>
            </div>
            <span className="brand-sub">Warung Klontong Modern</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Demo Indicator Notice */}
        <div className="sidebar-demo-notice">
          <span className="demo-dot"></span>
          <span>Mode Simulasi Front-End</span>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-group-title">Menu Utama</div>
          <ul className="nav-list">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              // Role restriction demo simulation indication
              const isRestrictedForCashier =
                currentRole === 'Kasir' &&
                (item.id === 'whatsapp' || item.id === 'users');

              return (
                <li key={item.id}>
                  <button
                    className={`nav-item ${isActive ? 'active' : ''} ${
                      isRestrictedForCashier ? 'restricted' : ''
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    title={isRestrictedForCashier ? 'Menu terkunci untuk peran Kasir' : item.label}
                  >
                    <Icon size={18} className="nav-icon" />
                    <span className="nav-text">{item.label}</span>
                    {isActive && <div className="nav-active-pip" />}
                    {isRestrictedForCashier && (
                      <span className="restricted-badge">
                        <Lock size={10} />
                        <span>Admin</span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom User & Role Section */}
        <div className="sidebar-footer">
          <div className="role-card">
            <div className="role-avatar">
              {currentRole === 'Pemilik/Admin' ? (
                <ShieldCheck size={20} />
              ) : (
                <UserCheck size={20} />
              )}
            </div>
            <div className="role-details">
              <span className="role-name">
                {currentUser?.name || (currentRole === 'Pemilik/Admin' ? 'Haji Lubis' : 'Siti Rahma')}
              </span>
              <span className="role-tag">{currentRole}</span>
            </div>
          </div>

          <div className="sidebar-actions-stack">
            <button
              className="role-switch-btn"
              onClick={toggleRole}
              title="Klik untuk beralih cepat peran simulasi"
            >
              Beralih ke: {currentRole === 'Pemilik/Admin' ? 'Kasir' : 'Pemilik/Admin'}
            </button>

            <button
              type="button"
              className="sidebar-logout-btn"
              onClick={handleLogout}
              title="Keluar ke halaman login"
            >
              <LogOut size={14} />
              <span>Keluar / Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
