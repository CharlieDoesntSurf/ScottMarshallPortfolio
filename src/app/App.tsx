import { useRef, useState } from 'react';
import TrainingPage from './components/TrainingPage';
import LayerNormSection from './components/LayerNormSection';
import MultiHeadAttentionSection from './components/MultiHeadAttentionSection';
import FeedForwardSection from './components/FeedForwardSection';
import ResidualConnectionSection from './components/ResidualConnectionSection';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'overview' | 'training'>('overview');
  const promptRef = useRef<HTMLDivElement>(null);
  const tokenizerRef = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<HTMLDivElement>(null);
  const embeddingRef = useRef<HTMLDivElement>(null);
  const layerNormRef = useRef<HTMLDivElement>(null);
  const attentionRef = useRef<HTMLDivElement>(null);
  const ffnRef = useRef<HTMLDivElement>(null);
  const residualRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (currentPage === 'training') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto mb-8">
          <button 
            onClick={() => setCurrentPage('overview')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>←</span>
            <span>Back to Overview</span>
          </button>
        </div>
        <TrainingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Overview Section - Dark */}
      <div 
        className="min-h-screen py-12 px-6 flex flex-col items-center"
        style={{
          background: `radial-gradient(1200px 600px at 50% 20%, rgba(124,92,255,.08), transparent 70%),
                       radial-gradient(800px 500px at 80% 80%, rgba(45,212,191,.06), transparent 60%),
                       var(--bg)`
        }}
      >
        <div className="max-w-[1600px] w-full">
          <Header onNavigateToTraining={() => setCurrentPage('training')} />
          
          <div className="mt-16 relative">
            {/* Main flow line */}
            <div className="absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--gpt-accent)]/30 via-50% via-[var(--gpt-accent2)]/30 to-transparent hidden lg:block" />
            
            {/* Flow sections */}
            <div className="grid grid-cols-1 lg:grid-cols-9 gap-12 lg:gap-2.5 relative">
              <div onClick={() => scrollToSection(promptRef)} className="cursor-pointer">
                <InputSection />
              </div>
              <div onClick={() => scrollToSection(tokenizerRef)} className="cursor-pointer">
                <TokenizerSection />
              </div>
              <div onClick={() => scrollToSection(transformerRef)} className="cursor-pointer">
                <TransformerSection />
              </div>
              <div onClick={() => scrollToSection(embeddingRef)} className="cursor-pointer">
                <EmbeddingOverviewSection />
              </div>
              <div onClick={() => scrollToSection(layerNormRef)} className="cursor-pointer">
                <LayerNormOverviewSection />
              </div>
              <div onClick={() => scrollToSection(attentionRef)} className="cursor-pointer">
                <AttentionOverviewSection />
              </div>
              <div onClick={() => scrollToSection(ffnRef)} className="cursor-pointer">
                <FeedForwardOverviewSection />
              </div>
              <div onClick={() => scrollToSection(residualRef)} className="cursor-pointer">
                <ResidualConnectionOverviewSection />
              </div>
              <div onClick={() => scrollToSection(outputRef)} className="cursor-pointer">
                <OutputSection />
              </div>
            </div>

            {/* Connection arrows for desktop */}
            <div className="hidden lg:block">
              <ConnectionArrow position="left-[10%]" />
              <ConnectionArrow position="left-[21%]" />
              <ConnectionArrow position="left-[32.5%]" />
              <ConnectionArrow position="left-[43.5%]" />
              <ConnectionArrow position="left-[54.5%]" />
              <ConnectionArrow position="left-[65.5%]" />
              <ConnectionArrow position="left-[76.5%]" />
              <ConnectionArrow position="left-[88%]" />
            </div>
          </div>

          <div className="mt-12 text-center text-[var(--text-muted)] text-sm">
            Click any section to explore in detail ↓
          </div>
        </div>
      </div>

      {/* Detailed Sections - Light */}
      <div ref={promptRef}>
        <PromptDetailSection scrollToNext={() => scrollToSection(tokenizerRef)} />
      </div>
      
      <div ref={tokenizerRef}>
        <TokenizerDetailSection scrollToNext={() => scrollToSection(transformerRef)} />
      </div>
      
      <div ref={transformerRef}>
        <TransformerDetailSection scrollToNext={() => scrollToSection(embeddingRef)} />
      </div>
      
      <div ref={embeddingRef}>
        <EmbeddingStageSection scrollToNext={() => scrollToSection(layerNormRef)} />
      </div>
      
      <div ref={layerNormRef}>
        <LayerNormSection scrollToNext={() => scrollToSection(attentionRef)} />
      </div>
      
      <div ref={attentionRef}>
        <MultiHeadAttentionSection scrollToNext={() => scrollToSection(ffnRef)} />
      </div>
      
      <div ref={ffnRef}>
        <FeedForwardSection scrollToNext={() => scrollToSection(residualRef)} />
      </div>
      
      <div ref={residualRef}>
        <ResidualConnectionSection scrollToNext={() => scrollToSection(outputRef)} />
      </div>
      
      <div ref={outputRef}>
        <OutputDetailSection />
      </div>
    </div>
  );
}

