import { useState } from 'react';
import { ArrowUpRight, Check, CheckCheck, CircleDashed, Moon, Plus, Scale, Target, Zap } from 'lucide-react';
import type { Intake, Session } from './data';
import { weekDays } from './data';
import { createJourney, equipmentOptions, experienceOptions, goalOptions, metricDefinitions, readingStatus, recordJourney, weightProgress, type Journey, type JourneyProfile, type MetricKey, type Reading } from './journey';
import '../../styles/journey.css';

// Decorative line studies, never a substitute for a recorded measurement.
export function MetricArt({ index }: { index: number }) {
  return <svg className="journey-line-art" viewBox="0 0 200 70" fill="none" stroke="currentColor" strokeWidth=".8" aria-hidden="true">
    {index % 3 === 0 ? Array.from({length:7},(_,i)=><g key={i} transform={`translate(${44+i*15} ${28-Math.sin(i/6*Math.PI)*20})`}><path d="M0 5 8 0 16 5 8 10Z M0 5v30l8 5 8-5V5 M8 10v30"/></g>) : index % 3 === 1 ? Array.from({length:5},(_,i)=><ellipse key={i} cx="100" cy={34+i*3} rx={58-i*10} ry={23-i*3}/>) : Array.from({length:6},(_,i)=><path key={i} d={`M${50+i*18} 58V12l${36-i*5} 46V12Z`}/>)}
  </svg>;
}

function WeightChart({ history }: { history: Reading[] }) {
  const cutoff = Date.now() - 30 * 86400000;
  const points = history.filter(x => Date.parse(x.at) >= cutoff);
  const low = points.length ? Math.min(...points.map(x => x.value)) - .5 : 0;
  const high = points.length ? Math.max(...points.map(x => x.value)) + .5 : 1;
  const first = points.length ? Date.parse(points[0].at) : 0;
  const last = points.length ? Date.parse(points.at(-1)!.at) : 1;
  const xy = points.map(p => ({ x: points.length === 1 ? 300 : 24 + (Date.parse(p.at) - first) / Math.max(1,last-first) * 552, y: 114 - (p.value-low)/(high-low)*88, ...p }));
  const line = xy.map(p => `${p.x},${p.y}`).join(' ');
  return <div className="journey-chart">
    <svg viewBox="0 0 600 140" role="img" aria-label={points.length ? `Weight history, ${points.length} readings, ${points.at(-1)!.value} kilograms latest` : 'Weight history: no readings'}>
      <defs><linearGradient id="journey-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff79b7" stopOpacity=".25"/><stop offset="100%" stopColor="#ff79b7" stopOpacity="0"/></linearGradient></defs>
      {[30,70,110].map(y=><line key={y} x1="20" x2="580" y1={y} y2={y} stroke="#303434" strokeDasharray="3 6"/>)}
      {xy.length > 1 && <><polygon points={`${xy[0].x},130 ${line} ${xy.at(-1)!.x},130`} fill="url(#journey-fill)"/><polyline points={line} fill="none" stroke="#ff79b7" strokeWidth="3" strokeLinejoin="round"/></>}
      {xy.map(p=><circle key={p.at} cx={p.x} cy={p.y} r="4" fill="#ff79b7" stroke="#191c1b" strokeWidth="2"><title>{new Date(p.at).toLocaleDateString()} · {p.value} kg</title></circle>)}
      {!xy.length && <text x="300" y="76" textAnchor="middle" fill="#8f9692" fontSize="13">No readings</text>}
    </svg>
    <div className="journey-axis"><span>{points.length ? new Date(points[0].at).toLocaleDateString(undefined,{month:'short',day:'numeric'}) : '—'}</span><span>{points.length ? new Date(points.at(-1)!.at).toLocaleDateString(undefined,{month:'short',day:'numeric'}) : '—'}</span></div>
  </div>;
}

