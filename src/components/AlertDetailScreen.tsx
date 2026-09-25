import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Check,
  CheckCircle,
  FileText,
  Building2,
  Clock,
  Minus,
  Plus,
  TrendingUp,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { AlertItem } from '../types';
import { useApp } from '../context/AppContext';

interface AlertDetailProps {
  alert: AlertItem;
  onBack: () => void;
}

export const AlertDetailScreen: React.FC<AlertDetailProps> = ({ alert, onBack }) => {
  const { approveAlert, ignoreAlert, showToast } = useApp();

  const isActioned = alert.status === 'actioned';
  const isIgnored = alert.status === 'ignored';

  // Allow the pharmacist to fine-tune the recommended increment
  const [customUnits, setCustomUnits] = useState<number>(alert.recommendedIncreaseUnits);

  const newReorderTotal = alert.currentReorder + customUnits;

  const handleApprove = () => {
    approveAlert(alert.id);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-20 text-slate-800">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-[#0A5D52] via-[#0D6D60] to-[#0F766E] text-white px-5 pt-3 pb-4 shadow-md shadow-teal-950/10 border-b border-teal-600/30">
        <div className="flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onBack}
            className="p-1.5 -ml-1.5 text-white hover:bg-white/15 rounded-xl transition-all flex items-center gap-1 text-xs font-bold active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Alerts</span>
          </motion.button>
          <div className="h-4 w-px bg-teal-400/40" />
          <span className="text-sm font-bold tracking-tight text-white truncate">
            Clinical Decision Support
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-3.5 space-y-4 max-w-xl mx-auto">
        {/* Alert Headline Card (Figure 3) */}
        <section
          aria-label="Alert headline"
          className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#DC2626]">
              <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 fill-red-100 stroke-red-600" />
              </div>
              <span className="text-xs font-black tracking-wider uppercase">
                {alert.severity === 'CRITICAL' ? 'CRITICAL ALERT' : 'SURGE WARNING'}
              </span>
            </div>

            <div className="flex items-center text-slate-400 text-xs gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{alert.timestamp}</span>
            </div>
          </div>

          <h1 className="text-lg font-black text-slate-900 leading-snug">
            {alert.title}
          </h1>

          <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">Validated: Open-Meteo Live API · Sri Lanka Epidemiology Unit</span>
          </div>

          {/* Status pill if already resolved */}
          {isActioned && (
            <div className="mt-2 py-2 px-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#16A34A] animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Approved: Inventory reorder threshold calibrated to {newReorderTotal} units</span>
            </div>
          )}

          {isIgnored && (
            <div className="mt-2 py-2 px-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600">
              Alert was dismissed
            </div>
          )}
        </section>

        {/* Data Justification Card (Figure 3: Thresholds matched against academic data) */}
        <section
          aria-label="Data justification"
          className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs space-y-3.5"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">Data Justification</h2>
            </div>
            <span className="text-[11px] font-extrabold text-[#0F766E] bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
              RULE {alert.ruleId}
            </span>
          </div>

          {/* Condition items */}
          <div className="space-y-3 pt-0.5">
            {alert.conditions.map((cond, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {cond.label}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Epidemiological threshold: <strong className="text-slate-700">{cond.threshold}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      idx === 0
                        ? 'bg-sky-50 text-[#0284C7] border border-sky-200'
                        : idx === 1
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {cond.actualValue}
                  </span>
                  {cond.satisfied && (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center text-xs font-black">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Action Card (Figure 3: Target reorder levels) */}
        <section
          aria-label="Recommended action"
          className="bg-white rounded-3xl p-4.5 border border-slate-200/80 shadow-xs space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-wider text-teal-800 uppercase block">
              RECOMMENDED REORDER SURGE
            </span>
            <span className="text-[10px] font-bold bg-teal-100/80 text-teal-800 px-2 py-0.5 rounded-full">
              {alert.ruleId === 'R2' ? '+20% Surge' : alert.ruleId === 'R3' ? '+30% Surge' : '+15% Surge'}
            </span>
          </div>

          <div className="p-3.5 bg-teal-50/60 border border-teal-200/80 rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-snug">
                Increase {alert.medicineName} Reorder
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className="text-slate-500 font-medium">Reorder level:</span>
                <span className="font-bold text-slate-800">{alert.currentReorder}</span>
                <span className="text-slate-400">→</span>
                <span className="font-extrabold text-[#0F766E] text-sm">{newReorderTotal} units</span>
              </div>
            </div>

            {/* Stepper adjustment if pharmacist wants to fine-tune */}
            <div className="flex items-center bg-white border border-teal-300/80 rounded-xl p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setCustomUnits(Math.max(10, customUnits - 10))}
                className="w-7 h-7 flex items-center justify-center text-teal-700 hover:bg-teal-50 rounded-lg transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-black text-teal-900">
                +{customUnits}
              </span>
              <button
                type="button"
                onClick={() => setCustomUnits(customUnits + 10)}
                className="w-7 h-7 flex items-center justify-center text-teal-700 hover:bg-teal-50 rounded-lg transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* Academic Source Citation Note */}
        <div className="px-3 py-2 bg-slate-100/70 border border-slate-200/60 rounded-2xl text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed italic font-medium">
            "{alert.academicCitation}"
          </p>
        </div>

        {/* Action Buttons (Figure 3) */}
        <div className="space-y-2.5 pt-2">
          {!isActioned && (
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleApprove}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0F766E] to-[#0A6C58] hover:from-[#0A6C58] hover:to-[#085545] text-white font-bold text-sm rounded-2xl shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4 stroke-[2.8]" />
              <span>Approve & Update Inventory ({newReorderTotal} Units)</span>
            </motion.button>
          )}

          {!isIgnored && !isActioned && (
            <button
              type="button"
              onClick={() => ignoreAlert(alert.id)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition text-center"
            >
              Ignore Alert
            </button>
          )}

          {isActioned && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition text-center"
            >
              Return to Alerts
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
