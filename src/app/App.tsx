import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowUpRight, FileUser, Github, Network, BrainCircuit, Layers, Activity, Dumbbell } from 'lucide-react';
import { TeddyBear } from '../fitcoach/app/prototype/TeddyBrand';
import ModelOverview from './ModelOverview';
import ResumePage from './components/ResumePage';
import ProjectsPage from './components/ProjectsPage';
import ToolBeltPage from './components/ToolBeltPage';
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
  { id: 'fitcoach', label: 'Coach Teddy', icon: Dumbbell, tone: 'pink' },
  { id: 'mlb', label: 'Data/ Model Viz', icon: Activity, tone: 'cyan' },
  { id: 'projects', label: 'Github', icon: Github, tone: 'violet' },
] as const;
type Page = typeof pages[number]['id'] | 'experience' | 'welcome';
const navigation = [pages[0], { id: 'defense', label: 'Defense Apps', icon: FileUser, tone: 'amber' }, ...pages.slice(1)];
const readPage = (): Page => {
  const hash = window.location.hash.slice(1);
  if (!hash || hash === 'welcome') return 'welcome';
  return hash === 'experience' ? hash : pages.find(page => page.id === hash)?.id ?? 'resume';
};
export default function App() {
  const [page, setPage] = useState<Page>(readPage);
  const label = page === 'welcome' ? 'Welcome' : page === 'experience' ? 'Tool Belt' : pages.find(item => item.id === page)?.label;
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
  useEffect(() => {
    if (page !== 'welcome') return;
    const enter = (event: KeyboardEvent) => { if (event.key === 'Enter') { event.preventDefault(); window.location.hash = 'resume'; } };
    window.addEventListener('keydown', enter);
    return () => window.removeEventListener('keydown', enter);
  }, [page]);
  if (page === 'welcome') return <main className="portfolio-landing">
    <a className="portfolio-landing-enter" href="#resume" aria-label="You found me! Welcome to Scott Marshall's Portfolio. Open resume.">
      <img className="portfolio-landing-image" src={`${import.meta.env.BASE_URL}profile/surf-sunset.jpg`} alt="Scott with a surfboard at sunset on the beach" fetchPriority="high"/>
      <div className="portfolio-landing-copy"><h1>You found me!</h1><p>Welcome to Scott Marshall's Portfolio</p></div>
    </a>
  </main>;
  return <div className={`portfolio ${page === 'resume' ? 'portfolio-resume' : page === 'projects' ? 'portfolio-projects' : ''} ${page !== 'model-overview' && page !== 'benchmark-eval' ? 'portfolio-home' : ''}`}>
    <a className="portfolio-skip" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <header className="portfolio-header">
      <a className="portfolio-brand" href="#resume" aria-label="Scott Marshall home"><span className="portfolio-profile-photo"><img src={`${import.meta.env.BASE_URL}profile/surf-sunset.jpg`} alt=""/></span></a>
      <nav aria-label="Main navigation">{navigation.map(({ id, label, icon: Icon, tone }) => <a className={`nav-tab tone-${tone}`} key={id} href={id === 'defense' ? './fleet-geek/index.html' : `#${id}`} aria-current={page === id ? 'page' : undefined}><>{id === 'defense' ? <img className="defense-nav-logo" src={`${import.meta.env.BASE_URL}fleet-geek/assets/person-silhouette.png`} alt=""/> : id === 'fitcoach' ? <TeddyBear/> : <Icon size={16} aria-hidden="true"/>}</>{label}</a>)}</nav>
    </header>
    <main id="main-content" tabIndex={-1}>
      {page === 'fitcoach' ? <Suspense fallback={<p role="status">Loading Coach Teddy…</p>}><FitCoachPage/></Suspense> : page === 'mlb' ? <Suspense fallback={<p role="status">Loading MLB…</p>}><MLBPage/></Suspense> : page === 'model-overview' ? <ModelOverview/> : page === 'benchmark-eval' ? <Suspense fallback={<p role="status">Loading My Architecture…</p>}><BenchmarkEval/></Suspense> : <div className="portfolio-content">
        {page === 'resume' ? <ResumePage/> : <>
          <p className="portfolio-eyebrow">SCOTT MARSHALL / PORTFOLIO</p><h1 className="portfolio-page-title">{label}</h1>
          {page === 'experience' ? <ToolBeltPage/> : page === 'projects' ? <ProjectsPage/> : page === 'agents' ? <Suspense fallback={<p role="status">Loading How Agents Work…</p>}><AgentStructurePage/></Suspense> : null}
        </>}
        <footer className="portfolio-footer"><span>Scott Marshall <span className="footer-dot">/</span> AI Developer &amp; Data Engineer</span><a href="https://github.com/SpicyAIDev" target="_blank" rel="noreferrer">Find me on GitHub ↗</a></footer>
      </div>}
    </main>
  </div>;
}
