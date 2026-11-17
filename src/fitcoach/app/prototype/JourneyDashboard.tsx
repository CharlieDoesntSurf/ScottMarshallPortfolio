import { WeeklyCalendar } from './WeeklyCalendar';
import { DailyFocus } from './DailyFocus';
import { OverviewMetrics } from './OverviewMetrics';
import { useState } from 'react';
import { ArrowUpRight, Check, CheckCheck, Plus, Target } from 'lucide-react';
import type { Intake, Session } from './data';
import { weekDays } from './data';
import { createJourney, equipmentOptions, experienceOptions, goalOptions, metricDefinitions, readingStatus, recordJourney, weightProgress, type Journey, type JourneyProfile } from './journey';
import '../../styles/journey.css';

export function JourneyDashboard({ saved, intake, sessions, onSave }: { saved?: Journey; intake: Intake | null; sessions: Session[]; onSave: (value: Journey) => void }) {
  const [base, setBase] = useState(() => saved || createJourney(intake));
  const [profile, setProfile] = useState<JourneyProfile>(base.profile);
  const [goals, setGoals] = useState(base.goals);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);
  const [failed, setFailed] = useState(false);
  function patchProfile(p: Partial<JourneyProfile>) { setProfile(x=>({...x,...p})); setDirty(true); setMessage(''); }
  function focus(id: string) { const el=document.getElementById(id);if(el?.classList.contains('overview-metric'))el.click();else el?.focus(); }
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
      const next=recordJourney(base,profile,goals,{},[]);
      onSave(next);setBase(next);setDirty(false);setMessage('Saved · This browser');setFailed(false);
    } catch { setMessage('Save failed · Retry');setFailed(true); }
  }
  return <form className="journey" onSubmit={submit}>
    <div className="journey-heading"><div><span className="journey-kicker">YOUR BASELINE</span><h1>Journey<span>.</span></h1></div><div className="journey-local"><i/> This browser</div></div>
    <div className="journey-summary">
      <div className="journey-identity"><div className="journey-avatar">{profile.name.trim().slice(0,1).toUpperCase() || <Plus size={24}/>}</div><div><label htmlFor="journey-name">Name</label><input id="journey-name" aria-label="Name" maxLength={60} placeholder="Your name" value={profile.name} onChange={e=>patchProfile({name:e.target.value})}/><span>{profile.experience || 'Experience · —'}</span></div></div>
      <div className="journey-completion"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19"/><circle cx="24" cy="24" r="19" pathLength="100" strokeDasharray={`${complete/6*100} 100`}/></svg><div><strong>{complete}<small> / 6</small></strong><span>Profile fields</span></div></div>
    </div>

    <DailyFocus journey={base} sessions={sessions}/>
    <div className="journey-section-title"><h2>Check-in</h2><span>{new Date().toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span></div>
    <OverviewMetrics all bar keys={["weight","sleep","energy","bodyFat","soreness","sleepQuality"]} saved={base} intake={intake} onSave={value=>{onSave(value);setBase(value);setGoals(value.goals);}} />

    <section className="journey-intentions" aria-label="Personal goals">
      {([['fitnessGoal','Fitness goal'],['reason','Reason'],['additionalInfo','Additional info']] as const).map(([key,label])=><label key={key}>{label}<textarea aria-label={label} rows={4} maxLength={2000} placeholder="—" defaultValue={base.intentions?.[key] || (key==='reason'?profile.motivation:key==='additionalInfo'?profile.limitations:'')} onBlur={e=>{const intentions={fitnessGoal:'',reason:profile.motivation,additionalInfo:profile.limitations,...base.intentions,[key]:e.target.value};if(JSON.stringify(intentions)===JSON.stringify(base.intentions))return;try{const next={...base,intentions,updatedAt:new Date().toISOString()};onSave(next);setBase(next);}catch{setMessage('Save failed · Retry');setFailed(true);}}}/></label>)}
    </section>
    <WeeklyCalendar days={profile.days}/>
    <div className="journey-section-title"><h2>Nutrition & body</h2></div>
    <OverviewMetrics all bar keys={["calories","protein","bmi"]} saved={base} intake={intake} onSave={value=>{onSave(value);setBase(value);setGoals(value.goals);}}/>
    <div className="journey-middle">
      <section className="journey-panel journey-goals"><div className="journey-section-title"><h2>Targets</h2><Target size={17}/></div><div className="journey-target-inputs"><label>Goal weight <div><input aria-label="Goal weight" type="number" inputMode="decimal" min="20" max="400" step="0.1" placeholder="—" value={goals.weight??''} onChange={e=>{setGoals({...goals,weight:e.target.value===''?null:Number(e.target.value)});setDirty(true);setMessage('');}}/><span>kg</span></div></label><label>Sleep target <div><input aria-label="Sleep target" type="number" inputMode="decimal" min="1" max="24" step="0.1" placeholder="—" value={goals.sleep??''} onChange={e=>{setGoals({...goals,sleep:e.target.value===''?null:Number(e.target.value)});setDirty(true);setMessage('');}}/><span>hrs</span></div></label></div><div className="journey-progress-label"><span>Weight goal</span><strong>{progress==null?'—':`${progress}%`}</strong></div><div className="journey-progress"><i style={{width:`${progress??0}%`}}/></div><div className="journey-goal-foot"><span>{delta==null?'—':`${Number(delta.toFixed(1))} kg`} remaining</span><span>{base.metrics.sleep && goals.sleep ? `${Number((base.metrics.sleep.value-goals.sleep).toFixed(1)) > 0 ? '+' : ''}${Number((base.metrics.sleep.value-goals.sleep).toFixed(1))} hrs` : '—'} · Sleep Δ</span></div></section>
    </div>

    <section className="journey-panel journey-training"><div className="journey-section-title"><h2>Training profile</h2><span>{base.profileUpdatedAt ? new Date(base.profileUpdatedAt).toLocaleDateString(undefined,{month:'short',day:'numeric'}) : 'Not reviewed'}</span></div>
      <div className="journey-fields"><label>Primary goal<select id="journey-goal" value={profile.goal} onChange={e=>patchProfile({goal:e.target.value})}><option value="">Select goal</option>{goalOptions.map(v=><option key={v}>{v}</option>)}</select></label><label>Experience<select id="journey-experience" value={profile.experience} onChange={e=>patchProfile({experience:e.target.value})}><option value="">Select level</option>{experienceOptions.map(v=><option key={v}>{v}</option>)}</select></label><label>Session length<div className="journey-input-unit"><input id="journey-minutes" aria-label="Session length" type="number" min="15" max="90" step="1" placeholder="—" value={profile.minutes??''} onChange={e=>patchProfile({minutes:e.target.value===''?null:Number(e.target.value)})}/><span>min</span></div></label></div>
      <div className="journey-schedule"><div><div className="journey-field-label">Training days <span>{profile.days.length} / 7</span></div><div className="journey-day-picker">{weekDays.map((day,i)=><button id={i===0?'journey-days':undefined} key={day} type="button" aria-label={day} aria-pressed={profile.days.includes(day)} onClick={()=>patchProfile({days:weekDays.filter(d=>d===day?!profile.days.includes(d):profile.days.includes(d))})}>{day.slice(0,1)}<span>{day.slice(1)}</span></button>)}</div></div><div className="journey-week-progress"><span>This week</span><strong>{trainingDays}<small> / {profile.days.length || '—'}</small></strong><span>Training days</span></div></div>
      <div className="journey-field-label">Equipment</div><div className="journey-equipment">{equipmentOptions.map((item,i)=><button id={i===0?'journey-equipment':undefined} key={item} type="button" aria-pressed={profile.equipment.includes(item)} onClick={()=>patchProfile({equipment:profile.equipment.includes(item)?profile.equipment.filter(x=>x!==item):[...profile.equipment,item]})}>{profile.equipment.includes(item)?<Check size={13}/>:<Plus size={13}/>} {item}</button>)}</div>
      <div className="journey-notes"><label>Limitations <span>Optional</span><input maxLength={1500} placeholder="—" value={profile.limitations} onChange={e=>patchProfile({limitations:e.target.value})}/></label><label>Motivation <span>Optional</span><input maxLength={2000} placeholder="—" value={profile.motivation} onChange={e=>patchProfile({motivation:e.target.value})}/></label></div>
    </section>
    <section className="journey-updates"><div className="journey-section-title"><h2>To update <span className="journey-count">{updates.length+required.filter(x=>!x.filled).length}</span></h2><span>Saved values</span></div><div className="journey-update-list">{required.filter(x=>!x.filled).map(x=><button type="button" key={x.label} onClick={()=>focus(x.id)}>{x.label}<span>Add <Plus size={12}/></span></button>)}{updates.map(d=><button type="button" key={d.key} onClick={()=>{focus(`journey-${d.key}`);}}>{d.label}<span>{readingStatus(base.metrics[d.key],d.days)} <ArrowUpRight size={12}/></span></button>)}{!updates.length&&complete===6&&<span className="journey-all-current"><CheckCheck size={17}/> All current</span>}</div></section>
    <div className="journey-save"><div role={failed?'alert':'status'}><span className={failed?'journey-error':''}>{dirty ? (failed?message:'Unsaved changes') : message || 'This browser'}</span>{base.updatedAt&&!dirty&&<small>{new Date(base.updatedAt).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}</small>}</div><button className="primary" type="submit" disabled={!dirty}><Check size={16}/> Save changes</button></div>
  </form>;
}
