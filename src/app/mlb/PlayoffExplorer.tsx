import { lazy, Suspense, useEffect, useState } from 'react';
const PitchingChart=lazy(()=>import('./PitchingChart'));
import data from './data/playoff_players.json';
import pitchers from './data/playoff_pitchers.json';
import { PositionPlot, type Player } from './PositionPlot';
const windows=['Season','Half-season','Monthly','Weekly'];
export default function PlayoffExplorer({onSelect}:{onSelect:(p:Player|null)=>void}){
 const [pitchCloseToken,setPitchCloseToken]=useState(0);
 const [windowIndex,setWindowIndex]=useState(0);
 const [season,setSeason]=useState(2026),[league,setLeague]=useState('All'),[position,setPosition]=useState('All'),[teams,setTeams]=useState<string[]|null>(null);
 useEffect(()=>onSelect(null),[season,league,position,teams,windowIndex,onSelect]);
 const rows=data.filter(p=>p.season===season);
 const clubs=[...new Map(rows.map(p=>[p.teamId,p])).values()].sort((a,b)=>a.team.localeCompare(b.team));
 const visible=rows.filter(p=>(league==='All'||p.league===league)&&(position==='All'||p.position===position)&&(teams===null||teams.includes(p.teamId)));
 const sharedCount=Math.max(visible.length,pitchers.filter(p=>p.season===season&&(league==='All'||p.league===league)&&(teams===null||teams.includes(p.teamId))).length);
 const domain:[number,number]=[.5,1.1];
 const marks=visible.flatMap(p=>[p.ops,p.half,p.month,p.week].flatMap((ops,i)=>i!==windowIndex||ops===null?[]:[{...p,actualOps:ops,ops:Math.max(domain[0],Math.min(domain[1],ops)),fieldPosition:p.position,position:windows[i]}]));
 return <section className="explorer" aria-labelledby="playoff-title">
  <div className="explorer-heading"><div><h2 id="playoff-title">Playoff roster snapshots</h2></div></div>
  <div className="filter-bar">
   <label>Season<select aria-label="Playoff season" value={season} onChange={e=>{setSeason(+e.target.value);setTeams(null);setPosition('All');}}>{[...new Set(data.map(p=>p.season))].sort((a,b)=>b-a).map(y=><option key={y}>{y}</option>)}</select></label>
   <label>Time frame<select aria-label="OPS time frame" value={windowIndex} onChange={e=>setWindowIndex(+e.target.value)}>{windows.map((w,i)=><option value={i} key={w}>{w}</option>)}</select></label>
   <label>League<select aria-label="Playoff league" value={league} onChange={e=>setLeague(e.target.value)}><option value="All">AL + NL</option><option>AL</option><option>NL</option></select></label>
   <label>Batter position<select aria-label="Playoff position" value={position} onChange={e=>setPosition(e.target.value)}><option value="All">All positions</option>{[...new Set(rows.map(p=>p.position))].sort().map(p=><option key={p}>{p}</option>)}</select></label>
   <div className="sample-label" role="status"><strong>{visible.length}</strong> batters<span>{new Set(visible.map(p=>p.teamId)).size} teams · all PA rates</span></div>
  </div>
  <details className="team-filter"><summary>Filter teams · {teams===null?12:teams.length} selected</summary><div className="team-actions"><button onClick={()=>setTeams(null)}>Select all</button><button onClick={()=>setTeams([])}>Clear teams</button></div><div className="team-options">{clubs.map(p=><label key={p.teamId}><input type="checkbox" checked={teams===null||teams.includes(p.teamId)} onChange={e=>{const current=teams??clubs.map(c=>c.teamId);setTeams(e.target.checked?[...current,p.teamId]:current.filter(id=>id!==p.teamId));}}/><span className="team-dot" style={{background:p.color}}/>{p.team} <small>{p.league}</small></label>)}</div></details>
  <p className="plot-note">One window at a time: season, second half, final 30 days, or final 7 days. Values outside the visible OPS range are pinned to its edge and labeled with the actual value.</p>
  <div className="comparison-grid"><section className="batting-chart" aria-labelledby="batting-title"><div className="comparison-heading"><h3 id="batting-title">Batters · OPS</h3><p>Higher OPS is better. The time frame, league, and team filters apply to both charts.</p></div>
  {marks.length?<PositionPlot players={marks} domain={domain} onSelect={p=>{setPitchCloseToken(v=>v+1);onSelect({...p,ops:p.actualOps});}} order={[windows[windowIndex]]} twoSidedLabels sharedCount={sharedCount}/>:<div className="empty-state">No recorded OPS for this selection.</div>}
  </section><Suspense fallback={<p>Loading pitchers…</p>}><PitchingChart sharedCount={sharedCount} closeToken={pitchCloseToken} onSelectPitcher={()=>onSelect(null)} season={season} league={league} teams={teams} windowIndex={windowIndex}/></Suspense></div>
  <p className="plot-note">Confirmed 2026 opening-series playoff-roster batters, including DNQ players. Wild Card rosters for eight clubs; Division Series rosters for the four clubs with a bye. Pitchers with fewer than 20 AB are excluded. Missing window OPS has no dot; zero OPS remains visible. Roster membership comes from MLB’s dated active roster for each team’s first playoff game; all statistics remain regular-season only. Pitcher role is based on the most regular-season appearances as starter or reliever (ties favor starter) and stays constant across windows; it is not a projected postseason role.</p>
 </section>;
}
