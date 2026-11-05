import React from 'react';
import { Menu, Sparkles, Calendar, LogOut, ShieldCheck, UserCheck } from 'lucide-react';
import { formatDateID } from '../utils/formatters';
import { useStore } from '../context/StoreContext';

export default function Topbar({
  activeMenu,
  menuItems,
  onOpenSidebar,
  currentRole
}) {
  const { currentUser, logout } = useStore();
  const currentMenuItem = menuItems.find(m => m.id === activeMenu) || menuItems[0];
  const currentDate = new Date('2026-10-16T13:10:00');

  const handleLogout = () => {
    if (window.confirm(`Keluar dari sesi ${currentUser?.name || currentRole}? Anda akan kembali ke halaman login.`)) {
      logout();
    }
  };

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button
          className="topbar-toggle-btn"
          onClick={onOpenSidebar}
          aria-label="Buka navigasi menu"
        >
          <Menu size={22} />
        </button>

        <div className="topbar-breadcrumbs">
          <span className="crumb-root">POS Warung</span>
          <span className="crumb-separator">/</span>
          <h1 className="crumb-current">{currentMenuItem.label}</h1>
        </div>
      </div>

      <div className="topbar-right">
        {/* Indonesian Date Badge */}
        <div className="topbar-date-badge">
          <Calendar size={14} />
          <span>{formatDateID(currentDate, false)}</span>
        </div>

        {/* Prominent Demo Badge */}
        <div className="demo-badge-pill" title="Semua data tersimpan secara lokal pada sesi browser">
          <Sparkles size={14} className="demo-sparkle-icon" />
          <span>Mode Demo</span>
        </div>

        {/* Active User Info & Role Tag */}
        <div className="topbar-user-badge">
          <div className="topbar-avatar">
            {currentRole === 'Pemilik/Admin' ? (
              <ShieldCheck size={15} className="text-primary" />
            ) : (
              <UserCheck size={15} className="text-success" />
            )}
          </div>
          <div className="topbar-user-text">
            <span className="topbar-user-name">{currentUser?.name || currentRole}</span>
            <span className="topbar-user-role">{currentRole}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          className="topbar-logout-btn"
          onClick={handleLogout}
          title="Keluar / Ganti Akun Pengguna"
        >
          <LogOut size={15} />
          <span className="logout-btn-label">Keluar</span>
        </button>
      </div>
    </header>
  );
}
