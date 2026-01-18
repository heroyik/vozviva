
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

// --- Utility Functions ---
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

/**
 * 시각적 강조를 위한 동사 분리 컴포넌트
 */
const HighlightedForm: React.FC<{ form: string, isIrregular?: boolean }> = ({ form, isIrregular }) => {
  if (isIrregular) {
    return <span className="text-terracotta drop-shadow-[0_0_8px_rgba(226,114,91,0.4)]">{form}</span>;
  }

  // 간단한 규칙 기반 분리 (학습용 Heuristic)
  // 동사가 -o, -as, -a, -amos, -áis, -an 등으로 끝나는 패턴을 분리
  const suffixes = [
    'amos', 'asteis', 'aron', 'isteis', 'ieron', 'íamos', 'íais', 'aban', 'abas', 'áramos', 'eremos', 'iremos', 'aréis', 'eréis', 'iréis',
    'ando', 'iendo', 'iendo', 'ado', 'ido', 
    'as', 'an', 'es', 'en', 'is', 'amos', 'emos', 'imos', 'áis', 'éis', 'ís',
    'é', 'ó', 'í', 'o', 'a', 'e'
  ];

  let stem = form;
  let ending = '';

  for (const s of suffixes) {
    if (form.endsWith(s)) {
      stem = form.substring(0, form.length - s.length);
      ending = s;
      break;
    }
  }

  return (
    <span className="inline-flex">
      <span className="text-white opacity-90">{stem}</span>
      <span className="text-med-teal font-black">{ending}</span>
    </span>
  );
};

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
  const [selectedTenseIds, setSelectedTenseIds] = useState<Tense[]>([SPANISH_VERB_DATA[0].id]);
  const [primaryTense, setPrimaryTense] = useState<TenseData>(SPANISH_VERB_DATA[0]);
  const [selectedVerb, setSelectedVerb] = useState<Verb>(SPANISH_VERB_DATA[0].verbs[0]);
  const [showIrregularModal, setShowIrregularModal] = useState(false);
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [currentlyPlayingVerb, setCurrentlyPlayingVerb] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); 
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  
  const audioContext = useRef<AudioContext | null>(null);
  const currentSource = useRef<AudioBufferSourceNode | null>(null);
  const stopRequested = useRef<boolean>(false);
  const progressInterval = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isRepeatEnabledRef = useRef(false);

  useEffect(() => {
    isRepeatEnabledRef.current = isRepeatEnabled;
  }, [isRepeatEnabled]);

  const allIrregularVerbs = SPANISH_VERB_DATA.flatMap(tense => 
    tense.verbs.filter(v => v.isIrregular).map(v => ({ 
      ...v, 
      tenseTitle: tense.title,
      tenseId: tense.id
    }))
  );

  const regularVerbs = primaryTense.verbs.filter(v => !v.isIrregular);
  const irregularVerbs = primaryTense.verbs.filter(v => v.isIrregular);

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

  const scrollToCard = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleTense = (tense: TenseData) => {
    setSelectedTenseIds(prev => {
      if (prev.includes(tense.id)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== tense.id);
      } else {
        return [...prev, tense.id];
      }
    });
    setPrimaryTense(tense);
    setSelectedVerb(tense.verbs[0]);
    stopAudio();
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    scrollToCard();
    
    do {
      const buffer = await getVerbAudioBuffer(primaryTense, verb);
      if (buffer && !stopRequested.current) {
        setIsTTSLoading(false);
        await playBuffer(buffer);
        if (isRepeatEnabledRef.current && !stopRequested.current) {
          await new Promise(r => setTimeout(r, 1000));
        }
      } else {
        break;
      }
    } while (isRepeatEnabledRef.current && !stopRequested.current);
    
    if (!stopRequested.current) {
      setCurrentlyPlayingVerb(null);
      setIsAudioPlaying(false);
      setIsTTSLoading(false);
    }
  };

  const readSelectedTensesVerbs = async () => {
    if (isTTSLoading || isAudioPlaying) {
      stopAudio();
      return;
    }
    
    stopRequested.current = false;
    setIsTTSLoading(true);
    
    const tensesToRead = SPANISH_VERB_DATA.filter(t => selectedTenseIds.includes(t.id));
    const allVerbsToRead = tensesToRead.flatMap(t => t.verbs.map(v => ({ verb: v, tense: t })));

    if (allVerbsToRead.length === 0) {
      setIsTTSLoading(false);
      return;
    }

    do {
      for (const item of allVerbsToRead) {
        if (stopRequested.current) break;
        
        setPrimaryTense(item.tense);
        setSelectedVerb(item.verb);
        setCurrentlyPlayingVerb(item.verb.name);
        scrollToCard();
        
        const buffer = await getVerbAudioBuffer(item.tense, item.verb);
        if (buffer && !stopRequested.current) {
          setIsTTSLoading(false);
          await playBuffer(buffer);
          if (!stopRequested.current) {
            await new Promise(r => setTimeout(r, 600));
          }
        }
      }
      if (isRepeatEnabledRef.current && !stopRequested.current) {
        await new Promise(r => setTimeout(r, 1200));
      }
    } while (isRepeatEnabledRef.current && !stopRequested.current);
    
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
    
    do {
      for (const verb of verbs) {
        if (stopRequested.current) break;
        
        setSelectedVerb(verb);
        setCurrentlyPlayingVerb(verb.name);
        scrollToCard();
        
        const buffer = await getVerbAudioBuffer(primaryTense, verb);
        if (buffer && !stopRequested.current) {
          setIsTTSLoading(false);
          await playBuffer(buffer);
          if (!stopRequested.current) {
            await new Promise(r => setTimeout(r, 600));
          }
        }
      }
      if (isRepeatEnabledRef.current && !stopRequested.current) {
        await new Promise(r => setTimeout(r, 1200));
      }
    } while (isRepeatEnabledRef.current && !stopRequested.current);
    
    if (!stopRequested.current) {
      setCurrentlyPlayingVerb(null);
      setIsAudioPlaying(false);
      setIsTTSLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-4 md:p-10 flex flex-col items-center max-w-6xl mx-auto pb-24 relative overflow-x-hidden">
      {/* Brand Header */}
      <header className="w-full mb-6 md:mb-16 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-8xl font-black mb-0 md:mb-1 tracking-tighter text-white">
            VOZ<span className="text-terracotta">VIVA</span>
          </h1>
          <p className="text-slate-500 font-light text-[8px] md:text-sm tracking-[0.3em] uppercase">Advanced Linguistic Training</p>
        </div>
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsRepeatEnabled(prev => !prev)}
            className={`flex-none w-10 md:w-16 rounded-xl md:rounded-full border flex items-center justify-center transition-all ${
              isRepeatEnabled 
                ? 'bg-terracotta/20 text-terracotta border-terracotta shadow-[0_0_15px_rgba(226,114,91,0.3)]' 
                : 'bg-white/5 text-slate-500 border-white/10'
            }`}
            title="Repeat Toggle"
          >
            <i className={`fas fa-redo text-xs md:text-base ${isRepeatEnabled ? 'fa-spin-slow' : ''}`}></i>
          </button>

          <button 
            onClick={readSelectedTensesVerbs}
            className={`flex-1 sm:flex-none ${
              (isTTSLoading || isAudioPlaying) && !currentlyPlayingVerb ? 'bg-white/10 text-terracotta border-terracotta/30' : 'bg-white/5 text-white border-white/10'
            } hover:bg-white/10 px-4 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-full text-[9px] md:text-xs font-bold border flex items-center justify-center gap-2 md:gap-3 transition-all shimmer-track`}
          >
            {(isTTSLoading || isAudioPlaying) && !currentlyPlayingVerb ? (
               <><i className="fas fa-stop text-terracotta animate-pulse"></i> STOP</>
            ) : (
              <><i className="fas fa-play text-terracotta"></i> FULL READING</>
            )}
          </button>

          <button 
            onClick={() => setShowIrregularModal(true)}
            className="flex-1 sm:flex-none bg-terracotta hover:bg-terracotta/90 text-white px-4 py-2.5 md:px-8 md:py-4 rounded-xl md:rounded-full text-[9px] md:text-xs font-bold shadow-2xl shadow-terracotta/20 flex items-center justify-center gap-2 transition-all"
          >
            <i className="fas fa-bolt"></i> ARCHIVE
          </button>
        </div>
      </header>

      {/* Tense Grid Selector */}
      <nav className="w-full mb-6 md:mb-12">
        <div className="tense-grid">
          {SPANISH_VERB_DATA.map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTense(t)}
              className={`px-2 py-2.5 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-[9px] md:text-xs font-black tracking-widest uppercase transition-all duration-300 border-2 ${
                selectedTenseIds.includes(t.id) 
                  ? (primaryTense.id === t.id ? 'bg-white text-black border-white shadow-lg scale-105' : 'bg-white/20 text-white border-white/30') 
                  : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>
      </nav>

      <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-12 items-start">
        
        {/* Main Card - Conjugation Display */}
        <div className="w-full order-1 lg:order-2 lg:col-span-8 scroll-mt-6 md:scroll-mt-10" ref={cardRef}>
          <section className="bg-white/[0.02] border border-white/10 rounded-[1.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>
            
            <div className="p-5 md:p-20 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-10 mb-6 md:mb-14 border-b border-white/5 pb-6 md:pb-12">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2 md:mb-6">
                    <span className={`text-[7px] md:text-[10px] font-black px-3 py-1 md:px-5 md:py-2 rounded-full tracking-widest uppercase border ${
                      selectedVerb.isIrregular ? 'text-terracotta border-terracotta/20 bg-terracotta/5' : 'text-med-teal border-med-teal/20 bg-med-teal/5'
                    }`}>
                      {selectedVerb.isIrregular ? 'Irregular' : 'Regular'}
                    </span>
                    <span className="text-slate-600 text-[7px] md:text-[10px] font-black tracking-widest uppercase">{primaryTense.id}</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[1] mb-1 md:mb-4">{selectedVerb.name}</h2>
                  <p className="text-sm md:text-2xl text-slate-500 font-light tracking-tight lowercase">/ {selectedVerb.translation} /</p>
                </div>
                
                <div className="relative group mt-2 md:mt-0">
                   {currentlyPlayingVerb === selectedVerb.name && (
                      <svg className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-[66px] h-[66px] md:w-[128px] md:h-[128px] rotate-[-90deg]">
                        <circle cx="33" cy="33" r="31" className="md:hidden" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                        <circle cx="64" cy="64" r="60" className="hidden md:block" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <circle
                          cx="33" cy="33" r="31" className="md:hidden"
                          fill="transparent" stroke={selectedVerb.isIrregular ? "#e2725b" : "#0d9488"} strokeWidth="2"
                          strokeDasharray="195" strokeDashoffset={195 - (195 * audioProgress) / 100}
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
                    className={`w-16 h-16 md:w-28 md:h-28 rounded-full ${isAudioPlaying && currentlyPlayingVerb === selectedVerb.name ? 'bg-terracotta text-white' : 'bg-white text-black'} flex items-center justify-center text-xl md:text-3xl hover:scale-105 active:scale-90 transition-all shadow-xl relative z-10`}
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

              {/* All 6 Conjugations in 2 columns */}
              <div className="grid grid-cols-2 gap-x-4 md:gap-x-24 gap-y-6 md:gap-y-12">
                {selectedVerb.conjugations.map((c, idx) => (
                  <div key={idx} className="group border-l-2 md:border-l-4 border-white/5 pl-3 md:pl-10 hover:border-terracotta transition-all duration-500">
                    <span className="block text-slate-600 text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.5em] uppercase mb-1 md:mb-4">{c.pronoun}</span>
                    <span className="text-xl sm:text-2xl md:text-6xl font-black tracking-tighter transition-all duration-300">
                      <HighlightedForm form={c.form} isIrregular={selectedVerb.isIrregular} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* List Section */}
        <div className="w-full order-2 lg:order-1 lg:col-span-4 space-y-6 md:space-y-12">
          <div className="bg-white/[0.03] border border-white/10 rounded-[1.2rem] md:rounded-[2.5rem] p-5 md:p-10 relative overflow-hidden">
            <h2 className="text-terracotta text-[8px] md:text-[10px] font-black mb-2 tracking-[0.4em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span> INFO
            </h2>
            <h3 className="text-lg md:text-4xl font-black text-white mb-1 md:mb-6">{primaryTense.title}</h3>
            <p className="text-slate-400 text-[10px] md:text-sm font-light leading-relaxed italic border-l border-white/20 pl-4">"{primaryTense.usage}"</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {regularVerbs.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3 px-2">
                  <h4 className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase">REGULARES</h4>
                  <button onClick={() => readCategoryVerbs(regularVerbs)} className="text-med-teal text-[8px] font-black tracking-widest uppercase">READ ALL</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                  {regularVerbs.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => { stopAudio(); setSelectedVerb(v); scrollToCard(); }}
                      className={`relative overflow-hidden p-3.5 md:px-8 md:py-5 rounded-xl md:rounded-[1.5rem] text-left transition-all border-2 ${
                        selectedVerb.name === v.name ? 'bg-med-teal text-white border-med-teal shadow-lg' : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs md:text-xl font-bold truncate pr-2">{v.name}</span>
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
                <div className="flex justify-between items-center mb-3 px-2">
                  <h4 className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase">IRREGULARES</h4>
                  <button onClick={() => readCategoryVerbs(irregularVerbs)} className="text-terracotta text-[8px] font-black tracking-widest uppercase">READ ALL</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                  {irregularVerbs.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => { stopAudio(); setSelectedVerb(v); scrollToCard(); }}
                      className={`relative overflow-hidden p-3.5 md:px-8 md:py-5 rounded-xl md:rounded-[1.5rem] text-left transition-all border-2 ${
                        selectedVerb.name === v.name ? 'bg-terracotta text-white border-terracotta shadow-lg' : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs md:text-xl font-bold truncate pr-2">{v.name}</span>
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

      {/* Archive Modal */}
      {showIrregularModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-lg" onClick={() => setShowIrregularModal(false)}></div>
          <div className="relative bg-zinc-900 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[1.5rem] border border-white/10 flex flex-col">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-black text-white">EL ARCHIVO</h2>
              <button onClick={() => setShowIrregularModal(false)} className="w-8 h-8 rounded-full bg-white/5 text-white flex items-center justify-center transition-colors hover:bg-white/10"><i className="fas fa-times"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allIrregularVerbs.map((v, i) => (
                <div key={i} className="bg-white/[0.02] rounded-xl border border-white/5 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white text-sm">{v.name}</span>
                    <span className="text-[7px] font-black px-2 py-0.5 rounded bg-terracotta/20 text-terracotta">{v.tenseId}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[9px]">
                    {v.conjugations.map((c, ci) => (
                      <div key={ci} className="text-slate-400 truncate">
                        <span className="text-slate-600 mr-1">{c.pronoun}:</span> 
                        <HighlightedForm form={c.form} isIrregular={true} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 py-8 text-slate-700 text-center w-full border-t border-white/5">
        <p className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-500 mb-3">VOZVIVA Linguistica</p>
        <p className="text-[8px] font-medium opacity-20">Optimized for Mobile Linguistic Mastery.</p>
      </footer>
    </div>
  );
};

export default App;
