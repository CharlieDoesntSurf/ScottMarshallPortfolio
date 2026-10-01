import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BrainCircuit, Braces, Database, FileText, GitBranch, MessageSquare, Network, Plug, Sparkles, Terminal, Wrench, Zap } from 'lucide-react';

const inputs = [
  { id:'prompt', title:'Prompt', text:'The goal, instructions, and boundaries for the task.', icon:Terminal, target:'create-prompt' },
  { id:'tools', title:'Tool Calling', text:'Available actions, argument schemas, and returned results.', icon:Wrench, target:'call-tools' },
  { id:'data', title:'Data', text:'Relevant records and context for this specific run.', icon:Database, target:'inject-data' },
  { id:'documents', title:'Documents', text:'Source files and retrieved passages the agent can reference.', icon:FileText, target:'inject-data' },
  { id:'mcp-in', title:'MCP', text:'Tools and context exposed by connected MCP servers.', icon:Plug, target:'call-tools' },
];
const outputs = [
  { id:'response', title:'Response', text:'A clear answer, explanation, or summary for a person.', icon:MessageSquare, target:'define-output' },
  { id:'action', title:'Action', text:'A requested operation, executed by the application.', icon:Zap, target:'call-tools' },
  { id:'mcp-out', title:'MCP', text:'A call to a connected service through an MCP tool.', icon:Network, target:'call-tools' },
  { id:'structured', title:'Structured Data', text:'Schema-shaped results for storage or another system.', icon:Braces, target:'define-output' },
  { id:'decision', title:'Decision', text:'A recommendation or next step based on evidence and rules.', icon:GitBranch, target:'define-output' },
];

function jumpTo(id: string) {
  const section = document.getElementById(id);
  if (!section) return;
  section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start' });
  const heading = section.querySelector('h2');
  heading?.setAttribute('tabindex', '-1');
  heading?.focus({ preventScroll:true });
}

export default function AgentArchitecture() {
  const canvas = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{id:string; d:string; kind:string}[]>([]);
  useLayoutEffect(() => {
    const root = canvas.current;
    if (!root) return;
    const measure = () => {
      const bounds = root.getBoundingClientRect();
      const box = (id:string) => root.querySelector<HTMLElement>(`[data-node="${id}"]`)!.getBoundingClientRect();
      const core = box('model');
      const point = (rect:DOMRect, side:'bottom'|'top'|'left'|'right') => ({
        x:(side==='left'?rect.left:side==='right'?rect.right:rect.left+rect.width/2)-bounds.left,
        y:(side==='top'?rect.top:side==='bottom'?rect.bottom:rect.top+rect.height/2)-bounds.top,
      });
      setPaths([
        ...inputs.map(n=>{const a=point(box(n.id),'bottom'),b=point(core,'top');const mid=(a.y+b.y)/2;return {id:n.id,kind:'input',d:`M ${a.x} ${a.y} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y-8}`};}),
        ...outputs.map(n=>{const a=point(core,'right'),b=point(box(n.id),'left');const mid=(a.x+b.x)/2;return {id:n.id,kind:'output',d:`M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x-8} ${b.y}`};}),
      ]);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll('[data-node]').forEach(n=>observer.observe(n));
    measure();
    return ()=>observer.disconnect();
  },[]);

  return <section className="architecture" aria-labelledby="architecture-title">
    <header className="architecture-heading">
      <span className="architecture-kicker"><span/> AGENT WORKFLOW</span>
      <h1 id="architecture-title">One model.<br className="architecture-mobile-break"/> A connected system.</h1>
      <p>Give the model a purpose, context, and capabilities.<br/>Turn its reasoning into useful results.</p>
    </header>
    <div className="architecture-canvas" ref={canvas} aria-label="Agent architecture: five inputs feed a model, which branches to five possible outputs">
      <svg className="architecture-lines" aria-hidden="true">
        <defs><marker id="arch-input-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#a78bfa"/></marker><marker id="arch-output-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#5eead4"/></marker></defs>
        {paths.map(p=><path key={p.id} d={p.d} className={`architecture-wire ${p.kind}`} markerEnd={`url(#arch-${p.kind}-arrow)`}/>)}
      </svg>
      <div className="architecture-inputs">
        <p className="architecture-group-label">01 / WHAT GOES IN <ArrowDown size={13}/></p>
        <div className="architecture-input-grid">{inputs.map(({id,title,text,icon:Icon,target})=><button key={id} data-node={id} className="architecture-node input-node" onClick={()=>jumpTo(target)} aria-label={`${title}: ${text} Explore the related section`}><span className="architecture-icon"><Icon size={19}/></span><strong>{title}</strong><span className="architecture-summary">{text}</span><ArrowUpRight className="architecture-node-link" size={13}/></button>)}</div>
      </div>
      <div className="architecture-center">
        <button data-node="model" className="architecture-model" onClick={()=>jumpTo('choose-model')} aria-label="GPT-6 Astra model: explore choosing a model">
          <span className="architecture-core-icon"><BrainCircuit size={38}/></span>
          <span className="architecture-model-label">THE MODEL</span>
          <strong>GPT-6 Astra</strong>
          <code>gpt-6-astra</code>
          <span className="architecture-model-summary">Interprets the task, reasons over context, and chooses a response or tool request.</span>
          <span className="architecture-model-tags"><span>Reason</span><span>Plan</span><span>Respond</span></span>
          <span className="architecture-model-cta">Choose your model <ArrowRight size={14}/></span>
        </button>
        <button className="architecture-connection" onClick={()=>jumpTo('connect-model')}><Plug size={14}/> Connected through the API <ArrowUpRight size={12}/></button>
      </div>
      <div className="architecture-outputs">
        <p className="architecture-group-label">02 / WHAT COMES OUT <ArrowRight size={13}/></p>
        {outputs.map(({id,title,text,icon:Icon,target})=><button key={id} data-node={id} className="architecture-node output-node" onClick={()=>jumpTo(target)} aria-label={`${title}: ${text} Explore the related section`}><span className="architecture-icon"><Icon size={18}/></span><span><strong>{title}</strong><span className="architecture-summary">{text}</span></span><ArrowUpRight className="architecture-node-link" size={13}/></button>)}
      </div>
    </div>
    <footer className="architecture-footer"><p><Sparkles size={16}/><span><strong>The agent loop</strong> The application executes approved tool requests and returns results to the model until the task is complete.</span></p><a href="https://developers.openai.com/api/docs/models/gpt-6-astra" target="_blank" rel="noreferrer">Example model · OpenAI Docs <ArrowUpRight size={12}/></a></footer>
  </section>;
}
