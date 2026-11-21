import { demoKey } from './demoIdentity';
import { useEffect, useState } from 'react';
import type { Journey } from './journey';
import type { Session } from './data';
const cacheKey=demoKey('daily-focus');
export function DailyFocus({journey,sessions}:{journey:Journey;sessions:Session[]}) {
 const context={coaching:journey.coaching?{...journey.coaching,observations:journey.coaching.observations.filter(o=>o.status==='user_confirmed')}:undefined,date:new Date().toLocaleDateString('en-CA'),preferences:journey.preferences,dailyDetails:journey.dailyDetails?.slice(-7),profile:journey.profile,intentions:journey.intentions,metrics:journey.metrics,goals:journey.goals,history:Object.fromEntries(Object.entries(journey.metricHistory||{}).map(([key,readings])=>[key,readings?.slice(-14)])),workouts:sessions.slice(-5).map(s=>({name:s.name,completedAt:s.completedAt,completedSets:s.sets.filter(x=>x.done).length}))};
 const signature=JSON.stringify(context);
 const [text,setText]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{
  let live=true;const abort=new AbortController();
  try{const saved=JSON.parse(localStorage.getItem(cacheKey)||'null');if(saved?.signature===signature){setText(saved.text);setError('');setBusy(false);return;}}catch{}
  setBusy(true);setError('');setText('');
  const timer=setTimeout(async()=>{
   const timeout=setTimeout(()=>abort.abort(),60000);
   try{
    const url=import.meta.env.VITE_SUPABASE_URL;if(!url)throw new Error('Daily Focus is not connected.');
    const response=await fetch(`${url}/functions/v1/coach-teddy-chat`,{method:'POST',headers:{'Content-Type':'application/json',apikey:import.meta.env.VITE_SUPABASE_ANON_KEY},signal:abort.signal,body:JSON.stringify({context:JSON.parse(signature),messages:[{role:'user',content:'Write my Daily Focus: one short paragraph, 40–65 words, based on my saved fitness goal, reason, additional information, recent workouts, metrics and progress toward targets. Give one practical priority for today. Consider dates and missing or stale data; never invent progress. If no data is available, suggest one useful starting action. No greeting, headings, follow-up question or metric updates. Do not prescribe calorie deficits or infer health from BMI alone.'}]})});
    const result=await response.json();if(!response.ok)throw new Error(result.error||'Daily Focus is unavailable.');if(typeof result.reply!=='string'||!result.reply.trim())throw new Error('Daily Focus is unavailable.');
    if(live){setText(result.reply);try{localStorage.setItem(cacheKey,JSON.stringify({signature,text:result.reply}));}catch{}}
   }catch(e){if(live)setError(abort.signal.aborted?'Daily Focus timed out.':(e as Error).message);}finally{clearTimeout(timeout);if(live)setBusy(false);}
  },1200);
  return()=>{live=false;clearTimeout(timer);abort.abort();};
 },[signature,retry]);
 return <section className="daily-focus" aria-label="Daily Focus"><div><h2>Daily Focus</h2><span>Coach Teddy</span></div><p aria-live="polite">{busy?'Preparing your focus…':error||text}</p>{error&&<button type="button" onClick={()=>setRetry(x=>x+1)}>Try again</button>}</section>;
}
