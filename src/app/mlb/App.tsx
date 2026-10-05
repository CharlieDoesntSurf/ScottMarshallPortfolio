import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowUpRight, ChartNoAxesCombined, ChevronRight, X } from 'lucide-react';
import { loadQualified } from './data';
import { useMlbQuery, QueryStatus } from './useMlbQuery';
import './styles.css';
import { PositionPlot, type Player } from './PositionPlot';
import PlayoffExplorer from './PlayoffExplorer';
const RollingTrends=lazy(()=>import('./RollingTrends'));
const order=['C','1B','2B','3B','SS','LF','CF','RF','DH','PH','PR','P'];
export default function App(){
 const [view,setView]=useState('playoff');
 const [season,setSeason]=useState(2026),[league,setLeague]=useState('All'),[position,setPosition]=useState('All');
 const [selected,setSelected]=useState<Player|null>(null);
 const query=useMlbQuery(view==='position'?`qualified:${season}`:null,()=>loadQualified(season));
 const seasonPlayers=query.data??[];
 const visible=useMemo(()=>seasonPlayers.filter(p=>(league==='All'||p.league===league)&&(position==='All'||p.position===position)),[seasonPlayers,league,position]);
 const positions=order.filter(pos=>seasonPlayers.some(p=>p.position===pos));
 const domain:[number,number]=[.5,1.05];
 const plottedVisible=useMemo(()=>visible.map(p=>({...p,actualOps:p.ops,ops:Math.max(domain[0],Math.min(domain[1],p.ops))})),[visible]);
 function changeSeason(value:number){setSeason(value);setPosition('All');setSelected(null);}
 return <div className="mlb-app app-shell">
  <a className="skip-link" href="#main">Skip to chart</a>
  <header className="site-header">
   <a className="brand" href="https://charliedoesntsurf.github.io/ScottMarshallPortfolio/"><span className="monogram">SM<span>.</span></span><span>Scott Marshall<small>PROJECT EXPLORATIONS</small></span></a>
   <div className="project-nav"><ChartNoAxesCombined size={16}/><span>MLB Trends</span></div>
   <a className="portfolio-link" href="https://charliedoesntsurf.github.io/ScottMarshallPortfolio/#projects">Portfolio <ArrowUpRight size={15}/></a>
  </header>
  <main id="main" className="page-content">
   <div className="breadcrumbs"><span>Experiments</span><ChevronRight size={12}/><span>MLB Trends</span><ChevronRight size={12}/><span>Hitting explorer</span></div>
   <section className="page-intro">
    <div><h1>Pre-Machine Learning</h1><p className="intro-copy">This is our data before it goes into any models. Basic Trends in useful visualizations.</p></div>
   </section>
   <div className="view-tabs" aria-label="Chart views"><button aria-pressed={view==='playoff'} onClick={()=>{setView('playoff');setSelected(null);}}>Playoff Positions</button><button aria-pressed={view==='position'} onClick={()=>{setView('position');setSelected(null);}}>Player Position</button><button aria-pressed={view==='rolling'} onClick={()=>{setView('rolling');setSelected(null);}}>Rolling Offense</button></div>
   {view==='rolling'?<Suspense fallback={<p role="status">Loading rolling trends…</p>}><RollingTrends/></Suspense>:view==='playoff'?<PlayoffExplorer onSelect={setSelected}/>:<section className="explorer" aria-labelledby="chart-title">
    <div className="explorer-heading"><div><p className="eyebrow">COMPARE THE FIELD</p><h2 id="chart-title">OPS by position</h2></div></div>
    <div className="filter-bar">
     <label>Season<select aria-label="Season" value={season} onChange={e=>changeSeason(Number(e.target.value))}>{[2026,2025,2024,2023,2022].map(y=><option key={y}>{y}</option>)}</select></label>
     <label>League<select aria-label="League" value={league} onChange={e=>{setLeague(e.target.value);setSelected(null);}}><option value="All">AL + NL</option><option>AL</option><option>NL</option></select></label>
     <label>Position<select aria-label="Position" value={position} onChange={e=>{setPosition(e.target.value);setSelected(null);}}><option value="All">All positions</option>{positions.map(p=><option key={p}>{p}</option>)}</select></label>
     <div className="sample-label" role="status"><strong>{visible.length}</strong> qualified players<span>PA rate &gt;30% · season OPS</span></div>
    </div>
    <div className="plot-note"><span>Dots = exact OPS. Labels identify player + team.</span><span>Select a player for details.</span></div>
    {query.loading||query.error?<QueryStatus error={query.error} retry={query.retry}/>:visible.length?<PositionPlot players={plottedVisible} domain={domain} onSelect={p=>setSelected(visible.find(player=>player.id===p.id)??p)}/>:<div className="empty-state">No qualifying players in this selection.</div>}
   </section>}
   <details className="methodology"><summary>About this comparison</summary><div><p>In the By position view, players qualify when their full-season plate appearances exceed 30% of the highest full-season PA assigned to their final team. The snapshot views exclude postseason statistics. Rolling trends explicitly separates regular-season and postseason values.</p><p>Position is the role with the most regular-season games. Traded players retain their combined season stats and are shown with their final team. The By position view covers all qualifying players; the Playoff teams view is restricted to confirmed opening-series rosters.</p><p>The OPS scale stays constant within each season. Small horizontal offsets separate dots; leader lines connect labels to exact values. Team colors follow ESPN’s primary team-color metadata, including when viewing historical seasons.</p><p>Regular-season snapshot collected October 2, 2026 UTC. Player stats: MLB Stats API. WAR: Baseball Reference. This page explores performance; it does not establish which metrics predict postseason success.</p></div></details>
   <footer><span>Scott Marshall <span className="footer-dot">/</span> MLB Trends</span><span>Curiosity. Experiments. Progress.</span><a href="https://github.com/CharlieDoesntSurf/ScottMarshallPortfolio" target="_blank" rel="noreferrer">Portfolio on GitHub <ArrowUpRight size={13}/></a></footer>
  </main>
  {selected&&<aside className="player-detail" aria-label="Selected player"><button className="close-detail" onClick={()=>setSelected(null)} aria-label="Close player details"><X size={17}/></button><p className="eyebrow">{selected.league} / {selected.fieldPosition??selected.position} / {selected.season}</p><h3>{selected.name}</h3><p><span className="team-dot" style={{background:selected.color}}/>{selected.team}</p><dl><div><dt>{selected.fieldPosition?selected.position:'Season'} OPS</dt><dd>{selected.ops.toFixed(3)}</dd></div><div><dt>PA</dt><dd>{selected.pa}</dd></div><div><dt>Play rate</dt><dd>{selected.rate.toFixed(1)}%</dd></div><div><dt>Bats</dt><dd>{selected.bats}</dd></div></dl></aside>}
 </div>;
}
