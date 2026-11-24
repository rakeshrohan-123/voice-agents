import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Megaphone, 
  Upload, 
  Calendar, 
  Clock, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Users, 
  TrendingUp,
  Download,
  Filter
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  agent: string;
  language: string;
  totalContacts: number;
  completedCalls: number;
  successfulCalls: number;
  status: 'In Progress' | 'Completed' | 'Scheduled' | 'Draft';
  scheduledTime: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: 'camp_001',
    name: 'Q3 EMI Overdue Collection Drive',
    agent: 'Loan Recovery (Hindi)',
    language: 'Hindi',
    totalContacts: 150,
    completedCalls: 112,
    successfulCalls: 94,
    status: 'In Progress',
    scheduledTime: 'Today, 10:00 AM'
  },
  {
    id: 'camp_002',
    name: 'Festival Festive Sale COD Verification',
    agent: 'COD Order Address Verification (Hinglish)',
    language: 'Hinglish',
    totalContacts: 80,
    completedCalls: 80,
    successfulCalls: 76,
    status: 'Completed',
    scheduledTime: 'Yesterday, 02:30 PM'
  },
  {
    id: 'camp_003',
    name: 'Chennai Villa Pre-launch Outreach',
    agent: 'Tamil Real-Estate Lead Qualifier (Tamil)',
    language: 'Tamil',
    totalContacts: 200,
    completedCalls: 0,
    successfulCalls: 0,
    status: 'Scheduled',
    scheduledTime: 'Tomorrow, 11:00 AM'
  }
];

export const CampaignsPage: React.FC = () => {
  const { user, consumeCall } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [campName, setCampName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Loan Recovery (Hindi)');
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [concurrency, setConcurrency] = useState(15);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const count = 40; // mock contacts from CSV
    if (!consumeCall(count)) {
      alert(`Call quota exceeded! You have ${user?.callsLimit === -1 ? 'unlimited' : (user?.callsLimit || 100) - (user?.callsUsed || 0)} calls remaining.`);
      return;
    }

    const newCamp: Campaign = {
      id: 'camp_' + Date.now(),
      name: campName || 'Untitled Outreach Campaign',
      agent: selectedAgent,
      language: selectedAgent.includes('Hindi') ? 'Hindi' : selectedAgent.includes('Tamil') ? 'Tamil' : 'English',
      totalContacts: count,
      completedCalls: scheduleType === 'now' ? 4 : 0,
      successfulCalls: scheduleType === 'now' ? 3 : 0,
      status: scheduleType === 'now' ? 'In Progress' : 'Scheduled',
      scheduledTime: scheduleType === 'now' ? 'Just Now' : scheduledDateTime || 'Tomorrow, 10:00 AM'
    };

    setCampaigns([newCamp, ...campaigns]);
    setIsModalOpen(false);
  };

  const downloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,PhoneNumber,Language,CustomContext,AmountDue\nRajesh Kumar,+919876543210,Hindi,HDFC Loan Account #1092,4500\nAnanya Sharma,+919445123456,English,Delivery Order #892,1299\nMurugan S,+919884012345,Tamil,OMR Villa Interest,0\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sarvam_contacts_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Megaphone className="w-6 h-6 text-purple-400" />
            <span>Bulk Campaign Manager & Scheduler</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch thousands of automated outbound voice calls simultaneously with smart retries.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={downloadSampleCSV}
            className="px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-slate-300 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download Sample CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary-gradient px-4 py-2 rounded-xl text-xs font-bold text-white shadow-glow-sm flex items-center space-x-2"
          >
            <Megaphone className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaigns Overview List */}
      <div className="space-y-4">
        {campaigns.map((camp) => {
          const progressPercent = Math.round((camp.completedCalls / camp.totalContacts) * 100);
          return (
            <div 
              key={camp.id}
              className="p-5 rounded-2xl glass-card border border-white/10 hover:border-purple-500/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{camp.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      camp.status === 'Completed' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : camp.status === 'In Progress'
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Agent: <strong className="text-slate-300">{camp.agent}</strong> • Scheduled: {camp.scheduledTime}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono">
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px]">Connected / Answered</p>
                    <p className="text-emerald-400 font-bold">{camp.successfulCalls} / {camp.completedCalls}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-[10px]">Total Uploaded</p>
                    <p className="text-white font-bold">{camp.totalContacts}</p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Campaign Dispatch Progress:</span>
                  <span className="font-mono text-white font-semibold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Bulk Campaign */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Schedule Bulk Voice Campaign</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  placeholder="e.g. Diwali Flash Sale Confirmation"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Voice Agent</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
                >
                  <option value="Loan Recovery (Hindi)">Loan Recovery & EMI Collector (Hindi)</option>
                  <option value="COD Order Address Verification (Hinglish)">COD Order Address Verification (Hinglish)</option>
                  <option value="Tamil Real-Estate Lead Qualifier (Tamil)">Tamil Real-Estate Lead Qualifier (Tamil)</option>
                </select>
              </div>

              {/* CSV Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Upload Contacts CSV / Excel</label>
                <div 
                  onClick={() => setUploadedFile('contacts_q4_outreach.csv (40 contacts)')}
                  className="p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-brand-500/50 bg-slate-900/60 text-center cursor-pointer transition-all"
                >
                  <Upload className="w-6 h-6 text-brand-400 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-300 font-semibold">
                    {uploadedFile ? uploadedFile : 'Click to select contacts CSV file'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Supports Name, PhoneNumber, CustomContext columns</p>
                </div>
              </div>

              {/* Schedule Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Schedule</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleType('now')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      scheduleType === 'now' 
                        ? 'bg-brand-600/30 border-brand-500 text-white' 
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    🚀 Start Immediately
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleType('scheduled')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      scheduleType === 'scheduled' 
                        ? 'bg-brand-600/30 border-brand-500 text-white' 
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    ⏰ Schedule Date & Time
                  </button>
                </div>
              </div>

              {scheduleType === 'scheduled' && (
                <div>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gradient px-5 py-2 rounded-xl text-xs font-bold text-white shadow-glow-sm"
                >
                  Launch Campaign
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
