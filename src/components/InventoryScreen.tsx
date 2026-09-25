import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Pill,
  CheckCircle2,
  AlertTriangle,
  Bell,
  BellOff,
  Edit2,
  X,
  Package,
  Minus,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { Medicine } from '../types';
import { useApp } from '../context/AppContext';

export const InventoryScreen: React.FC = () => {
  const {
    medicines,
    setIsAddEditOpen,
    setEditingMedicine,
    toggleMedicineAlerts,
    saveMedicine,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const categories = ['All', 'Antipyretic', 'ORS', 'Antibiotic', 'Antihistamine', 'Analgesic'];

  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      const matchCategory =
        selectedCategory === 'All' ? true : med.category === selectedCategory;
      const matchSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [medicines, selectedCategory, searchQuery]);

  const belowReorderCount = medicines.filter((m) => m.currentStock < m.reorderThreshold).length;

  const handleEdit = (med: Medicine) => {
    setEditingMedicine(med);
    setIsAddEditOpen(true);
  };

  const handleAddNew = () => {
    setEditingMedicine(null);
    setIsAddEditOpen(true);
  };

  const handleQuickStockChange = (med: Medicine, delta: number) => {
    const updatedStock = Math.max(0, med.currentStock + delta);
    saveMedicine({
      id: med.id,
      name: med.name,
      category: med.category,
      unit: med.unit,
      currentStock: updatedStock,
      reorderThreshold: med.reorderThreshold,
      alertsEnabled: med.alertsEnabled,
      priceLKR: med.priceLKR,
    });
    showToast(`${med.name}: Stock updated to ${updatedStock} ${med.unit.toLowerCase()}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-28 text-slate-800">
      {/* App Bar (Figure 4) */}
      <header className="sticky top-0 z-20 bg-gradient-to-b from-[#0A5D52] via-[#0D6D60] to-[#0F766E] text-white px-5 pt-3 pb-4 shadow-md shadow-teal-950/10 border-b border-teal-600/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">Current Inventory</h1>
              <span className="text-[10px] font-bold bg-teal-400/20 text-teal-200 border border-teal-300/30 px-1.5 py-0.2 rounded-full">
                {medicines.length}
              </span>
            </div>
            <p className="text-[11px] text-teal-100/80 mt-0.5 font-medium">
              Automated Reorder Thresholds
            </p>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-xl transition ${
                isSearchOpen ? 'bg-white text-teal-900 shadow-xs' : 'text-teal-100 hover:bg-white/10'
              }`}
              title="Toggle Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddNew}
              className="px-3 py-1.5 bg-white text-[#0F766E] font-bold text-xs rounded-xl shadow-xs hover:bg-teal-50 flex items-center gap-1 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {isSearchOpen && (
          <div className="mt-3 relative animate-in fade-in slide-in-from-top-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine name or category..."
              className="w-full pl-9 pr-9 py-2 bg-white text-slate-900 text-xs rounded-xl border-0 focus:outline-hidden focus:ring-2 focus:ring-teal-300 placeholder:text-slate-400 font-medium shadow-xs"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-3.5 space-y-3.5 max-w-xl mx-auto">
        {/* Category Horizontal Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Low Stock Warning Summary Bar */}
        {belowReorderCount > 0 && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-medium">
              <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
              <span>
                <strong>{belowReorderCount} medicines</strong> are currently below reorder threshold
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-md">
              Restock Needed
            </span>
          </div>
        )}

        {/* Medicines Catalog List */}
        <div className="space-y-3">
          {filteredMedicines.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No medicines found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try changing your search terms or category filter.
              </p>
            </div>
          ) : (
            filteredMedicines.map((med) => {
              const isLow = med.currentStock < med.reorderThreshold;
              const ratio = Math.min(100, Math.round((med.currentStock / med.reorderThreshold) * 100));
              const isCritical = ratio <= 40;
              const deficit = med.reorderThreshold - med.currentStock;

              return (
                <div
                  key={med.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-teal-500 shadow-xs hover:shadow-md transition space-y-3 group"
                >
                  {/* Card Header: Icon, Name, Category, Status Badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] border border-teal-200/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition">
                        <Pill className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-extrabold text-slate-900">
                            {med.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {med.category} · {med.unit}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        isCritical
                          ? 'bg-red-50 text-[#DC2626] border border-red-200'
                          : isLow
                          ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                          : 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                      }`}
                    >
                      {isCritical ? 'CRITICAL' : isLow ? 'LOW STOCK' : 'SUFFICIENT'}
                    </span>
                  </div>

                  {/* Stock Metrics and Interactive Stepper */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-1">
                        <span className={`text-xl font-black ${isCritical ? 'text-[#DC2626]' : isLow ? 'text-[#D97706]' : 'text-slate-900'}`}>
                          {med.currentStock}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/ {med.reorderThreshold}</span>
                        <span className="text-[10px] text-slate-400">{med.unit.toLowerCase()}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Reorder trigger: {med.reorderThreshold}</p>
                    </div>

                    {/* Quick Stepper for Rapid Restock */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                      <button
                        onClick={() => handleQuickStockChange(med, -10)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition active:scale-90"
                        title="Deduct 10 units"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-700 select-none">
                        ±10
                      </span>
                      <button
                        onClick={() => handleQuickStockChange(med, 10)}
                        className="w-7 h-7 flex items-center justify-center text-teal-700 hover:bg-teal-50 rounded-lg transition active:scale-90"
                        title="Add 10 units"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical
                            ? 'bg-[#DC2626]'
                            : isLow
                            ? 'bg-[#D97706]'
                            : 'bg-[#16A34A]'
                        }`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    {isLow && (
                      <div className="flex justify-between items-center mt-1.5 text-[10px]">
                        <span className="text-red-600 font-bold">
                          {deficit} {med.unit.toLowerCase()} deficit
                        </span>
                        <span className="text-slate-400 font-medium">{ratio}% of threshold</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Automated alerts toggle & Edit button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => toggleMedicineAlerts(med.id)}
                      className={`flex items-center space-x-1.5 font-semibold transition ${
                        med.alertsEnabled ? 'text-[#0F766E]' : 'text-slate-400'
                      }`}
                    >
                      {med.alertsEnabled ? (
                        <>
                          <Bell className="w-3.5 h-3.5" />
                          <span>Automated DSS Active</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-3.5 h-3.5" />
                          <span>Alerts Disabled</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleEdit(med)}
                      className="text-xs font-bold text-[#0F766E] hover:text-[#0A6C58] flex items-center gap-1 bg-teal-50 hover:bg-teal-100/80 px-2.5 py-1 rounded-lg transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Configure</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleAddNew}
        className="fixed bottom-20 right-6 sm:right-8 z-30 w-13 h-13 rounded-full bg-gradient-to-tr from-[#0A6C58] to-[#0F766E] text-white shadow-xl shadow-teal-900/30 flex items-center justify-center active:scale-95 transition"
        title="Add New Medicine"
      >
        <Plus className="w-6 h-6 stroke-[2.6]" />
      </motion.button>
    </div>
  );
};
