import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  PhoneCall, 
  Zap, 
  ShieldCheck, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X, 
  Sparkles,
  CreditCard,
  ChevronRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-all">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  SarvamVoice
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Enterprise Indic Voice Telephony</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <Link 
              to="/" 
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/' ? 'text-white bg-white/10 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/agents') 
                      ? 'text-white bg-brand-600/30 border border-brand-500/40' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Agent Console
                </Link>
                <Link 
                  to="/playground" 
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    location.pathname === '/playground' 
                      ? 'text-brand-300 bg-brand-500/20 border border-brand-500/40' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
                  <span>Playground</span>
                </Link>
                <Link 
                  to="/campaigns" 
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === '/campaigns' 
                      ? 'text-white bg-white/10' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Bulk Campaigns
                </Link>
              </>
            )}

            <Link 
              to="/plans" 
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === '/plans' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Plans & Pricing
            </Link>

            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1 ${
                  location.pathname === '/admin' 
                    ? 'text-purple-300 bg-purple-500/30 border border-purple-500/50' 
                    : 'text-purple-400 hover:bg-purple-500/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Right Action / User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Plan quota pill */}
                <Link 
                  to="/plans" 
                  className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 hover:border-brand-500/50 transition-all text-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="capitalize font-semibold text-slate-200">{user.plan}</span>
                  <span className="text-slate-400">
                    ({user.callsLimit === -1 ? 'Unlimited' : `${user.callsUsed}/${user.callsLimit} calls`})
                  </span>
                </Link>

                {/* Role Switcher pill (User <-> Admin) for seamless testing */}
                <button
                  onClick={() => switchRole(user.role === 'admin' ? 'user' : 'admin')}
                  className="text-xs px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all flex items-center space-x-1"
                  title="Click to toggle Admin / User mode"
                >
                  <span className="text-[10px] text-slate-400">Mode:</span>
                  <span className="font-semibold text-brand-300 capitalize">{user.role}</span>
                </button>

                {/* User menu */}
                <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-brand-600/40 border border-brand-500/50 flex items-center justify-center text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary-gradient px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-glow-sm"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <button
                onClick={() => switchRole(user.role === 'admin' ? 'user' : 'admin')}
                className="text-xs px-2 py-1 rounded bg-white/10 text-brand-300"
              >
                {user.role}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
          >
            Overview
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
              >
                Agent Console
              </Link>
              <Link
                to="/playground"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
              >
                Test Playground
              </Link>
              <Link
                to="/telephony"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
              >
                Phone Numbers & Telephony
              </Link>
              <Link
                to="/campaigns"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
              >
                Bulk Campaigns
              </Link>
              <Link
                to="/knowledge"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
              >
                Knowledge Base & CRM
              </Link>
              <Link
                to="/plans"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
              >
                Plans ({user.plan}: {user.callsUsed}/{user.callsLimit === -1 ? '∞' : user.callsLimit} calls)
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-bold text-purple-300 bg-purple-500/20"
                >
                  Admin Monitor Dashboard
                </Link>
              )}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-lg border border-white/10 text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 rounded-lg btn-primary-gradient text-white font-semibold"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
