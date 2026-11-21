export const interviewVersion='teddy-text-interview-2026-11-20';
export const phases=['goals','context','patterns','strengths','commitments','review'];
export const fields={
 'intentions.fitnessGoal':{label:'Fitness goal'},'intentions.reason':{label:'Reason'},'intentions.additionalInfo':{label:'Additional info'},
 'profile.goal':{label:'Training goal',options:['Build strength','Build muscle','Improve fitness','Build consistency']},
 'profile.experience':{label:'Experience',options:['Getting started','Some experience','Experienced']},
 'profile.minutes':{label:'Session length · min',min:15,max:90,integer:true},
 'profile.days':{label:'Training days',list:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']},
 'profile.equipment':{label:'Equipment',list:['Bodyweight','Dumbbells','Barbell','Cable','Machine']},
 'profile.limitations':{label:'Limitations'},'profile.motivation':{label:'Motivation'},
 'preferences.heightCm':{label:'Height · cm',min:50,max:260},'preferences.diet':{label:'Diet preference'},'preferences.foodNotes':{label:'Foods & restrictions'},'preferences.supplements':{label:'Usual supplements'},
 'daily.bedtime':{label:'Sleep time',time:true},'daily.wakeTime':{label:'Wake time',time:true},'daily.supplements':{label:'Supplements taken'},
 'coaching.typicalDay':{label:'Typical day'},'coaching.barriers':{label:'Obstacles'},'coaching.strengths':{label:'Strengths'},'coaching.ifThenPlan':{label:'If–then plan'},'coaching.checkInTime':{label:'Preferred check-in time'},
};
for(const [key,label,unit,min,max,integer] of [['weight','Weight','kg',20,400,false],['sleep','Sleep','hrs',0,24,false],['energy','Energy','/ 10',1,10,true],['bodyFat','Body fat','%',1,75,false],['soreness','Soreness','/ 10',0,10,true],['sleepQuality','Sleep quality','/ 10',1,10,true],['calories','Calories','kcal',0,15000,true],['protein','Protein','g',0,1000,true],['bmi','BMI','kg/m²',5,100,false]]){
 for(const group of ['metrics','goals'])fields[`${group}.${key}`]={label:`${group==='goals'?'Target ':''}${label} · ${unit}`,min,max,integer};
}
export function validField(field,value){const rule=fields[field];if(!rule||typeof value!=='string'||value.length>2000)return false;if(value==='')return true;if(rule.options)return rule.options.includes(value);if(rule.list)return value.split(',').every(x=>rule.list.includes(x.trim()));if(rule.time)return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);if(rule.min!=null){if(!value.trim())return false;const n=Number(value);return Number.isFinite(n)&&n>=rule.min&&n<=rule.max&&(!rule.integer||Number.isInteger(n));}return true;}
export function validatedProposal(output,messages){
 const latest=messages.at(-1);
 const supported=x=>latest?.role==='user'&&typeof x.quote==='string'&&x.quote.trim().length>0&&x.sourceMessageId===latest.id&&latest.content.includes(x.quote);
 const values=new Map();for(const item of output.fields||[])if(supported(item)&&validField(item.field,item.value))values.set(item.field,{field:item.field,value:item.value,quote:item.quote,sourceMessageId:item.sourceMessageId});
 const observations=new Map();for(const item of output.observations||[])if(supported(item)&&['label','context','behavior','outcome'].every(k=>typeof item[k]==='string'&&item[k].length<=1000)&&item.label.trim()&&item.behavior.trim()){const id=`${item.sourceMessageId}:${item.label.toLowerCase().trim()}`;observations.set(id,{id,label:item.label,context:item.context,behavior:item.behavior,outcome:item.outcome,quote:item.quote,sourceMessageId:item.sourceMessageId,status:'hypothesis',evidenceType:'model_hypothesis'});}
 return {fields:[...values.values()].slice(0,40),observations:[...observations.values()].slice(0,3)};
}
