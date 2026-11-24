import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Receipt
} from 'lucide-react';

export const PlansPage: React.FC = () => {
  const { user, upgradePlan } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0',
      period: 'forever',
      description: 'Ideal for early prototypes and developer testing.',
      calls: '100 Voice Calls',
      features: [
        '100 Free Voice Calls included',
        '1 Voice Agent',
        'Full Indic Speech Playground',
        'Real-time latency diagnostics',
        'Standard Community Support'
      ],
      highlight: false,
      cta: 'Current Plan'
    },
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '₹1,499',
      period: '/ month',
      description: 'Perfect for growing businesses and scheduled outreach.',
      calls: '200 Voice Calls',
      features: [
        '200 Voice Calls per month',
        'Up to 5 Voice Agents',
        'Bulk Campaign CSV Upload & Scheduler',
        '1 Virtual Phone Number included',
        'HubSpot & CRM Webhook sync',
        'Standard Business Hours Support'
      ],
      highlight: true,
      cta: 'Upgrade with Razorpay'
    },
    {
      id: 'premium',
      name: 'Premium Unlimited',
      price: '₹4,999',
      period: '/ month',
      description: 'For high-scale enterprises running continuous automated calling.',
      calls: 'Unlimited Calls',
      features: [
        'Unlimited Outbound & Inbound Calls',
        'Unlimited Voice Agents & Personas',
        'Dedicated SIP Trunking & Numbers',
        'High Concurrency (100 simultaneous calls)',
        'TRAI Compliance Management',
        '24/7 Dedicated Account Manager & SLA'
      ],
      highlight: false,
      cta: 'Go Unlimited'
    }
  ];

  const handleRazorpayCheckout = (planId: 'free' | 'starter' | 'premium', planName: string, amount: string) => {
    if (user?.plan === planId) return;

    setIsProcessing(true);

    // Simulate Razorpay Checkout Modal
    setTimeout(() => {
      upgradePlan(planId);
      setIsProcessing(false);
      setSuccessPlan(planName);
      setTimeout(() => setSuccessPlan(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-wider text-brand-400">Transparent Subscriptions</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Flexible Plans for Every Call Scale</h1>
        <p className="text-xs text-slate-400">
          Integrated with Razorpay. Upgrade or downgrade at any time with immediate quota reload.
        </p>
      </div>

      {/* Success Notification */}
      {successPlan && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Payment successful! Your account has been upgraded to <strong>{successPlan}</strong>.</span>
        </div>
      )}

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = user?.plan === p.id;
          return (
            <div 
              key={p.id}
              className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between transition-all relative ${
                p.highlight 
                  ? 'glass-glow-card border-brand-500/50 shadow-glow' 
                  : 'glass-card border-white/10'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3.5 right-6 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full badge-gradient text-white shadow-md">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{p.description}</p>

                <div className="mt-5 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-slate-400 ml-1.5">{p.period}</span>
                </div>

                <div className="mt-4 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs font-semibold text-brand-300">
                  ⚡ {p.calls}
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5">
                <button
                  type="button"
                  disabled={isCurrent || isProcessing}
                  onClick={() => handleRazorpayCheckout(p.id as any, p.name, p.price)}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                    isCurrent 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default' 
                      : p.highlight 
                      ? 'btn-primary-gradient text-white shadow-glow-sm' 
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isCurrent ? 'Current Plan' : (isProcessing ? 'Processing Razorpay...' : p.cta)}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Razorpay Assurance Card */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Secured by <strong>Razorpay Payment Gateway</strong> with 256-bit SSL encryption. UPI, Cards & NetBanking accepted.</span>
        </div>
        <span className="text-brand-300 font-mono font-semibold self-start sm:self-auto">Instant Plan Activation</span>
      </div>

    </div>
  );
};
