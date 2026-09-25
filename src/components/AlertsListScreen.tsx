import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Filter,
  RefreshCw,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Pill
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const AlertsListScreen: React.FC = () => {
  const {
    alerts,
    setSelectedAlert,
    setActiveTab,
    refreshWeather,
    isWeatherLoading,
    setIsTestScenarioOpen,
    environmentalSignal,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'active' | 'actioned'>('active');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'active') return a.status === 'active';
    if (filter === 'actioned') return a.status === 'actioned';
    return true;
  });

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const actionedCount = alerts.filter((a) => a.status === 'actioned').length;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-28 text-slate-800">
      {/* App Bar */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-[#0A5D52] via-[#0D6D60] to-[#0F766E] text-white px-5 pt-3 pb-4 shadow-md shadow-teal-950/10 border-b border-teal-600/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                Surge Alerts & Rules
              </h1>
              {activeCount > 0 && (
                <span className="text-[10px] font-extrabold bg-[#DC2626] text-white px-2 py-0.2 rounded-full shadow-xs">
                  {activeCount} Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-teal-100/80 mt-0.5 font-medium">
              Epidemiological Decision Support
            </p>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => refreshWeather()}
              disabled={isWeatherLoading}
              className="p-2 rounded-xl text-teal-100 hover:bg-white/10 transition active:scale-95"
              title="Refresh weather rules"
            >
              <RefreshCw className={`w-4 h-4 ${isWeatherLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-3.5 space-y-4 max-w-xl mx-auto">
        {/* Surveillance Window Banner */}
        <div className="bg-gradient-to-r from-teal-900 to-[#0F766E] text-white rounded-3xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-teal-300" />
              <span className="text-xs font-bold tracking-wide uppercase text-teal-200">
                10-Week Surveillance Window
              </span>
            </div>
            <span className="text-[10px] font-extrabold bg-teal-400/20 text-teal-100 px-2 py-0.5 rounded-full border border-teal-300/30">
              Active Peak
            </span>
          </div>

          <p className="text-xs text-teal-100/90 leading-relaxed font-normal">
            Colombo district is currently in the high transmission lag window (10 weeks post heavy rainfall threshold).
          </p>

          <div className="flex items-center justify-between pt-1 text-[11px] text-teal-200 font-medium">
            <span>Rainfall: {environmentalSignal.threeDayRainfallMm}mm / 3-days</span>
            <span>Search queries: +{environmentalSignal.searchTrendGrowthPercent}%</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white rounded-2xl p-1 border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'active'
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('actioned')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'actioned'
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Approved ({actionedCount})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All ({alerts.length})
          </button>
        </div>

        {/* Alert Cards */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No alerts in this view</p>
              <p className="text-xs text-slate-400 mt-1">
                {filter === 'active'
                  ? 'All active procurement surge recommendations have been addressed.'
                  : 'No actioned alerts recorded yet.'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isActioned = alert.status === 'actioned';
              const isIgnored = alert.status === 'ignored';

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`bg-white rounded-2xl p-4 border transition cursor-pointer shadow-xs hover:shadow-md group active:scale-[0.99] ${
                    alert.severity === 'CRITICAL' && alert.status === 'active'
                      ? 'border-red-200/90 hover:border-red-500'
                      : 'border-slate-200/80 hover:border-teal-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-50 text-[#DC2626] border border-red-200'
                            : 'bg-amber-50 text-[#D97706] border border-amber-200'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        RULE {alert.ruleId}
                      </span>
                    </div>

                    <div className="flex items-center text-slate-400 text-[11px] gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-900 transition">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {alert.reason}
                  </p>

                  {/* Stock transition highlight */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 font-medium">Stock:</span>
                      <span className="font-bold text-slate-800">{alert.currentStock}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-extrabold text-[#0F766E]">
                        {alert.recommendedReorder} units
                      </span>
                      <span className="bg-emerald-50 text-[#16A34A] border border-emerald-200 text-[10px] font-bold px-2 py-0.2 rounded-full">
                        +{alert.recommendedIncreaseUnits}
                      </span>
                    </div>

                    <div className="flex items-center text-xs font-bold text-[#0F766E] group-hover:translate-x-0.5 transition">
                      <span>{isActioned ? 'View Approved' : 'Review'}</span>
                      <ChevronRight className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};
