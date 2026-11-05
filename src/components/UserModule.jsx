import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  UserCheck,
  KeyRound,
  History,
  Plus,
  Search,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  UserPlus,
  Clock,
  Filter,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatDateID } from '../utils/formatters';

export default function UserModule({ currentRole, setCurrentRole }) {
  const {
    users,
    addUser,
    currentUser,
    login,
    changePassword,
    auditLogs,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'password' | 'audit'

  // Modal Tambah User State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    username: '',
    role: 'Kasir',
    email: '',
    phone: '',
    status: 'Aktif'
  });

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState('');

  // Audit Logs Filter
  const [auditSearch, setAuditSearch] = useState('');
  const [auditRoleFilter, setAuditRoleFilter] = useState('Semua');

  // Handle Add User Submit
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.username.trim()) {
      showToast('Nama dan username tidak boleh kosong', 'danger');
      return;
    }

    addUser({
      name: newUserData.name.trim(),
      username: newUserData.username.trim().toLowerCase(),
      role: newUserData.role,
      email: newUserData.email.trim() || `${newUserData.username.toLowerCase()}@warungdemo.id`,
      phone: newUserData.phone.trim() || '0812-0000-0000 (Demo)'
    });

    setIsAddUserModalOpen(false);
    setNewUserData({
      name: '',
      username: '',
      role: 'Kasir',
      email: '',
      phone: '',
      status: 'Aktif'
    });
  };

  // Handle Password Change Submit
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPassError('');

    if (!oldPassword.trim()) {
      setPassError('Kata sandi saat ini wajib diisi');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Kata sandi baru minimal terdiri dari 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi kata sandi baru tidak cocok');
      return;
    }

    changePassword({
      currentPassword: oldPassword,
      newPassword
    });

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log => {
      const matchRole = auditRoleFilter === 'Semua' || log.role === auditRoleFilter;
      const q = auditSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [auditLogs, auditRoleFilter, auditSearch]);

  const isOwner = currentRole === 'Pemilik/Admin';

  return (
    <div className="module-view">
      {/* Module Header */}
      <div className="module-header-box">
        <div className="module-icon-wrap icon-navy">
          <Users size={24} />
        </div>
        <div>
          <div className="module-phase-tag phase-active">Fase 6 Aktif — Manajemen Pengguna & Hak Akses</div>
          <h2 className="module-title">Manajemen Pengguna, Hak Akses & Audit Log</h2>
          <p className="module-desc">
            Pengelolaan akun kasir toko, pemisahan hak akses peran (Pemilik/Admin vs Kasir), formulir ganti kata sandi simulasi, dan pencatatan audit log aktivitas sistem.
          </p>
        </div>
      </div>

      {/* Demo Warning */}
      <div className="demo-alert-banner">
        <AlertTriangle size={18} className="alert-icon" />
        <div className="alert-text">
          <strong>Mode Simulasi Hak Akses (RBAC Front-End):</strong> Akun dan kata sandi di bawah ini adalah simulasi antarmuka klien. Tidak ada data sandi nyata atau server backend eksternal. Perubahan peran langsung memengaruhi menu dan aksi yang diizinkan.
        </div>
      </div>

      {/* Role Switcher & Active Account Banner */}
      <div className="user-active-card">
        <div className="user-active-left">
          <div className="active-user-avatar">
            {currentUser?.role === 'Pemilik/Admin' ? (
              <ShieldCheck size={24} className="text-primary" />
            ) : (
              <UserCheck size={24} className="text-success" />
            )}
          </div>
          <div>
            <div className="active-user-name">
              <span>{currentUser?.name || 'Haji Lubis'}</span>
              <span className={`badge ${currentUser?.role === 'Pemilik/Admin' ? 'badge-primary' : 'badge-success'}`}>
                {currentUser?.role || currentRole}
              </span>
            </div>
            <span className="active-user-email">
              {currentUser?.email || 'haji.lubis@warungdemo.id'} • Username: <strong>{currentUser?.username || 'admin'}</strong>
            </span>
          </div>
        </div>

        <div className="user-active-right">
          <span className="text-xs text-muted block mb-1">Beralih Cepat Antar Akun Demo:</span>
          <div className="role-switch-btns-group">
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                className={`btn btn-sm ${currentUser?.id === u.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => login(u)}
                title={`Masuk sebagai ${u.name} (${u.role})`}
              >
                {u.role === 'Pemilik/Admin' ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
                <span>{u.name} ({u.role === 'Pemilik/Admin' ? 'Admin' : 'Kasir'})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} />
          <span>Daftar Pengguna ({users.length})</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <KeyRound size={16} />
          <span>Ganti Kata Sandi (Simulasi)</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          <History size={16} />
          <span>Riwayat Audit Log</span>
          <span className="tab-badge">{auditLogs.length}</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR PENGGUNA */}
      {activeTab === 'users' && (
        <div className="wa-tab-content">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Daftar Akun Pengguna Terdaftar</h3>
                <p className="panel-desc">Akun yang memiliki akses ke sistem operasional Warung Klontong Haji Lubis</p>
              </div>

              {isOwner ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsAddUserModalOpen(true)}
                >
                  <UserPlus size={16} />
                  <span>Tambah Akun Baru</span>
                </button>
              ) : (
                <span className="text-xs text-muted" title="Hanya Pemilik/Admin yang berhak menambah akun">
                  🔒 Tambah Akun (Khusus Admin)
                </span>
              )}
            </div>

            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>ID Akun</th>
                    <th>Nama Lengkap</th>
                    <th>Username</th>
                    <th>Peran (Hak Akses)</th>
                    <th>Kontak Email / Telp</th>
                    <th>Status</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className={currentUser?.id === u.id ? 'row-active-user' : ''}>
                      <td>
                        <span className="font-mono text-sm">{u.id}</span>
                      </td>
                      <td>
                        <div className="user-name-cell">
                          <strong>{u.name}</strong>
                          {currentUser?.id === u.id && (
                            <span className="active-user-pill">Sedang Aktif</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-muted text-sm">@{u.username || 'user'}</span>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'Pemilik/Admin' ? 'badge-primary' : 'badge-success'}`}>
                          {u.role === 'Pemilik/Admin' ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td>
                        <div className="user-contact-cell text-xs text-muted">
                          <div>{u.email}</div>
                          <div>{u.phone}</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success">{u.status || 'Aktif'}</span>
                      </td>
                      <td className="text-right">
                        {currentUser?.id !== u.id ? (
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => login(u)}
                            title={`Beralih dan masuk sebagai ${u.name}`}
                          >
                            <span>Ganti ke Akun Ini</span>
                          </button>
                        ) : (
                          <span className="text-xs text-muted">Akun Anda</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GANTI KATA SANDI (SIMULASI) */}
      {activeTab === 'password' && (
        <div className="wa-tab-content">
          <div className="panel max-w-xl mx-auto">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Formulir Ubah Kata Sandi Akun</h3>
                <p className="panel-desc">
                  Perbarui kata sandi untuk akun <strong>{currentUser?.name || currentRole}</strong> ({currentUser?.role || currentRole})
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="password-form-box">
              <div className="form-group">
                <label className="form-label font-semibold">Kata Sandi Saat Ini</label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Masukkan sandi saat ini..."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowOldPass(!showOldPass)}
                  >
                    {showOldPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label font-semibold">Kata Sandi Baru</label>
                <div className="input-with-icon">
                  <KeyRound size={16} className="input-icon" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Minimal 6 karakter..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNewPass(!showNewPass)}
                  >
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label font-semibold">Konfirmasi Kata Sandi Baru</label>
                <div className="input-with-icon">
                  <KeyRound size={16} className="input-icon" />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Ulangi kata sandi baru..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {passError && (
                <div className="payment-error-alert mb-4">
                  <AlertTriangle size={15} />
                  <span>{passError}</span>
                </div>
              )}

              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  <span>Perbarui Kata Sandi (Simulasi)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG AKTIVITAS */}
      {activeTab === 'audit' && (
        <div className="wa-tab-content">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">Riwayat Audit Log Aktivitas Penting</h3>
                <p className="panel-desc">Rekam jejak aktivitas login, kasir POS, stok barang, dan administrasi pengguna</p>
              </div>
            </div>

            {/* Audit Filters */}
            <div className="wa-logs-filter-bar">
              <div className="search-box flex-1">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Cari aktivitas, pelaku, atau rincian..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                />
              </div>

              <div className="filter-pill-group">
                {['Semua', 'Pemilik/Admin', 'Kasir'].map(r => (
                  <button
                    key={r}
                    type="button"
                    className={`period-pill ${auditRoleFilter === r ? 'active' : ''}`}
                    onClick={() => setAuditRoleFilter(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Table */}
            <div className="table-responsive">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Waktu Kejadian</th>
                    <th>Pelaku</th>
                    <th>Peran</th>
                    <th>Aktivitas</th>
                    <th>Rincian Aktivitas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-muted">
                        Tidak ada catatan audit log yang cocok dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="text-xs text-muted whitespace-nowrap">
                          {formatDateID(log.time, true)}
                        </td>
                        <td>
                          <strong>{log.actor}</strong>
                        </td>
                        <td>
                          <span className={`badge ${log.role === 'Pemilik/Admin' ? 'badge-primary' : 'badge-success'}`}>
                            {log.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${log.badgeClass || 'badge-primary'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="text-sm">
                          {log.details}
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

      {/* MODAL TAMBAH PENGGUNA BARU */}
      {isAddUserModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content modal-md">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <UserPlus size={18} className="text-primary" />
                <h3 className="modal-title">Tambah Akun Pengguna Baru</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddUserModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label font-semibold">
                    Nama Lengkap <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Budi Santoso"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label font-semibold">
                      Username <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: budi"
                      value={newUserData.username}
                      onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label font-semibold">Hak Akses / Peran</label>
                    <select
                      className="form-control"
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    >
                      <option value="Kasir">Kasir (Operasional POS & Stok)</option>
                      <option value="Pemilik/Admin">Pemilik/Admin (Akses Penuh)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Email Kontak (Dummy)</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="budi@warungdemo.id"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">Nomor WhatsApp / Telp</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0812-3333-5555"
                      value={newUserData.phone}
                      onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Simpan Akun Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
