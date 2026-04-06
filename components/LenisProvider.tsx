'use client';

import { useEffect } from 'react';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let rafId = 0;

    function start() {
      import('lenis').then((mod) => {
        const Lenis = mod.default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          smoothWheel: true,
        });

        function raf(time: number) {
          lenis!.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
      });
    }

    // On the homepage, wait for the hero animation to be ready before
    // enabling smooth scroll so Lenis doesn't fight the intro sequence.
    // On every other page, start immediately.
    if (window.location.pathname === '/') {
      const onHeroReady = () => start();
      window.addEventListener('hero-ready', onHeroReady, { once: true });
      // Fallback: if hero-ready never fires (e.g. cached page), start after 4s
      const fallback = setTimeout(start, 4000);
      return () => {
        window.removeEventListener('hero-ready', onHeroReady);
        clearTimeout(fallback);
        cancelAnimationFrame(rafId);
        if (lenis) lenis.destroy();
      };
    }

    start();

    return () => {
      cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
