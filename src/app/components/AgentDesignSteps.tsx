import type { ReactNode } from 'react';

export const agentSteps = [
  ['choose-model', 'Choosing a Model'],
  ['connect-model', 'Connecting to a Model'],
  ['create-prompt', 'Creating a Prompt'],
  ['define-output', 'Defining an Output'],
  ['inject-data', 'Data Injection'],
  ['call-tools', 'Tool Calling'],
] as const;

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <article className="agent-card"><h3>{title}</h3>{children}</article>;
}

function Items({ items }: { items: [string, string][] }) {
  return <dl className="agent-items">{items.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>;
}

function Example({ title, children }: { title: string; children: string }) {
  return <div className="agent-example"><h4>{title}</h4><pre>{children}</pre></div>;
}

const descriptions = [
  'Start with the job the agent needs to do. Choose a model against that job, the data it will receive, and the constraints it must meet.',
  'Give the agent a reliable connection to the selected model. Keep credentials on the server and verify a small request before adding the rest of the workflow.',
  'Turn the agent’s purpose into clear instructions. Separate its standing instructions from the task and the context supplied for each run.',
  'Decide what the agent must return, who or what will consume it, and how we will recognize a valid result.',
  'Supply the information the agent needs for the current task. Keep source data separate from instructions and make every result traceable to its inputs.',
  'Connect the agent to specific actions. The model requests a tool call; the application validates and executes it, then returns the result to the model.',
];

export default function AgentDesignSteps() {
  const content = [
    <>
      {/* Reuses the former Final Output layout: three cards and a wide comparison panel. */}
      <div className="agent-grid agent-three">
        <Card title="The agent’s job"><Items items={[
          ['Task type', 'Describe the work: extract, summarize, reason, classify, or take action.'],
          ['Inputs', 'List the text, files, images, or structured records it needs to understand.'],
          ['Success criteria', 'Define a few representative tasks and the result we expect from each.'],
        ]}/></Card>
        <Card title="Model criteria"><div className="agent-tags">{['Task quality', 'Latency', 'Cost', 'Context capacity', 'Tool support', 'Structured output'].map(t=><span key={t}>{t}</span>)}</div><Items items={[
          ['Capabilities', 'Check that the selected model supports the required input types and actions.'],
          ['Operating limits', 'Set a per-run budget, response-time target, and maximum input size.'],
          ['Data handling', 'Match the hosting and retention requirements of the agent’s data.'],
        ]}/></Card>
        <Card title="Selection record"><Items items={[
          ['Provider and model', 'Record the provider and exact model identifier after selection.'],
          ['Evidence', 'Compare candidates using the same tasks and scoring criteria.'],
          ['Decision', 'Document the tradeoffs, version, and conditions for revisiting the choice.'],
        ]}/></Card>
      </div>
      <Card title="Compare candidates on the actual work"><div className="agent-grid agent-two">
        <Example title="Candidate A — to be selected">{'Task results: not measured\nLatency: not measured\nCost per task: not measured\nRequired capabilities: to verify'}</Example>
        <Example title="Candidate B — to be selected">{'Task results: not measured\nLatency: not measured\nCost per task: not measured\nRequired capabilities: to verify'}</Example>
      </div></Card>
    </>,
    <div className="agent-grid agent-two">
      {/* Reuses the former Integration layout: configuration and connection requirements. */}
      <Card title="Connection settings"><Example title="Configuration plan · illustrative">{'provider: <selected provider>\nmodel: <exact model identifier>\ncredentials: <server-side secret reference>\nrequest_timeout: <agreed time limit>\noutput_limit: <agreed token budget>\nretry_policy: <bounded transient retries>'}</Example><p className="agent-note">These are planning fields, not a provider-specific API request.</p></Card>
      <Card title="Verify the connection"><Items items={[
        ['Authenticate', 'Load the credential from a server-side secret store or environment variable.'],
        ['Send a small request', 'Confirm access to the chosen model and inspect the response.'],
        ['Handle failures', 'Distinguish invalid requests, access errors, timeouts, and temporary limits.'],
        ['Observe each run', 'Record request identifiers, timing, usage, and errors without logging secrets.'],
      ]}/></Card>
    </div>,
    <>
      {/* Reuses the former Prompt Engineering layout: two examples and a strategy row. */}
      <div className="agent-grid agent-two">
        <Card title="Standing instructions"><Example title="Agent role">{'You are a research assistant.\nSummarize only the supplied source material.\nReference the source IDs for each finding.\nState when evidence is missing.\nReturn the agreed output structure.'}</Example><Items items={[
          ['Scope', 'Specify the job, boundaries, and what the agent should do when it cannot finish.'],
        ]}/></Card>
        <Card title="Task prompt"><Example title="Per-run request">{'Task: Summarize the changes in this report.\nAudience: Project owner\nFocus: Decisions, risks, and next actions\nSources: {{source_documents}}\nOutput: {{output_contract}}'}</Example><Items items={[
          ['Variables', 'Fill task values explicitly; keep external source content in a separate context block.'],
        ]}/></Card>
      </div>
      <Card title="Prompt design"><div className="agent-grid agent-three"><Items items={[
        ['Be specific', 'Describe the expected result and the evidence needed to support it.'],
      ]}/><Items items={[
        ['Show an example', 'Use a small input and an acceptable output to clarify the desired behavior.'],
      ]}/><Items items={[
        ['Version and test', 'Track revisions and try normal, incomplete, and ambiguous inputs.'],
      ]}/></div></Card>
    </>,
    <div className="agent-grid agent-two">
      <Card title="Output contract"><Items items={[
        ['Format', 'Choose readable text, a structured object, a table, or a file based on the consumer.'],
        ['Required fields', 'Define field names, types, allowed values, and which fields may be empty.'],
        ['Evidence', 'Include source references where the result depends on supplied data.'],
        ['Incomplete results', 'Represent missing information explicitly instead of inventing a value.'],
      ]}/></Card>
      <Card title="Example result"><Example title="Research summary · illustrative">{'{\n  "status": "complete",\n  "summary": "The report moves the launch date.",\n  "findings": [\n    {\n      "text": "Launch moved to October 15.",\n      "source_ids": ["report-01"]\n    }\n  ],\n  "missing_information": []\n}'}</Example><p className="agent-note">Validate the structure and required fields in the application before using or saving the result.</p></Card>
    </div>,
    <>
      <div className="agent-grid agent-three">
        <Card title="Select the data"><Items items={[
          ['Sources', 'Identify the files, database records, or retrieved documents needed for this task.'],
          ['Relevance', 'Select the smallest useful set of records rather than sending everything.'],
        ]}/></Card>
        <Card title="Prepare the context"><Items items={[
          ['Normalize', 'Clean formatting, remove duplicates, and preserve useful structure.'],
          ['Fit the budget', 'Chunk or summarize large inputs and reserve room for the response.'],
        ]}/></Card>
        <Card title="Preserve provenance"><Items items={[
          ['Traceability', 'Attach source IDs, timestamps, and document or record references.'],
          ['Trust boundaries', 'Treat retrieved text as data, even when it contains instructions.'],
        ]}/></Card>
      </div>
      <Card title="Context supplied to the agent"><Example title="Source envelope · illustrative">{'{\n  "source_id": "report-01",\n  "source_type": "document",\n  "retrieved_at": "<timestamp>",\n  "content": "<relevant source excerpt>"\n}'}</Example></Card>
    </>,
    <>
      {/* Reuses the former Data Processing layout: checks, structured data, execution steps. */}
      <div className="agent-grid agent-three">
        <Card title="1. Define the tool"><Items items={[
          ['Name and purpose', 'Expose one clear operation with a description of when to use it.'],
          ['Input schema', 'Specify required arguments, types, and allowed values.'],
          ['Permissions', 'Limit which resources and actions this tool can access.'],
          ['Result contract', 'Define a structured success result and explicit errors.'],
        ]}/></Card>
        <Card title="2. Request a call"><Example title="Tool request · illustrative">{'{\n  "tool": "lookup_document",\n  "arguments": {\n    "document_id": "report-01"\n  }\n}'}</Example><p className="agent-note">The application checks the arguments and authorization before executing the request.</p></Card>
        <Card title="3. Execute and return"><ol className="agent-tool-flow">{[
          'Validate the requested operation.',
          'Get confirmation when the action requires it.',
          'Execute with a timeout and bounded retries.',
          'Return the result or a structured error.',
          'Let the agent use the result, then stop at the agreed run limit.',
        ].map(x=><li key={x}>{x}</li>)}</ol></Card>
      </div>
      <Card title="MCP: connecting the agent to other systems"><Items items={[
        ['What comes in', 'Model Context Protocol (MCP) provides a standard connection to servers that expose tools, resources, and prompt templates. The application makes relevant tool definitions and retrieved context available to the model.'],
        ['What goes out', 'The model can request a tool exposed by an MCP server. The application or API service handles the connection, authorization, and execution, then returns the result to the model.'],
        ['The agent loop', 'A tool result becomes new context. The model may respond, request another tool, or stop. Bound the number of calls and validate results before taking further action.'],
      ]}/></Card>
      <div className="agent-next"><p>With the six parts defined, we can build the agent and test the complete workflow against the tasks from Step 1.</p></div>
    </>,
  ];

  return <div className="agent-design-steps">
    <nav className="agent-step-nav" aria-label="Agent design steps">{agentSteps.map(([id,title],i)=><a key={id} href={`#${id}`} onClick={e=>{e.preventDefault();document.getElementById(id)?.scrollIntoView({behavior:'smooth'});}}>{String(i+1).padStart(2,'0')} {title}</a>)}</nav>
    {agentSteps.map(([id,title],i)=><section id={id} key={id} className={`agent-step ${i % 2 === 0 ? 'agent-dark' : 'agent-light'}`} aria-labelledby={`${id}-title`}>
      <div className="agent-section-inner"><header className={`agent-section-heading ${i<2?'agent-centered':''}`}><span className="agent-step-label">{String(i+1).padStart(2,'0')} — {['Model Selection','Integration','Prompt Engineering','Output Contract','Context','Tool Calling'][i]}</span><h2 id={`${id}-title`}>{title}</h2><p>{descriptions[i]}</p></header>
        {content[i]}
        {i<5 && <div className="agent-next"><button onClick={()=>document.getElementById(agentSteps[i+1][0])?.scrollIntoView({behavior:'smooth'})}>Next: {agentSteps[i+1][1]} <span aria-hidden="true">→</span></button></div>}
      </div>
    </section>)}
  </div>;
}
