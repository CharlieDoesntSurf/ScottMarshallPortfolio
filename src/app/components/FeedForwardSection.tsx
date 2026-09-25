import { useEffect, useState } from 'react';

export default function FeedForwardSection({ scrollToNext }: { scrollToNext: () => void }) {
  const [activeNeurons, setActiveNeurons] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const newActive = new Set<number>();
      for (let i = 0; i < 20; i++) {
        if (Math.random() > 0.6) {
          newActive.add(i);
        }
      }
      setActiveNeurons(newActive);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 rounded-md bg-blue-100 border border-blue-300 mb-4">
            <span className="text-xs uppercase tracking-widest text-blue-700">03.3 — Feed-Forward</span>
          </div>
          <h1 className="text-5xl mb-2 text-gray-900">Feed-Forward Network (MLP)</h1>
          <p className="text-gray-600 text-lg">Linear → GELU → Linear (per token)</p>
        </div>

        <div className="max-w-[820px] text-gray-700 leading-relaxed space-y-4 mb-12">
          <p>
            The feed-forward network is applied <strong className="text-gray-900">independently to each token</strong>.
            Unlike self-attention, it does not look at other tokens.
          </p>
          <p>
            Instead, it expands the token's representation, applies a non-linear filter,
            and compresses it back. This allows the model to create and refine
            complex internal features.
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-2xl p-9">
          <div className="grid grid-cols-[1fr_120px_2fr_120px_1fr] items-center gap-0">
            {/* INPUT */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex flex-col gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ${
                      activeNeurons.has(i) ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">
                Input<br />embedding
              </div>
            </div>

            {/* ARROW 1 */}
            <div className="text-center text-2xl text-gray-500">→</div>

            {/* EXPANSION */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex flex-col gap-2">
                {[4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ${
                      activeNeurons.has(i) ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">
                Linear<br />(expand)
              </div>
            </div>

            {/* ARROW 2 */}
            <div className="text-center text-2xl text-gray-500">→</div>

            {/* GELU */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="relative w-[120px] h-[80px] border-l-2 border-b-2 border-gray-400">
                <div className="absolute inset-0">
                  <svg viewBox="0 0 120 80" className="w-full h-full">
                    <path
                      d="M 0 70 Q 30 60, 50 45 Q 70 30, 90 20 Q 100 15, 120 12"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                    {[
                      [24, 56],
                      [48, 36],
                      [72, 24],
                      [96, 16],
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="2.5" fill="#2563eb" />
                    ))}
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">
                GELU<br />non-linearity
              </div>
            </div>

            {/* ARROW 3 */}
            <div className="text-center text-2xl text-gray-500">→</div>

            {/* COMPRESSION */}
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex flex-col gap-2">
                {[12, 13, 14, 15].map((i) => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ${
                      activeNeurons.has(i) ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">
                Linear<br />(project back)
              </div>
            </div>
          </div>

          <div className="mt-7 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 text-sm text-gray-700">
            The expansion allows the model to build rich intermediate features.
            GELU selectively activates them.
            The final linear layer recombines those features into the original dimension.
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={scrollToNext}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <span>Next: Generation & Decode</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
