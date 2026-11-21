import { fields, validField, interviewVersion } from './interview-contract.mjs';
import { recordJourney, type Journey, type MetricKey } from './journey.ts';
import { DEMO_NAME } from './demoIdentity.ts';
export type InterviewField={field:string;value:string;quote:string;sourceMessageId:string};
export type Observation=NonNullable<Journey['coaching']>['observations'][number];
export function applyInterviewDraft(base:Journey,answers:Record<string,InterviewField>,observations:Observation[],actions:string[],at=new Date().toISOString()):Journey {
 const profile={...base.profile,name:DEMO_NAME},intentions={fitnessGoal:'',reason:'',additionalInfo:'',...base.intentions},preferences={heightCm:'',diet:'',foodNotes:'',supplements:'',...base.preferences},goals={...base.goals},summary={...base.coaching?.summary};
 const values:Partial<Record<MetricKey,string>>={},daily:Record<string,string>={};
 for(const [key,answer] of Object.entries(answers)){
  if(!validField(key,answer.value))throw new Error(`Check ${fields[key]?.label||'field'}`);
  const [group,name]=key.split('.'),value=answer.value;
  if(group==='metrics')values[name as MetricKey]=value;
  else if(group==='goals')goals[name as MetricKey]=value===''?null:Number(value);
  else if(group==='profile')Object.assign(profile,{[name]:name==='minutes'?(value===''?null:Number(value)):['days','equipment'].includes(name)?value.split(',').map(x=>x.trim()).filter(Boolean):value});
  else if(group==='intentions')Object.assign(intentions,{[name]:value});
  else if(group==='preferences')Object.assign(preferences,{[name]:value});
  else if(group==='coaching')summary[name]=value;
  else if(group==='daily')daily[name]=value;
 }
 const next=recordJourney(base,profile,goals,values,Object.keys(values) as MetricKey[],at);
 if(Object.keys(daily).length){const day=new Date(at).toLocaleDateString();const previous=base.dailyDetails?.find(x=>new Date(x.at).toLocaleDateString()===day);next.dailyDetails=[...(base.dailyDetails||[]).filter(x=>new Date(x.at).toLocaleDateString()!==day),{bedtime:'',wakeTime:'',supplements:'',...previous,...daily,at}];}
 return {...next,intentions,preferences,setupCompletedAt:at,coaching:{summary,actions:actions.filter(x=>x.trim()).slice(0,3),observations,interviewVersion,reviewedAt:at}};
}
