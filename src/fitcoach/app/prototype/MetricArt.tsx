// Decorative line studies, never a substitute for a recorded measurement.
export function MetricArt({ index }: { index: number }) {
  return <svg className="journey-line-art" viewBox="0 0 200 70" fill="none" stroke="currentColor" strokeWidth=".8" aria-hidden="true">
    {index % 3 === 0 ? Array.from({length:7},(_,i)=><g key={i} transform={`translate(${44+i*15} ${28-Math.sin(i/6*Math.PI)*20})`}><path d="M0 5 8 0 16 5 8 10Z M0 5v30l8 5 8-5V5 M8 10v30"/></g>) : index % 3 === 1 ? Array.from({length:5},(_,i)=><ellipse key={i} cx="100" cy={34+i*3} rx={58-i*10} ry={23-i*3}/>) : Array.from({length:6},(_,i)=><path key={i} d={`M${50+i*18} 58V12l${36-i*5} 46V12Z`}/>)}
  </svg>;
}

