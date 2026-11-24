import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  PhoneCall, 
  PhoneForwarded, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sliders, 
  Bot, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const TelephonyPage: React.FC = () => {
  const { user, consumeCall } = useAuth();
  const [targetNumber, setTargetNumber] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('agent_1');
  const [selectedCallerId, setSelectedCallerId] = useState('+91 80 4728 1190');
  const [customerName, setCustomerName] = useState('');
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [isDialing, setIsDialing] = useState(false);

  const phoneNumbers = [
    { number: '+91 80 4728 1190', type: 'Virtual DID (Bangalore)', assignedAgent: 'Loan Recovery (Hindi)', status: 'Active', inboundCount: 142 },
    { number: '+91 22 6902 4410', type: 'Virtual DID (Mumbai)', assignedAgent: 'COD Order Verification (Hinglish)', status: 'Active', inboundCount: 88 },
    { number: '1800 209 8812', type: 'Toll-Free (India)', assignedAgent: 'Tamil Real-Estate Bot', status: 'Active', inboundCount: 310 }
  ];

  const handleDispatchCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNumber) return;

    if (!consumeCall(1)) {
      alert('Plan call quota exceeded! Please upgrade your plan in Plans & Billing.');
      return;
    }

    setIsDialing(true);
    setCallStatus('Connecting to Sarvam Telephony Gateway...');

    setTimeout(() => {
      setCallStatus(`Dialing ${targetNumber} via ${selectedCallerId}...`);
    }, 1200);

    setTimeout(() => {
      setIsDialing(false);
      setCallStatus(`Call successfully dispatched to ${targetNumber}! Agent is conversing.`);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <PhoneCall className="w-6 h-6 text-brand-400" />
            <span>Telephony & Virtual Numbers</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connect SIP trunks, manage Indian virtual phone numbers, and dispatch outbound phone calls.
          </p>
        </div>

        <button 
          onClick={() => alert('New virtual number allocation is instant on Starter/Premium plans.')}
          className="btn-primary-gradient px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-glow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Acquire New Virtual Number</span>
        </button>
      </div>

      {/* Main Grid: Outbound Dialer + Phone Numbers Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Outbound Single Test Call Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-white/10 space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PhoneForwarded className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Single Outbound Call Test</h3>
              <p className="text-xs text-slate-400">Dispatch live voice call to any mobile number</p>
            </div>
          </div>

          <form onSubmit={handleDispatchCall} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Phone Number (+91)</label>
              <input
                type="tel"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Lead Name (Optional)</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Voice Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="agent_1">Loan Recovery & EMI Collector (Hindi)</option>
                <option value="agent_2">COD Order Address Verification (Hinglish)</option>
                <option value="agent_3">Tamil Real-Estate Lead Qualifier (Tamil)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Caller ID (Virtual Number)</label>
              <select
                value={selectedCallerId}
                onChange={(e) => setSelectedCallerId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {phoneNumbers.map(p => (
                  <option key={p.number} value={p.number}>{p.number} ({p.type})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isDialing}
              className="w-full btn-primary-gradient py-3.5 rounded-2xl text-xs font-bold text-white shadow-glow flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <PhoneForwarded className="w-4 h-4" />
              <span>{isDialing ? 'Connecting Gateway...' : 'Dispatch Live Call Now'}</span>
            </button>
          </form>

          {/* Call Status Feedback */}
          {callStatus && (
            <div className={`p-3.5 rounded-xl text-xs flex items-start space-x-2.5 ${
              callStatus.includes('successfully') 
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                : 'bg-brand-500/10 text-brand-300 border border-brand-500/30'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{callStatus}</p>
            </div>
          )}
        </div>

        {/* Virtual Numbers Table (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold text-white">Assigned Phone Numbers</h3>
              <p className="text-xs text-slate-400">Inbound routing & outbound caller ID configuration</p>
            </div>
            <span className="text-xs font-mono text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-md border border-brand-500/30">
              3 Active Numbers
            </span>
          </div>

          <div className="space-y-3">
            {phoneNumbers.map((phone) => (
              <div 
                key={phone.number}
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-brand-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-bold text-white">{phone.number}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {phone.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{phone.type}</p>
                  <p className="text-xs text-brand-300 mt-1 flex items-center space-x-1">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Routing to: <strong>{phone.assignedAgent}</strong></span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400">Total Inbound Calls:</span>
                  <p className="text-sm font-mono font-bold text-white">{phone.inboundCount}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Telephony Tip Alert */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-purple-300">💡 Telecom Regulations Notice (TRAI Compliance):</p>
            <p className="text-slate-400">All outbound calls comply with DND registries and automated TRAI CLI header standards.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
