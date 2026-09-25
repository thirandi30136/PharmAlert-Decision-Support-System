import React from 'react';
import { Home, Bell, Package, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const BottomNavbar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, setSelectedAlert } = useApp();

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const handleTabClick = (tab: ActiveTab) => {
    setSelectedAlert(null); // Clear any open alert detail
    setActiveTab(tab);
  };

  const navItems: { tab: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'alerts', label: 'Alerts', icon: Bell },
    { tab: 'inventory', label: 'Inventory', icon: Package },
    { tab: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 pointer-events-none flex justify-center pb-2 sm:pb-3 px-3">
      <nav className="pointer-events-auto w-full max-w-[390px] bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/10 px-2 py-1.5 flex items-center justify-around ring-1 ring-black/[0.04]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          const isAlerts = item.tab === 'alerts';

          return (
            <motion.button
              key={item.tab}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleTabClick(item.tab)}
              className={`flex-1 py-1.5 px-2 rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 ${
                isActive
                  ? 'text-[#0F766E]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {/* Active Background Pill highlight */}
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-teal-50/80 rounded-xl -z-10 border border-teal-200/50"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}

              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {isAlerts && activeAlertsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[17px] h-[17px] bg-[#DC2626] text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white shadow-xs animate-pulse">
                    {activeAlertsCount}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 font-semibold tracking-tight ${isActive ? 'text-[#0F766E]' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
