import { useState } from 'react';
import HarnessExperience from './HarnessExperience';
import { Background, Controls, Handle, MarkerType, Position, ReactFlow, type Node, type Edge, type NodeProps } from '@xyflow/react';
import { BrainCircuit, Code2, Database, FileText, GitBranch, Globe, Layers, Workflow } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import '../../styles/agent-structure.css';

type Stage = 'prompt' | 'context' | 'harness';
type CardData = { title: string; kicker: string; summary: string; detail: string; examples?: string[]; kind?: string; window?: string; active?: boolean; inspect?: () => void };
type DiagramNode = Node<CardData, 'card'>;
const icons = { model: BrainCircuit, prompt: Code2, tools: Database, mcp: GitBranch, rag: FileText, harness: Workflow, output: Layers, browser: Globe };
const stages: Record<Stage, { label: string; era: string; title: string; subtitle: string; window: string; model: string; prompt: string; architecture: string; difference: string }> = {
  prompt: {
    label: 'Prompt engineering', era: '2022', title: 'Start with the words.', subtitle: 'One request. One model. A human closes the loop.', window: '4K', model: '2022-era language model',
    prompt: 'Write a JavaScript function sortTasks(tasks) that returns a new array of tasks sorted by priority: high, medium, low. Each task has an id, title, and priority. Do not mutate the input. Put missing priorities last. Include three small input/output examples. Use no external libraries.',
    architecture: 'The prompt and any pasted examples enter the model’s context window. The model generates a function from that information and its training. A person copies the result, runs it, and asks for corrections.',
    difference: 'The main design surface is the instruction: make the goal, constraints, and expected output clear. There is no connected repository, database, retrieval, or automatic verification in this example.',
  },
  context: {
    label: 'Context engineering', era: '2024–2025', title: 'Give the model the right information.', subtitle: 'Ground the same task in code, live data, and relevant documents.', window: '32K', model: '2024–2025 tool-capable model',
    prompt: 'Add a priority filter to our React task list. Read the current component from GitHub and inspect the Supabase tasks schema. Retrieve the task-priority rules from our product documents. Implement All / High / Medium / Low filters using the existing styles and database fields. Check the page in Chrome and return the proposed diff with focused test cases. Do not change the schema.',
    architecture: 'The application assembles instructions, repository files, database results, and retrieved document excerpts for each model call. Tool requests execute outside the model; their results return as context. MCP standardizes the connection to tool providers, while RAG selects relevant knowledge.',
    difference: 'You now design what the model can see and retrieve, not just what you ask. MCP is a way to expose tools; RAG is a retrieval pattern and can itself use a tool call. Neither one automatically supplies a durable delivery workflow.',
  },
  harness: {
    label: 'Modern Coding Agent Harness', era: '2026 · illustrative', title: 'Build the system around the model.', subtitle: 'Plan, act, verify, remember — then repeat until the work is done.', window: '128K', model: 'Modern coding model',
    prompt: 'Deliver a team task-priority feature from the Notion brief. Turn requirements into small stories with acceptance criteria. Inspect the GitHub app and Supabase schema, implement a priority field with access controls, add the filter UI, and test it. Use the Codex documentation for the coding-agent setup. Validate the Vercel preview in Chrome. If checks fail, repair and rerun within a three-attempt budget; otherwise checkpoint each story and open a pull request with test evidence. Update the Notion status. Require human approval before production migration or release.',
    architecture: 'A persistent controller surrounds the model: it selects a story, assembles bounded context, executes permitted actions, checks evidence, saves progress, and decides whether to retry, continue, or stop. The model remains the reasoning center; the harness owns the execution lifecycle.',
    difference: 'More connections alone are still context engineering. The harness adds state, acceptance criteria, permission gates, retry budgets, and a repeatable feedback loop that can resume across multiple model calls.',
  },
};
function Card({ data, selected }: NodeProps<DiagramNode>) {
  const Icon = icons[data.kind as keyof typeof icons] || Layers;
  return <div role="button" tabIndex={0} aria-label={`Explore ${data.title}`} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); data.inspect?.(); } }} className={`agent-node ${data.kind === 'model' ? 'agent-model' : ''} ${selected || data.active ? 'is-active' : ''}`}>
    <Handle type="target" position={Position.Left}/><Handle type="target" position={Position.Top} id="top"/>
    <div className="agent-node-kicker"><Icon size={16}/>{data.kicker}</div><strong>{data.title}</strong><p>{data.summary}</p>
    {data.window && <div className="agent-window"><div><span>CONTEXT WINDOW</span><b>{data.window} tokens</b></div><div className={`agent-window-bar window-${data.window}`}><i/><i/><i/><i/></div><small>Instructions + evidence + response budget</small></div>}
    <Handle type="source" position={Position.Right}/><Handle type="source" position={Position.Bottom} id="bottom"/>
  </div>;
}
const nodeTypes = { card: Card };
function buildDiagram(stage: Stage): { nodes: DiagramNode[]; edges: Edge[] } {
  const config = stages[stage];
  const nodes: DiagramNode[] = [];
  const edges: Edge[] = [];
  const add = (id: string, x: number, y: number, data: CardData) => nodes.push({ id, type: 'card', position: { x, y }, data: { ...data, active: false }, style: { width: data.kind === 'model' ? 300 : 240 } });
  const link = (source: string, target: string, label?: string, loop = false) => edges.push({ id: `${source}-${target}`, source, target, label, ...(loop ? { sourceHandle: 'bottom', targetHandle: 'top' } : {}), type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.ArrowClosed, color: loop ? '#d2a6fc' : '#72b7be' }, style: { stroke: loop ? '#b58cde' : '#58858e', strokeWidth: 1.5 }, labelStyle: { fill: '#c2ccd9', fontSize: 11 }, labelBgStyle: { fill: '#111923' }, labelBgPadding: [7, 5] });
  add('prompt', 0, 220, { title: 'Your request', kicker: '01 / INSTRUCTIONS', summary: stage === 'prompt' ? 'Write a task-sorting function.' : stage === 'context' ? 'Add a grounded priority filter.' : 'Deliver the complete priority feature.', detail: config.prompt, kind: 'prompt' });
  add('model', 380, 200, { title: config.model, kicker: 'THE REASONING CENTER', summary: stage === 'prompt' ? 'Read → generate a response' : 'Read → reason → request an action', detail: 'A model reasons over the tokens supplied in the current call. External tools execute in the application, not inside the model. A larger window holds more information, but useful selection still matters.', kind: 'model', window: config.window });
  add('output', 820, 220, { title: stage === 'prompt' ? 'Code suggestion' : stage === 'context' ? 'Grounded code change' : 'Verified story + checkpoint', kicker: 'OUTPUT', summary: stage === 'harness' ? 'Test evidence · PR · saved progress' : 'A person reviews the result.', detail: 'The output is proposed code, not proof that it works. Review and execute tests before accepting it.', kind: 'output' });
  link('prompt', 'model', 'instructions'); link('model', 'output', stage === 'harness' ? 'passes checks' : 'response');
  if (stage !== 'prompt') {
    add('tools', 0, 0, { title: 'Database tool calls', kicker: 'TOOLS / ACTIONS', summary: 'Inspect schema · query task data', detail: 'The model emits structured arguments. The application validates them, executes the Supabase call, and returns the result. These tools can be exposed through the Supabase MCP connection.', examples: ['list_tables({ schemas: ["public"] })', 'execute_sql({ query: "select priority, count(*) from tasks group by priority" })', 'apply_migration({ name, query }) — harness development step'], kind: 'tools' });
    add('mcp', 380, -60, { title: 'MCP connections', kicker: 'STANDARD TOOL INTERFACE', summary: 'Supabase · GitHub · Chrome', detail: 'An MCP client discovers the tools offered by connected servers and routes calls to them. The model sees tool descriptions and selected results, not entire external systems.', examples: ['Supabase: list_tables · execute_sql · apply_migration', 'GitHub: get_file_contents · issue_read · create_pull_request', 'Chrome: navigate_page · take_snapshot · take_screenshot'], kind: 'mcp' });
    add('rag', 820, 0, { title: 'Supabase vector database', kicker: 'RAG / RELEVANT KNOWLEDGE', summary: 'Priority rules · schema notes · UI guide', detail: 'Index documents as chunks with embeddings in Supabase Postgres + pgvector. Embed the question, retrieve matching chunks, and insert cited excerpts into context. Retrieval adds knowledge at inference time; it does not retrain the model.', examples: ['task-priority-rules.md → high / medium / low', 'team-access-policy.md → team-level visibility', 'ui-patterns.md → filter behavior', 'Question → embedding → similarity search → top excerpts'], kind: 'rag' });
    link('model', 'tools', 'tool request'); link('tools', 'model', 'query results', true); link('mcp', 'model', 'tool definitions', true); link('rag', 'model', 'retrieved excerpts');
  }
  return { nodes, edges };
}
export default function AgentStructurePage() {
  const [stage, setStage] = useState<Stage>('harness');
  const [selected, setSelected] = useState('model');
  const config = stages[stage];
  const { nodes, edges } = buildDiagram(stage);
  nodes.forEach(node => { node.data.inspect = () => setSelected(node.id); node.focusable = false; });
  const detail = nodes.find(node => node.id === selected)?.data || nodes[1].data;
  return <section className="agent-explorer">
    <div className="agent-era-navigation">
      <button className="agent-modern-choice" aria-pressed={stage === 'harness'} onClick={() => setStage('harness')}><span>OUR MAIN FOCUS</span><strong>Modern Coding Agent Harness</strong><small>Model + tools + a system that executes</small></button>
      <div className="agent-history"><span>See what this was before modern tools</span><div>{(['prompt', 'context'] as Stage[]).map(id => <button key={id} aria-pressed={stage === id} onClick={() => { setStage(id); setSelected('model'); }}><small>{stages[id].era}</small>{stages[id].label}</button>)}</div></div>
    </div>
    {stage === 'harness' ? <HarnessExperience/> : <>
    <div className="agent-workspace">
      <header className="agent-canvas-heading"><div><h2>{config.title}</h2><p>{config.subtitle}</p></div><span>{config.window} <small>illustrative tokens</small></span></header>
      <div className={`agent-flow agent-flow-${stage}`} aria-label={`${config.label} interactive diagram`}>
        <ReactFlow key={stage} nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: .15 }} minZoom={.25} maxZoom={1.5} nodesDraggable={false} nodesConnectable={false} elementsSelectable edgesFocusable={false} deleteKeyCode={null} onNodeClick={(_, node) => setSelected(node.id)} colorMode="dark" preventScrolling={false}><Background color="#34404f" gap={22} size={1}/><Controls showInteractive={false}/></ReactFlow>
      </div>
      <div className="agent-component-picker"><label htmlFor="agent-component">Inspect a component</label><select id="agent-component" value={selected} onChange={event => setSelected(event.target.value)}>{nodes.map(node => <option key={node.id} value={node.id}>{node.data.title}</option>)}</select></div>
      <div className="agent-canvas-caption"><span>Click a node to explore · drag to pan · use + / − to zoom</span><span>Illustrative architecture · no live tool calls</span></div>

    </div>
    <div className="agent-reading"><article className="agent-prompt"><span className="agent-section-label">THE REQUEST / {config.era}</span><h3>A reasonable coding task</h3><p>{config.prompt}</p></article><article className="agent-inspector" aria-live="polite"><span className="agent-section-label">INSIDE THE DIAGRAM / SELECTED NODE</span><h3>{detail.title}</h3><p>{detail.detail}</p>{detail.examples && <ul>{detail.examples.map(example => <li key={example}><code>{example}</code></li>)}</ul>}</article></div>
    </>}
    <div className="agent-explanation"><article><span className="agent-section-label">HOW IT WORKS</span><h3>{config.label}</h3><p>{config.architecture}</p></article><article><span className="agent-section-label">WHAT CHANGES</span><h3>{stage === 'prompt' ? 'Instruction design' : stage === 'context' ? 'Information design' : 'Execution design'}</h3><p>{config.difference}</p></article></div>
    <p className="agent-footnote">4K → 32K → 128K illustrates increasingly capable model configurations, not a universal timeline or scale drawing. Context limits belong to the model; a harness manages the available budget. These practices overlap, and MCP examples reflect tools available today.</p>
    <details className="agent-sources"><summary>References & tool examples</summary><a href="https://reactflow.dev/showcase" target="_blank" rel="noreferrer">Visual inspiration: React Flow / Bleu AI / chaiNNer ↗</a><a href="https://supabase.com/docs/guides/ai-tools/mcp" target="_blank" rel="noreferrer">Supabase MCP ↗</a><a href="https://github.com/github/github-mcp-server" target="_blank" rel="noreferrer">GitHub MCP ↗</a><a href="https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md" target="_blank" rel="noreferrer">Chrome DevTools MCP ↗</a><a href="https://developers.notion.com/guides/mcp/mcp-supported-tools" target="_blank" rel="noreferrer">Notion MCP ↗</a><a href="https://vercel.com/docs/agent-resources/vercel-mcp/tools" target="_blank" rel="noreferrer">Vercel MCP ↗</a><p>Function snippets illustrate the available operations; connection settings, permissions, and required arguments vary by server.</p></details>
  </section>;
}
