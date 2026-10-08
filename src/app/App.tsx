import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowUpRight, ArrowRight, Code2, Layers, Sparkles } from 'lucide-react';
import ModelOverview from './ModelOverview';
import ResumePage from './components/ResumePage';
import ProjectsPage from './components/ProjectsPage';
import ToolBeltPage from './components/ToolBeltPage';
import MyCodePage from './components/MyCodePage';
const AgentStructurePage = lazy(() => import('./components/AgentStructurePage'));
import '../styles/portfolio.css';

const FitCoachPage = lazy(() => import('./FitCoachPage'));
const MLBPage = lazy(() => import('./MLBPage'));
const BenchmarkEval = lazy(() => import('./BenchmarkEval'));

const pages = [
  ['welcome', 'Welcome'], ['resume', 'Resume'], ['experience', 'Tool Belt'],
  ['projects', 'My Projects'], ['agents', 'Agent Structure'], ['code', 'ML App'],
  ['model-overview', 'Model Overview'],
  ['benchmark-eval', 'Agent Design'], ['mlb', 'MLB'], ['fitcoach', 'FitCoach (In Dev)'],
] as const;
type Page = typeof pages[number][0];
const readPage = (): Page => {
  const hash = window.location.hash.slice(1);
  return pages.find(([id]) => id === hash)?.[0] ?? 'welcome';
};
const details = {
  resume: ['The professional snapshot.', 'A place for my resume, skills, and qualifications.', 'Resume coming soon', 'My resume will be available here.'],
  agents: ['Ideas that take action.', 'A home for AI agents, workflows, and experiments.', 'Agents coming soon', 'Agent demos and workflow walkthroughs will be added here.'],
} as const;

export default function App() {
  const [page, setPage] = useState<Page>(readPage);
  useEffect(() => {
    const navigate = () => { setPage(readPage()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => {
    document.title = `${pages.find(([id]) => id === page)?.[1]} | Scott Marshall`;
  }, [page]);
  return <div className={`portfolio ${page !== 'model-overview' && page !== 'benchmark-eval' ? 'portfolio-home' : ''}`}>
    <a className="portfolio-skip" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
    <header className="portfolio-header">
      <a className="portfolio-brand" href="#welcome"><span className="portfolio-monogram">SM<span>.</span></span><span>Scott Marshall<small>PORTFOLIO</small></span></a>
      <nav aria-label="Main navigation">{pages.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={page === id ? 'page' : undefined}>{label}</a>)}</nav>
      <a className="portfolio-github" href="https://github.com/SpicyAIDev" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15}/></a>
    </header>
    <main id="main-content" tabIndex={-1}>
      {page === 'fitcoach' ? <Suspense fallback={<p role="status">Loading FitCoach…</p>}><FitCoachPage/></Suspense> : page === 'mlb' ? <Suspense fallback={<p role="status">Loading MLB…</p>}><MLBPage/></Suspense> : page === 'model-overview' ? <ModelOverview/> : page === 'benchmark-eval' ? <Suspense fallback={<p className="portfolio-content" role="status">Loading Agent Design…</p>}><BenchmarkEval/></Suspense> : <div className="portfolio-content">
        {page === 'welcome' ? <>
          <section className="portfolio-hero">
            <div><p className="portfolio-eyebrow"><span/> WELCOME TO MY CORNER OF THE INTERNET</p>
              <h1>A little about me.<br/>A lot about <em>what’s next.</em></h1>
              <p className="portfolio-intro">I’m Scott. This is where my experience, projects, and explorations in AI come together. Take a look around.</p>
              <div className="portfolio-actions"><a className="portfolio-primary" href="#projects">Explore my projects <ArrowRight size={17}/></a><a className="portfolio-secondary" href="#resume">View resume <ArrowUpRight size={17}/></a></div>
            </div>
            <div className="portfolio-art" aria-hidden="true"><div className="portfolio-orbit orbit-one"/><div className="portfolio-orbit orbit-two"/><div className="portfolio-orbit orbit-three"/><div className="portfolio-art-core"><Layers size={44}/></div><span className="art-label label-one">IDEAS</span><span className="art-label label-two">EXPERIMENTS</span><span className="art-label label-three">BUILDING</span><div className="art-caption">ALWAYS A WORK IN PROGRESS <span>↗</span></div></div>
          </section>
          <section className="portfolio-explore"><div className="portfolio-section-heading"><div><p className="portfolio-eyebrow">TAKE A LOOK AROUND</p><h2>A few places to start.</h2></div><span>Explore the things I’m building and learning.</span></div>
            <div className="portfolio-cards">
              <a className="portfolio-card" href="#model-overview"><Layers/><span className="portfolio-card-index">01 / EXPLORE</span><h3>Model Overview <ArrowUpRight/></h3><p>Follow the GPT pipeline, from the first token to the final output, with interactive visualizations.</p><span className="portfolio-tag">INTERACTIVE GUIDE</span></a>
              <a className="portfolio-card" href="#agents"><Sparkles/><span className="portfolio-card-index">02 / DISCOVER</span><h3>Agent Structure <ArrowUpRight/></h3><p>Explore how prompts, context, and harnesses turn a model into an agent.</p><span className="portfolio-tag">INTERACTIVE GUIDE</span></a>
              <a className="portfolio-card" href="#code"><Code2/><span className="portfolio-card-index">03 / LOOK INSIDE</span><h3>ML App <ArrowUpRight/></h3><p>Go behind the interface. Explore the source and follow the work on GitHub.</p><span className="portfolio-tag">OPEN THE SOURCE</span></a>
            </div>
          </section>
        </> : <>
          <p className="portfolio-eyebrow">SCOTT MARSHALL / {pages.find(([id]) => id === page)?.[1].toUpperCase()}</p>
          <h1 className="portfolio-page-title">{pages.find(([id]) => id === page)?.[1]}</h1>
          {page === 'experience' ? <ToolBeltPage/> : page === 'resume' ? <ResumePage/> : page === 'projects' ? <ProjectsPage/> : page === 'agents' ? <Suspense fallback={<p role="status">Loading Agent Structure…</p>}><AgentStructurePage/></Suspense> : page === 'code' ? <MyCodePage/> : <><h2 className="portfolio-subtitle">{details[page][0]}</h2><p className="portfolio-intro">{details[page][1]}</p><div className="portfolio-empty"><span className="portfolio-tag">IN PROGRESS</span><h2>{details[page][2]}</h2><p>{details[page][3]}</p></div></>}
        </>}
        <footer className="portfolio-footer"><span>Scott Marshall <span className="footer-dot">/</span> Personal space</span><span>Curiosity. Experiments. Progress.</span><a href="https://github.com/SpicyAIDev" target="_blank" rel="noreferrer">Find me on GitHub ↗</a></footer>
      </div>}
    </main>
  </div>;
}
