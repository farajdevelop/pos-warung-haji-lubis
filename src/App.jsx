import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Sidebar, { MENU_ITEMS } from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import POSModule from './components/POSModule';
import ProductModule from './components/ProductModule';
import StockModule from './components/StockModule';
import ReportModule from './components/ReportModule';
import WhatsAppModule from './components/WhatsAppModule';
import UserModule from './components/UserModule';
import LoginScreen from './components/LoginScreen';
import Toast from './components/Toast';
import { DEMO_INFO } from './data/dummyData';

function AppContent() {
  const { activeMenu, setActiveMenu, currentRole, setCurrentRole, currentUser } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If not logged in, render the dedicated Login Screen (Fase 6)
  if (!currentUser) {
    return (
      <div className="app-login-viewport">
        <Toast />
        <LoginScreen />
      </div>
    );
  }

  const renderActiveModule = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <POSModule />;
      case 'products':
        return <ProductModule />;
      case 'stock':
        return <StockModule />;
      case 'reports':
        return <ReportModule />;
      case 'whatsapp':
        return <WhatsAppModule currentRole={currentRole} />;
      case 'users':
        return <UserModule currentRole={currentRole} setCurrentRole={setCurrentRole} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Alert Feedback */}
      <Toast />

      {/* Sidebar Navigation */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
      />

      {/* Main Content Area */}
      <div className="app-main">
        <Topbar
          activeMenu={activeMenu}
          menuItems={MENU_ITEMS}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          currentRole={currentRole}
        />

        <main className="app-content-container">
          {renderActiveModule()}
        </main>

        <footer className="app-footer">
          <div className="footer-left">
            <span>&copy; 2026 {DEMO_INFO.storeName}. Hak Cipta Dilindungi.</span>
            <span className="bullet">&bull;</span>
            <span className="footer-demo-pill">Mode Demo Frontend (Fase 6: Pengguna, Role Demo & RBAC)</span>
          </div>
          <div className="footer-right">
            <span>Versi {DEMO_INFO.version}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
