import { ArrowUpRight } from 'lucide-react';
import tools from '../data/core-tools.json';
import '../../styles/tool-belt.css';
export default function ToolBeltPage({ embedded = false }: { embedded?: boolean }) {
  return <section className={`tool-belt ${embedded ? 'tool-belt-embedded' : ''}`} aria-labelledby="core-tools-title">
    <div className="tool-belt-section-heading"><div><p className="portfolio-eyebrow">CORE STACK / FLUENT</p><div className="tool-belt-title-row"><h2 id="core-tools-title">Tools I build with.</h2>{embedded && <a className="portfolio-secondary" href="#experience">See Every Tool <ArrowUpRight size={14}/></a>}</div></div><span className="tool-belt-count">{tools.length} core tools</span></div>
    <div className="tool-belt-groups">{[...new Set(tools.map(tool => tool.group))].map(group => <section key={group} className={`tool-belt-subgroup ${group !== 'Languages & data' ? 'tool-belt-compact' : ''}`} aria-label={group}>
      <div className="tool-belt-group-heading"><h3>{group}</h3></div>
      <ul className="tool-belt-grid">{tools.filter(tool => tool.group === group).map(tool => <li key={tool.name} className={`tool-belt-card ${tool.featured ? 'tool-featured' : ''}`} title={tool.note || undefined}>
        <div className="tool-belt-logo" aria-hidden="true">{tool.logo ? <img src={`${import.meta.env.BASE_URL}${tool.logo.replace(/^\//, '')}`} alt="" width="28" height="28" loading="lazy"/> : <span>{tool.initials}</span>}</div>
        <h4>{tool.name}</h4>{tool.featured && <span className="tool-core-label">MODEL TRAINING</span>}
      </li>)}</ul>
    </section>)}</div>
  </section>;
}
