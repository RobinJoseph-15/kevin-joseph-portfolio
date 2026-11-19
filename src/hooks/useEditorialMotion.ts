import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// One entrance timeline per section; photographs have their own load-aware masks.
export function useEditorialMotion(reduced: boolean) {
  useLayoutEffect(() => {
    if (reduced) return;
    let live = true;
    const cleanups: (() => void)[] = [];
    const context = gsap.context(() => {});
    context.add(() => {
      const mobile = matchMedia('(max-width: 800px)').matches;
      const duration = mobile ? .5 : .85;
      const ease = 'power3.out';
      const rise = (timeline: gsap.core.Timeline, targets: gsap.TweenTarget, at: number, distance = 24) => {
        timeline.from(targets, { y: distance, opacity: 0, duration, stagger: mobile ? .035 : .07, ease }, at);
      };
      const hero = gsap.timeline({ defaults: { ease } });
      rise(hero, '.cover-meta > span', 0, 10);
      hero.from('.hero-letter', { yPercent: 110, rotate: 2, duration, stagger: mobile ? .018 : .032 }, .08);
      rise(hero, '.cover-description > *', .35);
      rise(hero, '.cover-script, .cover-asterisk', .65, 12);
      gsap.utils.toArray<HTMLElement>('main > .section').forEach((section, index) => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 82%', once: true } });
        rise(timeline, section.querySelectorAll('.section-label > span'), 0, 12);
        const lines = section.querySelectorAll('[data-heading] .line-inner');
        if (lines.length) timeline.from(lines, { yPercent: 105, x: index % 2 ? 8 : -8, duration, stagger: .08, ease }, .12);
        else rise(timeline, section.querySelectorAll('.about-first > span, .about-second'), .12, 30);
        // Long mobile sections reveal supporting groups only when they approach view.
        section.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
          gsap.from(element, { y: 24, opacity: 0, duration, ease, scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
        });
        rise(timeline, section.querySelectorAll('.contact-right > *, .experience-intro > *'), .45, 18);
        timeline.fromTo(section.querySelectorAll('.scribble path'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .95, stagger: .06, ease }, .65);
        timeline.from(section.querySelectorAll('.asterisk'), { rotation: -28, duration: 1.1, ease }, .6);
        if (!mobile) gsap.to(section.querySelector('.section-label'), { y: -8, opacity: .5, ease: 'none', scrollTrigger: { trigger: section, start: 'bottom 35%', end: 'bottom top', scrub: true } });
      });
      document.querySelectorAll<HTMLElement>('main .photo').forEach((photo, index) => {
        const img = photo.querySelector('img')!;
        let started = false;
        const reveal = () => {
          if (!live || started) return;
          started = true;
          context.add(() => {
            const timeline = gsap.timeline({ scrollTrigger: { trigger: photo, start: 'top 94%', once: true } });
            timeline.from(photo, { clipPath: index % 2 ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)', duration, ease: 'power3.inOut' });
            timeline.from(img, { scale: 1.08, duration: duration + .2, ease, clearProps: 'transform' }, 0);
            // Separate image translation from entrance scale and CSS hover scale.
            if (!mobile && photo.closest('[data-parallax]')) gsap.fromTo(photo, { y: -5 }, { y: 5, ease: 'none', scrollTrigger: { trigger: photo.parentElement, start: 'top bottom', end: 'bottom top', scrub: .7 } });
          });
        };
        if (img.complete && img.naturalWidth) reveal();
        else { img.addEventListener('load', reveal, { once: true }); cleanups.push(() => img.removeEventListener('load', reveal)); }
      });
      gsap.fromTo('.word-band-inner', { xPercent: 2 }, { xPercent: -8, ease: 'none', scrollTrigger: { trigger: '.word-band', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    document.fonts.ready.then(() => { if (live) ScrollTrigger.refresh(); });
    return () => { live = false; cleanups.forEach(cleanup => cleanup()); context.revert(); };
  }, [reduced]);
}
