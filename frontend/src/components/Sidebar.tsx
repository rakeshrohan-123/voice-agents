import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  Sparkles,
  PhoneCall,
  Activity,
  Megaphone,
  BookOpen,
  CreditCard,
  ShieldCheck,
  Headphones
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/agents', label: 'Voice Agents', icon: Bot },
    { to: '/playground', label: 'Test Playground', icon: Sparkles, badge: 'Live' },
    { to: '/telephony', label: 'Telephony & Numbers', icon: PhoneCall },
    { to: '/call-logs', label: 'Call Logs', icon: Activity, badge: 'Live' },
    { to: '/campaigns', label: 'Bulk Campaigns', icon: Megaphone },
    { to: '/knowledge', label: 'Knowledge & Tools', icon: BookOpen },
    { to: '/plans', label: 'Plans & Billing', icon: CreditCard },
  ];

  if (user?.role === 'admin') {
    navItems.push({
      to: '/admin',
      label: 'Admin Monitor',
      icon: ShieldCheck,
      badge: 'Superuser',
    });
  }

  return (
    <aside className="w-full md:w-64 glass-card md:min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between border-r border-white/5">
      <div className="space-y-6">
        {/* Workspace info */}
        <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5">
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active Tenant</p>
          <p className="text-sm font-bold text-white truncate">{user?.clientName || 'Demo Organization'}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
            <span>Calls quota:</span>
            <span className="font-semibold text-brand-300">
              {user?.callsLimit === -1 ? 'Unlimited' : `${user?.callsUsed || 0} / ${user?.callsLimit || 100}`}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600/30 to-purple-600/20 text-white border border-brand-500/40 shadow-glow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-brand-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.badge === 'Superuser' 
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sarvam Engine Status Card */}
      <div className="mt-8 p-3 rounded-xl bg-brand-950/40 border border-brand-500/20">
        <div className="flex items-center space-x-2 text-xs font-semibold text-brand-300">
          <Headphones className="w-3.5 h-3.5 text-brand-400" />
          <span>Sarvam Indic TTS / STT</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Engine Status:</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online (180ms)</span>
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>Languages:</span>
          <span className="text-slate-300 font-mono">11 Indic + Eng</span>
        </div>
      </div>
    </aside>
  );
};
