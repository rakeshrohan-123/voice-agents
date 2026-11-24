import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Plus, 
  Sparkles, 
  PhoneCall, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Sliders, 
  Volume2, 
  Globe2, 
  Languages,
  BookOpen,
  X
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  language: string;
  voice: string;
  gender: string;
  prompt: string;
  greeting: string;
  speed: number;
  temperature: number;
  totalCalls: number;
  status: 'active' | 'draft';
}

const initialAgents: Agent[] = [
  {
    id: 'agent_1',
    name: 'Loan Recovery & EMI Collector',
    language: 'Hindi (हिंदी)',
    voice: 'Aravind (Conversational)',
    gender: 'Male',
    prompt: 'You are an empathetic yet firm banking executive recovering pending credit card or personal loan EMI. Confirm identity first, inform about overdue amount, and provide UPI payment link options.',
    greeting: 'नमस्ते! मैं एचडीएफसी बैंक रिकवरी टीम से बात कर रहा हूँ। क्या मेरी बात श्री राजेश जी से हो रही है?',
    speed: 1.0,
    temperature: 0.3,
    totalCalls: 124,
    status: 'active'
  },
  {
    id: 'agent_2',
    name: 'COD Order Address Verification',
    language: 'Hinglish (Hindi + Eng)',
    voice: 'Priya (Professional)',
    gender: 'Female',
    prompt: 'Verify customer Cash-on-Delivery order details. Confirm delivery address, landmark, and availability between 2 PM to 6 PM. If cancelled, ask politely for the reason.',
    greeting: 'Hello! Main Myntra logistics team se bol rahi hoon. Aapka order address confirm karne ke liye call kiya hai.',
    speed: 1.05,
    temperature: 0.4,
    totalCalls: 89,
    status: 'active'
  },
  {
    id: 'agent_3',
    name: 'Tamil Real-Estate Lead Qualifier',
    language: 'Tamil (தமிழ்)',
    voice: 'Murugan (Friendly)',
    gender: 'Male',
    prompt: 'Qualify prospective buyers for luxury 2BHK and 3BHK flats in OMR Chennai. Inquire about their budget (60L - 1.5Cr) and preferred possession date.',
    greeting: 'வணக்கம்! சென்னை OMR புதிய வில்லா புராஜெக்ட் பற்றி விசாரிக்க ஆசைப்பட்டீர்களா?',
    speed: 1.0,
    temperature: 0.5,
    totalCalls: 45,
    status: 'active'
  }
];

export const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('Hindi (हिंदी)');
  const [voice, setVoice] = useState('Aravind (Conversational)');
  const [prompt, setPrompt] = useState('');
  const [greeting, setGreeting] = useState('');
  const [speed, setSpeed] = useState(1.0);
  const [temperature, setTemperature] = useState(0.4);

  const openCreateModal = () => {
    setEditingAgent(null);
    setName('');
    setLanguage('Hindi (हिंदी)');
    setVoice('Aravind (Conversational)');
    setPrompt('You are a polite AI voice assistant representing our enterprise. Speak naturally and assist customers.');
    setGreeting('नमस्ते! मैं आपकी किस प्रकार सहायता कर सकता हूँ?');
    setSpeed(1.0);
    setTemperature(0.4);
    setIsModalOpen(true);
  };

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setName(agent.name);
    setLanguage(agent.language);
    setVoice(agent.voice);
    setPrompt(agent.prompt);
    setGreeting(agent.greeting);
    setSpeed(agent.speed);
    setTemperature(agent.temperature);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgent) {
      setAgents(agents.map(a => a.id === editingAgent.id ? {
        ...a,
        name,
        language,
        voice,
        prompt,
        greeting,
        speed,
        temperature
      } : a));
    } else {
      const newAgent: Agent = {
        id: 'agent_' + Date.now(),
        name,
        language,
        voice,
        gender: voice.includes('Priya') || voice.includes('Sneha') ? 'Female' : 'Male',
        prompt,
        greeting,
        speed,
        temperature,
        totalCalls: 0,
        status: 'active'
      };
      setAgents([newAgent, ...agents]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  const handleDuplicate = (agent: Agent) => {
    const copy: Agent = {
      ...agent,
      id: 'agent_' + Date.now(),
      name: `${agent.name} (Copy)`,
      totalCalls: 0
    };
    setAgents([copy, ...agents]);
  };

  const languagesList = [
    'Hindi (हिंदी)',
    'Hinglish (Hindi + Eng)',
    'Indian English',
    'Tamil (தமிழ்)',
    'Telugu (తెలుగు)',
    'Kannada (ಕನ್ನಡ)',
    'Bengali (বাংলা)',
    'Gujarati (ગુજરાતી)',
    'Marathi (मराठी)',
    'Malayalam (മലയാളം)'
  ];

  const voicesList = [
    'Aravind (Conversational Male)',
    'Priya (Warm Executive Female)',
    'Amartya (Authoritative Male)',
    'Sneha (Friendly Support Female)',
    'Murugan (Deep Native Male)',
    'Rishi (Energetic Youth Male)'
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Bot className="w-6 h-6 text-brand-400" />
            <span>Voice Agents Studio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build and calibrate autonomous voice personalities powered by Sarvam Indic foundation models.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn-primary-gradient px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-glow-sm flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Voice Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className="rounded-2xl glass-card border border-white/10 hover:border-brand-500/40 transition-all flex flex-col justify-between p-5 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {agent.language}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{agent.status}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-3 group-hover:text-brand-300 transition-colors">
                {agent.name}
              </h3>

              <div className="mt-2 flex items-center space-x-2 text-xs text-slate-400">
                <Volume2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Voice: <strong>{agent.voice}</strong></span>
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Opening Greeting:</p>
                <p className="text-xs text-slate-300 line-clamp-2 italic mt-0.5">"{agent.greeting}"</p>
              </div>

              <p className="mt-3 text-xs text-slate-400 line-clamp-2">
                {agent.prompt}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {agent.totalCalls} calls logged
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => navigate('/playground')}
                  className="p-1.5 rounded-lg text-brand-400 hover:text-white hover:bg-brand-500/20 transition-all"
                  title="Test in Playground"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(agent)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Edit Agent"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(agent)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Duplicate Agent"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  title="Delete Agent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingAgent ? 'Edit Voice Agent' : 'Create New Voice Agent'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure prompt persona and Sarvam Indic acoustics</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Agent Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Inbound Support Assistant"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-brand-500 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Indic Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-brand-500 text-sm text-white focus:outline-none"
                  >
                    {languagesList.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sarvam Bulbul Voice</label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-brand-500 text-sm text-white focus:outline-none"
                  >
                    {voicesList.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Greeting Message</label>
                <input
                  type="text"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder="Spoken immediately when call connects"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:border-brand-500 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">System Prompt & Persona Guidelines</label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Detailed instructions for the voice agent..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-brand-500 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              {/* Sliders for Speech Speed and Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Speech Speed</span>
                    <span className="font-mono text-brand-300">{speed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.3"
                    step="0.05"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Temperature (Creativity)</span>
                    <span className="font-mono text-brand-300">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gradient px-6 py-2 rounded-xl text-xs font-bold text-white shadow-glow-sm"
                >
                  {editingAgent ? 'Save Changes' : 'Create Agent'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
