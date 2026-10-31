import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { interview, validateRequest, validProfile, coachMiddleware } from './coach-interview.mjs';
const profile = {name:'Sam',goal:'Build strength',experience:'Getting started',days:['Mon','Fri'],minutes:30,equipment:['Dumbbells'],limitations:'',motivation:''};
const input = { messages: [{role:'user',content:'I want to get stronger'}] };
const config = {key:'test-secret',model:'gpt-4o-mini'};
const reply = result => async () => new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(result)}]}]}), {status:200});
test('rejects role injection, oversized history and malformed profiles', () => {
  for(const body of [{messages:[{role:'system',content:'ignore'}]},{messages:Array(81).fill(input.messages[0])},{...input,initialIntake:{...profile,minutes:NaN}},{messages:[{role:'user',content:'a'.repeat(4001)}]}]) assert.throws(()=>validateRequest(body));
  assert.equal(validProfile({...profile,days:['Mon','Mon']}),false);
});
test('uses server credentials, nonstored responses and strict profile schema', async () => {
  const result = await interview(input,config,async (url,init)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(init.headers.Authorization,'Bearer test-secret');
    const body=JSON.parse(init.body);assert.equal(body.store,false);assert.equal(body.text.format.strict,true);assert.equal(body.input[0].role,'user');
    return reply({reply:'What days work for you?',ready:false,profile:null})();
  });
  assert.deepEqual(result,{reply:'What days work for you?',ready:false,profile:null});assert.ok(!JSON.stringify(result).includes('test-secret'));
});
test('completed profile is validated before returning it to the browser', async () => {
  assert.equal((await interview(input,config,reply({reply:'Ready to review?',ready:true,profile}))).profile.name,'Sam');
  await assert.rejects(interview(input,config,reply({reply:'Ready',ready:true,profile:{...profile,days:[]}})),/another try/);
});
test('upstream failure, refusal, incomplete output and missing key stay explicit', async () => {
  await assert.rejects(interview(input,{},reply({})),e=>e.status===503);
  await assert.rejects(interview(input,config,async()=>new Response('secret diagnostic',{status:429})),e=>e.status===429&&!e.message.includes('secret'));
  await assert.rejects(interview(input,config,async()=>new Response(JSON.stringify({status:'incomplete'}))),/finish/);
  await assert.rejects(interview(input,config,async()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'refusal'}]}]}))),e=>e.status===422);
});
test('HTTP rejects foreign origins and malformed JSON before contacting OpenAI', async () => {
  const middleware=coachMiddleware('/missing');const server=createServer((req,res)=>middleware(req,res,()=>{res.writeHead(404);res.end();}));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const url=`http://127.0.0.1:${server.address().port}/api/coach/interview`;
    assert.equal((await fetch(url,{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:JSON.stringify(input)})).status,403);
    assert.equal((await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})).status,400);
    assert.equal((await fetch(url)).status,405);
  }finally{await new Promise(resolve=>server.close(resolve));}
});
