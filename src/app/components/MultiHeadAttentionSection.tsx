export default function MultiHeadAttentionSection({ scrollToNext }: { scrollToNext: () => void }) {
  return (
    <section className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 rounded-md bg-yellow-500/10 border border-yellow-500/30 mb-4">
            <span className="text-xs uppercase tracking-widest text-yellow-400">03.2 — Attention</span>
          </div>
          <h1 className="text-5xl mb-2 text-gray-100 tracking-wide">Multi-Head Self-Attention</h1>
          <p className="text-gray-400 text-lg">
            Each token attends to all previous tokens (causal masking)
          </p>
        </div>

        {/* Explanation */}
        <div className="max-w-[820px] text-gray-300 leading-relaxed space-y-4 mb-12">
          <p>
            Self-attention is the mechanism that allows a language model to decide{' '}
            <strong className="text-white">which earlier tokens matter</strong> when processing the current token.
            Instead of reading text left-to-right like a human, the model looks backward
            over the entire context and assigns a weight to each prior token.
          </p>

          <p>
            In a <strong className="text-white">causal Transformer</strong>, attention is restricted so a token
            can only attend to tokens that come before it — never the future.
            This preserves the rules of language modeling.
          </p>

          <p>
            <strong className="text-white">Multi-head attention</strong> repeats this process several times in parallel.
            Each head learns a different way of relating tokens: syntax, meaning,
            long-range references, or positional structure.
            The results are combined into a single, richer representation.
          </p>
        </div>

        {/* Tokens */}
        <div className="flex gap-3.5 items-center flex-wrap mt-12">
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-[#cbd5f5]">
            To
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-[#cbd5f5]">
            date
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-[#cbd5f5]">
            the
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-[#cbd5f5]">
            cle
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-[#cbd5f5]">
            ver
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-yellow-500 text-sm text-white shadow-[0_0_0_1px] shadow-yellow-500">
            thinker
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-gray-600">
            of
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-gray-600">
            all
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-gray-600">
            time
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-[#060606] border border-white/8 text-sm text-gray-600">
            was
          </div>
        </div>

        {/* Vectors */}
        <div className="flex gap-8 mt-7 items-start flex-wrap">
          <div className="font-mono text-xs text-gray-300 leading-relaxed py-3 px-3.5 bg-[#020202] border border-white/8 rounded-lg min-w-[90px] text-right">
            5.4<br />7.1<br />6.0<br />5.4<br />4.2<br />…
          </div>
          <div className="font-mono text-xs text-gray-300 leading-relaxed py-3 px-3.5 bg-[#020202] border border-white/8 rounded-lg min-w-[90px] text-right">
            7.8<br />5.2<br />5.6<br />9.2<br />0.7<br />…
          </div>
          <div className="font-mono text-xs text-gray-300 leading-relaxed py-3 px-3.5 bg-[#020202] border border-white/8 rounded-lg min-w-[90px] text-right">
            9.7<br />7.9<br />4.6<br />7.7<br />1.2<br />…
          </div>
          <div className="font-mono text-xs text-gray-300 leading-relaxed py-3 px-3.5 bg-[#020202] border border-white/8 rounded-lg min-w-[90px] text-right">
            2.6<br />7.7<br />4.5<br />5.6<br />0.2<br />…
          </div>
          <div className="font-mono text-xs text-gray-300 leading-relaxed py-3 px-3.5 bg-[#020202] border border-white/8 rounded-lg min-w-[90px] text-right">
            3.6<br />4.3<br />6.9<br />0.6<br />6.6<br />…
          </div>
          <div className="font-mono text-xs text-gray-300 leading-relaxed py-3 px-3.5 bg-[#020202] border border-yellow-500 rounded-lg min-w-[90px] text-right shadow-[0_0_0_1px] shadow-yellow-500">
            9.7<br />4.6<br />9.7<br />6.0<br />7.3<br />…
          </div>
          <div className="self-center text-gray-600 text-2xl">…</div>
        </div>

        {/* Attention Lines */}
        <div className="relative mt-10 h-[180px]">
          <div
            className="absolute h-[3px] bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent"
            style={{ top: '24px', left: '40px', width: '540px' }}
          />
          <div
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent opacity-55"
            style={{ top: '72px', left: '120px', width: '460px' }}
          />
          <div
            className="absolute h-[2px] bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent opacity-25"
            style={{ top: '120px', left: '200px', width: '380px' }}
          />
        </div>

        {/* Heads */}
        <div className="flex gap-4 flex-wrap mt-8">
          <div className="py-2.5 px-3.5 rounded-xl bg-[#050505] border border-white/8 text-sm text-gray-300">
            <span className="text-white font-semibold">Head 1</span> — grammatical structure
          </div>
          <div className="py-2.5 px-3.5 rounded-xl bg-[#050505] border border-white/8 text-sm text-gray-300">
            <span className="text-white font-semibold">Head 2</span> — semantic relevance
          </div>
          <div className="py-2.5 px-3.5 rounded-xl bg-[#050505] border border-white/8 text-sm text-gray-300">
            <span className="text-white font-semibold">Head 3</span> — long-range context
          </div>
        </div>

        {/* Next Token */}
        <div className="mt-12 flex items-center gap-4 flex-wrap">
          <div className="py-2.5 px-4 rounded-lg border border-dashed border-yellow-500 text-yellow-500 text-lg">
            ???
          </div>
          <div className="text-gray-400 max-w-[560px] leading-relaxed text-sm">
            The weighted combination of all previous token vectors
            becomes the new representation for the current token.
            That representation is then used to predict the next token.
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <button
            onClick={scrollToNext}
            className="flex items-center gap-3 px-8 py-4 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
          >
            <span>Next: Generation & Decode</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
