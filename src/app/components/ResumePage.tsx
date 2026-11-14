import { Download, Mail, Phone, MapPin, Github, ArrowUpRight, BrainCircuit, Network, Layers } from 'lucide-react';
import resume from '../data/resume.json';
import ToolBeltPage from './ToolBeltPage';

export default function ResumePage() {
  return <article className="resume-page">
    <header className="resume-profile">
      <div className="resume-introduction"><h1>{resume.name}</h1><p className="resume-role">{resume.roles[0].title}</p><p className="resume-summary">Building AI systems and the data foundations behind them.</p></div>
      <div className="resume-contact-block"><p className="resume-clearance">Clearance: TS/SCI (Current)</p><div className="resume-links">
        <a className="portfolio-primary" href={`${import.meta.env.BASE_URL}resume/scott-marshall-resume-september-2026.pdf`} download="Scott-Marshall-Resume-September-2026.pdf"><Download size={16}/> Download PDF</a>
        <a className="portfolio-primary" href="https://github.com/SpicyAIDev" target="_blank" rel="noreferrer"><Github size={16}/> GitHub <ArrowUpRight size={14}/></a>
      </div><address><span><MapPin size={14}/><span>{resume.contact[0]}<br/>{resume.contact[1]}</span></span><a href="tel:+13367078552"><Phone size={14}/>{resume.contact[2]}</a><a href={`mailto:${resume.contact[3]}`}><Mail size={14}/>{resume.contact[3]}</a><a className="resume-unclass" href="mailto:scott.m.marshall15.ctr@mail.mil"><Mail size={14}/><span>Unclass: scott.m.marshall15.ctr@mail.mil</span></a><a className="resume-unclass" href="tel:+18084770125"><Phone size={14}/><span>Unclass Line: (808)477-0125</span></a></address></div>
    </header>
    <ToolBeltPage embedded/>
    <section className="portfolio-explore" aria-labelledby="explore-title"><div className="portfolio-section-heading"><div><p className="portfolio-eyebrow">EXPLORE MY WORK</p><h2 id="explore-title">A few places to start.</h2></div></div><div className="portfolio-cards">
      {[
        { href: 'model-overview', title: 'Building LLM’s', icon: BrainCircuit, tone: 'violet', text: 'From tokens to training: explore how language models work.' },
        { href: 'agents', title: 'How Agents Work', icon: Network, tone: 'cyan', text: 'Prompts, context, tools, and the harness around a model.' },
        { href: 'benchmark-eval', title: 'My Architecture', icon: Layers, tone: 'amber', text: 'Explore my approach to agent design and evaluation.' },
      ].map(({ href, title, icon: Icon, tone, text }) => <a key={href} className={`portfolio-card tone-${tone}`} href={`#${href}`}><Icon aria-hidden="true"/><h3>{title}<ArrowUpRight size={15}/></h3><p>{text}</p></a>)}
    </div></section>
    <div className="resume-layout"><div><section aria-labelledby="resume-experience"><h2 id="resume-experience" className="resume-section-title">Experience</h2>{resume.roles.map(role => <section className="resume-job" key={role.title}><p className="resume-dates">{role.dates}</p><h3>{role.title}</h3><p className="resume-organization">{role.organization}</p>{role.paragraphs.map(text => <p key={text}>{text}</p>)}{role.bullets.length > 0 && <ul>{role.bullets.map(text => <li key={text}>{text}</li>)}</ul>}</section>)}</section><section className="resume-education" aria-labelledby="resume-education"><h2 id="resume-education" className="resume-section-title">Education</h2><h3>{resume.education[0]}</h3><p className="resume-dates">{resume.education[1]}</p>{resume.education.slice(2).map(text => <p key={text}>{text}</p>)}</section></div><aside><section aria-labelledby="resume-skills"><h2 id="resume-skills" className="resume-section-title">Skills</h2><ul>{resume.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></section></aside></div>
    <div className="resume-download-footer"><p>Keep a copy of my resume.</p><a className="portfolio-primary" href={`${import.meta.env.BASE_URL}resume/scott-marshall-resume-september-2026.pdf`} download="Scott-Marshall-Resume-September-2026.pdf"><Download size={17}/> Download PDF</a></div>
  </article>;
}
