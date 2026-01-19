
import React, { useState, useRef, useEffect, useMemo } from 'react';
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

  async getAllKeys(): Promise<string[]> {
    if (!this.db) await this.init();
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(this.storeName, 'readonly');
      const request = transaction.objectStore(this.storeName).getAllKeys();
      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => resolve([]);
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

const HighlightedForm: React.FC<{ form: string, isIrregular?: boolean }> = ({ form, isIrregular }) => {
  if (isIrregular) {
    return <span className="text-terracotta drop-shadow-[0_0_8px_rgba(226,114,91,0.4)]">{form}</span>;
  }

  const suffixes = [
    'amos', 'asteis', 'aron', 'isteis', 'ieron', 'íamos', 'íais', 'aban', 'abas', 'áramos', 'eremos', 'iremos', 'aréis', 'eréis', 'iréis',
    'ando', 'iendo', 'ado', 'ido', 
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

const WaveformIndicator: React.FC<{ color: string, isPaused?: boolean }> = ({ color, isPaused }) => (
  <div className="flex items-end gap-0.5 h-3">
    {[1, 2, 3, 4, 5].map(i => (
      <div 
        key={i} 
        className={`wave-bar ${color} ${isPaused ? '!animation-none !h-1' : ''}`} 
        style={{ height: `${[6, 10, 4, 12, 8][i-1]}px`, animationDelay: `${(i-1)*0.1}s` }}
      ></div>
    ))}
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
  const [isPaused, setIsPaused] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); 
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [tenseFavorites, setTenseFavorites] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [cachedKeys, setCachedKeys] = useState<Set<string>>(new Set());
  
  const audioContext = useRef<AudioContext | null>(null);
  const currentSource = useRef<AudioBufferSourceNode | null>(null);
  const stopRequested = useRef<boolean>(false);
  const progressInterval = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isRepeatEnabledRef = useRef(false);

  useEffect(() => {
    isRepeatEnabledRef.current = isRepeatEnabled;
  }, [isRepeatEnabled]);

  useEffect(() => {
    audioStore.getAllKeys().then(keys => setCachedKeys(new Set(keys)));
  }, []);

  const getVerbKey = (tenseId: string, verbName: string) => `${tenseId}_${verbName}`;

  // Cache Logic
  const isVerbCached = (tenseId: string, verbName: string) => cachedKeys.has(getVerbKey(tenseId, verbName));
  const isTenseCached = (tenseId: string) => {
    const tense = SPANISH_VERB_DATA.find(t => t.id === tenseId);
    return tense ? tense.verbs.every(v => isVerbCached(tenseId, v.name)) : false;
  };
  const isAllCached = useMemo(() => SPANISH_VERB_DATA.every(t => isTenseCached(t.id)), [cachedKeys]);

  const toggleFavorite = (e: React.MouseEvent, tenseId: string, verbName: string) => {
    e.stopPropagation();
    const key = getVerbKey(tenseId, verbName);
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleTenseFavorite = (e: React.MouseEvent, tenseId: string) => {
    e.stopPropagation();
    setTenseFavorites(prev => {
      const next = new Set(prev);
      if (next.has(tenseId)) next.delete(tenseId);
      else next.add(tenseId);
      return next;
    });
  };

  const isFav = (tenseId: string, verbName: string) => favorites.has(getVerbKey(tenseId, verbName));
  const isTenseFav = (tenseId: string) => tenseFavorites.has(tenseId);

  const regularVerbs = primaryTense.verbs.filter(v => 
    !v.isIrregular && (!showOnlyFavorites || isFav(primaryTense.id, v.name) || isTenseFav(primaryTense.id))
  );
  const irregularVerbs = primaryTense.verbs.filter(v => 
    v.isIrregular && (!showOnlyFavorites || isFav(primaryTense.id, v.name) || isTenseFav(primaryTense.id))
  );

  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
  };

  const togglePause = async () => {
    if (!audioContext.current) return;
    if (audioContext.current.state === 'running') {
      await audioContext.current.suspend();
      setIsPaused(true);
    } else if (audioContext.current.state === 'suspended') {
      await audioContext.current.resume();
      setIsPaused(false);
    }
  };

  const clearProgress = () => {
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setAudioProgress(0);
  };

  const stopAudio = async () => {
    stopRequested.current = true;
    if (audioContext.current && audioContext.current.state === 'suspended') {
      await audioContext.current.resume();
    }
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
    setIsPaused(false);
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
    const cacheKey = getVerbKey(tense.id, verb.name);
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

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const callTTSWithRetry = async (retries = 3, delay = 2000): Promise<any> => {
      try {
        return await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: script.trim() }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
            },
          },
        });
      } catch (err: any) {
        if (retries > 0 && (err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED'))) {
          console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          return callTTSWithRetry(retries - 1, delay * 2);
        }
        throw err;
      }
    };

    try {
      const response = await callTTSWithRetry();
      const audioPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.data);
      if (audioPart?.inlineData?.data) {
        const rawBytes = decode(audioPart.inlineData.data);
        await audioStore.set(cacheKey, rawBytes);
        setCachedKeys(prev => new Set([...Array.from(prev), cacheKey]));
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
      const startTimeRef = { value: audioContext.current!.currentTime };
      
      clearProgress();
      progressInterval.current = window.setInterval(() => {
        if (audioContext.current?.state === 'suspended') return;
        
        // Use AudioContext time for accurate progress even when paused/resumed
        const elapsed = audioContext.current!.currentTime - startTimeRef.value;
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
    if (isAudioPlaying && currentlyPlayingVerb === verb.name) {
      togglePause();
      return;
    }
    if (isTTSLoading) return;
    
    stopAudio();
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
    if (isAudioPlaying && !currentlyPlayingVerb) {
      togglePause();
      return;
    }
    if (isTTSLoading) return;

    stopAudio();
    stopRequested.current = false;
    setIsTTSLoading(true);
    
    let allVerbsToRead: { verb: Verb; tense: TenseData }[] = [];

    if (showOnlyFavorites) {
      allVerbsToRead = SPANISH_VERB_DATA.flatMap(t => 
        t.verbs
          .filter(v => isFav(t.id, v.name) || isTenseFav(t.id))
          .map(v => ({ verb: v, tense: t }))
      );
    } else {
      const tensesToRead = SPANISH_VERB_DATA.filter(t => selectedTenseIds.includes(t.id));
      allVerbsToRead = tensesToRead.flatMap(t => t.verbs.map(v => ({ verb: v, tense: t })));
    }

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
            await new Promise(r => setTimeout(r, 800));
          }
        }
      }
      if (isRepeatEnabledRef.current && !stopRequested.current) {
        await new Promise(r => setTimeout(r, 1500));
      }
    } while (isRepeatEnabledRef.current && !stopRequested.current);
    
    if (!stopRequested.current) {
      setCurrentlyPlayingVerb(null);
      setIsAudioPlaying(false);
      setIsTTSLoading(false);
    }
  };

  const readCategoryVerbs = async (verbs: Verb[]) => {
    if (isAudioPlaying) {
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
            await new Promise(r => setTimeout(r, 800));
          }
        }
      }
      if (isRepeatEnabledRef.current && !stopRequested.current) {
        await new Promise(r => setTimeout(r, 1500));
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
        <div className="text-center md:text-left relative group">
          <h1 className={`text-4xl md:text-8xl font-black mb-0 md:mb-1 tracking-tighter transition-all duration-700 ${isAllCached ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]' : 'text-white'}`}>
            VOZ<span className={isAllCached ? 'text-white' : 'text-terracotta'}>VIVA</span>
          </h1>
          <p className="text-slate-500 font-light text-[8px] md:text-sm tracking-[0.3em] uppercase">Advanced Linguistic Training</p>
          {isAllCached && (
            <div className="absolute -top-4 -right-12 md:-top-8 md:-right-24 bg-amber-400 text-black text-[7px] md:text-[10px] font-black px-2 py-0.5 md:px-4 md:py-1 rounded-full animate-bounce shadow-xl">
              <i className="fas fa-check-double mr-1"></i> OFFLINE READY
            </div>
          )}
        </div>
        
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowOnlyFavorites(prev => !prev)}
            className={`flex-none w-10 md:w-16 rounded-xl md:rounded-full border flex items-center justify-center transition-all ${
              showOnlyFavorites 
                ? 'bg-terracotta/20 text-terracotta border-terracotta' 
                : 'bg-white/5 text-slate-500 border-white/10'
            }`}
            title="Show Favorites Only"
          >
            <i className={`fas fa-heart text-xs md:text-base`}></i>
          </button>

          <button 
            onClick={() => setIsRepeatEnabled(prev => !prev)}
            className={`flex-none w-10 md:w-16 rounded-xl md:rounded-full border flex items-center justify-center transition-all ${
              isRepeatEnabled 
                ? 'bg-med-teal/20 text-med-teal border-med-teal shadow-[0_0_15px_rgba(13,148,136,0.3)]' 
                : 'bg-white/5 text-slate-500 border-white/10'
            }`}
            title="Repeat Toggle"
          >
            <i className={`fas fa-redo text-xs md:text-base ${isRepeatEnabled ? 'fa-spin-slow' : ''}`}></i>
          </button>

          <div className="flex flex-1 sm:flex-none gap-1">
            <button 
              onClick={readSelectedTensesVerbs}
              className={`flex-1 sm:flex-none h-10 md:h-16 ${
                isAudioPlaying && !currentlyPlayingVerb ? 'bg-med-teal text-white border-med-teal' : 'bg-white/5 text-white border-white/10'
              } hover:bg-white/10 px-4 md:px-8 rounded-xl md:rounded-full text-[9px] md:text-xs font-bold border flex items-center justify-center gap-2 transition-all shimmer-track`}
            >
              {isAudioPlaying && !currentlyPlayingVerb ? (
                isPaused ? <><i className="fas fa-play text-white"></i> RESUME</> : <><i className="fas fa-pause text-white"></i> PAUSE</>
              ) : (
                <><i className="fas fa-play text-terracotta"></i> {showOnlyFavorites ? 'FAV READING' : 'FULL READING'}</>
              )}
            </button>
            
            {(isAudioPlaying || isTTSLoading) && (
              <button 
                onClick={stopAudio}
                className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-full bg-white/10 text-terracotta border border-terracotta/30 flex items-center justify-center"
              >
                <i className="fas fa-stop text-xs md:text-base"></i>
              </button>
            )}
          </div>

          <button 
            onClick={() => setShowIrregularModal(true)}
            className="flex-1 sm:flex-none h-10 md:h-16 bg-terracotta hover:bg-terracotta/90 text-white px-4 md:px-8 rounded-xl md:rounded-full text-[9px] md:text-xs font-bold shadow-2xl flex items-center justify-center gap-2 transition-all"
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
              className={`relative px-2 py-2.5 md:px-6 md:py-4 rounded-lg md:rounded-2xl text-[9px] md:text-xs font-black tracking-widest uppercase transition-all duration-300 border-2 ${
                selectedTenseIds.includes(t.id) 
                  ? (primaryTense.id === t.id ? 'bg-white text-black border-white shadow-lg scale-105' : 'bg-white/20 text-white border-white/30') 
                  : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'
              }`}
            >
              {isTenseCached(t.id) && (
                <div className="absolute -top-2 -right-2 w-4 h-4 md:w-6 md:h-6 bg-med-teal text-white rounded-full flex items-center justify-center text-[6px] md:text-[8px] shadow-lg border border-zinc-900">
                  <i className="fas fa-check"></i>
                </div>
              )}
              <div className="flex flex-col items-center gap-1">
                <span className="truncate w-full">{t.id}</span>
                <i 
                  onClick={(e) => toggleTenseFavorite(e, t.id)}
                  className={`fa${isTenseFav(t.id) ? 's' : 'r'} fa-heart text-[8px] transition-colors ${
                    isTenseFav(t.id) ? 'text-terracotta' : 'text-slate-800 hover:text-slate-600'
                  }`}
                ></i>
              </div>
            </button>
          ))}
        </div>
      </nav>

      <div className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-12 items-start">
        <div className="w-full order-1 lg:order-2 lg:col-span-8 scroll-mt-6 md:scroll-mt-10" ref={cardRef}>
          <section className="bg-white/[0.02] border border-white/10 rounded-[1.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
            <div className="p-5 md:p-20 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-10 mb-6 md:mb-14 border-b border-white/5 pb-6 md:pb-12">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2 md:mb-6">
                    <button 
                      onClick={(e) => toggleFavorite(e, primaryTense.id, selectedVerb.name)}
                      className={`text-[10px] md:text-lg transition-colors ${isFav(primaryTense.id, selectedVerb.name) ? 'text-terracotta' : 'text-slate-700 hover:text-slate-500'}`}
                    >
                      <i className={`fa${isFav(primaryTense.id, selectedVerb.name) ? 's' : 'r'} fa-heart`}></i>
                    </button>
                    <span className={`text-[7px] md:text-[10px] font-black px-3 py-1 md:px-5 md:py-2 rounded-full tracking-widest uppercase border ${
                      selectedVerb.isIrregular ? 'text-terracotta border-terracotta/20 bg-terracotta/5' : 'text-med-teal border-med-teal/20 bg-med-teal/5'
                    }`}>
                      {selectedVerb.isIrregular ? 'Irregular' : 'Regular'}
                    </span>
                    {isVerbCached(primaryTense.id, selectedVerb.name) && (
                      <span className="text-amber-400 text-[8px] md:text-[10px] font-black uppercase flex items-center gap-1">
                        <i className="fas fa-bolt"></i> CACHED
                      </span>
                    )}
                  </div>
                  <h2 className="text-4xl sm:text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[1] mb-1 md:mb-4">{selectedVerb.name}</h2>
                  <p className="text-sm md:text-2xl text-slate-500 font-light tracking-tight lowercase">/ {selectedVerb.translation} /</p>
                </div>
                
                <div className="relative group mt-2 md:mt-0">
                   {currentlyPlayingVerb === selectedVerb.name && (
                      <svg className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-[66px] h-[66px] md:w-[128px] md:h-[128px] rotate-[-90deg]">
                        <circle cx="33" cy="33" r="31" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" className="md:hidden" />
                        <circle cx="64" cy="64" r="60" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" className="hidden md:block" />
                        <circle cx="33" cy="33" r="31" fill="transparent" stroke={selectedVerb.isIrregular ? "#e2725b" : "#0d9488"} strokeWidth="2" strokeDasharray="195" strokeDashoffset={195 - (195 * audioProgress) / 100} className="md:hidden" />
                        <circle cx="64" cy="64" r="60" fill="transparent" stroke={selectedVerb.isIrregular ? "#e2725b" : "#0d9488"} strokeWidth="4" strokeDasharray="377" strokeDashoffset={377 - (377 * audioProgress) / 100} className="hidden md:block" />
                      </svg>
                   )}
                   <button 
                    onClick={() => readSingleVerb()}
                    className={`w-16 h-16 md:w-28 md:h-28 rounded-full ${isAudioPlaying && currentlyPlayingVerb === selectedVerb.name ? (isPaused ? 'bg-amber-400 text-black' : 'bg-terracotta text-white') : 'bg-white text-black'} flex items-center justify-center text-xl md:text-3xl hover:scale-105 transition-all shadow-xl relative z-10`}
                  >
                    {isTTSLoading && currentlyPlayingVerb === selectedVerb.name ? <i className="fas fa-spinner animate-spin"></i> : 
                     isAudioPlaying && currentlyPlayingVerb === selectedVerb.name ? (isPaused ? <i className="fas fa-play ml-1"></i> : <i className="fas fa-pause"></i>) : <i className="fas fa-play ml-1"></i>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 md:gap-x-24 gap-y-6 md:gap-y-12">
                {selectedVerb.conjugations.map((c, idx) => (
                  <div key={idx} className="group border-l-2 md:border-l-4 border-white/5 pl-3 md:pl-10 hover:border-terracotta transition-all duration-500">
                    <span className="block text-slate-600 text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.5em] uppercase mb-1 md:mb-4">{c.pronoun}</span>
                    <span className="text-xl sm:text-2xl md:text-6xl font-black tracking-tighter">
                      <HighlightedForm form={c.form} isIrregular={selectedVerb.isIrregular} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="w-full order-2 lg:order-1 lg:col-span-4 space-y-6 md:space-y-12">
          <div className="bg-white/[0.03] border border-white/10 rounded-[1.2rem] md:rounded-[2.5rem] p-5 md:p-10 relative overflow-hidden">
            <h2 className="text-terracotta text-[8px] md:text-[10px] font-black mb-2 tracking-[0.4em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span> INFO
            </h2>
            <h3 className="text-lg md:text-4xl font-black text-white mb-1 md:mb-6">{primaryTense.title}</h3>
            <p className="text-slate-400 text-[10px] md:text-sm font-light leading-relaxed italic border-l border-white/20 pl-4">"{primaryTense.usage}"</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* List for Regulars/Irregulars */}
            {[
              { title: 'REGULARES', verbs: regularVerbs, color: 'med-teal' },
              { title: 'IRREGULARES', verbs: irregularVerbs, color: 'terracotta' }
            ].map(group => group.verbs.length > 0 && (
              <div key={group.title}>
                <div className="flex justify-between items-center mb-3 px-2">
                  <h4 className="text-[9px] md:text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase">{group.title}</h4>
                  <button onClick={() => readCategoryVerbs(group.verbs)} className={`text-${group.color} text-[8px] font-black tracking-widest uppercase`}>READ ALL</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                  {group.verbs.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => { stopAudio(); setSelectedVerb(v); scrollToCard(); }}
                      className={`relative overflow-hidden p-3.5 md:px-8 md:py-5 rounded-xl md:rounded-[1.5rem] text-left transition-all border-2 ${
                        selectedVerb.name === v.name ? `bg-${group.color} text-white border-${group.color}` : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="text-xs md:text-xl font-bold truncate">{v.name}</span>
                          {isVerbCached(primaryTense.id, v.name) && <i className="fas fa-bolt text-[8px] md:text-[10px] text-amber-400"></i>}
                        </div>
                        <div className="flex items-center gap-2">
                          <i 
                            onClick={(e) => toggleFavorite(e, primaryTense.id, v.name)}
                            className={`fa${isFav(primaryTense.id, v.name) ? 's' : 'r'} fa-heart text-[10px] md:text-sm ${isFav(primaryTense.id, v.name) ? 'text-white' : 'text-slate-600 hover:text-slate-400'}`}
                          ></i>
                          {currentlyPlayingVerb === v.name && <WaveformIndicator color="bg-white" isPaused={isPaused} />}
                        </div>
                      </div>
                      {currentlyPlayingVerb === v.name && <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all" style={{width: `${audioProgress}%`}}></div>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-16 py-8 text-slate-700 text-center w-full border-t border-white/5">
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://heroyik.github.io" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-xl"><i className="fas fa-home"></i></a>
          <a href="https://github.com/heroyik/vozviva" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-xl"><i className="fab fa-github"></i></a>
        </div>
        <p className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-500 mb-3">VOZVIVA Linguistica</p>
        <p className="text-[8px] font-medium opacity-20">Optimized for Mobile Linguistic Mastery.</p>
      </footer>
    </div>
  );
};

export default App;
