
import React, { useState, useEffect } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import FinancialSettings from './components/FinancialSettings';
import Login from './components/Login';
import { Expense, Category, CategoryBudgets } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [user, setUser] = useState<string>(() => {
    return localStorage.getItem('currentUser') || '';
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudgets>({});
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  const [primaryColor, setPrimaryColor] = useState<string>(() => {
    return localStorage.getItem('primaryColor') || '#4f46e5';
  });

  // Load User Specific Data whenever the user changes
  useEffect(() => {
    if (user) {
      const savedExpenses = localStorage.getItem(`fmtg_${user}_expenses`);
      const savedBudgets = localStorage.getItem(`fmtg_${user}_budgets`);
      const savedIncome = localStorage.getItem(`fmtg_${user}_income`);

      setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
      setBudgets(savedBudgets ? JSON.parse(savedBudgets) : {});
      setMonthlyIncome(savedIncome ? parseFloat(savedIncome) : 0);
    } else {
      setExpenses([]);
      setBudgets({});
      setMonthlyIncome(0);
    }
  }, [user]);

  // Persistent Savings
  useEffect(() => {
    if (user) localStorage.setItem(`fmtg_${user}_expenses`, JSON.stringify(expenses));
  }, [expenses, user]);

  useEffect(() => {
    if (user) localStorage.setItem(`fmtg_${user}_budgets`, JSON.stringify(budgets));
  }, [budgets, user]);

  useEffect(() => {
    if (user) localStorage.setItem(`fmtg_${user}_income`, monthlyIncome.toString());
  }, [monthlyIncome, user]);

  useEffect(() => {
    localStorage.setItem('primaryColor', primaryColor);
    document.documentElement.style.setProperty('--brand-primary', primaryColor);
  }, [primaryColor]);

  const handleLogin = (username: string) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', username);
    setUser(username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  };

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID()
    };
    setExpenses(prev => [...prev, expense]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateBudget = (category: Category, amount: number | undefined) => {
    setBudgets(prev => ({
      ...prev,
      [category]: amount
    }));
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} primaryColor={primaryColor} />;
  }

  return (
    <div className="min-h-screen pb-20 theme-transition">
      {/* Refined Premium Header */}
      <nav className="sticky top-0 z-50 glass-card px-6 md:px-12 py-5 border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor}, black 20%))` }}
            >
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 leading-tight">
                FMTG Spendings
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: primaryColor }}>Wealth Platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-slate-100/50 p-1.5 rounded-2xl border border-white/50">
             <button 
               className="px-5 py-2 text-xs font-bold bg-white rounded-xl shadow-sm border border-slate-100 theme-transition"
               style={{ color: primaryColor }}
             >
               Intelligence
             </button>
             <button className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">Portfolio</button>
             <button 
               onClick={handleLogout}
               className="px-5 py-2 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
             >
               Sign Out
             </button>
          </div>
          <div className="flex items-center space-x-3">
             <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Principal</p>
                <p className="text-xs font-bold text-emerald-500 flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                  {user}
                </p>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400">
               {user.charAt(0).toUpperCase()}
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-10 space-y-10 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Dashboard expenses={expenses} budgets={budgets} income={monthlyIncome} />
          </div>
          <div className="lg:col-span-4">
            <AIInsights expenses={expenses} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-8">
            <ExpenseForm onAddExpense={handleAddExpense} />
            <FinancialSettings 
              income={monthlyIncome} 
              onUpdateIncome={setMonthlyIncome}
              budgets={budgets} 
              onUpdateBudget={handleUpdateBudget}
              primaryColor={primaryColor}
              onUpdateColor={setPrimaryColor}
            />
            <div 
              className="p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group theme-transition"
              style={{ backgroundColor: primaryColor }}
            >
               <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest mb-2 opacity-80">FMTG Strategy</h4>
                 <p className="text-xs font-medium leading-relaxed">
                   Maintain a <span className="underline decoration-white/30">20% savings rate</span> to reach your FMTG financial goals faster. Use the Pulse dashboard to monitor efficiency.
                 </p>
               </div>
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 md:px-12 mt-20 text-center py-10 border-t border-slate-200/50">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">&copy; 2024 FMTG Spendings &bull; AI Powered Financial Sovereignty</p>
      </footer>
    </div>
  );
};

export default App;