function Header({ onNavigateToTraining }: { onNavigateToTraining: () => void }) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--stroke)] bg-white/[0.02] mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--gpt-accent)] animate-pulse" />
        <span className="text-xs tracking-wider uppercase text-[var(--text-muted)]">System Architecture</span>
      </div>
      
      <h1 className="text-4xl lg:text-5xl tracking-tight mb-4" style={{ fontWeight: 600 }}>
        GPT Model Pipeline
      </h1>
      
      <p className="text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto">
        End-to-end data flow from text input through neural transformation to generated output
      </p>

      <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
        <LegendItem color="var(--gpt-accent)" label="Self-Attention" />
        <LegendItem color="var(--gpt-accent2)" label="Feed-Forward" />
        <LegendItem color="#6b7280" label="Processing" />
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={onNavigateToTraining}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--gpt-accent)] text-white hover:bg-[var(--gpt-accent)]/80 transition-colors text-sm"
        >
          <span>View Training Visualizer</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-0.5 rounded-full" style={{ background: color }} />
      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide">{label}</span>
    </div>
  );
}

function ConnectionArrow({ position }: { position: string }) {
  return (
    <div className="absolute top-32 -translate-y-1/2" style={{ left: position }}>
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="opacity-60">
        <path d="M0 10 L30 10 M30 10 L25 5 M30 10 L25 15" stroke="url(#gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gpt-accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--gpt-accent2)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function InputSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-[var(--gpt-accent)]/10 border border-[var(--gpt-accent)]/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-[var(--gpt-accent)]">Input</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Prompt Interface</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[var(--gpt-accent)]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[var(--gpt-accent)]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[var(--gpt-accent)]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[var(--gpt-accent)]" />
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] shadow-lg shadow-[var(--gpt-accent)]/50" />
              <div className="bg-black/40 border border-[var(--stroke)] rounded p-3 text-xs leading-relaxed font-mono text-[var(--text)]">
                "Explain how a transformer..."
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--gpt-accent)] to-transparent" />
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">API</span>
              <div className="flex-1 h-px bg-gradient-to-l from-[var(--gpt-accent2)] to-transparent" />
            </div>
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Text Input
      </div>
    </div>
  );
}

function TokenizerSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-[var(--gpt-accent2)]/10 border border-[var(--gpt-accent2)]/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-[var(--gpt-accent2)]">Encoder</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Tokenizer</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
          
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[var(--gpt-accent2)]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[var(--gpt-accent2)]" />
          
          <div className="grid grid-cols-3 gap-1.5 mb-4">
            {['Ex', 'plain', ' how', ' a', 'trans', 'form', 'er', ' block', ' works'].map((token, idx) => (
              <div 
                key={idx}
                className="bg-[var(--gpt-accent2)]/5 border border-[var(--gpt-accent2)]/30 rounded px-2 py-1.5 text-center font-mono"
                style={{ fontSize: '10px' }}
              >
                {token}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
            <span>9 tokens</span>
            <span>→ IDs</span>
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent2)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent2)]/50 hidden lg:block" />
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Token IDs
      </div>
    </div>
  );
}

function TransformerSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-[var(--gpt-accent)]/10 border border-[var(--gpt-accent)]/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-[var(--gpt-accent)]">Core</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Transformer Block</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent2)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent2)]/50 hidden lg:block" />
          
          <div className="space-y-2">
            <ProcessBlock label="Input" sublabel="Embeddings" compact />
            <FlowLine />
            <ProcessBlock label="LayerNorm" sublabel="Normalize" compact />
            <FlowLine />
            <ProcessBlock label="Self-Attention" sublabel="Multi-Head" accent="purple" highlight compact />
            <FlowLine dashed />
            <ProcessBlock label="Residual +" sublabel="Skip" compact />
            <FlowLine />
            <ProcessBlock label="Feed-Forward" sublabel="MLP" accent="teal" highlight compact />
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--stroke)] text-[9px] text-[var(--text-muted)] text-center">
            × N layers
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Transformed
      </div>
    </div>
  );
}

function OutputSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-yellow-400">Decoder</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Generation</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
          
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-yellow-500/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-yellow-500/50" />
          
          <div className="space-y-3">
            <OutputStep num={1} label="Logits" desc="Score" />
            <OutputStep num={2} label="Sample" desc="Temp" />
            <OutputStep num={3} label="Decode" desc="Text" />
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Text Output
      </div>
    </div>
  );
}

function ProcessBlock({ label, sublabel, accent, highlight, compact }: { label: string; sublabel: string; accent?: 'purple' | 'teal'; highlight?: boolean; compact?: boolean }) {
  const borderColor = accent === 'purple' ? 'var(--gpt-accent)' : accent === 'teal' ? 'var(--gpt-accent2)' : 'var(--stroke)';
  const bgColor = accent === 'purple' ? 'rgba(124,92,255,.08)' : accent === 'teal' ? 'rgba(45,212,191,.08)' : 'rgba(0,0,0,.3)';
  
  return (
    <div 
      className={`relative flex items-center justify-between rounded border ${compact ? 'px-2 py-1.5' : 'px-3 py-2'}`}
      style={{ 
        borderColor: highlight ? borderColor : 'var(--stroke)',
        background: highlight ? bgColor : 'rgba(0,0,0,.2)'
      }}
    >
      {highlight && (
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full" style={{ background: borderColor }} />
      )}
      <span className={compact ? 'text-[10px]' : 'text-[11px] tracking-wide'}>{label}</span>
      <span className={`text-[9px] text-[var(--text-muted)] uppercase ${compact ? '' : ''}`}>{sublabel}</span>
    </div>
  );
}

function FlowLine({ dashed }: { dashed?: boolean }) {
  return (
    <div className="flex justify-center">
      <div className={`w-px h-3 ${dashed ? 'border-l border-dashed border-[var(--stroke)]' : 'bg-[var(--stroke)]'}`} />
    </div>
  );
}

function OutputStep({ num, label, desc }: { num: number; label: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded border border-yellow-500/40 bg-yellow-500/10 flex items-center justify-center text-[10px] text-yellow-300">
        {num}
      </div>
      <div className="flex-1 flex items-center justify-between">
        <span className="text-[11px] tracking-wide">{label}</span>
        <span className="text-[9px] text-[var(--text-muted)] uppercase">{desc}</span>
      </div>
    </div>
  );
}

// DETAILED SECTIONS (Light theme)

