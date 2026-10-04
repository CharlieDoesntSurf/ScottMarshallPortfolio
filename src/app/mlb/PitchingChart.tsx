import { useEffect, useState } from 'react';
import data from './data/playoff_pitchers.json';
import { PositionPlot } from './PositionPlot';
const keys=['season','half','month','week'] as const;
const labels=['Season','Half-season','Monthly','Weekly'];
export default function PitchingChart({season,league,teams,windowIndex,closeToken,onSelectPitcher,sharedCount}:{sharedCount:number;season:number;league:string;teams:string[]|null;windowIndex:number;closeToken:number;onSelectPitcher:()=>void}){
 const [role,setRole]=useState('All'),[metric,setMetric]=useState('ERA');
 const [selected,setSelected]=useState<(typeof data)[number]|null>(null);
 useEffect(()=>setSelected(null),[season,league,teams,windowIndex,role,metric,closeToken]);
 const key=keys[windowIndex];
 const seasonRows=data.filter(p=>p.season===season);
 const rows=seasonRows.filter(p=>(league==='All'||p.league===league)&&(teams===null||teams.includes(p.teamId))&&(role==='All'||p.position===role));
 const eraDomain:[number,number]=[1,7];
 const marks=rows.flatMap(p=>{const w=p.windows[key];const value=metric==='ERA'?w.era:w.games?w.outs/3:null;return value===null?[]:[{...p,position:labels[windowIndex],actualOps:metric==='ERA'?value:undefined,ops:metric==='ERA'?Math.max(eraDomain[0],Math.min(eraDomain[1],value)):value,labelSuffix:p.position}];});
 const values=seasonRows.map(p=>metric==='ERA'?p.windows[key].era:p.windows[key].outs/3).filter((v):v is number=>v!==null);
 const max=Math.max(1,...values);const domain:[number,number]=metric==='ERA'?eraDomain:[0,max*1.05];
 const stats=selected?.windows[key];
 return <section className="pitching-chart" aria-labelledby="pitching-title">
  <div className="comparison-heading"><h3 id="pitching-title">Pitchers · {metric==='ERA'?'ERA':'innings pitched'}</h3><div className="pitcher-controls"><label>Pitcher role<select aria-label="Pitcher role" value={role} onChange={e=>setRole(e.target.value)}><option value="All">All pitchers</option><option>Starter</option><option>Reliever</option></select></label><label>Pitching metric<select aria-label="Pitching metric" value={metric} onChange={e=>setMetric(e.target.value)}><option>ERA</option><option value="IP">Innings pitched</option></select></label></div><p>{rows.length} roster pitchers · {marks.length} with a plotted value. Lower ERA is better.</p></div>
  {marks.length?<PositionPlot players={marks} domain={domain} onSelect={p=>{onSelectPitcher();setSelected(rows.find(r=>r.id===p.id)??null);}} order={[labels[windowIndex]]} metric={metric} twoSidedLabels sharedCount={sharedCount}/>:<div className="empty-state">No pitching data for this window and selection.</div>}
  <p className="plot-note">IP uses baseball notation: 5.1 = 5 innings and 1 out. ERA uses a 1.0–7.0 scale; values outside it are pinned to the edge and labeled with the actual value.</p>
  {selected&&stats&&<aside className="player-detail" aria-label="Selected pitcher"><button className="close-detail" aria-label="Close pitcher details" onClick={()=>setSelected(null)}>×</button><p className="eyebrow">{selected.league} / {selected.position} / {labels[windowIndex]}</p><h3>{selected.name}</h3><p><span className="team-dot" style={{background:selected.color}}/>{selected.team}</p><dl><div><dt>ERA</dt><dd>{stats.era?.toFixed(2)??'—'}</dd></div><div><dt>IP</dt><dd>{stats.ip}</dd></div><div><dt>Games</dt><dd>{stats.games}</dd></div><div><dt>Starts</dt><dd>{stats.starts}</dd></div></dl></aside>}
 </section>;
}
