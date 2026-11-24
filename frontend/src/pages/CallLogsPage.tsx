import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Phone, PhoneOff, PhoneMissed, PhoneIncoming, PhoneCall,
  Activity, Clock, FileText, Download, Copy, Check,
  RefreshCw, ChevronDown, ChevronUp, Play, Pause,
  CheckCircle, XCircle, AlertCircle, Loader2,
  Sparkles, Volume2, Search, ArrowUpRight, ShieldCheck,
  Languages, User, Building2, Zap, Gauge
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TranscriptTurn {
  role: 'agent' | 'user';
  text: string;
  timestamp?: string;
}

interface CallLog {
  interaction_id: string;
  status: 'completed' | 'in_progress' | 'ringing' | 'failed' | 'no_answer' | 'busy' | 'unknown';
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  to_number?: string;
  from_number?: string;
  agent_name?: string;
  language?: string;
  original_transcript?: TranscriptTurn[];
  translate_transcript?: TranscriptTurn[];
  call_summary?: string;
  call_disposition?: string;
  ended_by?: string;
  failure_reason?: string;
  num_messages?: number;
  channel_direction?: string;
  job_id?: string;
  audio_proxy_url?: string;
  avg_agent_latency?: number;
  avg_user_latency?: number;
  user_name?: string;
  service_provider?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  completed:   { label: 'Completed',   color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  ringing:     { label: 'Ringing',     color: 'text-amber-400  bg-amber-500/15  border-amber-500/30',  icon: <Phone className="w-3.5 h-3.5 animate-pulse" /> },
  in_progress: { label: 'Live Active', color: 'text-cyan-400   bg-cyan-500/15   border-cyan-500/30',   icon: <Activity className="w-3.5 h-3.5 animate-pulse" /> },
  failed:      { label: 'Failed',      color: 'text-rose-400   bg-rose-500/15   border-rose-500/30',   icon: <XCircle className="w-3.5 h-3.5" /> },
  no_answer:   { label: 'No Answer',   color: 'text-slate-400  bg-slate-500/15  border-slate-500/30',  icon: <PhoneMissed className="w-3.5 h-3.5" /> },
  busy:        { label: 'Line Busy',   color: 'text-orange-400 bg-orange-500/15 border-orange-500/30', icon: <PhoneIncoming className="w-3.5 h-3.5" /> },
  unknown:     { label: 'Unknown',     color: 'text-slate-400  bg-slate-700/40  border-slate-600/30',  icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

const fmtDuration = (secs?: number) => {
  if (secs === undefined || secs === null) return '--:--';
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

const fmtTime = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  } catch { return iso; }
};

const fmtDate = (iso?: string) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return iso; }
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.unknown;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ─── Audio Player Component ──────────────────────────────────────────────────

const AudioPlayerBar: React.FC<{ audioUrl: string; duration?: number }> = ({ audioUrl, duration: defaultDuration }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(defaultDuration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loadError, setLoadError] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play error:', err);
        setLoadError(true);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const cycleRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  return (
    <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/20 flex flex-col sm:flex-row items-center gap-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && audioRef.current.duration && setDuration(audioRef.current.duration)}
        onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
        onError={() => setLoadError(true)}
      />

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20 transition-all"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        {/* Animated wave bars while playing */}
        <div className="flex items-center gap-0.5 h-6 px-1">
          {[12, 20, 16, 24, 14, 22, 10].map((h, i) => (
            <span
              key={i}
              className={`w-0.5 rounded-full transition-all duration-200 ${isPlaying ? 'bg-purple-400' : 'bg-slate-600'}`}
              style={{
                height: isPlaying ? `${Math.max(6, (h * (i % 2 === 0 ? 1 : 0.6)))}px` : '4px',
                animation: isPlaying ? `pulse 0.8s infinite ${i * 0.1}s` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrubber & Time */}
      <div className="flex-1 w-full flex items-center gap-2">
        <span className="text-[10px] font-mono text-slate-400 w-9 text-right">{fmtDuration(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <span className="text-[10px] font-mono text-slate-500 w-9">{fmtDuration(duration)}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={cycleRate}
          className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] font-mono font-bold text-purple-300 border border-white/5 transition-colors"
          title="Playback speed"
        >
          {playbackRate}x
        </button>

        <a
          href={audioUrl}
          download="call_recording.wav"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Download recording (.wav)"
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>

      {loadError && (
        <span className="text-[10px] text-rose-400">Audio load error</span>
      )}
    </div>
  );
};

// ─── Call Card Component ─────────────────────────────────────────────────────

const CallCard: React.FC<{ log: CallLog; isLive?: boolean }> = ({ log, isLive }) => {
  const [expanded, setExpanded] = useState(false);
  const [transcriptTab, setTranscriptTab] = useState<'original' | 'translated'>('original');
  const [copied, setCopied] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const turnsToDisplay = (transcriptTab === 'translated' && log.translate_transcript?.length)
    ? log.translate_transcript
    : (log.original_transcript || []);

  const copyTranscriptText = () => {
    if (!turnsToDisplay.length) return;
    const txt = turnsToDisplay.map(t => `${t.role.toUpperCase()}: ${t.text}`).join('\n');
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasTranscripts = (log.original_transcript && log.original_transcript.length > 0) ||
                         (log.translate_transcript && log.translate_transcript.length > 0);

  return (
    <div className={`rounded-2xl border transition-all duration-300 ${
      isLive
        ? 'border-cyan-500/50 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-brand-950/30 shadow-lg shadow-cyan-500/10'
        : 'border-white/8 bg-slate-900/60 hover:border-white/15'
    }`}>
      {/* Card Header */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Call Icon + Details */}
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            log.status === 'completed'   ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' :
            log.status === 'in_progress' ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 animate-pulse' :
            log.status === 'ringing'     ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400' :
            log.status === 'failed'      ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400' :
            'bg-slate-800 text-slate-400 border border-slate-700/50'
          }`}>
            {log.status === 'in_progress' ? <Activity className="w-5 h-5 animate-pulse" /> :
             log.status === 'completed'   ? <PhoneOff className="w-5 h-5" /> :
             log.status === 'ringing'     ? <PhoneCall className="w-5 h-5 animate-bounce" /> :
             <PhoneMissed className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-white tracking-tight">{log.to_number || 'Unknown Recipient'}</span>
              
              {log.user_name && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  <User className="w-3 h-3 text-brand-400" /> {log.user_name}
                </span>
              )}

              {isLive && (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-cyan-300 bg-cyan-500/15 border border-cyan-500/40 px-2.5 py-0.5 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"></span> LIVE
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-brand-300 font-medium">
                <Building2 className="w-3.5 h-3.5" />
                {log.agent_name || 'AI Voice Agent'}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                {log.language || 'Hindi'}
              </span>
              <span>·</span>
              <span className="text-[11px] font-mono text-slate-400">
                {fmtDate(log.start_time)} &nbsp;{fmtTime(log.start_time)}
                {log.end_time && ` → ${fmtTime(log.end_time)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Status Badge, Duration, Actions */}
        <div className="flex items-center md:items-end justify-between md:justify-end gap-3 flex-wrap">
          <div className="flex flex-col md:items-end gap-1">
            <div className="flex items-center gap-2">
              <StatusBadge status={log.status} />
              {log.duration_seconds !== undefined && (
                <span className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-amber-400" /> {fmtDuration(log.duration_seconds)}
                </span>
              )}
            </div>

            {/* Sub-status badges: ended_by, latency */}
            <div className="flex items-center gap-2 mt-1 flex-wrap text-[10px] text-slate-400">
              {log.ended_by && (
                <span className="bg-slate-800/80 px-2 py-0.5 rounded text-slate-400 border border-white/5">
                  {log.ended_by === 'AGENT_ENDS' ? '🤖 Agent ended call' :
                   log.ended_by === 'USER_ENDS' ? '👤 Customer hung up' : log.ended_by}
                </span>
              )}
              {log.avg_agent_latency !== undefined && (
                <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  <Zap className="w-2.5 h-2.5" /> Latency {log.avg_agent_latency}s
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 ml-auto md:ml-0">
            {log.audio_proxy_url && (
              <button
                onClick={() => setShowPlayer(p => !p)}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  showPlayer
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-glow-sm'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title="Play Audio Recording"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recording</span>
              </button>
            )}

            {hasTranscripts && (
              <button
                onClick={() => setExpanded(e => !e)}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  expanded
                    ? 'bg-brand-500/20 border-brand-500/40 text-brand-300 shadow-glow-sm'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title="View Transcript"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Transcript ({turnsToDisplay.length})</span>
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audio Player Drawer */}
      {showPlayer && log.audio_proxy_url && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5">
          <AudioPlayerBar audioUrl={log.audio_proxy_url} duration={log.duration_seconds} />
        </div>
      )}

      {/* AI Call Summary (if available) */}
      {log.call_summary && (
        <div className="mx-4 mb-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-purple-300 mr-1.5">AI Call Summary:</span>
            <span className="text-slate-300 leading-relaxed">{log.call_summary}</span>
            {log.call_disposition && (
              <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-purple-900/40 text-[9px] uppercase tracking-wider text-purple-300 font-bold border border-purple-500/30">
                {log.call_disposition.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Expanded Transcript Panel */}
      {expanded && hasTranscripts && (
        <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3">
          
          {/* Transcript Subheader with language switcher and copy */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setTranscriptTab('original')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  transcriptTab === 'original'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Original ({log.language || 'Local'})
              </button>

              {log.translate_transcript && log.translate_transcript.length > 0 && (
                <button
                  onClick={() => setTranscriptTab('translated')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    transcriptTab === 'translated'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English Translation
                </button>
              )}
            </div>

            <button
              onClick={copyTranscriptText}
              className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Full Transcript'}
            </button>
          </div>

          {/* Conversation Turns Scroll Area */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 max-h-72 overflow-y-auto space-y-2.5">
            {turnsToDisplay.map((turn, i) => (
              <div key={i} className={`flex gap-2.5 ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-md ${
                  turn.role === 'agent'
                    ? 'bg-brand-950/80 text-brand-100 border border-brand-500/30 rounded-tl-sm'
                    : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tr-sm'
                }`}>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      {turn.role === 'agent' ? '🤖 AI Voice Agent' : '👤 Customer'}
                    </span>
                    <span className="text-[9px] font-mono opacity-40">#{i + 1}</span>
                  </div>
                  <p className="text-[13px]">{turn.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────

export const CallLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [hoursFilter, setHoursFilter] = useState(24);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [usingMock, setUsingMock] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      const resp = await api.get(`/analytics/call-logs?hours=${hoursFilter}&include_transcript=true&limit=100`);
      const data = resp.data;
      const rawList: Record<string, unknown>[] = Array.isArray(data)
        ? data
        : (data.items || data.interactions || data.data || []);

      if (rawList && rawList.length > 0) {
        const mapped: CallLog[] = rawList.map((r) => {
          // Derive status
          let status: CallLog['status'] = 'completed';
          const failureReason = String(r.failure_reason || '').toUpperCase();

          if (failureReason && failureReason !== 'NO_FAILURE_REASON') {
            if (failureReason.includes('NO_ANSWER') || failureReason.includes('TIMEOUT')) {
              status = 'no_answer';
            } else if (failureReason.includes('BUSY')) {
              status = 'busy';
            } else {
              status = 'failed';
            }
          } else if (!r.end_datetime && !r.duration_in_seconds) {
            status = 'in_progress';
          }

          // Parse transcripts
          const parseTurns = (raw: unknown): TranscriptTurn[] => {
            if (!Array.isArray(raw)) return [];
            return raw.map((t: unknown) => {
              const turn = t as Record<string, unknown>;
              return {
                role: (String(turn.role || turn.speaker || 'agent').toLowerCase().includes('user') ? 'user' : 'agent') as 'agent' | 'user',
                text: String(turn.text || turn.content || turn.message || ''),
                timestamp: turn.timestamp ? String(turn.timestamp) : undefined,
              };
            }).filter(t => t.text.trim().length > 0);
          };

          const origTranscript = parseTurns(r.original_transcript || r.transcript);
          const transTranscript = parseTurns(r.translate_transcript);

          const agentVars = (r.agent_variables || {}) as Record<string, unknown>;
          const interactionId = String(r.interaction_id || '');

          return {
            interaction_id: interactionId,
            status,
            start_time: String(r.start_datetime || r.attempted_at || ''),
            end_time: r.end_datetime ? String(r.end_datetime) : undefined,
            duration_seconds: r.duration_in_seconds ? Math.round(Number(r.duration_in_seconds)) : undefined,
            to_number: String(r.user_contact || r.user_contact_masked || ''),
            from_number: String(r.bot_contact_identifier || ''),
            agent_name: agentVars.serviceProviderName
              ? `${agentVars.serviceProviderName} Agent`
              : (r.agent_name ? String(r.agent_name) : 'Voice Agent'),
            language: String(r.language_name || 'Hindi'),
            original_transcript: origTranscript,
            translate_transcript: transTranscript,
            call_summary: agentVars.call_summary ? String(agentVars.call_summary) : undefined,
            call_disposition: agentVars.call_disposition ? String(agentVars.call_disposition) : undefined,
            ended_by: r.ended_by ? String(r.ended_by) : undefined,
            failure_reason: r.failure_reason && r.failure_reason !== 'NO_FAILURE_REASON' ? String(r.failure_reason) : undefined,
            num_messages: r.num_messages ? Number(r.num_messages) : undefined,
            channel_direction: r.channel_direction ? String(r.channel_direction) : 'outbound',
            job_id: r.job_id ? String(r.job_id) : undefined,
            audio_proxy_url: interactionId ? `http://localhost:8000/api/analytics/call-logs/${interactionId}/stream-recording` : undefined,
            avg_agent_latency: r.average_agent_response_time_in_seconds ? Number(r.average_agent_response_time_in_seconds) : undefined,
            avg_user_latency: r.average_user_response_time_in_seconds ? Number(r.average_user_response_time_in_seconds) : undefined,
            user_name: agentVars.userName ? String(agentVars.userName) : undefined,
            service_provider: agentVars.serviceProviderName ? String(agentVars.serviceProviderName) : undefined,
          };
        });

        setLogs(mapped);
        setUsingMock(false);
      } else {
        setLogs([]);
        setUsingMock(false);
      }
    } catch (err) {
      console.warn('Analytics fetch error, showing mock/empty state:', err);
      setUsingMock(true);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, [hoursFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 10000); // poll every 10s
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoRefresh, fetchLogs]);

  // Filtering
  const filteredLogs = logs.filter(l => {
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    const matchSearch = searchQuery.trim() === '' ||
      l.to_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.interaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.agent_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const liveCalls = logs.filter(l => ['in_progress', 'ringing'].includes(l.status));
  const completedCalls = logs.filter(l => l.status === 'completed');
  const failedCalls = logs.filter(l => ['failed', 'no_answer', 'busy'].includes(l.status));
  const avgDuration = completedCalls.length > 0
    ? completedCalls.reduce((sum, l) => sum + (l.duration_seconds || 0), 0) / completedCalls.length
    : 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-cyan-400" />
            Live Call Analytics & Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time call logs · Live audio recordings · Dual-language transcripts — direct from{' '}
            <strong className="text-slate-200">Sarvam Samvaad</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/telephony"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Make Outbound Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <select
            value={hoursFilter}
            onChange={e => setHoursFilter(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value={1}>Last 1 hour</option>
            <option value={6}>Last 6 hours</option>
            <option value={24}>Last 24 hours</option>
            <option value={72}>Last 3 days</option>
            <option value={168}>Last 7 days</option>
          </select>

          <button
            onClick={() => setAutoRefresh(a => !a)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              autoRefresh
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            {autoRefresh ? 'Live (10s)' : 'Paused'}
          </button>

          <button
            onClick={fetchLogs}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            title="Refresh logs now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl glass-panel border border-white/8">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-2.5">
            <Phone className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-brand-400">{logs.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Interactions</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/8">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{completedCalls.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Completed Calls</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/8">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2.5">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-400">{fmtDuration(avgDuration)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Avg Call Duration</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/8">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2.5">
            <Gauge className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-cyan-400">
            {completedCalls.length > 0
              ? `${Math.round((completedCalls.length / logs.length) * 100)}%`
              : '100%'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Call Success Rate</p>
        </div>
      </div>

      {/* Live Call Alert (if any active) */}
      {liveCalls.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-brand-950/40 to-slate-900 border border-cyan-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400"></span>
            </span>
            <div>
              <p className="text-sm font-bold text-cyan-300">
                {liveCalls.length} call{liveCalls.length > 1 ? 's' : ''} currently active on Sarvam Telephony
              </p>
              <p className="text-xs text-slate-400">
                Call audio and transcript will be available immediately after the call concludes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by phone, name, or interaction..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `All (${logs.length})` },
            { id: 'completed', label: 'Completed' },
            { id: 'in_progress', label: 'Live' },
            { id: 'no_answer', label: 'No Answer' },
            { id: 'failed', label: 'Failed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === tab.id
                  ? 'bg-brand-600 border-brand-500 text-white shadow-glow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Call Logs List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-sm text-slate-400">Fetching live call data from Sarvam Analytics...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-20 text-slate-500 glass-panel rounded-2xl border border-white/5 p-8">
          <PhoneOff className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
          <p className="text-base font-semibold text-slate-300">No calls found</p>
          <p className="text-xs mt-1 text-slate-500 max-w-sm mx-auto">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'Trigger a real outbound call from the Telephony page to see live calls, recordings, and transcripts appear here.'}
          </p>
          <Link
            to="/telephony"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Make a Call Now
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredLogs.map(log => (
            <CallCard
              key={log.interaction_id}
              log={log}
              isLive={['in_progress', 'ringing'].includes(log.status)}
            />
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/5">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Connected to Sarvam Samvaad Telephony & Indus Media API
        </span>
        <span>
          Last updated: {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>

    </div>
  );
};

export default CallLogsPage;