function PromptDetailSection({ scrollToNext }: { scrollToNext: () => void }) {
  return (
    <section className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="inline-block px-4 py-2 rounded-md bg-purple-100 border border-purple-300 mb-4">
            <span className="text-xs uppercase tracking-widest text-purple-700">01 — Input</span>
          </div>
          <h2 className="text-5xl mb-6 text-gray-900">Prompt Interface</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            The entry point where natural language prompts are received from the client application and transmitted to the model server via API.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 border-2 border-gray-900 rounded-2xl p-8">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">User Input</h3>
            <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
              <p className="text-gray-900 leading-relaxed">
                "Explain how a transformer block works in a GPT model."
              </p>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">→</div>
                <div>
                  <strong className="text-gray-900">Plain text format</strong>
                  <p className="text-gray-600">Human-readable natural language input</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">→</div>
                <div>
                  <strong className="text-gray-900">Variable length</strong>
                  <p className="text-gray-600">Can be single sentence or multiple paragraphs</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-2 border-gray-900 rounded-2xl p-8">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">API Connection</h3>
            
            <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg mb-6">
              <div>POST /v1/chat/completions</div>
              <div className="text-gray-500 mt-2">{'{'}</div>
              <div className="text-gray-500 ml-4">"model": "gpt-4",</div>
              <div className="text-gray-500 ml-4">"messages": [...],</div>
              <div className="text-gray-500 ml-4">"temperature": 0.7</div>
              <div className="text-gray-500">{'}'}</div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Protocol</span>
                <strong className="text-gray-900">HTTPS / REST</strong>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Format</span>
                <strong className="text-gray-900">JSON</strong>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Authentication</span>
                <strong className="text-gray-900">API Key</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={scrollToNext}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <span>Next: Tokenizer</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function TokenizerDetailSection({ scrollToNext }: { scrollToNext: () => void }) {
  return (
    <section 
      className="min-h-screen py-20 px-6"
      style={{
        background: `radial-gradient(1200px 600px at 50% 20%, rgba(124,92,255,.08), transparent 70%),
                     radial-gradient(800px 500px at 80% 80%, rgba(45,212,191,.06), transparent 60%),
                     var(--bg)`
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-2 rounded-md bg-[var(--gpt-accent2)]/10 border border-[var(--gpt-accent2)]/30 mb-4">
            <span className="text-xs uppercase tracking-widest text-[var(--gpt-accent2)]">02 — Encoder</span>
          </div>
          <h2 className="text-5xl mb-6 text-[var(--text)]">Tokenizer</h2>
          <p className="text-xl text-[var(--text-muted)] leading-relaxed max-w-3xl mx-auto">
            Converts raw text into discrete tokens and maps them to numerical IDs that the neural network can process.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Prompt */}
          <div className="bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-2xl p-8">
            <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-6">Input Prompt</h3>
            <div className="bg-black/40 border border-[var(--stroke)] rounded-lg p-6 font-mono text-sm text-[var(--text)] leading-relaxed">
              <div className="text-[var(--gpt-accent2)]">prompt = (</div>
              <div className="ml-4 text-[var(--text)]">
                "Today I want to understand how a GPT style model turns my sentence into "
              </div>
              <div className="ml-4 text-[var(--text)]">
                "tokens, embeddings, attention patterns, and finally predicts the next word "
              </div>
              <div className="ml-4 text-[var(--text)]">
                "for learning and debugging my own."
              </div>
              <div className="text-[var(--gpt-accent2)]">)</div>
            </div>
          </div>

          {/* Middle: Tokenizer Config */}
          <div className="bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-2xl p-8">
            <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-6">Tokenizer Config</h3>
            <div className="bg-black/40 border border-[var(--stroke)] rounded-lg p-6 font-mono text-xs text-[var(--text)] leading-relaxed overflow-y-auto max-h-[400px]">
              <div className="text-[var(--gpt-accent)]">{'{'}</div>
              <div className="ml-2 text-[var(--text-muted)]">"version": "1.0",</div>
              <div className="ml-2 text-[var(--text-muted)]">"model": {'{'}</div>
              <div className="ml-4 text-[var(--text)]">"type": "BPE",</div>
              <div className="ml-4 text-[var(--text)]">"vocab": {'{'}</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"!": 0,</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"\"": 1,</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"#": 2,</div>
              <div className="ml-6 text-[var(--text-muted)]">...</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"Ġt": 256,</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"Ġa": 257,</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"he": 258,</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"in": 259,</div>
              <div className="ml-6 text-[var(--text-muted)]">...</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"Ġthe": 262,</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"Ġwant": 765,</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"Ġtoday": 10708,</div>
              <div className="ml-6 text-[var(--text-muted)]">...</div>
              <div className="ml-6 text-[var(--gpt-accent2)]">"&lt;|endoftext|&gt;": 50256</div>
              <div className="ml-4 text-[var(--text)]">{'}'}</div>
              <div className="ml-2 text-[var(--text-muted)]">{'}'}</div>
              <div className="text-[var(--gpt-accent)]">{'}'}</div>
              
              <div className="mt-4 pt-4 border-t border-[var(--stroke)] text-[var(--text-muted)]">
                <div className="mb-2">// Byte-Pair Encoding</div>
                <div className="mb-1">• Vocabulary: ~50,257 tokens</div>
                <div className="mb-1">• Special tokens: &lt;|endoftext|&gt;</div>
                <div>• Subword units with Ġ prefix</div>
              </div>
            </div>
          </div>

          {/* Right: Tokenized Output */}
          <div className="bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-2xl p-8">
            <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)] mb-6">Tokenized Output</h3>
            <div className="bg-black/40 border border-[var(--stroke)] rounded-lg p-6 font-mono text-xs text-[var(--text)] leading-relaxed overflow-y-auto max-h-[400px]">
              <div className="text-[var(--text-muted)] mb-2">Preview: position | token_id | token | 16-bit embedding</div>
              <div className="space-y-0.5">
                <div className="text-[var(--gpt-accent2)]">   0 |   10708 |    'Today' | 0100 0011 1110 0001</div>
                <div>   1 |   28149 |        'I' | 0111 1101 1101 1101</div>
                <div>   2 |    1114 |     'want' | 1111 0011 1111 0111</div>
                <div>   3 |   19406 |       'to' | 0101 0010 1011 1100</div>
                <div>   4 |   35115 | 'understand' | 0111 1110 0001 0111</div>
                <div>   5 |    9859 |      'how' | 0110 1011 0010 1101</div>
                <div>   6 |   42759 |        'a' | 1111 0010 1101 0010</div>
                <div>   7 |   24970 |      'GPT' | 0000 0010 1100 0011</div>
                <div>   8 |   36800 |    'style' | 0000 0111 1011 1110</div>
                <div>   9 |   23655 |    'model' | 0111 1110 0110 1100</div>
                <div>  10 |   20439 |    'turns' | 1110 0111 0101 1000</div>
                <div>  11 |   43041 |       'my' | 1011 1011 0111 0001</div>
                <div>  12 |   21802 | 'sentence' | 1001 0101 0010 1011</div>
                <div>  13 |   17359 |     'into' | 0000 1001 1110 0010</div>
                <div>  14 |    7994 |   'tokens' | 1101 0111 1110 0010</div>
                <div>  15 |   48962 |        ',' | 0000 0111 1100 1111</div>
                <div>  16 |    2602 | 'embeddings' | 0111 0110 1001 0100</div>
                <div>  17 |   48962 |        ',' | 0000 0111 1100 1111</div>
                <div>  18 |    3157 | 'attention' | 1001 0111 1111 0100</div>
                <div>  19 |   27924 | 'patterns' | 1101 1110 1101 1000</div>
                <div>  20 |   48962 |        ',' | 0000 0111 1100 1111</div>
                <div>  21 |   38355 |      'and' | 0110 1101 1010 1101</div>
                <div>  22 |   19628 |  'finally' | 1100 0001 0010 1000</div>
                <div>  23 |   41707 | 'predicts' | 0001 1001 1001 0010</div>
                <div>  24 |   15870 |      'the' | 0011 1010 0100 0010</div>
                <div>  25 |   35650 |     'next' | 1011 1011 0100 0001</div>
                <div>  26 |    9290 |     'word' | 0001 0011 1100 1010</div>
                <div>  27 |   34950 |      'for' | 1000 0001 1100 0110</div>
                <div>  28 |    3134 | 'learning' | 0010 1001 1010 1110</div>
                <div>  29 |   38355 |      'and' | 0110 1101 1010 1101</div>
                <div>  30 |   48281 | 'debugging' | 0001 1111 1101 0001</div>
                <div>  31 |   43041 |       'my' | 1011 1011 0111 0001</div>
                <div>  32 |   18538 |      'own' | 1010 0000 1100 1001</div>
                <div>  33 |    5336 |        '.' | 1101 1010 1001 0000</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={scrollToNext}
            className="flex items-center gap-3 px-8 py-4 bg-[var(--gpt-accent2)] text-white rounded-full hover:bg-[var(--gpt-accent2)]/80 transition-colors"
          >
            <span>Next: Transformer Block</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function TransformerDetailSection({ scrollToNext }: { scrollToNext: () => void }) {
  return (
    <>
      <section className="min-h-screen bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="inline-block px-4 py-2 rounded-md bg-purple-100 border border-purple-300 mb-4">
              <span className="text-xs uppercase tracking-widest text-purple-700">03 — Core</span>
            </div>
            <h2 className="text-5xl mb-6 text-gray-900">Transformer Block</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              The heart of the neural network. Each block applies self-attention and feed-forward transformations, stacked in multiple layers.
            </p>
          </div>

          <div className="bg-gray-50 border-2 border-gray-900 rounded-2xl p-8 mb-12">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Layer Architecture</h3>
            
            <div className="space-y-3">
              <DetailBlock label="Input Embeddings" desc="Token IDs → Dense vectors (e.g., 768-dim)" type="neutral" />
              <Arrow />
              <DetailBlock label="Layer Normalization" desc="Normalize activations for stability" type="neutral" />
              <Arrow />
              <DetailBlock 
                label="Multi-Head Self-Attention" 
                desc="Each token attends to all previous tokens (causal masking)" 
                type="attention"
              />
              <Arrow dashed />
              <DetailBlock label="Residual Connection" desc="Add input to attention output (skip connection)" type="neutral" />
              <Arrow />
              <DetailBlock label="Layer Normalization" desc="Re-normalize before feed-forward" type="neutral" />
              <Arrow />
              <DetailBlock 
                label="Feed-Forward Network (MLP)" 
                desc="2-layer network: Linear → GELU → Linear" 
                type="mlp"
              />
              <Arrow dashed />
              <DetailBlock label="Residual Connection" desc="Add input to FFN output" type="neutral" />
              <Arrow />
              <DetailBlock label="Block Output" desc="Passed to next transformer block" type="neutral" />
            </div>

            <div className="mt-8 p-6 bg-purple-50 border-2 border-purple-600 rounded-lg">
              <p className="text-sm text-gray-900">
                <strong>Note:</strong> This entire block repeats N times (e.g., 12, 24, or 96 layers in GPT-3). 
                Each layer has its own learned parameters.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-purple-600 text-white rounded-xl p-6">
              <h4 className="mb-3 text-xl">Self-Attention</h4>
              <p className="text-sm mb-4 text-purple-100">
                Learns relationships between tokens. Each token can "look at" previous tokens to understand context.
              </p>
              <div className="bg-purple-700 rounded p-3 text-xs font-mono">
                Attention(Q, K, V) = softmax(QK^T / √d_k) × V
              </div>
            </div>
            <div className="bg-teal-600 text-white rounded-xl p-6">
              <h4 className="mb-3 text-xl">Feed-Forward</h4>
              <p className="text-sm mb-4 text-teal-100">
                Processes each token independently. Expands dimension then contracts back (e.g., 768 → 3072 → 768).
              </p>
              <div className="bg-teal-700 rounded p-3 text-xs font-mono">
                FFN(x) = GELU(xW₁ + b₁)W₂ + b₂
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={scrollToNext}
              className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <span>Next: Token IDs (Embedding Stage)</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function DetailBlock({ label, desc, type }: { label: string; desc: string; type: 'attention' | 'mlp' | 'neutral' }) {
  const colors = {
    attention: { bg: 'bg-purple-50', border: 'border-purple-600', text: 'text-purple-900' },
    mlp: { bg: 'bg-teal-50', border: 'border-teal-600', text: 'text-teal-900' },
    neutral: { bg: 'bg-white', border: 'border-gray-300', text: 'text-gray-900' }
  };

  const color = colors[type];

  return (
    <div className={`${color.bg} border-2 ${color.border} rounded-lg p-4`}>
      <div className={`${color.text} mb-1`}>{label}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </div>
  );
}

function Arrow({ dashed }: { dashed?: boolean }) {
  return (
    <div className="flex justify-center py-1">
      <div className={`w-px h-6 ${dashed ? 'border-l-2 border-dashed border-gray-400' : 'bg-gray-400'}`} />
    </div>
  );
}

function EmbeddingStageSection({ scrollToNext }: { scrollToNext: () => void }) {
  return (
    <section className="min-h-screen bg-black py-20 px-6 border-y-2 border-gray-900 flex flex-col justify-center">
      <div className="max-w-[1800px] mx-auto w-full">
        <h3 className="text-4xl uppercase tracking-widest text-gray-400 mb-20 text-center">
          Token IDs → Dense Vectors (Embedding Stage)
        </h3>
        
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1.2fr_auto_1fr_auto_1.2fr] gap-6 items-center max-w-full">
          {/* Token IDs */}
          <div className="border-2 border-gray-700 p-10 flex flex-col gap-5 bg-gray-900/30 rounded-lg">
            <h4 className="m-0 text-lg uppercase tracking-wider text-gray-300">Token IDs</h4>
            <div className="flex flex-col gap-4">
              <div className="border-2 border-gray-700 p-4 px-5 text-lg flex justify-between text-gray-300 bg-black/40">
                <span>"Explain"</span>
                <span className="text-gray-500">#1245</span>
              </div>
              <div className="border-2 border-gray-700 p-4 px-5 text-lg flex justify-between text-gray-300 bg-black/40">
                <span>" how"</span>
                <span className="text-gray-500">#318</span>
              </div>
              <div className="border-2 border-gray-700 p-4 px-5 text-lg flex justify-between text-gray-300 bg-black/40">
                <span>" GPT"</span>
                <span className="text-gray-500">#9031</span>
              </div>
            </div>
            <div className="text-base text-gray-500 leading-tight font-mono mt-3">
              Discrete integers from tokenizer<br/>
              Shape: ℤ<sup>T</sup>
            </div>
          </div>

          <div className="flex items-center justify-center text-5xl text-gray-500 px-4">→</div>

          {/* Embedding Lookup */}
          <div className="border-2 border-gray-700 p-10 flex flex-col gap-5 bg-gray-900/30 rounded-lg">
            <h4 className="m-0 text-lg uppercase tracking-wider text-gray-300">Embedding Lookup</h4>
            
            <div className="text-base text-gray-500 font-mono mb-2">
              Token Embedding Matrix W<sub>E</sub> ∈ ℝ<sup>V×d</sup>
            </div>

            <div className="border-2 border-purple-600 p-6 grid grid-cols-8 gap-3 bg-purple-900/20">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="border border-gray-700 h-10 bg-purple-600/30"></div>
              ))}
            </div>

            <div className="text-base text-gray-500 leading-tight font-mono mt-2">
              Each token ID indexes one row.<br/>
              No computation — just lookup.
            </div>
          </div>

          <div className="flex items-center justify-center text-5xl text-gray-500 px-4">+</div>

          {/* Positional Embedding */}
          <div className="border-2 border-gray-700 p-10 flex flex-col gap-5 bg-gray-900/30 rounded-lg">
            <h4 className="m-0 text-lg uppercase tracking-wider text-gray-300">Positional Embedding</h4>
            
            <div className="border-2 border-gray-700 p-6 grid grid-cols-6 gap-3 mt-4 bg-black/40">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-10 rounded"
                  style={{
                    background: `rgba(124, 92, 255, ${0.2 + (i % 6) * 0.12})`
                  }}
                ></div>
              ))}
            </div>
            
            <div className="text-base text-gray-500 leading-tight font-mono mt-3">
              Learned or sinusoidal<br/>
              Same dimension d<br/>
              W<sub>P</sub>[position]
            </div>
          </div>

          <div className="flex items-center justify-center text-5xl text-gray-500 px-4">→</div>

          {/* Output vectors */}
          <div className="border-2 border-gray-700 p-10 flex flex-col gap-5 bg-gray-900/30 rounded-lg">
            <h4 className="m-0 text-lg uppercase tracking-wider text-gray-300">Dense Vectors (X)</h4>

            <div className="flex flex-col gap-5 mt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-2 border-teal-400 p-5 grid grid-cols-12 gap-2.5 bg-teal-900/20">
                  {[...Array(12)].map((_, j) => (
                    <div 
                      key={j} 
                      className="h-6 rounded"
                      style={{
                        background: `rgba(34, 211, 238, ${0.25 + (j % 4) * 0.15})`
                      }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>

            <div className="text-base text-gray-500 leading-tight font-mono mt-3">
              X = W<sub>E</sub>[token] + W<sub>P</sub>[position]<br/>
              Shape: ℝ<sup>T × d</sup><br/>
              Ready for transformer layers
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <button 
            onClick={scrollToNext}
            className="flex items-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
          >
            <span>Next: Layer Normalization</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function OutputDetailSection() {
  return (
    <section className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="inline-block px-4 py-2 rounded-md bg-yellow-100 border border-yellow-400 mb-4">
            <span className="text-xs uppercase tracking-widest text-yellow-700">04 — Output</span>
          </div>
          <h2 className="text-5xl mb-6 text-gray-900">Generation & Decode</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            The final transformer outputs are converted to probability distributions, sampled to select tokens, and decoded back to text.
          </p>
        </div>

        <div className="bg-gray-50 border-2 border-gray-900 rounded-2xl p-8 mb-12">
          <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Decoding Pipeline</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-xl mb-2 text-gray-900">Logits Generation</h4>
                <p className="text-gray-600 mb-3">
                  The final layer outputs raw scores (logits) for every token in the vocabulary (~50k values).
                </p>
                <div className="bg-white border border-gray-300 rounded p-3 text-xs font-mono text-gray-700">
                  [2.3, -1.5, 4.7, ..., 0.8] ← Logits for 50k tokens
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-xl mb-2 text-gray-900">Sampling Strategy</h4>
                <p className="text-gray-600 mb-3">
                  Apply temperature, top-k, top-p (nucleus), and repetition penalties to shape the distribution.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-900 text-white rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Temperature</div>
                    <div className="text-sm">Controls randomness (0.7 = balanced)</div>
                  </div>
                  <div className="bg-gray-900 text-white rounded p-3">
                    <div className="text-xs text-gray-400 mb-1">Top-p</div>
                    <div className="text-sm">Samples from top cumulative probability</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-xl mb-2 text-gray-900">Detokenization</h4>
                <p className="text-gray-600 mb-3">
                  Selected token IDs are converted back to text using the vocabulary mapping.
                </p>
                <div className="bg-white border border-gray-300 rounded p-3 text-sm text-gray-900">
                  Token ID <strong>47385</strong> → "<strong>transformer</strong>"
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <span>↑</span>
            <span>Back to Overview</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function LayerNormOverviewSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-[var(--gpt-accent)]/10 border border-[var(--gpt-accent)]/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-[var(--gpt-accent)]">LayerNorm</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Layer Normalization</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
          
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[var(--gpt-accent)]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[var(--gpt-accent)]" />
          
          <div className="space-y-2">
            <ProcessBlock label="Input" sublabel="Embeddings" compact />
            <FlowLine />
            <ProcessBlock label="LayerNorm" sublabel="Normalize" compact />
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Normalized
      </div>
    </div>
  );
}

function EmbeddingOverviewSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-[var(--gpt-accent)]/10 border border-[var(--gpt-accent)]/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-[var(--gpt-accent)]">Embedding</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Embedding Stage</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
          
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[var(--gpt-accent)]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[var(--gpt-accent)]" />
          
          <div className="space-y-2">
            <ProcessBlock label="Input" sublabel="Embeddings" compact />
            <FlowLine />
            <ProcessBlock label="LayerNorm" sublabel="Normalize" compact />
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Normalized
      </div>
    </div>
  );
}

function AttentionOverviewSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-[var(--gpt-accent)]/10 border border-[var(--gpt-accent)]/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-[var(--gpt-accent)]">Attention</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Multi-Head Self-Attention</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
          
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[var(--gpt-accent)]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[var(--gpt-accent)]" />
          
          <div className="space-y-2">
            <ProcessBlock label="Input" sublabel="Embeddings" compact />
            <FlowLine />
            <ProcessBlock label="LayerNorm" sublabel="Normalize" compact />
            <FlowLine />
            <ProcessBlock label="Self-Attention" sublabel="Multi-Head" accent="purple" highlight compact />
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Attention
      </div>
    </div>
  );
}

function FeedForwardOverviewSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-[var(--gpt-accent)]/10 border border-[var(--gpt-accent)]/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-[var(--gpt-accent)]">Feed-Forward</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Feed-Forward Network (MLP)</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
          
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[var(--gpt-accent)]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[var(--gpt-accent)]" />
          
          <div className="space-y-2">
            <ProcessBlock label="Input" sublabel="Embeddings" compact />
            <FlowLine />
            <ProcessBlock label="LayerNorm" sublabel="Normalize" compact />
            <FlowLine />
            <ProcessBlock label="Self-Attention" sublabel="Multi-Head" accent="purple" highlight compact />
            <FlowLine dashed />
            <ProcessBlock label="Residual +" sublabel="Skip" compact />
            <FlowLine />
            <ProcessBlock label="Feed-Forward" sublabel="MLP" accent="teal" highlight compact />
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Feed-Forward
      </div>
    </div>
  );
}

function ResidualConnectionOverviewSection() {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-105 hover:-translate-y-2 duration-300">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 mb-2">
          <span className="text-xs uppercase tracking-widest text-yellow-400">Residual</span>
        </div>
        <h3 className="text-lg tracking-wide text-[#d7d7ef]">Residual Connection</h3>
      </div>

      <div className="w-full relative">
        <div className="absolute -inset-4 border border-dashed border-[var(--stroke)] rounded-lg opacity-30" />
        
        <div className="relative bg-[var(--panel)] border-2 border-[var(--stroke)] rounded-lg p-6 shadow-2xl">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--gpt-accent)] border-2 border-[var(--bg)] shadow-lg shadow-[var(--gpt-accent)]/50 hidden lg:block" />
          
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-yellow-500/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-yellow-500/50" />
          
          <div className="space-y-2">
            <ProcessBlock label="Input" sublabel="x" compact />
            <FlowLine />
            <ProcessBlock label="Transform" sublabel="F(x)" compact />
            <FlowLine dashed />
            <ProcessBlock label="Add +" sublabel="x + F(x)" compact />
          </div>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-500 border-2 border-[var(--bg)] shadow-lg shadow-yellow-500/50 hidden lg:block" />
      </div>

      <div className="mt-4 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        Skip Connection
      </div>
    </div>
  );
}