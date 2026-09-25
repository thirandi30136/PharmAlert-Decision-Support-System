import React, { useState } from 'react';
import { X, CheckCircle2, Play, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RuleTestModal: React.FC = () => {
  const { isTestScenarioOpen, setIsTestScenarioOpen, runTestScenario, setActiveTab } = useApp();
  const [activeTestResult, setActiveTestResult] = useState<{ title: string; outcome: string } | null>(null);

  if (!isTestScenarioOpen) return null;

  const scenarios = [
    {
      id: 1,
      title: 'Scenario 1: Heavy Rain + Rising Search Trend',
      spec: 'Heavy rainfall (>50mm) + rising search trend → monitoring flag should start; no alert yet (within 10-week lag).',
      tag: 'Monitoring Lag Check',
    },
    {
      id: 2,
      title: 'Scenario 2: 10 Weeks Post-Rainfall (Stock Below Reorder)',
      spec: '10 weeks after a monitoring flag, with stock below reorder level → alert should be generated (+20% Paracetamol, +30% ORS).',
      tag: 'Alert Surge Generation',
    },
    {
      id: 3,
      title: 'Scenario 3: Stock Already Above Reorder Level',
      spec: 'Same scenario (week 10 post-flag) but stock is already above reorder level → no alert should be generated.',
      tag: 'False-Positive Prevention',
    },
    {
      id: 4,
      title: 'Scenario 4: Approving an Alert Action',
      spec: 'Approving an alert → inventory quantity/threshold updates and the alert status changes to "actioned".',
      tag: 'Inventory Update Action',
    },
    {
      id: 5,
      title: 'Scenario 5: No Network / API Failure Offline Resilience',
      spec: "No network / API failure → app should show cached data and a clear 'couldn't refresh' message, not crash.",
      tag: 'Offline Resilience',
    },
  ];

  const handleRun = (id: number) => {
    const res = runTestScenario(id);
    setActiveTestResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F766E] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-teal-200" />
            <div>
              <h2 className="text-sm font-bold tracking-tight">Section 7.1 Test Scenario Runner</h2>
              <p className="text-[11px] text-teal-100">Academic verification suite for developer handoff</p>
            </div>
          </div>
          <button
            onClick={() => setIsTestScenarioOpen(false)}
            className="p-1 rounded-full text-white hover:bg-teal-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTestResult && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#16A34A]">
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeTestResult.title}</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{activeTestResult.outcome}</p>
              <div className="mt-2.5 pt-2 border-t border-emerald-200 flex justify-end">
                <button
                  onClick={() => {
                    setIsTestScenarioOpen(false);
                    setActiveTab('home');
                  }}
                  className="text-xs font-bold text-[#0F766E] hover:underline"
                >
                  View on Dashboard →
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{sc.title}</span>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      {sc.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sc.spec}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex justify-end">
                  <button
                    onClick={() => handleRun(sc.id)}
                    className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#0A6C58] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Scenario {sc.id}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={() => setIsTestScenarioOpen(false)}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
};
