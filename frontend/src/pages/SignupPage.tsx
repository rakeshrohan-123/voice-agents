import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, Mail, Lock, User, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'starter' | 'premium'>('free');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    signup(name, email, company || `${name}'s Org`, selectedPlan);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center mx-auto shadow-glow mb-4">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create your Voice Agent Account</h2>
          <p className="text-xs text-slate-400 mt-1">Get 100 free multilingual telephony test calls right away</p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rohan Sharma"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-brand-500 focus:outline-none text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company / Startup</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Fintech Innovations"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-brand-500 focus:outline-none text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-brand-500 focus:outline-none text-sm text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Plan selection cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Starting Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'free', name: 'Free (100 calls)', price: '₹0' },
                  { id: 'starter', name: 'Starter (200)', price: '₹1,499' },
                  { id: 'premium', name: 'Unlimited', price: '₹4,999' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedPlan(tier.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPlan === tier.id 
                        ? 'bg-brand-600/30 border-brand-500 text-white shadow-glow-sm' 
                        : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-slate-200">{tier.name}</p>
                    <p className="text-xs text-brand-300 font-extrabold mt-0.5">{tier.price}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 btn-primary-gradient py-3 rounded-xl text-sm font-bold text-white shadow-glow-sm flex items-center justify-center space-x-2"
            >
              <span>Create Account & Start</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
