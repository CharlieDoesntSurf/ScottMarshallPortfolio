import test from 'node:test';
import assert from 'node:assert/strict';
import { createJourney, readingStatus, recordJourney, toIntake, weightProgress } from './journey.ts';

test('new profiles remain blank; existing interview answers are preserved', () => {
  const blank = createJourney(null);
  assert.equal(blank.profile.minutes, null);
  assert.deepEqual(blank.profile.days, []);
  assert.equal(toIntake(blank.profile), null);
  const intake = {name:'Test',goal:'Build strength',experience:'Experienced',days:['Mon'],minutes:45,equipment:['Bodyweight'] as const,limitations:'',motivation:''};
  const existing = {...intake,equipment:[...intake.equipment]};
  assert.deepEqual(toIntake(createJourney(existing).profile),existing);
});
test('editing profile does not refresh an old measurement', () => {
  const base=createJourney(null);
  base.metrics.sleep={value:7,at:'2026-10-01T12:00:00Z'};
  const next=recordJourney(base,{...base.profile,name:'Test'},base.goals,{},[],'2026-10-10T12:00:00Z');
  assert.deepEqual(next.metrics.sleep,base.metrics.sleep);
  assert.equal(readingStatus(next.metrics.sleep,1,Date.parse('2026-10-10T12:00:00Z')),'Update');
  assert.equal(readingStatus(undefined,7),'Add');
});
test('same-day weight corrections replace a point; later days append', () => {
  let state=createJourney(null);
  state=recordJourney(state,state.profile,state.goals,{weight:'80'},['weight'],'2026-10-10T12:00:00Z');
  state=recordJourney(state,state.profile,state.goals,{weight:'79.5'},['weight'],'2026-10-10T13:00:00Z');
  assert.equal(state.weightHistory.length,1);
  assert.equal(state.weightHistory[0].value,79.5);
  state=recordJourney(state,state.profile,state.goals,{weight:'78'},['weight'],'2026-10-11T13:00:00Z');
  assert.equal(state.weightHistory.length,2);
  assert.equal(weightProgress(state.weightHistory,76.5),50);
});
test('weight goals support gain, loss and no data without invented progress', () => {
  const values=(ns:number[])=>ns.map(value=>({value,at:'2026-10-10T12:00:00Z'}));
  assert.equal(weightProgress([],75),null);
  assert.equal(weightProgress(values([80,75]),70),50);
  assert.equal(weightProgress(values([70,75]),80),50);
  assert.equal(weightProgress(values([80,85]),70),0);
  assert.equal(weightProgress(values([80,65]),70),100);
});
test('invalid values are rejected; a zero soreness score is retained', () => {
  const base=createJourney(null);
  assert.throws(()=>recordJourney(base,base.profile,base.goals,{sleep:'25'},['sleep']));
  assert.throws(()=>recordJourney(base,base.profile,base.goals,{energy:'3.5'},['energy']));
  const next=recordJourney(base,base.profile,base.goals,{soreness:'0'},['soreness']);
  assert.equal(next.metrics.soreness?.value,0);
  assert.equal(readingStatus(next.metrics.soreness,1),'Current');
});

test('daily sleep and energy history preserves previous readings and replaces same-day corrections', () => {
  let state=createJourney(null);
  state=recordJourney(state,state.profile,{...state.goals,energy:8},{sleep:'7',energy:'6'},['sleep','energy'],'2026-11-12T20:00:00Z');
  state=recordJourney(state,state.profile,state.goals,{sleep:'8'},['sleep'],'2026-11-13T20:00:00Z');
  state=recordJourney(state,state.profile,state.goals,{sleep:'7.5'},['sleep'],'2026-11-13T21:00:00Z');
  assert.deepEqual(state.metricHistory?.sleep?.map(x=>x.value),[7,7.5]);
  assert.equal(state.metricHistory?.energy?.length,1);
  assert.equal(state.goals.energy,8);
});
