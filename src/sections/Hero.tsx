import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Photo, Asterisk } from '../components/UI';
export default function Hero() {
  return <section id="home" className="cover" aria-labelledby="hero-title">
    <div className="cover-meta meta"><span>ENGINEERING PORTFOLIO</span><span>CHENNAI, INDIA</span><span>EST. 2022</span></div>
    <h1 id="hero-title" aria-label="I. Kevin Joseph"><span className="hero-line" aria-hidden="true">{'I. KEVIN'.split('').map((letter,i) => <span className="hero-letter" key={i}>{letter === ' ' ? ' ' : letter}</span>)}</span><span className="hero-line" aria-hidden="true">{'JOSEPH'.split('').map((letter,i) => <span className="hero-letter" key={i}>{letter}</span>)}</span></h1>
    <Photo name="cover" alt="Monochrome geometric building facades, photographed as an architectural study" className="cover-photo" eager sizes="(max-width: 700px) 90vw, 55vw"/>
    <span className="cover-script script" aria-hidden="true">By design.</span><Asterisk className="cover-asterisk"/>
    <div className="cover-description"><span className="meta">SOLAR PV DESIGN ENGINEER<br/>MECHANICAL ENGINEERING</span><p>A mechanical mind.<br/>A renewable point of view.</p><a href="#projects" className="text-link">EXPLORE MY WORK <ArrowUpRight size={17}/></a></div>
    <div className="cover-bottom"><span className="meta">DESIGN. ENGINEER. MAKE IT MATTER.</span><a href="#about" className="scroll-link"><span className="meta">SCROLL TO DISCOVER</span><ArrowDown size={21}/></a><span className="meta">01 – 07</span></div>
  </section>;
}
