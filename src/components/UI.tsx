import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="section-label"><span>[ {number} ]</span><span>{children}</span><span className="section-label-end">I. KEVIN JOSEPH</span></div>;
}
export function Photo({ name, alt, className = '', eager = false, sizes = '(max-width: 700px) 100vw, 60vw' }: { name: string; alt: string; className?: string; eager?: boolean; sizes?: string }) {
  return <div className={`photo ${className}`}><img src={`/images/editorial/${name}-1600.webp`} srcSet={`/images/editorial/${name}-640.webp 640w, /images/editorial/${name}-1600.webp 1600w`} sizes={sizes} alt={alt} width="1600" height="1200" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" /></div>;
}
export function Scribble({ className = '', circle = false }: { className?: string; circle?: boolean }) {
  return <svg className={`scribble ${className}`} viewBox={circle ? '0 0 400 170' : '0 0 400 40'} fill="none" aria-hidden="true" preserveAspectRatio="none"><path pathLength="1" d={circle ? 'M355 25C225-18 14 6 9 89c-8 76 240 88 352 41 99-43 10-124-115-124C90 6-19 77 27 125c42 43 276 48 352-22' : 'M3 28C97 5 255 4 394 13M47 36C164 14 264 13 378 22'} /></svg>;
}
export function Asterisk({ className = '' }: { className?: string }) {
  return <svg className={`asterisk ${className}`} viewBox="0 0 100 100" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <path key={i} d="M50 4V96" transform={`rotate(${i * 30} 50 50)`} />)}</svg>;
}
export function GmailLink({ className = '', children = 'LET’S TALK' }: { className?: string; children?: ReactNode }) {
  return <a className={`gmail-link ${className}`} href="https://mail.google.com/mail/?view=cm&fs=1&to=kevinjoseph472001%40gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Let's talk — open Gmail compose in a new tab">{children}<ArrowUpRight aria-hidden="true" /></a>;
}
