import { ArrowUpRight, FileCode2, FolderOpen, Github } from 'lucide-react';
import snapshot from '../data/agent-structure.json';
import '../../styles/my-code.css';

const repo='https://github.com/CharlieDoesntSurf/sassafrass_template';
const fileUrl=(path:string)=>`${repo}/blob/${snapshot.sha}/${path.split('/').map(encodeURIComponent).join('/')}`;
const groups=[
  {name:'Application & scripts', match:(p:string)=> /^(src|scripts|tests)\//.test(p)},
  {name:'MCP & documentation', match:(p:string)=> /^(docs|mcp|\.codex|data_editing|data_retreival)\//.test(p)||p==='AGENTS.md'},
  {name:'Project configuration', match:(p:string)=> !p.includes('/')&& !['README.md','AGENTS.md'].includes(p)},
];
// Render the README's headings, lists, paragraphs and code as React text, never HTML.
function inline(text:string) {return text.split(/(`[^`]+`)/g).map((part,i)=>part.startsWith('`')?<code key={i}>{part.slice(1,-1)}</code>:part);}
function Readme() {
  const blocks=snapshot.readme.trim().split(/(```[\s\S]*?```)/g).flatMap(part=>part.startsWith('```')?[part]:part.split(/\n\s*\n/)).filter(p=>p.trim());
  return <article className="repo-readme" aria-label="Repository README">{blocks.map((block,i)=>{
    const text=block.trim();
    if(text.startsWith('```')) return <pre key={i}><code>{text.replace(/^```[^\n]*\n/,'').replace(/\n?```$/,'')}</code></pre>;
    if(text.startsWith('### ')) return <h4 key={i}>{inline(text.slice(4))}</h4>;
    if(text.startsWith('## ')) return <h3 key={i}>{inline(text.slice(3))}</h3>;
    if(text.startsWith('# ')) return <h2 key={i}>{inline(text.slice(2))}</h2>;
    if(text.startsWith('- ')) return <ul key={i}>{text.split('\n').map((line,j)=><li key={j}>{inline(line.replace(/^- /,''))}</li>)}</ul>;
    return <p key={i}>{inline(text)}</p>;
  })}</article>;
}

export default function TemplateProjectPage() {
  return <div className="my-code-page">
    <div className="code-directory-heading"><span>sassafrass_template / README.md</span><a className="portfolio-secondary" href={fileUrl('README.md')} target="_blank" rel="noreferrer">Read on GitHub <ArrowUpRight size={14}/></a></div>
    <Readme/>
    <section className="code-repository"><div className="code-repo-icon"><Github size={32}/></div><div className="code-repo-details"><span className="code-owner">CHARLIEDOESNTSURF <span>Public repository</span></span><h2>sassafrass_template</h2><p>The starter structure for application code, Python data workflows, storage, and MCP connections.</p><div className="code-repo-tags"><span>Node.js</span><span>Python</span><span>MCP</span><span>Supabase</span></div></div><a className="portfolio-primary" href={repo} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={16}/></a></section>
    <div className="code-directory-heading"><h2>Explore the repository</h2><span>{snapshot.tree.length} files · README shown above</span></div>
    {groups.map(group=><section className="code-script-group" key={group.name} aria-label={group.name}><header><div className="code-folder"><FolderOpen size={19}/><h3>{group.name}</h3><span>{snapshot.tree.filter(f=>group.match(f.path)).length}</span></div></header><ul>{snapshot.tree.filter(f=>group.match(f.path)).map(file=><li key={file.path}><a href={fileUrl(file.path)} target="_blank" rel="noreferrer"><FileCode2 size={19}/><div><strong>{file.path.split('/').at(-1)}</strong><span>{file.path.includes('/')?file.path.slice(0,file.path.lastIndexOf('/'))+'/':'Repository root'}</span></div><small>{(file.size/1024).toFixed(1)} KB</small><ArrowUpRight size={15}/></a></li>)}</ul></section>)}
    <p className="code-snapshot">README and files from commit <a href={`${repo}/tree/${snapshot.sha}`} target="_blank" rel="noreferrer">{snapshot.sha.slice(0,7)}</a>. File links open this version on GitHub.</p>
  </div>;
}
