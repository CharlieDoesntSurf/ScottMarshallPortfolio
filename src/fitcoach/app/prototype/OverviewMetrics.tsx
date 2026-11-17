import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { MetricArt } from './MetricArt';
import { createJourney, metricDefinitions, recordJourney, type Journey, type Reading, type MetricKey } from './journey';
import type { Intake } from './data';
import '../../styles/overview-metrics.css';
type Key = MetricKey;

const dayNumber = (at:string) => { const d=new Date(at);return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000; };
function HistoryChart({history,goal,unit}:{history:Reading[];goal:number|null;unit:string}) {
  const today=dayNumber(new Date().toISOString());
  const first=history.length?Math.min(...history.map(p=>dayNumber(p.at))):today;
  const start=Math.max(first,today-89);
  const points=history.filter(p=>dayNumber(p.at)>=start&&dayNumber(p.at)<=start+89);
  const numbers=[...points.map(p=>p.value),...(goal!=null?[goal]:[])];
  const min=numbers.length?Math.min(...numbers):0,max=numbers.length?Math.max(...numbers):10;
  const pad=Math.max((max-min)*.2,1),low=Math.max(0,min-pad),high=max+pad;
  const y=(v:number)=>220-(v-low)/(high-low)*180;
  const coords=points.map(p=>({x:45+(dayNumber(p.at)-start)/89*490,y:y(p.value),...p}));
  return <div className="metric-history"><div className="metric-chart-heading"><span>90 days</span><span>{new Date(start*86400000).toLocaleDateString(undefined,{timeZone:'UTC',month:'short',day:'numeric'})} · {unit}</span></div><svg viewBox="0 0 570 270" role="img" aria-label={`90-day history. ${points.length} readings. ${goal==null?'No goal':`Goal ${goal} ${unit}`}`}>
    {[0,.5,1].map(t=>{const v=low+(high-low)*t;return <g key={t}><line x1="45" x2="535" y1={y(v)} y2={y(v)} stroke="#ddd2d8"/><text x="36" y={y(v)+4} textAnchor="end">{Number(v.toFixed(1))}</text></g>})}
    {goal!=null&&<g><line x1="45" x2="535" y1={y(goal)} y2={y(goal)} stroke="#9f2460" strokeWidth="1.5" strokeDasharray="3 5"/><text x="535" y={y(goal)-8} textAnchor="end">Goal · {goal}</text></g>}
    {coords.length>1&&<polyline points={coords.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="#171014" strokeWidth="2"/>}
    {coords.map(p=><circle key={p.at} cx={p.x} cy={p.y} r="4" fill="#ff4fa3" stroke="#171014"><title>{new Date(p.at).toLocaleDateString()} · {p.value} {unit}</title></circle>)}
    {!coords.length&&<text x="285" y="130" textAnchor="middle">No readings</text>}
    {[1,30,60,90].map(d=><text key={d} x={45+(d-1)/89*490} y="250" textAnchor="middle">Day {d}</text>)}
  </svg><div className="metric-chart-heading"><span>{points.length} readings</span><span>● Current <i/> Goal</span></div></div>;
}
export function OverviewMetrics({saved,intake,onSave,all=false,keys,bar=false}:{keys?:MetricKey[];bar?:boolean;all?:boolean;saved?:Journey;intake:Intake|null;onSave:(value:Journey)=>void}) {
  const definitions=keys?metricDefinitions.filter(d=>keys.includes(d.key)):all?metricDefinitions:metricDefinitions.slice(0,3);
  const [selected,setSelected]=useState<Key|null>(null);
  const [current,setCurrent]=useState(''),[goal,setGoal]=useState(''),[status,setStatus]=useState('');
  const dialog=useRef<HTMLDialogElement>(null);
  const latest=useRef(saved||createJourney(intake));
  latest.current=saved||latest.current;
  useEffect(()=>{if(selected)dialog.current?.showModal();},[selected]);
  function open(key:Key){const data=latest.current;setCurrent(data.metrics[key]?.value.toString()??'');setGoal(data.goals[key]?.toString()??'');setStatus('');setSelected(key);}
  function commit(field:'current'|'goal',raw:string){
    if(!selected)return;
    const data=latest.current,d=metricDefinitions.find(x=>x.key===selected)!;
    const previous=field==='current'?data.metrics[selected]?.value:data.goals[selected];
    if(raw===(previous?.toString()??''))return;
    const value=raw===''?null:Number(raw);
    if(value!=null&&(!Number.isFinite(value)||value<d.min||value>d.max||(d.step===1&&!Number.isInteger(value)))){setStatus(`${d.min}–${d.max} ${d.unit}`);return;}
    try {
      const next=field==='current'?recordJourney(data,data.profile,data.goals,{[selected]:raw},[selected]):{...data,goals:{...data.goals,[selected]:value},updatedAt:new Date().toISOString()};
      onSave(next);latest.current=next;setStatus('Saved · This browser');
    }catch{setStatus('Not saved · Edit to retry');}
  }
  const data=saved||latest.current,def=metricDefinitions.find(d=>d.key===selected);
  const history=selected?(data.metricHistory?.[selected]??(selected==='weight'?data.weightHistory:data.metrics[selected]?[data.metrics[selected]!]:[])):[];
  return <>
    <section className={`overview-metrics ${bar?"metric-bar":""}`} aria-label="Daily metrics">{definitions.map((d,i)=><button type="button" id={all&&!['calories','protein'].includes(d.key)?`journey-${d.key}`:undefined} className="overview-metric" key={d.key} onClick={()=>open(d.key as Key)} aria-label={`View ${d.label} details`}><span>{d.label}</span><div className="overview-metric-value">{data.metrics[d.key]?.value??'—'}<small>{d.unit}</small></div>{!bar&&<MetricArt index={i}/>}<div className="overview-metric-goal">Goal <span>{data.goals[d.key as Key]??'—'} {d.unit}</span></div></button>)}</section>
    <dialog className="metric-drawer" aria-labelledby="metric-detail-title" ref={dialog} onClose={()=>{commit("current",current);commit("goal",goal);setSelected(null);}} onClick={e=>{if(e.target===dialog.current){const r=dialog.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)dialog.current.close();}}}>
      {def&&<><header><span>YOUR METRICS</span><button type="button" autoFocus aria-label="Close metric details" onClick={()=>dialog.current?.close()}><X size={22}/></button></header><h2 id="metric-detail-title">{def.label}</h2><div className="metric-detail-fields"><label>Current<div><input aria-label={`Current ${def.label}`} type="number" min={def.min} max={def.max} step={def.step} value={current} placeholder="—" onChange={e=>{setCurrent(e.target.value);setStatus('Editing');}} onBlur={e=>commit('current',e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();e.currentTarget.blur();}}}/><span>{def.unit}</span></div></label><label>Goal<div><input aria-label={`${def.label} goal`} type="number" min={def.min} max={def.max} step={def.step} value={goal} placeholder="—" onChange={e=>{setGoal(e.target.value);setStatus('Editing');}} onBlur={e=>commit('goal',e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();e.currentTarget.blur();}}}/><span>{def.unit}</span></div></label></div><div role="status" className="metric-save-status">{status||'Automatic saving · This browser'}</div><HistoryChart history={history} goal={data.goals[selected!]??null} unit={def.unit}/><footer><span>Daily conversation</span><span>Coach · Text chat</span></footer></>}
    </dialog>
  </>;
}
