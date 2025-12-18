
import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
  primaryColor: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, primaryColor }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Simulated User Database with FMTG branding
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('fmtg_registered_users');
    return users ? JSON.parse(users) : {};
  };

  const saveUser = (user: string, pass: string) => {
    const users = getRegisteredUsers();
    users[user.toLowerCase()] = { username: user, password: pass };
    localStorage.setItem('fmtg_registered_users', JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    if (trimmedUser.length < 3) {
      setError('Identifier must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Access Key must be at least 6 characters');
      return;
    }

    const users = getRegisteredUsers();
    const userKey = trimmedUser.toLowerCase();

    if (isSignUp) {
      if (users[userKey]) {
        setError('This identifier is already registered');
      } else {
        saveUser(trimmedUser, password);
        onLogin(trimmedUser);
      }
    } else {
      const storedUser = users[userKey];
      if (storedUser && storedUser.password === password) {
        onLogin(storedUser.username);
      } else {
        setError('Invalid identifier or access key');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div className="max-w-md w-full glass-card p-10 rounded-[2.5rem] border border-white animate-fade-in shadow-2xl">
        <div className="text-center mb-10">
          <div 
            className="w-16 h-16 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-xl transform rotate-12 transition-transform hover:rotate-0 cursor-default"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, color-mix(in srgb, ${primaryColor}, black 20%))` }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">FMTG Spendings</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Personal Wealth Gateway</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 border border-slate-200/50">
          <button 
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isSignUp ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Authorize
          </button>
          <button 
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isSignUp ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Identifier</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Unique username"
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 transition-all font-semibold text-slate-700"
                style={{ '--tw-ring-color': 'var(--brand-primary-glow)' } as any}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 transition-all font-semibold text-slate-700"
                style={{ '--tw-ring-color': 'var(--brand-primary-glow)' } as any}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl animate-shake">
              <p className="text-[10px] font-bold text-rose-500 uppercase text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-5 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center group"
            style={{ backgroundColor: primaryColor }}
          >
            <span>{isSignUp ? 'Establish Profile' : 'Authorize Access'}</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Encrypted Session &bull; FMTG Security Protocol
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
