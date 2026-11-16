import { chat } from './chat.mjs';
const allowedOrigins=new Set(['https://charliedoesntsurf.github.io','http://127.0.0.1:5186','http://localhost:5186']);
const buckets=new Map<string,{at:number,count:number}>();
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(allowedOrigins.has(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
 const send=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers});
 if(origin&&!allowedOrigins.has(origin))return send(403,{error:'Origin not allowed.'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return send(405,{error:'Use POST.'});
 try{
  const bearer=req.headers.get('authorization');
  if(!bearer?.startsWith('Bearer '))return send(401,{error:'Sign in to chat with Teddy.'});
  const auth=await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`,{headers:{apikey:Deno.env.get('SUPABASE_ANON_KEY')!,Authorization:bearer},signal:AbortSignal.timeout(10000)});
  if(!auth.ok)return send(401,{error:'Please sign in again.'});
  const user=await auth.json();
  if(!Deno.env.get('TEDDY_OWNER_ID')||user.id!==Deno.env.get('TEDDY_OWNER_ID'))return send(403,{error:'This is a private Coach Teddy workspace.'});
  const now=Date.now(),bucket=buckets.get(user.id);
  if(bucket&&now-bucket.at<60000){if(++bucket.count>12)return send(429,{error:'Please wait a minute before sending more messages.'});}else buckets.set(user.id,{at:now,count:1});
  if(!req.headers.get('content-type')?.includes('application/json'))return send(415,{error:'Send JSON.'});
  const reader=req.body?.getReader();if(!reader)return send(400,{error:'Message required.'});
  let raw='',size=0;const decoder=new TextDecoder();
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>64000){await reader.cancel();return send(413,{error:'Start a new conversation.'});}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();
  let body;try{body=JSON.parse(raw);}catch{return send(400,{error:'Invalid message.'});}
  return send(200,await chat(body,Deno.env.get('GPTSUB1'),Deno.env.get('TEDDY_MODEL')||'gpt-4.1-mini'));
 }catch(error){return send(error.status||502,{error:error.status?error.message:'Teddy could not connect. Please try again.'});}
});
