
import React, { useState } from 'react';
import { Expense } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="glass-card rounded-[2.5rem] shadow-sm border border-white/60 overflow-hidden">
      <div className="px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Financial Ledger</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Transaction History</p>
        </div>
        
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[var(--brand-primary)]">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full md:w-80 pl-12 pr-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 ring-[var(--brand-primary-glow)] transition-all font-bold text-sm text-slate-800 outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {sortedExpenses.length === 0 ? (
          <div className="px-10 py-24 text-center">
            <div className="w-20 h-20 bg-slate-50/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white shadow-inner">
               <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {expenses.length === 0 ? "Vault is Empty" : "No Correlation Found"}
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/20">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classification</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Liquidity</th>
                <th className="px-10 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-[var(--brand-primary-soft)] transition-colors group">
                  <td className="px-10 py-6 text-[11px] font-extrabold text-slate-400 whitespace-nowrap uppercase">
                    {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center">
                      <div 
                        className="w-9 h-9 rounded-xl mr-4 flex items-center justify-center text-white shadow-md border border-white/20 transition-transform group-hover:scale-110" 
                        style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                      >
                        {CATEGORY_ICONS[expense.category]}
                      </div>
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{expense.category}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-sm font-bold text-slate-800 block">{expense.description}</span>
                  </td>
                  <td className="px-10 py-6 text-sm font-black text-slate-900 text-right whitespace-nowrap tabular-nums">
                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
