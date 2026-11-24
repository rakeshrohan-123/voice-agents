import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  PhoneCall, 
  Sparkles, 
  Megaphone, 
  ShieldCheck, 
  Zap, 
  Play, 
  Pause, 
  Globe2, 
  CheckCircle2, 
  ArrowRight,
  Headphones,
  Users,
  Layers,
  Database
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const voiceDemos = [
    { id: 'hi-1', lang: 'Hindi (हिंदी)', name: 'Aravind (Conversational)', text: 'नमस्ते! मैं आपका लोन ईएमआई सहायता एजेंट बोल रहा हूँ। क्या मैं आपकी मदद कर सकता हूँ?', duration: '3.2s' },
    { id: 'en-in', lang: 'Indian English', name: 'Priya (Corporate)', text: 'Hello! Thank you for choosing our banking services. Your credit card application is approved.', duration: '2.8s' },
    { id: 'ta-1', lang: 'Tamil (தமிழ்)', name: 'Murugan (Friendly)', text: 'வணக்கம்! உங்கள் டெலிவரி இன்று மாலை 5 மணிக்குள் வந்து சேரும்.', duration: '3.5s' },
    { id: 'te-1', lang: 'Telugu (తెలుగు)', name: 'Sneha (Support)', text: 'నమస్కారం! మీ ఆర్డర్ కన్ఫర్మేషన్ కొరకు నేను కాల్ చేశాను.', duration: '3.0s' }
  ];

  const handlePlayVoice = (id: string, text: string) => {
    if (playingVoice === id) {
      window.speechSynthesis.cancel();
      setPlayingVoice(null);
      return;
    }
    window.speechSynthesis.cancel();
    setPlayingVoice(id);

    // Use Web Speech API for instant voice playback preview!
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onend = () => setPlayingVoice(null);
    utterance.onerror = () => setPlayingVoice(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[130px] -z-10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-purple-600/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-card border border-brand-500/30 text-xs font-semibold text-brand-300 mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Powered by Sarvam AI Indic LLM & Ultra-low Latency Speech Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-none">
          Autonomous <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Voice Agents</span> for Every Indian Dialect
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Create, test, and dispatch human-like conversational voice agents in Hindi, Hinglish, Tamil, Telugu, and 8+ regional languages. Complete with telephony, bulk campaigns, CRM integrations, and Razorpay billing.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/playground"
            className="w-full sm:w-auto btn-primary-gradient px-8 py-4 rounded-xl text-base font-bold text-white shadow-glow flex items-center justify-center space-x-2 group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Try Voice Playground</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-200 glass-card hover:bg-white/10 transition-all border border-white/10"
          >
            Start Free (100 Calls)
          </Link>
        </div>

        {/* Live Audio Snippet Bar */}
        <div className="mt-16 max-w-4xl mx-auto p-4 sm:p-6 rounded-2xl glass-card border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-white">Experience Indic Voice Samples</h3>
                <p className="text-xs text-slate-400">Click to listen to native dialect pronunciations</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto font-mono">
              &lt; 220ms Voice Latency
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {voiceDemos.map((voice) => (
              <div 
                key={voice.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 hover:border-brand-500/40 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1 pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-brand-300">{voice.lang}</span>
                    <span className="text-[11px] text-slate-400">({voice.name})</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1 italic">"{voice.text}"</p>
                </div>
                <button
                  onClick={() => handlePlayVoice(voice.id, voice.text)}
                  className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all ${
                    playingVoice === voice.id 
                      ? 'bg-rose-500 text-white shadow-lg animate-pulse' 
                      : 'bg-brand-600 text-white group-hover:scale-105 shadow-glow-sm'
                  }`}
                  title={playingVoice === voice.id ? 'Stop Voice' : 'Play Voice'}
                >
                  {playingVoice === voice.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Architecture Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-brand-400">Full Stack Capabilities</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-white tracking-tight">Everything You Need To Automate Calling</p>
          <p className="mt-3 text-slate-400 text-base">From prompt crafting to instant outbound telephony and scheduled bulk dialing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl glass-glow-card border border-white/10 hover:border-brand-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-5">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Prompt & Voice Studio</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Configure system prompts, conversational persona, speech rate, pause detection, and fallback handling with Sarvam Indic models.
            </p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>11 Indian Regional Languages</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Emotion & Tone Customization</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl glass-glow-card border border-white/10 hover:border-brand-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Bulk Campaign Scheduler</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Upload CSV contact lists, map custom variables, set concurrency rates, and schedule thousands of outbound calls automatically.
            </p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CSV upload with dynamic prompt variables</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Smart Retry on Busy or Unanswered</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl glass-glow-card border border-white/10 hover:border-brand-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Telephony & Numbers</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Connect virtual numbers (+91 India, Toll-Free, or SIP trunk), route inbound calls with custom greetings, or run single test dials.
            </p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Inbound & Outbound Calling</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Realtime Call Audio Recording & Transcripts</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-card border border-white/10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400">High-Impact Industry Use Cases</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Built for India's Fastest Growing Enterprises</h2>
              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                    <span>BFSI & Loan EMI Collection</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">Polite, persuasive reminder calls in customer's mother tongue with instant payment link SMS dispatch.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>E-Commerce COD Order Confirmation</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">Verify address & intent before shipping to reduce RTO (Return to Origin) losses by 45%.</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Healthcare Appointment Scheduling & Follow-up</span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">Automated patient follow-up calls in Tamil, Telugu, Hindi, or Bengali with doctor calendar sync.</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-brand-500/20 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-slate-400">
                <span className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Sarvam Telephony Call Session #8942</span>
                </span>
                <span>Active 01:24</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="p-2.5 rounded-lg bg-brand-600/20 text-brand-200 border border-brand-500/30">
                  <p className="text-[10px] text-brand-300 font-bold uppercase">AI Agent (Aravind - Hindi):</p>
                  <p className="mt-0.5 text-xs text-white">"नमस्ते राजेश जी, मैं आपके कार सर्विसिंग अप्वाइंटमेंट के बारे में कॉल कर रहा हूँ।"</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300 border border-white/5 ml-4">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Customer (+91 98765 43210):</p>
                  <p className="mt-0.5 text-xs text-white">"हाँ, क्या कल सुबह 10 बजे का स्लॉट मिल सकता है?"</p>
                </div>
                <div className="p-2.5 rounded-lg bg-brand-600/20 text-brand-200 border border-brand-500/30">
                  <p className="text-[10px] text-brand-300 font-bold uppercase">AI Agent (Aravind - Hindi):</p>
                  <p className="mt-0.5 text-xs text-white">"बिल्कुल! कल सुबह 10:00 बजे का स्लॉट बुक कर दिया गया है। पुष्टि एसएमएस भेज दिया गया है।"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white">Simple, Transparent Pricing</h2>
        <p className="mt-2 text-slate-400 text-sm">Powered by Razorpay instant checkout with zero hidden fees.</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          
          {/* Free Plan */}
          <div className="p-6 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Free Plan</h3>
              <p className="text-xs text-slate-400 mt-1">Perfect for testing & prototypes</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-slate-400 ml-1">/ forever</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span><strong>100 Free Calls</strong> included</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Test voice playground</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>1 Voice Agent</span></li>
              </ul>
            </div>
            <Link to="/signup" className="mt-8 block text-center py-2.5 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 font-semibold text-xs">
              Get Started Free
            </Link>
          </div>

          {/* Starter Plan */}
          <div className="p-6 rounded-2xl glass-glow-card border-brand-500/50 flex flex-col justify-between relative shadow-glow">
            <span className="absolute -top-3 right-6 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full badge-gradient text-white">
              Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Starter Plan</h3>
              <p className="text-xs text-slate-400 mt-1">For growing startups & SMBs</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-white">₹1,499</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span><strong>200 Voice Calls</strong> per month</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Bulk Campaign CSV upload</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Up to 5 Voice Agents</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>CRM Webhooks & Tools</span></li>
              </ul>
            </div>
            <Link to="/plans" className="mt-8 block text-center py-2.5 rounded-xl btn-primary-gradient text-white font-semibold text-xs shadow-glow-sm">
              Upgrade to Starter
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="p-6 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise Unlimited</h3>
              <p className="text-xs text-slate-400 mt-1">High volume automated dialing</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-white">₹4,999</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span><strong>Unlimited Voice Calls</strong></span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Unlimited Voice Agents</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Dedicated SIP Trunking & Numbers</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>24/7 Dedicated SLA Support</span></li>
              </ul>
            </div>
            <Link to="/plans" className="mt-8 block text-center py-2.5 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 font-semibold text-xs">
              Go Unlimited
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
