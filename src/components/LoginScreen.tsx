import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('nimal@pharmacy.lk');
  const [password, setPassword] = useState('pharmacy2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  const handleQuickDemo = () => {
    setEmail('nimal@pharmacy.lk');
    setPassword('pharmacy2026');
    login('nimal@pharmacy.lk', 'pharmacy2026');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#05362C] via-[#0A6C58] to-[#0D7D67] flex flex-col justify-between text-white select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Brand Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-6 text-center relative z-10">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20">
            <div className="relative flex items-center justify-center">
              <Shield className="w-12 h-12 text-white stroke-[1.5]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-2xl font-black leading-none select-none">+</span>
              </div>
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0A6C58] flex items-center justify-center text-[10px] font-bold text-teal-950">
            ✓
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-1">
          Pharm<span className="text-teal-200">Alert</span>
        </h1>
        <p className="text-xs text-teal-100/90 mt-1 max-w-[260px] font-medium leading-relaxed">
          Proactive inventory surveillance for SME pharmacies
        </p>

        {/* Quick Demo Pill */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="mt-4 px-4 py-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 transition-all text-white rounded-full border border-white/25 flex items-center gap-1.5 shadow-xs active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>Quick Demo (Nimal · Colombo)</span>
        </button>
      </div>

      {/* White Bottom Sheet Card */}
      <div className="w-full bg-white rounded-t-[36px] px-6 sm:px-7 pt-7 pb-8 text-slate-800 shadow-2xl transition-all relative z-10">
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
              Colombo SME
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Sign in to manage calibrated epidemic inventory
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nimal@pharmacy.lk"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] focus:border-transparent text-slate-900 font-medium transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0F766E] focus:border-transparent text-slate-900 font-medium transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-0.5">
            <button
              type="button"
              onClick={() => alert('Password reset simulation for registered pharmacies.')}
              className="text-xs font-semibold text-[#0F766E] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#0F766E] to-[#0A6C58] hover:from-[#0A6C58] hover:to-[#085545] text-white font-bold text-xs rounded-xl shadow-md shadow-teal-900/15 flex items-center justify-center gap-2 transition"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 tracking-tight font-medium">
              Open-Meteo Weather API · Sri Lanka Epidemiology Unit
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
