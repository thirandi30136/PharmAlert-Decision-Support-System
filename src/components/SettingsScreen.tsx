import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  BookOpen,
  MapPin,
  RefreshCw,
  LogOut,
  Sparkles,
  Smartphone,
  Maximize2,
  Database,
  CloudSun,
  Shield,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { FlutterCodeModal } from './FlutterCodeModal';

export const SettingsScreen: React.FC = () => {
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);
  const {
    user,
    logout,
    resetToDefaultData,
    setIsTestScenarioOpen,
    refreshWeather,
    isWeatherLoading,
    environmentalSignal,
    viewMode,
    setViewMode,
  } = useApp();

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-28 text-slate-800">
      {/* App Bar */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-[#0A5D52] via-[#0D6D60] to-[#0F766E] text-white px-5 pt-3 pb-4 shadow-md shadow-teal-950/10 border-b border-teal-600/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-tight">Settings & Research</h1>
              <p className="text-[11px] text-teal-100/80 font-medium">DSS Configuration & Parameters</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="px-4 pt-3.5 space-y-3.5 max-w-xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F766E] to-teal-800 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-teal-900/20">
              {user.initials}
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500 font-medium">{user.email}</p>
              <div className="flex items-center text-[11px] text-[#0F766E] font-bold mt-0.5">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{user.pharmacyName} · {user.district}</span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
            Active
          </span>
        </div>

        {/* Flutter & Firebase Native App Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white rounded-3xl p-4.5 border border-teal-500/30 shadow-md space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/40">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-black text-white">Flutter & Firebase Native App</h3>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                    COMPLETE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  18 Dart files in <code className="text-teal-300">/flutter_pharmalert</code> with Firestore security rules
                </p>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFlutterModalOpen(true)}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition text-center flex items-center justify-center gap-1.5"
          >
            <span>Inspect Flutter & Firebase Code</span>
          </motion.button>
        </div>

        {/* Presentation View Mode Switcher */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Device Frame View</h3>
              <p className="text-[11px] text-slate-500 font-medium">Switch between flagship frame & edge-to-edge</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => setViewMode('iphone')}
              className={`py-2 px-2 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition active:scale-95 ${
                viewMode === 'iphone'
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>iPhone 16</span>
            </button>

            <button
              onClick={() => setViewMode('mobile')}
              className={`py-2 px-2 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition active:scale-95 ${
                viewMode === 'mobile'
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Clean Phone</span>
            </button>

            <button
              onClick={() => setViewMode('responsive')}
              className={`py-2 px-2 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition active:scale-95 ${
                viewMode === 'responsive'
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Responsive</span>
            </button>
          </div>
        </div>

        {/* Section 7.1 Test Scenarios Verification Button */}
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-[#0F766E] text-white rounded-3xl p-4.5 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-teal-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black">Academic Rule Test Suite</h3>
                <p className="text-xs text-teal-100/90 mt-0.5 font-medium">
                  Run the 5 Section 7.1 validation scenarios
                </p>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsTestScenarioOpen(true)}
            className="w-full py-2.5 px-4 bg-white text-[#0F766E] hover:bg-teal-50 font-extrabold text-xs rounded-xl shadow-xs transition text-center"
          >
            Launch Rule Engine Verification
          </motion.button>
        </div>

        {/* Research Parameters Reference */}
        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-[#0F766E]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Colombo Research Benchmarks (Erandi et al., 2021)
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Calibrated against 104 weeks of empirical Colombo rainfall and dengue surveillance data:
          </p>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Rainfall alert threshold (R1)</span>
              <span className="font-extrabold text-slate-800">50 mm over 3 days</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Epidemic surveillance lag (R2)</span>
              <span className="font-extrabold text-slate-800">10 weeks post-rainfall</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Search trend confirmation (R2)</span>
              <span className="font-extrabold text-slate-800">+30% search query spike</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Recommended inventory surge</span>
              <span className="font-extrabold text-[#0F766E]">+20% for Paracetamol / +30% ORS</span>
            </div>
          </div>
        </div>

        {/* Live Weather Source & Resync */}
        <div className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CloudSun className="w-4 h-4 text-[#0284C7]" />
              <h3 className="text-xs font-bold text-slate-900">Open-Meteo Weather API</h3>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Colombo (6.93°N, 79.86°E)</span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Status: {environmentalSignal.dataSource} · Last synced: {environmentalSignal.lastUpdated}
          </p>

          <button
            onClick={() => refreshWeather()}
            disabled={isWeatherLoading}
            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-[#0F766E] border border-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin' : ''}`} />
            <span>{isWeatherLoading ? 'Fetching Open-Meteo...' : 'Force Refresh Weather API'}</span>
          </button>
        </div>

        {/* Database & Storage */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-800">Local Cache & Reset</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Reset to the standard Colombo 18-medicine research benchmark dataset anytime.
          </p>
          <button
            onClick={resetToDefaultData}
            className="w-full py-2 px-3 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition active:scale-98"
          >
            Reset to Clean Research Benchmark Data
          </button>
        </div>
      </main>

      <FlutterCodeModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />
    </div>
  );
};
