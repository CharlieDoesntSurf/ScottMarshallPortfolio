import { Download, Github, ArrowUpRight, BrainCircuit, Network, Layers } from 'lucide-react';
import resume from '../data/resume.json';
import ToolBeltPage from './ToolBeltPage';

export default function ResumePage() {
  return <article className="resume-page">
    <header className="resume-magazine">
      <div className="resume-magazine-title">
        <p className="resume-kicker">HONOLULU, HAWAII / RESUME</p>
        <h1>{resume.name}.</h1>
        <p className="resume-magazine-role">{resume.roles[0].title}</p>
        <div className="resume-magazine-actions">
          <a href={`${import.meta.env.BASE_URL}resume/scott-marshall-resume-september-2026.pdf`} download="Scott-Marshall-Resume-September-2026.pdf"><Download size={15}/> Download PDF</a>
          <a href="https://github.com/SpicyAIDev" target="_blank" rel="noreferrer"><Github size={15}/> GitHub <ArrowUpRight size={13}/></a>
        </div>
      </div>
      <div className="resume-magazine-details">
        <div className="resume-magazine-clearance"><span>CLEARANCE</span><strong className="resume-clearance-value">TS/SCI <small>(CURRENT)</small></strong></div>
        <address className="resume-contact-grid">
          <div><span className="resume-contact-label">ADDRESS</span><span>{resume.contact[0]}<br/>{resume.contact[1]}</span></div>
          <div><span className="resume-contact-label">PHONE</span><a href="tel:+13367078552">{resume.contact[2]}</a></div>
          <div className="resume-contact-wide"><span className="resume-contact-label">EMAIL</span><a href={`mailto:${resume.contact[3]}`}>{resume.contact[3]}</a></div>
          <div className="resume-contact-wide"><span className="resume-contact-label">UNCLASS EMAIL</span><a href="mailto:scott.m.marshall15.ctr@mail.mil">scott.m.marshall15.ctr@mail.mil</a></div>
          <div className="resume-contact-wide"><span className="resume-contact-label">UNCLASS LINE</span><a href="tel:+18084770125">(808)477-0125</a></div>
        </address>
      </div>
    </header>
    <ToolBeltPage embedded/>
    <section className="portfolio-explore" aria-labelledby="explore-title"><div className="portfolio-section-heading"><div><p className="portfolio-eyebrow">EXPLORE MY WORK</p><h2 id="explore-title">A few places to start.</h2></div></div><div className="portfolio-cards">
      {[
        { href: 'model-overview', title: 'Building LLM’s', icon: BrainCircuit, tone: 'violet' },
        { href: 'agents', title: 'How Agents Work', icon: Network, tone: 'cyan' },
        { href: 'benchmark-eval', title: 'My Architecture', icon: Layers, tone: 'amber' },
      ].map(({ href, title, icon: Icon, tone }) => <a key={href} className={`portfolio-card tone-${tone}`} href={`#${href}`}><Icon aria-hidden="true"/><h3>{title}<ArrowUpRight size={15}/></h3></a>)}
    </div></section>
    <div className="resume-layout"><div><section aria-labelledby="resume-experience"><h2 id="resume-experience" className="resume-section-title">Experience</h2>{resume.roles.map(role => <section className="resume-job" key={role.title}><p className="resume-dates">{role.dates}</p><h3>{role.title}</h3><p className="resume-organization">{role.organization}</p>{role.paragraphs.map(text => <p key={text}>{text}</p>)}{role.bullets.length > 0 && <ul>{role.bullets.map(text => <li key={text}>{text}</li>)}</ul>}</section>)}</section><section className="resume-education" aria-labelledby="resume-education"><h2 id="resume-education" className="resume-section-title">Education</h2><h3>{resume.education[0]}</h3><p className="resume-dates">{resume.education[1]}</p>{resume.education.slice(2).map(text => <p key={text}>{text}</p>)}</section></div><aside><section aria-labelledby="resume-skills"><h2 id="resume-skills" className="resume-section-title">Skills</h2><ul>{resume.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></section></aside></div>
    <div className="resume-download-footer"><a className="portfolio-primary" href={`${import.meta.env.BASE_URL}resume/scott-marshall-resume-september-2026.pdf`} download="Scott-Marshall-Resume-September-2026.pdf"><Download size={17}/> Download PDF</a></div>
  </article>;
}
