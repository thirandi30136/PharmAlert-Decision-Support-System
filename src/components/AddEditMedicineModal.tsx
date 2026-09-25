import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Info, Check, Trash2 } from 'lucide-react';
import { Medicine } from '../types';
import { useApp } from '../context/AppContext';

export const AddEditMedicineModal: React.FC = () => {
  const {
    isAddEditOpen,
    setIsAddEditOpen,
    editingMedicine,
    saveMedicine,
    deleteMedicine,
  } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Medicine['category']>('Antipyretic');
  const [unit, setUnit] = useState('Tablets');
  const [currentStock, setCurrentStock] = useState<number>(100);
  const [reorderThreshold, setReorderThreshold] = useState<number>(200);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [priceLKR, setPriceLKR] = useState<number>(10);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (editingMedicine) {
      setName(editingMedicine.name);
      setCategory(editingMedicine.category);
      setUnit(editingMedicine.unit || 'Tablets');
      setCurrentStock(editingMedicine.currentStock);
      setReorderThreshold(editingMedicine.reorderThreshold);
      setAlertsEnabled(editingMedicine.alertsEnabled);
      setPriceLKR(editingMedicine.priceLKR || 10);
    } else {
      setName('');
      setCategory('Antipyretic');
      setUnit('Tablets');
      setCurrentStock(100);
      setReorderThreshold(200);
      setAlertsEnabled(true);
      setPriceLKR(10);
    }
    setValidationError(null);
  }, [editingMedicine, isAddEditOpen]);

  if (!isAddEditOpen) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setValidationError('Please provide a medicine name');
      return;
    }
    if (currentStock < 0 || reorderThreshold < 0) {
      setValidationError('Stock numbers cannot be negative');
      return;
    }

    saveMedicine({
      name: name.trim(),
      category,
      unit,
      currentStock: Number(currentStock),
      reorderThreshold: Number(reorderThreshold),
      alertsEnabled,
      priceLKR: Number(priceLKR),
    });
  };

  const handleStockChange = (delta: number) => {
    setCurrentStock((prev) => Math.max(0, prev + delta));
  };

  const handleReorderChange = (delta: number) => {
    setReorderThreshold((prev) => Math.max(0, prev + delta));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#F8FAFC] sm:rounded-3xl rounded-t-[28px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        {/* App Bar (Figure 5) */}
        <header className="sticky top-0 z-10 bg-[#0F766E] text-white px-5 pt-4 pb-3 flex items-center justify-between shadow-xs">
          <button
            type="button"
            onClick={() => setIsAddEditOpen(false)}
            className="p-1 -ml-1 text-white hover:bg-teal-800/80 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-sm font-bold text-white tracking-tight">
            {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>

          <button
            type="button"
            onClick={() => handleSave()}
            className="text-xs font-bold text-white hover:text-teal-200 transition px-2 py-1"
          >
            Save
          </button>
        </header>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl">
              {validationError}
            </div>
          )}

          {/* Section: MEDICINE DETAILS */}
          <div className="space-y-3.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              MEDICINE DETAILS
            </span>

            {/* Medicine Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Medicine Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paracetamol 500mg"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-slate-900"
                required
              />
            </div>

            {/* Category Dropdown & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Medicine['category'])}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E2E8F0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-slate-900"
                >
                  <option value="Antipyretic">Antipyretic</option>
                  <option value="ORS">ORS (Rehydration)</option>
                  <option value="Antibiotic">Antibiotic</option>
                  <option value="Antihistamine">Antihistamine</option>
                  <option value="Analgesic">Analgesic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Form / Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-[#E2E8F0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] text-slate-900"
                >
                  <option value="Tablets">Tablets</option>
                  <option value="Sachets">Sachets</option>
                  <option value="Capsules">Capsules</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Inhalers">Inhalers</option>
                  <option value="Units">Units</option>
                </select>
              </div>
            </div>

            {/* Current Stock Level with Stepper */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0]">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Stock Level
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-1.5">
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-20 text-lg font-bold text-slate-900 bg-transparent focus:outline-hidden border-b border-slate-300"
                  />
                  <span className="text-xs text-slate-400">units</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleStockChange(-10)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStockChange(10)}
                    className="w-8 h-8 rounded-lg bg-[#0F766E] hover:bg-[#0A6C58] text-white flex items-center justify-center transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Reorder Threshold with Stepper & Info Box */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0]">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reorder Threshold
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-1.5">
                  <input
                    type="number"
                    min="0"
                    value={reorderThreshold}
                    onChange={(e) =>
                      setReorderThreshold(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-20 text-lg font-bold text-slate-900 bg-transparent focus:outline-hidden border-b border-slate-300"
                  />
                  <span className="text-xs text-slate-400">units</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleReorderChange(-10)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorderChange(10)}
                    className="w-8 h-8 rounded-lg bg-[#0F766E] hover:bg-[#0A6C58] text-white flex items-center justify-center transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info box below reorder (Figure 5) */}
              <div className="mt-3 p-2 bg-teal-50/70 border border-teal-100 rounded-xl flex items-center space-x-2 text-[11px] text-[#0F766E]">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Alerts trigger when stock falls below this level</span>
              </div>
            </div>
          </div>

          {/* Section: ALERT SETTINGS (Figure 5) */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              ALERT SETTINGS
            </span>

            <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] flex items-center justify-between">
              <div className="pr-3">
                <h3 className="font-semibold text-slate-900 text-xs">Enable Automated Alerts</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Trigger procurement alerts from rainfall and epidemiological signals
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    alertsEnabled ? 'bg-[#0F766E]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      alertsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-[10px] font-bold text-slate-500 w-6">
                  {alertsEnabled ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          </div>

          {/* Optional Delete Button if Editing */}
          {editingMedicine && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove ${editingMedicine.name} from inventory?`)) {
                    deleteMedicine(editingMedicine.id);
                    setIsAddEditOpen(false);
                  }
                }}
                className="w-full py-2.5 px-3 text-xs text-red-600 hover:bg-red-50 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Medicine</span>
              </button>
            </div>
          )}
        </form>

        {/* Pinned Save Button (Figure 5) */}
        <div className="p-4 bg-white border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleSave()}
            className="w-full py-3.5 px-4 bg-[#0F766E] hover:bg-[#0A6C58] active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Save Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
