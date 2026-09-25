import React from 'react';
import {
  AlertTriangle,
  Bell,
  ChevronRight,
  TrendingUp,
  CloudRain,
  Pill,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  MapPin,
  ShieldAlert,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    medicines,
    alerts,
    environmentalSignal,
    setSelectedAlert,
    setActiveTab,
    refreshWeather,
    isWeatherLoading,
    weatherError,
    activeScenarioName,
    setIsAddEditOpen,
    setEditingMedicine,
  } = useApp();

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const belowReorderMeds = medicines.filter((m) => m.currentStock < m.reorderThreshold);

  // Active risk level assessment (R1 & R2 conditions)
  const isHighRisk =
    environmentalSignal.threeDayRainfallMm > 50 &&
    environmentalSignal.searchTrendGrowthPercent > 30;

  // Items needing attention for the horizontal scroll
  const needsAttentionList = belowReorderMeds.slice(0, 6);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-28 text-slate-800">
      {/* Top App Bar Header with Rich Gradient & Colombo District */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-[#0A5D52] via-[#0D6D60] to-[#0F766E] text-white px-5 pt-3 pb-4 shadow-md shadow-teal-950/10 border-b border-teal-600/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center font-black text-white text-base shadow-xs">
              +
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-bold tracking-tight text-white leading-none">PharmAlert</span>
                <span className="text-[9px] font-semibold bg-teal-400/20 text-teal-200 border border-teal-300/30 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  SME DSS
                </span>
              </div>
              <div className="flex items-center text-[11px] text-teal-100/80 gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-teal-300" />
                <span className="font-medium truncate max-w-[140px]">{user.district}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Notification Bell with Red Badge */}
            <button
              onClick={() => setActiveTab('alerts')}
              aria-label="View notifications"
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-teal-50 border border-white/10 active:scale-95"
            >
              <Bell className="w-4 h-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#0F766E] shadow-xs animate-pulse">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Profile Button with Initials */}
            <button
              onClick={() => setActiveTab('settings')}
              className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-900 to-teal-700 text-teal-100 border border-white/20 flex items-center justify-center text-xs font-bold shadow-xs hover:ring-2 hover:ring-teal-300/50 transition active:scale-95 relative"
              title={`${user.name} (${user.pharmacyName})`}
            >
              {user.initials}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-teal-800" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-3.5 space-y-4 max-w-xl mx-auto">
        {/* Active Scenario Indicator if testing */}
        {activeScenarioName && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-2xs backdrop-blur-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 animate-spin" />
              <span className="font-semibold truncate">{activeScenarioName}</span>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-emerald-700 hover:text-emerald-800 font-bold shrink-0 ml-2 text-[11px] underline"
            >
              Test Suite
            </button>
          </div>
        )}

        {/* Offline Warning Banner if cached */}
        {weatherError && (
          <div className="bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
            <span className="font-medium">{weatherError}</span>
            <button
              onClick={() => refreshWeather()}
              className="text-amber-800 font-bold underline shrink-0 ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Greeting & Date Header with Live Weather Sync */}
        <div className="flex items-end justify-between px-0.5">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Good morning, {user.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
              <span>Saturday, 25 July</span>
              <span>·</span>
              <span className="text-slate-600">{user.pharmacyName}</span>
            </p>
          </div>

          <button
            onClick={() => refreshWeather()}
            disabled={isWeatherLoading}
            className="inline-flex items-center text-[11px] text-[#0F766E] hover:text-[#0A6C58] bg-teal-50 hover:bg-teal-100/80 px-2.5 py-1.5 rounded-xl border border-teal-200/60 gap-1.5 font-semibold transition active:scale-95 shadow-2xs"
            title="Fetch live rainfall for Colombo from Open-Meteo"
          >
            <RefreshCw className={`w-3 h-3 text-teal-600 ${isWeatherLoading ? 'animate-spin' : ''}`} />
            <span>{isWeatherLoading ? 'Syncing...' : 'Live Weather'}</span>
          </button>
        </div>

        {/* High-Impact Epidemiological Threat Banner (Figure 2: Dengue Risk HIGH) */}
        <section
          aria-label="Epidemiological Threat Banner"
          className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 border border-red-200/90 rounded-3xl p-4.5 shadow-sm"
        >
          {/* Subtle decorative medical cross watermark */}
          <div className="absolute -right-4 -bottom-4 text-red-500/5 font-black text-8xl pointer-events-none select-none">
            +
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center space-x-3">
              {/* Radar pulse badge */}
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-9 w-9 rounded-2xl bg-red-400 opacity-25" />
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-500/20">
                  <AlertTriangle className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold tracking-wider text-red-600 uppercase">
                    EPIDEMIOLOGICAL SURGE
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    Dengue Risk
                  </span>
                  <span className="text-2xl font-black tracking-tight text-[#DC2626]">
                    {isHighRisk ? 'HIGH' : 'ELEVATED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action pill */}
            <span className="px-3 py-1 bg-[#DC2626] text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider shadow-xs shadow-red-600/30">
              ACTION NEEDED
            </span>
          </div>

          {/* Environmental metric chips */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-red-200/70 text-xs relative z-10">
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2 border border-red-200/80 shadow-2xs">
              <div className="flex items-center text-slate-500 text-[10px] font-medium mb-0.5">
                <CloudRain className="w-3 h-3 text-[#0284C7] mr-1 shrink-0" />
                <span>3-Day Rain</span>
              </div>
              <span className="text-xs font-bold text-slate-900 block">
                {environmentalSignal.threeDayRainfallMm}mm
              </span>
              <span className="text-[9px] text-red-600 font-semibold">&gt;50mm limit</span>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2 border border-red-200/80 shadow-2xs">
              <div className="flex items-center text-slate-500 text-[10px] font-medium mb-0.5">
                <TrendingUp className="w-3 h-3 text-red-600 mr-1 shrink-0" />
                <span>Searches</span>
              </div>
              <span className="text-xs font-bold text-red-600 block">
                +{environmentalSignal.searchTrendGrowthPercent}%
              </span>
              <span className="text-[9px] text-red-600 font-semibold">&gt;30% surge</span>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2 border border-red-200/80 shadow-2xs">
              <div className="flex items-center text-slate-500 text-[10px] font-medium mb-0.5">
                <Pill className="w-3 h-3 text-amber-600 mr-1 shrink-0" />
                <span>Inventory</span>
              </div>
              <span className="text-xs font-bold text-amber-700 block">
                {belowReorderMeds.length} Deficit
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Reorder alerts</span>
            </div>
          </div>

          {/* Quick CTA to Alerts */}
          <button
            onClick={() => setActiveTab('alerts')}
            className="w-full mt-3 py-2 px-3 bg-red-600/10 hover:bg-red-600/15 border border-red-300 text-red-700 hover:text-red-800 rounded-xl text-xs font-bold flex items-center justify-between transition active:scale-[0.99]"
          >
            <span>Review recommended procurement adjustments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>

        {/* Quick Stats Bento Row (Figure 2) */}
        <section aria-label="Inventory statistics" className="grid grid-cols-3 gap-2.5">
          <div
            onClick={() => setActiveTab('alerts')}
            className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:border-red-400 transition cursor-pointer group active:scale-98"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold text-slate-700">Active alerts</span>
              <div className="w-6 h-6 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center text-[#DC2626] transition">
                <Bell className="w-3 h-3" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#DC2626] tracking-tight">{activeAlerts.length}</div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">Procurement triggers</p>
          </div>

          <div
            onClick={() => setActiveTab('inventory')}
            className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:border-amber-400 transition cursor-pointer group active:scale-98"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold text-slate-700">Below reorder</span>
              <div className="w-6 h-6 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-[#D97706] transition">
                <AlertTriangle className="w-3 h-3" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#D97706] tracking-tight">{belowReorderMeds.length}</div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">Stock replenishment</p>
          </div>

          <div
            onClick={() => setActiveTab('inventory')}
            className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:border-teal-400 transition cursor-pointer group active:scale-98"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold text-slate-700">Total items</span>
              <div className="w-6 h-6 rounded-lg bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center text-[#0F766E] transition">
                <Pill className="w-3 h-3" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{medicines.length}</div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium truncate">Catalog medicines</p>
          </div>
        </section>

        {/* Active Alerts Section with High-Craft Cards (Figure 2) */}
        <section aria-label="Active alerts list" className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-extrabold text-slate-900">Active Alerts</h2>
              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                {activeAlerts.length}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-xs font-bold text-[#0F766E] hover:text-[#0A6C58] flex items-center gap-0.5 transition"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center shadow-xs">
              <CheckCircle2 className="w-9 h-9 text-[#16A34A] mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">All alerts addressed</p>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-xs mx-auto">
                Current inventory reorder thresholds are fully aligned with the Colombo epidemiological surge window.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-teal-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Medicine Pill Icon Container */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 text-[#0F766E] border border-teal-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs group-hover:scale-105 transition">
                      <Pill className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-teal-900 transition">
                          {alert.medicineName}
                        </span>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-red-50 text-[#DC2626] border border-red-200'
                              : 'bg-amber-50 text-[#D97706] border border-amber-200'
                          }`}
                        >
                          {alert.severity === 'CRITICAL' ? 'CRITICAL' : 'LOW STOCK'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {alert.category} · {alert.timestamp}
                      </p>

                      {/* Stock Level Arrow Pill */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg flex items-center gap-1.5">
                          <span>Stock: <strong className="text-slate-900">{alert.currentStock}</strong></span>
                          <span className="text-slate-400">→</span>
                          <span className="text-[#0F766E] font-bold">Target: {alert.recommendedReorder}</span>
                        </span>

                        <span className="bg-emerald-50 text-[#16A34A] border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          +{alert.recommendedIncreaseUnits} units ({alert.ruleId === 'R2' ? '+20%' : alert.ruleId === 'R3' ? '+30%' : '+15%'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-teal-50 group-hover:text-teal-700 text-slate-400 flex items-center justify-center shrink-0 ml-2 transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Environmental Signals Widget (Figure 2: Rainfall + Dengue Search Interest) */}
        <section
          aria-label="Environmental indicators"
          className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Environmental Signals</h2>
              <p className="text-[10px] text-slate-400 font-medium">Empirical DSS Indicators</p>
            </div>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
              Open-Meteo & Trends
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Rainfall column with Mini Bar Chart */}
            <div className="p-3.5 bg-gradient-to-b from-sky-50/50 to-slate-50/80 rounded-2xl border border-sky-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Rainfall Forecast
                </span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {environmentalSignal.threeDayRainfallMm}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">mm</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium block mb-2">next 3 days</span>
              </div>

              {/* 3-Day Bar Chart */}
              <div className="flex items-end justify-between h-16 pt-2 px-1 border-t border-sky-100">
                {environmentalSignal.dailyRainfall.map((d, i) => {
                  const maxRain = 35;
                  const heightPercent = Math.min(100, Math.max(25, (d.amountMm / maxRain) * 100));
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-[9px] font-bold text-[#0284C7]">{d.amountMm}</span>
                      <div
                        className="w-4 bg-gradient-to-t from-[#0284C7] to-sky-400 rounded-t-md shadow-2xs transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] font-semibold text-slate-500">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google Trends Search Interest Column with Sparkline */}
            <div className="p-3.5 bg-gradient-to-b from-rose-50/50 to-slate-50/80 rounded-2xl border border-rose-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Search Interest
                </span>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-black text-red-600 tracking-tight">
                    +{environmentalSignal.searchTrendGrowthPercent}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium block">Colombo Dengue Queries</span>
              </div>

              {/* Mini Trend Graph Illustration with Gradient Fill */}
              <div className="pt-2 border-t border-rose-100">
                <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 32">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#DC2626" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <polygon
                    points="0,26 25,22 50,16 75,10 100,4 100,32 0,32"
                    fill="url(#trendGradient)"
                  />
                  {/* Stroke Line */}
                  <polyline
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,26 25,22 50,16 75,10 100,4"
                  />
                  <circle cx="100" cy="4" r="3.5" fill="#DC2626" className="animate-pulse" />
                </svg>
                <div className="flex justify-between text-[9px] font-semibold text-slate-400 mt-1">
                  <span>Wk -4</span>
                  <span className="text-red-600 font-bold">+40% Surge</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Needs Attention Horizontal Carousel of Low-Stock Items (Figure 2) */}
        <section aria-label="Medicines needing attention" className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Needs Attention</h2>
              <span className="text-[11px] text-slate-400 font-medium">Stock below reorder threshold</span>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-bold text-[#0F766E] hover:underline"
            >
              Inventory ({medicines.length})
            </button>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-3 pt-1 no-scrollbar -mx-1 px-1">
            {needsAttentionList.map((med) => {
              const deficit = med.reorderThreshold - med.currentStock;
              const ratio = Math.min(100, Math.round((med.currentStock / med.reorderThreshold) * 100));
              const isCritical = ratio <= 40;

              return (
                <div
                  key={med.id}
                  onClick={() => {
                    setEditingMedicine(med);
                    setIsAddEditOpen(true);
                  }}
                  className="shrink-0 w-40 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group active:scale-98"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {med.category}
                      </span>
                      <div className="w-5 h-5 rounded-md bg-slate-100 group-hover:bg-teal-50 group-hover:text-teal-700 text-slate-400 flex items-center justify-center transition">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                    <p className="font-bold text-xs text-slate-900 truncate" title={med.name}>
                      {med.name}
                    </p>
                    <div className="flex items-baseline space-x-1 mt-1 text-xs">
                      <span className={`font-black ${isCritical ? 'text-[#DC2626]' : 'text-[#D97706]'}`}>
                        {med.currentStock}
                      </span>
                      <span className="text-slate-400 font-medium">/ {med.reorderThreshold} {med.unit.toLowerCase()}</span>
                    </div>
                  </div>

                  {/* Stock progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical ? 'bg-[#DC2626]' : 'bg-[#D97706]'
                        }`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-red-600 font-bold block mt-1.5">
                      {deficit} {med.unit.toLowerCase()} deficit
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
