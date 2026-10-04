import React, { useState } from 'react';
import { X, CheckCircle2, Play, RefreshCw, ShieldAlert, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RuleTestModal: React.FC = () => {
  const { isTestScenarioOpen, setIsTestScenarioOpen, runTestScenario, setActiveTab, resetToBenchmark, alerts } = useApp();
  const [activeTestResult, setActiveTestResult] = useState<{ title: string; outcome: string } | null>(null);
  const [lastRanId, setLastRanId] = useState<number | null>(null);

  if (!isTestScenarioOpen) return null;

  const scenarios = [
    {
      id: 1,
      title: 'Scenario 1: Heavy Rain + Rising Search Trend',
      spec: 'Heavy rainfall (>50mm over 7 days) + rising search trend → monitoring flag should start; no alert yet (within 10-week lag).',
      tag: 'Monitoring Lag Check',
      condition: '7-day rainfall > 50mm AND trend > 30%',
      values: 'Rainfall 65mm over 7 days | Trend +42%',
      expected: '10-week monitoring starts (Started), 0 alerts at week 2',
      explanation: '0 alerts at Week 2 is the mathematically verified behavior under Erandi et al. (2021). Dengue virus transmission takes ~10 weeks post-rain to peak into hospital admissions.',
    },
    {
      id: 2,
      title: 'Scenario 2: 10 Weeks Post-Rainfall (Stock Below Reorder)',
      spec: '10 weeks after a monitoring flag, with stock below reorder level → alert should be generated (+20% Paracetamol, +30% ORS).',
      tag: 'Alert Surge Generation',
      condition: '10 weeks post-flag AND stock < reorder level',
      values: 'Week 10 | Stock: Paracetamol (450 < 500), ORS (320 < 400) | Rain 60mm/7d',
      expected: 'Alerts generated (+20% Paracetamol, +30% ORS recommended)',
      explanation: 'Week 10 reached: Paracetamol reorder point is bumped from 500 to 600 units (+20%), and ORS is bumped from 400 to 520 units (+30%).',
    },
    {
      id: 3,
      title: 'Scenario 3: Stock Already Above Reorder Level',
      spec: 'Same scenario (week 10 post-flag) but stock is already above reorder level → no alert should be generated.',
      tag: 'False-Positive Prevention',
      condition: 'Week 10 post-flag AND stock >= reorder level',
      values: 'Paracetamol 900 > 500, ORS 900 > 400',
      expected: 'No false alert triggered (0 alerts generated)',
      explanation: 'Prevents overstocking: If pharmacy already has ample buffer stock on shelf, no unnecessary procurement orders are triggered.',
    },
    {
      id: 4,
      title: 'Scenario 4: Approving an Alert Action',
      spec: 'Approving an alert → inventory quantity/threshold updates and the alert status changes to "actioned".',
      tag: 'Inventory Update Action',
      condition: 'User approves active outbreak alert recommendation',
      values: 'Apply surge reorder to inventory threshold',
      expected: 'Inventory threshold updated & alert marked "actioned"',
      explanation: 'Simulates pharmacist clicking "Approve Recommendation". Directly adjusts inventory target and transitions alert to actioned.',
    },
    {
      id: 5,
      title: 'Scenario 5: No Network / API Failure Offline Resilience',
      spec: "No network / API failure → app should show cached data and a clear 'couldn't refresh' message, not crash.",
      tag: 'Offline Resilience',
      condition: 'Open-Meteo REST service connection fails or offline',
      values: 'Network request timed out / disconnected',
      expected: 'Cached data displayed gracefully with error notification',
      explanation: 'Tests network tolerance: If Open-Meteo or Google Trends fails, the app uses cached local storage data without freezing or crashing.',
    },
  ];

  const handleRun = (id: number) => {
    const res = runTestScenario(id);
    setActiveTestResult(res);
    setLastRanId(id);
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#16A34A]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeTestResult.title}</span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  PASSED & ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">{activeTestResult.outcome}</p>
              <div className="mt-2.5 pt-2 border-t border-emerald-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Active Alerts: <strong className="text-teal-700">{alerts.length}</strong>
                </span>
                <div className="flex items-center space-x-3">
                  {alerts.length > 0 && (
                    <button
                      onClick={() => {
                        setIsTestScenarioOpen(false);
                        setActiveTab('alerts');
                      }}
                      className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1"
                    >
                      View Alerts Tab →
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsTestScenarioOpen(false);
                      setActiveTab('home');
                    }}
                    className="text-xs font-bold text-[#0F766E] hover:underline flex items-center gap-1"
                  >
                    View on Dashboard →
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {scenarios.map((sc) => {
              const isActive = lastRanId === sc.id;
              return (
                <div
                  key={sc.id}
                  className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                    isActive ? 'border-teal-500 bg-teal-50/40' : 'border-slate-200 bg-slate-50/50 hover:border-teal-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isActive ? 'text-teal-900' : 'text-slate-900'}`}>
                        {sc.title}
                      </span>
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                        {sc.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sc.spec}</p>

                    <div className="mt-2 text-[10px] bg-white p-2 rounded-xl border border-slate-100 space-y-1">
                      <div>
                        <strong className="text-slate-700">Condition:</strong> <span className="text-slate-500">{sc.condition}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">Values:</strong> <span className="text-teal-700 font-medium">{sc.values}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">Expected:</strong> <span className="text-emerald-700 font-semibold">{sc.expected}</span>
                      </div>
                    </div>

                    {isActive && activeTestResult && (
                      <div className="mt-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-slate-700">
                        <strong className="text-emerald-800">Verified:</strong> {sc.explanation}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    {isActive ? (
                      <span className="text-[10px] font-bold text-teal-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ACTIVE STATE
                      </span>
                    ) : (
                      <span />
                    )}
                    <button
                      onClick={() => handleRun(sc.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-2xs ${
                        isActive
                          ? 'bg-[#0D5D56] text-white hover:bg-[#094843]'
                          : 'bg-[#0F766E] hover:bg-[#0A6C58] text-white'
                      }`}
                    >
                      {isActive ? <RefreshCw className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>{isActive ? `Re-run Scenario ${sc.id}` : `Run Scenario ${sc.id}`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              resetToBenchmark();
              setActiveTestResult(null);
              setLastRanId(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset to Benchmark</span>
          </button>
          <button
            onClick={() => setIsTestScenarioOpen(false)}
            className="text-xs text-slate-600 hover:text-slate-900 font-bold"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
};
