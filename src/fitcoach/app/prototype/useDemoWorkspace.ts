import {useEffect,useState} from 'react';
import type {Exercise,Intake,Routine,Session} from './data';
type Workspace={intake:Intake|null;sessions:Session[];active:Session|null;customExercises:Exercise[];customRoutines:Routine[]};
const KEY='fitcoach.portfolio.workspace.v1';
let state:Workspace={intake:null,sessions:[],active:null,customExercises:[],customRoutines:[]};
let catalog:{exercises:Exercise[];routines:Routine[]}|null=null;
let initialized=false;
function persist(){localStorage.setItem(KEY,JSON.stringify(state));}
function initialize(){if(initialized)return;const text=localStorage.getItem(KEY);if(text){const saved=JSON.parse(text);if(!Array.isArray(saved.sessions)||!Array.isArray(saved.customExercises)||!Array.isArray(saved.customRoutines))throw new Error('Could not read the saved demo. Export or clear this site’s storage to start again.');state=saved;}initialized=true;}
export async function api(path:string,body:any){
 initialize();
 if(path==='exercise'){
  const e:Exercise={id:crypto.randomUUID(),name:body.name.trim(),muscle:body.muscle,equipment:body.equipment,kind:body.kind,instructions:body.instructions,cue:body.instructions[0]||'',source:'custom'};
  state={...state,customExercises:[...state.customExercises,e]};persist();return e;
 }
 if(path==='workout'){
  const r:Routine={id:crypto.randomUUID(),name:body.name.trim(),subtitle:'Your own workout. Adjust each set to suit your session.',focus:'Your workout',minutes:45,color:'purple',exerciseIds:body.exerciseIds};
  state={...state,customRoutines:[...state.customRoutines,r]};persist();return {id:r.id};
 }
 throw new Error('This action is unavailable in the portfolio demo.');
}
export function useDemoWorkspace(){
 const [snapshot,setSnapshot]=useState<Workspace>(state),[exercises,setExercises]=useState<Exercise[]>([]),[routines,setRoutines]=useState<Routine[]>([]),[ready,setReady]=useState(false),[error,setError]=useState('');
 function commit(patch:Partial<Workspace>){state={...state,...patch};setSnapshot(state);try{persist();setError('');}catch{setError('Your browser could not save this change. Keep this page open and export your workspace.');}}
 async function refreshCatalog(){if(!catalog)return;setExercises([...catalog.exercises,...state.customExercises]);setRoutines([...catalog.routines,...state.customRoutines]);setSnapshot(state);}
 useEffect(()=>{let disposed=false;async function load(){try{initialize();if(!catalog){const response=await fetch(new URL('./catalog.json',document.baseURI));if(!response.ok)throw new Error('The exercise library could not load. Please reload to retry.');catalog=await response.json();}if(disposed)return;await refreshCatalog();setReady(true);setError('');}catch(e){if(!disposed)setError((e as Error).message);}}void load();return()=>{disposed=true;};},[]);
 return {exercises,routines,...snapshot,ready,error,pending:0,
  setActive:(s:Session|null)=>{if(!s&&state.active?.completedAt)commit({sessions:state.sessions.map(x=>x.id===state.active!.id?state.active!:x),active:null});else commit({active:s});},
  saveIntake:(intake:Intake)=>commit({intake}),
  edit:(session:Session)=>commit({active:session}),
  finish:()=>{if(!state.active)return;const saved={...state.active,completedAt:state.active.completedAt||new Date().toISOString(),status:'completed' as const};commit({sessions:[...state.sessions.filter(s=>s.id!==saved.id),saved],active:null});},
  retry:()=>commit({}),refreshCatalog};
}
