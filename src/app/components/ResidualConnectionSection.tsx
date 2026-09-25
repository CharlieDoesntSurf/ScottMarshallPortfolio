export default function ResidualConnectionSection({ scrollToNext }: { scrollToNext: () => void }) {
  return (
    <section className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 rounded-md bg-yellow-500/10 border border-yellow-500/30 mb-4">
            <span className="text-xs uppercase tracking-widest text-yellow-400">03.4 — Skip Connection</span>
          </div>
          <h1 className="text-5xl mb-2 text-gray-100 tracking-wide">Residual Connection</h1>
          <p className="text-gray-400 text-lg">
            Preserve information, add a learned correction
          </p>
        </div>

        <div className="max-w-[820px] text-gray-300 leading-relaxed space-y-4 mb-12">
          <p>
            A residual connection allows information to flow through the network
            unchanged, while a learned transformation is added on top.
          </p>
          <p>
            Instead of forcing each layer to completely rewrite a token's representation,
            the model learns a <strong className="text-white">residual update</strong> — a small adjustment to what
            already exists.
          </p>
        </div>

        <div className="relative bg-[#050505] border border-white/8 rounded-2xl p-10">
          <div className="grid grid-cols-[1fr_120px_1fr] items-center relative">
            {/* Skip path label */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-sm text-gray-400">
              identity path
            </div>
            
            {/* Skip path line */}
            <div className="absolute -top-7 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            {/* Input box */}
            <div className="p-5 rounded-xl border border-white/10 bg-[#020202] text-center text-sm">
              <strong className="block text-base mb-1.5 text-white">Input</strong>
              token representation
            </div>

            {/* Arrow */}
            <div className="text-center text-3xl text-gray-400">→</div>

            {/* Sub-layer box */}
            <div className="p-5 rounded-xl border border-white/10 bg-[#020202] text-center text-sm">
              <strong className="block text-base mb-1.5 text-white">Sub-layer</strong>
              attention or MLP
            </div>
          </div>

          {/* Add operation */}
          <div className="mt-10 flex justify-center items-center gap-4">
            <div className="w-11 h-11 rounded-full border border-dashed border-white/25 flex items-center justify-center text-2xl text-yellow-400">
              +
            </div>
            <div className="p-4 px-6 rounded-xl border border-white/12 bg-[#020202] text-sm text-center">
              <strong className="block text-white">Output</strong>
              input + update
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 px-5 bg-[#020202] border-l-4 border-yellow-400 rounded-lg text-sm text-gray-300">
            If the sub-layer learns nothing useful, the residual path allows the model
            to fall back to the original representation.
            This makes very deep Transformers trainable and stable.
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
