import { useEffect, useState } from "react";
export function useMedia(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
export function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = [
      ...document.querySelectorAll<HTMLElement>("main > section[id]"),
    ];
    const update = () => {
      let current = sections[0]?.id || "home";
      for (const section of sections)
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.4)
          current = section.id;
      setActive(current);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return active;
}
