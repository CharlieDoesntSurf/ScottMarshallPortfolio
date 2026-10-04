import { useEffect, useMemo, useRef, useState } from 'react';
export type Player = {id:string;season:number;name:string;team:string;abbr:string;position:string;league:string;ops:number;pa:number;rate:number;bats:string;bwar:number;color:string;fieldPosition?:string};
type ChartDatum = {id:string;name:string;team:string;abbr:string;position:string;ops:number;actualOps?:number;labelSuffix?:string;color?:string};
type Mark<T> = T & {x:number;y:number;lines:string[];labelTop:number;labelHeight:number;prefix:number;labelX:number;side:'left'|'right'};
const ORDER=['C','1B','2B','3B','SS','LF','CF','RF','DH','PH','PR','P'];
function wrap(text:string,width:number,measure:CanvasRenderingContext2D){
  const lines:string[]=[];let line='';
  for(const word of text.split(' ')){const next=line?line+' '+word:word;if(line&&measure.measureText(next).width>width){lines.push(line);line=word;}else line=next;}
  if(line)lines.push(line);return lines;
}
function Panel<T extends ChartDatum>({players,positions,width,domain,onSelect,compressed=false,metric='OPS',twoSidedLabels=false,sharedCount=0}:{players:T[];positions:string[];width:number;domain:[number,number];onSelect:(p:T)=>void;compressed?:boolean;metric?:string;twoSidedLabels?:boolean;sharedCount?:number}){
 const layout=useMemo(()=>{
  const m={left:62,right:12,top:36,bottom:66};const lane=(width-m.left-m.right)/positions.length;
  const measure=document.createElement('canvas').getContext('2d')!;measure.font='12px Inter, system-ui, sans-serif';
  const groups=positions.map(pos=>players.filter(p=>p.position===pos).sort((a,b)=>b.ops-a.ops||a.name.localeCompare(b.name)).map(p=>{
   const actual=p.actualOps!==undefined&&p.actualOps!==p.ops?` · ${p.actualOps.toFixed(metric==='OPS'?3:metric==='ERA'?2:1)}`:'';
   const lines=wrap(p.name+' · '+p.abbr+actual+(p.labelSuffix?' · '+p.labelSuffix:''),twoSidedLabels?Math.max(88,lane/2-36):lane-42,measure);return {...p,lines,labelHeight:lines.length*15+5,x:0,y:0,labelTop:0,prefix:0,labelX:0,side:'right'} as Mark<T>;
  }));
  const innerHeight=twoSidedLabels?Math.max(520,Math.ceil(Math.max(sharedCount,players.length)/2)*36+32):Math.max(440,...groups.map(g=>g.reduce((sum,p)=>sum+p.labelHeight,0)*1.6+32));
  const transform=(v:number)=>compressed&&v>1?1+(v-1)/5:v;
  const y=(value:number)=>m.top+10+(transform(domain[1])-transform(value))/(transform(domain[1])-transform(domain[0]))*(innerHeight-20);
  groups.forEach((group,i)=>{
   const center=m.left+i*lane+(twoSidedLabels?lane/2:Math.min(24,lane*.22));const placed:Mark<T>[]=[];
   const blocksBySide:{start:number;end:number;sum:number;count:number;mean:number}[][]=[[],[]];const prefixBySide=[0,0];
   group.forEach((p,j)=>{
    const side: 'left'|'right'=twoSidedLabels&&j%2?'left':'right';const sideIndex=side==='left'?0:1;
    p.side=side;p.y=y(p.ops);p.labelX=side==='left'?center-12:center+12;p.prefix=prefixBySide[sideIndex];
    const offset=[0,-10,10,-20,20].find(dx=>placed.every(a=>Math.hypot(center+dx-a.x,p.y-a.y)>=9.5))??20;
    p.x=center+offset;placed.push(p);
    const blocks=blocksBySide[sideIndex];const desired=p.y-(p.labelHeight-5)/2-p.prefix;blocks.push({start:j,end:j,sum:desired,count:1,mean:desired});
    while(blocks.length>1&&blocks.at(-2)!.mean>blocks.at(-1)!.mean){const b=blocks.pop()!,a=blocks.pop()!;blocks.push({start:a.start,end:b.end,sum:a.sum+b.sum,count:a.count+b.count,mean:(a.sum+b.sum)/(a.count+b.count)});}
    prefixBySide[sideIndex]+=p.labelHeight;
   });
   blocksBySide.forEach((blocks,sideIndex)=>{const low=m.top+8,high=m.top+innerHeight-8-prefixBySide[sideIndex];blocks.forEach(b=>{const v=Math.max(low,Math.min(high,b.mean));for(let j=b.start;j<=b.end;j++)if(group[j].side===(sideIndex===0?'left':'right'))group[j].labelTop=v+group[j].prefix;});});
  });
  const step=metric==='OPS'?.1:Math.max(1,Math.ceil((domain[1]-domain[0])/12));
  const ticks:number[]=[];for(let v=Math.ceil(domain[0]/step)*step;v<=domain[1];v+=step)(!compressed||v<1.001||Math.abs(v*2-Math.round(v*2))<.001)&&ticks.push(Number(v.toFixed(1)));
  return {m,lane,innerHeight,y,ticks,marks:groups.flat(),height:innerHeight+m.top+m.bottom};
 },[players,positions,width,domain,compressed,metric,twoSidedLabels,sharedCount]);
 const {m,lane,innerHeight,y,ticks,marks,height}=layout;
 return <svg className="position-chart" viewBox={`0 0 ${width} ${height}`} height={height} role="group" aria-label={`${positions.join(', ')} — regular-season ${metric}`}>
  <title>{positions.join(', ')} — {metric}</title>
  <desc>Team-colored dots show values within the axis range; edge labels report actual out-of-range values. Lines connect displaced labels. Focus or select a player for details.</desc>
  <rect className="chart-frame" x={m.left} y={m.top} width={width-m.left-m.right} height={innerHeight}/>
  {ticks.map(t=><g key={t}><line className="chart-grid" x1={m.left} x2={width-m.right} y1={y(t)} y2={y(t)}/><text className="chart-tick" x={m.left-10} y={y(t)+4} textAnchor="end">{t.toFixed(metric==='OPS'?3:metric==='ERA'?1:0)}</text></g>)}
  {compressed&&domain[1]>1&&<g><line x1={m.left} x2={width-m.right} y1={y(1)} y2={y(1)} stroke="#c4b6ff" strokeDasharray="6 4"/><title>OPS above this 1.000 line uses a five-times compressed scale.</title></g>}
  <text className="axis-title" transform={`translate(15,${m.top+innerHeight/2}) rotate(-90)`} textAnchor="middle">{metric}</text>
  <text className="axis-title" x={(m.left+width-m.right)/2} y={height-10} textAnchor="middle">Comparison group</text>
  {positions.map((pos,i)=>{const x=m.left+i*lane+(twoSidedLabels?lane/2:Math.min(24,lane*.22));return <g key={pos}>{i>0&&<line className="chart-divider" x1={m.left+i*lane} x2={m.left+i*lane} y1={m.top} y2={m.top+innerHeight}/>}<text className="position-title" x={x} y={m.top-14} textAnchor="middle">{pos}</text><text className="position-title" x={x} y={m.top+innerHeight+25} textAnchor="middle">{pos}</text></g>})}
  {marks.map(p=><g className="player-mark" key={p.id+'-'+p.position} role="button" tabIndex={0} aria-label={`${p.name}, ${p.team}, ${p.position}, ${metric} ${(p.actualOps??p.ops).toFixed(metric==='OPS'?3:2)}`} onClick={()=>onSelect(p)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(p);}}}>
   <path className="label-leader" d={`M${p.x+(p.side==='left'?-5:5)},${p.y}L${p.labelX+(p.side==='left'?7:-7)},${p.labelTop+(p.labelHeight-5)/2}`}/>
   <circle className="player-dot" data-player={p.id} cx={p.x} cy={p.y} r={4.7} fill={p.color}/>
   <text className="player-label" x={p.labelX} y={p.labelTop+12} textAnchor={p.side==='left'?'end':'start'}>{p.lines.map((line,i)=><tspan x={p.labelX} dy={i?15:0} key={i}>{line}</tspan>)}</text>
   <rect className="label-hit" x={p.side==='left'?p.labelX-(twoSidedLabels?lane/2-18:lane-42):p.labelX-5} y={p.labelTop-2} width={twoSidedLabels?lane/2-18:lane-42} height={p.labelHeight} fill="transparent"/>
  </g>)}
 </svg>;
}
export function PositionPlot<T extends ChartDatum>({players,domain,onSelect,order=ORDER,compressed=false,metric='OPS',twoSidedLabels=false,sharedCount=0}:{players:T[];domain:[number,number];onSelect:(p:T)=>void;order?:string[];compressed?:boolean;metric?:string;twoSidedLabels?:boolean;sharedCount?:number}){
 const ref=useRef<HTMLDivElement>(null);const [width,setWidth]=useState(0);
 useEffect(()=>{const el=ref.current!;const observer=new ResizeObserver(()=>setWidth(Math.floor(el.getBoundingClientRect().width)));observer.observe(el);return()=>observer.disconnect();},[]);
 const positions=order.filter(pos=>players.some(p=>p.position===pos));
 const columns=Math.max(1,Math.min(6,Math.floor((width-74)/210)));const groups:string[][]=[];
 for(let i=0;i<positions.length;i+=columns)groups.push(positions.slice(i,i+columns));
 return <div ref={ref} className="position-plots">{width>0&&groups.map(group=><Panel key={group.join('-')} players={players} positions={group} width={twoSidedLabels?Math.max(620,width):width} domain={domain} onSelect={onSelect} compressed={compressed} metric={metric} twoSidedLabels={twoSidedLabels} sharedCount={sharedCount}/>)}</div>;
}
