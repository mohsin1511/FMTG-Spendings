
import React, { useState } from 'react';
import { Category } from '../types';
import { categorizeExpenseAI } from '../services/geminiService';

interface ExpenseFormProps {
  onAddExpense: (expense: { description: string; amount: number; category: Category; date: string }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>(Category.Others);
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAddExpense({
      description,
      amount: parseFloat(amount),
      category,
      date
    });

    setDescription('');
    setAmount('');
    setCategory(Category.Others);
  };

  const handleBlurDescription = async () => {
    if (description.length > 3 && category === Category.Others) {
      setIsCategorizing(true);
      const aiCategory = await categorizeExpenseAI(description);
      setCategory(aiCategory);
      setIsCategorizing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-10 rounded-[2.5rem] shadow-sm border border-white/60 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">New Entry</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Capital Logging</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[var(--brand-primary-glow)] flex items-center justify-center theme-transition" style={{ color: 'var(--brand-primary)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="group">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleBlurDescription}
            placeholder="Merchant or Service..."
            className="w-full px-5 py-4 bg-white/50 rounded-2xl border border-slate-200 outline-none text-sm font-bold text-slate-800 transition-all focus:ring-4 ring-[var(--brand-primary-glow)]"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Amount</label>
            <div className="relative">
               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
               <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-5 py-4 bg-white/50 rounded-2xl border border-slate-200 outline-none text-sm font-bold text-slate-800 transition-all focus:ring-4 ring-[var(--brand-primary-glow)]"
                required
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-4 bg-white/50 rounded-2xl border border-slate-200 outline-none text-sm font-bold text-slate-800 transition-all focus:ring-4 ring-[var(--brand-primary-glow)]"
              required
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1 flex justify-between">
            <span>Classification</span>
            {isCategorizing && <span className="lowercase animate-pulse flex items-center" style={{ color: 'var(--brand-primary)' }}>
              <span className="w-1 h-1 rounded-full bg-current mr-1"></span>
              FMTG AI Analysis
            </span>}
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-5 py-4 bg-white/50 rounded-2xl border border-slate-200 outline-none appearance-none font-bold text-sm text-slate-800 transition-all focus:ring-4 ring-[var(--brand-primary-glow)]"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full theme-transition text-white font-black py-5 rounded-2xl shadow-xl active:scale-[0.98] text-xs uppercase tracking-[0.2em] transform hover:translate-y-[-2px] hover:shadow-2xl"
        style={{ background: `linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-primary), black 15%))` }}
      >
        Authorize Transaction
      </button>
    </form>
  );
};

export default ExpenseForm;
