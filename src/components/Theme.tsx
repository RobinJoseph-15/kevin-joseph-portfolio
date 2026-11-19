import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';
const key = 'kj-theme';
const ThemeContext = createContext<{ theme: Theme; busy: boolean; toggle: (button: HTMLButtonElement) => void }>({ theme: 'dark', busy: false, toggle: () => {} });
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const cancel = useRef<(() => void) | undefined>(undefined);
  const manual = useRef(false);
  const apply = (value: Theme) => {
    document.documentElement.dataset.theme = value;
    document.documentElement.style.colorScheme = value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#080808' : '#F5F0DC');
    setTheme(value);
  };
  useEffect(() => {
    try { manual.current = ['dark', 'light'].includes(localStorage.getItem(key) || ''); } catch { /* Storage may be unavailable. */ }
    const preference = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => { if (!manual.current && !locked.current) apply(preference.matches ? 'dark' : 'light'); };
    preference.addEventListener('change', sync);
    return () => { preference.removeEventListener('change', sync); cancel.current?.(); };
  }, []);

  const toggle = async (button: HTMLButtonElement) => {
    if (locked.current) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    manual.current = true;
    try { localStorage.setItem(key, next); } catch { /* Selection still works without storage. */ }
    const commit = () => flushSync(() => apply(next));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { commit(); return; }
    const rect = button.getBoundingClientRect();
    const x = rect.x + rect.width / 2, y = rect.y + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const frames = { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] };
    locked.current = true;
    setBusy(true);
    let animation: Animation | undefined;
    let transition: ViewTransition | undefined;
    let curtain: HTMLElement | undefined;
    const finish = () => { animation?.finish(); transition?.skipTransition(); };
    window.addEventListener('resize', finish, { once: true });
    cancel.current = finish;
    try {
      if (document.startViewTransition) {
        transition = document.startViewTransition(commit);
        await transition.ready;
        animation = document.documentElement.animate(frames, { duration: 900, easing: 'cubic-bezier(.22,.68,0,1)', pseudoElement: '::view-transition-new(root)' });
        await animation.finished;
        await transition.finished;
      } else {
        // Older engines: a new-color curtain covers the old page before committing.
        curtain = document.createElement('div');
        curtain.className = 'theme-curtain';
        curtain.style.background = next === 'dark' ? '#080808' : '#F5F0DC';
        curtain.setAttribute('popover', 'manual');
        document.body.append(curtain);
        curtain.showPopover?.();
        animation = curtain.animate(frames, { duration: 900, easing: 'cubic-bezier(.22,.68,0,1)', fill: 'forwards' });
        await animation.finished;
        commit();
      }
    } catch { commit(); transition?.skipTransition(); }
    finally {
      window.removeEventListener('resize', finish);
      animation?.cancel(); curtain?.remove(); cancel.current = undefined;
      locked.current = false; flushSync(() => setBusy(false));
      if (button.isConnected) button.focus({ preventScroll: true });
    }
  };
  return <ThemeContext.Provider value={{ theme, busy, toggle }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const { theme, busy, toggle } = useContext(ThemeContext);
  return <button className="theme-toggle" type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Current theme: ${theme}`} aria-pressed={theme === 'dark'} disabled={busy} onClick={event => void toggle(event.currentTarget)}>{theme === 'dark' ? <Moon size={19}/> : <Sun size={19}/>}</button>;
}
