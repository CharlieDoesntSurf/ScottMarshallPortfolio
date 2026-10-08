export default function FitCoachPage(){
 return <section className="fitcoach-portfolio" aria-label="FitCoach development app">
   <iframe className="fitcoach-app-frame" src={`${import.meta.env.BASE_URL}fitcoach/index.html`} title="FitCoach (In Dev) — interactive web and phone app"/>
 </section>;
}
