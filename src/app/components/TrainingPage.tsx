import { useState, useEffect, useRef } from 'react';
import RLAIFPromptBank from './RLAIFPromptBank';

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState<'pretraining' | 'rlaif'>('pretraining');
  const [step, setStep] = useState(0);
  const [loss, setLoss] = useState<number | null>(null);
  const [tokens, setTokens] = useState<string[]>([]);
  const [vocab, setVocab] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [learningRate, setLearningRate] = useState(0.20);
  const [currentToken, setCurrentToken] = useState<string>('—');
  const [targetToken, setTargetToken] = useState<string>('—');
  const [topPredictions, setTopPredictions] = useState<Array<{ tok: string; p: number }>>([]);
  const [heatmapData, setHeatmapData] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [textInput, setTextInput] = useState('the cat sat on the mat and the cat saw the mat');
  
  const weightsRef = useRef<number[][]>([]);
  const stoiRef = useRef<Map<string, number>>(new Map());
  const itosRef = useRef<string[]>([]);

  const softmax = (arr: number[]) => {
    const m = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - m));
    const s = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / s);
  };

  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

  const randn = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const tokenize = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean);
  };

  const buildVocab = (toks: string[]) => {
    const set = Array.from(new Set(toks));
    set.sort();
    return set;
  };

  const initModel = () => {
    setStep(0);
    const toks = tokenize(textInput);
    const v = buildVocab(toks);
    
    const stoi = new Map(v.map((t, i) => [t, i]));
    const itos = v.slice();
    
    stoiRef.current = stoi;
    itosRef.current = itos;
    
    const V = v.length;
    weightsRef.current = Array.from({ length: V }, () => 
      Array.from({ length: V }, () => 0.01 * randn())
    );
    
    setTokens(toks);
    setVocab(v);
    setCurrentIdx(0);
    setIsInitialized(toks.length >= 2);
    
    updateDisplay(0, toks, stoi, itos);
  };

  const getExample = (i: number, toks: string[], stoi: Map<string, number>) => {
    const xTok = toks[i];
    const yTok = toks[i + 1];
    return { xTok, yTok, x: stoi.get(xTok)!, y: stoi.get(yTok)! };
  };

  const forward = (x: number) => {
    const logits = weightsRef.current[x].slice();
    const probs = softmax(logits);
    return { logits, probs };
  };

  const lossNLL = (probs: number[], y: number) => {
    const p = Math.max(1e-9, probs[y]);
    return -Math.log(p);
  };

  const updateDisplay = (idx: number, toks: string[], stoi: Map<string, number>, itos: string[]) => {
    if (toks.length < 2) return;
    
    const ex = getExample(idx, toks, stoi);
    const { logits, probs } = forward(ex.x);
    const L = lossNLL(probs, ex.y);
    
    setLoss(L);
    setCurrentToken(ex.xTok);
    setTargetToken(ex.yTok);
    
    const pairs = probs.map((p, i) => ({ tok: itos[i], p }))
      .sort((a, b) => b.p - a.p)
      .slice(0, 6);
    setTopPredictions(pairs);
    
    setHeatmapData(logits.slice(0, 60));
  };

  const trainStep = () => {
    if (!isInitialized) return;
    
    const ex = getExample(currentIdx, tokens, stoiRef.current);
    const { probs } = forward(ex.x);
    
    const grad = probs.map((p, j) => p - (j === ex.y ? 1 : 0));
    
    for (let j = 0; j < grad.length; j++) {
      weightsRef.current[ex.x][j] -= learningRate * grad[j];
    }
    
    setStep(s => s + 1);
    
    const newIdx = (currentIdx + 1) % (tokens.length - 1);
    setCurrentIdx(newIdx);
    updateDisplay(newIdx, tokens, stoiRef.current, itosRef.current);
  };

  const trainMany = (n: number) => {
    for (let i = 0; i < n; i++) {
      trainStep();
    }
  };

  const reset = () => {
    setTextInput('the cat sat on the mat and the cat saw the mat');
    setTimeout(initModel, 0);
  };

  useEffect(() => {
    initModel();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      updateDisplay(currentIdx, tokens, stoiRef.current, itosRef.current);
    }
  }, [currentIdx]);

  return (
    <div className={activeTab === 'rlaif' ? 'bg-[#0b0b0c] min-h-screen' : ''}>
      {/* Tab Navigation */}
      <div className={`max-w-[1200px] mx-auto px-5 pt-5 pb-3 ${activeTab === 'rlaif' ? '' : 'bg-white'}`}>
        <div className={`flex gap-2 border-b ${activeTab === 'rlaif' ? 'border-white/10' : 'border-gray-300'}`}>
          <button
            onClick={() => setActiveTab('pretraining')}
            className={`py-2.5 px-5 text-sm border-b-2 transition-colors ${
              activeTab === 'pretraining'
                ? 'border-gray-900 text-gray-900'
                : activeTab === 'rlaif' 
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pretraining Visualizer
          </button>
          <button
            onClick={() => setActiveTab('rlaif')}
            className={`py-2.5 px-5 text-sm border-b-2 transition-colors ${
              activeTab === 'rlaif'
                ? 'border-yellow-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            RLAIF Prompt Bank
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'pretraining' ? (
        <div className="max-w-[980px] mx-auto p-5 border border-gray-300 rounded-2xl bg-white mt-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg m-0">Pretraining Visualizer (simulation)</h2>
              <div className="text-gray-600 text-[13px]">
                Shows how numbers (logits, probs, loss, weights) shift as the model "learns" token-by-token.
              </div>
            </div>
            <div className="inline-flex gap-2 items-center py-1.5 px-2.5 border border-gray-300 rounded-full text-[13px] bg-white">
              <span>Step</span>
              <strong>{step}</strong>
              <span>•</span>
              <span>Loss</span>
              <strong>{loss !== null ? loss.toFixed(3) : '—'}</strong>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 items-center">
            <button 
              onClick={initModel}
              className="border border-gray-300 bg-gray-900 text-white rounded-full py-2 px-3 cursor-pointer"
            >
              Initialize model
            </button>
            <button 
              onClick={() => trainStep()}
              disabled={!isInitialized}
              className="border border-gray-300 bg-white text-gray-900 rounded-full py-2 px-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Train 1 step
            </button>
            <button 
              onClick={() => trainMany(50)}
              disabled={!isInitialized}
              className="border border-gray-300 bg-white text-gray-900 rounded-full py-2 px-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Train 50 steps
            </button>
            <button 
              onClick={reset}
              className="border border-gray-300 bg-white text-gray-900 rounded-full py-2 px-3 cursor-pointer"
            >
              Reset
            </button>

            <span className="inline-flex gap-2 items-center py-1.5 px-2.5 border border-gray-300 rounded-full text-[13px] bg-white">
              Learning rate <code className="bg-gray-100 px-1.5 py-0.5 rounded-lg">{learningRate.toFixed(2)}</code>
            </span>
            <input 
              type="range" 
              min="0.01" 
              max="0.5" 
              step="0.01" 
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-[220px]"
            />

            <span className="inline-flex gap-2 items-center py-1.5 px-2.5 border border-gray-300 rounded-full text-[13px] bg-white">
              Context index <code className="bg-gray-100 px-1.5 py-0.5 rounded-lg">{currentIdx}</code>
            </span>
            <input 
              type="range" 
              min="0" 
              max={Math.max(0, tokens.length - 2)}
              step="1" 
              value={currentIdx}
              onChange={(e) => setCurrentIdx(parseInt(e.target.value))}
              disabled={!isInitialized}
              className="w-[220px]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-3.5 mt-3">
            <div className="border border-gray-300 rounded-2xl p-3 bg-white">
              <div className="text-gray-600 text-[13px]">Training text (space-split tokens; educational)</div>
              <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full min-h-[120px] resize-y border border-gray-300 rounded-xl p-2.5 text-sm mt-2"
              />

              <div className="mt-2.5 text-gray-600 text-[13px]">
                Token stream (current token highlighted, target-next token tinted green)
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2 leading-normal">
                {tokens.map((tok, i) => (
                  <span 
                    key={i}
                    className={`py-0.5 px-1.5 rounded-full border text-[13px] ${
                      i === currentIdx 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : i === currentIdx + 1
                        ? 'bg-green-100 border-green-400'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {tok}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-600 mt-2">
                This demo uses a tiny decoder-like objective: predict the <em>next</em> token from the current token using learnable weights,
                so you can see probabilities and weights update. It's not full multi-layer self-attention, but it mirrors the same training loop: logits → softmax → loss → gradient update.
              </div>
            </div>

            <div className="border border-gray-300 rounded-2xl p-3 bg-white">
              <div className="text-gray-600 text-[13px]">Numbers changing as the model updates</div>

              <div className="grid grid-cols-[120px_1fr] gap-1.5 text-[13px] mt-2.5">
                <div className="text-gray-600">Vocab size</div>
                <div>{vocab.length || '—'}</div>
                <div className="text-gray-600">Current token</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded-lg">{currentToken}</code></div>
                <div className="text-gray-600">Target next</div>
                <div><code className="bg-gray-100 px-1.5 py-0.5 rounded-lg">{targetToken}</code></div>
              </div>

              <div className="text-gray-600 text-[13px] mt-3">Top predicted next tokens (softmax)</div>
              <div className="flex flex-col gap-1.5 mt-2">
                {topPredictions.map((item, i) => (
                  <div key={i} className="grid grid-cols-[90px_1fr_70px] gap-2 items-center text-[13px]">
                    <div>{item.tok}</div>
                    <div className="h-2.5 rounded-full bg-gray-100 border border-gray-300 overflow-hidden">
                      <div 
                        className="h-full bg-gray-900"
                        style={{ width: `${(item.p * 100).toFixed(1)}%` }}
                      />
                    </div>
                    <div className="text-right">{(item.p * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>

              <div className="text-gray-600 text-[13px] mt-3">Weight row (for current token) heatmap</div>
              <div className="grid grid-cols-12 gap-0.5 mt-2">
                {heatmapData.map((val, i) => {
                  const min = Math.min(...heatmapData);
                  const max = Math.max(...heatmapData);
                  const denom = (max - min) || 1;
                  const v = (val - min) / denom;
                  const g = Math.round(245 - 160 * clamp01(v));
                  
                  return (
                    <div 
                      key={i}
                      className="aspect-square rounded border border-gray-300"
                      style={{ background: `rgb(${g},${g},${g})` }}
                      title={`${itosRef.current[i]} weight=${val.toFixed(3)}`}
                    />
                  );
                })}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Each square is one weight toward a vocab token (darker = larger). Training nudges the "correct-next-token" weight up, others down.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <RLAIFPromptBank />
      )}
    </div>
  );
}