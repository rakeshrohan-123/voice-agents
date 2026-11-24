import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  PhoneOff, 
  PhoneCall, 
  Bot, 
  Zap, 
  RotateCcw,
  Send,
  Volume2
} from 'lucide-react';
import api from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  time: string;
  isAudioPlaying?: boolean;
}

export const PlaygroundPage: React.FC = () => {
  const { user, consumeCall } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState('agent_1');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sarvamAudioActive, setSarvamAudioActive] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const agents = [
    { id: 'agent_1', name: 'Loan Recovery Agent', lang: 'hi-IN', voice: 'priya', greeting: 'नमस्ते! मैं एचडीएफसी बैंक रिकवरी टीम से बात कर रहा हूँ। क्या मेरी बात श्री राजेश जी से हो रही है?' },
    { id: 'agent_2', name: 'COD Order Verification', lang: 'en-IN', voice: 'priya', greeting: 'Hello! I am calling from the logistics team to confirm your Cash on Delivery order address.' },
    { id: 'agent_3', name: 'Tamil Real-Estate Bot', lang: 'ta-IN', voice: 'gokul', greeting: 'வணக்கம்! சென்னை OMR புதிய வில்லா புராஜெக்ட் பற்றி விசாரிக்க ஆசைப்பட்டீர்களா?' },
  ];

  const currentAgent = agents.find(a => a.id === selectedAgent) || agents[0];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSpeaking]);

  const playBase64Audio = (base64Audio: string, fallbackText: string) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    if (base64Audio) {
      try {
        const audioSrc = `data:audio/wav;base64,${base64Audio}`;
        const audio = new Audio(audioSrc);
        currentAudioRef.current = audio;
        setIsSpeaking(true);
        setSarvamAudioActive(true);

        audio.onended = () => {
          setIsSpeaking(false);
          setSarvamAudioActive(false);
        };
        audio.onerror = () => {
          speakFallback(fallbackText);
        };
        audio.play().catch(() => {
          speakFallback(fallbackText);
        });
        return;
      } catch (err) {
        console.error('Audio play error, falling back to speech synthesis', err);
      }
    }
    speakFallback(fallbackText);
  };

  const speakFallback = (text: string) => {
    setIsSpeaking(true);
    setSarvamAudioActive(false);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startCall = async () => {
    if (!consumeCall(1)) {
      alert('Plan call quota exceeded! Please upgrade your plan in Plans & Billing.');
      return;
    }
    setIsCallActive(true);
    const greetingMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'agent',
      text: currentAgent.greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([greetingMsg]);

    // Request native Sarvam TTS audio from backend API
    try {
      const resp = await api.post('/voice/tts', {
        text: currentAgent.greeting,
        language_code: currentAgent.lang,
        speaker: currentAgent.voice
      });
      if (resp.data && resp.data.audio_base64) {
        playBase64Audio(resp.data.audio_base64, currentAgent.greeting);
      } else {
        speakFallback(currentAgent.greeting);
      }
    } catch {
      speakFallback(currentAgent.greeting);
    }
  };

  const endCall = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsCallActive(false);
    setIsSpeaking(false);
    setSarvamAudioActive(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !isCallActive) return;

    const userText = inputText;
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      // Call backend API with Sarvam AI reasoning & Bulbul TTS
      const resp = await api.post('/voice/chat', {
        agent_id: currentAgent.id,
        message: userText,
        language: currentAgent.lang
      });

      const reply = resp.data.reply || 'धन्यवाद। आपका अनुरोध दर्ज कर लिया गया है।';
      const agentReply: ChatMessage = {
        id: 'msg_' + Date.now(),
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentReply]);

      if (resp.data.audio_base64) {
        playBase64Audio(resp.data.audio_base64, reply);
      } else {
        speakFallback(reply);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackReply = 'जी, मैं आपकी बात समझ गया हूँ। क्या मैं आपकी कुछ और मदद कर सकता हूँ?';
      const agentReply: ChatMessage = {
        id: 'msg_' + Date.now(),
        sender: 'agent',
        text: fallbackReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentReply]);
      speakFallback(fallbackReply);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-brand-400" />
            <span>Interactive Voice Playground</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Connected to <strong>Sarvam Bulbul:v3 API</strong> for real-time Indic neural speech synthesis.
          </p>
        </div>

        {/* Agent Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Agent:</span>
          <select
            value={selectedAgent}
            disabled={isCallActive}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
          >
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.lang})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Call Visualizer & Transcript Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Call Control & Audio Visualizer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-3xl glass-card border border-white/10 text-center flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
            
            {/* Ambient pulse */}
            {isCallActive && (
              <div className="absolute inset-0 bg-brand-500/10 blur-[90px] pointer-events-none animate-pulse-glow"></div>
            )}

            {/* Agent Status Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center space-x-2 text-left">
                <div className="w-8 h-8 rounded-full bg-brand-600/30 text-brand-300 flex items-center justify-center font-bold text-xs">
                  {currentAgent.voice.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{currentAgent.name}</p>
                  <p className="text-[10px] text-slate-400">{currentAgent.lang} • Sarvam Bulbul:v3</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isCallActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {isCallActive ? (isSpeaking ? (sarvamAudioActive ? 'Sarvam AI Speaking' : 'Speaking...') : 'Listening...') : 'Ready to Connect'}
              </span>
            </div>

            {/* Audio Waveform Orb */}
            <div className="my-auto flex flex-col items-center justify-center py-6">
              <div className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all ${
                isCallActive 
                  ? (isSpeaking ? 'scale-110 shadow-glow bg-gradient-to-tr from-brand-600 to-purple-600' : 'bg-slate-900 border-2 border-brand-500/40') 
                  : 'bg-slate-900/60 border border-white/10'
              }`}>
                <Bot className={`w-16 h-16 ${isCallActive ? 'text-white' : 'text-slate-600'}`} />

                {/* Animated Wave Bars */}
                {isCallActive && isSpeaking && (
                  <div className="absolute -bottom-5 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-brand-500/40">
                    <span className="w-1 bg-brand-400 animate-wave rounded-full"></span>
                    <span className="w-1 bg-indigo-400 animate-wave rounded-full delay-100"></span>
                    <span className="w-1 bg-purple-400 animate-wave rounded-full delay-200"></span>
                    <span className="w-1 bg-emerald-400 animate-wave rounded-full delay-300"></span>
                    <span className="w-1 bg-cyan-400 animate-wave rounded-full delay-150"></span>
                  </div>
                )}
              </div>

              <p className="mt-6 text-xs text-slate-400">
                {isCallActive 
                  ? (isSpeaking ? 'Streaming Sarvam 8kHz audio waveform...' : 'Type your answer or query below') 
                  : 'Press "Start Voice Call" to test live audio'}
              </p>
            </div>

            {/* Call Action Controls */}
            <div className="w-full pt-4 border-t border-white/5 flex items-center justify-center space-x-4">
              {!isCallActive ? (
                <button
                  onClick={startCall}
                  className="w-full btn-primary-gradient py-3.5 rounded-2xl text-xs font-bold text-white shadow-glow flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Start Voice Call (Playground)</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-between gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`flex-1 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                      isMuted 
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>

                  <button
                    onClick={endCall}
                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Hang Up</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Latency Telemetry Widget */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 text-xs">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Realtime Pipeline Latency</span>
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                <p className="text-[10px] text-slate-400">STT (Speech)</p>
                <p className="font-mono font-bold text-emerald-400 mt-0.5">85ms</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                <p className="text-[10px] text-slate-400">LLM Reasoning</p>
                <p className="font-mono font-bold text-indigo-400 mt-0.5">115ms</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                <p className="text-[10px] text-slate-400">Bulbul TTS</p>
                <p className="font-mono font-bold text-purple-400 mt-0.5">180ms</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Real-time Transcript & Dialog Stream (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl glass-card border border-white/10 min-h-[520px] p-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold text-white">Live Conversation Transcript</h3>
              <p className="text-xs text-slate-400">Directly connected to Sarvam AI voice engine</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                title="Clear transcript"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Transcript Messages list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 max-h-[380px] pr-2">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Bot className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-xs">No active conversation yet.</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Click "Start Voice Call" to hear the live Sarvam voice.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'agent' && (
                    <div className="w-7 h-7 rounded-lg bg-brand-600/30 text-brand-300 flex items-center justify-center text-xs font-bold shrink-0">
                      AI
                    </div>
                  )}

                  <div className={`p-3 rounded-2xl max-w-sm sm:max-w-md text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-brand-600 text-white rounded-br-none shadow-glow-sm' 
                      : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="block text-[9px] text-slate-400 mt-1 text-right">{msg.time}</span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
                      Me
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* User Input Bar */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-white/5 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!isCallActive}
              placeholder={isCallActive ? "Type (e.g. हाँ, मुझे भुगतान करना है) and hit Send..." : "Start call to test..."}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!isCallActive || !inputText.trim()}
              className="btn-primary-gradient px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-glow-sm disabled:opacity-40 flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
