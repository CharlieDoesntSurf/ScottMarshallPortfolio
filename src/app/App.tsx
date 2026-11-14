import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowUpRight, FileUser, FolderGit2, Network, BrainCircuit, Layers, FlaskConical, Activity, Dumbbell, Rocket } from 'lucide-react';
import ModelOverview from './ModelOverview';
import ResumePage from './components/ResumePage';
import ProjectsPage from './components/ProjectsPage';
import ToolBeltPage from './components/ToolBeltPage';
import MyCodePage from './components/MyCodePage';
import '../styles/portfolio.css';
import '../styles/resume-refresh.css';
const AgentStructurePage = lazy(() => import('./components/AgentStructurePage'));
const FitCoachPage = lazy(() => import('./FitCoachPage'));
const MLBPage = lazy(() => import('./MLBPage'));
const BenchmarkEval = lazy(() => import('./BenchmarkEval'));
const pages = [
  { id: 'resume', label: 'Resume', icon: FileUser, tone: 'mint' },
  { id: 'model-overview', label: 'Building LLM’s', icon: BrainCircuit, tone: 'violet' },
  { id: 'agents', label: 'How Agents Work', icon: Network, tone: 'cyan' },
  { id: 'benchmark-eval', label: 'My Architecture', icon: Layers, tone: 'amber' },
  { id: 'code', label: 'My Models', icon: FlaskConical, tone: 'rose' },
  { id: 'projects', label: 'My Projects', icon: FolderGit2, tone: 'violet' },
  { id: 'mlb', label: 'MLB', icon: Activity, tone: 'cyan' },
  { id: 'fitcoach', label: 'FitCoach', icon: Dumbbell, tone: 'mint' },
] as const;
type Page = typeof pages[number]['id'] | 'experience';
const readPage = (): Page => {
  const hash = window.location.hash.slice(1);
  return hash === 'experience' ? hash : pages.find(page => page.id === hash)?.id ?? 'resume';
};
export default function App() {
  const [page, setPage] = useState<Page>(readPage);
  const label = page === 'experience' ? 'Tool Belt' : pages.find(item => item.id === page)?.label;
  useEffect(() => {
    const navigate = () => {
      if (window.location.hash === '#fleet-geek') { window.location.replace('./fleet-geek/index.html'); return; }
      setPage(readPage()); window.scrollTo(0, 0);
    };
    if (window.location.hash === '#fleet-geek') navigate();
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => { document.title = `${label} | Scott Marshall`; }, [label]);
  return <div className={`portfolio ${page !== 'model-overview' && page !== 'benchmark-eval' ? 'portfolio-home' : ''}`}>
    <a className="portfolio-skip" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <header className="portfolio-header">
      <a className="portfolio-brand" href="#resume" aria-label="Scott Marshall home"><span className="portfolio-monogram">SM<span>.</span></span></a>
      <nav aria-label="Main navigation">{pages.map(({ id, label, icon: Icon, tone }) => <a className={`nav-tab tone-${tone}`} key={id} href={`#${id}`} aria-current={page === id ? 'page' : undefined}><Icon size={16} aria-hidden="true"/>{label}</a>)}<a className="nav-tab tone-amber" href="./fleet-geek/index.html"><Rocket size={16} aria-hidden="true"/>Fleet Geek <ArrowUpRight size={12}/></a></nav>
    </header>
    <main id="main-content" tabIndex={-1}>
      {page === 'fitcoach' ? <Suspense fallback={<p role="status">Loading FitCoach…</p>}><FitCoachPage/></Suspense> : page === 'mlb' ? <Suspense fallback={<p role="status">Loading MLB…</p>}><MLBPage/></Suspense> : page === 'model-overview' ? <ModelOverview/> : page === 'benchmark-eval' ? <Suspense fallback={<p role="status">Loading My Architecture…</p>}><BenchmarkEval/></Suspense> : <div className="portfolio-content">
        {page === 'resume' ? <ResumePage/> : <>
          <p className="portfolio-eyebrow">SCOTT MARSHALL / PORTFOLIO</p><h1 className="portfolio-page-title">{label}</h1>
          {page === 'experience' ? <ToolBeltPage/> : page === 'projects' ? <ProjectsPage/> : page === 'agents' ? <Suspense fallback={<p role="status">Loading How Agents Work…</p>}><AgentStructurePage/></Suspense> : <MyCodePage/>}
        </>}
        <footer className="portfolio-footer"><span>Scott Marshall <span className="footer-dot">/</span> AI Developer &amp; Data Engineer</span><a href="https://github.com/SpicyAIDev" target="_blank" rel="noreferrer">Find me on GitHub ↗</a></footer>
      </div>}
    </main>
  </div>;
}
