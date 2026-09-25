import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Monitor,
  Shield,
  Sparkles,
  Wifi,
  Radio,
  ChevronDown,
  AlertTriangle,
  CloudRain,
  CheckCircle2,
  Maximize2,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types';
import { FlutterCodeModal } from './FlutterCodeModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    viewMode,
    setViewMode,
    setIsTestScenarioOpen,
    isLoggedIn,
    alerts,
    environmentalSignal,
    refreshWeather,
    isWeatherLoading,
  } = useApp();

  const [deviceFinish, setDeviceFinish] = useState<'black' | 'titanium' | 'emerald'>('black');
  const [islandExpanded, setIslandExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('9:41');
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);

  // Real-time clock for top status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const isDengueCritical = environmentalSignal.threeDayRainfallMm > 50 && environmentalSignal.searchTrendGrowthPercent > 30;

  // Finish border colors
  const finishStyles = {
    black: 'border-slate-900 bg-slate-950 ring-slate-800 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)]',
    titanium: 'border-[#38373A] bg-[#1E1E20] ring-[#4E4D52] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]',
    emerald: 'border-[#06332A] bg-[#03201A] ring-[#0C4E41] shadow-[0_20px_60px_-10px_rgba(15,118,110,0.5)]',
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col items-center justify-start py-2 sm:py-6 px-1 sm:px-4 selection:bg-teal-300 selection:text-teal-950 font-sans relative overflow-x-hidden">
      {/* Ambient background glow for high-end presentation */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Floating Control Bar */}
      <header className="w-full max-w-xl mb-3 px-3 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-lg flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-teal-600/90 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-white">PharmAlert</span>
            <span className="hidden sm:inline text-slate-400 text-[11px] ml-1.5">
              Epidemiological DSS
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Flutter & Firebase Code Inspector Button */}
          <button
            onClick={() => setIsFlutterModalOpen(true)}
            className="px-2.5 py-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 text-teal-300 hover:text-teal-100 rounded-lg flex items-center gap-1.5 transition text-[11px] font-bold border border-teal-500/40 shadow-xs"
            title="View Converted Flutter & Firebase Project Code"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Flutter & Firebase</span>
          </button>

          {/* Test Suite Button */}
          {isLoggedIn && (
            <button
              onClick={() => setIsTestScenarioOpen(true)}
              className="px-2.5 py-1 bg-gradient-to-r from-teal-800 to-emerald-800 hover:from-teal-700 hover:to-emerald-700 text-teal-100 rounded-lg flex items-center gap-1.5 transition text-[11px] font-semibold border border-teal-600/40 shadow-xs"
              title="Open Academic Test Scenarios"
            >
              <Sparkles className="w-3 h-3 text-teal-300 animate-pulse" />
              <span>Test Suite</span>
            </button>
          )}

          {/* View Mode Segmented Switcher */}
          <div className="flex items-center bg-slate-950/80 rounded-xl p-0.5 border border-slate-800">
            <button
              onClick={() => setViewMode('iphone')}
              className={`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 transition font-medium ${
                viewMode === 'iphone'
                  ? 'bg-teal-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Flagship Mobile View with Titanium Frame & Dynamic Island"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">iPhone 16</span>
            </button>

            <button
              onClick={() => setViewMode('mobile')}
              className={`px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 transition font-medium ${
                viewMode === 'mobile'
                  ? 'bg-teal-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Clean borderless mobile view"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clean</span>
            </button>

            <button
              onClick={() => setViewMode('responsive')}
              className={`px-2 py-1 rounded-lg text-[11px] flex items-center gap-1 transition font-medium ${
                viewMode === 'responsive'
                  ? 'bg-teal-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full responsive tablet & desktop container"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>

          {/* Device Finish Switcher (Only when in iPhone mode) */}
          {viewMode === 'iphone' && (
            <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-slate-800">
              <button
                onClick={() => setDeviceFinish('black')}
                className={`w-3.5 h-3.5 rounded-full bg-slate-900 border ${deviceFinish === 'black' ? 'ring-2 ring-teal-400 border-white' : 'border-slate-700'}`}
                title="Black Titanium"
              />
              <button
                onClick={() => setDeviceFinish('titanium')}
                className={`w-3.5 h-3.5 rounded-full bg-[#8E8D92] border ${deviceFinish === 'titanium' ? 'ring-2 ring-teal-400 border-white' : 'border-slate-700'}`}
                title="Natural Titanium"
              />
              <button
                onClick={() => setDeviceFinish('emerald')}
                className={`w-3.5 h-3.5 rounded-full bg-teal-800 border ${deviceFinish === 'emerald' ? 'ring-2 ring-teal-400 border-white' : 'border-slate-700'}`}
                title="Emerald Titanium"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Container / Mobile Device Wrapper */}
      <div className="relative w-full flex justify-center items-center">
        {/* Realistic iPhone 16 Pro Frame */}
        {viewMode === 'iphone' ? (
          <div className="relative my-1">
            {/* Hardware Side Buttons */}
            {/* Left Action Button */}
            <div className="hidden sm:block absolute -left-[14px] top-[100px] w-[5px] h-[28px] bg-slate-700 rounded-l-md shadow-xs" />
            {/* Left Volume Up Button */}
            <div className="hidden sm:block absolute -left-[14px] top-[145px] w-[5px] h-[48px] bg-slate-700 rounded-l-md shadow-xs" />
            {/* Left Volume Down Button */}
            <div className="hidden sm:block absolute -left-[14px] top-[205px] w-[5px] h-[48px] bg-slate-700 rounded-l-md shadow-xs" />
            {/* Right Power / Side Button */}
            <div className="hidden sm:block absolute -right-[14px] top-[150px] w-[5px] h-[75px] bg-slate-700 rounded-r-md shadow-xs" />

            {/* Phone Outer Chassis */}
            <div
              className={`w-full sm:w-[412px] min-h-[850px] max-h-[920px] sm:rounded-[54px] sm:border-[11px] sm:ring-1 overflow-hidden transition-all duration-300 relative flex flex-col bg-slate-900 ${finishStyles[deviceFinish]}`}
            >
              {/* Screen Bezel Inset & Display Surface */}
              <div className="relative w-full flex-1 flex flex-col bg-[#F8FAFC] text-slate-800 sm:rounded-[42px] overflow-hidden overflow-y-auto no-scrollbar">
                
                {/* Simulated Realistic Dynamic Island Status Bar */}
                <div className="sticky top-0 z-40 bg-[#0F766E] text-white px-6 pt-3 pb-1 select-none flex items-center justify-between text-xs font-semibold">
                  {/* Clock */}
                  <span className="w-12 text-left font-semibold tracking-tight text-[13px] text-teal-100/95">
                    {currentTime}
                  </span>

                  {/* Interactive Dynamic Island Pill */}
                  <div
                    onClick={() => setIslandExpanded(!islandExpanded)}
                    className={`transition-all duration-300 ease-spring bg-black text-white rounded-full flex items-center justify-between px-3 cursor-pointer select-none shadow-md ${
                      islandExpanded
                        ? 'w-[280px] h-[44px] -translate-y-0.5'
                        : 'w-[110px] h-[28px]'
                    }`}
                  >
                    {!islandExpanded ? (
                      <div className="w-full flex items-center justify-between px-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isDengueCritical ? (
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          )}
                          <span className="text-[10px] font-bold text-teal-200">
                            {isDengueCritical ? 'ALERT' : 'LIVE'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-between text-[11px] px-1 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                          </div>
                          <div>
                            <div className="font-bold text-white leading-tight">Colombo Dengue Alert</div>
                            <div className="text-[9px] text-slate-300">
                              {environmentalSignal.threeDayRainfallMm}mm Rain · +{environmentalSignal.searchTrendGrowthPercent}% Spike
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full">
                          High
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Icons: Cellular, Wifi, Battery */}
                  <div className="w-14 flex items-center justify-end space-x-1.5 text-teal-100">
                    <div className="flex items-end gap-[1.5px] h-2.5">
                      <div className="w-[2.5px] h-1 bg-teal-100 rounded-[0.5px]" />
                      <div className="w-[2.5px] h-1.5 bg-teal-100 rounded-[0.5px]" />
                      <div className="w-[2.5px] h-2 bg-teal-100 rounded-[0.5px]" />
                      <div className="w-[2.5px] h-2.5 bg-teal-100 rounded-[0.5px]" />
                    </div>
                    <Wifi className="w-3.5 h-3.5 text-teal-100" />
                    {/* Battery */}
                    <div className="w-5 h-2.5 border border-teal-100/90 rounded-[3px] p-[1px] flex items-center">
                      <div className="w-full h-full bg-emerald-400 rounded-[1.5px]" />
                    </div>
                  </div>
                </div>

                {/* Actual Application Content */}
                <div className="flex-1 w-full bg-[#F8FAFC]">
                  {children}
                </div>

                {/* Simulated iOS Home Indicator Bar */}
                <div className="sticky bottom-0 z-40 w-full bg-gradient-to-t from-white/95 via-white/70 to-transparent py-2 flex justify-center pointer-events-none">
                  <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === 'mobile' ? (
          /* Clean Mobile Frame */
          <div className="w-full sm:w-[412px] bg-white sm:rounded-[36px] shadow-2xl overflow-hidden sm:ring-1 sm:ring-slate-800/20 flex flex-col relative min-h-[800px] border-0">
            {children}
          </div>
        ) : (
          /* Responsive Desktop Frame */
          <div className="w-full max-w-2xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden sm:ring-1 sm:ring-slate-800/10">
            {children}
          </div>
        )}
      </div>

      {/* Flutter & Firebase Project Codebase Inspector */}
      <FlutterCodeModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />
    </div>
  );
};
