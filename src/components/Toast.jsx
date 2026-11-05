import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { toast, closeToast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon text-success" />,
    warning: <AlertTriangle size={18} className="toast-icon text-warning" />,
    danger: <AlertCircle size={18} className="toast-icon text-danger" />
  };

  return (
    <div className={`app-toast toast-${toast.type}`} role="alert">
      {icons[toast.type] || icons.success}
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close-btn"
        onClick={closeToast}
        aria-label="Tutup notifikasi"
      >
        <X size={16} />
      </button>
    </div>
  );
}
