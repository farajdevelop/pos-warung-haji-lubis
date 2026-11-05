/**
 * Helper pemformat mata uang Rupiah
 * Sesuai aturan: gunakan angka integer rupiah tanpa desimal
 * @param {number} amount 
 * @returns {string} Contoh: "Rp 25.000"
 */
export function formatIDR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rp 0';
  }
  const rounded = Math.round(Number(amount));
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(rounded);
}

/**
 * Pemformat tanggal dalam bahasa Indonesia
 * @param {string|Date} dateInput 
 * @param {boolean} includeTime 
 * @returns {string} Contoh: "16 Okt 2026, 13:10 WIB"
 */
export function formatDateID(dateInput, includeTime = false) {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  if (isNaN(date.getTime())) return '-';

  const optionsDate = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };

  const formattedDate = date.toLocaleDateString('id-ID', optionsDate);

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${formattedDate}, ${hours}:${minutes} WIB`;
  }

  return formattedDate;
}

/**
 * Helper status stok barang
 * @param {number} currentStock 
 * @param {number} minStock 
 * @returns {{ label: string, status: 'safe'|'warning'|'danger', badgeClass: string }}
 */
export function getStockStatus(currentStock, minStock = 5) {
  if (currentStock <= 0) {
    return {
      label: 'Habis',
      status: 'danger',
      badgeClass: 'badge-danger'
    };
  }
  if (currentStock <= minStock) {
    return {
      label: 'Menipis',
      status: 'warning',
      badgeClass: 'badge-warning'
    };
  }
  return {
    label: 'Aman',
    status: 'safe',
    badgeClass: 'badge-success'
  };
}
