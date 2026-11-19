import { ThemeProvider } from '../components/Theme';
import { MotionConfig } from 'framer-motion';
import Navigation from '../components/Navigation';
import { OverlayProvider } from '../components/modal/Overlay';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Expertise from '../sections/Expertise';
import Projects from '../sections/Projects';
import Experience from '../sections/Experience';
import Education from '../sections/Education';
import Contact from '../sections/Contact';
import { useActiveSection, useMedia } from '../hooks/usePreferences';
import { useEditorialMotion } from '../hooks/useEditorialMotion';
export default function App() {
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const active = useActiveSection();
  useEditorialMotion(reduced);
  return <MotionConfig reducedMotion="user"><ThemeProvider><OverlayProvider><div className="app"><a className="skip-link" href="#about">Skip to content</a><Navigation active={active}/><main><Hero/><About/><Expertise/><Projects/><Experience/><Education/><Contact/></main></div></OverlayProvider></ThemeProvider></MotionConfig>;
}
