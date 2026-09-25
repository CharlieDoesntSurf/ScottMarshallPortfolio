import { useState, useEffect } from 'react';

export default function LayerNormSection({ scrollToNext }: { scrollToNext: () => void }) {
  const [beforeBars, setBeforeBars] = useState<number[]>([]);
  const [afterBars, setAfterBars] = useState<number[]>([]);
  const [mean, setMean] = useState(0);
  const [variance, setVariance] = useState(0);

  const randomize = () => {
    const dims = 12;
    const x = Array.from({ length: dims }, () => (Math.random() * 4) - 2);

    const meanVal = x.reduce((a, b) => a + b, 0) / dims;
    const varianceVal = x.reduce((a, b) => a + (b - meanVal) ** 2, 0) / dims;
    const std = Math.sqrt(varianceVal + 1e-5);

    const xhat = x.map(v => (v - meanVal) / std);

    setBeforeBars(x);
    setAfterBars(xhat);
    setMean(meanVal);
    setVariance(varianceVal);
  };

  useEffect(() => {
    randomize();
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-[980px] mx-auto">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 rounded-md bg-purple-100 border border-purple-300 mb-4">
            <span className="text-xs uppercase tracking-widest text-purple-700">03.1 — Normalization</span>
          </div>
          <h1 className="text-5xl mb-2 text-gray-900">Layer Normalization</h1>
          <p className="text-gray-600 text-lg">Normalize activations for stability</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-6">
          <p className="text-gray-700 leading-relaxed">
            <strong>Layer Normalization</strong> is a technique used in Transformers to keep activations
            numerically stable as they flow through deep networks.
            It ensures that each token's hidden representation has a
            consistent scale and distribution during training.
          </p>
        </div>

        <h2 className="mt-12 text-2xl text-gray-900">Why normalization is needed</h2>
        <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-5">
          <p className="text-gray-700 leading-relaxed mb-4">
            As a Transformer trains, values inside the network can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Grow too large (exploding activations)</li>
            <li>Shrink toward zero (vanishing activations)</li>
            <li>Vary wildly between layers</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Layer Normalization fixes this by <strong>normalizing each token's vector</strong>
            {' '}so the model always works in a predictable numerical range.
          </p>
        </div>

        <h2 className="mt-12 text-2xl text-gray-900">What LayerNorm actually does</h2>
        <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-3 text-gray-900"><strong>Before normalization</strong></p>
              <div className="flex gap-1.5 items-end h-[140px]">
                {beforeBars.map((val, i) => (
                  <div
                    key={i}
                    className="w-5 bg-gray-300 rounded-t-lg transition-all duration-300"
                    style={{ height: `${Math.abs(val) * 40}px` }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-gray-900"><strong>After normalization</strong></p>
              <div className="flex gap-1.5 items-end h-[140px]">
                {afterBars.map((val, i) => (
                  <div
                    key={i}
                    className="w-5 bg-gray-900 rounded-t-lg transition-all duration-300"
                    style={{ height: `${Math.abs(val) * 40}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1.5 mt-4 text-sm">
            <div className="text-gray-600">Mean</div>
            <div className="text-gray-900">{mean.toFixed(3)}</div>
            <div className="text-gray-600">Variance</div>
            <div className="text-gray-900">{variance.toFixed(3)}</div>
          </div>
        </div>

        <h2 className="mt-12 text-2xl text-gray-900">The math (per token)</h2>
        <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-5">
          <div className="bg-gray-100 p-4 rounded-xl font-mono text-sm text-gray-900">
            x̂ = (x − μ) / √(σ² + ε)<br />
            y = γ · x̂ + β
          </div>
          <p className="text-gray-600 text-sm mt-3">
            Mean (μ) and variance (σ²) are computed across the embedding dimension
            for a single token — not across the batch.
          </p>
        </div>

        <h2 className="mt-12 text-2xl text-gray-900">Where LayerNorm sits in a Transformer</h2>
        <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-5">
          <p className="text-gray-700 leading-relaxed mb-4">
            In modern GPT-style models, LayerNorm is applied:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Before self-attention (<strong>Pre-LN</strong>)</li>
            <li>Before feed-forward layers</li>
            <li>At the final output layer</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            This allows gradients to flow cleanly through dozens or hundreds of layers.
          </p>
        </div>

        <h2 className="mt-12 text-2xl text-gray-900">Try it yourself</h2>
        <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-5">
          <p className="text-gray-600 text-sm mb-4">
            Click to generate a new random activation vector and watch LayerNorm stabilize it.
          </p>
          <button
            onClick={randomize}
            className="border-none bg-gray-900 text-white py-2.5 px-4 rounded-full cursor-pointer"
          >
            Randomize activations
          </button>
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={scrollToNext}
            className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <span>Next: Transformer Block</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
