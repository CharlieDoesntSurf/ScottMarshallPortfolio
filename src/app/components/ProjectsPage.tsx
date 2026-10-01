import { useState } from 'react';
import { ArrowUpRight, Github, Lock, Search } from 'lucide-react';
import projects from '../data/projects.json';

const categories = ['All projects', ...new Set(projects.map(project => project.category))];

export default function ProjectsPage() {
  const [category, setCategory] = useState('All projects');
  const [query, setQuery] = useState('');
  const visible = projects.filter(project =>
    (category === 'All projects' || project.category === category) &&
    [project.name, project.displayName, project.description, ...project.languages, ...project.tools, ...project.libraries].join(' ').toLowerCase().includes(query.toLowerCase().trim())
  );
  return <section className="projects-page" aria-label="GitHub projects">
    <p className="portfolio-intro">A look inside my repositories: what each project does, what it’s built with, and the data it works with.</p>
    <div className="projects-toolbar"><label className="projects-search"><Search size={17}/><span className="sr-only">Search projects, languages, or tools</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects, languages, tools…" type="search"/></label><span aria-live="polite">{visible.length} of {projects.length} repositories</span></div>
    <div className="projects-filters" aria-label="Filter by category">{categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="projects-grid">{visible.map(project => <article className="project-entry" key={project.name}>
      <div className="project-meta"><span>{project.category}</span><span>{project.private && <Lock size={11}/>} {project.private ? 'Private' : 'Public'}</span></div>
      <h2>{project.displayName}</h2><p className="project-description">{project.description}</p>
      <dl><div><dt>Languages</dt><dd className="project-tags">{project.languages.map(language => <span key={language}>{language}</span>)}</dd></div><div><dt>Tools & platforms</dt><dd>{project.tools.join(' · ')}</dd></div><div><dt>Libraries & dependencies</dt><dd>{project.libraries.join(' · ')}</dd></div><div><dt>Inputs & data</dt><dd>{project.inputs}</dd></div><div><dt>How to use it</dt><dd>{project.usage}</dd></div></dl>
      <footer><a href={project.url} target="_blank" rel="noreferrer" aria-label={`View ${project.displayName} on GitHub`}><Github size={16}/> View repository <ArrowUpRight size={15}/></a>{project.private && <small>Repository access required</small>}{project.name === 'GPTModelOverviewPage' && <a href="#model-overview">Explore demo →</a>}</footer>
    </article>)}</div>
    {visible.length === 0 && <div className="portfolio-empty"><h2>No matching projects</h2><p>Try a different language, tool, or project name.</p><button className="portfolio-primary" onClick={() => {setQuery('');setCategory('All projects');}}>Clear filters</button></div>}
    <p className="projects-note">Repository snapshot · September 2026. Descriptions are based on repository documentation, dependencies, and source structure. Declared libraries may include starter dependencies.</p>
  </section>;
}
