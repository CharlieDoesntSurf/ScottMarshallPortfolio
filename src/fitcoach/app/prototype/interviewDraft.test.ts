import test from 'node:test';
import assert from 'node:assert/strict';
import {createJourney} from './journey.ts';
import {applyInterviewDraft} from './interviewDraft.ts';
const answer=(field:string,value:string)=>({field,value,quote:value,sourceMessageId:'test'});
test('review applies profile, metric and goal separately without mutating original',()=>{
 const base=createJourney(null);const next=applyInterviewDraft(base,{'metrics.weight':answer('metrics.weight','80'),'goals.weight':answer('goals.weight','75'),'profile.days':answer('profile.days','Mon, Fri'),'intentions.reason':answer('intentions.reason','Surfing')},[],['Walk after work'],'2026-11-20T12:00:00Z');
 assert.equal(base.metrics.weight,undefined);assert.equal(next.profile.name,'Charlie Surf');assert.equal(next.metrics.weight?.value,80);assert.equal(next.goals.weight,75);assert.deepEqual(next.profile.days,['Mon','Fri']);assert.equal(next.intentions?.reason,'Surfing');assert.equal(next.coaching?.actions[0],'Walk after work');
});
test('review refuses unknown fields and invalid values',()=>{
 assert.throws(()=>applyInterviewDraft(createJourney(null),{'profile.name':answer('profile.name','Other')},[],[]));
 assert.throws(()=>applyInterviewDraft(createJourney(null),{'metrics.sleep':answer('metrics.sleep','99')},[],[]));
});
