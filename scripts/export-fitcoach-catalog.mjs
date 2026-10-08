// Only public upstream catalog/template records. Never export the connected user workspace.
import {readFile,writeFile} from 'node:fs/promises';
const d=JSON.parse(await readFile('/Users/scott/project/Fitnesstrackingapp/.import-cache/opengym.json','utf8'));
const title=s=>s.replace(/\b\w/g,c=>c.toUpperCase());
const media=`https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@${d.mediaRevision}`;
const exercises=d.exercises.map(e=>({id:e.id,sourceId:e.source_id,name:title(e.name),muscle:title(e.muscle_group),equipment:({'body weight':'Bodyweight',dumbbell:'Dumbbells'}[e.equipment_type]||title(e.equipment_type)),kind:e.tracking_mode,cue:e.instructions[0]||'',instructions:e.instructions,primaryMuscles:e.primary_muscles,secondaryMuscles:e.secondary_muscles,image:`${media}/images/${e.raw_data.img}`,animation:`${media}/videos/${e.raw_data.gif}`,source:'opengym'}));
const routines=d.plans.flatMap(p=>p.routines.map((r,i)=>({id:r.id,name:r.name,subtitle:'openGym starter template. Set your own starting weights.',focus:p.name,minutes:45,color:i%3?'purple':'pink',exerciseIds:r.ex.map(e=>e.id),targets:r.ex.map(e=>({exerciseId:e.id,sets:e.sets,reps:e.reps||0,weightKg:e.weight||0,seconds:e.sec||30}))})));
await writeFile('public/fitcoach/catalog.json',JSON.stringify({exercises,routines,sourceRevision:d.sourceRevision,mediaRevision:d.mediaRevision}));
console.log(`Exported ${exercises.length} public exercises and ${routines.length} templates; no user records.`);
