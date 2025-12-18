
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { Expense, Category, CategoryBudgets } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  expenses: Expense[];
  budgets: CategoryBudgets;
  income: number;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, budgets, income }) => {
  const now = new Date();
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const categoryData = Object.values(Category).map(cat => ({
    name: cat,
    value: currentMonthExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(d => d.value > 0);

  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMonthlyBudget = (Object.values(budgets) as (number | undefined)[]).reduce<number>((sum, b) => sum + (b || 0), 0);
  
  const netSavings = income - totalSpent;
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;
  const budgetUtilization = totalMonthlyBudget > 0 ? (totalSpent / totalMonthlyBudget) * 100 : 0;

  const budgetItems = Object.entries(budgets)
    .filter(([_, amount]) => amount !== undefined && (amount as number) > 0)
    .map(([cat, budgetAmount]) => {
      const spent = currentMonthExpenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      const percentage = (spent / (budgetAmount as number)) * 100;
      return { category: cat as Category, spent, budget: budgetAmount as number, percentage };
    });

  return (
    <div className="space-y-8">
      {/* Prime Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-7 rounded-[2rem] border-slate-100 stat-card-gradient theme-transition group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Total Outflow</p>
          <p className="text-4xl font-extrabold text-slate-900 leading-none">₹{totalSpent.toLocaleString('en-IN')}</p>
          <div className="mt-4 flex items-center text-xs text-slate-500 font-medium">
             <span className="font-bold text-[var(--brand-primary)] mr-1.5 transition-colors">{currentMonthExpenses.length}</span> recorded entries
          </div>
        </div>

        <div className="glass-card p-7 rounded-[2rem] border-slate-100 group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Monthly Inflow</p>
          <p className="text-4xl font-extrabold text-slate-900 leading-none">₹{income.toLocaleString('en-IN')}</p>
          <div className="mt-5 h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
             <div className="h-full bg-[var(--brand-primary)] theme-transition rounded-full shadow-sm" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className={`glass-card p-7 rounded-[2rem] border-slate-100 ${netSavings >= 0 ? 'bg-emerald-50/10' : 'bg-rose-50/10'}`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Net Capital</p>
          <p className={`text-4xl font-extrabold leading-none ${netSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₹{netSavings.toLocaleString('en-IN')}
          </p>
          <div className="mt-4 flex items-center">
             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${netSavings >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {netSavings >= 0 ? 'Asset Surplus' : 'Budget Deficit'}
             </span>
          </div>
        </div>

        <div className="glass-card p-7 rounded-[2rem] border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Efficiency Rate</p>
          <p className="text-4xl font-extrabold text-slate-900 leading-none">{Math.max(0, Math.round(savingsRate))}%</p>
          <div className="mt-5 h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
             <div 
               className={`h-full theme-transition rounded-full ${savingsRate > 20 ? 'bg-emerald-400' : 'bg-[var(--brand-primary)]'}`} 
               style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
             ></div>
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spending Allocation */}
        <div className="glass-card p-10 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Portfolio Allocation</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Diversification Analysis</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', 
                    fontSize: '12px', 
                    fontWeight: '800',
                    padding: '12px 20px'
                  }}
                  itemStyle={{ color: '#0f172a' }}
                  formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
             {categoryData.slice(0, 4).map(cat => (
               <div key={cat.name} className="flex items-center p-3 rounded-2xl bg-slate-50/50 border border-white/50">
                 <div className="w-2.5 h-2.5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: CATEGORY_COLORS[cat.name as Category] }}></div>
                 <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{cat.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Detailed Budget Pulse */}
        <div className="glass-card p-10 rounded-[2.5rem] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Liquidity Pulse</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Utilization</p>
            </div>
          </div>
          
          <div className="space-y-8 flex-1 overflow-y-auto max-h-[300px] pr-4 custom-scrollbar">
            {budgetItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-white">
                  <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Establish budget constraints to activate</p>
              </div>
            ) : (
              budgetItems.map((item) => (
                <div key={item.category} className="group">
                  <div className="flex justify-between items-end mb-2.5">
                    <div>
                      <span className="text-sm font-black text-slate-800 block mb-0.5">{item.category}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        ₹{item.spent.toLocaleString('en-IN')} of ₹{item.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${item.percentage > 100 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-700'}`}>
                      {Math.round(item.percentage)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className={`h-full theme-transition rounded-full shadow-sm ${
                        item.percentage >= 100 ? 'bg-gradient-to-r from-rose-500 to-rose-400' : 
                        item.percentage >= 85 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 
                        'bg-[var(--brand-primary)]'
                      }`}
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>
                  {item.percentage > 100 && (
                    <div className="flex items-center text-[9px] font-black text-rose-500 uppercase tracking-[0.1em] mt-2">
                       <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2 animate-pulse"></span>
                       Exceeded by ₹{(item.spent - item.budget).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {totalMonthlyBudget > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-100">
               <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Liquidity Utilized</span>
                  <span className={`text-xs font-black ${budgetUtilization > 100 ? 'text-rose-600' : 'text-[var(--brand-primary)]'} theme-transition`}>
                    {budgetUtilization > 100 ? 'Overdraft Warning' : `${Math.round(budgetUtilization)}%`}
                  </span>
               </div>
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                 <div 
                   className={`h-full theme-transition rounded-full ${budgetUtilization > 100 ? 'bg-rose-500' : 'bg-[var(--brand-primary)]'}`} 
                   style={{ width: `${Math.min(100, budgetUtilization)}%` }}
                 ></div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
