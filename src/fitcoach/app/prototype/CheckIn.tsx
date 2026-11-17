import { useState } from 'react';
import { metricDefinitions, recordJourney, type Journey, type MetricKey } from './journey';
export const checkInMetrics=metricDefinitions.slice(0,6);
export function CheckIn({journey,onSave}:{journey:Journey;onSave:(value:Journey)=>void}) {
 const [values,setValues]=useState<Partial<Record<MetricKey,string>>>({});
 const [status,setStatus]=useState(''),[failed,setFailed]=useState(false);
 function submit(){
  const keys=Object.keys(values).filter(key=>values[key as MetricKey]?.trim()) as MetricKey[];
  if(!keys.length){setStatus('Enter a measurement');setFailed(true);return;}
  try{const next=recordJourney(journey,journey.profile,journey.goals,values,keys);onSave(next);setValues({});setStatus('Check-in saved');setFailed(false);}catch(e){setStatus((e as Error).message);setFailed(true);}
 }
 return <section className="inline-checkin" aria-label="Check-in form" onKeyDown={e=>{if(e.key==='Enter'&&e.target instanceof HTMLInputElement){e.preventDefault();submit();}}}><div className="journey-section-title"><h2>Check-in</h2><span>{new Date().toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span></div><div className="checkin-fields">{checkInMetrics.map(d=><label key={d.key}>{d.label}<div><input id={`journey-${d.key}`} aria-label={`Check-in ${d.label}`} type="number" min={d.min} max={d.max} step={d.step} inputMode="decimal" placeholder="—" value={values[d.key]??''} onChange={e=>{setValues(v=>({...v,[d.key]:e.target.value}));setStatus('');}}/><span>{d.unit}</span></div></label>)}</div><div className="checkin-actions"><span role={failed?'alert':'status'}>{status}</span><button type="button" className="primary" onClick={submit}>Submit check-in</button></div></section>;
}
export function CheckInSummary({journey}:{journey:Journey}) {
 const readings=checkInMetrics.filter(d=>journey.metrics[d.key]);
 if(!readings.length)return null;
 return <section className="overview-metrics metric-bar checkin-summary" aria-label="Saved check-in">{checkInMetrics.map(d=><div className="overview-metric" key={d.key}><span>{d.label}</span><div className="overview-metric-value">{journey.metrics[d.key]?.value??'—'}<small>{d.unit}</small></div><div className="overview-metric-goal"><span>{journey.metrics[d.key]?new Date(journey.metrics[d.key]!.at).toLocaleDateString(undefined,{month:'short',day:'numeric'}):'—'}</span><span>Goal {journey.goals[d.key]??'—'} {d.unit}</span></div></div>)}</section>;
}
