import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  PhoneCall, 
  Megaphone, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Play,
  ArrowUpRight,
  Zap,
  PhoneForwarded
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();

  const recentCalls = [
    { id: 'call_9101', number: '+91 98201 44521', agent: 'Loan EMI Recovery (Hindi)', duration: '01:42', status: 'Completed', cost: '1 call', time: '12 mins ago' },
    { id: 'call_9102', number: '+91 94451 88921', agent: 'E-com Delivery Bot (Tamil)', duration: '00:58', status: 'Completed', cost: '1 call', time: '45 mins ago' },
    { id: 'call_9103', number: '+91 88720 12390', agent: 'Lead Qualifier (English)', duration: '02:14', status: 'Completed', cost: '1 call', time: '2 hours ago' },
    { id: 'call_9104', number: '+91 99800 55412', agent: 'Customer Feedback (Telugu)', duration: '00:00', status: 'No Answer', cost: '0 call', time: '3 hours ago' },
  ];

  const quotaPercent = user?.callsLimit === -1 
    ? 15 
    : Math.min(100, Math.round(((user?.callsUsed || 0) / (user?.callsLimit || 100)) * 100));

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl glass-card border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-brand-500/10 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-brand-400">Voice Control Console</span>
          <h1 className="text-2xl font-bold text-white mt-1">Hello, {user?.name || 'Rohan'}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Workspace: <strong className="text-slate-300">{user?.clientName}</strong> • Sarvam Indic Pipeline: <span className="text-emerald-400 font-semibold">Active</span>
          </p>
        </div>

        {/* Quota Gauge */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 w-full md:w-72">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Monthly Plan Quota:</span>
            <span className="font-bold text-brand-300">
              {user?.callsLimit === -1 ? 'Unlimited' : `${user?.callsUsed} / ${user?.callsLimit} calls`}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className={`h-full transition-all rounded-full ${quotaPercent > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-brand-500 to-purple-500'}`} 
              style={{ width: `${quotaPercent}%` }}
            ></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 capitalize">{user?.plan} Tier</span>
            <Link to="/plans" className="text-brand-400 hover:text-brand-300 font-semibold flex items-center">
              <span>Upgrade Plan</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl glass-card border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Agents</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">4</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Hindi, Tamil, Telugu, Eng
          </p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Calls Made</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{user?.callsUsed || 18}</p>
          <p className="text-[11px] text-slate-400 mt-1">92.4% Pickup rate</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Call Duration</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">1m 34s</p>
          <p className="text-[11px] text-emerald-400 mt-1">High conversion metric</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Sarvam TTS Latency</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">192ms</p>
          <p className="text-[11px] text-emerald-400 mt-1">Realtime duplex speech</p>
        </div>

      </div>

      {/* Quick Action Bar */}
      <div className="p-4 rounded-xl glass-panel border border-white/10">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/agents"
            className="p-3 rounded-xl bg-white/5 hover:bg-brand-600/20 border border-white/5 hover:border-brand-500/40 transition-all flex items-center space-x-2.5 text-xs font-semibold text-slate-200"
          >
            <Bot className="w-4 h-4 text-brand-400 shrink-0" />
            <span>Create New Agent</span>
          </Link>

          <Link
            to="/playground"
            className="p-3 rounded-xl bg-white/5 hover:bg-brand-600/20 border border-white/5 hover:border-brand-500/40 transition-all flex items-center space-x-2.5 text-xs font-semibold text-slate-200"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Voice Playground</span>
          </Link>

          <Link
            to="/campaigns"
            className="p-3 rounded-xl bg-white/5 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/40 transition-all flex items-center space-x-2.5 text-xs font-semibold text-slate-200"
          >
            <Megaphone className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Schedule Campaign</span>
          </Link>

          <Link
            to="/telephony"
            className="p-3 rounded-xl bg-white/5 hover:bg-cyan-600/20 border border-white/5 hover:border-cyan-500/40 transition-all flex items-center space-x-2.5 text-xs font-semibold text-slate-200"
          >
            <PhoneForwarded className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Single Outbound Call</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-5 rounded-2xl glass-card border border-white/10">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Call Dispatches</h3>
            <p className="text-xs text-slate-400">Live call events powered by Sarvam telephony</p>
          </div>
          <Link to="/call-logs" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
            <span>View Live Call Logs</span>
            <span>→</span>
          </Link>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-white/5">
                <th className="py-2.5 font-semibold">Call ID</th>
                <th className="py-2.5 font-semibold">Customer Number</th>
                <th className="py-2.5 font-semibold">Voice Agent</th>
                <th className="py-2.5 font-semibold">Duration</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentCalls.map((call) => (
                <tr key={call.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-mono text-slate-300">{call.id}</td>
                  <td className="py-3 font-semibold text-white">{call.number}</td>
                  <td className="py-3 text-slate-300">{call.agent}</td>
                  <td className="py-3 font-mono text-slate-300">{call.duration}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      call.status === 'Completed' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{call.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
