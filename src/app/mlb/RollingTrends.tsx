import { useEffect, useMemo, useState } from 'react';
import { Brush, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { loadTeams, loadTeam, type Rates, type Point, type Team } from './data';
import { useMlbQuery, QueryStatus } from './useMlbQuery';

type Metric='both'|'ops'|'avg';
type ChartPoint=Point&{[key:`${'avg'|'ops'}_${string}`]:number|null};

const windows=[{key:'10',label:'10 games',color:'#b8a4fb'},{key:'30',label:'30 games',color:'#4dd9cd'},{key:'90',label:'90 games',color:'#ffc266'},{key:'season',label:'Season to date',color:'#ff8394'}] as const;
const metricLabels:Record<Metric,string>={both:'AVG + OPS',ops:'OPS only',avg:'AVG only'};

function BoundaryLabel({viewBox,games}:{viewBox?:{x?:number;y?:number};games:number}){
 return <text x={(viewBox?.x??0)-6} y={(viewBox?.y??0)+14} textAnchor="end" fill="#c7d1e0" fontSize={11}>RS end: {games}</text>;
}

function GameTooltip({active,payload,metric}:{active?:boolean;payload?:Array<{payload:Point}>;metric:Metric}){
 const p=payload?.[0]?.payload;if(!active||!p)return null;
 const rows=p.phase==='postseason'?[{key:'post',label:'Postseason to date',color:'#e7edf7'}]:windows;
 return <div className="rolling-tooltip"><strong>{p.phase==='regular'?'Regular-season game':'Playoff game'} {p.game}</strong><p>{p.date}</p><table><thead><tr><th>Window</th>{metric!=='ops'&&<th>AVG</th>}{metric!=='avg'&&<th>OPS</th>}<th>PA</th></tr></thead><tbody>{rows.map(w=>{const r=p[w.key as keyof Point] as Rates|undefined;return <tr key={w.key}><td style={{color:w.color}}>{w.label}</td>{metric!=='ops'&&<td>{r?.avg?.toFixed(3)??'—'}</td>}{metric!=='avg'&&<td>{r?.ops?.toFixed(3)??'—'}</td>}<td>{r?.pa??'—'}</td></tr>;})}</tbody></table></div>;
}

function toChartPoints(team:Team|undefined):ChartPoint[]{
 return team?.points.map(p=>{
  const values:Record<string,number|null>={};
  for(const w of windows){const rates=p.phase==='regular'?p[w.key]:undefined;values[`avg_${w.key}`]=rates?.avg??null;values[`ops_${w.key}`]=rates?.ops??null;}
  return {...p,...values,avg_post:p.post?.avg??null,ops_post:p.post?.ops??null};
 })??[];
}

function RollingChart({team,metric,xStart,xSpan,yZoom,onBrush}:{team:Team;metric:Metric;xStart:number;xSpan:number;yZoom:number;onBrush:(start:number,end:number)=>void}){
 const chart=useMemo(()=>toChartPoints(team),[team]);
 const maxX=Math.max(team.regularGames+team.postseasonGames,team.regularGames+2);
 const startIndex=Math.min(Math.max(0,xStart-1),Math.max(0,chart.length-1));
 const endIndex=Math.min(chart.length-1,startIndex+xSpan-1);
 const visible=chart.slice(startIndex,endIndex+1);
 const metricKeys:('avg'|'ops')[]=(metric==='both'?['avg','ops']:[metric]);
 const values=visible.flatMap(p=>metricKeys.flatMap(name=>[...windows.map(w=>p[`${name}_${w.key}`]),p[`${name}_post`]]).filter((v):v is number=>typeof v==='number'));
 const minimum=metric==='ops'?0.3:metric==='avg'?0.15:0;
 const floor=Math.min(minimum,...values);const ceiling=Math.max(...values,metric==='ops'?1:metric==='avg'?.3:1);
 const center=(floor+ceiling)/2;const half=Math.max(.015,(ceiling-floor)/(2*yZoom));
 const yDomain:[number,number]=[Math.max(0,center-half),center+half];
 const ticks=[...new Set([1,30,60,90,120,150,team.regularGames,team.regularGames+1,team.regularGames+team.postseasonGames].filter(n=>n>=xStart&&n<=xStart+xSpan-1))];
 return <section className="rolling-team-chart" aria-labelledby={`rolling-chart-${team.teamId}`}>
  <div className="rolling-team-title"><h3 id={`rolling-chart-${team.teamId}`}>{team.team} <span>{team.league} · {team.season}</span></h3><p>{team.regularGames} regular-season games · {team.postseasonGames} completed playoff games</p></div>
  <div className="rolling-chart" role="img" aria-label={`${team.team} ${team.season}: ${metricLabels[metric]} rolling game chart`}>
   <ResponsiveContainer width="100%" height={500}><LineChart data={chart} margin={{top:28,right:30,bottom:40,left:8}}>
    <CartesianGrid stroke="#ffffff12" vertical={false}/><XAxis type="number" dataKey="x" domain={[xStart,Math.min(maxX,xStart+xSpan-1)]} ticks={ticks} tickFormatter={n=>n>team.regularGames?`P${n-team.regularGames}`:`${n}`} tick={{fill:'#aab6c8',fontSize:11}} label={{value:'Game number · P = playoffs',position:'bottom',offset:20,fill:'#aab6c8',fontSize:11}}/><YAxis domain={yDomain} tickFormatter={n=>Number(n).toFixed(3)} tick={{fill:'#aab6c8',fontSize:11}} width={57} label={{value:metric==='both'?'AVG / OPS':metric.toUpperCase(),angle:-90,position:'insideLeft',fill:'#aab6c8'}}/>
    <Tooltip position={{x:10,y:10}} content={<GameTooltip metric={metric}/>}/><ReferenceLine x={team.regularGames+.5} stroke="#c7d1e0" strokeDasharray="5 4" label={<BoundaryLabel games={team.regularGames}/>}/>
    {windows.flatMap(w=>metricKeys.map(name=><Line key={`${name}_${w.key}`} name={`${w.label} ${name.toUpperCase()}`} type="linear" dataKey={`${name}_${w.key}`} stroke={w.color} strokeWidth={name==='ops'?1.8:1.5} strokeDasharray={name==='avg'?'5 3':undefined} dot={false} activeDot={{r:3}} isAnimationActive={false} connectNulls={false}/>))}
    {metric!=='avg'&&<Line name="Postseason OPS" type="linear" dataKey="ops_post" stroke="#e7edf7" strokeWidth={2.5} dot={{r:2}} isAnimationActive={false}/>} {metric!=='ops'&&<Line name="Postseason AVG" type="linear" dataKey="avg_post" stroke="#e7edf7" strokeWidth={2} strokeDasharray="5 3" dot={{r:2}} isAnimationActive={false}/>} 
    <Brush dataKey="x" height={28} stroke="#b8a4fb" fill="#111722" startIndex={startIndex} endIndex={endIndex} travellerWidth={10} onChange={range=>onBrush((range.startIndex??0)+1,(range.endIndex??chart.length-1)+1)}/>
   </LineChart></ResponsiveContainer>
  </div>
 </section>;
}

export default function RollingTrends(){
 const [season,setSeason]=useState(2026),[teamId,setTeamId]=useState('147'),[teamTwoId,setTeamTwoId]=useState('111');
 const [metric,setMetric]=useState<Metric>('both'),[xStart,setXStart]=useState(1),[xSpan,setXSpan]=useState(164);
 const summaries=useMlbQuery(`teams:${season}`,()=>loadTeams(season));
 const teams=summaries.data??[];
 const first=teams.find(t=>t.teamId===teamId)??teams[0];
 const second=teams.find(t=>t.teamId===teamTwoId&&t.teamId!==first?.teamId)??teams.find(t=>t.teamId!==first?.teamId);
 const firstQuery=useMlbQuery(first?`series:${season}:${first.teamId}`:null,()=>loadTeam(season,first!.teamId));
 const secondQuery=useMlbQuery(second?`series:${season}:${second.teamId}`:null,()=>loadTeam(season,second!.teamId));
 const team=firstQuery.data,teamTwo=secondQuery.data;
 const loading=summaries.loading||firstQuery.loading||secondQuery.loading;
 const error=summaries.error||firstQuery.error||secondQuery.error;
 function retry(){summaries.retry();firstQuery.retry();secondQuery.retry();}
 useEffect(()=>{if(summaries.data?.length){setXStart(1);setXSpan(Math.max(...summaries.data.map(t=>t.regularGames+t.postseasonGames)));}},[summaries.data]);
 function chooseTeamOne(value:string){setTeamId(value);if(value===teamTwoId)setTeamTwoId(teams.find(t=>t.teamId!==value)?.teamId??value);}
 function updateBrush(start:number,end:number){setXStart(start);setXSpan(Math.max(8,end-start+1));}
 return <section className="explorer rolling-explorer" aria-labelledby="rolling-title">
  <div className="explorer-heading"><div><p className="eyebrow">THE SEASON, GAME BY GAME</p><h2 id="rolling-title">Rolling team AVG & OPS</h2></div></div>
  <div className="filter-bar rolling-filters"><label>Season<select aria-label="Rolling season" value={season} onChange={e=>setSeason(+e.target.value)}>{[2026,2025,2024,2023,2022].map(y=><option key={y}>{y}</option>)}</select></label><label>Playoff team 1<select aria-label="Rolling team 1" value={first?.teamId??''} disabled={summaries.loading} onChange={e=>chooseTeamOne(e.target.value)}>{teams.map(t=><option key={t.teamId} value={t.teamId}>{t.team} · {t.league}</option>)}</select></label><label>Playoff team 2<select aria-label="Rolling team 2" value={second?.teamId??''} disabled={summaries.loading} onChange={e=>setTeamTwoId(e.target.value)}>{teams.filter(t=>t.teamId!==first?.teamId).map(t=><option key={t.teamId} value={t.teamId}>{t.team} · {t.league}</option>)}</select></label><label>Metric focus<select aria-label="Rolling metric focus" value={metric} onChange={e=>setMetric(e.target.value as Metric)}><option value="both">AVG + OPS</option><option value="ops">OPS only</option><option value="avg">AVG only</option></select></label></div>
  <div className="rolling-legend" aria-label="Chart legend">{windows.map(w=><span key={w.key}><i style={{background:w.color}}/>{w.label}</span>)}{metric!=='avg'&&<span>━ OPS</span>}{metric!=='ops'&&<span>┄ AVG</span>}<span><i style={{background:'#e7edf7'}}/>Postseason cumulative</span></div>
  <p className="plot-note">Drag the overview beneath either graph to zoom horizontally. Choose OPS or AVG with Metric focus to rescale both charts. The regular season ends at the vertical line.</p>
  {loading||error?<QueryStatus error={error} retry={retry} label="Loading selected teams…"/>:team&&teamTwo&&<div className="rolling-team-charts"><RollingChart team={team} metric={metric} xStart={xStart} xSpan={xSpan} yZoom={1} onBrush={updateBrush}/><RollingChart team={teamTwo} metric={metric} xStart={xStart} xSpan={xSpan} yZoom={1} onBrush={updateBrush}/></div>}
  {team&&<><p className="plot-note">Postseason restarts at playoff game 1. The shared postseason-to-date total produces one AVG and one OPS curve. {season===2026?'2026 is in progress; only completed games are shown.':''}</p><details className="methodology"><summary>Values by game & calculation notes</summary><p>Team values include every batter who played for the club, not just its playoff roster. Separate player CSVs use a fixed opening-series playoff-roster cohort and the same team-game windows, including missed games. Earlier-team batting for traded players is included by the corresponding game-time interval. AVG = H / AB; OBP = (H + BB + HBP) / (AB + BB + HBP + SF); SLG = total bases / AB; OPS = OBP + SLG. K% and BB% use plate appearances. No postseason counts enter regular-season windows.</p></details></>}
 </section>;
}
