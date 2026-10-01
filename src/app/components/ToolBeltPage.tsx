import { useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import tools from '../data/tool-belt.json';
import '../../styles/tool-belt.css';

const categories = ['All tools', ...new Set(tools.map(tool => tool.category))];

export default function ToolBeltPage() {
  const [category, setCategory] = useState('All tools');
  const filtered = tools.filter(tool => category === 'All tools' || category === tool.category);
  return <div className="tool-belt">
    <div className="tool-belt-intro"><p>The languages, platforms, and tools I work with—from data engineering and agent development to applications and infrastructure.</p><span>{tools.length}<small>TOOLS & METHODS</small></span></div>
    <div className="tool-belt-filters" aria-label="Filter tools by category">{categories.map(item=><button key={item} aria-pressed={item===category} onClick={()=>setCategory(item)}>{item}</button>)}</div>
    {(['Fluent','Some Experience'] as const).map((level,index)=>{
      const items=filtered.filter(tool=>tool.level===level);
      return <section key={level} className={`tool-belt-section ${index===0?'fluent-tools':'explored-tools'}`} aria-labelledby={`tool-level-${index}`}>
        <div className="tool-belt-section-heading"><div><span className="tool-belt-section-index">0{index+1} / {index===0?'CORE TOOLKIT':'BROADER EXPERIENCE'}</span><h2 id={`tool-level-${index}`}>{level}<span>{items.length}</span></h2><p>{index===0?'Tools I’m comfortable using to build, analyze, and deliver.':'Tools I’ve used or explored through work and personal projects.'}</p></div><ArrowDownRight size={30} aria-hidden="true"/></div>
        {items.length ? <div className="tool-belt-groups">{[...new Set(items.map(tool=>tool.group))].map(group=><section key={group} className="tool-belt-subgroup" aria-label={group}>
          <div className="tool-belt-group-heading"><h3>{group}</h3><span>{items.filter(tool=>tool.group===group).length}</span></div>
          <ul className="tool-belt-grid">{items.filter(tool=>tool.group===group).map(tool=><li key={tool.name} className="tool-belt-card"><div className="tool-belt-logo" aria-hidden="true">{tool.logo?<img src={`${import.meta.env.BASE_URL}${tool.logo.replace(/^\//, '')}`} alt="" width="30" height="30" loading="lazy"/>:<span>{tool.initials}</span>}</div><div><h4>{tool.name}</h4>{tool.category==='Palantir' && <p>Palantir</p>}</div></li>)}</ul>
        </section>)}</div>:<p className="tool-belt-empty">No matching tools in this section.</p>}
      </section>;
    })}
    {filtered.length===0 && <button className="portfolio-primary" onClick={()=>{setCategory('All tools');}}>Clear filters</button>}
  </div>;
}
