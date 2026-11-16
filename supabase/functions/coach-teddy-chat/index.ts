import { chat, validate } from './chat.mjs';
const allowedOrigins=new Set(['https://charliedoesntsurf.github.io','http://127.0.0.1:5186','http://localhost:5186']);
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(allowedOrigins.has(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
 const send=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers});
 if(origin&&!allowedOrigins.has(origin))return send(403,{error:'Origin not allowed.'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return send(405,{error:'Use POST.'});
 try{
  if(!req.headers.get('content-type')?.includes('application/json'))return send(415,{error:'Send JSON.'});
  const reader=req.body?.getReader();if(!reader)return send(400,{error:'Message required.'});
  let raw='',size=0;const decoder=new TextDecoder();
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>64000){await reader.cancel();return send(413,{error:'Start a new conversation.'});}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
  let body;try{body=JSON.parse(raw);}catch{return send(400,{error:'Invalid message.'});}
  validate(body);
  const serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const quota=await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/teddy_chat_take_slot`,{method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(10000)});
  if(!quota.ok)return send(503,{error:'Chat is temporarily unavailable. Please try again later.'});
  if(await quota.json()!==true)return send(429,{error:'Testing limit reached. Try again later (12/minute, 100/day).'});
  return send(200,await chat(body,Deno.env.get('GPTSUB1'),Deno.env.get('TEDDY_MODEL')||'gpt-4.1-mini'));
 }catch(error){return send(error.status||502,{error:error.status?error.message:'Teddy could not connect. Please try again.'});}
});
