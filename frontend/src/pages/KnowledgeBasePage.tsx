import React, { useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  Globe, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  FileText, 
  Layers, 
  Webhook, 
  Check,
  Search,
  SlidersHorizontal,
  Code2,
  Sparkles,
  Info
} from 'lucide-react';

interface KnowledgeDoc {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'Indexed & Ready' | 'Processing Chunks';
  chunks: number;
  tokens: string;
}

interface CustomTool {
  id: string;
  name: string;
  description: string;
  method: 'POST' | 'GET';
  endpoint: string;
  enabled: boolean;
}

export const KnowledgeBasePage: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([
    { id: 'doc_1', name: 'Credit_Card_EMI_FAQs_2024.pdf', size: '1.4 MB', type: 'PDF', status: 'Indexed & Ready', chunks: 48, tokens: '24.2k' },
    { id: 'doc_2', name: 'Product_Catalog_Return_Policy.docx', size: '540 KB', type: 'DOCX', status: 'Indexed & Ready', chunks: 22, tokens: '11.0k' },
    { id: 'doc_3', name: 'Real_Estate_Brochure_OMR.txt', size: '120 KB', type: 'TXT', status: 'Indexed & Ready', chunks: 14, tokens: '7.1k' },
  ]);

  const [searchMode, setSearchMode] = useState<'hybrid' | 'vector' | 'text'>('hybrid');
  const [rerankingEnabled, setRerankingEnabled] = useState(true);
  const [kbDescription, setKbDescription] = useState(
    'Contains comprehensive policy details for banking EMI schemes, overdue fee waivers, grace periods, and payment links. Search this whenever the customer asks policy or calculation questions.'
  );

  const [customTools, setCustomTools] = useState<CustomTool[]>([
    {
      id: 'tool_1',
      name: 'send_payment_link_sms',
      description: 'Dispatches an instant UPI/Razorpay payment link to the customer via SMS during the call.',
      method: 'POST',
      endpoint: 'https://api.yourcompany.com/v1/sms/payment-link',
      enabled: true
    },
    {
      id: 'tool_2',
      name: 'book_doctor_appointment',
      description: 'Books a clinic appointment slot in Google Calendar / CRM after checking doctor availability.',
      method: 'POST',
      endpoint: 'https://api.yourcompany.com/v1/appointments/book',
      enabled: true
    },
    {
      id: 'tool_3',
      name: 'update_hubspot_lead_status',
      description: 'Updates lead qualification status in HubSpot CRM based on customer responses.',
      method: 'POST',
      endpoint: 'https://api.yourcompany.com/v1/crm/hubspot/lead',
      enabled: true
    }
  ]);

  const [crawlUrl, setCrawlUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  const handleCrawl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlUrl) return;
    setIsCrawling(true);
    setTimeout(() => {
      setIsCrawling(false);
      setDocs([
        {
          id: 'doc_' + Date.now(),
          name: crawlUrl.replace('https://', '').replace('http://', '') + ' (Web Ingestion)',
          size: '340 KB',
          type: 'Web MD',
          status: 'Indexed & Ready',
          chunks: 18,
          tokens: '9.2k'
        },
        ...docs
      ]);
      setCrawlUrl('');
    }, 1500);
  };

  const toggleTool = (id: string) => {
    setCustomTools(customTools.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const handleSaveConfig = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Knowledge Base & Tools Studio</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40">
              Sarvam Indic RAG
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Equip voice agents with ground-truth facts from documents and enable real-time function calling during live calls.
          </p>
        </div>

        <button 
          onClick={handleSaveConfig}
          className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-glow-sm flex items-center space-x-1.5 self-start sm:self-auto"
        >
          {savedSettings ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
          <span>{savedSettings ? 'Config Saved!' : 'Save & Publish to Agents'}</span>
        </button>
      </div>

      {/* Sarvam Architecture Notice */}
      <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/20 text-xs text-slate-300 flex items-start space-x-3">
        <Info className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">How Knowledge Base & Tools Work on Sarvam AI:</p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            When you attach a Knowledge Base to an agent, Sarvam automatically attaches an internal <strong>KB Query Tool</strong>. 
            The agent autonomously reads your KB description to decide when to retrieve factual chunks (~500 tokens) using hybrid search with reranking. 
            Custom API tools allow the agent to execute actions (like dispatching payment SMS or booking appointments) mid-conversation without dropping voice latency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Knowledge Base Ingestion & Tuning (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Document Ingestion Card */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Ingested Knowledge Documents</h3>
              </div>
              <button 
                onClick={() => {
                  setDocs([
                    { id: 'doc_' + Date.now(), name: 'Uploaded_FAQ_Doc.pdf', size: '920 KB', type: 'PDF', status: 'Indexed & Ready', chunks: 26, tokens: '13.1k' },
                    ...docs
                  ]);
                }}
                className="px-3 py-1.5 rounded-lg bg-brand-600/30 text-brand-300 border border-brand-500/40 text-xs font-semibold hover:bg-brand-600/40 transition-all"
              >
                + Add PDF / DOCX / CSV
              </button>
            </div>

            <div className="space-y-2.5">
              {docs.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between hover:border-brand-500/30 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[10px] text-slate-300">
                      {doc.type}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">{doc.size} • {doc.chunks} semantic chunks ({doc.tokens} tokens)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Ingestion format guide */}
            <p className="text-[10px] text-slate-500 pt-1">
              Supports: PDF, DOCX, CSV, TSV, TXT, MD. Ingested asynchronously and optimized for Sarvam Indic LLM reasoning.
            </p>
          </div>

          {/* Retrieval Engine Tuning */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Retrieval Engine Tuning</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                KB Tool Autonomous Trigger Description
              </label>
              <textarea
                rows={3}
                value={kbDescription}
                onChange={(e) => setKbDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                The agent inspects this description to autonomously determine when to query this knowledge base during speech.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Search Retrieval Mode</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['hybrid', 'vector', 'text'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSearchMode(mode)}
                      className={`py-1.5 rounded-lg border text-xs capitalize ${
                        searchMode === mode 
                          ? 'bg-brand-600/30 border-brand-500 text-white font-bold' 
                          : 'bg-slate-900 border-white/5 text-slate-400'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Reranking</label>
                <button
                  type="button"
                  onClick={() => setRerankingEnabled(!rerankingEnabled)}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between ${
                    rerankingEnabled 
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                      : 'bg-slate-900 border-white/5 text-slate-400'
                  }`}
                >
                  <span>Re-rank Top Chunks</span>
                  <span>{rerankingEnabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Web Crawler */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Live Website URL Ingestion</h3>
            </div>
            <form onSubmit={handleCrawl} className="flex items-center space-x-2 pt-1">
              <input
                type="url"
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
                placeholder="https://yourcompany.com/faq"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={isCrawling || !crawlUrl}
                className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-glow-sm disabled:opacity-50"
              >
                {isCrawling ? 'Ingesting...' : 'Ingest Webpage'}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Custom API Tools / Function Calling (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Dynamic Function Tools</h3>
              </div>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                Function Calling
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Tools allow the agent to execute real-time backend actions (e.g. dispatch SMS or update CRM) during the phone call.
            </p>

            <div className="space-y-3">
              {customTools.map((tool) => (
                <div 
                  key={tool.id}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-white">{tool.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                        {tool.method}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                        tool.enabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        tool.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {tool.description}
                  </p>

                  <p className="text-[10px] font-mono text-slate-500 truncate pt-1 border-t border-white/5">
                    {tool.endpoint}
                  </p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                const name = prompt('Enter function tool name (e.g. check_order_status):');
                if (name) {
                  setCustomTools([
                    ...customTools,
                    {
                      id: 'tool_' + Date.now(),
                      name,
                      description: 'Queries ERP system for live status of customer order.',
                      method: 'POST',
                      endpoint: 'https://api.yourcompany.com/v1/orders/lookup',
                      enabled: true
                    }
                  ]);
                }
              }}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-slate-300 font-semibold transition-all flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Register New Function Tool</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
