import { ThemeToggle } from './Theme';
import { ArrowUpRight, Menu } from 'lucide-react';
import { navigation } from '../data/portfolio';
import { useOverlay } from './modal/Overlay';
export function Brand() {
  return <a className="brand" href="#home" aria-label="I. Kevin Joseph — home"><span>KJ<span className="brand-dot">.</span></span><span className="brand-caption">DESIGN<br/>ENGINEER</span></a>;
}
export default function Navigation({ active }: { active: string }) {
  const open = useOverlay();
  return <header className="header"><Brand/><nav className="desktop-navigation" aria-label="Main navigation">{navigation.map(([id,label]) => <a href={`#${id}`} key={id} aria-current={active === id ? 'location' : undefined}>{label}</a>)}</nav><a href="https://mail.google.com/mail/?view=cm&fs=1&to=kevinjoseph472001%40gmail.com" className="header-contact" target="_blank" rel="noopener noreferrer" aria-label="Let's talk - open Gmail compose in a new tab">LET’S TALK <ArrowUpRight size={17}/></a><button className="menu-toggle" aria-label="Open navigation" aria-haspopup="dialog" onClick={() => open({ kind: 'menu', title: 'Navigation', eyebrow: 'I. KEVIN JOSEPH / INDEX' })}><span>MENU</span><Menu size={22}/></button><ThemeToggle/></header>;
}
