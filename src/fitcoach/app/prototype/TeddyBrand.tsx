export function TeddyBear() {
  return <svg viewBox="0 0 170 140" aria-hidden="true" className="teddy-bear">
    <circle cx="30" cy="30" r="30" fill="currentColor"/><circle cx="140" cy="30" r="30" fill="currentColor"/>
    <circle cx="30" cy="30" r="12" fill="var(--teddy-cutout, #ff4fa3)"/><circle cx="140" cy="30" r="12" fill="var(--teddy-cutout, #ff4fa3)"/>
    <rect x="25" y="25" width="120" height="106" rx="50" fill="currentColor"/>
    <g fill="var(--teddy-cutout, #ff4fa3)"><ellipse cx="63" cy="72" rx="5" ry="7"/><ellipse cx="108" cy="72" rx="5" ry="7"/><ellipse cx="85" cy="99" rx="12" ry="9"/></g>
  </svg>;
}
export function TeddyBrand() { return <span className="teddy-brand"><TeddyBear/><span>COACH<br/>TEDDY</span></span>; }
