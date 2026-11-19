import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionLabel, Photo, Scribble } from '../components/UI';
import { useOverlay } from '../components/modal/Overlay';
import { projects } from '../data/portfolio';
const imageDescriptions = ['Aerial photograph of rows of ground-mounted solar panels', 'Close-up photograph of rooftop photovoltaic panels', 'Structural steel reference photograph illustrating support geometry', 'Camper and portable solar equipment in an outdoor setting', 'Portable battery power station used as a storage reference'];
const projectSkills = [['AutoCAD','SketchUp','STAAD','PVsyst'],['AutoCAD','PVsyst','Single-Line Diagrams'],['SolidWorks','CATIA','Mechanical modelling'],['SketchUp','AutoCAD','BOM Preparation'],['Mechanical modelling','BOM Preparation','Technical Reports']];
export default function Projects() {
  const open = useOverlay();
  return <section id="projects" className="section projects" aria-labelledby="projects-title"><SectionLabel number="04">SYSTEMS & POSSIBILITIES</SectionLabel>
    <div className="projects-heading"><h2 id="projects-title" data-heading><span className="line-mask"><span className="line-inner">SELECTED</span></span><span className="line-mask"><span className="line-inner">PROJECTS</span></span><Scribble circle/></h2><div><span className="script">A renewable perspective.</span><p>Five engineering categories.<br/>An exploration of energy, structure<br/>and the spaces in between.</p><span className="meta">SOLAR DESIGN / ENERGY SYSTEMS</span></div></div>
    <div className="project-grid">{projects.map((project,index) => <article className={`project-card project-${project.id}`} key={project.id} data-reveal><motion.button className="project-open" aria-label={`Explore ${project.title}`} aria-haspopup="dialog" whileTap={{ scale: 0.995 }} onClick={() => open({ title: project.title, eyebrow: `CATEGORY ${project.number} / RENEWABLE ENERGY`, image: project.image, imageAlt: imageDescriptions[index], description: project.description, itemsTitle: 'DESIGN FOCUS', items: project.focus, skills: projectSkills[index], metadata: [{ label: 'CATEGORY', value: project.title }] })}><div className="project-image"><Photo name={project.image} alt={imageDescriptions[index]}/><span className="project-number">{project.number}</span><span className="project-arrow"><ArrowUpRight/></span></div><div className="project-caption"><h3>{project.title}</h3><span className="meta">{['SITE & STRUCTURE','BUILDING INTEGRATION','MOVEMENT & MECHANICS','COMPACT SYSTEMS','ENERGY STORAGE'][index]}</span></div></motion.button></article>)}</div>

  </section>;
}
