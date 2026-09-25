import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/AppShell';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { AlertDetailScreen } from './components/AlertDetailScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { AlertsListScreen } from './components/AlertsListScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AddEditMedicineModal } from './components/AddEditMedicineModal';
import { RuleTestModal } from './components/RuleTestModal';
import { BottomNavbar } from './components/BottomNavbar';

const MainApp: React.FC = () => {
  const {
    isLoggedIn,
    selectedAlert,
    setSelectedAlert,
    activeTab,
    toastMessage,
  } = useApp();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-50 max-w-sm mx-auto bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center justify-between border border-slate-700/50 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Router */}
      {selectedAlert ? (
        <AlertDetailScreen
          alert={selectedAlert}
          onBack={() => setSelectedAlert(null)}
        />
      ) : (
        <>
          {activeTab === 'home' && <DashboardScreen />}
          {activeTab === 'alerts' && <AlertsListScreen />}
          {activeTab === 'inventory' && <InventoryScreen />}
          {activeTab === 'settings' && <SettingsScreen />}
          <BottomNavbar />
        </>
      )}

      {/* Modals */}
      <AddEditMedicineModal />
      <RuleTestModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <MainApp />
      </AppShell>
    </AppProvider>
  );
}
