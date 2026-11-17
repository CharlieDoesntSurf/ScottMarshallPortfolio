export default function FitCoachPage(){
 return <section className="fitcoach-portfolio" aria-label="Coach Teddy development app">
   <iframe className="fitcoach-app-frame" src={`${import.meta.env.BASE_URL}fitcoach/index.html?v=20261116-inline-checkin`} title="Coach Teddy (In Dev) — interactive web and phone app"/>
 </section>;
}
