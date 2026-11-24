import React, { useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  Globe, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  FileText, 
  Link as LinkIcon, 
  Layers, 
  Webhook, 
  Check
} from 'lucide-react';

interface KnowledgeDoc {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'Indexed' | 'Processing';
  chunks: number;
}

export const KnowledgeBasePage: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([
    { id: 'doc_1', name: 'Credit_Card_EMI_FAQs_2024.pdf', size: '1.4 MB', type: 'PDF', status: 'Indexed', chunks: 48 },
    { id: 'doc_2', name: 'Product_Catalog_Return_Policy.docx', size: '540 KB', type: 'DOCX', status: 'Indexed', chunks: 22 },
  ]);

  const [crawlUrl, setCrawlUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourcompany.com/voice-events');
  const [hubspotEnabled, setHubspotEnabled] = useState(true);
  const [salesforceEnabled, setSalesforceEnabled] = useState(false);
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
          name: crawlUrl.replace('https://', '').replace('http://', '') + ' (Web Crawl)',
          size: '320 KB',
          type: 'Web',
          status: 'Indexed',
          chunks: 14
        },
        ...docs
      ]);
      setCrawlUrl('');
    }, 1500);
  };

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-brand-400" />
          <span>Knowledge Base & Tool Integrations</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Ground your voice agents with real company policies, live database lookups, and CRM sync.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Document Knowledge & Crawler (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Docs upload card */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-bold text-white">Indexed Grounding Documents</h3>
              </div>
              <button 
                onClick={() => {
                  setDocs([
                    { id: 'doc_' + Date.now(), name: 'Company_Policy_Update.pdf', size: '890 KB', type: 'PDF', status: 'Indexed', chunks: 31 },
                    ...docs
                  ]);
                }}
                className="px-3 py-1.5 rounded-lg bg-brand-600/30 text-brand-300 border border-brand-500/40 text-xs font-semibold hover:bg-brand-600/40"
              >
                + Upload Document
              </button>
            </div>

            <div className="space-y-2.5">
              {docs.map((doc) => (
                <div 
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-[10px] text-slate-300">
                      {doc.type}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">{doc.size} • {doc.chunks} semantic chunks</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Web Crawler */}
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Live Website URL Crawler</h3>
            </div>
            <p className="text-xs text-slate-400">
              Crawl your public FAQ or help center pages to automatically keep voice agents updated.
            </p>
            <form onSubmit={handleCrawl} className="flex items-center space-x-2 pt-1">
              <input
                type="url"
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
                placeholder="https://help.mycompany.in/faq"
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                disabled={isCrawling || !crawlUrl}
                className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-glow-sm disabled:opacity-50"
              >
                {isCrawling ? 'Crawling...' : 'Index Site'}
              </button>
            </form>
          </div>

        </div>

        {/* Right: CRM & Webhook Integrations (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-white/10 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/5">
            <Webhook className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">CRM & Webhook Connectors</h3>
          </div>

          {/* HubSpot Toggle */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">HubSpot CRM Integration</p>
              <p className="text-[10px] text-slate-400">Auto-create deals and update call notes</p>
            </div>
            <button
              type="button"
              onClick={() => setHubspotEnabled(!hubspotEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                hubspotEnabled ? 'bg-brand-600' : 'bg-slate-700'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                hubspotEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Salesforce Toggle */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Salesforce Service Cloud</p>
              <p className="text-[10px] text-slate-400">Sync contact history & case tickets</p>
            </div>
            <button
              type="button"
              onClick={() => setSalesforceEnabled(!salesforceEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                salesforceEnabled ? 'bg-brand-600' : 'bg-slate-700'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                salesforceEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Custom Webhook URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Custom Event Webhook URL</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-brand-500"
            />
            <p className="text-[10px] text-slate-500">Receives real-time call.completed and call.transcript payloads</p>
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full btn-primary-gradient py-2.5 rounded-xl text-xs font-bold text-white shadow-glow-sm flex items-center justify-center space-x-1"
          >
            {savedSettings ? <Check className="w-4 h-4 text-emerald-300" /> : null}
            <span>{savedSettings ? 'Saved Successfully!' : 'Save Integration Settings'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