export function JourneyDashboard({ saved, intake, sessions, onSave }: { saved?: Journey; intake: Intake | null; sessions: Session[]; onSave: (value: Journey) => void }) {
  const [base, setBase] = useState(() => saved || createJourney(intake));
  const [profile, setProfile] = useState<JourneyProfile>(base.profile);
  const [goals, setGoals] = useState(base.goals);
  const [values, setValues] = useState<Partial<Record<MetricKey,string>>>(()=>Object.fromEntries(metricDefinitions.map(d=>[d.key,base.metrics[d.key]?.value.toString() ?? ''])));
  const [touched, setTouched] = useState<MetricKey[]>([]);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);
  const [failed, setFailed] = useState(false);
  function patchProfile(p: Partial<JourneyProfile>) { setProfile(x=>({...x,...p})); setDirty(true); setMessage(''); }
  function changeMetric(key: MetricKey, value: string) { setValues(x=>({...x,[key]:value}));setTouched(x=>Array.from(new Set([...x,key])));setDirty(true);setMessage(''); }
  function focus(id: string) { document.getElementById(id)?.focus(); }
  const required = [
    {label:'Name',filled:!!profile.name.trim(),id:'journey-name'},
    {label:'Goal',filled:!!profile.goal,id:'journey-goal'},
    {label:'Experience',filled:!!profile.experience,id:'journey-experience'},
    {label:'Training days',filled:!!profile.days.length,id:'journey-days'},
    {label:'Session length',filled:profile.minutes != null,id:'journey-minutes'},
    {label:'Equipment',filled:!!profile.equipment.length,id:'journey-equipment'},
  ];
  const complete = required.filter(x=>x.filled).length;
  const updates = metricDefinitions.filter(d=>readingStatus(base.metrics[d.key],d.days)!=='Current');
  const now = new Date(), monday = new Date(now.getFullYear(),now.getMonth(),now.getDate());
  monday.setDate(monday.getDate() - (monday.getDay()+6)%7);
  const weekSessions = sessions.filter(s=>s.completedAt && Date.parse(s.completedAt)>=monday.getTime() && Date.parse(s.completedAt)<=now.getTime());
  const trainingDays = new Set(weekSessions.map(s=>new Date(s.completedAt!).toLocaleDateString())).size;
  const progress = base.metrics.weight ? weightProgress(base.weightHistory,goals.weight) : null;
  const weight = base.metrics.weight?.value;
  const delta = weight != null && goals.weight != null ? Math.abs(weight-goals.weight) : null;
  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const next=recordJourney(base,profile,goals,values,touched);
      onSave(next);setBase(next);setTouched([]);setDirty(false);setMessage('Saved · This browser');setFailed(false);
    } catch { setMessage('Save failed · Retry');setFailed(true); }
  }
  return <form className="journey" onSubmit={submit}>
    <div className="journey-heading"><div><span className="journey-kicker">YOUR BASELINE</span><h1>Journey<span>.</span></h1></div><div className="journey-local"><i/> This browser</div></div>
    <div className="journey-summary">
      <div className="journey-identity"><div className="journey-avatar">{profile.name.trim().slice(0,1).toUpperCase() || <Plus size={24}/>}</div><div><label htmlFor="journey-name">Name</label><input id="journey-name" aria-label="Name" maxLength={60} placeholder="Your name" value={profile.name} onChange={e=>patchProfile({name:e.target.value})}/><span>{profile.experience || 'Experience · —'}</span></div></div>
      <div className="journey-completion"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="19" pathLength="100" strokeDasharray={`${complete/6*100} 100`}/></svg><div><strong>{complete}<small> / 6</small></strong><span>Profile fields</span></div></div>
    </div>

    <div className="journey-section-title"><h2>Check-in</h2><span>{new Date().toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span></div>
    <div className="journey-metrics">
      {metricDefinitions.map((d,i)=>{ const status=readingStatus(base.metrics[d.key],d.days);const Icon=i===0?Scale:i===1?Moon:i===2?Zap:CircleDashed;return <section className={`journey-metric ${i===0?'journey-weight':''}`} key={d.key}>
        <div className="journey-metric-top"><label htmlFor={`journey-${d.key}`}><Icon size={15}/>{d.label}</label><button type="button" className={`journey-status ${status.toLowerCase()}`} title={`${d.label} · Review every ${d.days} ${d.days===1?'day':'days'}`} onClick={()=>{focus(`journey-${d.key}`);if(values[d.key])changeMetric(d.key,values[d.key]!);}}>{touched.includes(d.key)?'Edited':status}<ArrowUpRight size={11}/></button></div>
        <div className="journey-number"><input id={`journey-${d.key}`} aria-label={d.label} inputMode="decimal" type="number" min={d.min} max={d.max} step={d.step} placeholder="—" value={values[d.key] ?? ''} onChange={e=>changeMetric(d.key,e.target.value)}/><span>{d.unit}</span></div>
        <MetricArt index={i}/>
        <span className="journey-updated">{base.metrics[d.key] ? new Date(base.metrics[d.key]!.at).toLocaleDateString(undefined,{month:'short',day:'numeric'}) : 'Not logged'}<span>{d.days===1?'Daily':d.days===7?'Weekly':'Monthly'}</span></span>
      </section>;})}
    </div>

    <div className="journey-middle">
      <section className="journey-panel journey-weight-panel"><div className="journey-section-title"><h2>Weight trend</h2><span>30 days</span></div><div className="journey-trend-summary"><strong>{weight ?? '—'}<small>kg</small></strong><span>{base.weightHistory.filter(x=>Date.parse(x.at)>=Date.now()-30*86400000).length} readings</span></div><WeightChart history={base.weightHistory}/></section>
      <section className="journey-panel journey-goals"><div className="journey-section-title"><h2>Targets</h2><Target size={17}/></div><div className="journey-target-inputs"><label>Goal weight <div><input aria-label="Goal weight" type="number" inputMode="decimal" min="20" max="400" step="0.1" placeholder="—" value={goals.weight??''} onChange={e=>{setGoals({...goals,weight:e.target.value===''?null:Number(e.target.value)});setDirty(true);setMessage('');}}/><span>kg</span></div></label><label>Sleep target <div><input aria-label="Sleep target" type="number" inputMode="decimal" min="1" max="24" step="0.1" placeholder="—" value={goals.sleep??''} onChange={e=>{setGoals({...goals,sleep:e.target.value===''?null:Number(e.target.value)});setDirty(true);setMessage('');}}/><span>hrs</span></div></label></div><div className="journey-progress-label"><span>Weight goal</span><strong>{progress==null?'—':`${progress}%`}</strong></div><div className="journey-progress"><i style={{width:`${progress??0}%`}}/></div><div className="journey-goal-foot"><span>{delta==null?'—':`${Number(delta.toFixed(1))} kg`} remaining</span><span>{base.metrics.sleep && goals.sleep ? `${Number((base.metrics.sleep.value-goals.sleep).toFixed(1)) > 0 ? '+' : ''}${Number((base.metrics.sleep.value-goals.sleep).toFixed(1))} hrs` : '—'} · Sleep Δ</span></div></section>
    </div>

    <section className="journey-panel journey-training"><div className="journey-section-title"><h2>Training profile</h2><span>{base.profileUpdatedAt ? new Date(base.profileUpdatedAt).toLocaleDateString(undefined,{month:'short',day:'numeric'}) : 'Not reviewed'}</span></div>
      <div className="journey-fields"><label>Primary goal<select id="journey-goal" value={profile.goal} onChange={e=>patchProfile({goal:e.target.value})}><option value="">Select goal</option>{goalOptions.map(v=><option key={v}>{v}</option>)}</select></label><label>Experience<select id="journey-experience" value={profile.experience} onChange={e=>patchProfile({experience:e.target.value})}><option value="">Select level</option>{experienceOptions.map(v=><option key={v}>{v}</option>)}</select></label><label>Session length<div className="journey-input-unit"><input id="journey-minutes" aria-label="Session length" type="number" min="15" max="90" step="1" placeholder="—" value={profile.minutes??''} onChange={e=>patchProfile({minutes:e.target.value===''?null:Number(e.target.value)})}/><span>min</span></div></label></div>
      <div className="journey-schedule"><div><div className="journey-field-label">Training days <span>{profile.days.length} / 7</span></div><div className="journey-day-picker">{weekDays.map((day,i)=><button id={i===0?'journey-days':undefined} key={day} type="button" aria-label={day} aria-pressed={profile.days.includes(day)} onClick={()=>patchProfile({days:weekDays.filter(d=>d===day?!profile.days.includes(d):profile.days.includes(d))})}>{day.slice(0,1)}<span>{day.slice(1)}</span></button>)}</div></div><div className="journey-week-progress"><span>This week</span><strong>{trainingDays}<small> / {profile.days.length || '—'}</small></strong><span>Training days</span></div></div>
      <div className="journey-field-label">Equipment</div><div className="journey-equipment">{equipmentOptions.map((item,i)=><button id={i===0?'journey-equipment':undefined} key={item} type="button" aria-pressed={profile.equipment.includes(item)} onClick={()=>patchProfile({equipment:profile.equipment.includes(item)?profile.equipment.filter(x=>x!==item):[...profile.equipment,item]})}>{profile.equipment.includes(item)?<Check size={13}/>:<Plus size={13}/>} {item}</button>)}</div>
      <div className="journey-notes"><label>Limitations <span>Optional</span><input maxLength={1500} placeholder="—" value={profile.limitations} onChange={e=>patchProfile({limitations:e.target.value})}/></label><label>Motivation <span>Optional</span><input maxLength={2000} placeholder="—" value={profile.motivation} onChange={e=>patchProfile({motivation:e.target.value})}/></label></div>
    </section>
    <section className="journey-updates"><div className="journey-section-title"><h2>To update <span className="journey-count">{updates.length+required.filter(x=>!x.filled).length}</span></h2><span>Saved values</span></div><div className="journey-update-list">{required.filter(x=>!x.filled).map(x=><button type="button" key={x.label} onClick={()=>focus(x.id)}>{x.label}<span>Add <Plus size={12}/></span></button>)}{updates.map(d=><button type="button" key={d.key} onClick={()=>{focus(`journey-${d.key}`);if(values[d.key])changeMetric(d.key,values[d.key]!);}}>{d.label}<span>{readingStatus(base.metrics[d.key],d.days)} <ArrowUpRight size={12}/></span></button>)}{!updates.length&&complete===6&&<span className="journey-all-current"><CheckCheck size={17}/> All current</span>}</div></section>
    <div className="journey-save"><div role={failed?'alert':'status'}><span className={failed?'journey-error':''}>{dirty ? (failed?message:'Unsaved changes') : message || 'This browser'}</span>{base.updatedAt&&!dirty&&<small>{new Date(base.updatedAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}</small>}</div><button className="primary" type="submit" disabled={!dirty}><Check size={16}/> Save changes</button></div>
  </form>;
}
