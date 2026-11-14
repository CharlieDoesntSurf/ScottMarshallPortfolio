import tools from '../data/core-tools.json';
import '../../styles/tool-belt.css';
const descriptions: Record<string, string> = {
  'Languages & data': 'Model training, fine-tuning, data pipelines, and agentic development.',
  Palantir: 'AI FDE across Python repos, TypeScript repos, and Widget repos.',
  'Platforms & infrastructure': 'The foundations for building, shipping, and operating applications.',
  'Front End': 'Mostly built through agents, with hands-on testing and troubleshooting.',
  Testing: 'Automated checks, logging, and diagnostics for reliable applications.',
};
export default function ToolBeltPage({ embedded = false }: { embedded?: boolean }) {
  return <section className={`tool-belt ${embedded ? 'tool-belt-embedded' : ''}`} aria-labelledby="core-tools-title">
    <div className="tool-belt-section-heading"><div><p className="portfolio-eyebrow">CORE STACK / FLUENT</p><h2 id="core-tools-title">Tools I build with.</h2></div><span className="tool-belt-count">{tools.length} core tools</span></div>
    <div className="tool-belt-groups">{[...new Set(tools.map(tool => tool.group))].map(group => <section key={group} className="tool-belt-subgroup" aria-label={group}>
      <div className="tool-belt-group-heading"><h3>{group}</h3><p>{descriptions[group]}</p></div>
      <ul className="tool-belt-grid">{tools.filter(tool => tool.group === group).map(tool => <li key={tool.name} className={`tool-belt-card ${tool.featured ? 'tool-featured' : ''}`} title={tool.note || undefined}>
        <div className="tool-belt-logo" aria-hidden="true">{tool.logo ? <img src={`${import.meta.env.BASE_URL}${tool.logo.replace(/^\//, '')}`} alt="" width="28" height="28" loading="lazy"/> : <span>{tool.initials}</span>}</div>
        <h4>{tool.name}</h4>{tool.featured && <span className="tool-core-label">MODEL TRAINING</span>}
      </li>)}</ul>
    </section>)}</div>
  </section>;
}
