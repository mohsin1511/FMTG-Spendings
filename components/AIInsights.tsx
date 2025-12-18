
import React, { useState } from 'react';
import { Expense, InsightResponse } from '../types';
import { getSpendingInsightsAI } from '../services/geminiService';

interface AIInsightsProps {
  expenses: Expense[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ expenses }) => {
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetInsights = async () => {
    if (expenses.length === 0) return;
    setIsLoading(true);
    const result = await getSpendingInsightsAI(expenses);
    setInsight(result);
    setIsLoading(false);
  };

  return (
    <div className="glass-card p-8 rounded-3xl h-full flex flex-col border-indigo-100/50">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">FMTG Intelligence</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Personalized Coaching</p>
        </div>
        <button
          onClick={handleGetInsights}
          disabled={isLoading || expenses.length === 0}
          className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
          title="Refresh Insights"
        >
          <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating Sovereignty Strategy...</p>
          </div>
        ) : insight ? (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
               <p className="text-xs font-semibold text-indigo-900 leading-relaxed">
                 "{insight.summary}"
               </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tactical Moves</h4>
              <ul className="space-y-2">
                {insight.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start text-xs font-bold text-slate-600 bg-white/40 p-3 rounded-2xl border border-white">
                    <span className="text-indigo-500 mr-2 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-slate-50/50 rounded-3xl flex items-center justify-center mb-6 border border-white">
               <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 18v3" />
               </svg>
            </div>
            <p className="text-xs font-bold text-slate-400 max-w-[200px] leading-relaxed uppercase tracking-tighter">
              {expenses.length === 0 
                ? "Log your first transaction for FMTG coaching." 
                : "Analyze your ledger to see strategic saving tips."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
