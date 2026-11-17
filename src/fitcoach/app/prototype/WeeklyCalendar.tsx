import { useState } from 'react';
import { weekDays } from './data';
export function WeeklyCalendar({days}:{days:string[]}) {
 const today=new Date(),start=new Date(today);start.setDate(today.getDate()-(today.getDay()+6)%7);
 const end=new Date(start);end.setDate(end.getDate()+6);
 const [selected,setSelected]=useState((today.getDay()+6)%7);
 return <section className="card week-card week-hero journey-calendar" aria-label="Your week"><div className="section-top"><h3>Your week</h3><span className="muted">{start.toLocaleDateString(undefined,{month:'short',day:'numeric'})} – {end.toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span></div><div className="week-days">{weekDays.map((day,i)=>{const date=new Date(start);date.setDate(date.getDate()+i);return <button type="button" key={day} className={selected===i?'selected':''} aria-pressed={selected===i} aria-label={date.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})} onClick={()=>setSelected(i)}><span>{day[0]}</span><b>{date.getDate()}</b><i className={days.includes(day)?'planned':''}/></button>})}</div></section>;
}
