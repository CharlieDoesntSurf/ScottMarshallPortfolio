import { ArrowUpRight, FileCode2, FolderOpen, Github, Globe } from 'lucide-react';
import snapshot from '../data/code-scripts.json';
import '../../styles/my-code.css';

const repository = 'https://github.com/CharlieDoesntSurf/stat_stack_nfl';
const groups = [
  {prefix:'ingest/',title:'Data ingestion',description:'Source clients, retrieval scripts, and ingestion runners.'},
  {prefix:'pandas/',title:'Data transformation',description:'CSV loading and aggregation from bronze to silver.'},
  {prefix:'database/',title:'Database connections & loading',description:'Supabase and Pinecone clients, operations, and database loading.'},
  {prefix:'ml/',title:'Machine learning & visualization',description:'Embeddings, model workflows, reports, and visualization scripts.'},
];

export default function MyCodePage() {
  return <div className="my-code-page">
    <p className="portfolio-intro">Inside my NFL data project—from collecting source data to preparing datasets and exploring predictive models.</p>
    <section className="code-repository" aria-labelledby="code-repo-title">
      <div className="code-repo-icon"><Github size={32}/></div>
      <div className="code-repo-details"><span className="code-owner">CHARLIEDOESNTSURF <span><Globe size={12}/> Public repository</span></span><h2 id="code-repo-title">stat_stack_nfl</h2><p>A Python repository for NFL data ingestion, transformation, database loading, and machine learning.</p><div className="code-repo-tags"><span>Python</span><span>Data engineering</span><span>Machine learning</span><span>{snapshot.scripts.length} scripts</span></div></div>
      <a className="portfolio-primary" href={repository} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={16}/></a>
    </section>
    <div className="code-directory-heading"><h2>Explore the scripts</h2><span>Grouped by workflow · {snapshot.scripts.length} files</span></div>
    {groups.map(group=>{
      const scripts=snapshot.scripts.filter(script=>script.path.startsWith(group.prefix));
      return <section className="code-script-group" key={group.prefix} aria-label={group.title}>
        <header><div className="code-folder"><FolderOpen size={19}/><h3>{group.title}</h3><span>{scripts.length}</span></div><p>{group.description}</p></header>
        <ul>{scripts.map(script=><li key={script.path}><a href={`${repository}/blob/${snapshot.sha}/${script.path.split('/').map(encodeURIComponent).join('/')}`} target="_blank" rel="noreferrer"><FileCode2 size={19}/><div><strong>{script.path.split('/').at(-1)}</strong><span>{script.path.slice(0,script.path.lastIndexOf('/'))}/</span></div><small>{(script.size/1024).toFixed(1)} KB</small><ArrowUpRight size={15}/></a></li>)}</ul>
      </section>;
    })}
    <p className="code-snapshot">All scripts listed from the public repository at commit <a href={`${repository}/tree/${snapshot.sha}`} target="_blank" rel="noreferrer">{snapshot.sha.slice(0,7)}</a>. File links open this version on GitHub.</p>
  </div>;
}
