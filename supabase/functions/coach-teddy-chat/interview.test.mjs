import test from 'node:test';
import assert from 'node:assert/strict';
import {interview} from './interview.mjs';
import {validatedProposal,validField} from '../../../src/fitcoach/app/prototype/interview-contract.mjs';
const messages=[{id:'a',role:'user',content:'I weigh 80 kg. After late meetings I skip my walk.'}];
const field={field:'metrics.weight',value:'80',quote:'I weigh 80 kg',sourceMessageId:'a'};
test('rejects unsupported evidence, unknown fields and out-of-range values',()=>{
 const result=validatedProposal({fields:[field,{...field,field:'profile.name'},{...field,value:'900'},{...field,sourceMessageId:'old'},{...field,quote:'invented'}]},messages);
 assert.deepEqual(result.fields,[field]);assert.equal(validField('metrics.sleep',' '),false);
});
test('observations stay hypotheses even if model claims confirmation',()=>{
 const o={label:'Late meeting',context:'After a meeting',behavior:'Skips walk',outcome:'Unknown',quote:'After late meetings I skip my walk.',sourceMessageId:'a',status:'user_confirmed'};
 assert.equal(validatedProposal({observations:[o]},messages).observations[0].status,'hypothesis');
});
test('interview uses strict Responses schema and preserves evidence ids',async()=>{
 const response=await interview({messages},'test-key','test-model',async(url,options)=>{
  const body=JSON.parse(options.body);assert.equal(body.store,false);assert.equal(body.text.format.strict,true);assert.match(body.input[0].content,/"id":"a"/);
  return Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({reply:'What helps you make time?',phase:'context',ready:false,fields:[field],observations:[],actions:[]})}]}]});
 });assert.deepEqual(response.fields,[field]);
});
test('refusal cannot persist inferred facts',async()=>{
 const response=await interview({messages},'test',undefined,async()=>Response.json({status:'completed',output:[{type:'message',content:[{type:'refusal'}]}]}));assert.deepEqual(response.fields,[]);assert.equal(response.ready,false);
});
