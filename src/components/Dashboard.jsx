import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Receipt,
  PiggyBank,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Sparkles,
  ShoppingCart,
  Boxes,
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatIDR, formatDateID, getStockStatus } from '../utils/formatters';
import { SALES_7_DAYS, SALES_4_WEEKS, DEMO_INFO } from '../data/dummyData';

export default function Dashboard() {
  const { products, transactions, setActiveMenu } = useStore();
  const [chartPeriod, setChartPeriod] = useState('7hari'); // '7hari' | '4minggu'

  // Active completed transactions
  const activeTransactions = useMemo(() => {
    return transactions.filter(t => t.status !== 'Dibatalkan');
  }, [transactions]);

  // Today's completed transactions (2026-10-16)
  const todayTransactions = useMemo(() => {
    return activeTransactions.filter(t => t.time.startsWith('2026-10-16'));
  }, [activeTransactions]);

  // Compute stats from today's transactions
  const totalOmzetToday = useMemo(() => {
    return todayTransactions.reduce((acc, t) => acc + t.total, 0);
  }, [todayTransactions]);

  const totalTransactionsCount = todayTransactions.length;

  // Compute estimated gross profit for today
  const totalEstimatedProfitToday = useMemo(() => {
    return todayTransactions.reduce((acc, t) => {
      const trxProfit = t.items.reduce((sum, item) => {
        const cost = item.costPrice || (item.price * 0.82);
        return sum + (item.price - cost) * item.qty;
      }, 0);
      return acc + trxProfit;
    }, 0);
  }, [todayTransactions]);

  // Low stock products
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= p.minStock);
  }, [products]);

  // Top Selling Products (Produk Terlaris) dynamically aggregated from transactions
  const topSellingProducts = useMemo(() => {
    const productMap = {};

    activeTransactions.forEach(trx => {
      trx.items.forEach(item => {
        const key = item.id || item.name;
        if (!productMap[key]) {
          productMap[key] = {
            id: key,
            name: item.name,
            qty: 0,
            revenue: 0,
            profit: 0
          };
        }
        const cost = item.costPrice || (item.price * 0.82);
        productMap[key].qty += item.qty;
        productMap[key].revenue += (item.price * item.qty);
        productMap[key].profit += ((item.price - cost) * item.qty);
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [activeTransactions]);

  // Dynamic Chart Data based on selected period
  const chartData = useMemo(() => {
    if (chartPeriod === '7hari') {
      const list = [...SALES_7_DAYS];
      list[list.length - 1] = {
        day: 'Hari ini',
        sales: totalOmzetToday,
        profit: totalEstimatedProfitToday,
        count: totalTransactionsCount
      };
      return list;
    } else {
      return SALES_4_WEEKS;
    }
  }, [chartPeriod, totalOmzetToday, totalEstimatedProfitToday, totalTransactionsCount]);

  const maxSaleValue = Math.max(...chartData.map(d => d.sales), 100000);

  return (
    <div className="dashboard-view">
      {/* Welcome Banner & Demo Notice */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-tag">
            <Sparkles size={14} />
            <span>Dashboard Eksekutif & Analitik — Fase 4</span>
          </div>
          <h2 className="welcome-title">
            Selamat Datang di {DEMO_INFO.storeName}
          </h2>
          <p className="welcome-subtitle">
            Ringkasan omzet, pergerakan stok barang warung, dan analitik produk terlaris secara real-time.
          </p>
        </div>

        <div className="welcome-actions">
          <button
            className="btn btn-primary"
            onClick={() => setActiveMenu('pos')}
          >
            <ShoppingCart size={16} />
            <span>Buka Kasir / POS</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveMenu('reports')}
          >
            <Receipt size={16} />
            <span>Semua Laporan</span>
          </button>
        </div>
      </section>

      {/* Demo Warning Banner */}
      <div className="demo-alert-banner">
        <AlertTriangle size={16} className="alert-icon" />
        <div className="alert-text">
          <strong>Perhatian (Data Simulasi):</strong> Seluruh angka penjualan, estimasi laba kotor, dan riwayat transaksi di bawah ini berasal dari dataset simulasi front-end. Seluruh mutasi tersinkronisasi di memori lokal sesi ini.
        </div>
      </div>

      {/* KPI Summary Cards */}
      <section className="kpi-grid">
        {/* KPI 1: Penjualan Hari Ini */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Penjualan Hari Ini</span>
            <div className="kpi-icon-wrap icon-blue">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value">{formatIDR(totalOmzetToday)}</div>
          <div className="kpi-footer">
            <span className="kpi-trend positive">
              <ArrowUpRight size={14} /> Aktif
            </span>
            <span className="kpi-note">Dari {totalTransactionsCount} struk hari ini</span>
          </div>
        </div>

        {/* KPI 2: Total Transaksi */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Transaksi Hari Ini</span>
            <div className="kpi-icon-wrap icon-navy">
              <Receipt size={18} />
            </div>
          </div>
          <div className="kpi-value">{totalTransactionsCount} Transaksi</div>
          <div className="kpi-footer">
            <span className="kpi-note">
              Rata-rata {totalTransactionsCount > 0 ? formatIDR(Math.round(totalOmzetToday / totalTransactionsCount)) : 'Rp 0'} / struk
            </span>
          </div>
        </div>

        {/* KPI 3: Estimasi Laba Kotor */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Estimasi Laba Kotor</span>
            <div className="kpi-icon-wrap icon-green">
              <PiggyBank size={18} />
            </div>
          </div>
          <div className="kpi-value">{formatIDR(totalEstimatedProfitToday)}</div>
          <div className="kpi-footer">
            <span className="kpi-badge-estimasi">Estimasi Laba Kotor</span>
            <span className="kpi-note">Margin ~{totalOmzetToday > 0 ? Math.round((totalEstimatedProfitToday / totalOmzetToday) * 100) : 0}%</span>
          </div>
        </div>

        {/* KPI 4: Stok Menipis */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Peringatan Stok Menipis</span>
            <div className="kpi-icon-wrap icon-red">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-value text-red">{lowStockProducts.length} Produk</div>
          <div className="kpi-footer">
            <button
              className="kpi-action-link"
              onClick={() => setActiveMenu('stock')}
            >
              Lihat barang yang perlu restok &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Chart & Low Stock Side */}
      <div className="dashboard-main-grid">
        {/* Left Column: Sales Trend Visualisation with Period Selector */}
        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">
                Tren Penjualan {chartPeriod === '7hari' ? '7 Hari Terakhir' : '4 Minggu Terakhir'}
              </h3>
              <p className="panel-desc">Visualisasi performa omzet penjualan toko warung</p>
            </div>
            
            <div className="period-btn-group">
              <button
                className={`period-toggle-btn ${chartPeriod === '7hari' ? 'active' : ''}`}
                onClick={() => setChartPeriod('7hari')}
              >
                7 Hari
              </button>
              <button
                className={`period-toggle-btn ${chartPeriod === '4minggu' ? 'active' : ''}`}
                onClick={() => setChartPeriod('4minggu')}
              >
                4 Minggu (Bulanan)
              </button>
            </div>
          </div>

          <div className="chart-bars-container">
            {chartData.map((item, idx) => {
              const heightPercent = Math.max(10, Math.round((item.sales / maxSaleValue) * 100));
              const isToday = chartPeriod === '7hari' && idx === chartData.length - 1;
              const label = item.day || item.week;

              return (
                <div key={label} className="chart-bar-group">
                  <div className="chart-bar-tooltip">
                    <strong>{label}</strong>
                    <div>Omzet: {formatIDR(item.sales)}</div>
                    <div>Est. Laba: {formatIDR(item.profit)}</div>
                    <div>Transaksi: {item.count}</div>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div
                      className={`chart-bar ${isToday ? 'today' : ''}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className={`chart-bar-label ${isToday ? 'label-today' : ''}`}>
                    {item.day ? item.day.split(',')[0] : `M${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-box box-blue"></span>
              <span>Omzet Periode</span>
            </div>
            {chartPeriod === '7hari' && (
              <div className="legend-item">
                <span className="legend-box box-red"></span>
                <span>Hari Ini (Dinamis dari POS)</span>
              </div>
            )}
            <span className="legend-note">* Laba kotor dihitung dari estimasi selisih harga jual dan harga modal dummy</span>
          </div>
        </div>

        {/* Right Column: Low Stock Items */}
        <div className="panel stock-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Peringatan Stok Menipis</h3>
              <p className="panel-desc">Segera lakukan order barang masuk</p>
            </div>
            <button
              className="btn-link"
              onClick={() => setActiveMenu('stock')}
            >
              Kelola Stok
            </button>
          </div>

          <div className="low-stock-list">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-6 text-muted">
                Semua stok produk saat ini aman di atas batas minimum.
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map(product => {
                const status = getStockStatus(product.stock, product.minStock);
                return (
                  <div key={product.id} className="low-stock-item">
                    <div className="item-info">
                      <div className="item-name">{product.name}</div>
                      <div className="item-meta">
                        <span>Kode: {product.code}</span>
                        <span className="bullet">&bull;</span>
                        <span>{product.category}</span>
                      </div>
                    </div>
                    <div className="item-stock-badge">
                      <span className="stock-number">
                        {product.stock} {product.unit}
                      </span>
                      <span className={`badge ${status.badgeClass}`}>
                        Min: {product.minStock}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Top Selling Products & Recent Transactions */}
      <div className="dashboard-main-grid">
        {/* Left Column: Top Selling Products */}
        <div className="panel top-products-panel">
          <div className="panel-header">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-warning" />
              <div>
                <h3 className="panel-title">Produk Terlaris (Top Selling)</h3>
                <p className="panel-desc">Peringkat kontribusi penjualan barang di warung</p>
              </div>
            </div>
            <button
              className="btn-link"
              onClick={() => setActiveMenu('reports')}
            >
              Lihat Analitik &rarr;
            </button>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th className="text-center" style={{ width: '40px' }}>Rank</th>
                  <th>Nama Produk</th>
                  <th className="text-center">Kuantitas Terjual</th>
                  <th className="text-right">Kontribusi Omzet</th>
                  <th className="text-right">Est. Laba Kotor</th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((prod, index) => (
                  <tr key={prod.id}>
                    <td className="text-center font-bold">
                      <span className={`rank-badge rank-${index + 1}`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td>
                      <strong>{prod.name}</strong>
                    </td>
                    <td className="text-center font-bold text-navy">
                      {prod.qty} terjual
                    </td>
                    <td className="text-right font-bold text-blue">
                      {formatIDR(prod.revenue)}
                    </td>
                    <td className="text-right text-success font-medium">
                      +{formatIDR(prod.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Transactions Summary */}
        <div className="panel transactions-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Transaksi Kasir Terkini</h3>
              <p className="panel-desc">Struk terbaru di kasir hari ini</p>
            </div>
            <button
              className="btn-link"
              onClick={() => setActiveMenu('reports')}
            >
              Semua &rarr;
            </button>
          </div>

          <div className="table-responsive">
            <table className="app-table">
              <thead>
                <tr>
                  <th>No. Struk</th>
                  <th>Waktu</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeTransactions.slice(0, 5).map(trx => (
                  <tr key={trx.id}>
                    <td><code>{trx.id.split('-').slice(-2).join('-')}</code></td>
                    <td className="trx-time">
                      <div className="time-wrap">
                        <Clock size={12} />
                        <span>{formatDateID(trx.time, true).split(', ')[1]}</span>
                      </div>
                    </td>
                    <td className="text-right font-bold text-blue">{formatIDR(trx.total)}</td>
                    <td className="text-center">
                      <span className={`badge ${trx.status === 'Selesai' ? 'badge-success' : 'badge-danger'}`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
