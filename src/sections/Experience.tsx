import { ArrowUpRight } from 'lucide-react';
import { SectionLabel, Scribble, Asterisk } from '../components/UI';
import { useOverlay } from '../components/modal/Overlay';
import { experience } from '../data/portfolio';
export default function Experience() {
  const open = useOverlay();
  return <section id="experience" className="section experience" aria-labelledby="experience-title"><SectionLabel number="05">THE PROFESSIONAL JOURNEY</SectionLabel><div className="experience-heading"><h2 id="experience-title" data-heading><span className="line-mask"><span className="line-inner">EXPERIENCE</span></span><span className="line-mask"><span className="line-inner">IN MOTION.</span></span></h2><Asterisk/><Scribble/></div>
    <div className="experience-intro"><span className="meta">CHENNAI, INDIA / 2022 — PRESENT</span><p>Built through collaboration.<br/>Refined through doing.</p></div>
    <div className="timeline">{experience.map((job,index) => <button className="experience-entry" key={job.company} aria-label={`View experience at ${job.company}`} aria-haspopup="dialog" data-reveal onClick={() => open({ title: job.company, eyebrow: 'PROFESSIONAL EXPERIENCE / CHENNAI', description: `${job.role} — ${job.discipline}`, metadata: [{ label: 'DURATION', value: job.date }, { label: 'LOCATION', value: 'Chennai, India' }], itemsTitle: 'RESPONSIBILITIES', items: job.responsibilities, skills: job.current ? ['3D design','AutoCAD','STAAD','PVsyst','Technical documentation'] : ['Solar design packages','Single-Line Diagrams','BOM Preparation','Team coordination'] })}><span className="experience-number">0{index+1}</span><span className="experience-date meta">{job.date}{job.current && <span className="current-tag">CURRENT</span>}</span><span className="experience-role"><strong>{job.company}</strong><span>{job.role}<br/>{job.discipline}</span></span><span className="experience-arrow"><ArrowUpRight/></span></button>)}</div>
    <div className="section-foot meta"><span>EXPLORE A ROLE FOR THE DETAILS.</span><span>DESIGN IS A CONTINUOUS PRACTICE.</span></div>
  </section>;
}
