
import React, { useState, useRef, useEffect } from 'react';
import { Tense, TenseData, Verb } from './types';
import { SPANISH_VERB_DATA } from './constants';
import { GoogleGenAI, Modality } from '@google/genai';

// --- Audio Persistence Layer (IndexedDB) ---
class AudioStore {
  private dbName = 'VozVivaCache';
  private storeName = 'audio_files';
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async get(key: string): Promise<Uint8Array | null> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const request = transaction.objectStore(this.storeName).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async set(key: string, data: Uint8Array): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(this.storeName, 'readwrite');
      const request = transaction.objectStore(this.storeName).put(data, key);
      request.onsuccess = () => resolve();
    });
  }
}

const audioStore = new AudioStore();

// --- Utility Functions for Audio ---
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

const WaveformIndicator: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex items-end gap-0.5 h-3">
    <div className={`wave-bar ${color}`} style={{ height: '6px' }}></div>
    <div className={`wave-bar ${color}`} style={{ height: '10px' }}></div>
    <div className={`wave-bar ${color}`} style={{ height: '4px' }}></div>
    <div className={`wave-bar ${color}`} style={{ height: '12px' }}></div>
    <div className={`wave-bar ${color}`} style={{ height: '8px' }}></div>
  </div>
);

const App: React.FC = () => {
  const [selectedTense, setSelectedTense] = useState<TenseData>(SPANISH_VERB_DATA[0]);
  const [selectedVerb, setSelectedVerb] = useState<Verb>(SPANISH_VERB_DATA[0].verbs[0]);
  const [showIrregularModal, setShowIrregularModal] = useState(false);
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [currentlyPlayingVerb, setCurrentlyPlayingVerb] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); 
  
  const audioContext = useRef<AudioContext | null>(null);
  const currentSource = useRef<AudioBufferSourceNode | null>(null);
  const stopRequested = useRef<boolean>(false);
  const progressInterval = useRef<number | null>(null);

  const allIrregularVerbs = SPANISH_VERB_DATA.flatMap(tense => 
    tense.verbs.filter(v => v.isIrregular).map(v => ({ 
      ...v, 
      tenseTitle: tense.title,
      tenseId: tense.id
    }))
  );

  const regularVerbs = selectedTense.verbs.filter(v => !v.isIrregular);
  const irregularVerbs = selectedTense.verbs.filter(v => v.isIrregular);

  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  };

  const clearProgress = () => {
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setAudioProgress(0);
  };

  const stopAudio = () => {
    stopRequested.current = true;
    if (currentSource.current) {
      try {
        currentSource.current.stop();
      } catch (e) {}
      currentSource.current = null;
    }
    clearProgress();
    setIsAudioPlaying(false);
    setIsTTSLoading(false);
    setCurrentlyPlayingVerb(null);
  };

  const getVerbAudioBuffer = async (tense: TenseData, verb: Verb): Promise<AudioBuffer | null> => {
    const cacheKey = `${tense.id}_${verb.name}`;
    initAudio();

    const cachedData = await audioStore.get(cacheKey);
    if (cachedData) {
      return decodeAudioData(cachedData, audioContext.current!, 24000, 1);
    }

    let script = `${verb.name}. `;
    verb.conjugations.forEach(c => {
      const pronoun = c.pronoun.split('/')[0];
      script += `${pronoun} ${c.form}. `;
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: script.trim() }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
          },
        },
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
      if (audioPart?.inlineData?.data) {
        const rawBytes = decode(audioPart.inlineData.data);
        await audioStore.set(cacheKey, rawBytes);
        return decodeAudioData(rawBytes, audioContext.current!, 24000, 1);
      }
    } catch (err) {
      console.error(`TTS API Error:`, err);
    }
    return null;
  };

  const playBuffer = (buffer: AudioBuffer): Promise<void> => {
    return new Promise((resolve) => {
      if (stopRequested.current) {
        resolve();
        return;
      }
      initAudio();
      const source = audioContext.current!.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.current!.destination);
      
      const duration = buffer.duration;
      const startTime = Date.now();
      
      clearProgress();
      progressInterval.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min((elapsed / duration) * 100, 100);
        setAudioProgress(progress);
      }, 50);

      source.onended = () => {
        currentSource.current = null;
        clearProgress();
        resolve();
      };
      
      currentSource.current = source;
      setIsAudioPlaying(true);
      source.start();
    });
  };

  const readSingleVerb = async (verb: Verb = selectedVerb) => {
    if (isTTSLoading || isAudioPlaying) {
      stopAudio();
      return;
    }
    
    stopRequested.current = false;
    setIsTTSLoading(true);
    setCurrentlyPlayingVerb(verb.name);
    setSelectedVerb(verb);
    
    const buffer = await getVerbAudioBuffer(selectedTense, verb);
    if (buffer && !stopRequested.current) {
      setIsTTSLoading(false);
      await playBuffer(buffer);
    }
    
    if (!stopRequested.current) {
      setCurrentlyPlayingVerb(null);
      setIsAudioPlaying(false);
      setIsTTSLoading(false);
    }
  };

  const readCategoryVerbs = async (verbs: Verb[]) => {
    if (isTTSLoading || isAudioPlaying) {
      stopAudio();
      return;
    }
    
    stopRequested.current = false;
    setIsTTSLoading(true);
    
    for (const verb of verbs) {
      if (stopRequested.current) break;
      setSelectedVerb(verb);
      setCurrentlyPlayingVerb(verb.name);
      const buffer = await getVerbAudioBuffer(selectedTense, verb);
      if (buffer && !stopRequested.current) {
        setIsTTSLoading(false);
        await playBuffer(buffer);
        if (!stopRequested.current) {
          await new Promise(r => setTimeout(r, 600));
        }
      }
    }
    
    if (!stopRequested.current) {
      setCurrentlyPlayingVerb(null);
      setIsAudioPlaying(false);
      setIsTTSLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:p-10 flex flex-col items-center max-w-6xl mx-auto pb-24 relative overflow-x-hidden">
      {/* Brand Header */}
      <header className="w-full mb-8 md:mb-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-8xl font-black mb-1 tracking-tighter text-white">
            VOZ<span className="text-terracotta">VIVA</span>
          </h1>
          <p className="text-slate-500 font-light text-[10px] md:text-sm tracking-[0.3em] uppercase">Advanced Linguistic Training</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={() => readCategoryVerbs(selectedTense.verbs)}
            className={`${
              (isTTSLoading || isAudioPlaying) && !currentlyPlayingVerb ? 'bg-white/10 text-terracotta border-terracotta/30' : 'bg-white/5 text-white border-white/10'
            } hover:bg-white/10 px-6 py-3 md:px-8 md:py-4 rounded-2xl md:rounded-full text-[10px] md:text-xs font-bold border flex items-center justify-center gap-3 transition-all shimmer-track`}
          >
            {(isTTSLoading || isAudioPlaying) && !currentlyPlayingVerb ? (
               <><i className="fas fa-stop text-terracotta animate-pulse"></i> STOP READING</>
            ) : (
              <><i className="fas fa-play text-terracotta"></i> FULL READING</>
            )}
          </button>
          <button 
            onClick={() => setShowIrregularModal(true)}
            className="bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl md:rounded-full text-[10px] md:text-xs font-bold shadow-2xl shadow-terracotta/20 flex items-center justify-center gap-2 transition-all"
          >
            <i className="fas fa-bolt"></i> ARCHIVE
          </button>
        </div>
      </header>

      {/* Tense Grid Selector - No Cutting Off */}
      <nav className="w-full mb-8 md:mb-12">
        <div className="tense-grid">
          {SPANISH_VERB_DATA.map((t) => (
            <button
              key={t.id}
              onClick={() => { stopAudio(); setSelectedTense(t); setSelectedVerb(t.verbs[0]); }}
              className={`px-3 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black tracking-widest uppercase transition-all duration-300 border-2 ${
                selectedTense.id === t.id 
                  ? 'bg-white text-black border-white shadow-lg' 
                  : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>
      </nav>

      <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-12 items-start">
        
        {/* Main Card - Conjugation Display (Mobile First: Top) */}
        <div className="w-full order-1 lg:order-2 lg:col-span-8">
          <section className="bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>
            
            <div className="p-8 md:p-20 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-10 mb-10 md:mb-20 border-b border-white/5 pb-10 md:pb-16">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4 md:mb-6">
                    <span className={`text-[8px] md:text-[10px] font-black px-4 py-1.5 md:px-5 md:py-2 rounded-full tracking-widest uppercase border ${
                      selectedVerb.isIrregular ? 'text-terracotta border-terracotta/20 bg-terracotta/5' : 'text-med-teal border-med-teal/20 bg-med-teal/5'
                    }`}>
                      {selectedVerb.isIrregular ? 'Irregular' : 'Regular'}
                    </span>
                    <span className="text-slate-600 text-[8px] md:text-[10px] font-black tracking-widest uppercase">{selectedTense.id}</span>
                  </div>
                  <h2 className="text-5xl sm:text-7xl md:text-[10rem] font-black text-white tracking-tighter leading-[1] mb-2 md:mb-4">{selectedVerb.name}</h2>
                  <p className="text-lg md:text-2xl text-slate-500 font-light tracking-tight lowercase">/ {selectedVerb.translation} /</p>
                </div>
                
                <div className="relative group mt-4 md:mt-0">
                   {currentlyPlayingVerb === selectedVerb.name && (
                      <svg className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-[84px] h-[84px] md:w-[128px] md:h-[128px] rotate-[-90deg]">
                        <circle cx="42" cy="42" r="40" className="md:hidden" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle cx="64" cy="64" r="60" className="hidden md:block" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <circle
                          cx="42" cy="42" r="40" className="md:hidden"
                          fill="transparent" stroke={selectedVerb.isIrregular ? "#e2725b" : "#0d9488"} strokeWidth="3"
                          strokeDasharray="251" strokeDashoffset={251 - (251 * audioProgress) / 100}
                        />
                        <circle
                          cx="64" cy="64" r="60" className="hidden md:block"
                          fill="transparent" stroke={selectedVerb.isIrregular ? "#e2725b" : "#0d9488"} strokeWidth="4"
                          strokeDasharray="377" strokeDashoffset={377 - (377 * audioProgress) / 100}
                        />
                      </svg>
                   )}
                   <button 
                    onClick={() => readSingleVerb()}
                    className={`w-20 h-20 md:w-28 md:h-28 rounded-full ${isAudioPlaying && currentlyPlayingVerb === selectedVerb.name ? 'bg-terracotta text-white' : 'bg-white text-black'} flex items-center justify-center text-2xl md:text-3xl hover:scale-105 active:scale-90 transition-all shadow-xl relative z-10`}
                  >
                    {isTTSLoading && currentlyPlayingVerb === selectedVerb.name ? <i className="fas fa-spinner animate-spin"></i> : 
                     isAudioPlaying && currentlyPlayingVerb === selectedVerb.name ? <i className="fas fa-stop"></i> : <i className="fas fa-play ml-1"></i>}
                  </button>
                  {currentlyPlayingVerb === selectedVerb.name && (
                    <div className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2">
                       <WaveformIndicator color={selectedVerb.isIrregular ? "bg-terracotta" : "bg-med-teal"} />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 md:gap-x-24 gap-y-8 md:gap-y-16">
                {selectedVerb.conjugations.map((c, idx) => (
                  <div key={idx} className="group border-l-2 md:border-l-4 border-white/5 pl-6 md:pl-10 hover:border-terracotta transition-all duration-500">
                    <span className="block text-slate-600 text-[8px] md:text-[10px] font-black tracking-[0.5em] uppercase mb-2 md:mb-5">{c.pronoun}</span>
                    <span className={`text-3xl md:text-6xl font-black tracking-tighter transition-all duration-300 ${
                      selectedVerb.isIrregular ? 'text-white group-hover:text-terracotta' : 'text-white group-hover:text-med-teal'
                    }`}>
                      {c.form}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* List Section (Mobile First: Bottom) */}
        <div className="w-full order-2 lg:order-1 lg:col-span-4 space-y-6 md:space-y-12">
          {/* Tense Info (Compact) */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
            <h2 className="text-terracotta text-[8px] md:text-[10px] font-black mb-3 md:mb-4 tracking-[0.4em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span> INFO
            </h2>
            <h3 className="text-xl md:text-4xl font-black text-white mb-2 md:mb-6">{selectedTense.title}</h3>
            <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed italic border-l border-white/20 pl-4">"{selectedTense.usage}"</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {regularVerbs.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4 px-2">
                  <h4 className="text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase">REGULARES</h4>
                  <button onClick={() => readCategoryVerbs(regularVerbs)} className="text-med-teal text-[8px] font-black tracking-widest uppercase">READ ALL</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                  {regularVerbs.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => { stopAudio(); setSelectedVerb(v); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                      className={`relative overflow-hidden p-4 md:px-8 md:py-5 rounded-xl md:rounded-[1.5rem] text-left transition-all border-2 ${
                        selectedVerb.name === v.name ? 'bg-med-teal text-white border-med-teal' : 'bg-white/[0.02] text-slate-400 border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm md:text-xl font-bold truncate pr-2">{v.name}</span>
                        {currentlyPlayingVerb === v.name && <WaveformIndicator color="bg-white" />}
                      </div>
                      {currentlyPlayingVerb === v.name && <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all" style={{width: `${audioProgress}%`}}></div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {irregularVerbs.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4 px-2">
                  <h4 className="text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase">IRREGULARES</h4>
                  <button onClick={() => readCategoryVerbs(irregularVerbs)} className="text-terracotta text-[8px] font-black tracking-widest uppercase">READ ALL</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                  {irregularVerbs.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => { stopAudio(); setSelectedVerb(v); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                      className={`relative overflow-hidden p-4 md:px-8 md:py-5 rounded-xl md:rounded-[1.5rem] text-left transition-all border-2 ${
                        selectedVerb.name === v.name ? 'bg-terracotta text-white border-terracotta' : 'bg-white/[0.02] text-slate-400 border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm md:text-xl font-bold truncate pr-2">{v.name}</span>
                        {currentlyPlayingVerb === v.name && <WaveformIndicator color="bg-white" />}
                      </div>
                      {currentlyPlayingVerb === v.name && <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all" style={{width: `${audioProgress}%`}}></div>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Irregular Archive Modal */}
      {showIrregularModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-lg" onClick={() => setShowIrregularModal(false)}></div>
          <div className="relative bg-zinc-900 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[2rem] border border-white/10 flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">EL ARCHIVO</h2>
              <button onClick={() => setShowIrregularModal(false)} className="w-10 h-10 rounded-full bg-white/5 text-white flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allIrregularVerbs.map((v, i) => (
                <div key={i} className="bg-white/[0.02] rounded-2xl border border-white/5 p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-white">{v.name}</span>
                    <span className="text-[8px] font-black px-2 py-1 rounded bg-terracotta/20 text-terracotta">{v.tenseId}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {v.conjugations.map((c, ci) => (
                      <div key={ci} className="text-slate-400"><span className="text-slate-600 mr-1">{c.pronoun}:</span> {c.form}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 py-10 text-slate-700 text-center w-full border-t border-white/5">
        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 mb-4">VOZVIVA Linguistica</p>
        <div className="flex justify-center gap-8 mb-4">
           <a href="#" className="text-lg opacity-50 hover:opacity-100"><i className="fab fa-github"></i></a>
           <a href="#" className="text-lg opacity-50 hover:opacity-100"><i className="fas fa-globe"></i></a>
        </div>
        <p className="text-[8px] font-medium opacity-20">Optimized for Mobile Context-Aware Retrieval.</p>
      </footer>
    </div>
  );
};

export default App;
