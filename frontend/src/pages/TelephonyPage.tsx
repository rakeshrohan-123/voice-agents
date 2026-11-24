import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  AlertCircle,
  Building,
  Check,
  X,
  Radio,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

import api from '../services/api';

export const TelephonyPage: React.FC = () => {
  const { user, consumeCall } = useAuth();
  const [targetNumber, setTargetNumber] = useState('+917901063698');
  const [selectedAgent, setSelectedAgent] = useState('agent_1');
  
  // Default to user's real Sarvam number!
  const [selectedCallerId, setSelectedCallerId] = useState('+918064264461');
  const [customerName, setCustomerName] = useState('');
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [lastDispatchedId, setLastDispatchedId] = useState<string | null>(null);
  const [isDialing, setIsDialing] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Buy Number Modal Form State
  const [telephonyProvider, setTelephonyProvider] = useState<'sarvam' | 'byot'>('sarvam');
  const [accountType, setAccountType] = useState<'individual' | 'corporate'>('corporate');
  const [selectedPrefix, setSelectedPrefix] = useState('080');

  const [phoneNumbers, setPhoneNumbers] = useState([
    { 
      number: '+918064264461', 
      type: 'Sarvam Native (Vobiz Telecom - Bangalore)', 
      assignedAgent: 'Loan Recovery & EMI Collector (Hindi)', 
      status: 'Active & Verified', 
      provider: 'Sarvam Vobiz',
      inboundCount: 38,
      isPrimary: true
    },
    { 
      number: '+91 80 4728 1190', 
      type: 'Sarvam Native DID (Bangalore)', 
      assignedAgent: 'COD Order Address Verification (Hinglish)', 
      status: 'Active', 
      provider: 'Sarvam Vobiz',
      inboundCount: 142,
      isPrimary: false
    },
    { 
      number: '+91 22 6902 4410', 
      type: 'BYOT Connection (Exotel SIP Trunk - Mumbai)', 
      assignedAgent: 'Tamil Real-Estate Lead Qualifier (Tamil)', 
      status: 'Active', 
      provider: 'Exotel BYOT',
      inboundCount: 88,
      isPrimary: false
    }
  ]);

  const handleDispatchCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNumber) return;

    if (!consumeCall(1)) {
      alert('Plan call quota exceeded! Please upgrade your plan in Plans & Billing.');
      return;
    }

    setIsDialing(true);
    setCallStatus(`Initiating SIP handshake with Sarvam Gateway via ${selectedCallerId}...`);

    try {
      const resp = await api.post('/telephony/outbound-call', {
        to_number: targetNumber,
        from_number: selectedCallerId,
        agent_id: selectedAgent,
        agent_name: selectedAgent === 'agent_1' ? 'Loan Recovery (Hindi)' : 'COD Verification (Hinglish)',
        customer_name: customerName,
        language_code: selectedAgent === 'agent_3' ? 'ta-IN' : 'hi-IN'
      });

      const data = resp.data;
      setIsDialing(false);
      setLastDispatchedId(data.session_id);
      setCallStatus(`✅ Call Dispatched! Phone is ringing at ${data.to_number}. Attempt ID: ${data.session_id}`);

      // Play the agent's live synthesized Sarvam greeting!
      if (data.audio_base64) {
        try {
          const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
          audio.play().catch(e => console.log('Audio autoplay prevented:', e));
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err: any) {
      setIsDialing(false);
      const errMsg = err.response?.data?.detail || err.message;
      setCallStatus(`⚠️ Sarvam Dispatch: ${errMsg}`);
    }
  };

  const handleBuyNumber = (e: React.FormEvent) => {
    e.preventDefault();
    const newNum = `+91 80 64${Math.floor(1000 + Math.random() * 9000)}`;
    setPhoneNumbers([
      ...phoneNumbers,
      {
        number: newNum,
        type: telephonyProvider === 'sarvam' ? 'Sarvam Native DID (Vobiz)' : 'BYOT SIP Connection',
        assignedAgent: 'Loan Recovery & EMI Collector (Hindi)',
        status: 'Active & Verified',
        provider: telephonyProvider === 'sarvam' ? 'Sarvam Vobiz' : 'Custom Provider',
        inboundCount: 0,
        isPrimary: false
      }
    ]);
    setIsBuyModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Telephony & Phone Numbers</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Sarvam Vobiz Connected
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage Indian virtual phone numbers (+91), assign inbound agent routing, and trigger test calls.
          </p>
        </div>

        <button 
          onClick={() => setIsBuyModalOpen(true)}
          className="btn-primary-gradient px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-glow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Rent Number / Add Connection</span>
        </button>
      </div>

      {/* Verified Carrier Banner */}
      <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-bold text-white">Active Number: <span className="font-mono text-emerald-300">+918064264461</span></p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                KYC Approved
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Carrier: <strong>Sarvam Vobiz Telecom</strong> • TRAI Enterprise CLI Registered • Ready for 2-Way Duplex Calls
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Assigned Agent:</span>
          <span className="text-white font-semibold px-2.5 py-1 rounded-lg bg-slate-800 border border-white/5">
            Loan Recovery (Hindi)
          </span>
        </div>
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
              <h3 className="text-sm font-bold text-white">Outbound Test Call Simulator</h3>
              <p className="text-xs text-slate-400">Test how the voice agent converses on a real phone call</p>
            </div>
          </div>

          <form onSubmit={handleDispatchCall} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Mobile Number (+91)</label>
              <input
                type="tel"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-brand-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Enter your own mobile number to test the conversation live</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Caller ID (Your Sarvam Number)</label>
              <select
                value={selectedCallerId}
                onChange={(e) => setSelectedCallerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              >
                {phoneNumbers.map(p => (
                  <option key={p.number} value={p.number}>
                    {p.number} ({p.provider}) {p.number === '+918064264461' ? '★ Verified' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name (Context Injection)</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Voice Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="agent_1">Loan Recovery & EMI Collector (Hindi)</option>
                <option value="agent_2">COD Order Address Verification (Hinglish)</option>
                <option value="agent_3">Tamil Real-Estate Lead Qualifier (Tamil)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isDialing}
              className="w-full btn-primary-gradient py-3.5 rounded-2xl text-xs font-bold text-white shadow-glow flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <PhoneForwarded className="w-4 h-4" />
              <span>{isDialing ? 'Connecting to Telecom Carrier...' : 'Call Mobile Number Now'}</span>
            </button>
          </form>

          {/* Call Status Feedback */}
          {callStatus && (
            <div className={`p-4 rounded-2xl text-xs space-y-2.5 ${
              callStatus.includes('✅') || callStatus.includes('Dispatched')
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                : 'bg-brand-500/10 text-brand-300 border border-brand-500/30'
            }`}>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <p className="leading-relaxed font-medium">{callStatus}</p>
              </div>

              {lastDispatchedId && (
                <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400/80">Monitor live call & recording:</span>
                  <Link
                    to="/call-logs"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 transition-colors"
                  >
                    <span>Open Live Call Logs</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Virtual Numbers Table (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold text-white">Configured Phone Connections</h3>
              <p className="text-xs text-slate-400">Inbound agent routing and caller ID pool</p>
            </div>
            <span className="text-xs font-mono text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-md border border-brand-500/30">
              {phoneNumbers.length} Active Lines
            </span>
          </div>

          <div className="space-y-3">
            {phoneNumbers.map((phone) => (
              <div 
                key={phone.number}
                className={`p-4 rounded-2xl transition-all border ${
                  phone.number === '+918064264461' 
                    ? 'bg-brand-950/30 border-brand-500/40' 
                    : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-bold text-white">{phone.number}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {phone.status}
                    </span>
                    {phone.number === '+918064264461' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full badge-gradient text-white font-bold">
                        Primary Sarvam Number
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{phone.type}</p>
                  <p className="text-xs text-brand-300 mt-1 flex items-center space-x-1">
                    <Bot className="w-3.5 h-3.5 text-brand-400" />
                    <span>Inbound Agent: <strong>{phone.assignedAgent}</strong></span>
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Total Calls:</span>
                  <p className="text-sm font-mono font-bold text-white">{phone.inboundCount}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Inbound Call Instructions Guide */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>How Inbound Testing Works on Sarvam:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>Dial <strong>+918064264461</strong> directly from your physical smartphone.</li>
              <li>The Sarvam telecom gateway handles the SIP trunk connection in &lt;180ms.</li>
              <li>The mapped agent answers with the Hindi greeting and engages in conversational dialogue.</li>
            </ol>
          </div>
        </div>

      </div>

      {/* Modal: Rent / Buy Number (Sarvam Vobiz or BYOT) */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white">Add Telephony Connection</h3>
                <p className="text-xs text-slate-400">Rent a native Sarvam Vobiz number or bring your own carrier</p>
              </div>
              <button onClick={() => setIsBuyModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleBuyNumber} className="space-y-4">
              
              {/* Option Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Connection Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTelephonyProvider('sarvam')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      telephonyProvider === 'sarvam' 
                        ? 'bg-brand-600/30 border-brand-500 text-white shadow-glow-sm' 
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">Rent from Sarvam</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Vobiz carrier • Instant KYC</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTelephonyProvider('byot')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      telephonyProvider === 'byot' 
                        ? 'bg-brand-600/30 border-brand-500 text-white shadow-glow-sm' 
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">Bring Your Own (BYOT)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Exotel, Twilio, Plivo, Smartflo</p>
                  </button>
                </div>
              </div>

              {telephonyProvider === 'sarvam' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Account KYC Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['corporate', 'individual'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAccountType(type as any)}
                          className={`py-2 px-3 rounded-xl border text-xs capitalize ${
                            accountType === type 
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold' 
                              : 'bg-slate-900 border-white/10 text-slate-400'
                          }`}
                        >
                          {type} Verification
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Region & STD Prefix</label>
                    <select
                      value={selectedPrefix}
                      onChange={(e) => setSelectedPrefix(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
                    >
                      <option value="080">Bangalore (080) - +91 80 64XX XXXX</option>
                      <option value="022">Mumbai (022) - +91 22 69XX XXXX</option>
                      <option value="011">Delhi NCR (011) - +91 11 40XX XXXX</option>
                      <option value="1800">Toll-Free India (1800 XXX XXXX)</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">BYOT Provider</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none">
                      <option>Exotel Telephony (India)</option>
                      <option>Tata Smartflo (India)</option>
                      <option>Twilio SIP Trunking</option>
                      <option>Plivo Voice API</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Account SID / API Key</label>
                    <input
                      type="text"
                      placeholder="e.g. exo_acc_9831928"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBuyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gradient px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-sm"
                >
                  {telephonyProvider === 'sarvam' ? 'Purchase & Allocate Number' : 'Connect SIP Provider'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
