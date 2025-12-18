
import React from 'react';
import { Category, CategoryBudgets } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface FinancialSettingsProps {
  income: number;
  onUpdateIncome: (amount: number) => void;
  budgets: CategoryBudgets;
  onUpdateBudget: (category: Category, amount: number | undefined) => void;
  primaryColor: string;
  onUpdateColor: (color: string) => void;
}

const THEME_PRESETS = [
  { name: 'Midnight', color: '#1e293b' },
  { name: 'Indigo', color: '#4f46e5' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Amber', color: '#f59e0b' },
];

const FinancialSettings: React.FC<FinancialSettingsProps> = ({ 
  income, 
  onUpdateIncome, 
  budgets, 
  onUpdateBudget,
  primaryColor,
  onUpdateColor
}) => {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] shadow-sm border border-white/60 space-y-10">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Configuration</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sovereign Settings</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </div>
      </div>

      <div className="space-y-8">
        {/* Income Input */}
        <div className="group">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 px-1">Monthly Yield</label>
          <div className="relative">
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
             <input
                type="number"
                placeholder="0.00"
                value={income || ''}
                onChange={(e) => onUpdateIncome(parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 ring-[var(--brand-primary-glow)] outline-none transition-all font-bold text-slate-800"
             />
          </div>
        </div>

        {/* Theme Settings */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 px-1">Visual Identity</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {THEME_PRESETS.map((theme) => (
              <button
                key={theme.name}
                onClick={() => onUpdateColor(theme.color)}
                className={`w-9 h-9 rounded-2xl border-2 transition-all transform hover:scale-110 shadow-sm ${primaryColor === theme.color ? 'border-slate-800 scale-110' : 'border-white'}`}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
              />
            ))}
            <div className="relative group ml-1">
              <input 
                type="color" 
                value={primaryColor}
                onChange={(e) => onUpdateColor(e.target.value)}
                className="w-9 h-9 rounded-2xl cursor-pointer border-2 border-white hover:scale-110 transition-transform bg-transparent"
                style={{ padding: 0 }}
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shadow-xl">HEX Selector</span>
            </div>
          </div>
        </div>

        {/* Budget Inputs */}
        <div className="pt-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-5 px-1">Sector Budgets</label>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
            {Object.values(Category).map((cat) => (
              <div key={cat} className="flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-white/60 border border-transparent hover:border-slate-100 transition-all group">
                <div className="flex items-center flex-1">
                  <div className="w-2.5 h-2.5 rounded-full mr-3 shadow-inner" style={{ backgroundColor: CATEGORY_COLORS[cat] }}></div>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{cat}</span>
                </div>
                <div className="relative w-28">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="---"
                    value={budgets[cat] || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                      onUpdateBudget(cat, val);
                    }}
                    className="w-full pl-7 pr-4 py-2.5 text-right text-xs bg-white/80 border border-slate-100 rounded-xl focus:ring-4 ring-[var(--brand-primary-glow)] outline-none transition-all font-bold text-slate-800 shadow-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSettings;
