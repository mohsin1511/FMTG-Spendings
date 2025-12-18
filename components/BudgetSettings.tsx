
import React from 'react';
import { Category, CategoryBudgets } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface BudgetSettingsProps {
  budgets: CategoryBudgets;
  onUpdateBudget: (category: Category, amount: number | undefined) => void;
}

const BudgetSettings: React.FC<BudgetSettingsProps> = ({ budgets, onUpdateBudget }) => {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Cap Allocation</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Constraint Management</p>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
        {Object.values(Category).map((cat) => (
          <div key={cat} className="flex items-center justify-between gap-4 group">
            <div className="flex items-center flex-1">
              <div className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: CATEGORY_COLORS[cat] }}></div>
              <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{cat}</span>
            </div>
            <div className="relative flex-shrink-0 w-28">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">₹</span>
              <input
                type="number"
                placeholder="---"
                value={budgets[cat] || ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                  onUpdateBudget(cat, val);
                }}
                className="w-full pl-7 pr-3 py-2.5 text-right text-xs border border-slate-200 rounded-xl focus:ring-4 ring-[var(--brand-primary-glow)] outline-none transition-all font-bold text-slate-800"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetSettings;
