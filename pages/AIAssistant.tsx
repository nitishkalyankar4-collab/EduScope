
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  BrainCircuit, 
  Globe,
  Loader2,
  AlertCircle,
  Users,
  Mic,
  MicOff,
  AudioLines,
  Zap
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { GeminiService, AssistantMode } from '../services/geminiService';
import { ChatMessage } from '../types';

// Helper functions for audio processing
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AssistantMode>('NORMAL');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !attachment) return;

    const userMsgId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMsgId,
      senderId: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    const currentAttachment = attachment;
    const currentMode = mode;
    setInput('');
    setAttachment(null);
    setLoading(true);

    try {
      if (currentAttachment) {
        const responseText = await GeminiService.analyzeImage(currentAttachment.split(',')[1], currentInput);
        addAiMessage(responseText);
      } else {
        const aiMsgId = (Date.now() + 1).toString();
        const aiMessage: ChatMessage = {
          id: aiMsgId,
          senderId: 'ai',
          text: '',
          timestamp: new Date().toLocaleTimeString(),
          isAi: true
        };
        
        setMessages(prev => [...prev, aiMessage]);
        let fullText = '';
        
        const stream = GeminiService.streamAssistant(currentInput, currentMode);
        for await (const chunk of stream) {
          fullText += chunk;
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullText } : m));
        }
      }
    } catch (error) {
      addAiMessage("I'm sorry, I encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addAiMessage = (text: string) => {
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      senderId: 'ai',
      text,
      timestamp: new Date().toLocaleTimeString(),
      isAi: true
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachment(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleVoice = async () => {
    if (isListening) {
      stopVoice();
      return;
    }
    try {
      setIsListening(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => stopVoice(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are EduScope AI tutor.',
        },
      });
    } catch (error) {
      stopVoice();
    }
  };

  const stopVoice = () => {
    setIsListening(false);
    streamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  const modeOptions = [
    { id: 'NORMAL', label: 'Normal', icon: Zap, desc: 'Fast responses' },
    { id: 'THINKING', label: 'Thinking', icon: Sparkles, desc: 'Deep reasoning' },
    { id: 'SEARCH', label: 'Search', icon: Globe, desc: 'Real-time web' },
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in duration-300">
      {/* Header with Segmented Mode Switcher */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">EduScope AI</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Tutor</p>
          </div>
        </div>
        
        {/* Mode Pill Toggle */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl relative border border-slate-200">
          {modeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id as AssistantMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative z-10 ${
                mode === opt.id ? 'text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <opt.icon size={14} />
              <span className="hidden sm:inline">{opt.label}</span>
              {mode === opt.id && (
                <div className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-md animate-in fade-in zoom-in duration-200"></div>
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setMessages([])}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Clear History"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6">
              {mode === 'NORMAL' && <Zap size={40} className="animate-pulse" />}
              {mode === 'THINKING' && <Sparkles size={40} className="animate-spin-slow" />}
              {mode === 'SEARCH' && <Globe size={40} className="animate-bounce" />}
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {mode === 'NORMAL' && 'Standard Intelligence'}
              {mode === 'THINKING' && 'Deep Reasoning Mode'}
              {mode === 'SEARCH' && 'Web-Grounded Search'}
            </h3>
            <p className="text-slate-500 mt-2 text-sm">
              {mode === 'NORMAL' && 'Fast and efficient for daily homework and quick facts.'}
              {mode === 'THINKING' && 'Best for complex math, coding, and logical proofing.'}
              {mode === 'SEARCH' && 'Accesses current events and verified external resources.'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] flex gap-3 ${msg.isAi ? '' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.isAi ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.isAi ? <Sparkles size={16} /> : <Users size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.isAi ? 'bg-white border border-slate-100 text-slate-800' : 'bg-indigo-600 text-white'
              }`}>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                  {msg.text || (loading && msg.isAi ? <span className="inline-block w-4 h-4 bg-indigo-400 rounded-full animate-pulse"></span> : '')}
                </div>
                <div className={`text-[10px] mt-2 opacity-60 ${msg.isAi ? 'text-slate-400' : 'text-white'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && !messages.find(m => m.isAi && m.text === '') && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-500 text-xs italic">
                AI is processing in {mode.toLowerCase()} mode...
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {attachment && (
          <div className="mb-4 flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 w-fit group">
            <img src={attachment} alt="Attachment" className="w-10 h-10 rounded object-cover" />
            <button onClick={() => setAttachment(null)} className="p-1 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
        )}

        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-indigo-600"
            title="Upload image for analysis"
          >
            <ImageIcon size={20} />
          </button>
          
          <textarea 
            placeholder={
              mode === 'SEARCH' ? "Search for latest info..." : 
              mode === 'THINKING' ? "Ask a complex reasoning query..." : 
              "Ask me anything..."
            }
            className="flex-1 bg-transparent border-none outline-none text-sm py-2 px-1 resize-none max-h-32"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button 
            onClick={toggleVoice}
            className={`p-3 rounded-xl ${isListening ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-indigo-600'}`}
          >
            <Mic size={20} />
          </button>

          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !attachment) || loading}
            className={`p-3 rounded-xl shadow-md ${
              (!input.trim() && !attachment) || loading ? 'bg-slate-200 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-3">
           <p className="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-widest font-bold">
            <AlertCircle size={10} /> Active: {modeOptions.find(o => o.id === mode)?.desc}
           </p>
        </div>
      </div>

      {isListening && (
        <div className="absolute inset-0 z-50 bg-indigo-600/95 flex flex-col items-center justify-center p-8 text-white backdrop-blur-xl animate-in fade-in duration-300">
           <AudioLines size={80} className="animate-pulse mb-8" />
           <h3 className="text-3xl font-bold mb-2">Voice Tutoring Active</h3>
           <p className="opacity-80 mb-12">I'm listening to your academic questions...</p>
           <button onClick={stopVoice} className="w-20 h-20 bg-white text-rose-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
             <MicOff size={40} />
           </button>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
