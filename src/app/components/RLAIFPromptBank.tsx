import { useState, useMemo } from 'react';

interface Prompt {
  id: string;
  topic: string;
  prompt: string;
  reference: string;
  grading: string;
  gotchas: string;
}

export default function RLAIFPromptBank() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [showReference, setShowReference] = useState(true);
  const [showGrading, setShowGrading] = useState(true);
  const [showGotchas, setShowGotchas] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');

  const judgeRubric = {
    judge_instructions: {
      role: "You are a strict evaluator for reasoning quality and correctness. Do not reward verbosity. Penalize hallucinations.",
      score_scale: {
        overall: "0-10",
        correctness: "0-5",
        reasoning: "0-3",
        clarity: "0-1",
        safety: "0-1"
      },
      principles: [
        "Correctness dominates. If wrong, cap overall <=4 unless the task is subjective.",
        "Reasoning must be logically coherent; penalize leaps and unstated assumptions.",
        "Clarity: concise structure, readable steps, uses the right level of detail.",
        "Safety: refuse or safely redirect if the user asks for wrongdoing."
      ],
      pairwise_preference_rules: [
        "Prefer the answer that is more correct.",
        "If both correct, prefer better reasoning (explicit assumptions, checks).",
        "If tied, prefer clearer/shorter (no fluff).",
        "Any unsafe assistance loses unless the other is also unsafe."
      ],
      output_schema: {
        overall_score: "number 0-10",
        subscores: { correctness: "0-5", reasoning: "0-3", clarity: "0-1", safety: "0-1" },
        verdict: "PASS|FAIL",
        feedback: "2-6 bullet points, actionable",
        pairwise_choice: "A|B|TIE (if applicable)"
      }
    }
  };

  const prompts: Prompt[] = [
    // Math
    { id: "RLAIF-001", topic: "math", prompt: "A store offers 25% off, then an extra $10 off. An item is $80. What is the final price?", reference: "25% off $80 => $60, then -$10 => $50.", grading: "Correct final=50. Must apply percent before subtracting $10.", gotchas: "Subtracting $10 before discount; applying 25% to $70." },
    { id: "RLAIF-002", topic: "math", prompt: "If 3 workers finish a job in 10 hours, how long for 5 workers at the same rate?", reference: "Work=30 worker-hours. /5=6 hours.", grading: "Answer 6 hours with proportional reasoning.", gotchas: "Linear add/subtract errors." },
    { id: "RLAIF-003", topic: "probability", prompt: "You flip a fair coin 3 times. Probability of exactly 2 heads?", reference: "C(3,2)/2^3=3/8.", grading: "Must get 3/8.", gotchas: "2/8 or 1/4." },
    { id: "RLAIF-004", topic: "math", prompt: "Find the next number: 2, 6, 12, 20, 30, ? Explain pattern.", reference: "Differences 4,6,8,10 => next +12 => 42.", grading: "Must give 42 and justify.", gotchas: "Guessing without pattern." },
    { id: "RLAIF-005", topic: "math", prompt: "A rectangle has perimeter 50 and length 15. What is width?", reference: "2(L+W)=50 => L+W=25 => W=10.", grading: "Width 10.", gotchas: "Using area formula." },
    { id: "RLAIF-006", topic: "math", prompt: "A recipe needs 3/4 cup sugar for 6 cookies. How much for 10 cookies?", reference: "Scale by 10/6 => (3/4)*(5/3)=5/4=1.25 cups.", grading: "1.25 cups (1 1/4).", gotchas: "Using 3/4 + something linear." },
    { id: "RLAIF-007", topic: "probability", prompt: "A class has 12 girls and 8 boys. Randomly pick 2 without replacement. Probability both are girls?", reference: "(12/20)*(11/19)=132/380=33/95.", grading: "33/95.", gotchas: "With replacement mistake." },
    { id: "RLAIF-008", topic: "math", prompt: "You have 9 liters of 30% salt solution. How much pure water to add to make it 20%?", reference: "Salt=2.7 L. Need total=2.7/0.2=13.5 L. Add 4.5 L water.", grading: "4.5 liters.", gotchas: "Subtracting percents directly." },
    { id: "RLAIF-009", topic: "math", prompt: "Prove or disprove: If x^2 = y^2 then x=y.", reference: "Disprove: x=1,y=-1 gives equal squares but x≠y. True is x=±y.", grading: "Counterexample or corrected statement.", gotchas: "Claiming always true." },
    { id: "RLAIF-010", topic: "math", prompt: "Solve for x: 3(x-2)=2x+5.", reference: "3x-6=2x+5 => x=11.", grading: "x=11.", gotchas: "Algebra slip." },
    
    // Logic
    { id: "RLAIF-021", topic: "logic", prompt: "Logical reasoning: All glims are plors. Some plors are snibs. Can we conclude some glims are snibs?", reference: "No. The snib-plors might be outside glims.", grading: "Must answer 'cannot conclude' with counterexample reasoning.", gotchas: "Affirming existential incorrectly." },
    { id: "RLAIF-022", topic: "logic", prompt: "A bat and ball cost $1.10 total. The bat costs $1.00 more than the ball. How much is the ball?", reference: "Let ball=x, bat=x+1 => 2x+1=1.10 => x=0.05.", grading: "Ball=$0.05.", gotchas: "$0.10 trap." },
    { id: "RLAIF-023", topic: "logic", prompt: "If statement P implies Q, and Q is false, what can we conclude about P?", reference: "Contrapositive: if Q false then P false.", grading: "Must say P is false.", gotchas: "Saying 'unknown'." },
    { id: "RLAIF-024", topic: "logic", prompt: "If P implies Q, and P is false, what can we conclude about Q?", reference: "Nothing definite; Q can be true or false.", grading: "Must say cannot conclude.", gotchas: "Saying Q false." },
    { id: "RLAIF-025", topic: "logic", prompt: "In a town, every person either always lies or always tells the truth. A says: 'B is a liar.' B says: 'A and I are of different types.' Determine who is lying.", reference: "Assume A truth => B liar; then B statement 'different types' true, contradiction. So A liar, B truth-teller.", grading: "Conclusion: A liar, B truthful with consistent check.", gotchas: "Not checking consistency." },
    
    // Word / explanation
    { id: "RLAIF-031", topic: "word", prompt: "Explain why dividing by a number close to zero makes values large (intuitively).", reference: "How many tiny chunks fit into a fixed amount; many fit, so quotient grows.", grading: "Clear intuition; no claim that division by 0 is allowed.", gotchas: "Saying dividing by 0 is okay." },
    { id: "RLAIF-032", topic: "word", prompt: "Explain the difference between correlation and causation with a concrete example.", reference: "Correlation = association; causation = one causes other. Example: ice cream sales and drowning both rise in summer (confounder).", grading: "Must define both + example with confounder.", gotchas: "Vague definition only." },
    { id: "RLAIF-033", topic: "word", prompt: "Explain why we use a validation set in ML training.", reference: "To estimate generalization and tune hyperparameters without contaminating test set; detect overfitting.", grading: "Must mention generalization/overfitting/hyperparameter selection.", gotchas: "Saying it improves training directly." },
    { id: "RLAIF-034", topic: "word", prompt: "In one paragraph, explain what a gradient is in optimization.", reference: "Direction of steepest increase; negative gradient decreases loss; computed via derivatives/backprop.", grading: "Accurate concept; no major errors.", gotchas: "Calling it a random search direction." },
    { id: "RLAIF-035", topic: "word", prompt: "Explain what 'causal masking' does in a GPT-style Transformer.", reference: "Prevents token from attending to future positions; ensures next-token prediction uses only past context.", grading: "Must describe 'no future info' and why.", gotchas: "Mixing up with padding masks." },
    { id: "RLAIF-036", topic: "word", prompt: "Explain why residual connections help deep networks train.", reference: "Provide identity path for gradient flow; layers learn residual update; mitigates vanishing gradients.", grading: "Must mention gradient flow/identity/residual update.", gotchas: "Saying only 'adds capacity'." },
    { id: "RLAIF-037", topic: "word", prompt: "Explain the role of non-linearity (e.g., GELU/ReLU) in a neural network.", reference: "Without it, stacked linear layers collapse to one linear map; non-linearity enables complex functions.", grading: "Must mention linear collapse + expressivity.", gotchas: "Saying it prevents overfitting only." },
    { id: "RLAIF-038", topic: "word", prompt: "What is overfitting? Give one sign and one mitigation.", reference: "Fits training noise; sign: train loss down, val loss up; mitigate with regularization/early stopping/more data.", grading: "Must give sign + mitigation.", gotchas: "Confusing with underfitting." },
    { id: "RLAIF-039", topic: "word", prompt: "Explain in plain language what 'logits' are.", reference: "Raw unnormalized scores before softmax; can be any real numbers.", grading: "Accurate and concise.", gotchas: "Calling logits probabilities." },
    { id: "RLAIF-040", topic: "word", prompt: "Why do we use softmax for multi-class classification?", reference: "Maps real-valued scores to probabilities that sum to 1; differentiable; relates to cross-entropy.", grading: "Must mention probability simplex; sum to 1.", gotchas: "Saying it picks max only." },
    
    // CS / ML
    { id: "RLAIF-041", topic: "cs", prompt: "Coding reasoning: What is the time complexity of binary search on a sorted array of size n? Explain briefly.", reference: "O(log n) halves search space each step.", grading: "Must state O(log n) and why.", gotchas: "O(n)." },
    { id: "RLAIF-042", topic: "cs", prompt: "Given Python list a=[1,2,3]. What does a*2 produce and why?", reference: "[1,2,3,1,2,3]; list repetition.", grading: "Correct output & explanation.", gotchas: "Element-wise multiply." },
    { id: "RLAIF-043", topic: "cs", prompt: "Design a function signature for batching sequences of varying length for a Transformer. Mention padding and attention masks.", reference: "Inputs: token_ids (B,T), attention_mask (B,T), maybe lengths; pad to max_len and mask pads.", grading: "Must include padding + mask concept.", gotchas: "Ignoring mask." },
    { id: "RLAIF-044", topic: "cs", prompt: "Debug reasoning: A model's training loss is decreasing but validation loss increases. Give 3 likely causes and one fix per cause.", reference: "Overfitting->regularize/early stop; distribution mismatch->fix split; too long training/LR schedule->early stop or adjust; leakage->fix pipeline.", grading: "At least 3 plausible causes, each with actionable fix.", gotchas: "Vague advice only." },
    { id: "RLAIF-045", topic: "cs", prompt: "What's the difference between a stack and a queue? Give one use case for each.", reference: "Stack: LIFO (call stack, undo). Queue: FIFO (task scheduling, BFS).", grading: "Correct definitions + use case each.", gotchas: "Swapping LIFO/FIFO." },
  ];

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchesTopic = selectedTopic === 'all' || p.topic === selectedTopic;
      const matchesSearch = searchQuery === '' || 
        p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [searchQuery, selectedTopic]);

  const copyToClipboard = (text: string, label: string) => {
    // Fallback method for environments where Clipboard API is blocked
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopyFeedback(`✓ ${label} copied`);
        setTimeout(() => setCopyFeedback(''), 2000);
      } else {
        setCopyFeedback(`✗ Copy failed`);
        setTimeout(() => setCopyFeedback(''), 2000);
      }
    } catch (err) {
      setCopyFeedback(`✗ Copy failed`);
      setTimeout(() => setCopyFeedback(''), 2000);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const copyJudgeRubric = () => {
    copyToClipboard(JSON.stringify(judgeRubric, null, 2), 'Judge rubric');
  };

  const copyVisiblePrompts = () => {
    const jsonl = filteredPrompts.map(p => JSON.stringify(p)).join('\n');
    copyToClipboard(jsonl, 'Prompts');
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5" style={{ background: '#0b0b0c', color: '#e8e8ea' }}>
      <header className="mb-5">
        <div className="flex justify-between items-start gap-5 flex-wrap mb-4">
          <div className="flex-1">
            <h1 className="text-4xl mb-2 tracking-wide">RLAIF Prompt Bank</h1>
            <div className="text-gray-400 leading-relaxed max-w-[820px]">
              A single-page bank of <strong>{prompts.length} reasoning prompts</strong> with <strong>reference answers</strong> and a
              <strong> grading rubric</strong> suitable for RLAIF (AI judge or human judge). Use search + filters to find prompts
              and copy them into your training pipeline.
            </div>
            <div className="flex gap-3 flex-wrap items-center mt-2 text-sm text-gray-400">
              Showing <strong className="text-white">{filteredPrompts.length}</strong> of <strong className="text-white">{prompts.length}</strong> prompts
              <span className="inline-flex gap-2 items-center py-1.5 px-3 border border-white/10 bg-white/5 rounded-full text-xs">
                <span>Mode:</span> <strong className="text-white">Reasoning + Grading</strong>
              </span>
            </div>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <div className="inline-flex gap-2 items-center py-2 px-3 border border-white/10 bg-white/5 rounded-full text-xs">
              <span>Judge scoring:</span> <strong className="text-white">0–10</strong>
            </div>
            <div className="inline-flex gap-2 items-center py-2 px-3 border border-white/10 bg-white/5 rounded-full text-xs">
              <span>Correctness:</span> <strong className="text-white">0–5</strong>
            </div>
            <div className="inline-flex gap-2 items-center py-2 px-3 border border-white/10 bg-white/5 rounded-full text-xs">
              <span>Reasoning:</span> <strong className="text-white">0–3</strong>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="mt-5 p-4 border border-white/10 rounded-2xl bg-gradient-to-b from-white/5 to-white/2">
        <div className="flex justify-between gap-3 flex-wrap mb-3">
          <div className="flex gap-2.5 flex-wrap items-center flex-1">
            <input
              type="text"
              placeholder="Search prompts (e.g., 'probability', 'overfitting', 'logic')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[300px] py-2.5 px-3 rounded-xl border border-white/10 bg-black/40 text-white placeholder-white/35 outline-none"
            />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-white/10 bg-black/40 text-white outline-none min-w-[170px]"
            >
              <option value="all">All topics</option>
              <option value="math">Math</option>
              <option value="logic">Logic</option>
              <option value="probability">Probability</option>
              <option value="cs">CS / ML</option>
              <option value="word">Word / explanation</option>
            </select>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <button
              onClick={copyJudgeRubric}
              className="py-2.5 px-3 rounded-xl border border-yellow-500/35 bg-yellow-500/13 text-white hover:bg-yellow-500/18 cursor-pointer"
            >
              Copy judge rubric JSON
            </button>
            <button
              onClick={copyVisiblePrompts}
              className="py-2.5 px-3 rounded-xl border border-white/14 bg-[#141417] text-white hover:border-yellow-500/45 cursor-pointer"
            >
              Copy visible prompts JSONL
            </button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <label className="flex gap-2 items-center text-gray-400 text-sm select-none cursor-pointer">
            <input type="checkbox" checked={showReference} onChange={(e) => setShowReference(e.target.checked)} />
            Show reference
          </label>
          <label className="flex gap-2 items-center text-gray-400 text-sm select-none cursor-pointer">
            <input type="checkbox" checked={showGrading} onChange={(e) => setShowGrading(e.target.checked)} />
            Show grading
          </label>
          <label className="flex gap-2 items-center text-gray-400 text-sm select-none cursor-pointer">
            <input type="checkbox" checked={showGotchas} onChange={(e) => setShowGotchas(e.target.checked)} />
            Show gotchas
          </label>
          {copyFeedback && <span className="text-sm text-green-400">{copyFeedback}</span>}
        </div>
      </div>

      {/* Judge Rubric */}
      <div className="mt-5 border border-white/10 bg-white/2 rounded-2xl overflow-hidden">
        <div className="flex justify-between items-center gap-3 py-3 px-4 border-b border-white/6 bg-white/2">
          <h2 className="text-base tracking-wide">Judge rubric (copy/paste into your evaluator)</h2>
          <div className="inline-flex gap-2 items-center py-1 px-2.5 border border-white/10 bg-black/35 rounded-full text-xs">
            <span>Schema:</span> <strong className="text-white">PASS/FAIL + scores</strong>
          </div>
        </div>
        <pre className="m-0 p-4 overflow-auto text-xs leading-relaxed bg-black/35 text-gray-200">
          {JSON.stringify(judgeRubric, null, 2)}
        </pre>
      </div>

      {/* Prompts Grid */}
      <div className="mt-5 grid gap-3">
        {filteredPrompts.map((p) => (
          <div key={p.id} className="border border-white/10 bg-white/2 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-3 py-3 px-4 border-b border-white/6 bg-white/2">
              <span className="font-mono text-xs text-gray-500 border border-white/10 py-1 px-2 rounded-full bg-black/35">
                {p.id}
              </span>
              <span className="text-xs text-yellow-400 border border-yellow-500/25 py-1 px-2 rounded-full bg-yellow-500/8">
                {p.topic}
              </span>
            </div>

            <div className="p-4 grid lg:grid-cols-[1.15fr_0.85fr] gap-4">
              <div className="border border-white/7 bg-black/25 rounded-xl p-3">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Prompt</h3>
                <div className="whitespace-pre-wrap leading-relaxed text-sm text-white">
                  {p.prompt}
                </div>
                <div className="flex gap-2 flex-wrap mt-2.5">
                  <button
                    onClick={() => copyToClipboard(p.prompt, 'Prompt')}
                    className="py-1.5 px-3 rounded-lg border border-white/14 bg-[#141417] text-white text-xs hover:border-yellow-500/45 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {showReference && (
                  <div className="border border-white/7 bg-black/25 rounded-xl p-3">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Reference</h3>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm text-gray-300">
                      {p.reference}
                    </div>
                  </div>
                )}

                {showGrading && (
                  <div className="border border-white/7 bg-black/25 rounded-xl p-3">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Grading</h3>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm text-gray-300">
                      {p.grading}
                    </div>
                  </div>
                )}

                {showGotchas && (
                  <div className="border border-white/7 bg-black/25 rounded-xl p-3">
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Common gotchas</h3>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm text-gray-400">
                      {p.gotchas}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-gray-400 text-sm leading-relaxed">
        Tip: For pairwise RLAIF, present two model answers (A/B) and ask the judge to output <code className="bg-black/35 px-2 py-0.5 rounded">pairwise_choice</code> plus a short critique.
        For scalar RLAIF, ask for <code className="bg-black/35 px-2 py-0.5 rounded">overall_score</code> with subscores.
      </div>
    </div>
  );
}