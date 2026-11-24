import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Bot, 
  PhoneCall, 
  TrendingUp, 
  Search, 
  Filter, 
  Eye, 
  UserCheck, 
  AlertTriangle,
  CreditCard
} from 'lucide-react';

interface TenantUser {
  id: string;
  name: string;
  email: string;
  org: string;
  plan: 'free' | 'starter' | 'premium';
  agentsCount: number;
  callsUsed: number;
  callsLimit: number;
  status: 'Active' | 'Suspended';
  createdAt: string;
}

const mockTenants: TenantUser[] = [
  { id: 'usr_101', name: 'Rohan Sharma', email: 'founder@fintech.in', org: 'Fintech Innovations Ltd', plan: 'free', agentsCount: 4, callsUsed: 18, callsLimit: 100, status: 'Active', createdAt: '2024-11-01' },
  { id: 'usr_102', name: 'Sneha Patel', email: 'sneha@retailkart.com', org: 'RetailKart Commerce', plan: 'starter', agentsCount: 5, callsUsed: 142, callsLimit: 200, status: 'Active', createdAt: '2024-10-18' },
  { id: 'usr_103', name: 'Vikramaditya Roy', email: 'v.roy@bajajwealth.in', org: 'Bajaj Wealth Advisory', plan: 'premium', agentsCount: 14, callsUsed: 890, callsLimit: -1, status: 'Active', createdAt: '2024-09-12' },
  { id: 'usr_104', name: 'Karthik Raja', email: 'contact@chennaiproperties.com', org: 'Chennai Properties', plan: 'starter', agentsCount: 2, callsUsed: 65, callsLimit: 200, status: 'Active', createdAt: '2024-11-10' },
  { id: 'usr_105', name: 'Arjun Mehta', email: 'arjun@quickloans.co', org: 'QuickLoans NBFC', plan: 'free', agentsCount: 1, callsUsed: 98, callsLimit: 100, status: 'Active', createdAt: '2024-11-20' },
];

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantUser[]>(mockTenants);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<TenantUser | null>(null);

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.org.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAgents = tenants.reduce((acc, t) => acc + t.agentsCount, 0);
  const totalCalls = tenants.reduce((acc, t) => acc + t.callsUsed, 0);

  const toggleStatus = (id: string) => {
    setTenants(tenants.map(t => t.id === id ? {
      ...t,
      status: t.status === 'Active' ? 'Suspended' : 'Active'
    } : t));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Superuser Admin Console</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Platform Master
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit and control across all tenant organizations, agent allocations, and telephony quotas.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
          Admin Logged In: <strong>{user?.email}</strong>
        </div>
      </div>

      {/* Admin KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Registered Tenants</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{tenants.length}</p>
          <p className="text-[11px] text-emerald-400 mt-1">+2 signed up today</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Voice Agents</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalAgents}</p>
          <p className="text-[11px] text-purple-300 mt-1">Across 11 Indic dialects</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Platform Calls Dispatched</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalCalls.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-400 mt-1">100% Sarvam Telephony uptime</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Monthly Run Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">₹18,490</p>
          <p className="text-[11px] text-emerald-400 mt-1">Via Razorpay Subscriptions</p>
        </div>
      </div>

      {/* Tenants Table Card */}
      <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by user or org..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <span className="text-xs text-slate-400">
            Showing <strong>{filteredTenants.length}</strong> active workspaces
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-white/5">
                <th className="py-3 font-semibold">User & Client Organization</th>
                <th className="py-3 font-semibold">Current Tier</th>
                <th className="py-3 font-semibold">Agents Created</th>
                <th className="py-3 font-semibold">Calls Quota</th>
                <th className="py-3 font-semibold">Account Status</th>
                <th className="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3">
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.email} • <span className="text-slate-300">{t.org}</span></p>
                  </td>

                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.plan === 'premium' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                        : t.plan === 'starter' 
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {t.plan}
                    </span>
                  </td>

                  <td className="py-3 font-mono font-bold text-white">
                    <span className="flex items-center space-x-1.5">
                      <Bot className="w-3.5 h-3.5 text-brand-400" />
                      <span>{t.agentsCount} agents</span>
                    </span>
                  </td>

                  <td className="py-3 font-mono">
                    <span className="text-white font-bold">{t.callsUsed}</span>
                    <span className="text-slate-400"> / {t.callsLimit === -1 ? 'Unlimited' : t.callsLimit}</span>
                  </td>

                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedTenant(t)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-200 border border-white/5 transition-all"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => toggleStatus(t.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        t.status === 'Active' 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-300 hover:bg-rose-500/20' 
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
                      }`}
                    >
                      {t.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Inspect Tenant Details Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Tenant Inspection</h3>
              <button onClick={() => setSelectedTenant(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong className="text-slate-400">Organization:</strong> <span className="text-white">{selectedTenant.org}</span></p>
              <p><strong className="text-slate-400">User Email:</strong> <span className="text-white">{selectedTenant.email}</span></p>
              <p><strong className="text-slate-400">Tier:</strong> <span className="text-brand-300 capitalize font-bold">{selectedTenant.plan}</span></p>
              <p><strong className="text-slate-400">Voice Agents:</strong> <span className="text-white font-bold">{selectedTenant.agentsCount}</span></p>
              <p><strong className="text-slate-400">Calls Dispatched:</strong> <span className="text-white font-bold">{selectedTenant.callsUsed}</span></p>
              <p><strong className="text-slate-400">Registered On:</strong> <span className="text-white">{selectedTenant.createdAt}</span></p>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedTenant(null)}
                className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold text-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
