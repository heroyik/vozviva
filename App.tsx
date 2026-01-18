
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Tense, TenseData, Verb } from './types';
import { SPANISH_VERB_DATA } from './constants';
import { GoogleGenAI, Modality } from '@google/genai';

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

const App: React.FC = () => {
  const [selectedTense, setSelectedTense] = useState<TenseData>(SPANISH_VERB_DATA[0]);
  const [selectedVerb, setSelectedVerb] = useState<Verb>(SPANISH_VERB_DATA[0].verbs[0]);
  const [showIrregularModal, setShowIrregularModal] = useState(false);
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [currentlyPlayingVerb, setCurrentlyPlayingVerb] = useState<string | null>(null);
  
  const audioContext = useRef<AudioContext | null>(null);
  // 동사별 오디오 캐시 (Key: "tenseId-verbName", Value: AudioBuffer)
  const audioCache = useRef<Map<string, AudioBuffer>>(new Map());
  const abortController = useRef<AbortController | null>(null);

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

  // 특정 동사의 오디오 가져오기 (캐시 우선 확인)
  const getVerbAudio = async (tense: TenseData, verb: Verb): Promise<AudioBuffer | null> => {
    const cacheKey = `${tense.id}-${verb.name}`;
    if (audioCache.current.has(cacheKey)) {
      return audioCache.current.get(cacheKey)!;
    }

    // API를 통해 스크립트 생성
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
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Charon' },
            },
          },
        },
      });

      const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
      if (audioPart?.inlineData?.data) {
        initAudio();
        const buffer = await decodeAudioData(decode(audioPart.inlineData.data), audioContext.current!, 24000, 1);
        audioCache.current.set(cacheKey, buffer);
        return buffer;
      }
    } catch (err) {
      console.error(`TTS Error for ${verb.name}:`, err);
    }
    return null;
  };

  // 단일 오디오 재생
  const playBuffer = (buffer: AudioBuffer): Promise<void> => {
    return new Promise((resolve) => {
      initAudio();
      const source = audioContext.current!.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.current!.destination);
      source.onended = () => resolve();
      source.start();
    });
  };

  // 동사 하나 읽기
  const readSingleVerb = async (verb: Verb = selectedVerb) => {
    if (isTTSLoading) return;
    setIsTTSLoading(true);
    setCurrentlyPlayingVerb(verb.name);
    
    const buffer = await getVerbAudio(selectedTense, verb);
    if (buffer) {
      await playBuffer(buffer);
    }
    
    setCurrentlyPlayingVerb(null);
    setIsTTSLoading(false);
  };

  // 카테고리(정규/불규칙) 전체 순차 재생
  const readCategoryVerbs = async (categoryName: string, verbs: Verb[]) => {
    if (isTTSLoading) {
      // 이미 재생 중이면 중단 로직 (선택사항)
      return;
    }
    
    setIsTTSLoading(true);
    for (const verb of verbs) {
      setCurrentlyPlayingVerb(verb.name);
      const buffer = await getVerbAudio(selectedTense, verb);
      if (buffer) {
        await playBuffer(buffer);
        // 동사 사이의 아주 짧은 간격
        await new Promise(r => setTimeout(r, 500));
      }
    }
    setCurrentlyPlayingVerb(null);
    setIsTTSLoading(false);
  };

  // 모든 시제 통합 읽기는 너무 방대하므로 현재 선택된 시제의 모든 동사 읽기로 대체하거나 유지
  const readCurrentTenseAll = async () => {
    await readCategoryVerbs('All', selectedTense.verbs);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-5xl mx-auto pb-20">
      {/* Header */}
      <header className="w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            VozViva
          </h1>
          <p className="text-slate-400 font-medium tracking-tight">원어민의 완벽한 리듬으로 깨어나는 스페인어 시제 감각</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={readCurrentTenseAll}
            disabled={isTTSLoading}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold border border-emerald-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isTTSLoading && !currentlyPlayingVerb ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-volume-up"></i>}
            현재 시제 전체 읽기
          </button>
          <button 
            onClick={() => setShowIrregularModal(true)}
            className="bg-slate-700 hover:bg-slate-600 text-amber-200 px-5 py-2.5 rounded-full text-sm font-semibold border border-amber-500/30 flex items-center gap-2 transition-all"
          >
            <i className="fas fa-book"></i> 불규칙 동사 사전
          </button>
        </div>
      </header>

      {/* Tense Selection */}
      <section className="w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-amber-200 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-xs">1</span>
          시제 선택
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {SPANISH_VERB_DATA.map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelectedTense(t); setSelectedVerb(t.verbs[0]); }}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedTense.id === t.id 
                  ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-500/50' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>
        <div className="mt-4 p-3 bg-slate-900/30 rounded-lg border border-slate-700/50">
          <p className="text-sm font-semibold text-amber-100 mb-1">{selectedTense.title}</p>
          <p className="text-xs text-slate-400 italic">"{selectedTense.usage}"</p>
        </div>
      </section>

      {/* Verb Selection (Categorized) */}
      <section className="w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-slate-700 overflow-hidden">
        <h2 className="text-lg font-semibold mb-6 text-amber-200 flex items-center gap-2 border-b border-slate-700 pb-4">
          <span className="w-6 h-6 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center text-xs font-bold">2</span>
          동사 선택
        </h2>
        
        <div className="space-y-8">
          {regularVerbs.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  REGULAR
                </h3>
                <button 
                  onClick={() => readCategoryVerbs('Regular', regularVerbs)}
                  disabled={isTTSLoading}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 disabled:opacity-50"
                >
                  {isTTSLoading && currentlyPlayingVerb ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-play-circle"></i>}
                  전체 읽기
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {regularVerbs.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVerb(v)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 border w-full text-center relative overflow-hidden ${
                      selectedVerb.name === v.name 
                        ? 'bg-emerald-600 text-white shadow-lg border-emerald-500 ring-2 ring-emerald-500/30' 
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border-slate-700'
                    }`}
                  >
                    <span className="truncate">{v.name}</span>
                    {currentlyPlayingVerb === v.name && (
                      <div className="absolute inset-0 bg-emerald-400/20 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {irregularVerbs.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  IRREGULAR
                </h3>
                <button 
                  onClick={() => readCategoryVerbs('Irregular', irregularVerbs)}
                  disabled={isTTSLoading}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 disabled:opacity-50"
                >
                  {isTTSLoading && currentlyPlayingVerb ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-play-circle"></i>}
                  전체 읽기
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {irregularVerbs.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVerb(v)}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 border w-full text-center relative overflow-hidden ${
                      selectedVerb.name === v.name 
                        ? 'bg-amber-600 text-white shadow-lg border-amber-500 ring-2 ring-emerald-500/30' 
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border-slate-700'
                    }`}
                  >
                    <span className="truncate">{v.name}</span>
                    <i className="fas fa-star text-amber-400 text-[10px] flex-shrink-0"></i>
                    {currentlyPlayingVerb === v.name && (
                      <div className="absolute inset-0 bg-amber-400/20 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Interaction Area - Simplified to only Table */}
      <div className="w-full max-w-2xl mx-auto">
        {/* Table Display */}
        <section className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
          <div className="bg-slate-800 p-5 border-b border-slate-700 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-bold text-amber-400 text-2xl">{selectedVerb.name}</span>
              <span className="text-sm text-slate-500 font-medium">{selectedVerb.translation}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => readSingleVerb()}
                disabled={isTTSLoading}
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 flex items-center justify-center transition-all disabled:opacity-50 shadow-lg"
              >
                {isTTSLoading && currentlyPlayingVerb === selectedVerb.name ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-play"></i>}
              </button>
              {selectedVerb.isIrregular && (
                <span className="bg-red-500/20 text-red-400 text-[10px] px-3 py-1 rounded-full font-black border border-red-500/30 tracking-wider">
                  IRREGULAR
                </span>
              )}
            </div>
          </div>
          <div className="p-2">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50 text-[11px] text-slate-500 uppercase tracking-[0.2em]">
                  <th className="px-8 py-4">Pronoun</th>
                  <th className="px-8 py-4">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {selectedVerb.conjugations.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5 text-slate-400 text-sm font-medium">{c.pronoun}</td>
                    <td className="px-8 py-5 text-emerald-400 font-black text-xl tracking-tight group-hover:text-emerald-300 transition-colors">
                      {c.form}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Irregular Verbs Dictionary Modal */}
      {showIrregularModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowIrregularModal(false)}></div>
          <div className="relative bg-slate-800 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl border border-slate-700 flex flex-col">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <div>
                <h2 className="text-2xl font-bold text-amber-400">Irregular Verbs Dictionary</h2>
                <p className="text-sm text-slate-400">현재 앱에 수록된 모든 불규칙 동사 변화표입니다.</p>
              </div>
              <button 
                onClick={() => setShowIrregularModal(false)}
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
              <div className="grid sm:grid-cols-2 gap-4">
                {allIrregularVerbs.map((v, i) => (
                  <div key={i} className="bg-slate-800 rounded-2xl border border-slate-700 p-5 hover:border-amber-500/30 transition-all flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-white">{v.name}</h4>
                        <p className="text-xs text-slate-500">{v.translation}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                        {v.tenseId}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 flex-1">
                      {v.conjugations.map((c, ci) => (
                        <div key={ci} className="flex flex-col">
                          <span className="text-[10px] text-slate-500">{c.pronoun}</span>
                          <span className="text-sm font-semibold text-emerald-400">{c.form}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700 text-center bg-slate-800/50">
              <p className="text-xs text-slate-500">불규칙 동사는 원어민의 소리를 반복적으로 따라하는 것이 가장 효과적입니다.</p>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-12 py-8 text-slate-500 text-sm text-center border-t border-slate-800 w-full">
        <div className="flex justify-center gap-6 mb-4">
          <a href="https://heroyik.github.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
            <i className="fas fa-house text-xl"></i>
          </a>
          <a href="https://github.com/heroyik/vozviva" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">
            <i className="fab fa-github text-xl"></i>
          </a>
        </div>
        <p>© 2026 VozViva - Professional Spanish Mastery</p>
      </footer>
    </div>
  );
};

export default App;
