export default function FitCoachPage(){
 return <section className="fitcoach-portfolio" aria-label="Coach Teddy development app">
   <iframe className="fitcoach-app-frame" src={`${import.meta.env.BASE_URL}fitcoach/index.html`} title="Coach Teddy (In Dev) — interactive web and phone app"/>
 </section>;
}
