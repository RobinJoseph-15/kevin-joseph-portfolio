import { ThemeToggle } from '../Theme';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { navigation } from '../../data/portfolio';
import { useMedia } from '../../hooks/usePreferences';
import { Photo } from '../UI';
export interface OverlayContent {
  kind?: 'detail' | 'menu'; title: string; eyebrow: string; description?: string;
  image?: string; imageAlt?: string; metadata?: { label: string; value: string }[];
  items?: string[]; itemsTitle?: string; skills?: string[]; note?: string;
}
const OverlayContext = createContext<(content: OverlayContent) => void>(() => {});
export function useOverlay() { return useContext(OverlayContext); }
export function OverlayProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<OverlayContent | null>(null);
  const [closing, setClosing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const open = useCallback((value: OverlayContent) => { setClosing(false); setContent(value); }, []);
  const close = useCallback(() => {
    if (closing) return;
    if (reduced) { setContent(null); return; }
    setClosing(true);
    closeTimer.current = window.setTimeout(() => { setContent(null); setClosing(false); }, 180);
  }, [closing, reduced]);
  useEffect(() => {
    if (!content) return;
    const element = dialog.current!;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    element.querySelector<HTMLButtonElement>('.close-button')?.focus({ preventScroll: true });
    element.scrollTop = 0;
    return () => { element.close(); document.body.style.overflow = overflow; if (opener?.isConnected) opener.focus({ preventScroll: true }); };
  }, [content]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  return <OverlayContext.Provider value={open}>{children}<dialog ref={dialog} className={`editorial-overlay ${content?.kind === 'menu' ? 'menu-overlay' : ''} ${closing ? 'is-closing' : ''}`} aria-labelledby="overlay-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    {content && <div className="overlay-panel"><div className="overlay-top"><span className="meta">{content.eyebrow}</span><ThemeToggle/><button className="close-button" onClick={close} aria-label="Close overlay" autoFocus><span>CLOSE</span><X size={23}/></button></div>
      {content.kind === 'menu' ? <><h2 id="overlay-title" className="sr-only">Navigation</h2><nav className="overlay-navigation" aria-label="Mobile navigation">{navigation.map(([id, label], index) => <a key={id} href={`#${id}`} onClick={close}><span className="meta">0{index + 1}</span>{label}<ArrowUpRight /></a>)}</nav><div className="menu-bottom meta">CHENNAI, INDIA <span>DESIGN WITH PURPOSE.</span></div></> : <>
      <h2 id="overlay-title">{content.title}</h2><div className="overlay-rule"/>
      {content.image && <Photo name={content.image} alt={content.imageAlt || 'Engineering category photograph'} className="overlay-photo" eager sizes="(max-width: 700px) 100vw, 85vw"/>}
      <div className="overlay-body"><div>{content.description && <p className="overlay-description">{content.description}</p>}{content.metadata && <dl className="overlay-metadata">{content.metadata.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}{content.note && <p className="overlay-note">{content.note}</p>}</div>
      <div>{content.items && <><h3>{content.itemsTitle || 'A CLOSER LOOK'}</h3><ul className="overlay-list">{content.items.map(item => <li key={item}>{item}</li>)}</ul></>}{content.skills && <><h3>RELATED TOOLS & SKILLS</h3><div className="overlay-tags">{content.skills.map(skill => <span key={skill}>{skill}</span>)}</div></>}</div></div>
      <div className="overlay-bottom meta"><span>I. KEVIN JOSEPH / ENGINEERING PORTFOLIO</span><button onClick={close}>BACK TO THE PORTFOLIO <ArrowUpRight size={16}/></button></div>
      </>}
    </div>}
  </dialog></OverlayContext.Provider>;
}
